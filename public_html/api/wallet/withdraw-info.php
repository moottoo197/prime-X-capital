<?php
/**
 * User Withdrawal Info & Doubling Rule Status - Pure Supabase REST
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = getCurrentUser();
if (!$user) {
    sendError('UNAUTHORIZED', 'Authentication required', 401);
}

$userId = $user['id'];
$supabase = getSupabaseClient();

$totalDeposited = 0.0;
$totalWithdrawn = 0.0;

if ($supabase->isConfigured()) {
    // 1. Deposits sum
    $depRes = $supabase->select('deposits', [
        'user_id' => "eq.{$userId}",
        'status' => 'eq.COMPLETED'
    ]);
    if ($depRes['success'] && is_array($depRes['data'])) {
        foreach ($depRes['data'] as $d) {
            $totalDeposited += (float)($d['amount'] ?? 0);
        }
    }

    // 2. Withdrawals sum
    $withRes = $supabase->select('withdrawals', [
        'user_id' => "eq.{$userId}",
        'status' => 'eq.COMPLETED'
    ]);
    if ($withRes['success'] && is_array($withRes['data'])) {
        foreach ($withRes['data'] as $w) {
            $totalWithdrawn += (float)($w['amount'] ?? 0);
        }
    }

    // 3. Wallets balance
    $walRes = $supabase->select('wallet_balances', ['user_id' => "eq.{$userId}"]);
    $fundingAvail = 0.0;
    $tradingAvail = 0.0;
    $exchangeAvail = 0.0;

    if ($walRes['success'] && is_array($walRes['data'])) {
        foreach ($walRes['data'] as $wb) {
            $bal = (float)($wb['available_balance'] ?? $wb['balance'] ?? 0);
            $type = strtolower($wb['wallet_type'] ?? '');
            if ($type === 'funding') $fundingAvail += $bal;
            if ($type === 'trading') $tradingAvail += $bal;
            if ($type === 'exchange') $exchangeAvail += $bal;
        }
    }
} else {
    $fundingAvail = 0.0;
    $tradingAvail = 0.0;
    $exchangeAvail = 0.0;
}

$doubleTarget = round($totalDeposited * 2.0, 2);
$remainingToDouble = max(0, round($doubleTarget - $totalWithdrawn, 2));
$isBelowDouble = $totalDeposited > 0 && $totalWithdrawn < $doubleTarget;
$totalAvail = max(0.0, $fundingAvail + $tradingAvail + $exchangeAvail);

sendSuccess([
    'total_deposited'            => round($totalDeposited, 2),
    'double_target'              => $doubleTarget,
    'total_withdrawn'            => round($totalWithdrawn, 2),
    'remaining_to_double'        => $remainingToDouble,
    'is_below_double'            => $isBelowDouble,
    'is_early_withdrawal'        => $isBelowDouble,
    'available_balance'          => round($totalAvail, 2),
    'funding_balance'            => round($fundingAvail, 2),
    'trading_balance'            => round($tradingAvail, 2),
    'exchange_balance'           => round($exchangeAvail, 2),
    'early_deduction_rate'       => 0.05,
    'early_deduction_percentage' => 5.0,
    'rule_notice'                => 'A 5% deduction applies if withdrawing before doubling deposited funds (e.g. deposit $20 -> $40 target).'
], 'Withdrawal deduction rules and account status loaded from Supabase');
