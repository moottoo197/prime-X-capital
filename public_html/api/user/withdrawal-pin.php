<?php
/**
 * User Withdrawal PIN Setting - Direct Supabase REST
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = getCurrentUser();
if (!$user) {
    sendError('UNAUTHORIZED', 'Authentication required', 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$input = getJsonBody();
$pin = trim($input['pin'] ?? $input['withdrawal_pin'] ?? '');

if (empty($pin) || !preg_match('/^\d{6}$/', $pin)) {
    sendError('INVALID_PIN', 'PIN must be exactly 6 numeric digits');
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

$pinHash = password_hash($pin, PASSWORD_BCRYPT);
$supabase->update('profiles', [
    'withdrawal_pin' => null,
    'withdrawal_pin_hash' => $pinHash,
    'updated_at' => gmdate('Y-m-d H:i:s')
], ['id' => "eq.{$user['id']}"]);

sendSuccess(['has_withdrawal_pin' => true], 'Fund withdrawal PIN saved successfully in Supabase');
