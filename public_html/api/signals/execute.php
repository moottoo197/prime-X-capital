<?php
/**
 * User Signal Execution - atomic Supabase RPC
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = requireAuth();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);

$input = getJsonBody();
$signalId = trim((string)($input['signal_id'] ?? $input['signalId'] ?? ''));
if ($signalId === '') sendError('MISSING_SIGNAL_ID', 'Signal ID is required');
if (!preg_match('/^[A-Za-z0-9._:-]{1,128}$/', $signalId)) sendError('INVALID_SIGNAL_ID', 'Signal ID format is invalid');

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);

// Load the signal before validating its session. Manual/custom signals (daily_slot=0)
// use their own published_at/expires_at window and must not be blocked by the
// daily 4 PM / 8 PM guard.
$sigRes = $supabase->select('trading_signals', ['id' => "eq.{$signalId}", 'limit' => '1', 'select' => '*']);
if (!$sigRes['success'] || empty($sigRes['data'][0])) sendError('SIGNAL_NOT_FOUND', 'Signal not found in Supabase');
$signal = $sigRes['data'][0];
// Testing signals are permanently non-profit. The reserved ID prefix is the
// primary marker; optional is_testing/no_profit metadata is also honored when
// present so a testing record can never reach the profit-credit RPC.
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

// Daily signal windows are global and anchored to Pakistan Time (PKT).
// Do not use the user's profile timezone here; all users share the same broadcast window.
$timezoneName = 'Asia/Karachi';
$tz = new DateTimeZone('Asia/Karachi');
$now = new DateTime('now', $tz);

if (in_array($slot, [1, 2], true)) {
    // Daily signals are globally scheduled in PKT. Their actual confirmation
    // window comes from the saved signal record, so an admin-selected duration is honored.
    try {
        $startAt = new DateTime((string)($signal['published_at'] ?? $signal['scheduled_at'] ?? ''), new DateTimeZone('UTC'));
    } catch (Throwable $e) {
        sendError('SIGNAL_NOT_LIVE', 'This daily signal has an invalid schedule.');
    }
    try {
        $endAt = new DateTime((string)($signal['expires_at'] ?? ''), new DateTimeZone('UTC'));
    } catch (Throwable $e) {
        $endAt = (clone $startAt)->modify('+' . max(1, (int)($signal['duration_minutes'] ?? 15)) . ' minutes');
    }
    $nowUtcTs = (new DateTime('now', new DateTimeZone('UTC')))->getTimestamp();
    if ($nowUtcTs < $startAt->getTimestamp() || $nowUtcTs >= $endAt->getTimestamp()) {
        sendError('SIGNAL_NOT_LIVE', 'This daily signal is outside its configured confirmation window.');
    }
} elseif ($slot === 0) {
    // Manual/custom signal: use the exact server-side UTC window stored on the signal.
    try {
        $startAt = new DateTime((string)($signal['published_at'] ?? $signal['scheduled_at'] ?? ''), new DateTimeZone('UTC'));
    } catch (Throwable $e) {
        sendError('SIGNAL_NOT_LIVE', 'This manual signal has an invalid schedule.');
    }
    try {
        $endAt = new DateTime((string)($signal['expires_at'] ?? ''), new DateTimeZone('UTC'));
    } catch (Throwable $e) {
        $endAt = (clone $startAt)->modify('+' . max(1, (int)($signal['duration_minutes'] ?? 15)) . ' minutes');
    }
    $nowUtcTs = (new DateTime('now', new DateTimeZone('UTC')))->getTimestamp();
    if ($nowUtcTs < $startAt->getTimestamp() || $nowUtcTs >= $endAt->getTimestamp()) {
        sendError('SIGNAL_NOT_LIVE', 'This manual/custom signal is outside its configured confirmation window.');
    }
} else {
    sendError('SIGNAL_NOT_LIVE', 'This signal is not assigned to a valid signal session.');
}

// The signal minimum and profit principal are based only on funded capital:
// completed deposits + net Admin Financial Adjustments. Referral bonuses and
// prior signal profits are intentionally excluded from the profit principal.
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

// Re-read the source-of-capital records locally for every confirmation so the
// principal used for profit can never fall back to a hard-coded 20-USDT/minimum
// value returned by an older database function. Only completed deposits and net
// Admin Financial Adjustments count; referral commissions, bonuses and TRADE_PNL
// entries remain outside the principal.
$capitalBatch = $supabase->selectMany([
    'deposits' => [
        'table' => 'deposits',
        'params' => ['user_id' => 'eq.' . (string)$user['id'], 'select' => 'amount,status,created_at', 'limit' => '1000']
    ],
    'ledger' => [
        'table' => 'ledger_entries',
        'params' => ['user_id' => 'eq.' . (string)$user['id'], 'asset' => 'eq.USDT', 'select' => 'entry_type,amount,description,reason,reference_id,created_at', 'limit' => '5000']
    ]
]);
$sourceFundedCapital = 0.0;
foreach (($capitalBatch['deposits']['data'] ?? []) as $row) {
    $status = strtoupper(trim((string)($row['status'] ?? '')));
    if (!in_array($status, ['COMPLETED','APPROVED','CONFIRMED'], true)) continue;
    $sourceFundedCapital += max(0.0, (float)($row['amount'] ?? 0));
}
foreach (($capitalBatch['ledger']['data'] ?? []) as $row) {
    $desc = strtoupper(trim((string)($row['description'] ?? '')));
    $reason = strtoupper(trim((string)($row['reason'] ?? '')));
    $reference = strtoupper(trim((string)($row['reference_id'] ?? '')));
    $sourceText = trim($desc . ' ' . $reason . ' ' . $reference);
    // Only admin adjustments explicitly classified as DEPOSIT form principal.
    // Referral bonuses, profit adjustments and OTHER adjustments are separate.
    // v83+ typed adjustments use [DEPOSIT]. Also recognize legacy admin
    // adjustments whose reason explicitly contains "deposit" but predates the
    // adjustment-type selector. Never treat Referral Bonus, Profit, or Other
    // adjustments as principal.
    $isTypedDeposit = strpos($desc, '[DEPOSIT]') === 0 || strpos($reason, '[DEPOSIT]') === 0 || strpos($reference, '[DEPOSIT]') === 0;
    $isLegacyDeposit = !$isTypedDeposit
        && strpos($desc, '[REFERRAL_BONUS]') !== 0
        && strpos($desc, '[PROFIT]') !== 0
        && strpos($desc, '[OTHER]') !== 0
        && preg_match('/\bDEPOSIT\b/i', $sourceText);
    if (!$isTypedDeposit && !$isLegacyDeposit) continue;
    $sourceFundedCapital += (float)($row['amount'] ?? 0);
}
$sourceFundedCapital = max(0.0, round($sourceFundedCapital, 2));
if ($sourceFundedCapital > 0.0) {
    $capitalBasis = $sourceFundedCapital;
}

$privilegedUser = in_array(strtoupper((string)($user['role'] ?? '')), ['ADMIN','SUPER_ADMIN','VIP','FINANCE_MANAGER','KYC_MANAGER'], true);
if (!$privilegedUser && $capitalBasis < 20.0) {
    sendError('MINIMUM_BALANCE_REQUIRED', 'A minimum funded capital of 20 USDT from deposits or Admin balance adjustments is required to confirm a signal.', 400);
}
$isDailySignal = in_array($slot, [1, 2], true);

// Daily 4 PM / 8 PM signals use one fixed rate so two confirmed sessions
// produce exactly 5% of funded principal per day (2.5% each) without compounding.
// Referral rewards and all other bonus/PNL categories remain outside this principal.
$profitPercentage = $isTestingSignal ? 0.0 : ($isDailySignal ? 2.5 : max(0.0, (float)($signal['profit_percentage'] ?? 2.5)));

// Keep the stored daily signal rate aligned with the fixed daily-doubler rule so
// the existing atomic execution RPC reads the same 2.5% rate. This does not alter
// scheduling, duration, direction, or any other signal fields.
if ($isDailySignal && !$isTestingSignal && abs((float)($signal['profit_percentage'] ?? 2.5) - 2.5) > 0.000001) {
    $rateSync = $supabase->update('trading_signals', ['profit_percentage' => 2.5], ['id' => 'eq.' . $signalId]);
    if (!$rateSync['success']) {
        sendError('DAILY_SIGNAL_RATE_NOT_READY', 'Daily signal rate could not be synchronized to the fixed 2.5% rate. Please retry this signal.', 503);
    }
    $signal['profit_percentage'] = 2.5;
}

// A funded deposit/administrative capital amount can earn at most 100% of that
// principal from the two normal daily signals. At 2.5% per session, two sessions
// per day = 5% per day, so the full principal cannot double before 20 daily cycles.
// The cap is calculated from each daily signal's execution profit plus any explicit
// principal-reconciliation credits for that same signal. Referral commissions,
// promotional bonuses, custom/manual signal PNL, and other credits remain separate.
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
        sendError('DAILY_PROFIT_CAP_REACHED', 'This funded principal has already reached its 100% daily-signal profit cap. No additional principal-based daily profit can be credited.', 409);
    }
} else {
    $remainingDailyProfit = null;
}

$expectedProfit = round(($capitalBasis * $profitPercentage) / 100, 2);
if ($isDailySignal && !$isTestingSignal && $remainingDailyProfit !== null) {
    // Normally the final session is an exact 2.5% credit. The min() also protects
    // against a one-cent rounding remainder on unusual principal amounts.
    $expectedProfit = round(min($expectedProfit, $remainingDailyProfit), 2);
}

// The existing RPC remains the authoritative atomic execution path. We do not
// replace its signal/session/idempotency logic. After it succeeds, daily-signal
// profit is reconciled against the exact signal's TRADE_PNL ledger total so an
// older 20-USDT/minimum-wallet credit cannot leave a larger funded principal at 0.5.
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

// For normal daily signals, calculate the amount already credited for THIS signal
// only. This prevents prior daily-signal profits from being mistaken for the current
// signal and also makes old partial 0.5-USDT credits safely repairable.
if ($isDailySignal && !$isTestingSignal && $expectedProfit > 0) {
    // Never let the RPC's legacy profit amount (for example $0.50) become the final
    // result when the user's actual funded principal requires a larger 2.5% credit.
    // Start from the RPC result because that is the amount the atomic execution path
    // actually reports as credited, then add any matching ledger reconciliation rows.
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
        // Key the reconciliation by the exact remaining amount so a later principal
        // increase can safely credit only the newly required difference.
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

// Keep the execution record's balance snapshot aligned with the server-authoritative
// funded-capital calculation so Admin User/Signal Detail can show the exact state at
// confirmation time without changing the existing execution/idempotency flow.

// The exact-signal reconciliation above also handles legacy partial credits.

// Read the wallet again after the authoritative execution/repair so the
// confirmation snapshot reflects the real persisted balance, including any
// concurrent ledger changes handled by the database transaction.
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
    } catch (Throwable $e) {
        // Detail snapshots are informational; never turn a successful signal
        // execution into a failure solely because the optional snapshot update failed.
    }
}

sendSuccess([
    'execution_id' => $result['execution_id'] ?? null,
    'signal_id' => $signalId,
    'profit_amount' => $profitAmount,
    'profit_percentage' => (float)($result['profit_percentage'] ?? ($signal['profit_percentage'] ?? 2.5)),
    'principal_balance' => round($capitalBasis, 2),
    'balance_before' => round($currentBalance, 2),
    'expected_profit' => $expectedProfit,
    'new_trading_balance' => (float)($result['new_trading_balance'] ?? 0),
    'balance_after' => $balanceAfter
], "Signal executed successfully! +{$profitAmount} USDT credited.");
