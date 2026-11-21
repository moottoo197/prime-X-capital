<?php
/**
 * Internal Wallet Transfer - Enforces Referral Bonus Restriction
 * Only Deposit Balance and Deposit Bonus can be transferred from Spot to Future.
 * Referral Bonus stays locked in Spot and cannot be moved to Future.
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/wallet_breakdown.php';

$user = requireAuth();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$input = getJsonBody();
$amount = round((float)($input['amount'] ?? 0), 2);
$fromRaw = strtolower(trim((string)($input['from_wallet'] ?? $input['from'] ?? '')));
$toRaw = strtolower(trim((string)($input['to_wallet'] ?? $input['to'] ?? '')));
$asset = strtoupper(trim((string)($input['asset'] ?? 'USDT')));

$aliasMap = [
    'spot' => 'funding',
    'funding' => 'funding',
    'exchange' => 'exchange',
    'future' => 'trading',
    'futures' => 'trading',
    'trading' => 'trading'
];
$from = $aliasMap[$fromRaw] ?? $fromRaw;
$to = $aliasMap[$toRaw] ?? $toRaw;

if ($amount <= 0) {
    sendError('INVALID_AMOUNT', 'Transfer amount must be positive.');
}
if (!in_array($from, ['funding', 'exchange', 'trading'], true) || !in_array($to, ['funding', 'exchange', 'trading'], true) || $from === $to) {
    sendError('INVALID_WALLET', 'Invalid source or destination wallet.');
}
if ($asset !== 'USDT') {
    sendError('INVALID_ASSET', 'Internal transfers currently support USDT only.');
}

$key = trim((string)($_SERVER['HTTP_X_IDEMPOTENCY_KEY'] ?? $input['idempotency_key'] ?? ''));
if (!preg_match('/^[A-Za-z0-9._:-]{16,128}$/', $key)) {
    sendError('IDEMPOTENCY_KEY_REQUIRED', 'A unique idempotency key is required.', 400);
}

$sb = getSupabaseClient();
if (!$sb->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

$userId = (string)$user['id'];
$breakdown = primex_compute_wallet_breakdown($sb, $userId);

// Determine the actual wallet bucket inside Spot when user clicks "Spot -> Future".
$isSpotToFuture = in_array($from, ['funding', 'exchange'], true) && $to === 'trading';
if ($isSpotToFuture) {
    $transferableSpot = (float)($breakdown['transferable_spot_usdt'] ?? 0.0);
    $lockedReferral = (float)($breakdown['locked_referral_spot_usdt'] ?? 0.0);
    $fundingBal = (float)($breakdown['breakdown']['funding_total_usdt'] ?? 0.0);
    $exchangeBal = (float)($breakdown['breakdown']['exchange_total_usdt'] ?? 0.0);

    if ($transferableSpot <= 0.0) {
        sendError(
            'REFERRAL_BONUS_NOT_TRANSFERABLE',
            $lockedReferral > 0
                ? 'Referral Bonus ($' . number_format($lockedReferral, 2) . ' USDT) cannot be transferred from Spot to Future balance. Only Deposit Balance and Deposit Bonus can be transferred.'
                : 'No transferable Deposit or Deposit Bonus funds available in Spot Wallet.',
            400
        );
    }

    if ($amount > $transferableSpot + 0.0001) {
        sendError(
            'REFERRAL_BONUS_NOT_TRANSFERABLE',
            'Only Deposit Balance and Deposit Bonus ($' . number_format($transferableSpot, 2) . ' USDT max) can be transferred to Future. Referral Bonus ($' . number_format($lockedReferral, 2) . ' USDT) cannot be transferred.',
            400
        );
    }

    // If caller asked for 'spot' (which mapped to 'funding') and funding has less than amount while exchange holds the balance,
    // transparently source from whichever Spot sub-wallet has sufficient balance.
    if ($fromRaw === 'spot' && $fundingBal < $amount && $exchangeBal >= $amount) {
        $from = 'exchange';
    } elseif ($from === 'funding' && $fundingBal < $amount && ($fundingBal + $exchangeBal) >= $amount && $exchangeBal > 0) {
        // Split across exchange & funding atomically so combined Spot transfers work seamlessly.
        $fromFunding = round($fundingBal, 2);
        $fromExchange = round($amount - $fromFunding, 2);
        if ($fromExchange > 0 && $fromExchange <= $exchangeBal) {
            if ($fromFunding > 0) {
                $r1 = $sb->rpc('user_transfer_once', [
                    'p_user_id' => $userId,
                    'p_idempotency_key' => $key . '_f',
                    'p_from_wallet' => 'funding',
                    'p_to_wallet' => 'trading',
                    'p_asset' => $asset,
                    'p_amount' => $fromFunding
                ]);
                if (empty($r1['success'])) {
                    sendError('TRANSFER_FAILED', 'Unable to complete Spot funding transfer.', 502);
                }
            }
            $r2 = $sb->rpc('user_transfer_once', [
                'p_user_id' => $userId,
                'p_idempotency_key' => $key . '_e',
                'p_from_wallet' => 'exchange',
                'p_to_wallet' => 'trading',
                'p_asset' => $asset,
                'p_amount' => $fromExchange
            ]);
            if (empty($r2['success'])) {
                sendError('TRANSFER_FAILED', 'Unable to complete Spot exchange transfer.', 502);
            }
            $updated = primex_compute_wallet_breakdown($sb, $userId);
            sendSuccess([
                'transferred_amount' => $amount,
                'from_wallet' => 'spot',
                'to_wallet' => 'future',
                'balances' => $updated
            ], 'Transfer from Spot to Future completed successfully');
        }
    }
}

$res = $sb->rpc('user_transfer_once', [
    'p_user_id' => $userId,
    'p_idempotency_key' => $key,
    'p_from_wallet' => $from,
    'p_to_wallet' => $to,
    'p_asset' => $asset,
    'p_amount' => $amount
]);

if (!$res['success']) {
    $msg = strtolower((string)($res['message'] ?? ''));
    if (strpos($msg, 'insufficient') !== false) {
        sendError('INSUFFICIENT_FUNDS', 'Insufficient funds in source wallet.', 400);
    }
    sendError('TRANSFER_FAILED', 'The transfer could not be completed.', 502);
}

$data = is_array($res['data']) ? $res['data'] : [];
$data['balances'] = primex_compute_wallet_breakdown($sb, $userId);
sendSuccess($data, 'Transfer completed successfully');
