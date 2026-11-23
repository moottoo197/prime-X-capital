<?php
/**
 * Admin-Only Protected Test Email Endpoint
 * Strictly requires authenticated administrator privileges and CSRF token.
 * Never exposes SMTP credentials or raw protocol errors.
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/mailer.php';
require_once dirname(__DIR__) . '/lib/email_templates.php';
require_once dirname(__DIR__) . '/lib/auth_tokens.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$admin = requireAdmin();
$adminId = (string)($admin['id'] ?? '');
$adminEmail = strtolower(trim((string)($admin['email'] ?? '')));

if (!primex_check_email_rate_limit('admin_test_email', $adminId ?: $adminEmail, 5, 600, 15)) {
    sendError('RATE_LIMITED', 'Please wait briefly before sending another test email.', 429);
}
primex_record_email_rate_attempt('admin_test_email', $adminId ?: $adminEmail, 5, 600);

$body = getJsonBody();
$recipient = strtolower(trim((string)($body['to'] ?? $body['email'] ?? $adminEmail)));
if ($recipient === '' || !filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
    sendError('VALIDATION_ERROR', 'Please provide a valid recipient email address.', 400);
}

$appUrl = primex_app_url();
$utcNow = gmdate('Y-m-d H:i:s') . ' UTC';
$bodyHtml = ''
    . '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#374151;">This is a test transactional email from your <strong>Prime X Capital</strong> SMTP service.</p>'
    . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0;background-color:#F7F8FA;border:1px solid #EEF1F6;border-radius:12px;">'
    . '<tr><td style="padding:14px 16px;font-size:13px;line-height:1.6;color:#374151;">'
    . '<strong>Relay Status:</strong> Outbound Hostinger SMTP authenticated<br>'
    . '<strong>Dispatched:</strong> ' . htmlspecialchars($utcNow, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</td></tr></table>'
    . '<p style="margin:0;font-size:12.5px;line-height:1.55;color:#6B7280;">If you did not trigger this test from the administrator console, review your administrator access logs.</p>';

$html = primex_email_layout(
    'SMTP Configuration Verified',
    'Prime X Capital Hostinger SMTP delivery test.',
    $bodyHtml,
    'Sent via Prime X Capital transactional email relay.',
    'DELIVERY VERIFIED',
    '#00B87C',
    '#ECFDF5'
);
$text = "Prime X Capital SMTP Delivery Test\n\n"
    . "Outbound mail delivery succeeded at {$utcNow}.\n"
    . "Platform URL: {$appUrl}\n";

$mailRes = primex_send_smtp_email($recipient, 'Prime X Capital SMTP Delivery Test', $html, null, $text);
if (empty($mailRes['success'])) {
    sendError('SMTP_TEST_FAILED', 'Test email could not be delivered. Check secure server logs for diagnostics.', 502);
}

primex_record_log('EMAIL', 'ADMIN_TEST_EMAIL_SENT', 'Admin dispatched SMTP verification email', [
    'recipient_domain' => substr(strrchr($recipient, '@') ?: '', 1),
], 'INFO', $adminId, $adminEmail);

sendSuccess([
    'sent' => true,
], 'Test email dispatched successfully.');
