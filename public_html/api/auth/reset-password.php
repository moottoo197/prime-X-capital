<?php
/**
 * Reset Password Completion Endpoint
 * GET  -> non-destructive check whether reset token is valid & unexpired
 * POST -> atomically consumes single-use reset token, updates password hash +
 *         Supabase Auth, revokes all active sessions, and sends confirmation email
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/mailer.php';
require_once dirname(__DIR__) . '/lib/email_templates.php';
require_once dirname(__DIR__) . '/lib/auth_tokens.php';

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Authentication backend is unavailable.', 503);
}

$method = strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET'));

if ($method === 'GET') {
    $token = trim((string)($_GET['token'] ?? ''));
    $row = primex_peek_auth_token($supabase, 'password_reset', $token);
    if (!$row) {
        sendError('INVALID_OR_EXPIRED_TOKEN', 'This password reset link is invalid or has expired.', 400);
    }
    sendSuccess(['valid' => true], 'Reset link is valid.');
}

if ($method !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
if (!primex_check_email_rate_limit('reset_password_attempt', $ip, 10, 900, 0)) {
    sendError('RATE_LIMITED', 'Too many reset attempts. Please wait a few minutes and try again.', 429);
}

$body = getJsonBody();
$rawToken = trim((string)($body['token'] ?? ''));
$newPassword = (string)($body['password'] ?? $body['new_password'] ?? '');
$confirmPassword = (string)($body['confirm_password'] ?? '');

if (primex_validate_raw_token_format($rawToken) === '') {
    primex_record_email_rate_attempt('reset_password_attempt', $ip, 10, 900);
    sendError('INVALID_OR_EXPIRED_TOKEN', 'This password reset link is invalid or has expired.', 400);
}

if (strlen($newPassword) < 8 || strlen($newPassword) > 128) {
    sendError('VALIDATION_ERROR', 'Password must be between 8 and 128 characters.', 400);
}
if ($confirmPassword !== '' && !hash_equals($newPassword, $confirmPassword)) {
    sendError('VALIDATION_ERROR', 'New passwords do not match.', 400);
}

// Peek before consuming so weak/mismatched password errors do not burn a valid token,
// then immediately consume atomically once validated.
$peeked = primex_peek_auth_token($supabase, 'password_reset', $rawToken);
if (!$peeked) {
    primex_record_email_rate_attempt('reset_password_attempt', $ip, 10, 900);
    sendError('INVALID_OR_EXPIRED_TOKEN', 'This password reset link is invalid, expired, or has already been used.', 400);
}

$consumed = primex_consume_auth_token($supabase, 'password_reset', $rawToken);
if (!$consumed || empty($consumed['user_id'])) {
    primex_record_email_rate_attempt('reset_password_attempt', $ip, 10, 900);
    sendError('INVALID_OR_EXPIRED_TOKEN', 'This password reset link is invalid, expired, or has already been used.', 400);
}

$userId = (string)$consumed['user_id'];
$profRes = $supabase->select('profiles', ['id' => 'eq.' . $userId, 'limit' => '1']);
$profile = (!empty($profRes['success']) && !empty($profRes['data'][0])) ? $profRes['data'][0] : null;
if (!$profile || (isset($profile['is_active']) && !$profile['is_active'])) {
    sendError('ACCOUNT_UNAVAILABLE', 'Unable to update password for this account.', 400);
}

$userEmail = strtolower(trim((string)($profile['email'] ?? ($consumed['email'] ?? ''))));
$firstName = trim((string)($profile['first_name'] ?? ''));

$newHash = primex_hash_password($newPassword);
$updRes = $supabase->update('profiles', [
    'password_hash' => $newHash,
    'updated_at'    => gmdate('Y-m-d H:i:s'),
], ['id' => 'eq.' . $userId]);

if (empty($updRes['success'])) {
    primex_record_log('AUTH', 'PASSWORD_RESET_UPDATE_FAILED', 'Failed updating password hash on reset', [], 'ERROR', $userId, $userEmail);
    sendError('PASSWORD_RESET_FAILED', 'Unable to update your password right now. Please request a new reset link.', 500);
}

// Keep Supabase Auth password in sync so old passwords cannot verify via fallback login
@$supabase->authAdminUpdateUser($userId, ['password' => $newPassword]);

// Revoke every active session for this user and clear any cookie in current browser.
// Never auto-login after a password reset.
primex_delete_sessions_by_user($userId);
if (!headers_sent()) {
    setcookie('alphavest_session', '', [
        'expires'  => time() - 3600,
        'path'     => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure'   => isHttpsRequest(),
    ]);
}

$changedAtUtc = gmdate('Y-m-d H:i:s') . ' UTC';
if ($userEmail !== '' && filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
    $appUrl = primex_app_url();
    $tpl = primex_email_template_password_changed($firstName, $changedAtUtc, $appUrl . '/?auth=login', $appUrl . '/?view=support');
    $mailRes = primex_send_templated_email($userEmail, $tpl);
    primex_record_log(
        'EMAIL',
        !empty($mailRes['success']) ? 'PASSWORD_CHANGED_EMAIL_SENT' : 'PASSWORD_CHANGED_EMAIL_FAILED',
        'Password changed confirmation email processed after reset',
        [],
        !empty($mailRes['success']) ? 'INFO' : 'WARNING',
        $userId,
        $userEmail
    );
}

primex_record_log('AUTH', 'PASSWORD_RESET_COMPLETED', 'User completed password reset via single-use token', [], 'INFO', $userId, $userEmail);

sendSuccess([
    'password_reset' => true,
], 'Your password has been updated. Please sign in with your new password.');
