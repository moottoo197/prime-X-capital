<?php
/**
 * Prime X Capital - Withdrawal Fee & 30-Day / 2x Deposit Policy Helper
 *
 * Rules:
 *  1. Standard (Doubled) Tiered Fee:
 *     - Applies when EITHER:
 *       (a) At least 30 days have passed since first completed deposit AND user's total
 *           account value (current balances + withdrawn funds) is >= 2x total deposit; OR
 *       (b) Deposit + Deposit Bonus + Referral Bonus >= 2x total deposit (bonus-doubled).
 *     - Fee rate: 5% per $100 USD withdrawn ($1-$100 -> 5%, $100.01-$200 -> 10%, $200.01-$300 -> 15%, etc., capped at 100%).
 *  2. Early Withdrawal Penalty Fee:
 *     - If user has deposits (> 0) and has NOT met the double condition above,
 *       a flat 30% fee is applied to the withdrawal amount.
 */

declare(strict_types=1);

require_once __DIR__ . '/wallet_breakdown.php';

if (!function_exists('primex_calc_tiered_withdrawal_fee_pct')) {
    function primex_calc_tiered_withdrawal_fee_pct(float $amount): float {
        if ($amount <= 0.0) return 0.0;
        $blocks = max(1, (int)ceil(($amount - 0.00001) / 100.0));
        return min(100.0, (float)($blocks * 5));
    }
}

