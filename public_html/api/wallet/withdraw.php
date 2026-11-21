<?php
/**
 * User Withdrawal Request - Direct Supabase REST
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$input = getJsonBody();
$amount = (float)($input['amount'] ?? 0);
$asset = strtoupper(trim($input['asset'] ?? 'USDT'));
$network = strtoupper(trim($input['network'] ?? 'TRC20'));
$destination = trim($input['destination_address'] ?? $input['destination'] ?? '');
$withdrawalPin = trim($input['withdrawal_pin'] ?? $input['fund_password'] ?? $input['pin'] ?? '');

if ($amount < 3) {
    sendError('MIN_WITHDRAWAL', 'Minimum withdrawal amount is 3 USDT');
}

if (empty($destination)) {
    sendError('MISSING_DESTINATION', 'Destination blockchain address is required');
}

if (empty($withdrawalPin) || !preg_match('/^\d{6}$/', $withdrawalPin)) {
    sendError('INVALID_PIN', 'A 6-digit fund withdrawal PIN is required to authorize withdrawals');
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

// Check PIN (fail closed if profile query fails)
checkWithdrawalPinRateLimit((string)$user['id']);
$profRes = $supabase->select('profiles', ['id' => "eq.{$user['id']}", 'limit' => '1']);
if (!$profRes['success'] || empty($profRes['data'][0])) {
    sendError('PROFILE_LOOKUP_FAILED', 'Unable to verify withdrawal PIN right now. Please try again.', 502);
}
$prof = $profRes['data'][0];

$storedPin = (string)($prof['withdrawal_pin'] ?? '');
$storedHash = (string)($prof['withdrawal_pin_hash'] ?? '');

$pinMatches = false;
if ($storedHash !== '' && password_verify($withdrawalPin, $storedHash)) {
    $pinMatches = true;
} elseif ($storedPin !== '' && hash_equals($storedPin, $withdrawalPin)) {
    $pinMatches = true;
} elseif ($storedPin === '' && $storedHash === '') {
    $initPinRes = $supabase->update('profiles', [
        'withdrawal_pin' => null,
        'withdrawal_pin_hash' => password_hash($withdrawalPin, PASSWORD_BCRYPT),
        'updated_at' => gmdate('Y-m-d H:i:s')
    ], ['id' => "eq.{$user['id']}"]);
    if (empty($initPinRes['success'])) {
        sendError('PIN_UPDATE_FAILED', 'Unable to initialize withdrawal PIN. Please try again.', 502);
    }
    $pinMatches = true;
}

if (!$pinMatches) {
    recordWithdrawalPinFailure((string)$user['id']);
    sendError('INVALID_PIN', 'Incorrect 6-digit fund withdrawal PIN');
}

clearWithdrawalPinFailures((string)$user['id']);
if ($storedPin !== '') {
    $supabase->update('profiles', [
        'withdrawal_pin' => null,
        'withdrawal_pin_hash' => password_hash($withdrawalPin, PASSWORD_BCRYPT),
        'updated_at' => gmdate('Y-m-d H:i:s')
    ], ['id' => "eq.{$user['id']}"]);
}

$idempotencyKey = trim((string)($input['idempotency_key'] ?? ($_SERVER['HTTP_X_IDEMPOTENCY_KEY'] ?? '')));
if ($idempotencyKey === '') {
    sendError('IDEMPOTENCY_KEY_REQUIRED', 'Please submit the withdrawal once using the current button.');
}

// The wallet deduction, withdrawal row, and ledger entry are now performed in one
// PostgreSQL transaction. Duplicate clicks/retries with the same idempotency key
// return the original result without a second debit.
$fee = 1.0;
$withId = 'with_' . bin2hex(random_bytes(8));

$rpc = $supabase->rpc('submit_withdrawal_once', [
    'p_user_id' => (string)$user['id'],
    'p_idempotency_key' => $idempotencyKey,
    'p_withdrawal_id' => $withId,
    'p_asset' => $asset,
    'p_network' => $network,
    'p_destination' => $destination,
    'p_amount' => $amount,
    'p_fee' => $fee
]);

if (!$rpc['success']) {
    $msg = (string)($rpc['message'] ?? $rpc['error'] ?? 'Withdrawal processing failed.');
    if (stripos($msg, 'INSUFFICIENT_FUNDS') !== false) {
        sendError('INSUFFICIENT_FUNDS', 'Insufficient available balance in Funding Wallet.', 400);
    }
    sendError('WITHDRAWAL_SUBMIT_FAILED', $msg, 502);
}

$result = $rpc['data'];
if (is_array($result) && isset($result[0]) && is_array($result[0])) $result = $result[0];
if (!is_array($result)) $result = [];
if (($result['success'] ?? false) === false) {
    sendError((string)($result['error_code'] ?? 'WITHDRAWAL_SUBMIT_FAILED'), (string)($result['message'] ?? 'Withdrawal request failed.'), 400);
}

sendSuccess([
    'withdrawal_id' => $result['withdrawal_id'] ?? $withId,
    'amount' => (float)($result['amount'] ?? $amount),
    'fee' => (float)($result['fee'] ?? $fee),
    'net_amount' => (float)($result['net_amount'] ?? max(0, $amount - $fee)),
    'status' => $result['status'] ?? 'REQUESTED',
    'new_balance' => (float)($result['new_balance'] ?? 0),
    'already_processed' => !empty($result['already_processed'])
], !empty($result['already_processed']) ? 'This withdrawal request was already submitted once.' : 'Withdrawal request submitted for compliance verification');
