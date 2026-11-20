<?php
/**
 * User Update Profile & Email - Pure Supabase REST Architecture
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = getCurrentUser();
if (!$user) {
    sendError('UNAUTHORIZED', 'Authentication required', 401);
}

$userId = $user['id'];
$input = getJsonBody();
$email = strtolower(trim($input['email'] ?? ''));

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendError('VALIDATION_ERROR', 'A valid email address is required');
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

// Check if email already taken
$existing = $supabase->select('profiles', ['email' => "eq.{$email}", 'limit' => '1']);
if ($existing['success'] && !empty($existing['data'][0]) && $existing['data'][0]['id'] !== $userId) {
    sendError('EMAIL_TAKEN', 'This email address is already in use by another account');
}

$updateData = [
    'email' => $email,
    'updated_at' => gmdate('Y-m-d H:i:s')
];

$res = $supabase->update('profiles', $updateData, ['id' => "eq.{$userId}"]);

$profRes = $supabase->select('profiles', ['id' => "eq.{$userId}", 'limit' => '1']);
$updatedUser = ($profRes['success'] && !empty($profRes['data'][0])) ? $profRes['data'][0] : array_merge($user, ['email' => $email]);
$updatedUser['has_withdrawal_pin'] = !empty($updatedUser['withdrawal_pin']) || !empty($updatedUser['withdrawal_pin_hash']);
unset($updatedUser['withdrawal_pin'], $updatedUser['withdrawal_pin_hash'], $updatedUser['password_hash']);

sendSuccess([
    'user' => $updatedUser
], 'Email updated successfully in Supabase!');
