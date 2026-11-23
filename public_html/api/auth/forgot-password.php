<?php
/**
 * Forgot Password Request Endpoint
 *
 * Always enforces rate limits before account lookup and returns a generic,
 * non-enumerating response so account existence cannot be discovered.
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/mailer.php';
require_once dirname(__DIR__) . '/lib/email_templates.php';
require_once dirname(__DIR__) . '/lib/auth_tokens.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$body = getJsonBody();
$email = strtolower(trim((string)($body['email'] ?? '')));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendError('VALIDATION_ERROR', 'Please enter a valid email address.', 400);
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Authentication backend is unavailable.', 503);
}

$ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$allowedByIp = primex_check_email_rate_limit('forgot_password_ip', $ip, 10, 900, 5);
$allowedByEmail = primex_check_email_rate_limit('forgot_password_email', $email, 5, 900, 60);

if (!$allowedByIp || !$allowedByEmail) {
    sendError('RATE_LIMITED', 'Too many password reset requests. Please wait a few minutes before trying again.', 429);
}

primex_record_email_rate_attempt('forgot_password_ip', $ip, 10, 900);
primex_record_email_rate_attempt('forgot_password_email', $email, 5, 900);

$genericMessage = 'If an account matches that email address, a password reset link has been sent.';

$profile = primex_find_profile_by_email($supabase, $email);
if ($profile && (!isset($profile['is_active']) || (bool)$profile['is_active'])) {
    $userId = (string)$profile['id'];
    $firstName = trim((string)($profile['first_name'] ?? ''));

    // Single-use 30-minute reset token; automatically invalidates prior unused tokens
    $tokenRes = primex_issue_auth_token($supabase, 'password_reset', $userId, $email, 1800);
    if (!empty($tokenRes['success']) && !empty($tokenRes['token'])) {
        $resetUrl = primex_app_url() . '/?reset_token=' . rawurlencode($tokenRes['token']);
        $tpl = primex_email_template_reset_password($firstName, $resetUrl, 30);
        $mailRes = primex_send_templated_email($email, $tpl);

        primex_record_log(
            'AUTH',
            !empty($mailRes['success']) ? 'PASSWORD_RESET_EMAIL_SENT' : 'PASSWORD_RESET_EMAIL_FAILED',
            !empty($mailRes['success']) ? 'Password reset email dispatched' : 'Password reset email failed to dispatch',
            ['expires_minutes' => 30],
            !empty($mailRes['success']) ? 'INFO' : 'WARNING',
            $userId,
            $email
        );
    }
} else {
    primex_record_log('AUTH', 'PASSWORD_RESET_REQUESTED_NONEXISTENT_OR_INACTIVE', 'Password reset requested for unknown or inactive address', [], 'INFO', null, $email);
}

sendSuccess(['requested' => true], $genericMessage);
