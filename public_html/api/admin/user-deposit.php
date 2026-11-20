<?php
/**
 * Admin Submit Deposit for Selected User - creates a normal PENDING deposit request.
 * This endpoint is intentionally separate from user deposit submission so the
 * admin user-view remains read-only except for this explicitly authorized action.
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/deposit_addresses.php';

$admin = requireAdmin();
$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'Only POST is supported.', 405);
}

$input = getJsonBody();
$targetUserId = trim((string)($input['user_id'] ?? ''));
$amount = (float)($input['amount'] ?? 0);
$asset = strtoupper(trim((string)($input['asset'] ?? 'USDT')));
$network = strtoupper(trim((string)($input['network'] ?? 'TRC20')));
$txHash = trim((string)($input['tx_hash'] ?? ''));
$senderAddress = trim((string)($input['sender_address'] ?? ''));
$idempotencyKey = trim((string)($input['idempotency_key'] ?? ($_SERVER['HTTP_X_IDEMPOTENCY_KEY'] ?? '')));

if ($targetUserId === '') sendError('VALIDATION_ERROR', 'Target user is required.');
if ($amount <= 0) sendError('VALIDATION_ERROR', 'Deposit amount must be greater than zero.');
if (!in_array($asset, ['USDT'], true)) sendError('VALIDATION_ERROR', 'Only USDT deposits are supported.');
if (!in_array($network, ['TRC20', 'ERC20', 'BEP20'], true)) sendError('VALIDATION_ERROR', 'Unsupported deposit network.');
if ($idempotencyKey === '') sendError('IDEMPOTENCY_KEY_REQUIRED', 'A one-time action key is required.');

// Verify the target account exists before creating a request.
$profileRes = $supabase->select('profiles', ['id' => 'eq.' . $targetUserId, 'limit' => '1']);
if (!$profileRes['success'] || empty($profileRes['data'][0])) {
    sendError('USER_NOT_FOUND', 'Selected user account was not found.', 404);
}

$defaultAddresses = getPermanentDepositAddresses($supabase);
if (!isset($defaultAddresses[$network])) {
    sendError('UNSUPPORTED_DEPOSIT_NETWORK', 'Only USDT TRC20, ERC20, and BEP20 deposits are supported.', 400);
}
$depositAddress = $defaultAddresses[$network];
$actualTxHash = $txHash !== '' ? $txHash : ('ADMIN-' . strtoupper(bin2hex(random_bytes(16))));
$depId = 'dep_admin_' . bin2hex(random_bytes(8));

// Prefer the same atomic/idempotent submission RPC used by the normal user flow.
$rpc = $supabase->rpc('submit_deposit_once', [
    'p_user_id' => $targetUserId,
    'p_idempotency_key' => $idempotencyKey,
    'p_deposit_id' => $depId,
    'p_asset' => $asset,
    'p_network' => $network,
    'p_amount' => $amount,
    'p_deposit_address' => $depositAddress,
    'p_tx_hash' => $actualTxHash
]);

$result = [];
if ($rpc['success']) {
    $result = $rpc['data'];
    if (is_array($result) && isset($result[0]) && is_array($result[0])) $result = $result[0];
    if (!is_array($result)) $result = [];
} else {
    $rpcMsg = (string)($rpc['message'] ?? $rpc['error'] ?? '');
    $rpcMissing = stripos($rpcMsg, 'PGRST202') !== false
        || stripos($rpcMsg, 'submit_deposit_once') !== false
        || stripos($rpcMsg, 'schema cache') !== false;
    if (!$rpcMissing) {
        sendError('DEPOSIT_SUBMIT_FAILED', $rpcMsg ?: 'Deposit request could not be created.', 502);
    }
}

$recordedDepositId = trim((string)($result['deposit_id'] ?? $depId));

// Verify persistence. If the installed RPC is unavailable or did not create
// the public deposits row, create a normal PENDING row directly. This never
// credits the wallet and leaves approval to the existing Admin Deposits desk.
$verify = $supabase->select('deposits', [
    'user_id' => 'eq.' . $targetUserId,
    'id' => 'eq.' . $recordedDepositId,
    'select' => 'id,status,amount,asset,network,tx_hash',
    'limit' => '1'
]);
if (!$verify['success'] || empty($verify['data'][0])) {
    $direct = $supabase->insert('deposits', [[
        'id' => $depId,
        'user_id' => $targetUserId,
        'asset' => $asset,
        'network' => $network,
        'amount' => $amount,
        'fee' => 0,
        'net_amount' => $amount,
        'deposit_address' => $depositAddress,
        'tx_hash' => $actualTxHash,
        'status' => 'PENDING',
        'created_at' => gmdate('Y-m-d H:i:s'),
        'updated_at' => gmdate('Y-m-d H:i:s')
    ]]);
    if (!$direct['success']) {
        sendError('DEPOSIT_NOT_RECORDED', (string)($direct['message'] ?? $direct['error'] ?? 'Deposit request could not be recorded.'), 502);
    }
    $recordedDepositId = $depId;
}

sendSuccess([
    'deposit_id' => $recordedDepositId,
    'user_id' => $targetUserId,
    'status' => 'PENDING',
    'amount' => $amount,
    'asset' => $asset,
    'network' => $network,
    'sender_address' => $senderAddress,
    'submitted_by_admin' => true
], 'Deposit request submitted for the selected user. It is pending Admin approval.');
