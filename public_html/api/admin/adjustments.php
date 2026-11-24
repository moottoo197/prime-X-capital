<?php
/**
 * Admin Balance Adjustments - atomic Supabase RPC
 * One UI action / idempotency key can change a balance only once.
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/wallet_breakdown.php';

$admin = requireAdmin();
$adminId = (string)($admin['id'] ?? '');
$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $res = $supabase->select('ledger_entries', [
        'entry_type' => 'eq.ADJUSTMENT',
        'order' => 'created_at.desc',
        'limit' => '100'
    ]);
    if (empty($res['success'])) {
        sendError('SUPABASE_QUERY_FAILED', 'Failed to retrieve adjustments: ' . ($res['message'] ?? 'Database error'), 502);
    }
    $adjustments = is_array($res['data'] ?? null) ? $res['data'] : [];
    sendSuccess(['adjustments' => $adjustments], 'Adjustments retrieved from Supabase');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonBody();
    $target = trim((string)($input['user_id'] ?? ''));
    // Admin convenience: accept the common Gmail typo where the @ is omitted
    // (e.g. namegmail.com -> name@gmail.com). Exact registered email remains
    // the source of truth; no other provider is guessed or altered.
    if ($target !== '' && strpos($target, '@') === false && preg_match('/^([^\s@]+)(gmail\.com)$/i', $target, $m)) {
        $target = $m[1] . '@' . $m[2];
    }
    $walletType = strtolower(trim((string)($input['wallet_type'] ?? 'funding')));
    $asset = strtoupper(trim((string)($input['asset'] ?? 'USDT')));
    $amount = round((float)($input['amount'] ?? 0), 2);
    $debitSource = strtolower(trim((string)($input['debit_source'] ?? '')));
    if ($debitSource !== '' && !in_array($debitSource, ['spot', 'future', 'referral'], true)) {
        sendError('VALIDATION_ERROR', 'Invalid debit source balance. Choose Spot, Future, or Referral.');
    }

    $adjustmentType = strtoupper(trim((string)($input['adjustment_type'] ?? 'OTHER')));
    if (!in_array($adjustmentType, ['DEPOSIT','REFERRAL_BONUS','PROFIT','OTHER'], true)) {
        sendError('VALIDATION_ERROR', 'Invalid adjustment type.');
    }
    $reasonText = trim((string)($input['reason'] ?? $input['description'] ?? 'Administrative Balance Adjustment'));
    $idempotencyKey = trim((string)($input['idempotency_key'] ?? ($_SERVER['HTTP_X_IDEMPOTENCY_KEY'] ?? '')));

    if ($idempotencyKey === '') {
        sendError('IDEMPOTENCY_KEY_REQUIRED', 'Please submit the adjustment once using the current form button.');
    }
    if (empty($target) || $amount == 0.0 || empty($reasonText)) {
        sendError('VALIDATION_ERROR', 'Target user and non-zero amount are required');
    }
    if (!in_array($walletType, ['funding', 'exchange', 'trading'], true)) {
        sendError('VALIDATION_ERROR', 'Invalid wallet type');
    }

    // For positive credits, enforce the Spot-only Referral Bonus rule as before.
    if ($amount > 0 && $adjustmentType === 'REFERRAL_BONUS' && $walletType === 'trading') {
        sendError('VALIDATION_ERROR', 'Referral Bonus is Spot-only and cannot be credited directly to Future/Trading wallet. Select Spot (Funding or Exchange).');
    }

    // Normalize debit source & ledger category for debits (negative adjustments).
    if ($amount < 0) {
        if ($debitSource === '') {
            if ($adjustmentType === 'REFERRAL_BONUS') {
                $debitSource = 'referral';
            } elseif ($walletType === 'trading') {
                $debitSource = 'future';
            } else {
                $debitSource = 'spot';
            }
        }
        if ($debitSource === 'referral') {
            $adjustmentType = 'REFERRAL_BONUS';
            if ($walletType === 'trading') $walletType = 'funding';
        } elseif ($debitSource === 'future') {
            $walletType = 'trading';
            if ($adjustmentType === 'REFERRAL_BONUS') $adjustmentType = 'OTHER';
        } elseif ($debitSource === 'spot') {
            if ($walletType === 'trading') $walletType = 'funding';
            if ($adjustmentType === 'REFERRAL_BONUS') $adjustmentType = 'OTHER';
        }
    }

    $description = '[' . $adjustmentType . '] ' . $reasonText;

    // Prevent manually adding a second signal-profit credit after the user has
    // already received an automated signal profit. Only explicit signal-profit
    // reasons are guarded; ordinary financial adjustments remain unchanged.
    $reasonNormalized = strtolower(preg_replace('/\s+/', ' ', $description));
    $isSignalProfitReason = (bool)preg_match('/\b(signal\s+profit|profit\s+signal)\b/i', $reasonNormalized);

    // Resolve target safely. The admin UI accepts UUID, registered email, or numeric UID.
    $profileRes = $supabase->select('profiles', ['id' => 'eq.' . $target, 'limit' => '1']);
    if ((!$profileRes['success'] || empty($profileRes['data'][0])) && filter_var($target, FILTER_VALIDATE_EMAIL)) {
        $profileRes = $supabase->select('profiles', ['email' => 'eq.' . $target, 'limit' => '1']);
    }
    if ((!$profileRes['success'] || empty($profileRes['data'][0])) && ctype_digit($target)) {
        $profileRes = $supabase->select('profiles', ['numeric_uid' => 'eq.' . $target, 'limit' => '1']);
    }
    if (!$profileRes['success'] || empty($profileRes['data'][0]['id'])) {
        sendError('USER_NOT_FOUND', 'Target user was not found. Use the user UUID, registered email, or numeric UID.', 404);
    }
    $userId = (string)$profileRes['data'][0]['id'];

    if ($isSignalProfitReason && $amount > 0) {
        $profitLedgerRes = $supabase->select('ledger_entries', [
            'user_id' => 'eq.' . $userId,
            'entry_type' => 'eq.TRADE_PNL',
            'asset' => 'eq.USDT',
            'amount' => 'gt.0',
            'select' => 'id,amount,description,reference_id,created_at',
            'limit' => '1'
        ]);
        if ($profitLedgerRes['success'] && !empty($profitLedgerRes['data'][0])) {
            sendError('SIGNAL_PROFIT_ALREADY_CREDITED', 'Signal profit is already credited to this user account. Do not add the signal profit again through Financial Adjustment.', 409);
        }
    }

    // Keep operator id where available without relying on client-provided headers.
    $operatorId = $adminId;
    // Idempotency scope is the current operator when known, otherwise a stable admin scope.
    $scopeUser = $operatorId !== '' ? $operatorId : 'ADMIN';

    // Build atomic RPC steps. For debits, verify live funds in the chosen bucket
    // (Spot, Future, or Referral) and route across Spot sub-wallets when needed.
    $rpcSteps = [];
    if ($amount < 0) {
        $absAmount = round(abs($amount), 2);
        $breakdown = primex_compute_wallet_breakdown($supabase, $userId);
        $fundingAvail = round((float)($breakdown['breakdown']['funding_total_usdt'] ?? 0.0), 2);
        $exchangeAvail = round((float)($breakdown['breakdown']['exchange_total_usdt'] ?? 0.0), 2);
        $spotTotal = round((float)($breakdown['spot_total_usdt'] ?? 0.0), 2);
        $futureAvail = round((float)($breakdown['future_total_usdt'] ?? 0.0), 2);
        $referralAvail = round((float)($breakdown['referral_bonus_usdt'] ?? 0.0), 2);
        $transferableSpot = round((float)($breakdown['transferable_spot_usdt'] ?? 0.0), 2);

        if ($debitSource === 'future') {
            if ($futureAvail + 0.0001 < $absAmount) {
                sendError('INSUFFICIENT_FUNDS', 'Insufficient Future balance. Available Future balance is $' . number_format($futureAvail, 2) . ' USDT.', 400);
            }
            $rpcSteps[] = ['wallet' => 'trading', 'amount' => -$absAmount, 'key' => $idempotencyKey];
        } elseif ($debitSource === 'referral') {
            if ($referralAvail + 0.0001 < $absAmount) {
                sendError('INSUFFICIENT_FUNDS', 'Insufficient Referral balance. Available Referral balance is $' . number_format($referralAvail, 2) . ' USDT.', 400);
            }
            if ($spotTotal + 0.0001 < $absAmount) {
                sendError('INSUFFICIENT_FUNDS', 'Insufficient Spot wallet funds to cover Referral debit ($' . number_format($spotTotal, 2) . ' USDT in Spot).', 400);
            }
            if ($fundingAvail + 0.0001 >= $absAmount) {
                $rpcSteps[] = ['wallet' => 'funding', 'amount' => -$absAmount, 'key' => $idempotencyKey];
            } elseif ($exchangeAvail + 0.0001 >= $absAmount) {
                $rpcSteps[] = ['wallet' => 'exchange', 'amount' => -$absAmount, 'key' => $idempotencyKey];
            } else {
                $first = round($fundingAvail, 2);
                $second = round($absAmount - $first, 2);
                if ($first > 0) $rpcSteps[] = ['wallet' => 'funding', 'amount' => -$first, 'key' => $idempotencyKey . ':f'];
                if ($second > 0) $rpcSteps[] = ['wallet' => 'exchange', 'amount' => -$second, 'key' => $idempotencyKey . ':e'];
            }
        } else {
            // $debitSource === 'spot'
            if ($transferableSpot + 0.0001 < $absAmount) {
                if ($referralAvail > 0 && ($spotTotal + 0.0001 >= $absAmount)) {
                    sendError('INSUFFICIENT_FUNDS', 'Only $' . number_format($transferableSpot, 2) . ' USDT is available in Spot balance (the remaining $' . number_format($referralAvail, 2) . ' USDT is Referral Balance). Select "Referral Balance" to debit referral funds.', 400);
                }
                sendError('INSUFFICIENT_FUNDS', 'Insufficient Spot balance. Available Spot balance is $' . number_format($transferableSpot, 2) . ' USDT.', 400);
            }
            if ($walletType === 'exchange' && ($exchangeAvail + 0.0001 >= $absAmount)) {
                $rpcSteps[] = ['wallet' => 'exchange', 'amount' => -$absAmount, 'key' => $idempotencyKey];
            } elseif ($fundingAvail + 0.0001 >= $absAmount) {
                $rpcSteps[] = ['wallet' => 'funding', 'amount' => -$absAmount, 'key' => $idempotencyKey];
            } elseif ($exchangeAvail + 0.0001 >= $absAmount) {
                $rpcSteps[] = ['wallet' => 'exchange', 'amount' => -$absAmount, 'key' => $idempotencyKey];
            } else {
                $first = round($fundingAvail, 2);
                $second = round($absAmount - $first, 2);
                if ($first > 0) $rpcSteps[] = ['wallet' => 'funding', 'amount' => -$first, 'key' => $idempotencyKey . ':f'];
                if ($second > 0) $rpcSteps[] = ['wallet' => 'exchange', 'amount' => -$second, 'key' => $idempotencyKey . ':e'];
            }
        }
    } else {
        $rpcSteps[] = ['wallet' => $walletType, 'amount' => $amount, 'key' => $idempotencyKey];
    }

    $lastResult = [];
    $firstPrevBalance = null;
    $alreadyProcessed = false;
    foreach ($rpcSteps as $step) {
        $rpc = $supabase->rpc('admin_adjust_balance_once', [
            'p_scope_user' => $scopeUser,
            'p_idempotency_key' => $step['key'],
            'p_user_id' => $userId,
            'p_wallet_type' => $step['wallet'],
            'p_asset' => $asset,
            'p_amount' => $step['amount'],
            'p_description' => $description,
            'p_operator_id' => $operatorId
        ]);

        if (!$rpc['success']) {
            $rpcMsg = (string)($rpc['message'] ?? $rpc['error'] ?? '');
            if (stripos($rpcMsg, 'PGRST202') !== false || stripos($rpcMsg, 'admin_adjust_balance_once') !== false) {
                sendError('BALANCE_ADJUSTMENT_MIGRATION_REQUIRED', 'Database duplicate-click protection is not installed. Run server/database/migrations/20260930_duplicate_click_protection.sql once in Supabase SQL Editor.', 503);
            }
            $msg = (string)($rpc['message'] ?? $rpc['error'] ?? 'Balance adjustment RPC failed.');
            if (stripos($msg, 'IDEMPOTENCY_KEY_REQUIRED') !== false) {
                sendError('IDEMPOTENCY_KEY_REQUIRED', 'A one-time action key is required for balance adjustments.');
            }
            sendError('BALANCE_ADJUSTMENT_FAILED', $msg, 502);
        }

        $result = $rpc['data'];
        if (is_array($result) && isset($result[0]) && is_array($result[0])) $result = $result[0];
        if (!is_array($result)) $result = [];

        if (($result['success'] ?? false) === false) {
            $code = (string)($result['error_code'] ?? 'BALANCE_ADJUSTMENT_FAILED');
            $status = $code === 'ACTION_IN_PROGRESS' ? 409 : 400;
            sendError($code, (string)($result['message'] ?? 'Balance adjustment failed.'), $status);
        }

        if ($firstPrevBalance === null) {
            $firstPrevBalance = (float)($result['previous_balance'] ?? 0);
        }
        if (!empty($result['already_processed'])) {
            $alreadyProcessed = true;
        }
        $lastResult = $result;
    }

    $updatedBreakdown = primex_compute_wallet_breakdown($supabase, $userId);
    $reportedWallet = $lastResult['wallet_type'] ?? ($rpcSteps[0]['wallet'] ?? $walletType);
    $reportedNewBalance = (float)($lastResult['new_balance'] ?? 0);
    if ($amount < 0) {
        if ($debitSource === 'spot') {
            $reportedNewBalance = (float)($updatedBreakdown['transferable_spot_usdt'] ?? $reportedNewBalance);
        } elseif ($debitSource === 'referral') {
            $reportedNewBalance = (float)($updatedBreakdown['referral_bonus_usdt'] ?? $reportedNewBalance);
        } elseif ($debitSource === 'future') {
            $reportedNewBalance = (float)($updatedBreakdown['future_total_usdt'] ?? $reportedNewBalance);
        }
    }

    sendSuccess([
        'user_id' => $lastResult['user_id'] ?? $userId,
        'wallet_type' => $reportedWallet,
        'debit_source' => $amount < 0 ? $debitSource : null,
        'asset' => $lastResult['asset'] ?? $asset,
        'previous_balance' => (float)($firstPrevBalance ?? 0),
        'new_balance' => round($reportedNewBalance, 2),
        'updated_balances' => [
            'spot_total_usdt' => (float)($updatedBreakdown['spot_total_usdt'] ?? 0.0),
            'transferable_spot_usdt' => (float)($updatedBreakdown['transferable_spot_usdt'] ?? 0.0),
            'future_total_usdt' => (float)($updatedBreakdown['future_total_usdt'] ?? 0.0),
            'referral_bonus_usdt' => (float)($updatedBreakdown['referral_bonus_usdt'] ?? 0.0)
        ],
        'ledger_id' => $lastResult['ledger_id'] ?? null,
        'already_processed' => $alreadyProcessed
    ], $alreadyProcessed ? 'This adjustment was already applied once.' : 'Balance adjusted successfully in Supabase');
}
