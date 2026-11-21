<?php
/**
 * User Update Profile & Email - Pure Supabase REST Architecture
 */
require_once dirname(__DIR__) . '/bootstrap.php';

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

$updateData = [
    'email' => $email,
    'updated_at' => gmdate('Y-m-d H:i:s')
];

$res = $supabase->update('profiles', $updateData, ['id' => "eq.{$userId}"]);
if (empty($res['success'])) {
    sendError('EMAIL_UPDATE_FAILED', 'Unable to update email right now. Please try again.', 502);
}

$profRes = $supabase->select('profiles', ['id' => "eq.{$userId}", 'limit' => '1']);
$updatedUser = ($profRes['success'] && !empty($profRes['data'][0])) ? $profRes['data'][0] : array_merge($user, ['email' => $email]);
$updatedUser['has_withdrawal_pin'] = !empty($updatedUser['withdrawal_pin']) || !empty($updatedUser['withdrawal_pin_hash']);
unset($updatedUser['withdrawal_pin'], $updatedUser['withdrawal_pin_hash'], $updatedUser['password_hash']);

sendSuccess([
    'user' => $updatedUser
], 'Email updated successfully in Supabase!');
