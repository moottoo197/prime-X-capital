<?php
/**
 * Prime X Capital - Live Signal Email Broadcast Helper
 *
 * Ensures every non-test signal entering its LIVE window sends a single,
 * idempotent email notification to all active registered users without
 * duplicating sends or blocking HTTP responses.
 */

declare(strict_types=1);

require_once __DIR__ . '/mailer.php';
require_once __DIR__ . '/email_templates.php';

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
            return ['sent' => 0, 'skipped' => true, 'reason' => 'already_broadcast'];
        }

        $lockUpsert = $supabase->upsert('system_settings', [[
            'setting_key' => $lockKey,
            'setting_value' => 'LOCKED:' . gmdate('Y-m-d\TH:i:s\Z'),
            'updated_at' => gmdate('Y-m-d H:i:s')
        ]], 'setting_key');
        if (empty($lockUpsert['success'])) {
            return ['sent' => 0, 'skipped' => true, 'reason' => 'lock_failed'];
        }

        $smtp = primex_load_smtp_config($supabase);
        if (empty($smtp['user']) || empty($smtp['pass'])) {
            return ['sent' => 0, 'skipped' => true, 'reason' => 'smtp_not_configured'];
        }

        @ignore_user_abort(true);
        @set_time_limit(180);

        $profilesRes = $supabase->selectAll('profiles', [
            'is_active' => 'eq.true',
            'select' => 'id,email,full_name',
            'order' => 'created_at.asc'
        ], 500);
        if (empty($profilesRes['success']) || !is_array($profilesRes['data'])) {
            return ['sent' => 0, 'skipped' => true, 'reason' => 'profiles_unavailable'];
        }

        $symbol = strtoupper(trim((string)($signal['symbol'] ?? 'BTC/USDT')));
        $direction = strtoupper(trim((string)($signal['direction'] ?? 'BUY')));
        $slot = (int)($signal['daily_slot'] ?? 0);
        $isAdditional = ($slot === 3 || strpos($sigId, 'sig_add_') === 0 || !empty($signal['is_additional']));
        $profitPct = $isAdditional ? 0.0 : (float)($signal['profit_percentage'] ?? 1.67);
        $duration = max(1, (int)($signal['duration_minutes'] ?? 15));
        $expiresAtPkt = '';
        $expRaw = (string)($signal['expires_at'] ?? '');
        if ($expRaw !== '') {
            try {
                $dt = new DateTime($expRaw, new DateTimeZone('UTC'));
                $dt->setTimezone(new DateTimeZone('Asia/Karachi'));
                $expiresAtPkt = $dt->format('d M Y, h:i A') . ' PKT';
            } catch (Throwable $e) {
                $expiresAtPkt = $expRaw;
            }
        }
        $signalsUrl = primex_app_url() . '/?view=signals';

        $sentCount = 0;
        $seenEmails = [];
        foreach ($profilesRes['data'] as $profile) {
            $email = strtolower(trim((string)($profile['email'] ?? '')));
            if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) continue;
            if (isset($seenEmails[$email])) continue;
            $seenEmails[$email] = true;

            $name = trim((string)($profile['full_name'] ?? ''));
            $template = primex_email_template_signal_live(
                $name,
                $symbol,
                $direction,
                $profitPct,
                $duration,
                $expiresAtPkt,
                $signalsUrl,
                $isAdditional
            );
            $mailRes = primex_send_templated_email($email, $template);
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

        return ['sent' => $sentCount, 'skipped' => false];
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

        register_shutdown_function(static function () use ($supabase, $toDispatch): void {
            if (function_exists('fastcgi_finish_request')) {
                @fastcgi_finish_request();
            } elseif (function_exists('litespeed_finish_request')) {
                @litespeed_finish_request();
            } else {
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
