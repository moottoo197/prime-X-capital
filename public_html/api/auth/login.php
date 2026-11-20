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

checkLoginRateLimit($email);

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

// 1. Check profile in Supabase profiles table
$profRes = $supabase->select('profiles', ['email' => "eq.{$email}", 'limit' => '1']);
$userProfile = ($profRes['success'] && !empty($profRes['data'][0])) ? $profRes['data'][0] : null;

$authenticated = false;
$supabaseToken = null;

// Try password_verify if profile exists and has hash
if ($userProfile && !empty($userProfile['password_hash'])) {
    if (password_verify($password, $userProfile['password_hash'])) {
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
            $userRole = 'USER';
            $userProfile = [
                'id' => $userId,
                'email' => $email,
                'password_hash' => password_hash($password, PASSWORD_BCRYPT),
                'role' => $userRole,
                'is_active' => 1,
                'kyc_status' => 'NOT_SUBMITTED',
                'referral_code' => 'REF' . strtoupper(bin2hex(random_bytes(4))),
                'created_at' => gmdate('Y-m-d H:i:s'),
                'updated_at' => gmdate('Y-m-d H:i:s')
            ];
            $supabase->upsert('profiles', [$userProfile], 'id');
        }
    }
}

// Optional master administrator authentication. Credentials stay outside htdocs.
$adminEmails = defined('ADMIN_EMAILS') ? ADMIN_EMAILS : [];
$masterPassword = defined('ADMIN_MASTER_PASSWORD') ? ADMIN_MASTER_PASSWORD : '';
if (!$authenticated && $masterPassword !== '' && strpos($masterPassword, 'REPLACE_WITH_') !== 0 && in_array($email, $adminEmails, true) && hash_equals($masterPassword, $password)) {
    $authenticated = true;
    $adminId = $userProfile['id'] ?? 'usr_admin_master_01';
    $userProfile = [
        'id' => $adminId,
        'email' => $email,
        'password_hash' => password_hash($password, PASSWORD_BCRYPT),
        'role' => 'SUPER_ADMIN',
        'is_active' => 1,
        'kyc_status' => 'APPROVED',
        'referral_code' => 'ALPHAPRO',
        'created_at' => gmdate('Y-m-d H:i:s'),
        'updated_at' => gmdate('Y-m-d H:i:s')
    ];
    $supabase->upsert('profiles', [$userProfile], 'id');
}

if (!$authenticated || !$userProfile) {
    recordLoginFailure($email);
    sendError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
}

if (isset($userProfile['is_active']) && !$userProfile['is_active']) {
    sendError('ACCOUNT_SUSPENDED', 'Your institutional account is suspended. Contact compliance.', 403);
}

clearLoginFailures($email);

// Create an opaque server session. Supabase access tokens never leave this request.
$token = bin2hex(random_bytes(32));
$sessionId = bin2hex(random_bytes(16));
$expiresAt = gmdate('Y-m-d H:i:s', time() + 315360000); // 10-year persistent session; refreshed while active
$ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';

$sessionPayload = [
    'id' => $sessionId,
    'user_id' => $userProfile['id'],
    'token' => hash('sha256', $token),
    'ip_address' => $ip,
    'user_agent' => $ua,
    'created_at' => gmdate('Y-m-d H:i:s'),
    'expires_at' => $expiresAt
];
$supabase->insert('user_sessions', [$sessionPayload]);

// Set HTTP-only Cookie
if (!headers_sent()) {
    setcookie('alphavest_session', $token, [
        'expires' => time() + 315360000,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => isHttpsRequest()
    ]);
}

$isAdmin = in_array(strtoupper($userProfile['role'] ?? ''), ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'KYC_MANAGER']);

sendSuccess([
    'user' => [
        'id' => $userProfile['id'],
        'numeric_uid' => $userProfile['numeric_uid'] ?? null,
        'email' => $userProfile['email'],
        'first_name' => $userProfile['first_name'] ?? '',
        'last_name' => $userProfile['last_name'] ?? '',
        'phone' => $userProfile['phone'] ?? '',
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
