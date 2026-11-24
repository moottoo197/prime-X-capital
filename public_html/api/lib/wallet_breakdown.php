<?php
/**
 * Shared Wallet Breakdown Helper
 *
 * Categorizes user USDT balances cleanly across:
 *   - Spot Wallet (funding + exchange): holds Deposit Balance, Deposit Bonus, and Referral Bonus
 *   - Future Wallet (trading): used for Trades and Signals (funded by transferring Deposit + Deposit Bonus from Spot)
 *
 * Referral Bonus is strictly locked in Spot and cannot be transferred to Future.
 */

if (!function_exists('primex_compute_wallet_breakdown')) {
    function primex_compute_wallet_breakdown(SupabaseClient $supabase, string $userId): array
    {
        $zero = [
            'total_assets_usdt' => 0.0,
            'total_assets_btc' => 0.0,
            'spot_total_usdt' => 0.0,
            'future_total_usdt' => 0.0,
            'deposit_balance_usdt' => 0.0,
            'deposit_bonus_usdt' => 0.0,
            'referral_bonus_usdt' => 0.0,
            'transferable_spot_usdt' => 0.0,
            'locked_referral_spot_usdt' => 0.0,
            'funded_deposit_principal_usdt' => 0.0,
            'trade_pnl_usdt' => 0.0,
            'breakdown' => [
                'funding_total_usdt' => 0.0,
                'exchange_total_usdt' => 0.0,
                'trading_total_usdt' => 0.0,
                'spot_total_usdt' => 0.0,
                'future_total_usdt' => 0.0,
                'deposit_balance_usdt' => 0.0,
                'deposit_bonus_usdt' => 0.0,
                'referral_bonus_usdt' => 0.0,
                'transferable_spot_usdt' => 0.0,
                'locked_referral_spot_usdt' => 0.0,
                'funded_deposit_principal_usdt' => 0.0
            ],
            'wallets' => []
        ];

        if ($userId === '' || !$supabase->isConfigured()) {
            return $zero;
        }

        $batch = $supabase->selectMany([
            'wallets' => [
                'table' => 'wallet_balances',
                'params' => ['user_id' => 'eq.' . $userId]
            ],
            'deposits' => [
                'table' => 'deposits',
                'params' => ['user_id' => 'eq.' . $userId, 'select' => 'amount,status,asset']
            ],
            'ledger' => [
                'table' => 'ledger_entries',
                'params' => [
                    'user_id' => 'eq.' . $userId,
                    'select' => 'entry_type,asset,amount,description,reference_id,wallet_type,created_at',
                    'limit' => '5000'
                ]
            ]
        ]);

        $walletRows = ($batch['wallets']['success'] ?? false) && is_array($batch['wallets']['data'] ?? null)
            ? $batch['wallets']['data']
            : [];
        $depositRows = ($batch['deposits']['success'] ?? false) && is_array($batch['deposits']['data'] ?? null)
            ? $batch['deposits']['data']
            : [];
        $ledgerRows = ($batch['ledger']['success'] ?? false) && is_array($batch['ledger']['data'] ?? null)
            ? $batch['ledger']['data']
            : null;
        if ($ledgerRows === null) {
            $ledgerFallback = $supabase->select('ledger_entries', [
                'user_id' => 'eq.' . $userId,
                'select' => 'entry_type,asset,amount,description,reference_id,wallet_type,created_at',
                'limit' => '5000'
            ]);
            $ledgerRows = ($ledgerFallback['success'] ?? false) && is_array($ledgerFallback['data'] ?? null)
                ? $ledgerFallback['data']
                : [];
        }

        $funding = 0.0;
        $exchange = 0.0;
        $trading = 0.0;
        $promoColumnTotal = 0.0;

        foreach ($walletRows as $row) {
            $rowAsset = strtoupper(trim((string)($row['asset'] ?? 'USDT')));
            if ($rowAsset !== '' && $rowAsset !== 'USDT') continue;
            $val = max(0.0, (float)($row['balance'] ?? 0));
            $promoColumnTotal += max(0.0, (float)($row['promotional_balance'] ?? 0));
            $wType = strtolower(trim((string)($row['wallet_type'] ?? '')));
            if ($wType === 'funding') $funding += $val;
            elseif ($wType === 'exchange') $exchange += $val;
            elseif ($wType === 'trading') $trading += $val;
        }

        $spotTotal = round($funding + $exchange, 2);
        $futureTotal = round($trading, 2);
        $totalAssets = round($spotTotal + $futureTotal, 2);

        $approvedDeposits = 0.0;
        foreach ($depositRows as $dep) {
            $status = strtoupper(trim((string)($dep['status'] ?? '')));
            $depAsset = strtoupper(trim((string)($dep['asset'] ?? 'USDT')));
            if ($depAsset === 'USDT' && in_array($status, ['COMPLETED', 'APPROVED', 'CONFIRMED'], true)) {
                $approvedDeposits += max(0.0, (float)($dep['amount'] ?? 0));
            }
        }

        $depositAdjustments = 0.0;
        $referralBonusRaw = 0.0;
        $depositBonusRaw = 0.0;
        $tradePnlRaw = 0.0;

        foreach ($ledgerRows as $entry) {
            $entryAsset = strtoupper(trim((string)($entry['asset'] ?? 'USDT')));
            if ($entryAsset !== '' && $entryAsset !== 'USDT') continue;
            $entryType = strtoupper(trim((string)($entry['entry_type'] ?? '')));
            $amount = (float)($entry['amount'] ?? 0);
            $desc = strtoupper(trim((string)($entry['description'] ?? '')));
            $reason = '';
            $ref = strtoupper(trim((string)($entry['reference_id'] ?? '')));
            $sourceText = trim($desc . ' ' . $ref);

            if ($entryType === 'REFERRAL_COMMISSION') {
                $referralBonusRaw += $amount;
                continue;
            }

            if ($entryType === 'TRADE_PNL') {
                $tradePnlRaw += $amount;
                continue;
            }

            if (in_array($entryType, ['DEPOSIT_BONUS', 'BONUS', 'PROMO_BONUS', 'WELCOME_BONUS', 'STIPEND'], true)) {
                $depositBonusRaw += $amount;
                continue;
            }

            if ($entryType === 'ADJUSTMENT') {
                if (strpos($desc, '[REFERRAL_BONUS]') === 0 || strpos($reason, '[REFERRAL_BONUS]') === 0 || strpos($ref, '[REFERRAL_BONUS]') === 0) {
                    $referralBonusRaw += $amount;
                } elseif (strpos($desc, '[DEPOSIT]') === 0 || strpos($reason, '[DEPOSIT]') === 0 || strpos($ref, '[DEPOSIT]') === 0) {
                    $depositAdjustments += $amount;
                } elseif (strpos($desc, '[PROFIT]') === 0 || strpos($desc, '[OTHER]') === 0 || strpos($reason, '[PROFIT]') === 0 || strpos($reason, '[OTHER]') === 0) {
                    $depositBonusRaw += $amount;
                } elseif (preg_match('/\bREFERRAL\b/i', $sourceText)) {
                    $referralBonusRaw += $amount;
                } elseif (preg_match('/\b(BONUS|PROMO|REWARD|STIPEND)\b/i', $sourceText)) {
                    $depositBonusRaw += $amount;
                } elseif (preg_match('/\bDEPOSIT\b/i', $sourceText)) {
                    $depositAdjustments += $amount;
                } elseif ($amount > 0) {
                    $depositBonusRaw += $amount;
                }
            }
        }

        // Referral bonuses live strictly inside Spot and cannot be transferred to Future.
        $lockedReferralInSpot = round(min($spotTotal, max(0.0, $referralBonusRaw)), 2);
        $transferableSpot = round(max(0.0, $spotTotal - $lockedReferralInSpot), 2);

        // Non-referral balance across Spot + Future
        $nonReferralPool = round($transferableSpot + $futureTotal, 2);
        $depositBonusCombined = max(0.0, $depositBonusRaw, $promoColumnTotal);
        $depositBonusTotal = round(min($nonReferralPool, $depositBonusCombined), 2);
        $depositBalanceTotal = round(max(0.0, $nonReferralPool - $depositBonusTotal), 2);

        $fundedDepositPrincipal = round(max(0.0, $approvedDeposits + $depositAdjustments), 2);
        $tradePnlTotal = round(max(0.0, $tradePnlRaw), 2);
        $totalBtc = round($totalAssets / 64280, 6);

        return [
            'total_assets_usdt' => $totalAssets,
            'total_assets_btc' => $totalBtc,
            'spot_total_usdt' => $spotTotal,
            'future_total_usdt' => $futureTotal,
            'deposit_balance_usdt' => $depositBalanceTotal,
            'deposit_bonus_usdt' => $depositBonusTotal,
            'referral_bonus_usdt' => $lockedReferralInSpot,
            'transferable_spot_usdt' => $transferableSpot,
            'locked_referral_spot_usdt' => $lockedReferralInSpot,
            'funded_deposit_principal_usdt' => $fundedDepositPrincipal,
            'trade_pnl_usdt' => $tradePnlTotal,
            'breakdown' => [
                'funding_total_usdt' => round($funding, 2),
                'exchange_total_usdt' => round($exchange, 2),
                'trading_total_usdt' => $futureTotal,
                'spot_total_usdt' => $spotTotal,
                'future_total_usdt' => $futureTotal,
                'deposit_balance_usdt' => $depositBalanceTotal,
                'deposit_bonus_usdt' => $depositBonusTotal,
                'referral_bonus_usdt' => $lockedReferralInSpot,
                'transferable_spot_usdt' => $transferableSpot,
                'locked_referral_spot_usdt' => $lockedReferralInSpot,
                'funded_deposit_principal_usdt' => $fundedDepositPrincipal
            ],
            'wallets' => $walletRows
        ];
    }
}
