<?php
/**
 * User Update Profile & Email - Pure Supabase REST Architecture
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/mailer.php';
require_once dirname(__DIR__) . '/lib/email_templates.php';
require_once dirname(__DIR__) . '/lib/auth_tokens.php';

$user = requireAuth();
if (!empty($user['_admin_preview'])) {
    sendError('PREVIEW_READONLY', 'Email address cannot be modified in read-only admin preview mode.', 403);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$userId = $user['id'];
$input = getJsonBody();
$email = strtolower(trim((string)($input['email'] ?? '')));
$verificationCode = trim((string)($input['verification_code'] ?? $input['code'] ?? $input['otp'] ?? ''));

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendError('VALIDATION_ERROR', 'A valid email address is required');
}

if (primex_is_admin_email($email) && !primex_is_admin_email((string)($user['email'] ?? ''))) {
    sendError('EMAIL_RESERVED', 'This email address is reserved and cannot be assigned.', 403);
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

// Check if email already taken
$existing = primex_find_profile_by_email($supabase, $email);
if ($existing !== null && (string)($existing['id'] ?? '') !== (string)$userId) {
    sendError('EMAIL_TAKEN', 'This email address is already in use by another account');
}

$oldEmail = strtolower(trim((string)($user['email'] ?? '')));
$emailChanged = ($email !== $oldEmail);

if ($emailChanged) {
    $cleanCode = preg_replace('/\s+/', '', $verificationCode);
    if (!preg_match('/^\d{6}$/', (string)$cleanCode)) {
        sendError('VERIFICATION_CODE_REQUIRED', 'Please enter the 6-digit verification code sent to your new email address.', 400);
    }
    $otpCheck = primex_consume_scoped_otp($supabase, 'change_email', $email, (string)$cleanCode);
    if (empty($otpCheck['success'])) {
        $status = (($otpCheck['error_code'] ?? '') === 'RATE_LIMITED') ? 429 : 400;
        sendError((string)($otpCheck['error_code'] ?? 'INVALID_VERIFICATION_CODE'), (string)($otpCheck['message'] ?? 'Invalid or expired verification code.'), $status);
    }
}

$nowIso = gmdate('Y-m-d H:i:s');
$updateData = [
    'email' => $email,
    'updated_at' => $nowIso
];
if ($emailChanged) {
    $updateData['email_verified'] = 1;
    $updateData['email_verified_at'] = $nowIso;
}

$res = $supabase->update('profiles', $updateData, ['id' => "eq.{$userId}"]);
if (empty($res['success']) && $emailChanged) {
    $msg = strtolower((string)($res['message'] ?? ''));
    if (strpos($msg, 'email_verified') !== false) {
        unset($updateData['email_verified'], $updateData['email_verified_at']);
        $res = $supabase->update('profiles', $updateData, ['id' => "eq.{$userId}"]);
    }
}
if (empty($res['success'])) {
    sendError('EMAIL_UPDATE_FAILED', 'Unable to update email right now. Please try again.', 502);
}

if ($emailChanged) {
    primex_clear_email_verified_local((string)$userId, $oldEmail);
    primex_mark_email_verified_local((string)$userId, $email);
    @$supabase->authAdminUpdateUser((string)$userId, ['email' => $email, 'email_confirm' => true]);
    primex_record_log('AUTH', 'EMAIL_UPDATED_WITH_OTP', 'User updated email address after OTP verification', ['old_email' => $oldEmail, 'new_email' => $email], 'INFO', (string)$userId, $email);
}

$profRes = $supabase->select('profiles', ['id' => "eq.{$userId}", 'limit' => '1']);
$updatedUser = ($profRes['success'] && !empty($profRes['data'][0])) ? $profRes['data'][0] : array_merge($user, ['email' => $email, 'email_verified' => 1]);
$updatedUser['has_withdrawal_pin'] = !empty($updatedUser['withdrawal_pin']) || !empty($updatedUser['withdrawal_pin_hash']);
$updatedUser['email_verified'] = $emailChanged ? true : primex_is_email_verified_resolved($updatedUser, $supabase);
unset($updatedUser['withdrawal_pin'], $updatedUser['withdrawal_pin_hash'], $updatedUser['password_hash']);

sendSuccess([
    'user' => $updatedUser,
    'email' => $email,
    'email_verified' => (bool)$updatedUser['email_verified']
], 'Email updated and verified successfully.');
