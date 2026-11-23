<?php
/**
 * Admin Reset User Password - Direct Supabase Profiles & Auth
 */
require_once dirname(dirname(__DIR__)) . '/bootstrap.php';
require_once dirname(dirname(__DIR__)) . '/lib/auth_tokens.php';

$admin = requireAdmin();

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$input = getJsonBody();
$userId = trim($input['user_id'] ?? $input['id'] ?? '');
$newPassword = trim((string)($input['new_password'] ?? $input['password'] ?? ''));
if ($newPassword === '' || strlen($newPassword) < 10 || !preg_match('/[A-Z]/', $newPassword) || !preg_match('/[a-z]/', $newPassword) || !preg_match('/\d/', $newPassword) || !preg_match('/[^A-Za-z0-9]/', $newPassword)) { sendError('WEAK_PASSWORD', 'A strong password of at least 10 characters with upper, lower, number and symbol is required.'); }

if (empty($userId)) {
    sendError('VALIDATION_ERROR', 'User ID is required');
}

$hash = primex_hash_password($newPassword);
primex_delete_sessions_by_user($userId);
@$supabase->authAdminUpdateUser($userId, ['password' => $newPassword]);

$supabase->update('profiles', [
    'password_hash' => $hash,
    'updated_at' => gmdate('Y-m-d H:i:s')
], ['id' => "eq.{$userId}"]);

sendSuccess([
    'user_id' => $userId,
    'password_reset' => true
], 'User password reset successfully in Supabase');
