<?php
/**
 * Prime X Capital - Live Signal Email Broadcast Helper
 *
 * Ensures every non-test signal entering its LIVE window sends a single,
 * idempotent email notification to all eligible registered users (deposit >= $100)
 * using fast batched database reads and stale-lock recovery.
 */

declare(strict_types=1);

require_once __DIR__ . '/mailer.php';
require_once __DIR__ . '/email_templates.php';
require_once __DIR__ . '/wallet_breakdown.php';
require_once __DIR__ . '/additional_signals.php';

if (!function_exists('primex_is_signal_live_for_broadcast')) {
    function primex_is_signal_live_for_broadcast(array $signal): bool {
        $sigId = trim((string)($signal['id'] ?? ''));
        if ($sigId === '' || strpos($sigId, 'sig_test_') === 0) {
            return false;
        }
        if (filter_var($signal['is_testing'] ?? false, FILTER_VALIDATE_BOOLEAN)
            || filter_var($signal['no_profit'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
            return false;
        }
        $status = strtoupper(trim((string)($signal['status'] ?? '')));
        if (!in_array($status, ['PUBLISHED', 'ACTIVE'], true)) {
            return false;
        }
        $nowTs = time();
        $pubRaw = (string)($signal['published_at'] ?? $signal['scheduled_at'] ?? '');
        $expRaw = (string)($signal['expires_at'] ?? '');
        if ($pubRaw !== '') {
            $pubTs = strtotime($pubRaw);
            if ($pubTs !== false && $nowTs < ($pubTs - 5)) {
                return false;
            }
        }
        if ($expRaw !== '') {
            $expTs = strtotime($expRaw);
            if ($expTs !== false && $nowTs >= $expTs) {
                return false;
            }
        }
        return true;
    }
}

if (!function_exists('primex_promote_due_signals')) {
    /**
     * Promote any non-test SCHEDULED signal whose broadcast window has opened
     * (including custom signals with daily_slot = 0) from SCHEDULED to PUBLISHED
     * so notifications, users, and live email broadcasts fire immediately.
     */
    function primex_promote_due_signals(SupabaseClient $supabase, array &$signals): array {
        if (!$supabase->isConfigured() || empty($signals)) {
            return [];
        }
        $nowTs = time();
        $promoted = [];
        foreach ($signals as &$sig) {
            if (!is_array($sig)) continue;
            $sigId = trim((string)($sig['id'] ?? ''));
            if ($sigId === '' || strpos($sigId, 'sig_test_') === 0) continue;
            $status = strtoupper(trim((string)($sig['status'] ?? '')));
            if ($status !== 'SCHEDULED') continue;

            $pubRaw = (string)($sig['published_at'] ?? $sig['scheduled_at'] ?? '');
            $expRaw = (string)($sig['expires_at'] ?? '');
            if ($pubRaw === '') continue;
            $pubTs = strtotime($pubRaw);
            $expTs = $expRaw !== '' ? strtotime($expRaw) : false;
            if ($pubTs === false || $nowTs < $pubTs) continue;
            if ($expTs !== false && $nowTs >= $expTs) continue;

            $upd = $supabase->update('trading_signals', ['status' => 'PUBLISHED'], ['id' => 'eq.' . $sigId]);
            if (!empty($upd['success'])) {
                $sig['status'] = 'PUBLISHED';
                $promoted[] = $sig;
            } else {
                // Keep in-memory published so broadcast can still evaluate cleanly
                $sig['status'] = 'PUBLISHED';
                $promoted[] = $sig;
            }
        }
        unset($sig);
        return $promoted;
    }
}

if (!function_exists('primex_batch_compute_user_eligibility')) {
    /**
     * Computes eligible capital and non-referral assets for ALL users using a single
     * parallel selectMany() round-trip instead of N+1 per-user Supabase queries.
     */
    function primex_batch_compute_user_eligibility(SupabaseClient $supabase): array {
        $batch = $supabase->selectMany([
            'wallets' => [
                'table' => 'wallet_balances',
                'params' => ['select' => 'user_id,wallet_type,asset,balance,promotional_balance'],
                'headers' => ['Range: 0-9999']
            ],
            'deposits' => [
                'table' => 'deposits',
                'params' => ['select' => 'user_id,amount,status,asset'],
                'headers' => ['Range: 0-9999']
            ],
            'ledger' => [
                'table' => 'ledger_entries',
                'params' => [
                    'select' => 'user_id,entry_type,asset,amount,description,reference_id',
                    'entry_type' => 'in.(REFERRAL_COMMISSION,DEPOSIT_BONUS,BONUS,PROMO_BONUS,WELCOME_BONUS,STIPEND,ADJUSTMENT)'
                ],
                'headers' => ['Range: 0-9999']
            ],
            'add_settings' => [
                'table' => 'system_settings',
                'params' => ['setting_key' => 'like.ADD_SIG_USER_%', 'select' => 'setting_key,setting_value'],
                'headers' => ['Range: 0-4999']
            ],
            'add_execs' => [
                'table' => 'user_signal_executions',
                'params' => ['signal_id' => 'like.sig_add_%', 'select' => 'user_id,signal_id,executed_at,created_at'],
                'headers' => ['Range: 0-4999']
            ]
        ]);

        $byUser = [];
        $ensure = static function (string $uid) use (&$byUser): void {
            if (!isset($byUser[$uid])) {
                $byUser[$uid] = [
                    'funding' => 0.0,
                    'exchange' => 0.0,
                    'trading' => 0.0,
                    'promo_col' => 0.0,
                    'approved_deposits' => 0.0,
                    'deposit_adjustments' => 0.0,
                    'referral_bonus_raw' => 0.0,
                    'deposit_bonus_raw' => 0.0,
                ];
            }
        };

        $extractAll = static function (string $key, string $table, array $params) use (&$batch, $supabase): array {
            $res = $batch[$key] ?? ['success' => false];
            if (empty($res['success']) || !is_array($res['data'] ?? null)) return [];
            $rows = $res['data'];
            $totalCount = isset($res['count']) ? (int)$res['count'] : count($rows);
            if ($totalCount > count($rows) && count($rows) > 0) {
                $full = $supabase->selectAll($table, $params, 1000);
                if (!empty($full['success']) && is_array($full['data'] ?? null)) {
                    return $full['data'];
                }
            }
            return $rows;
        };

        $walletRows = $extractAll('wallets', 'wallet_balances', ['select' => 'user_id,wallet_type,asset,balance,promotional_balance']);
        foreach ($walletRows as $row) {
            $uid = trim((string)($row['user_id'] ?? ''));
            if ($uid === '') continue;
            $rowAsset = strtoupper(trim((string)($row['asset'] ?? 'USDT')));
            if ($rowAsset !== '' && $rowAsset !== 'USDT') continue;
            $ensure($uid);
            $val = max(0.0, (float)($row['balance'] ?? 0));
            $byUser[$uid]['promo_col'] += max(0.0, (float)($row['promotional_balance'] ?? 0));
            $wType = strtolower(trim((string)($row['wallet_type'] ?? '')));
            if ($wType === 'funding') $byUser[$uid]['funding'] += $val;
            elseif ($wType === 'exchange') $byUser[$uid]['exchange'] += $val;
            elseif ($wType === 'trading') $byUser[$uid]['trading'] += $val;
        }

        $depositRows = $extractAll('deposits', 'deposits', ['select' => 'user_id,amount,status,asset']);
        foreach ($depositRows as $dep) {
            $uid = trim((string)($dep['user_id'] ?? ''));
            if ($uid === '') continue;
            $status = strtoupper(trim((string)($dep['status'] ?? '')));
            $depAsset = strtoupper(trim((string)($dep['asset'] ?? 'USDT')));
            if ($depAsset === 'USDT' && in_array($status, ['COMPLETED', 'APPROVED', 'CONFIRMED'], true)) {
                $ensure($uid);
                $byUser[$uid]['approved_deposits'] += max(0.0, (float)($dep['amount'] ?? 0));
            }
        }

        $ledgerRows = $extractAll('ledger', 'ledger_entries', [
            'select' => 'user_id,entry_type,asset,amount,description,reference_id',
            'entry_type' => 'in.(REFERRAL_COMMISSION,DEPOSIT_BONUS,BONUS,PROMO_BONUS,WELCOME_BONUS,STIPEND,ADJUSTMENT)'
        ]);
        foreach ($ledgerRows as $entry) {
            $uid = trim((string)($entry['user_id'] ?? ''));
            if ($uid === '') continue;
            $entryAsset = strtoupper(trim((string)($entry['asset'] ?? 'USDT')));
            if ($entryAsset !== '' && $entryAsset !== 'USDT') continue;
            $ensure($uid);
            $entryType = strtoupper(trim((string)($entry['entry_type'] ?? '')));
            $amount = (float)($entry['amount'] ?? 0);
            $desc = strtoupper(trim((string)($entry['description'] ?? '')));
            $ref = strtoupper(trim((string)($entry['reference_id'] ?? '')));
            $sourceText = trim($desc . ' ' . $ref);

            if ($entryType === 'REFERRAL_COMMISSION') {
                $byUser[$uid]['referral_bonus_raw'] += $amount;
            } elseif (in_array($entryType, ['DEPOSIT_BONUS', 'BONUS', 'PROMO_BONUS', 'WELCOME_BONUS', 'STIPEND'], true)) {
                $byUser[$uid]['deposit_bonus_raw'] += $amount;
            } elseif ($entryType === 'ADJUSTMENT') {
                if (strpos($desc, '[REFERRAL_BONUS]') === 0 || strpos($ref, '[REFERRAL_BONUS]') === 0) {
                    $byUser[$uid]['referral_bonus_raw'] += $amount;
                } elseif (strpos($desc, '[DEPOSIT]') === 0 || strpos($ref, '[DEPOSIT]') === 0) {
                    $byUser[$uid]['deposit_adjustments'] += $amount;
                } elseif (strpos($desc, '[PROFIT]') === 0 || strpos($desc, '[OTHER]') === 0) {
                    $byUser[$uid]['deposit_bonus_raw'] += $amount;
                } elseif (preg_match('/\bREFERRAL\b/i', $sourceText)) {
                    $byUser[$uid]['referral_bonus_raw'] += $amount;
                } elseif (preg_match('/\b(BONUS|PROMO|REWARD|STIPEND)\b/i', $sourceText)) {
                    $byUser[$uid]['deposit_bonus_raw'] += $amount;
                } elseif (preg_match('/\bDEPOSIT\b/i', $sourceText)) {
                    $byUser[$uid]['deposit_adjustments'] += $amount;
                } elseif ($amount > 0) {
                    $byUser[$uid]['deposit_bonus_raw'] += $amount;
                }
            }
        }

        // Additional-signal records keyed by sanitized user ID
        $addRecordsByUser = [];
        $addSettings = ($batch['add_settings']['success'] ?? false) && is_array($batch['add_settings']['data'] ?? null) ? $batch['add_settings']['data'] : [];
        foreach ($addSettings as $row) {
            $decoded = json_decode((string)($row['setting_value'] ?? ''), true);
            if (is_array($decoded) && !empty($decoded['user_id'])) {
                $addRecordsByUser[(string)$decoded['user_id']] = $decoded;
            }
        }
        $addExecByUser = [];
        $addExecs = ($batch['add_execs']['success'] ?? false) && is_array($batch['add_execs']['data'] ?? null) ? $batch['add_execs']['data'] : [];
        foreach ($addExecs as $ex) {
            $uid = trim((string)($ex['user_id'] ?? ''));
            if ($uid !== '') $addExecByUser[$uid][] = $ex;
        }

        $out = [];
        foreach ($byUser as $uid => $acc) {
            $spotTotal = round($acc['funding'] + $acc['exchange'], 2);
            $futureTotal = round($acc['trading'], 2);
            $lockedReferralInSpot = round(min($spotTotal, max(0.0, $acc['referral_bonus_raw'])), 2);
            $transferableSpot = round(max(0.0, $spotTotal - $lockedReferralInSpot), 2);
            $nonReferralPool = round($transferableSpot + $futureTotal, 2);
            $depositBonusCombined = max(0.0, $acc['deposit_bonus_raw'], $acc['promo_col']);
            $depositBonusTotal = round(min($nonReferralPool, $depositBonusCombined), 2);
            $depositBalanceTotal = round(max(0.0, $nonReferralPool - $depositBonusTotal), 2);
            $fundedDepositPrincipal = round(max(0.0, $acc['approved_deposits'] + $acc['deposit_adjustments']), 2);
            $eligibleCapital = round(max($fundedDepositPrincipal, $depositBalanceTotal + $depositBonusTotal), 2);

            $addRec = $addRecordsByUser[$uid] ?? ['user_id' => $uid, 'grants' => [], 'usages' => []];
            $addSummary = primex_summarize_additional_signal_record($addRec, $addExecByUser[$uid] ?? []);

            $out[$uid] = [
                'eligible_capital' => $eligibleCapital,
                'non_referral_assets' => $nonReferralPool,
                'future_total_usdt' => $futureTotal,
                'can_use_additional_today' => ((int)($addSummary['remaining'] ?? 0) > 0 && !empty($addSummary['can_use_today']))
            ];
        }

        return $out;
    }
}

if (!function_exists('primex_broadcast_signal_live_if_needed')) {
    function primex_broadcast_signal_live_if_needed(SupabaseClient $supabase, array $signal): array {
        if (!$supabase->isConfigured() || !primex_is_signal_live_for_broadcast($signal)) {
            return ['sent' => 0, 'skipped' => true, 'reason' => 'not_live_or_test'];
        }

        $sigId = trim((string)$signal['id']);
        $lockKey = 'SIGNAL_LIVE_BROADCAST_' . substr(preg_replace('/[^A-Za-z0-9._:-]/', '_', $sigId), 0, 100);

        $existing = $supabase->select('system_settings', [
            'setting_key' => 'eq.' . $lockKey,
            'select' => 'setting_key,setting_value',
            'limit' => '1'
        ]);
        if (!empty($existing['success']) && !empty($existing['data'][0])) {
            $lockVal = (string)($existing['data'][0]['setting_value'] ?? '');
            if (strpos($lockVal, 'SENT:') === 0) {
                return ['sent' => 0, 'skipped' => true, 'reason' => 'already_broadcast'];
            }
            if (strpos($lockVal, 'LOCKED:') === 0) {
                $lockedIso = substr($lockVal, 7);
                $lockedTs = strtotime($lockedIso);
                // If locked recently (< 90s), another request is actively dispatching emails
                if ($lockedTs !== false && (time() - $lockedTs) < 90) {
                    return ['sent' => 0, 'skipped' => true, 'reason' => 'broadcast_in_progress'];
                }
                // Stale lock (> 90s from a killed/timed-out request): recover and retry
            }
        }

        $smtp = primex_load_smtp_config($supabase);
        if (empty($smtp['user']) || empty($smtp['pass'])) {
            return ['sent' => 0, 'skipped' => true, 'reason' => 'smtp_not_configured'];
        }

        $lockUpsert = $supabase->upsert('system_settings', [[
            'setting_key' => $lockKey,
            'setting_value' => 'LOCKED:' . gmdate('Y-m-d\TH:i:s\Z'),
            'updated_at' => gmdate('Y-m-d H:i:s')
        ]], 'setting_key');
        if (empty($lockUpsert['success'])) {
            return ['sent' => 0, 'skipped' => true, 'reason' => 'lock_failed'];
        }

        @ignore_user_abort(true);
        @set_time_limit(180);

        $profilesRes = $supabase->selectAll('profiles', [
            'select' => 'id,email,full_name,first_name,last_name,role,is_active',
            'order' => 'created_at.asc'
        ], 2000);
        if (empty($profilesRes['success']) || !is_array($profilesRes['data'])) {
            return ['sent' => 0, 'skipped' => true, 'reason' => 'profiles_unavailable'];
        }

        // Batch-compute every user's eligibility in a single parallel selectMany() round-trip
        $eligibilityMap = primex_batch_compute_user_eligibility($supabase);

        $symbol = strtoupper(trim((string)($signal['symbol'] ?? 'BTC/USDT')));
        $direction = strtoupper(trim((string)($signal['direction'] ?? 'BUY')));
        $slot = (int)($signal['daily_slot'] ?? 0);
        $isAdditional = ($slot === 3 || strpos($sigId, 'sig_add_') === 0 || !empty($signal['is_additional']));
        $profitPct = $isAdditional ? 0.0 : (float)($signal['profit_percentage'] ?? 1.67);
        $duration = max(1, (int)($signal['duration_minutes'] ?? 15));
        $signalsUrl = primex_app_url() . '/?view=signals';
        $minDepositRequired = 100.0;

        $sentCount = 0;
        $eligibleRecipientCount = 0;
        $seenEmails = [];
        foreach ($profilesRes['data'] as $profile) {
            if (array_key_exists('is_active', $profile) && $profile['is_active'] !== null) {
                $isActiveVal = filter_var($profile['is_active'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
                if ($isActiveVal === false) {
                    continue;
                }
            }
            $uid = trim((string)($profile['id'] ?? ''));
            $email = strtolower(trim((string)($profile['email'] ?? '')));
            if ($uid === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) continue;
            if (isset($seenEmails[$email])) continue;
            $seenEmails[$email] = true;

            $elig = $eligibilityMap[$uid] ?? null;
            if (!$elig) continue;

            $eligibleCapital = (float)($elig['eligible_capital'] ?? 0.0);
            $nonReferralAssets = (float)($elig['non_referral_assets'] ?? 0.0);
            if ($eligibleCapital < $minDepositRequired || $nonReferralAssets < $minDepositRequired) {
                continue;
            }
            if ($isAdditional && empty($elig['can_use_additional_today'])) {
                continue;
            }

            $eligibleRecipientCount++;
            $name = trim((string)($profile['full_name'] ?? ''));
            if ($name === '') {
                $name = trim((string)($profile['first_name'] ?? '') . ' ' . (string)($profile['last_name'] ?? ''));
            }
            $template = primex_email_template_signal_live(
                $name,
                $symbol,
                $direction,
                $profitPct,
                $duration,
                '',
                $signalsUrl,
                $isAdditional
            );
            $mailRes = primex_send_templated_email($email, $template, $smtp);
            if (!empty($mailRes['success'])) {
                $sentCount++;
            }
        }

        try {
            $supabase->upsert('system_settings', [[
                'setting_key' => $lockKey,
                'setting_value' => 'SENT:' . $sentCount . ':' . gmdate('Y-m-d\TH:i:s\Z'),
                'updated_at' => gmdate('Y-m-d H:i:s')
            ]], 'setting_key');
        } catch (Throwable $e) {}

        if (function_exists('primex_record_log')) {
            primex_record_log('SIGNAL', 'SIGNAL_LIVE_EMAIL_BROADCAST', "Live signal broadcast completed for {$symbol}", [
                'signal_id' => $sigId,
                'eligible_users' => $eligibleRecipientCount,
                'emails_sent' => $sentCount,
                'is_additional' => $isAdditional
            ], 'INFO');
        }

        return ['sent' => $sentCount, 'eligible' => $eligibleRecipientCount, 'skipped' => false];
    }
}

if (!function_exists('primex_schedule_signal_live_broadcast')) {
    function primex_schedule_signal_live_broadcast(SupabaseClient $supabase, array $signals): void {
        $liveQueue = [];
        foreach ($signals as $sig) {
            if (is_array($sig) && primex_is_signal_live_for_broadcast($sig)) {
                $liveQueue[] = $sig;
            }
        }
        if (empty($liveQueue)) return;

        static $registered = [];
        $toDispatch = [];
        foreach ($liveQueue as $sig) {
            $id = (string)$sig['id'];
            if (!isset($registered[$id])) {
                $registered[$id] = true;
                $toDispatch[] = $sig;
            }
        }
        if (empty($toDispatch)) return;

        @ignore_user_abort(true);
        register_shutdown_function(static function () use ($supabase, $toDispatch): void {
            @ignore_user_abort(true);
            @set_time_limit(180);
            if (function_exists('fastcgi_finish_request')) {
                @fastcgi_finish_request();
            } elseif (function_exists('litespeed_finish_request')) {
                @litespeed_finish_request();
            } else {
                while (ob_get_level() > 0) {
                    @ob_end_flush();
                }
                @flush();
            }
            foreach ($toDispatch as $sig) {
                try {
                    primex_broadcast_signal_live_if_needed($supabase, $sig);
                } catch (Throwable $e) {}
            }
        });
    }
}
