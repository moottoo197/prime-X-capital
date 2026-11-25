<?php
/**
 * Prime X Capital - Additional Signal Tiers, Fixed $4 Reward & Referral Credit Ledger
 *
 * Additional Signals operate separately from the 30-Day 2x Plan:
 *  - Minimum deposit floor platform-wide: 100 USD
 *  - Deposit tiers grant 0..10 Additional Signal credits (usable at 9:30 PM PKT / Slot #3)
 *  - Fixed payout per Additional Signal confirmation: $4.00 USDT
 *  - When an invited user makes an eligible deposit ($300+), BOTH depositor and inviter
 *    receive the tier's Additional Signal credits idempotently.
 */

declare(strict_types=1);

if (!function_exists('primex_additional_signal_tiers')) {
    function primex_additional_signal_tiers(): array {
        return [
            ['min_deposit' => 100,   'signals' => 0,  'label' => '—',       'reward_each_usdt' => 4.00],
            ['min_deposit' => 300,   'signals' => 1,  'label' => '1 day',   'reward_each_usdt' => 4.00],
            ['min_deposit' => 500,   'signals' => 2,  'label' => '2 days',  'reward_each_usdt' => 4.00],
            ['min_deposit' => 700,   'signals' => 3,  'label' => '3 days',  'reward_each_usdt' => 4.00],
            ['min_deposit' => 1000,  'signals' => 4,  'label' => '4 days',  'reward_each_usdt' => 4.00],
            ['min_deposit' => 1500,  'signals' => 5,  'label' => '5 days',  'reward_each_usdt' => 4.00],
            ['min_deposit' => 3000,  'signals' => 6,  'label' => '6 days',  'reward_each_usdt' => 4.00],
            ['min_deposit' => 5000,  'signals' => 7,  'label' => '7 days',  'reward_each_usdt' => 4.00],
            ['min_deposit' => 7000,  'signals' => 8,  'label' => '8 days',  'reward_each_usdt' => 4.00],
            ['min_deposit' => 10000, 'signals' => 10, 'label' => '10 days', 'reward_each_usdt' => 4.00],
        ];
    }
}

if (!function_exists('primex_additional_signals_for_deposit')) {
    function primex_additional_signals_for_deposit(float $amount): int {
        if ($amount >= 10000.0) return 10;
        if ($amount >= 7000.0)  return 8;
        if ($amount >= 5000.0)  return 7;
        if ($amount >= 3000.0)  return 6;
        if ($amount >= 1500.0)  return 5;
        if ($amount >= 1000.0)  return 4;
        if ($amount >= 700.0)   return 3;
        if ($amount >= 500.0)   return 2;
        if ($amount >= 300.0)   return 1;
        return 0;
    }
}

if (!function_exists('primex_additional_signal_setting_key')) {
    function primex_additional_signal_setting_key(string $userId): string {
        $clean = preg_replace('/[^A-Za-z0-9._-]/', '_', trim($userId));
        return 'ADD_SIG_USER_' . substr($clean !== '' ? $clean : 'unknown', 0, 100);
    }
}

if (!function_exists('primex_load_additional_signal_record')) {
    function primex_load_additional_signal_record(SupabaseClient $supabase, string $userId): array {
        $empty = [
            'user_id' => $userId,
            'grants' => [],
            'usages' => [],
            'updated_at' => gmdate('Y-m-d H:i:s'),
        ];
        if ($userId === '' || !$supabase->isConfigured()) {
            return $empty;
        }
        $key = primex_additional_signal_setting_key($userId);
        $res = $supabase->select('system_settings', [
            'setting_key' => 'eq.' . $key,
            'select' => 'setting_key,setting_value',
            'limit' => '1'
        ]);
        if (!empty($res['success']) && !empty($res['data'][0]['setting_value'])) {
            $decoded = json_decode((string)$res['data'][0]['setting_value'], true);
            if (is_array($decoded)) {
                $decoded['user_id'] = $userId;
                if (!isset($decoded['grants']) || !is_array($decoded['grants'])) $decoded['grants'] = [];
                if (!isset($decoded['usages']) || !is_array($decoded['usages'])) $decoded['usages'] = [];
                return $decoded;
            }
        }
        return $empty;
    }
}

if (!function_exists('primex_save_additional_signal_record')) {
    function primex_save_additional_signal_record(SupabaseClient $supabase, string $userId, array $record): bool {
        if ($userId === '' || !$supabase->isConfigured()) return false;
        $record['user_id'] = $userId;
        $record['updated_at'] = gmdate('Y-m-d H:i:s');
        $key = primex_additional_signal_setting_key($userId);
        $res = $supabase->upsert('system_settings', [[
            'setting_key' => $key,
            'setting_value' => json_encode($record, JSON_UNESCAPED_SLASHES),
            'description' => 'Additional signal credits ledger for user ' . substr($userId, 0, 36),
            'updated_at' => gmdate('Y-m-d H:i:s'),
        ]], 'setting_key');
        return !empty($res['success']);
    }
}

