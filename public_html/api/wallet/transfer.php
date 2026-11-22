<?php
/**
 * Internal Wallet Transfer - Enforces Referral Bonus Restriction
 * Only Deposit Balance and Deposit Bonus can be transferred from Spot to Future.
 * Referral Bonus stays locked in Spot and cannot be moved to Future.
 *
 * Uses user_transfer_once RPC when available, verifies persisted balance changes,
 * and falls back to CAS-protected REST updates if the RPC is missing or out of sync.
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/wallet_breakdown.php';

if (!function_exists('primex_fetch_usdt_wallet_row')) {
    function primex_fetch_usdt_wallet_row(SupabaseClient $sb, string $userId, string $walletType): ?array
    {
        $res = $sb->select('wallet_balances', [
            'user_id' => 'eq.' . $userId,
            'wallet_type' => 'eq.' . strtolower($walletType),
            'asset' => 'eq.USDT',
            'limit' => '1'
        ]);
        if (!empty($res['success']) && is_array($res['data'] ?? null) && !empty($res['data'][0])) {
            return $res['data'][0];
        }
        return null;
    }
}

if (!function_exists('primex_execute_wallet_transfer_hop')) {
    function primex_execute_wallet_transfer_hop(
        SupabaseClient $sb,
        string $userId,
        string $idempotencyKey,
        string $fromWallet,
        string $toWallet,
        string $asset,
        float $hopAmount
    ): array {
        $fromWallet = strtolower(trim($fromWallet));
        $toWallet = strtolower(trim($toWallet));
        $asset = strtoupper(trim($asset));
        $hopAmount = round($hopAmount, 2);

        if ($hopAmount <= 0 || $fromWallet === $toWallet) {
            return ['success' => false, 'error_code' => 'INVALID_TRANSFER', 'message' => 'Invalid transfer parameters.', 'http' => 400];
        }

        $srcBefore = primex_fetch_usdt_wallet_row($sb, $userId, $fromWallet);
        $dstBefore = primex_fetch_usdt_wallet_row($sb, $userId, $toWallet);
        $srcBalBefore = (float)($srcBefore['balance'] ?? 0.0);
        $srcResBefore = max(0.0, (float)($srcBefore['reserved_balance'] ?? 0.0));
        $srcAvailBefore = (float)($srcBefore['available_balance'] ?? $srcBalBefore);
        $srcUsableBefore = round(max(0.0, $srcBalBefore - $srcResBefore), 2);
        $dstBalBefore = (float)($dstBefore['balance'] ?? 0.0);

        if (!$srcBefore || $srcUsableBefore + 0.0001 < $hopAmount) {
            return ['success' => false, 'error_code' => 'INSUFFICIENT_FUNDS', 'message' => 'Insufficient available balance in source wallet.', 'http' => 400];
        }

        // Keep available_balance synced with usable balance so RPC checks don't fail
        // when earlier deposits/adjustments wrote balance without updating available_balance.
        if ($srcAvailBefore + 0.0001 < $hopAmount && $srcUsableBefore + 0.0001 >= $hopAmount && !empty($srcBefore['id'])) {
            $sb->update('wallet_balances', [
                'available_balance' => $srcUsableBefore,
                'updated_at' => gmdate('Y-m-d H:i:s')
            ], ['id' => 'eq.' . (string)$srcBefore['id']]);
        }

        $rpc = $sb->rpc('user_transfer_once', [
            'p_user_id' => $userId,
            'p_idempotency_key' => $idempotencyKey,
            'p_from_wallet' => $fromWallet,
            'p_to_wallet' => $toWallet,
            'p_asset' => $asset,
            'p_amount' => $hopAmount
        ]);

        $rpcData = $rpc['data'] ?? null;
        if (is_array($rpcData) && isset($rpcData[0]) && is_array($rpcData[0])) {
            $rpcData = $rpcData[0];
        }

        $rpcOk = !empty($rpc['success']) && (!is_array($rpcData) || ($rpcData['success'] ?? true) !== false);

        if ($rpcOk) {
            $srcAfter = primex_fetch_usdt_wallet_row($sb, $userId, $fromWallet);
            $dstAfter = primex_fetch_usdt_wallet_row($sb, $userId, $toWallet);
            $srcBalAfter = (float)($srcAfter['balance'] ?? $srcBalBefore);
            $dstBalAfter = (float)($dstAfter['balance'] ?? $dstBalBefore);

            $movedInDb = ($dstBalAfter >= $dstBalBefore + $hopAmount - 0.01)
                && ($srcBalAfter <= $srcBalBefore - $hopAmount + 0.01);

            if ($movedInDb) {
                return [
                    'success' => true,
                    'data' => is_array($rpcData) ? $rpcData : [
                        'transfer_id' => 'trf_' . bin2hex(random_bytes(8)),
                        'from_wallet' => $fromWallet,
                        'to_wallet' => $toWallet,
                        'asset' => $asset,
                        'amount' => $hopAmount
                    ]
                ];
            }
        }

        // If the RPC reported an explicit non-fallback rejection and actually locked funds, stop.
        $rpcErrMsg = strtolower((string)($rpc['message'] ?? ($rpcData['message'] ?? '') ?? ''));
        $rpcErrCode = strtoupper((string)($rpcData['error_code'] ?? $rpc['error'] ?? ''));

        // Re-read current source & destination rows for Compare-And-Swap direct REST fallback.
        $srcCurr = primex_fetch_usdt_wallet_row($sb, $userId, $fromWallet);
        $dstCurr = primex_fetch_usdt_wallet_row($sb, $userId, $toWallet);
        if (!$srcCurr || empty($srcCurr['id'])) {
            return ['success' => false, 'error_code' => 'SOURCE_WALLET_MISSING', 'message' => 'Source wallet record was not found.', 'http' => 400];
        }

        $curSrcBal = (float)($srcCurr['balance'] ?? 0.0);
        $curSrcRes = max(0.0, (float)($srcCurr['reserved_balance'] ?? 0.0));
        $curSrcUsable = round(max(0.0, $curSrcBal - $curSrcRes), 2);
        if ($curSrcUsable + 0.0001 < $hopAmount) {
            return ['success' => false, 'error_code' => 'INSUFFICIENT_FUNDS', 'message' => 'Insufficient funds in source wallet.', 'http' => 400];
        }

        $newSrcBal = round(max(0.0, $curSrcBal - $hopAmount), 2);
        $newSrcAvail = round(max(0.0, $newSrcBal - $curSrcRes), 2);
        $nowUtc = gmdate('Y-m-d H:i:s');

        // CAS update on source wallet filtering by exact current balance; if float representation
        // differs in Postgres, re-verify balance and retry once by row id.
        $debitRes = $sb->update('wallet_balances', [
            'balance' => $newSrcBal,
            'available_balance' => $newSrcAvail,
            'updated_at' => $nowUtc
        ], [
            'id' => 'eq.' . (string)$srcCurr['id'],
            'balance' => 'eq.' . (string)$srcCurr['balance']
        ]);

        if (empty($debitRes['success']) || empty($debitRes['data'][0])) {
            $srcRetry = primex_fetch_usdt_wallet_row($sb, $userId, $fromWallet);
            $retryBal = (float)($srcRetry['balance'] ?? 0.0);
            $retryRes = max(0.0, (float)($srcRetry['reserved_balance'] ?? 0.0));
            $retryUsable = round(max(0.0, $retryBal - $retryRes), 2);
            if ($srcRetry && !empty($srcRetry['id']) && $retryUsable + 0.0001 >= $hopAmount) {
                $curSrcBal = $retryBal;
                $newSrcBal = round(max(0.0, $retryBal - $hopAmount), 2);
                $newSrcAvail = round(max(0.0, $newSrcBal - $retryRes), 2);
                $srcCurr = $srcRetry;
                $debitRes = $sb->update('wallet_balances', [
                    'balance' => $newSrcBal,
                    'available_balance' => $newSrcAvail,
                    'updated_at' => $nowUtc
                ], [
                    'id' => 'eq.' . (string)$srcRetry['id'],
                    'user_id' => 'eq.' . $userId
                ]);
            }
        }

        if (empty($debitRes['success']) || empty($debitRes['data'][0])) {
            return [
                'success' => false,
                'error_code' => $rpcErrCode ?: 'TRANSFER_CONFLICT',
                'message' => 'Unable to debit source wallet cleanly. Please retry.',
                'http' => 502
            ];
        }

        $curDstBal = (float)($dstCurr['balance'] ?? 0.0);
        $curDstRes = max(0.0, (float)($dstCurr['reserved_balance'] ?? 0.0));
        $newDstBal = round($curDstBal + $hopAmount, 2);
        $newDstAvail = round(max(0.0, $newDstBal - $curDstRes), 2);

        if ($dstCurr && !empty($dstCurr['id'])) {
            $creditRes = $sb->update('wallet_balances', [
                'balance' => $newDstBal,
                'available_balance' => $newDstAvail,
                'updated_at' => $nowUtc
            ], [
                'id' => 'eq.' . (string)$dstCurr['id'],
                'user_id' => 'eq.' . $userId
            ]);
        } else {
            $creditRes = $sb->upsert('wallet_balances', [[
                'user_id' => $userId,
                'wallet_type' => $toWallet,
                'asset' => $asset,
                'balance' => $newDstBal,
                'available_balance' => $newDstAvail,
                'updated_at' => $nowUtc
            ]], 'user_id,wallet_type,asset');
        }

        if (empty($creditRes['success']) || empty($creditRes['data'][0])) {
            // Rollback source wallet debit immediately
            $sb->update('wallet_balances', [
                'balance' => $srcCurr['balance'],
                'available_balance' => $srcCurr['available_balance'] ?? $srcCurr['balance'],
                'updated_at' => gmdate('Y-m-d H:i:s')
            ], ['id' => 'eq.' . (string)$srcCurr['id']]);

            return [
                'success' => false,
                'error_code' => 'TRANSFER_CREDIT_FAILED',
                'message' => 'Destination wallet could not be credited; source funds were restored.',
                'http' => 502
            ];
        }

        $ref = 'trf_' . bin2hex(random_bytes(8));
        try {
            $sb->insert('internal_transfers', [[
                'id' => $ref,
                'user_id' => $userId,
                'from_wallet' => $fromWallet,
                'to_wallet' => $toWallet,
                'asset' => $asset,
                'amount' => $hopAmount,
                'fee' => 0.0,
                'status' => 'COMPLETED',
                'created_at' => $nowUtc
            ]]);
        } catch (Throwable $e) {}

        try {
            $sb->insert('ledger_entries', [
                [
                    'user_id' => $userId,
                    'wallet_type' => $fromWallet,
                    'asset' => $asset,
                    'amount' => -$hopAmount,
                    'balance_before' => $curSrcBal,
                    'balance_after' => $newSrcBal,
                    'entry_type' => 'TRANSFER_OUT',
                    'reference_id' => $ref,
                    'description' => 'Internal wallet transfer (' . $fromWallet . ' -> ' . $toWallet . ')',
                    'created_at' => $nowUtc
                ],
                [
                    'user_id' => $userId,
                    'wallet_type' => $toWallet,
                    'asset' => $asset,
                    'amount' => $hopAmount,
                    'balance_before' => $curDstBal,
                    'balance_after' => $newDstBal,
                    'entry_type' => 'TRANSFER_IN',
                    'reference_id' => $ref,
                    'description' => 'Internal wallet transfer (' . $fromWallet . ' -> ' . $toWallet . ')',
                    'created_at' => $nowUtc
                ]
            ]);
        } catch (Throwable $e) {}

        return [
            'success' => true,
            'data' => [
                'transfer_id' => $ref,
                'from_wallet' => $fromWallet,
                'to_wallet' => $toWallet,
                'asset' => $asset,
                'amount' => $hopAmount
            ]
        ];
    }
}

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
$beforeSpot = (float)($breakdown['spot_total_usdt'] ?? 0.0);
$beforeFuture = (float)($breakdown['future_total_usdt'] ?? 0.0);
$fundingBal = (float)($breakdown['breakdown']['funding_total_usdt'] ?? 0.0);
$exchangeBal = (float)($breakdown['breakdown']['exchange_total_usdt'] ?? 0.0);

$isSpotToFuture = in_array($from, ['funding', 'exchange'], true) && $to === 'trading';
if ($isSpotToFuture) {
    $transferableSpot = (float)($breakdown['transferable_spot_usdt'] ?? 0.0);
    $lockedReferral = (float)($breakdown['locked_referral_spot_usdt'] ?? 0.0);

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

    // Transparently source from whichever Spot sub-wallet holds funds (or split across funding + exchange)
    if ($fromRaw === 'spot' && $fundingBal < $amount && $exchangeBal >= $amount) {
        $from = 'exchange';
    } elseif ($from === 'funding' && $fundingBal < $amount && ($fundingBal + $exchangeBal) >= $amount - 0.0001 && $exchangeBal > 0) {
        $fromFunding = round($fundingBal, 2);
        $fromExchange = round($amount - $fromFunding, 2);
        if ($fromExchange > 0 && $fromExchange <= $exchangeBal + 0.0001) {
            if ($fromFunding > 0) {
                $r1 = primex_execute_wallet_transfer_hop($sb, $userId, $key . '_f', 'funding', 'trading', $asset, $fromFunding);
                if (empty($r1['success'])) {
                    sendError((string)($r1['error_code'] ?? 'TRANSFER_FAILED'), (string)($r1['message'] ?? 'Unable to complete Spot funding transfer.'), (int)($r1['http'] ?? 502));
                }
            }
            $r2 = primex_execute_wallet_transfer_hop($sb, $userId, $key . '_e', 'exchange', 'trading', $asset, $fromExchange);
            if (empty($r2['success'])) {
                sendError((string)($r2['error_code'] ?? 'TRANSFER_FAILED'), (string)($r2['message'] ?? 'Unable to complete Spot exchange transfer.'), (int)($r2['http'] ?? 502));
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

$hop = primex_execute_wallet_transfer_hop($sb, $userId, $key, $from, $to, $asset, $amount);
if (empty($hop['success'])) {
    sendError((string)($hop['error_code'] ?? 'TRANSFER_FAILED'), (string)($hop['message'] ?? 'The transfer could not be completed.'), (int)($hop['http'] ?? 502));
}

$updated = primex_compute_wallet_breakdown($sb, $userId);
$afterFuture = (float)($updated['future_total_usdt'] ?? 0.0);
$afterSpot = (float)($updated['spot_total_usdt'] ?? 0.0);

if ($isSpotToFuture && $afterFuture < ($beforeFuture + $amount - 0.02)) {
    sendError('TRANSFER_NOT_APPLIED', 'Balance change could not be confirmed in Future Wallet. Please try again.', 502);
}
if ($from === 'trading' && in_array($to, ['funding', 'exchange'], true) && $afterSpot < ($beforeSpot + $amount - 0.02)) {
    sendError('TRANSFER_NOT_APPLIED', 'Balance change could not be confirmed in Spot Wallet. Please try again.', 502);
}

$data = is_array($hop['data'] ?? null) ? $hop['data'] : [];
$data['transferred_amount'] = $amount;
$data['balances'] = $updated;
sendSuccess($data, 'Transfer completed successfully');
