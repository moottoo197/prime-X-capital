<?php
/**
 * User Update Profile & Email - Pure Supabase REST Architecture
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/mailer.php';
require_once dirname(__DIR__) . '/lib/email_templates.php';
require_once dirname(__DIR__) . '/lib/auth_tokens.php';

$user = requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$userId = $user['id'];
$input = getJsonBody();
$email = strtolower(trim($input['email'] ?? ''));

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

$updateData = [
    'email' => $email,
    'updated_at' => gmdate('Y-m-d H:i:s')
];
if ($emailChanged) {
    $updateData['email_verified'] = 0;
    $updateData['email_verified_at'] = null;
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

$verificationSent = false;
if ($emailChanged) {
    primex_clear_email_verified_local((string)$userId, $oldEmail);
    $tokenRes = primex_issue_auth_token($supabase, 'email_verification', (string)$userId, $email, 86400);
    if (!empty($tokenRes['success']) && !empty($tokenRes['token'])) {
        $verifyUrl = primex_app_url() . '/?verify_token=' . rawurlencode($tokenRes['token']);
        $firstName = trim((string)($user['first_name'] ?? ''));
        $mailRes = primex_send_templated_email($email, primex_email_template_verify_email($firstName, $verifyUrl, 24));
        $verificationSent = !empty($mailRes['success']);
    }
}

$profRes = $supabase->select('profiles', ['id' => "eq.{$userId}", 'limit' => '1']);
$updatedUser = ($profRes['success'] && !empty($profRes['data'][0])) ? $profRes['data'][0] : array_merge($user, ['email' => $email, 'email_verified' => $emailChanged ? 0 : ($user['email_verified'] ?? 0)]);
$updatedUser['has_withdrawal_pin'] = !empty($updatedUser['withdrawal_pin']) || !empty($updatedUser['withdrawal_pin_hash']);
$updatedUser['email_verified'] = $emailChanged ? false : primex_is_email_verified_resolved($updatedUser, $supabase);
unset($updatedUser['withdrawal_pin'], $updatedUser['withdrawal_pin_hash'], $updatedUser['password_hash']);

sendSuccess([
    'user' => $updatedUser,
    'email' => $email,
    'email_verification_sent' => $verificationSent
], $verificationSent ? 'Email updated! Check your inbox to confirm your new email address.' : 'Email updated successfully.');