if (!function_exists('primex_summarize_additional_signal_record')) {
    function primex_summarize_additional_signal_record(array $record, array $executedAddIds = []): array {
        $grants = is_array($record['grants'] ?? null) ? $record['grants'] : [];
        $usages = is_array($record['usages'] ?? null) ? $record['usages'] : [];

        // Reconcile any executed sig_add_* rows from user_signal_executions into usages
        foreach ($executedAddIds as $sigId) {
            $sigId = trim((string)$sigId);
            if ($sigId === '') continue;
            $uKey = 'EXEC:' . $sigId;
            if (!isset($usages[$uKey])) {
                $usages[$uKey] = [
                    'signal_id' => $sigId,
                    'credits' => 1,
                    'reward_usdt' => 4.00,
                    'used_at' => gmdate('Y-m-d H:i:s'),
                ];
            }
        }

        $grantedTotal = 0;
        $fromDeposits = 0;
        $fromReferrals = 0;
        $grantList = [];
        foreach ($grants as $gKey => $g) {
            if (!is_array($g)) continue;
            $cnt = max(0, (int)($g['credits'] ?? 0));
            $grantedTotal += $cnt;
            $source = strtoupper(trim((string)($g['source'] ?? 'DEPOSIT')));
            if ($source === 'REFERRAL') {
                $fromReferrals += $cnt;
            } else {
                $fromDeposits += $cnt;
            }
            $grantList[] = array_merge($g, ['grant_key' => (string)$gKey]);
        }

        $usedTotal = 0;
        foreach ($usages as $u) {
            if (!is_array($u)) continue;
            $usedTotal += max(0, (int)($u['credits'] ?? 1));
        }

        $remaining = max(0, $grantedTotal - $usedTotal);

        return [
            'remaining' => $remaining,
            'granted_total' => $grantedTotal,
            'used_total' => $usedTotal,
            'from_deposits' => $fromDeposits,
            'from_referrals' => $fromReferrals,
            'reward_usdt' => 4.00,
            'earned_additional_usdt' => round($usedTotal * 4.00, 2),
            'separate_from_30d_plan' => true,
            'schedule_time_pkt' => '09:30 PM',
            'grants' => array_slice(array_reverse($grantList), 0, 20),
            'tiers' => primex_additional_signal_tiers(),
        ];
    }
}

if (!function_exists('primex_get_additional_signal_status')) {
    function primex_get_additional_signal_status(SupabaseClient $supabase, string $userId, array $executedSignalIds = []): array {
        $record = primex_load_additional_signal_record($supabase, $userId);
        $addExecuted = [];
        foreach ($executedSignalIds as $sid) {
            $sid = trim((string)$sid);
            if ($sid !== '' && strpos($sid, 'sig_add_') === 0) {
                $addExecuted[] = $sid;
            }
        }
        if (empty($addExecuted) && $userId !== '' && $supabase->isConfigured()) {
            $exRes = $supabase->select('user_signal_executions', [
                'user_id' => 'eq.' . $userId,
                'select' => 'signal_id',
                'limit' => '200'
            ]);
            if (!empty($exRes['success']) && is_array($exRes['data'])) {
                foreach ($exRes['data'] as $row) {
                    $sid = trim((string)($row['signal_id'] ?? ''));
                    if ($sid !== '' && strpos($sid, 'sig_add_') === 0) {
                        $addExecuted[] = $sid;
                    }
                }
            }
        }
        return primex_summarize_additional_signal_record($record, $addExecuted);
    }
}

if (!function_exists('primex_grant_additional_signal_credit')) {
    function primex_grant_additional_signal_credit(
        SupabaseClient $supabase,
        string $userId,
        string $grantKey,
        int $credits,
        string $source,
        float $depositAmount,
        string $depositId,
        string $relatedUserId = ''
    ): bool {
        if ($userId === '' || $grantKey === '' || $credits <= 0) return false;
        $record = primex_load_additional_signal_record($supabase, $userId);
        if (isset($record['grants'][$grantKey])) {
            return false; // Idempotent: already granted for this deposit event
        }
        $record['grants'][$grantKey] = [
            'credits' => $credits,
            'source' => strtoupper($source),
            'deposit_amount' => round($depositAmount, 2),
            'deposit_id' => $depositId,
            'related_user_id' => $relatedUserId,
            'reward_each_usdt' => 4.00,
            'granted_at' => gmdate('Y-m-d H:i:s'),
        ];
        return primex_save_additional_signal_record($supabase, $userId, $record);
    }
}