if (!function_exists('primex_compute_withdrawal_policy')) {
    function primex_compute_withdrawal_policy(SupabaseClient $supabase, string $userId, float $requestedAmount = 0.0): array {
        $breakdown = primex_compute_wallet_breakdown($supabase, $userId);

        $fundingAvail = round((float)($breakdown['breakdown']['funding_total_usdt'] ?? 0.0), 2);
        $exchangeAvail = round((float)($breakdown['breakdown']['exchange_total_usdt'] ?? 0.0), 2);
        $tradingAvail = round((float)($breakdown['breakdown']['trading_total_usdt'] ?? 0.0), 2);
        $totalAvail = round(max(0.0, $fundingAvail + $exchangeAvail + $tradingAvail), 2);

        $totalDeposited = round((float)($breakdown['funded_deposit_principal_usdt'] ?? 0.0), 2);
        $depositBonus = round((float)($breakdown['deposit_bonus_usdt'] ?? 0.0), 2);
        $referralBonus = round((float)($breakdown['referral_bonus_usdt'] ?? 0.0), 2);

        $totalCompletedWithdrawn = 0.0;
        $totalPendingWithdrawn = 0.0;
        $earliestDepositTs = null;

        if ($userId !== '' && $supabase->isConfigured()) {
            $batch = $supabase->selectMany([
                'deposits' => [
                    'table' => 'deposits',
                    'params' => [
                        'user_id' => 'eq.' . $userId,
                        'select' => 'amount,asset,status,created_at,updated_at',
                        'order' => 'created_at.asc',
                        'limit' => '1000'
                    ]
                ],
                'withdrawals' => [
                    'table' => 'withdrawals',
                    'params' => [
                        'user_id' => 'eq.' . $userId,
                        'select' => 'amount,status',
                        'limit' => '1000'
                    ]
                ],
                'deposit_adj' => [
                    'table' => 'ledger_entries',
                    'params' => [
                        'user_id' => 'eq.' . $userId,
                        'entry_type' => 'eq.ADJUSTMENT',
                        'select' => 'amount,description,created_at',
                        'order' => 'created_at.asc',
                        'limit' => '500'
                    ]
                ]
            ]);

            if (!empty($batch['deposits']['success']) && is_array($batch['deposits']['data'] ?? null)) {
                foreach ($batch['deposits']['data'] as $d) {
                    $st = strtoupper(trim((string)($d['status'] ?? '')));
                    $asset = strtoupper(trim((string)($d['asset'] ?? 'USDT')));
                    if ($asset !== '' && $asset !== 'USDT') continue;
                    if (!in_array($st, ['COMPLETED', 'APPROVED', 'CONFIRMED'], true)) continue;
                    $rawTs = (string)($d['created_at'] ?? $d['updated_at'] ?? '');
                    if ($rawTs !== '') {
                        $ts = strtotime($rawTs);
                        if ($ts !== false && ($earliestDepositTs === null || $ts < $earliestDepositTs)) {
                            $earliestDepositTs = $ts;
                        }
                    }
                }
            }

            if (!empty($batch['deposit_adj']['success']) && is_array($batch['deposit_adj']['data'] ?? null)) {
                foreach ($batch['deposit_adj']['data'] as $adj) {
                    $amt = (float)($adj['amount'] ?? 0);
                    $desc = strtoupper(trim((string)($adj['description'] ?? '')));
                    if ($amt <= 0 || strpos($desc, '[DEPOSIT]') !== 0) continue;
                    $rawTs = (string)($adj['created_at'] ?? '');
                    if ($rawTs !== '') {
                        $ts = strtotime($rawTs);
                        if ($ts !== false && ($earliestDepositTs === null || $ts < $earliestDepositTs)) {
                            $earliestDepositTs = $ts;
                        }
                    }
                }
            }

            if (!empty($batch['withdrawals']['success']) && is_array($batch['withdrawals']['data'] ?? null)) {
                foreach ($batch['withdrawals']['data'] as $w) {
                    $st = strtoupper(trim((string)($w['status'] ?? '')));
                    $wAmt = max(0.0, (float)($w['amount'] ?? 0));
                    if (in_array($st, ['COMPLETED', 'APPROVED', 'CONFIRMED'], true)) {
                        $totalCompletedWithdrawn += $wAmt;
                    } elseif (in_array($st, ['PENDING', 'REQUESTED', 'PENDING_REVIEW'], true)) {
                        $totalPendingWithdrawn += $wAmt;
                    }
                }
            }
        }

        $totalCompletedWithdrawn = round($totalCompletedWithdrawn, 2);
        $totalPendingWithdrawn = round($totalPendingWithdrawn, 2);
        $totalWithdrawnAll = round($totalCompletedWithdrawn + $totalPendingWithdrawn, 2);

        $nowTs = time();
        $daysSinceFirstDeposit = $earliestDepositTs !== null ? round(max(0.0, ($nowTs - $earliestDepositTs) / 86400.0), 2) : 0.0;
        $daysRemaining30 = $earliestDepositTs !== null ? max(0, (int)ceil(30.0 - $daysSinceFirstDeposit)) : 30;
        $hasPassed30Days = ($earliestDepositTs !== null) && ($daysSinceFirstDeposit >= 30.0);

        $doubleTarget = round($totalDeposited * 2.0, 2);
        $depositPlusBonuses = round($totalDeposited + $depositBonus + $referralBonus, 2);
        $effectiveAccountValue = round($totalAvail + $totalWithdrawnAll, 2);

        $isDepositDoubled = ($totalDeposited > 0.0) && ($effectiveAccountValue + 0.0001 >= $doubleTarget);
        $doubledByBonuses = ($totalDeposited > 0.0) && ($depositPlusBonuses + 0.0001 >= $doubleTarget);
        $doubledAfter30Days = $isDepositDoubled && $hasPassed30Days;

        // Tiered 5%-per-$100 fee applies if doubled after 30 days OR doubled via deposit+depositBonus+referralBonus (or no deposit exists).
        $qualifiedForTieredFee = ($totalDeposited <= 0.0) || $doubledByBonuses || $doubledAfter30Days;
        $isEarlyPenalty = !$qualifiedForTieredFee;

        $amt = max(0.0, round($requestedAmount, 2));
        if ($isEarlyPenalty) {
            $feeMode = 'EARLY_30_PERCENT';
            $feePercentage = 30.0;
            $feeAmount = round($amt * 0.30, 2);
        } else {
            $feeMode = 'TIERED_5_PER_100';
            $feePercentage = primex_calc_tiered_withdrawal_fee_pct($amt);
            $feeAmount = round($amt * ($feePercentage / 100.0), 2);
        }
        $netAmount = max(0.0, round($amt - $feeAmount, 2));

        if ($isEarlyPenalty) {
            $ruleNotice = 'Withdrawing before doubling your deposit (or before 30 days without Deposit + Deposit Bonus + Referral Bonus >= 2× deposit) incurs a 30% withdrawal fee.';
        } elseif ($doubledByBonuses && !$hasPassed30Days) {
            $ruleNotice = 'Deposit + Deposit Bonus + Referral Bonus has reached 2× your deposit. Tiered 5% per $100 withdrawal fee applies ($100 = 5%, $200 = 10%, etc.).';
        } else {
            $ruleNotice = '2× deposit goal completed after 30 days. Tiered 5% per $100 withdrawal fee applies ($100 = 5%, $200 = 10%, etc.).';
        }

        return [
            'total_deposited' => $totalDeposited,
            'deposit_bonus_usdt' => $depositBonus,
            'referral_bonus_usdt' => $referralBonus,
            'deposit_plus_bonuses' => $depositPlusBonuses,
            'double_target' => $doubleTarget,
            'total_withdrawn' => $totalCompletedWithdrawn,
            'pending_withdrawn' => $totalPendingWithdrawn,
            'effective_account_value' => $effectiveAccountValue,
            'remaining_to_double' => max(0.0, round($doubleTarget - $effectiveAccountValue, 2)),
            'first_deposit_at' => $earliestDepositTs !== null ? gmdate('Y-m-d H:i:s', $earliestDepositTs) : null,
            'days_since_first_deposit' => $daysSinceFirstDeposit,
            'days_remaining_30' => $daysRemaining30,
            'has_passed_30_days' => $hasPassed30Days,
            'is_deposit_doubled' => $isDepositDoubled,
            'doubled_by_bonuses' => $doubledByBonuses,
            'doubled_after_30_days' => $doubledAfter30Days,
            'qualified_for_tiered_fee' => $qualifiedForTieredFee,
            'is_below_double' => $isEarlyPenalty,
            'is_early_withdrawal' => $isEarlyPenalty,
            'fee_mode' => $feeMode,
            'fee_percentage' => $feePercentage,
            'fee_amount' => $feeAmount,
            'net_amount' => $netAmount,
            'early_deduction_rate' => $isEarlyPenalty ? 0.30 : 0.0,
            'early_deduction_percentage' => $isEarlyPenalty ? 30.0 : 0.0,
            'tiered_rate_per_100_pct' => 5.0,
            'available_balance' => $totalAvail,
            'funding_balance' => $fundingAvail,
            'trading_balance' => $tradingAvail,
            'exchange_balance' => $exchangeAvail,
            'rule_notice' => $ruleNotice,
        ];
    }
}
