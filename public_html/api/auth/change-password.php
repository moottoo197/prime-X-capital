<?php
/**
 * Authenticated Password Change Endpoint
 * Verifies current password, updates password hash + Supabase Auth,
 * rotates session (revoking all other sessions), and sends confirmation email.
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/mailer.php';
require_once dirname(__DIR__) . '/lib/email_templates.php';
require_once dirname(__DIR__) . '/lib/auth_tokens.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$user = requireAuth();
if (!empty($user['_admin_preview'])) {
    sendError('PREVIEW_READONLY', 'Passwords cannot be modified in read-only admin preview mode.', 403);
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Authentication backend is unavailable.', 503);
}

$userId = (string)($user['id'] ?? '');
$email = strtolower(trim((string)($user['email'] ?? '')));
$firstName = trim((string)($user['first_name'] ?? ''));

$body = getJsonBody();
$oldPassword = (string)($body['old_password'] ?? $body['current_password'] ?? '');
$newPassword = (string)($body['new_password'] ?? $body['password'] ?? '');
$confirmPassword = (string)($body['confirm_password'] ?? '');
$verificationCode = trim((string)($body['verification_code'] ?? $body['code'] ?? $body['otp'] ?? ''));

if ($oldPassword === '' || strlen($newPassword) < 8 || strlen($newPassword) > 128) {
    sendError('VALIDATION_ERROR', 'Current password and a new password (8 to 128 characters) are required.', 400);
}
if ($confirmPassword !== '' && !hash_equals($newPassword, $confirmPassword)) {
    sendError('VALIDATION_ERROR', 'New passwords do not match.', 400);
}
if (hash_equals($oldPassword, $newPassword)) {
    sendError('VALIDATION_ERROR', 'Your new password must be different from your current password.', 400);
}
if (!preg_match('/^\d{6}$/', preg_replace('/\s+/', '', $verificationCode))) {
    sendError('VERIFICATION_CODE_REQUIRED', 'Please enter the 6-digit verification code sent to your email.', 400);
}

$profRes = $supabase->select('profiles', ['id' => 'eq.' . $userId, 'limit' => '1']);
$profile = (!empty($profRes['success']) && !empty($profRes['data'][0])) ? $profRes['data'][0] : $user;

$verifiedOld = false;
if (!empty($profile['password_hash']) && password_verify($oldPassword, (string)$profile['password_hash'])) {
    $verifiedOld = true;
} elseif ($email !== '') {
    $sbAuth = $supabase->authSignIn($email, $oldPassword);
    if (!empty($sbAuth['success']) && !empty($sbAuth['data']['access_token'])) {
        $verifiedOld = true;
    }
}

if (!$verifiedOld) {
    primex_record_log('SECURITY', 'CHANGE_PASSWORD_BAD_CURRENT', 'Current password verification failed', [], 'WARNING', $userId, $email);
    sendError('INVALID_CURRENT_PASSWORD', 'Current password is incorrect.', 401);
}

$otpCheck = primex_consume_scoped_otp($supabase, 'change_password', $email, $verificationCode);
if (empty($otpCheck['success'])) {
    $status = (($otpCheck['error_code'] ?? '') === 'RATE_LIMITED') ? 429 : 400;
    sendError((string)($otpCheck['error_code'] ?? 'INVALID_VERIFICATION_CODE'), (string)($otpCheck['message'] ?? 'Invalid or expired verification code.'), $status);
}

$newHash = primex_hash_password($newPassword);
$updRes = $supabase->update('profiles', [
    'password_hash' => $newHash,
    'updated_at'    => gmdate('Y-m-d H:i:s'),
], ['id' => 'eq.' . $userId]);

if (empty($updRes['success'])) {
    sendError('PASSWORD_UPDATE_FAILED', 'Unable to update your password right now. Please try again.', 500);
}

@$supabase->authAdminUpdateUser($userId, ['password' => $newPassword]);

// Revoke all previous sessions and issue a fresh session only for this authenticated browser
primex_delete_sessions_by_user($userId);
primex_create_session($profile);

$changedAtUtc = gmdate('Y-m-d H:i:s') . ' UTC';
if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $appUrl = primex_app_url();
    $tpl = primex_email_template_password_changed($firstName, $changedAtUtc, $appUrl . '/?auth=login', $appUrl . '/?view=support');
    $mailRes = primex_send_templated_email($email, $tpl);
    primex_record_log(
        'EMAIL',
        !empty($mailRes['success']) ? 'PASSWORD_CHANGED_EMAIL_SENT' : 'PASSWORD_CHANGED_EMAIL_FAILED',
        'Password changed confirmation email processed',
        [],
        !empty($mailRes['success']) ? 'INFO' : 'WARNING',
        $userId,
        $email
    );
}

primex_record_log('AUTH', 'PASSWORD_CHANGED', 'Authenticated user updated login password', [], 'INFO', $userId, $email);

sendSuccess([
    'password_changed' => true,
], 'Your password has been updated and a confirmation email has been sent.');