if (!function_exists('primex_consume_additional_signal_credit')) {
    function primex_consume_additional_signal_credit(SupabaseClient $supabase, string $userId, string $signalId): array {
        $record = primex_load_additional_signal_record($supabase, $userId);
        $uKey = 'EXEC:' . $signalId;
        if (isset($record['usages'][$uKey])) {
            return ['consumed' => true, 'already_used' => true, 'status' => primex_summarize_additional_signal_record($record)];
        }
        $summary = primex_summarize_additional_signal_record($record);
        if (($summary['remaining'] ?? 0) <= 0) {
            return ['consumed' => false, 'already_used' => false, 'status' => $summary];
        }
        $record['usages'][$uKey] = [
            'signal_id' => $signalId,
            'credits' => 1,
            'reward_usdt' => 4.00,
            'used_at' => gmdate('Y-m-d H:i:s'),
        ];
        $saved = primex_save_additional_signal_record($supabase, $userId, $record);
        return ['consumed' => $saved, 'already_used' => false, 'status' => primex_summarize_additional_signal_record($record)];
    }
}

if (!function_exists('primex_resolve_direct_inviter')) {
    function primex_resolve_direct_inviter(SupabaseClient $supabase, string $referredByRaw, string $excludeUserId): ?array {
        $ref = trim($referredByRaw);
        if ($ref === '') return null;
        $refUpper = strtoupper($ref);

        // Fetch profiles once and match referral_code case-insensitively or by id
        $res = $supabase->selectAll('profiles', [
            'select' => 'id,email,first_name,referral_code,is_active'
        ], 1000);
        if (empty($res['success']) || !is_array($res['data'])) return null;

        foreach ($res['data'] as $p) {
            $pid = trim((string)($p['id'] ?? ''));
            if ($pid === '' || $pid === $excludeUserId) continue;
            $pCode = strtoupper(trim((string)($p['referral_code'] ?? '')));
            if ($pid === $ref || strtoupper($pid) === $refUpper || ($pCode !== '' && $pCode === $refUpper)) {
                return $p;
            }
        }
        return null;
    }
}

if (!function_exists('primex_grant_additional_signals_for_deposit')) {
    function primex_grant_additional_signals_for_deposit(
        SupabaseClient $supabase,
        string $depositId,
        string $depositorUserId,
        float $amount
    ): array {
        $credits = primex_additional_signals_for_deposit($amount);
        if ($credits <= 0 || $depositId === '' || $depositorUserId === '') {
            return ['credits' => 0, 'depositor_granted' => false, 'inviter_granted' => false, 'inviter_id' => null];
        }

        $depositorGranted = primex_grant_additional_signal_credit(
            $supabase,
            $depositorUserId,
            'DEP:' . $depositId,
            $credits,
            'DEPOSIT',
            $amount,
            $depositId
        );

        // Notify depositor of unlocked Additional Signals
        if ($depositorGranted) {
            try {
                $supabase->insert('user_notifications', [[
                    'user_id' => $depositorUserId,
                    'title' => "⚡ +{$credits} Additional Signal" . ($credits > 1 ? 's' : '') . " Unlocked",
                    'message' => "Your $" . number_format($amount, 2) . " deposit unlocked {$credits} Additional Signal credit" . ($credits > 1 ? 's' : '') . " ($4.00 USDT fixed profit each at 9:30 PM PKT, separate from your 30-day 2x plan).",
                    'type' => 'SIGNAL_AVAILABLE',
                    'is_read' => false,
                    'created_at' => gmdate('Y-m-d H:i:s'),
                ]]);
            } catch (Throwable $e) {}
        }

        $inviterGranted = false;
        $inviterId = null;
        try {
            $profRes = $supabase->select('profiles', [
                'id' => 'eq.' . $depositorUserId,
                'select' => 'id,email,referred_by',
                'limit' => '1'
            ]);
            $prof = (!empty($profRes['success']) && !empty($profRes['data'][0])) ? $profRes['data'][0] : [];
            $referredBy = trim((string)($prof['referred_by'] ?? ''));
            if ($referredBy !== '') {
                $inviter = primex_resolve_direct_inviter($supabase, $referredBy, $depositorUserId);
                if ($inviter && !empty($inviter['id']) && ($inviter['is_active'] ?? true)) {
                    $inviterId = (string)$inviter['id'];
                    $inviterGranted = primex_grant_additional_signal_credit(
                        $supabase,
                        $inviterId,
                        'REF:' . $depositId,
                        $credits,
                        'REFERRAL',
                        $amount,
                        $depositId,
                        $depositorUserId
                    );
                    if ($inviterGranted) {
                        try {
                            $supabase->insert('user_notifications', [[
                                'user_id' => $inviterId,
                                'title' => "🎁 Referral Additional Signal Reward (+{$credits})",
                                'message' => "Your invited team member completed a $" . number_format($amount, 2) . " deposit. Both accounts received {$credits} Additional Signal credit" . ($credits > 1 ? 's' : '') . " ($4.00 USDT fixed each at 9:30 PM PKT).",
                                'type' => 'SIGNAL_AVAILABLE',
                                'is_read' => false,
                                'created_at' => gmdate('Y-m-d H:i:s'),
                            ]]);
                        } catch (Throwable $e) {}
                    }
                }
            }
        } catch (Throwable $e) {}

        return [
            'credits' => $credits,
            'depositor_granted' => $depositorGranted,
            'inviter_granted' => $inviterGranted,
            'inviter_id' => $inviterId,
        ];
    }
}
