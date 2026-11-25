<?php
/**
 * User Signal Execution - atomic Supabase RPC + Fixed $4 Additional Signal Settlement
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/wallet_breakdown.php';
require_once dirname(__DIR__) . '/lib/additional_signals.php';

$user = requireAuth();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);

$input = getJsonBody();
$signalId = trim((string)($input['signal_id'] ?? $input['signalId'] ?? ''));
if ($signalId === '') sendError('MISSING_SIGNAL_ID', 'Signal ID is required');
if (!preg_match('/^[A-Za-z0-9._:-]{1,128}$/', $signalId)) sendError('INVALID_SIGNAL_ID', 'Signal ID format is invalid');

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);

$sigRes = $supabase->select('trading_signals', ['id' => "eq.{$signalId}", 'limit' => '1', 'select' => '*']);
if (!$sigRes['success'] || empty($sigRes['data'][0])) sendError('SIGNAL_NOT_FOUND', 'Signal not found in Supabase');
$signal = $sigRes['data'][0];

$isTestingSignal = strpos($signalId, 'sig_test_') === 0
    || filter_var($signal['is_testing'] ?? false, FILTER_VALIDATE_BOOLEAN)
    || filter_var($signal['no_profit'] ?? false, FILTER_VALIDATE_BOOLEAN);
if ($isTestingSignal) {
    sendError('TEST_SIGNAL_NO_PROFIT', 'Testing signals are for worldwide testing only. They cannot be confirmed and cannot generate or credit profit.');
}

$slot = (int)($signal['daily_slot'] ?? 0);
$status = strtoupper((string)($signal['status'] ?? 'PUBLISHED'));
if (!in_array($status, ['PUBLISHED', 'ACTIVE', 'SCHEDULED'], true)) {
    sendError('SIGNAL_NOT_LIVE', 'This signal is not currently live.');
}

$isAdditionalSignal = ($slot === 3 || strpos($signalId, 'sig_add_') === 0);

// All signal confirmation windows are globally anchored in UTC from published_at/expires_at
if (!in_array($slot, [0, 1, 2, 3], true)) {
    sendError('SIGNAL_NOT_LIVE', 'This signal is not assigned to a valid signal session.');
}
try {
    $startAt = new DateTime((string)($signal['published_at'] ?? $signal['scheduled_at'] ?? ''), new DateTimeZone('UTC'));
} catch (Throwable $e) {
    sendError('SIGNAL_NOT_LIVE', 'This signal has an invalid schedule.');
}
try {
    $endAt = new DateTime((string)($signal['expires_at'] ?? ''), new DateTimeZone('UTC'));
} catch (Throwable $e) {
    $endAt = (clone $startAt)->modify('+' . max(1, (int)($signal['duration_minutes'] ?? 15)) . ' minutes');
}
$nowUtcTs = (new DateTime('now', new DateTimeZone('UTC')))->getTimestamp();
if ($nowUtcTs < $startAt->getTimestamp() || $nowUtcTs >= $endAt->getTimestamp()) {
    sendError('SIGNAL_NOT_LIVE', 'This signal is outside its configured confirmation window.');
}

// Snapshot current total USDT balance before execution
$walletRes = $supabase->select('wallet_balances', [
    'user_id' => 'eq.' . (string)$user['id'],
    'asset' => 'eq.USDT',
    'select' => 'wallet_type,balance,available_balance'
]);
$currentBalance = 0.0;
if ($walletRes['success'] && is_array($walletRes['data'])) {
    foreach ($walletRes['data'] as $walletRow) {
        $currentBalance += max(0.0, (float)($walletRow['balance'] ?? 0));
    }
}

// =========================================================================
// PATH A: ADDITIONAL SIGNAL (9:30 PM PKT / Slot #3)
//   - Requires Additional Signal credits unlocked via $300+ deposit / referral
//   - Credits a fixed $4.00 USDT reward
//   - Completely separate from the 30-Day 2x Plan (never counts toward 2x cap)
// =========================================================================
if ($isAdditionalSignal) {
    $userId = (string)$user['id'];
    $addStatus = primex_get_additional_signal_status($supabase, $userId);
    if ((int)($addStatus['remaining'] ?? 0) <= 0) {
        sendError(
            'NO_ADDITIONAL_SIGNAL_CREDITS',
            'You have 0 Additional Signal credits remaining. Deposit $300+ or invite a friend who deposits $300+ to unlock $4.00 Additional Signals.',
            400
        );
    }

    // Check existing single-use execution row
    $dupCheck = $supabase->select('user_signal_executions', [
        'user_id' => 'eq.' . $userId,
        'signal_id' => 'eq.' . $signalId,
        'select' => 'id',
        'limit' => '1'
    ]);
    if (!empty($dupCheck['success']) && !empty($dupCheck['data'][0])) {
        sendError('SIGNAL_ALREADY_USED', 'Each user can confirm a signal one time only.');
    }

    $fixedReward = 4.00;
    $executionId = 'sig_exec_' . bin2hex(random_bytes(8));
    $nowIso = gmdate('Y-m-d H:i:s');

    $insExec = $supabase->insert('user_signal_executions', [[
        'id' => $executionId,
        'user_id' => $userId,
        'signal_id' => $signalId,
        'symbol' => (string)($signal['symbol'] ?? 'ETH/USDT'),
        'direction' => (string)($signal['direction'] ?? 'BUY'),
        'stake_amount' => 0,
        'profit_percentage' => 0,
        'profit_amount' => $fixedReward,
        'status' => 'COMPLETED',
        'executed_at' => $nowIso,
        'created_at' => $nowIso
    ]]);
    if (empty($insExec['success'])) {
        $errMsg = (string)($insExec['message'] ?? $insExec['error'] ?? '');
        if (stripos($errMsg, 'duplicate') !== false || stripos($errMsg, '23505') !== false || stripos($errMsg, 'unique') !== false) {
            sendError('SIGNAL_ALREADY_USED', 'Each user can confirm a signal one time only.');
        }
        sendError('EXECUTION_FAILED', 'Additional signal execution failed. ' . $errMsg, 502);
    }

    // Credit fixed $4.00 USDT to trading wallet atomically via RPC (or REST CAS fallback)
    $credited = false;
    $creditRpc = $supabase->rpc('reconcile_signal_profit_once', [
        'p_user_id' => $userId,
        'p_signal_id' => 'addsig:' . $signalId,
        'p_amount' => $fixedReward,
        'p_profit_percentage' => 0
    ]);
    if (!empty($creditRpc['success'])) {
        $credited = true;
    } else {
        // Fallback if RPC isn't deployed: credit trading wallet + ledger idempotently
        $refId = 'sig_add_exec:' . $signalId . ':' . $userId;
        $existingLedger = $supabase->select('ledger_entries', [
            'entry_type' => 'eq.TRADE_PNL',
            'reference_id' => 'eq.' . $refId,
            'select' => 'id',
            'limit' => '1'
        ]);
        if (!empty($existingLedger['success']) && !empty($existingLedger['data'][0])) {
            $credited = true;
        } else {
            $trRes = $supabase->select('wallet_balances', [
                'user_id' => 'eq.' . $userId,
                'wallet_type' => 'eq.trading',
                'asset' => 'eq.USDT',
                'limit' => '1'
            ]);
            if (empty($trRes['success']) || empty($trRes['data'][0])) {
                $supabase->insert('wallet_balances', [[
                    'user_id' => $userId,
                    'wallet_type' => 'trading',
                    'asset' => 'USDT',
                    'balance' => 0,
                    'available_balance' => 0,
                    'reserved_balance' => 0,
                    'promotional_balance' => 0,
                    'created_at' => $nowIso,
                    'updated_at' => $nowIso
                ]]);
                $trRes = $supabase->select('wallet_balances', [
                    'user_id' => 'eq.' . $userId,
                    'wallet_type' => 'eq.trading',
                    'asset' => 'eq.USDT',
                    'limit' => '1'
                ]);
            }
            if (!empty($trRes['success']) && !empty($trRes['data'][0])) {
                $beforeBal = (float)($trRes['data'][0]['balance'] ?? 0);
                $afterBal = round($beforeBal + $fixedReward, 2);
                $upd = $supabase->update('wallet_balances', [
                    'balance' => $afterBal,
                    'available_balance' => $afterBal,
                    'updated_at' => $nowIso
                ], [
                    'user_id' => 'eq.' . $userId,
                    'wallet_type' => 'eq.trading',
                    'asset' => 'eq.USDT'
                ]);
                if (!empty($upd['success'])) {
                    $supabase->insert('ledger_entries', [[
                        'user_id' => $userId,
                        'wallet_type' => 'trading',
                        'asset' => 'USDT',
                        'amount' => $fixedReward,
                        'balance_before' => $beforeBal,
                        'balance_after' => $afterBal,
                        'entry_type' => 'TRADE_PNL',
                        'reference_id' => $refId,
                        'description' => 'Additional Signal fixed reward (+4.00 USDT, separate from 30-day 2x plan) for ' . $signalId,
                        'created_at' => $nowIso
                    ]]);
                    $credited = true;
                }
            }
        }
    }

    if (!$credited) {
        sendError('PROFIT_CREDIT_FAILED', 'Additional signal confirmation could not credit $4.00 USDT. Please contact support.', 502);
    }

    $consumeRes = primex_consume_additional_signal_credit($supabase, $userId, $signalId);

    $balanceAfter = round($currentBalance + $fixedReward, 2);
    $postWalletRes = $supabase->select('wallet_balances', [
        'user_id' => 'eq.' . $userId,
        'asset' => 'eq.USDT',
        'select' => 'balance'
    ]);
    if ($postWalletRes['success'] && is_array($postWalletRes['data'])) {
        $persistedAfter = 0.0;
        foreach ($postWalletRes['data'] as $walletRow) {
            $persistedAfter += max(0.0, (float)($walletRow['balance'] ?? 0));
        }
        $balanceAfter = round($persistedAfter, 2);
    }
    try {
        $supabase->update('user_signal_executions', [
            'principal_balance' => 0,
            'balance_before' => round($currentBalance, 2),
            'balance_after' => $balanceAfter
        ], ['id' => 'eq.' . $executionId]);
    } catch (Throwable $e) {}

    sendSuccess([
        'execution_id' => $executionId,
        'signal_id' => $signalId,
        'is_additional' => true,
        'profit_amount' => $fixedReward,
        'profit_percentage' => 0.0,
        'reward_usdt' => $fixedReward,
        'principal_balance' => 0.0,
        'balance_before' => round($currentBalance, 2),
        'expected_profit' => $fixedReward,
        'balance_after' => $balanceAfter,
        'additional_signals' => $consumeRes['status'] ?? null
    ], 'Additional signal executed! +$4.00 USDT fixed profit credited (separate from 30-day 2x plan).');
}

// =========================================================================
// PATH B: STANDARD DAILY & CUSTOM SIGNALS (Slots 0, 1, 2)
//   - Minimum Future Balance & funded capital = 100.00 USDT
//   - Slot 1 (6:00 PM PKT) & Slot 2 (8:00 PM PKT): 1.67% each = 3.33%/day -> 2x in 30 days
// =========================================================================
$capitalBasis = 0.0;
$capitalBasisRpc = $supabase->rpc('calculate_signal_profit_principal', [
    'p_user_id' => (string)$user['id']
]);
if ($capitalBasisRpc['success']) {
    $capitalData = $capitalBasisRpc['data'];
    if (is_array($capitalData) && isset($capitalData[0]) && is_array($capitalData[0])) $capitalData = $capitalData[0];
    if (is_array($capitalData) && isset($capitalData['principal_amount'])) {
        $capitalBasis = max(0.0, (float)$capitalData['principal_amount']);
    } elseif (is_numeric($capitalData)) {
        $capitalBasis = max(0.0, (float)$capitalData);
    }
}

$capitalBatch = $supabase->selectMany([
    'deposits' => [
        'table' => 'deposits',
        'params' => ['user_id' => 'eq.' . (string)$user['id'], 'select' => 'amount,status,created_at', 'limit' => '1000']
    ],
    'ledger' => [
        'table' => 'ledger_entries',
        'params' => ['user_id' => 'eq.' . (string)$user['id'], 'asset' => 'eq.USDT', 'select' => 'entry_type,amount,description,reference_id,created_at', 'limit' => '5000']
    ]
]);
$sourceFundedCapital = 0.0;
foreach (($capitalBatch['deposits']['data'] ?? []) as $row) {
    $rowStatus = strtoupper(trim((string)($row['status'] ?? '')));
    if (!in_array($rowStatus, ['COMPLETED', 'APPROVED', 'CONFIRMED'], true)) continue;
    $sourceFundedCapital += max(0.0, (float)($row['amount'] ?? 0));
}
foreach (($capitalBatch['ledger']['data'] ?? []) as $row) {
    $desc = strtoupper(trim((string)($row['description'] ?? '')));
    $reason = strtoupper(trim((string)($row['reason'] ?? '')));
    $reference = strtoupper(trim((string)($row['reference_id'] ?? '')));
    $sourceText = trim($desc . ' ' . $reason . ' ' . $reference);
    $isTypedDeposit = strpos($desc, '[DEPOSIT]') === 0 || strpos($reason, '[DEPOSIT]') === 0 || strpos($reference, '[DEPOSIT]') === 0;
    $isLegacyDeposit = !$isTypedDeposit
        && strpos($desc, '[REFERRAL_BONUS]') !== 0
        && strpos($desc, '[PROFIT]') !== 0
        && strpos($desc, '[OTHER]') !== 0
        && preg_match('/\bDEPOSIT\b/i', $sourceText);
    if (!$isTypedDeposit && !$isLegacyDeposit) continue;
    $sourceFundedCapital += (float)($row['amount'] ?? 0);
}
$walletBreakdown = primex_compute_wallet_breakdown($supabase, (string)$user['id']);
$futureWalletBalance = (float)($walletBreakdown['future_total_usdt'] ?? 0.0);
$transferableSpotBalance = (float)($walletBreakdown['transferable_spot_usdt'] ?? 0.0);
$depositPlusBonus = round((float)($walletBreakdown['deposit_balance_usdt'] ?? 0.0) + (float)($walletBreakdown['deposit_bonus_usdt'] ?? 0.0), 2);

$sourceFundedCapital = max(0.0, round($sourceFundedCapital, 2));
if ($sourceFundedCapital > 0.0) {
    $capitalBasis = $sourceFundedCapital;
} elseif ($depositPlusBonus > 0.0) {
    $capitalBasis = $depositPlusBonus;
}

$minReq = 100.0;
$privilegedUser = in_array(strtoupper((string)($user['role'] ?? '')), ['ADMIN', 'SUPER_ADMIN', 'VIP', 'FINANCE_MANAGER', 'KYC_MANAGER'], true);
if (!$privilegedUser && $futureWalletBalance < $minReq) {
    if ($transferableSpotBalance >= $minReq) {
        sendError('TRANSFER_TO_FUTURE_REQUIRED', 'Please transfer at least 100 USDT (Deposit Balance / Deposit Bonus) from your Spot Wallet to your Future Balance before confirming a signal.', 400);
    }
    sendError('MINIMUM_BALANCE_REQUIRED', 'A minimum Future Balance of 100 USDT (from Deposit Balance or Deposit Bonus) is required to confirm a signal. Referral Bonus cannot be transferred to Future.', 400);
}
if (!$privilegedUser && $capitalBasis < $minReq) {
    sendError('MINIMUM_BALANCE_REQUIRED', 'A minimum funded capital of 100 USDT from Deposit Balance or Deposit Bonus is required to confirm a signal.', 400);
}
if ($futureWalletBalance > 0.0 && $capitalBasis > $futureWalletBalance && !$privilegedUser) {
    $capitalBasis = round($futureWalletBalance, 2);
}

$isDailySignal = in_array($slot, [1, 2], true);
$profitPercentage = $isTestingSignal ? 0.0 : ($isDailySignal ? 1.67 : max(0.0, (float)($signal['profit_percentage'] ?? 1.67)));

if ($isDailySignal && !$isTestingSignal && abs((float)($signal['profit_percentage'] ?? 1.67) - 1.67) > 0.000001) {
    $rateSync = $supabase->update('trading_signals', ['profit_percentage' => 1.67], ['id' => 'eq.' . $signalId]);
    if (!$rateSync['success']) {
        sendError('DAILY_SIGNAL_RATE_NOT_READY', 'Daily signal rate could not be synchronized to the fixed 1.67% rate. Please retry this signal.', 503);
    }
    $signal['profit_percentage'] = 1.67;
}

// 30-day 2x cap (100% of funded principal across sig_daily_* ONLY; Additional Signals are completely excluded)
$dailySignalProfitTotal = 0.0;
$dailyProfitCap = round($capitalBasis, 2);
if ($isDailySignal && !$isTestingSignal && $dailyProfitCap > 0) {
    $dailySignalTotals = [];
    $dailyExecRes = $supabase->select('user_signal_executions', [
        'user_id' => 'eq.' . (string)$user['id'],
        'select' => 'signal_id,profit_amount,executed_at',
        'order' => 'executed_at.asc',
        'limit' => '1000'
    ]);
    if ($dailyExecRes['success'] && is_array($dailyExecRes['data'])) {
        foreach ($dailyExecRes['data'] as $executionRow) {
            $dailyId = trim((string)($executionRow['signal_id'] ?? ''));
            if (strpos($dailyId, 'sig_daily_') !== 0) continue;
            $dailySignalTotals[$dailyId] = max(0.0, (float)($executionRow['profit_amount'] ?? 0));
        }
    }

    $dailyLedgerRes = $supabase->select('ledger_entries', [
        'user_id' => 'eq.' . (string)$user['id'],
        'entry_type' => 'eq.TRADE_PNL',
        'asset' => 'eq.USDT',
        'select' => 'amount,reference_id,description,created_at',
        'order' => 'created_at.asc',
        'limit' => '1000'
    ]);
    if ($dailyLedgerRes['success'] && is_array($dailyLedgerRes['data'])) {
        foreach ($dailyLedgerRes['data'] as $ledgerEntry) {
            $ref = trim((string)($ledgerEntry['reference_id'] ?? ''));
            if (strpos($ref, 'sig_profit_reconcile:') !== 0) continue;
            $parts = explode(':', $ref);
            $dailyId = trim((string)($parts[1] ?? ''));
            if (strpos($dailyId, 'sig_daily_') !== 0) continue;
            $dailySignalTotals[$dailyId] = round(
                ($dailySignalTotals[$dailyId] ?? 0.0) + max(0.0, (float)($ledgerEntry['amount'] ?? 0)),
                2
            );
        }
    }
    $dailySignalProfitTotal = round(array_sum($dailySignalTotals), 2);
    $remainingDailyProfit = round(max(0.0, $dailyProfitCap - $dailySignalProfitTotal), 2);
    if ($remainingDailyProfit < 0.01) {
        sendError('DAILY_PROFIT_CAP_REACHED', 'This funded principal has already reached its 100% 30-day daily-signal profit cap. No additional principal-based daily profit can be credited.', 409);
    }
} else {
    $remainingDailyProfit = null;
}

$expectedProfit = round(($capitalBasis * $profitPercentage) / 100, 2);
if ($isDailySignal && !$isTestingSignal && $remainingDailyProfit !== null) {
    $expectedProfit = round(min($expectedProfit, $remainingDailyProfit), 2);
}

$rpc = $supabase->rpc('execute_alphavest_signal', [
    'p_signal_id' => $signalId,
    'p_user_id' => (string)$user['id']
]);
if (!$rpc['success']) {
    $msg = (string)($rpc['message'] ?? 'Signal execution RPC failed.');
    if (stripos($msg, 'SIGNAL_ALREADY_USED') !== false) sendError('SIGNAL_ALREADY_USED', 'Each user can confirm a signal one time only.');
    if (stripos($msg, 'SIGNAL_NOT_LIVE') !== false) sendError('SIGNAL_NOT_LIVE', 'This signal is not currently live.');
    if (stripos($msg, 'PGRST202') !== false || stripos($msg, 'schema cache') !== false || stripos($msg, 'execute_alphavest_signal') !== false) {
        sendError('EXECUTION_RPC_NOT_READY', 'Signal execution service is not installed in Supabase. Run the latest platform migration once, then retry.', 502);
    }
    sendError('EXECUTION_FAILED', 'Signal was not executed. ' . $msg, 502);
}

$result = $rpc['data'];
if (is_array($result) && isset($result[0]) && is_array($result[0])) $result = $result[0];
if (!is_array($result)) $result = [];
if (($result['success'] ?? true) === false) {
    $code = (string)($result['error_code'] ?? 'EXECUTION_FAILED');
    sendError($code, (string)($result['message'] ?? 'Signal execution failed.'), 400);
}

$profitAmount = (float)($result['profit_amount'] ?? 0);
$executionId = trim((string)($result['execution_id'] ?? ''));

if ($isDailySignal && !$isTestingSignal && $expectedProfit > 0) {
    $signalCreditedTotal = max(0.0, $profitAmount);
    $signalLedgerRes = $supabase->select('ledger_entries', [
        'user_id' => 'eq.' . (string)$user['id'],
        'entry_type' => 'eq.TRADE_PNL',
        'asset' => 'eq.USDT',
        'select' => 'amount,reference_id,description',
        'order' => 'created_at.asc',
        'limit' => '1000'
    ]);
    if ($signalLedgerRes['success'] && is_array($signalLedgerRes['data'])) {
        $ledgerMatchedTotal = 0.0;
        $executionReference = $executionId !== '' ? 'sig_exec_' . $executionId : '';
        foreach ($signalLedgerRes['data'] as $entry) {
            $ref = trim((string)($entry['reference_id'] ?? ''));
            $matchesCurrentSignal = ($ref === $signalId) || ($ref === 'sig_' . $signalId)
                || ($executionReference !== '' && $ref === $executionReference);
            if (!$matchesCurrentSignal && strpos($ref, 'sig_profit_reconcile:') === 0) {
                $parts = explode(':', $ref);
                $matchesCurrentSignal = ((string)($parts[1] ?? '') === $signalId);
            }
            if ($matchesCurrentSignal) $ledgerMatchedTotal += max(0.0, (float)($entry['amount'] ?? 0));
        }
        $signalCreditedTotal = max($signalCreditedTotal, round($ledgerMatchedTotal, 2));
    }
    $signalCreditedTotal = round($signalCreditedTotal, 2);
    $remainingSignalProfit = round(max(0.0, $expectedProfit - $signalCreditedTotal), 2);
    if ($remainingSignalProfit > 0) {
        $correctionSignalId = $signalId . ':principal:' . number_format($remainingSignalProfit, 2, '.', '');
        $fix = $supabase->rpc('reconcile_signal_profit_once', [
            'p_user_id' => (string)$user['id'],
            'p_signal_id' => $correctionSignalId,
            'p_amount' => $remainingSignalProfit,
            'p_profit_percentage' => $profitPercentage
        ]);
        if (!$fix['success']) {
            sendError('PROFIT_CREDIT_REPAIR_FAILED', 'Signal was confirmed, but the remaining profit credit could not be completed. Please contact support before confirming this signal again.', 502);
        }
        $fixResult = $fix['data'];
        if (is_array($fixResult) && isset($fixResult[0]) && is_array($fixResult[0])) $fixResult = $fixResult[0];
        $reconcileCredit = is_array($fixResult) ? (float)($fixResult['credited_amount'] ?? 0) : 0.0;
        $signalCreditedTotal = round($signalCreditedTotal + $reconcileCredit, 2);
    }
    $profitAmount = round(min($signalCreditedTotal, $expectedProfit), 2);
}

$balanceAfter = round($currentBalance + $profitAmount, 2);
$postWalletRes = $supabase->select('wallet_balances', [
    'user_id' => 'eq.' . (string)$user['id'],
    'asset' => 'eq.USDT',
    'select' => 'balance'
]);
if ($postWalletRes['success'] && is_array($postWalletRes['data'])) {
    $persistedAfter = 0.0;
    foreach ($postWalletRes['data'] as $walletRow) {
        $persistedAfter += max(0.0, (float)($walletRow['balance'] ?? 0));
    }
    $balanceAfter = round($persistedAfter, 2);
}
if ($executionId !== '') {
    try {
        $supabase->update('user_signal_executions', [
            'principal_balance' => round($capitalBasis, 2),
            'balance_before' => round($currentBalance, 2),
            'balance_after' => $balanceAfter
        ], ['id' => 'eq.' . $executionId]);
    } catch (Throwable $e) {}
}

sendSuccess([
    'execution_id' => $result['execution_id'] ?? null,
    'signal_id' => $signalId,
    'is_additional' => false,
    'profit_amount' => $profitAmount,
    'profit_percentage' => (float)($result['profit_percentage'] ?? ($signal['profit_percentage'] ?? 1.67)),
    'principal_balance' => round($capitalBasis, 2),
    'balance_before' => round($currentBalance, 2),
    'expected_profit' => $expectedProfit,
    'new_trading_balance' => (float)($result['new_trading_balance'] ?? 0),
    'balance_after' => $balanceAfter
], "Signal executed successfully! +{$profitAmount} USDT credited.");
