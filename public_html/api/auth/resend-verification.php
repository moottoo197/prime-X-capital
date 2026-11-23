<?php
/**
 * Resend Email Verification Endpoint
 * Rate-limited; supports authenticated users and non-enumerating email requests.
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

$currentUser = getCurrentUser();
$body = getJsonBody();
$requestedEmail = strtolower(trim((string)($body['email'] ?? '')));

if ($currentUser && empty($currentUser['_admin_preview'])) {
    $targetEmail = strtolower(trim((string)($currentUser['email'] ?? '')));
    if (primex_is_email_verified_resolved($currentUser, $supabase)) {
        sendSuccess(['already_verified' => true, 'email_verified' => true, 'sent' => false], 'Your email address is already verified.');
    }
    $rateKey = 'user:' . (string)$currentUser['id'];
    if (!primex_check_email_rate_limit('resend_verification', $rateKey, 3, 900, 60)) {
        sendError('RATE_LIMITED', 'Please wait at least 60 seconds before requesting another verification email.', 429);
    }
    primex_record_email_rate_attempt('resend_verification', $rateKey, 3, 900);

    $userId = (string)$currentUser['id'];
    $firstName = trim((string)($currentUser['first_name'] ?? ''));
    $tokenRes = primex_issue_auth_token($supabase, 'email_verification', $userId, $targetEmail, 86400);
    $sent = false;
    if (!empty($tokenRes['success']) && !empty($tokenRes['token'])) {
        $verifyUrl = primex_app_url() . '/?verify_token=' . rawurlencode($tokenRes['token']);
        $tpl = primex_email_template_verify_email($firstName, $verifyUrl, 24);
        $mailRes = primex_send_templated_email($targetEmail, $tpl);
        $sent = !empty($mailRes['success']);
    }
    if (!$sent) {
        sendError('EMAIL_SEND_FAILED', 'Unable to send verification email right now. Please try again later.', 503);
    }
    primex_record_log('EMAIL', 'VERIFICATION_RESENT', 'User requested verification email resend', [], 'INFO', $userId, $targetEmail);
    sendSuccess(['sent' => true], 'A new confirmation email has been sent to your inbox.');
}

// Unauthenticated fallback: strict non-enumerating response
if ($requestedEmail === '' || !filter_var($requestedEmail, FILTER_VALIDATE_EMAIL)) {
    sendError('VALIDATION_ERROR', 'Please enter a valid email address.', 400);
}

if (!primex_check_email_rate_limit('resend_verification', $requestedEmail, 3, 900, 60)) {
    sendError('RATE_LIMITED', 'Please wait a few minutes before requesting another verification email.', 429);
}
primex_record_email_rate_attempt('resend_verification', $requestedEmail, 3, 900);

$profile = primex_find_profile_by_email($supabase, $requestedEmail);
if ($profile && (!isset($profile['is_active']) || (bool)$profile['is_active']) && !primex_is_email_verified_resolved($profile, $supabase)) {
    $userId = (string)$profile['id'];
    $firstName = trim((string)($profile['first_name'] ?? ''));
    $tokenRes = primex_issue_auth_token($supabase, 'email_verification', $userId, $requestedEmail, 86400);
    if (!empty($tokenRes['success']) && !empty($tokenRes['token'])) {
        $verifyUrl = primex_app_url() . '/?verify_token=' . rawurlencode($tokenRes['token']);
        $tpl = primex_email_template_verify_email($firstName, $verifyUrl, 24);
        $mailRes = primex_send_templated_email($requestedEmail, $tpl);
        primex_record_log(
            'EMAIL',
            !empty($mailRes['success']) ? 'VERIFICATION_RESENT' : 'VERIFICATION_RESEND_FAILED',
            'Processed verification resend request',
            [],
            !empty($mailRes['success']) ? 'INFO' : 'WARNING',
            $userId,
            $requestedEmail
        );
    }
}

sendSuccess([
    'sent' => true
], 'If an unverified account matches that email address, a confirmation link has been sent.');
