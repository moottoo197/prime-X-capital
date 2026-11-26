<?php
/**
 * Send Scoped Security Verification Code (6-Digit OTP)
 * Supports: change_password, forgot_password, change_pin, forgot_pin, change_email
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/mailer.php';
require_once dirname(__DIR__) . '/lib/email_templates.php';
require_once dirname(__DIR__) . '/lib/auth_tokens.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Authentication backend is unavailable.', 503);
}

$body = getJsonBody();
$action = strtolower(trim((string)($body['action'] ?? $body['purpose'] ?? '')));
$allowedActions = ['change_password', 'forgot_password', 'change_pin', 'forgot_pin', 'change_email'];
if (!in_array($action, $allowedActions, true)) {
    sendError('VALIDATION_ERROR', 'Invalid verification action requested.', 400);
}

$ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
if (!primex_check_email_rate_limit('sec_otp_ip', $ip, 15, 900, 5)) {
    sendError('RATE_LIMITED', 'Too many verification code requests from this network. Please wait a few minutes.', 429);
}

if ($action === 'forgot_password') {
    $email = strtolower(trim((string)($body['email'] ?? '')));
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendError('VALIDATION_ERROR', 'Please enter a valid email address.', 400);
    }

    if (!primex_check_email_rate_limit('sec_otp_forgot_pw', $email, 5, 900, 45)) {
        sendError('RATE_LIMITED', 'Please wait at least 45 seconds before requesting another verification code.', 429);
    }
    primex_record_email_rate_attempt('sec_otp_ip', $ip, 15, 900);
    primex_record_email_rate_attempt('sec_otp_forgot_pw', $email, 5, 900);

    $genericMsg = 'If an account matches that email address, a 6-digit verification code has been sent.';
    $profile = primex_find_profile_by_email($supabase, $email);
    if ($profile && (!isset($profile['is_active']) || (bool)$profile['is_active'])) {
        $otpRes = primex_issue_scoped_otp($supabase, 'forgot_password', $email, 600);
        if (!empty($otpRes['success']) && !empty($otpRes['code'])) {
            $firstName = trim((string)($profile['first_name'] ?? ''));
            $tpl = primex_email_template_security_code($firstName, 'Password Reset Verification', (string)$otpRes['code'], 10);
            $mailRes = primex_send_templated_email($email, $tpl);
            primex_record_log(
                'EMAIL',
                !empty($mailRes['success']) ? 'FORGOT_PASSWORD_OTP_SENT' : 'FORGOT_PASSWORD_OTP_FAILED',
                'Forgot password OTP dispatched',
                ['expires_minutes' => 10],
                !empty($mailRes['success']) ? 'INFO' : 'WARNING',
                (string)($profile['id'] ?? ''),
                $email
            );
        }
    }

    sendSuccess([
        'sent' => true,
        'expires_in_seconds' => 600,
    ], $genericMsg);
}

$user = requireAuth();
if (!empty($user['_admin_preview'])) {
    sendError('PREVIEW_READONLY', 'Security verification codes cannot be sent in read-only admin preview mode.', 403);
}

$userId = (string)($user['id'] ?? '');
$accountEmail = strtolower(trim((string)($user['email'] ?? '')));
$firstName = trim((string)($user['first_name'] ?? ''));
$targetEmail = $accountEmail;
$purposeLabel = 'Account Security Verification';

if ($action === 'change_email') {
    $newEmail = strtolower(trim((string)($body['email'] ?? $body['new_email'] ?? '')));
    if ($newEmail === '' || !filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
        sendError('VALIDATION_ERROR', 'Please enter a valid new email address first.', 400);
    }
    if ($newEmail === $accountEmail) {
        sendError('VALIDATION_ERROR', 'Please enter a different email address than your current email.', 400);
    }
    if (primex_is_admin_email($newEmail) && !primex_is_admin_email($accountEmail)) {
        sendError('EMAIL_RESERVED', 'This email address is reserved and cannot be assigned.', 403);
    }
    $existing = primex_find_profile_by_email($supabase, $newEmail);
    if ($existing !== null && (string)($existing['id'] ?? '') !== $userId) {
        sendError('EMAIL_TAKEN', 'This email address is already in use by another account.', 409);
    }
    $targetEmail = $newEmail;
    $purposeLabel = 'Email Address Update';
} elseif ($action === 'change_password') {
    $purposeLabel = 'Login Password Change';
} elseif ($action === 'change_pin') {
    $purposeLabel = 'Withdrawal PIN Update';
} elseif ($action === 'forgot_pin') {
    $purposeLabel = 'Withdrawal PIN Recovery';
}

if ($targetEmail === '' || !filter_var($targetEmail, FILTER_VALIDATE_EMAIL)) {
    sendError('VALIDATION_ERROR', 'Your account does not have a valid email address on file.', 400);
}

$rateKey = $action . '|' . $userId . '|' . $targetEmail;
if (!primex_check_email_rate_limit('sec_otp_user', $rateKey, 5, 900, 45)) {
    sendError('RATE_LIMITED', 'Please wait at least 45 seconds before requesting another verification code.', 429);
}

primex_record_email_rate_attempt('sec_otp_ip', $ip, 15, 900);
primex_record_email_rate_attempt('sec_otp_user', $rateKey, 5, 900);

$otpRes = primex_issue_scoped_otp($supabase, $action, $targetEmail, 600);
if (empty($otpRes['success']) || empty($otpRes['code'])) {
    sendError('OTP_GENERATION_FAILED', 'Unable to generate verification code right now. Please try again.', 500);
}

$tpl = primex_email_template_security_code($firstName, $purposeLabel, (string)$otpRes['code'], 10);
$mailRes = primex_send_templated_email($targetEmail, $tpl);
if (empty($mailRes['success'])) {
    primex_record_log('EMAIL', 'SECURITY_OTP_SEND_FAILED', 'Failed sending security verification code', ['action' => $action], 'WARNING', $userId, $targetEmail);
    sendError('EMAIL_SEND_FAILED', 'Unable to send verification code email right now. Please try again shortly.', 503);
}

primex_record_log('EMAIL', 'SECURITY_OTP_SENT', 'Security verification code dispatched', ['action' => $action], 'INFO', $userId, $targetEmail);

$maskedEmail = $targetEmail;
if (strpos($targetEmail, '@') !== false) {
    [$localPart, $domainPart] = explode('@', $targetEmail, 2);
    $maskedLocal = strlen($localPart) > 2 ? (substr($localPart, 0, 2) . str_repeat('*', max(2, strlen($localPart) - 2))) : (substr($localPart, 0, 1) . '*');
    $maskedEmail = $maskedLocal . '@' . $domainPart;
}

sendSuccess([
    'sent' => true,
    'action' => $action,
    'masked_email' => $maskedEmail,
    'expires_in_seconds' => 600,
], 'A 6-digit verification code has been sent to ' . $maskedEmail . '.');
