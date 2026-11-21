<?php
/**
 * User Withdrawal PIN Setting - Direct Supabase REST
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$input = getJsonBody();
$pin = trim((string)($input['new_pin'] ?? $input['pin'] ?? $input['withdrawal_pin'] ?? ''));
$currentPin = trim((string)($input['current_pin'] ?? ''));

if (empty($pin) || !preg_match('/^\d{6}$/', $pin)) {
    sendError('INVALID_PIN', 'PIN must be exactly 6 numeric digits');
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

$profRes = $supabase->select('profiles', [
    'id' => 'eq.' . $user['id'],
    'select' => 'id,withdrawal_pin,withdrawal_pin_hash',
    'limit' => '1'
]);
if (!$profRes['success'] || empty($profRes['data'][0])) {
    sendError('PROFILE_LOOKUP_FAILED', 'Unable to verify existing withdrawal PIN state. Please try again.', 502);
}

$prof = $profRes['data'][0];
$storedPin = (string)($prof['withdrawal_pin'] ?? '');
$storedHash = (string)($prof['withdrawal_pin_hash'] ?? '');

if ($storedPin !== '' || $storedHash !== '') {
    if ($currentPin === '' || !preg_match('/^\d{6}$/', $currentPin)) {
        sendError('CURRENT_PIN_REQUIRED', 'Current 6-digit withdrawal PIN is required to update your PIN.', 400);
    }
    checkWithdrawalPinRateLimit((string)$user['id']);
    $matches = false;
    if ($storedHash !== '' && password_verify($currentPin, $storedHash)) {
        $matches = true;
    } elseif ($storedPin !== '' && hash_equals($storedPin, $currentPin)) {
        $matches = true;
    }
    if (!$matches) {
        recordWithdrawalPinFailure((string)$user['id']);
        sendError('INCORRECT_PIN', 'Current 6-digit withdrawal PIN is incorrect.', 403);
    }
    clearWithdrawalPinFailures((string)$user['id']);
}

$pinHash = password_hash($pin, PASSWORD_BCRYPT);
$updRes = $supabase->update('profiles', [
    'withdrawal_pin' => null,
    'withdrawal_pin_hash' => $pinHash,
    'updated_at' => gmdate('Y-m-d H:i:s')
], ['id' => "eq.{$user['id']}"]);

if (empty($updRes['success'])) {
    sendError('PIN_UPDATE_FAILED', 'Unable to save fund withdrawal PIN right now. Please try again.', 502);
}

sendSuccess(['has_withdrawal_pin' => true], 'Fund withdrawal PIN saved successfully in Supabase');
