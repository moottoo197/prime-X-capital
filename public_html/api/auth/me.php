<?php
/**
 * Auth Me Profile Check - Direct Supabase
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/auth_tokens.php';
require_once dirname(__DIR__) . '/lib/presence.php';

$user = getCurrentUser();
if (!$user) {
    if (isset($_GET['optional']) && (string)$_GET['optional'] === '1') {
        sendSuccess([
            'authenticated' => false,
            'user' => null
        ], 'No active session');
    }
    sendError('UNAUTHORIZED', 'Not authenticated', 401);
}

$supabase = getSupabaseClient();
$user = primex_normalize_effective_user($user);
$isAdmin = in_array(strtoupper((string)($user['role'] ?? '')), ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'KYC_MANAGER'], true);
$country = !empty($user['country']) ? trim((string)$user['country']) : (!empty($_COOKIE['alphavest_country']) ? trim((string)$_COOKIE['alphavest_country']) : '');
$timezone = !empty($user['timezone']) ? trim((string)$user['timezone']) : (!empty($_COOKIE['alphavest_timezone']) ? trim((string)$_COOKIE['alphavest_timezone']) : 'Asia/Karachi');
$emailVerified = primex_is_email_verified_resolved($user, $supabase);
$requestedView = trim((string)($_GET['view'] ?? 'home'));
try {
    primex_touch_user_presence($supabase, $user, ['view' => $requestedView]);
} catch (Throwable $e) {}

sendSuccess([
    'user' => [
        'id' => $user['id'],
        'numeric_uid' => $user['numeric_uid'] ?? null,
        'email' => $user['email'],
        'first_name' => $user['first_name'] ?? '',
        'last_name' => $user['last_name'] ?? '',
        'whatsapp_number' => $user['whatsapp_number'] ?? ($user['phone'] ?? ''),
        'phone' => $user['phone'] ?? ($user['whatsapp_number'] ?? ''),
        'role' => $user['role'] ?? 'USER',
        'kyc_status' => $user['kyc_status'] ?? 'NOT_SUBMITTED',
        'referral_code' => $user['referral_code'] ?? '',
        'referred_by' => $user['referred_by'] ?? null,
        'two_factor_enabled' => !empty($user['two_factor_enabled']),
        'has_withdrawal_pin' => primex_has_withdrawal_pin_resolved($user, $supabase),
        'email_verified' => $emailVerified,
        'country' => $country,
        'timezone' => $timezone,
        'avatar' => primex_get_user_avatar($user),
        'is_admin' => $isAdmin
    ]
], 'User session active');
