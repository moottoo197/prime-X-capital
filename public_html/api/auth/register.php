<?php
/**
 * User Registration - Direct Supabase Auth, Profiles, & Wallets
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/mailer.php';
require_once dirname(__DIR__) . '/lib/email_templates.php';
require_once dirname(__DIR__) . '/lib/auth_tokens.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$body = getJsonBody();
// Accept both current snake_case and legacy camelCase payloads. Some cached
// frontend/API combinations may still use firstName/lastName.
$firstName = trim((string)($body['first_name'] ?? $body['firstName'] ?? $body['user']['first_name'] ?? $body['user']['firstName'] ?? ''));
$lastName = trim((string)($body['last_name'] ?? $body['lastName'] ?? $body['user']['last_name'] ?? $body['user']['lastName'] ?? ''));
$email = strtolower(trim($body['email'] ?? ''));
$whatsappNumber = trim((string)($body['whatsapp_number'] ?? $body['whatsapp'] ?? $body['phone'] ?? $body['phone_number'] ?? $body['user']['whatsapp_number'] ?? $body['user']['phone'] ?? $body['user']['phone_number'] ?? ''));
$normalizedPhoneDigits = preg_replace('/[\s\-().]/', '', $whatsappNumber);
$password = $body['password'] ?? '';
$verificationCode = trim((string)($body['verification_code'] ?? $body['email_code'] ?? $body['otp_code'] ?? ''));
$referralCode = strtoupper(trim((string)($body['referral_code'] ?? $body['ref'] ?? $body['invite_code'] ?? ($_COOKIE['alphavest_ref'] ?? ''))));
$withdrawalPin = trim($body['withdrawal_pin'] ?? $body['fund_password'] ?? $body['pin'] ?? '');

$country = trim((string)($body['country'] ?? ''));
$timezone = trim((string)($body['timezone'] ?? 'Asia/Karachi'));
if ($country === '') {
    sendError('COUNTRY_REQUIRED', 'Please select your country / region before creating the account.');
}
if (!in_array($timezone, DateTimeZone::listIdentifiers(), true)) {
    $timezone = 'Asia/Karachi';
}

if ($firstName === '' || $lastName === '') {
    sendError('VALIDATION_ERROR', 'First name and last name are required');
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($password) || strlen($password) < 8) {
    sendError('VALIDATION_ERROR', 'Valid email and password (minimum 8 characters) required');
}
if (primex_is_admin_email($email)) {
    sendError('EMAIL_RESERVED', 'This email address is reserved and cannot be self-registered.', 403);
}

if ($whatsappNumber === '' || !preg_match('/^[0-9+\-\s().]{7,24}$/', $whatsappNumber) || !preg_match('/^\+?\d{7,15}$/', (string)$normalizedPhoneDigits)) {
    sendError('VALIDATION_ERROR', 'Please enter a valid WhatsApp number');
}

if (empty($withdrawalPin) || !preg_match('/^\d{6}$/', $withdrawalPin)) {
    sendError('VALIDATION_ERROR', 'A 6-digit fund withdrawal PIN is required for account security');
}

// Referral code is mandatory for every new account. Validate it server-side
// before creating the Supabase Auth user so the requirement cannot be bypassed.
if ($referralCode === '') {
    sendError('REFERRAL_REQUIRED', 'A valid referral code is required to create an account.', 422);
}
if (!preg_match('/^[A-Z0-9_-]{4,32}$/', $referralCode)) {
    sendError('INVALID_REFERRAL_CODE', 'The referral code format is invalid.', 422);
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

// Verify that the supplied referral code belongs to an existing account.
$referralCheck = $supabase->select('profiles', [
    'referral_code' => 'eq.' . rawurlencode($referralCode),
    'select' => 'id,referral_code,is_active',
    'limit' => '1'
]);
if (!$referralCheck['success'] || empty($referralCheck['data'][0])) {
    sendError('INVALID_REFERRAL_CODE', 'The referral code is invalid or does not exist.', 422);
}
$referrer = $referralCheck['data'][0];
if (isset($referrer['is_active']) && !$referrer['is_active']) {
    sendError('INVALID_REFERRAL_CODE', 'The referral code is inactive.', 422);
}

// 1. Check if profile already exists in Supabase
$existing = $supabase->select('profiles', ['email' => 'eq.' . rawurlencode($email), 'limit' => '1']);
if (($existing['success'] && !empty($existing['data'][0])) || primex_find_profile_by_email($supabase, $email) !== null) {
    sendError('EMAIL_EXISTS', 'An account with this email already exists. Please log in.', 409);
}

// 1B. Require & verify 6-digit email OTP before creating account
if (!preg_match('/^\d{6}$/', $verificationCode)) {
    sendError('VERIFICATION_CODE_REQUIRED', 'Please click Send Code and enter the 6-digit verification code sent to your email.', 422);
}
$otpVerify = primex_consume_signup_otp($supabase, $email, $verificationCode);
if (empty($otpVerify['success'])) {
    $errCode = (string)($otpVerify['error_code'] ?? 'INVALID_VERIFICATION_CODE');
    $httpStatus = ($errCode === 'RATE_LIMITED') ? 429 : 422;
    sendError($errCode, (string)($otpVerify['message'] ?? 'Invalid or expired email verification code.'), $httpStatus);
}

$userId = sprintf(
    '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
    mt_rand(0, 0xffff), mt_rand(0, 0xffff),
    mt_rand(0, 0xffff),
    mt_rand(0, 0x0fff) | 0x4000,
    mt_rand(0, 0x3fff) | 0x8000,
    mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
);

$myRefCode = 'REF' . strtoupper(bin2hex(random_bytes(4)));
$hash = primex_hash_password($password);
$pinHash = password_hash($withdrawalPin, PASSWORD_BCRYPT);
$role = 'USER';
$kycStatus = 'NOT_SUBMITTED';

// If inviter referral code provided, verify or link it
$validReferredBy = !empty($referralCode) ? $referralCode : null;

// 2. Create in Supabase Auth
$authRes = $supabase->authAdminCreateUser($email, $password, [
    'role' => $role,
    'kyc_status' => $kycStatus,
    'referral_code' => $myRefCode,
    'referred_by' => $validReferredBy,
    'whatsapp_number' => $whatsappNumber,
    'phone' => $whatsappNumber,
    'country' => $country,
    'timezone' => $timezone
]);

if ($authRes['success'] && !empty($authRes['data']['id'])) {
    $userId = $authRes['data']['id'];
}

// 3. Upsert Profile (matching verified Supabase columns)
$profilePayload = [
    'id' => $userId,
    'email' => $email,
    'first_name' => $firstName,
    'last_name' => $lastName,
    'whatsapp_number' => $whatsappNumber,
    'phone' => $whatsappNumber,
    'password_hash' => $hash,
    'role' => $role,
    'is_active' => 1,
    'kyc_status' => $kycStatus,
    'referral_code' => $myRefCode,
    'referred_by' => $validReferredBy,
    'withdrawal_pin' => null,
    'withdrawal_pin_hash' => $pinHash,
    'country' => $country,
    'timezone' => $timezone,
    'email_verified' => 1,
    'email_verified_at' => gmdate('Y-m-d\TH:i:s\Z'),
    'created_at' => gmdate('Y-m-d H:i:s'),
    'updated_at' => gmdate('Y-m-d H:i:s')
];

$profileRes = $supabase->upsert('profiles', [$profilePayload], 'id');

// Legacy Supabase schemas may not expose optional PIN/timezone/phone/whatsapp/email_verified columns in PostgREST.
// Never allow an optional security/profile column to prevent the required country
// and account profile from being created. Retry progressively with only columns
// that are required by the application.
if (!$profileRes['success']) {
    $msg = strtolower((string)($profileRes['message'] ?? ''));
    $retry = $profilePayload;
    $changed = false;
    foreach (['withdrawal_pin_hash', 'withdrawal_pin', 'timezone', 'whatsapp_number', 'phone', 'email_verified_at', 'email_verified'] as $optionalColumn) {
        if (strpos($msg, strtolower($optionalColumn)) !== false) {
            unset($retry[$optionalColumn]);
            $changed = true;
        }
    }
    if ($changed) {
        $profileRes = $supabase->upsert('profiles', [$retry], 'id');
    }
}
if (!$profileRes['success']) {
    // Final compatibility path: preserve the account and selected country using
    // only columns required by all PRIME X CAPITAL profile schemas.
    $msg = strtolower((string)($profileRes['message'] ?? ''));
    if (preg_match('/(withdrawal_pin_hash|withdrawal_pin|timezone|whatsapp_number|phone|email_verified|email_verified_at)/', $msg)) {
        $minimal = $profilePayload;
        unset($minimal['withdrawal_pin_hash'], $minimal['withdrawal_pin'], $minimal['timezone'], $minimal['whatsapp_number'], $minimal['phone'], $minimal['email_verified'], $minimal['email_verified_at']);
        $profileRes = $supabase->upsert('profiles', [$minimal], 'id');
    }
}
if (!$profileRes['success']) {
    primex_record_log('AUTH', 'REGISTER_FAILED', 'Unable to create profile', ['email' => $email, 'country' => $country], 'ERROR');
    sendError('PROFILE_CREATE_FAILED', 'Unable to create the account profile. ' . ($profileRes['message'] ?? ''), 502);
}

// Read the database-generated numeric UID (never derive a UID by concatenating the UUID).
$uidRes = $supabase->select('profiles', ['id' => "eq.{$userId}", 'select' => 'numeric_uid', 'limit' => '1']);
$numericUid = (!empty($uidRes['data'][0]['numeric_uid'])) ? (string)$uidRes['data'][0]['numeric_uid'] : null;

// 4. Create default wallet balances
$wallets = [
    ['user_id' => $userId, 'wallet_type' => 'funding', 'asset' => 'USDT', 'balance' => 0.0, 'available_balance' => 0.0, 'reserved_balance' => 0.0, 'promotional_balance' => 0.0, 'created_at' => gmdate('Y-m-d H:i:s'), 'updated_at' => gmdate('Y-m-d H:i:s')],
    ['user_id' => $userId, 'wallet_type' => 'exchange', 'asset' => 'USDT', 'balance' => 0.0, 'available_balance' => 0.0, 'reserved_balance' => 0.0, 'promotional_balance' => 0.0, 'created_at' => gmdate('Y-m-d H:i:s'), 'updated_at' => gmdate('Y-m-d H:i:s')],
    ['user_id' => $userId, 'wallet_type' => 'trading', 'asset' => 'USDT', 'balance' => 0.0, 'available_balance' => 0.0, 'reserved_balance' => 0.0, 'promotional_balance' => 0.0, 'created_at' => gmdate('Y-m-d H:i:s'), 'updated_at' => gmdate('Y-m-d H:i:s')]
];
$supabase->upsert('wallet_balances', $wallets, 'user_id,wallet_type,asset');

// 4B. Persist local verified-email marker (guarantees Email: Verified even before optional DB column migration)
primex_mark_email_verified_local($userId, $email);

// 5. Create Session
$profilePayload['numeric_uid'] = $numericUid;
primex_create_session($profilePayload);

// Set preference cookies
if (!headers_sent()) {
    $isHttps = isHttpsRequest();
    setcookie('alphavest_country', $country, [
        'expires' => time() + 7200,
        'path' => '/',
        'httponly' => false,
        'samesite' => 'Lax',
        'secure' => $isHttps
    ]);
    setcookie('alphavest_timezone', $timezone, [
        'expires' => time() + 7200,
        'path' => '/',
        'httponly' => false,
        'samesite' => 'Lax',
        'secure' => $isHttps
    ]);
}

// 6. Email verified via single-use 6-digit OTP during sign up
primex_record_log('AUTH', 'REGISTER_SUCCESS', 'New account registered with verified email OTP', [
    'country' => $country,
    'referred_by' => $validReferredBy,
    'whatsapp_number' => $whatsappNumber,
    'email_verified' => true
], 'INFO', $userId, $email);

sendSuccess([
    'user' => [
        'id' => $userId,
        'numeric_uid' => $numericUid,
        'email' => $email,
        'first_name' => $firstName,
        'last_name' => $lastName,
        'whatsapp_number' => $whatsappNumber,
        'phone' => $whatsappNumber,
        'role' => $role,
        'kyc_status' => $kycStatus,
        'referral_code' => $myRefCode,
        'referred_by' => $validReferredBy,
        'country' => $country,
        'timezone' => $timezone,
        'two_factor_enabled' => false,
        'has_withdrawal_pin' => true,
        'email_verified' => true,
        'is_admin' => in_array($role, ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'KYC_MANAGER'])
    ],
    'email_verification_sent' => false
], 'Account created and email verified successfully!');
