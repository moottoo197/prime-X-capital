<?php
/**
 * Send Sign-Up Email Verification Code (6-Digit OTP)
 * Rate-limited by IP and email; dispatches branded 6-digit verification code
 * via Hostinger SMTP before completing registration.
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
$firstName = trim((string)($body['first_name'] ?? $body['firstName'] ?? ''));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendError('VALIDATION_ERROR', 'Please enter a valid email address first.', 400);
}

if (primex_is_admin_email($email)) {
    sendError('EMAIL_RESERVED', 'This email address is reserved and cannot be self-registered.', 403);
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Authentication backend is unavailable.', 503);
}

// Check existing account before dispatching OTP
$existing = $supabase->select('profiles', ['email' => 'eq.' . $email, 'limit' => '1']);
if (($existing['success'] && !empty($existing['data'][0])) || primex_find_profile_by_email($supabase, $email) !== null) {
    sendError('EMAIL_EXISTS', 'An account with this email already exists. Please log in.', 409);
}

$ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
if (!primex_check_email_rate_limit('signup_otp_ip', $ip, 12, 900, 10)) {
    sendError('RATE_LIMITED', 'Too many verification code requests from this network. Please wait a few minutes.', 429);
}
if (!primex_check_email_rate_limit('signup_otp_email', $email, 5, 900, 45)) {
    sendError('RATE_LIMITED', 'Please wait at least 45 seconds before requesting another verification code.', 429);
}

primex_record_email_rate_attempt('signup_otp_ip', $ip, 12, 900);
primex_record_email_rate_attempt('signup_otp_email', $email, 5, 900);

$otpRes = primex_issue_signup_otp($supabase, $email, 600);
if (empty($otpRes['success']) || empty($otpRes['code'])) {
    sendError('OTP_GENERATION_FAILED', 'Unable to generate verification code right now. Please try again.', 500);
}

$tpl = primex_email_template_signup_code($firstName, (string)$otpRes['code'], 10);
$mailRes = primex_send_templated_email($email, $tpl);

if (empty($mailRes['success'])) {
    primex_record_log('EMAIL', 'SIGNUP_OTP_SEND_FAILED', 'Failed dispatching sign-up verification code', [], 'WARNING', null, $email);
    sendError('EMAIL_SEND_FAILED', 'Unable to send verification email right now. Please verify your email address or try again shortly.', 503);
}

primex_record_log('EMAIL', 'SIGNUP_OTP_SENT', 'Sign-up verification code dispatched', ['expires_minutes' => 10], 'INFO', null, $email);

sendSuccess([
    'sent' => true,
    'expires_in_seconds' => 600,
], 'A 6-digit verification code has been sent to your email.');
