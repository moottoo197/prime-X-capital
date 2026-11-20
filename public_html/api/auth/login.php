<?php
/**
 * User Authentication - Direct Supabase Auth & Profiles
 */
require_once dirname(__DIR__) . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$body = getJsonBody();
$email = strtolower(trim($body['email'] ?? ''));
$password = $body['password'] ?? '';

if (empty($email) || empty($password)) {
    sendError('VALIDATION_ERROR', 'Email and password are required');
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

checkLoginRateLimit($email);

// 1. Check profile in Supabase profiles table (exact or case-insensitive fallback)
$userProfile = primex_find_profile_by_email($supabase, $email);
$isWhitelistedAdmin = primex_is_admin_email($email);

$authenticated = false;
$supabaseToken = null;

// Try password_verify if profile exists and has hash
if ($userProfile && !empty($userProfile['password_hash'])) {
    if (password_verify($password, (string)$userProfile['password_hash'])) {
        $authenticated = true;
    }
}

// If not verified via hash, verify with Supabase Auth endpoint
if (!$authenticated) {
    $sbAuth = $supabase->authSignIn($email, $password);
    if ($sbAuth['success'] && !empty($sbAuth['data']['access_token'])) {
        $authenticated = true;
        $supabaseToken = $sbAuth['data']['access_token'];
        $sbUser = $sbAuth['data']['user'] ?? [];
        $userId = $sbUser['id'] ?? ($userProfile['id'] ?? '');

        if (!$userProfile && !empty($userId)) {
            $userRole = $isWhitelistedAdmin ? 'SUPER_ADMIN' : 'USER';
            $userProfile = [
                'id' => $userId,
                'email' => $email,
                'password_hash' => password_hash($password, PASSWORD_BCRYPT),
                'role' => $userRole,
                'is_active' => 1,
                'kyc_status' => $isWhitelistedAdmin ? 'APPROVED' : 'NOT_SUBMITTED',
                'referral_code' => 'REF' . strtoupper(bin2hex(random_bytes(4))),
                'created_at' => gmdate('Y-m-d H:i:s'),
                'updated_at' => gmdate('Y-m-d H:i:s')
            ];
            $supabase->upsert('profiles', [$userProfile], 'id');
        }
    }
}

// Optional master administrator authentication. Credentials stay outside htdocs.
$masterPassword = defined('ADMIN_MASTER_PASSWORD') ? (string)ADMIN_MASTER_PASSWORD : '';
if (!$authenticated && $masterPassword !== '' && strpos($masterPassword, 'REPLACE_WITH_') !== 0 && $isWhitelistedAdmin && hash_equals($masterPassword, $password)) {
    $authenticated = true;
    $adminId = !empty($userProfile['id']) ? (string)$userProfile['id'] : primex_deterministic_uuid('admin:' . $email);
    $masterProfile = [
        'id' => $adminId,
        'email' => $email,
        'password_hash' => password_hash($password, PASSWORD_BCRYPT),
        'role' => 'SUPER_ADMIN',
        'is_active' => 1,
        'kyc_status' => 'APPROVED',
        'referral_code' => !empty($userProfile['referral_code']) ? (string)$userProfile['referral_code'] : ('ADM' . strtoupper(substr(hash('sha256', $email), 0, 6))),
        'created_at' => !empty($userProfile['created_at']) ? (string)$userProfile['created_at'] : gmdate('Y-m-d H:i:s'),
        'updated_at' => gmdate('Y-m-d H:i:s')
    ];
    $upsertRes = $supabase->upsert('profiles', [$masterProfile], 'id');
    if (empty($upsertRes['success'])) {
        // Retry minimal columns if legacy schema omits optional attributes
        $minimalMaster = [
            'id' => $adminId,
            'email' => $email,
            'password_hash' => $masterProfile['password_hash'],
            'role' => 'SUPER_ADMIN',
            'is_active' => 1
        ];
        $supabase->upsert('profiles', [$minimalMaster], 'id');
    }
    $userProfile = array_merge($userProfile ?: [], $masterProfile);
}

if (!$authenticated || !$userProfile) {
    recordLoginFailure($email);
    primex_record_log('SECURITY', 'LOGIN_FAILED', 'Invalid email or password', [], 'WARNING', null, $email);
    sendError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
}

$adminRoles = ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'KYC_MANAGER'];
$currentRole = strtoupper(trim((string)($userProfile['role'] ?? 'USER')));
if ($isWhitelistedAdmin && !in_array($currentRole, $adminRoles, true)) {
    $userProfile['role'] = 'SUPER_ADMIN';
    if (!empty($userProfile['id'])) {
        $supabase->update('profiles', [
            'role' => 'SUPER_ADMIN',
            'updated_at' => gmdate('Y-m-d H:i:s')
        ], ['id' => 'eq.' . $userProfile['id']]);
    }
}

if (isset($userProfile['is_active']) && !$userProfile['is_active']) {
    primex_record_log('SECURITY', 'LOGIN_SUSPENDED', 'Suspended account login blocked', [], 'WARNING', (string)$userProfile['id'], $email);
    sendError('ACCOUNT_SUSPENDED', 'Your institutional account is suspended. Contact compliance.', 403);
}

clearLoginFailures($email);

// Create an opaque server session with DB + server-side fallback persistence.
$sessionMeta = primex_create_session($userProfile);

$isAdmin = in_array(strtoupper((string)($userProfile['role'] ?? '')), $adminRoles, true);
primex_record_log('AUTH', 'LOGIN_SUCCESS', 'User signed in', [
    'role' => $userProfile['role'] ?? 'USER',
    'db_saved' => !empty($sessionMeta['db_saved']),
    'file_saved' => !empty($sessionMeta['file_saved'])
], 'INFO', (string)$userProfile['id'], (string)$userProfile['email']);

sendSuccess([
    'user' => [
        'id' => $userProfile['id'],
        'numeric_uid' => $userProfile['numeric_uid'] ?? null,
        'email' => $userProfile['email'],
        'first_name' => $userProfile['first_name'] ?? '',
        'last_name' => $userProfile['last_name'] ?? '',
        'whatsapp_number' => $userProfile['whatsapp_number'] ?? ($userProfile['phone'] ?? ''),
        'phone' => $userProfile['phone'] ?? ($userProfile['whatsapp_number'] ?? ''),
        'role' => $userProfile['role'] ?? 'USER',
        'kyc_status' => $userProfile['kyc_status'] ?? 'NOT_SUBMITTED',
        'referral_code' => $userProfile['referral_code'] ?? '',
        'referred_by' => $userProfile['referred_by'] ?? null,
        'country' => $userProfile['country'] ?? '',
        'two_factor_enabled' => !empty($userProfile['two_factor_enabled']),
        'has_withdrawal_pin' => !empty($userProfile['has_withdrawal_pin']) || !empty($userProfile['withdrawal_pin']) || !empty($userProfile['withdrawal_pin_hash']),
        'is_admin' => $isAdmin
    ]
], 'Login successful');
