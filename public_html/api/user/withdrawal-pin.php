<?php
/**
 * User Withdrawal PIN Setting & Recovery - Direct Supabase REST
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/auth_tokens.php';

$user = requireAuth();
if (!empty($user['_admin_preview'])) {
    sendError('PREVIEW_READONLY', 'Withdrawal PIN cannot be modified in read-only admin preview mode.', 403);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$input = getJsonBody();
$pin = trim((string)($input['new_pin'] ?? $input['pin'] ?? $input['withdrawal_pin'] ?? ''));
$currentPin = trim((string)($input['current_pin'] ?? ''));
$mode = strtolower(trim((string)($input['mode'] ?? 'change')));
$verificationCode = trim((string)($input['verification_code'] ?? $input['code'] ?? $input['otp'] ?? ''));

if (empty($pin) || !preg_match('/^\d{6}$/', $pin)) {
    sendError('INVALID_PIN', 'PIN must be exactly 6 numeric digits');
}

$cleanCode = preg_replace('/\s+/', '', $verificationCode);
if (!preg_match('/^\d{6}$/', (string)$cleanCode)) {
    sendError('VERIFICATION_CODE_REQUIRED', 'Please enter the 6-digit verification code sent to your email.', 400);
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

$profRes = $supabase->select('profiles', [
    'id' => 'eq.' . $user['id'],
    'select' => 'id,email,withdrawal_pin,withdrawal_pin_hash',
    'limit' => '1'
]);
if (!$profRes['success'] || empty($profRes['data'][0])) {
    sendError('PROFILE_LOOKUP_FAILED', 'Unable to verify existing withdrawal PIN state. Please try again.', 502);
}

$prof = $profRes['data'][0];
$accountEmail = strtolower(trim((string)($prof['email'] ?? ($user['email'] ?? ''))));
if ($accountEmail === '') {
    sendError('EMAIL_REQUIRED', 'A verified account email is required to authorize withdrawal PIN updates.', 400);
}

$storedPin = (string)($prof['withdrawal_pin'] ?? '');
$storedHash = (string)($prof['withdrawal_pin_hash'] ?? '');
$isForgotMode = ($mode === 'forgot');

if (!$isForgotMode && ($storedPin !== '' || $storedHash !== '')) {
    if ($currentPin === '' || !preg_match('/^\d{6}$/', $currentPin)) {
        sendError('CURRENT_PIN_REQUIRED', 'Current 6-digit withdrawal PIN is required to update your PIN.', 400);
    }
    checkWithdrawalPinRateLimit((string)$user['id']);
    $matches = false;
    if ($storedHash !== '' && password_verify($currentPin, $storedHash)) {
        $matches = true;
    } elseif ($storedPin !== '' && hash_equals($storedPin, $currentPin)) {
        $matches = true;
    }
    if (!$matches) {
        recordWithdrawalPinFailure((string)$user['id']);
        sendError('INCORRECT_PIN', 'Current 6-digit withdrawal PIN is incorrect.', 403);
    }
    clearWithdrawalPinFailures((string)$user['id']);
}

$otpPurpose = $isForgotMode ? 'forgot_pin' : 'change_pin';
$otpCheck = primex_consume_scoped_otp($supabase, $otpPurpose, $accountEmail, (string)$cleanCode);
if (empty($otpCheck['success'])) {
    $status = (($otpCheck['error_code'] ?? '') === 'RATE_LIMITED') ? 429 : 400;
    sendError((string)($otpCheck['error_code'] ?? 'INVALID_VERIFICATION_CODE'), (string)($otpCheck['message'] ?? 'Invalid or expired verification code.'), $status);
}

$pinHash = password_hash($pin, PASSWORD_BCRYPT);
$updRes = $supabase->update('profiles', [
    'withdrawal_pin' => null,
    'withdrawal_pin_hash' => $pinHash,
    'updated_at' => gmdate('Y-m-d H:i:s')
], ['id' => "eq.{$user['id']}"]);

if (empty($updRes['success'])) {
    sendError('PIN_UPDATE_FAILED', 'Unable to save fund withdrawal PIN right now. Please try again.', 502);
}

clearWithdrawalPinFailures((string)$user['id']);
primex_record_log('SECURITY', $isForgotMode ? 'WITHDRAWAL_PIN_RECOVERED' : 'WITHDRAWAL_PIN_UPDATED', 'Withdrawal PIN updated with email OTP verification', [], 'INFO', (string)$user['id'], $accountEmail);

sendSuccess(['has_withdrawal_pin' => true], $isForgotMode ? 'Fund withdrawal PIN recovered and updated.' : 'Fund withdrawal PIN saved successfully.');
