<?php
/**
 * User Trading Signals & Scheduling - Direct Supabase REST
 * Daily sessions in Pakistan Time (PKT):
 *   - Slot #1 (First Signal): 06:00 PM PKT (18:00, 1.67%)
 *   - Slot #2 (Second Signal): 08:00 PM PKT (20:00, 1.67%)
 *   - Slot #3 (Additional Signal): 09:30 PM PKT (21:30, $4.00 fixed USDT, separate from 30-day 2x plan)
 * Each session is valid for 15 minutes (or admin-configured duration).
 */
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/lib/signal_lifecycle.php';
require_once __DIR__ . '/lib/wallet_breakdown.php';
require_once __DIR__ . '/lib/signal_broadcast.php';
require_once __DIR__ . '/lib/additional_signals.php';

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

alphavest_archive_expired_signals($supabase);
try { $supabase->rpc('alphavest_cleanup_signals'); } catch (Throwable $e) {}

$user = getCurrentUser();
$userId = $user ? $user['id'] : null;

$walletBreakdown = $userId ? primex_compute_wallet_breakdown($supabase, (string)$userId) : [];
$totalBalance = (float)($walletBreakdown['total_assets_usdt'] ?? 0.0);
$spotBalance = (float)($walletBreakdown['spot_total_usdt'] ?? 0.0);
$futureBalance = (float)($walletBreakdown['future_total_usdt'] ?? 0.0);
$transferableSpot = (float)($walletBreakdown['transferable_spot_usdt'] ?? 0.0);
$referralBonus = (float)($walletBreakdown['referral_bonus_usdt'] ?? 0.0);
$depositBalance = (float)($walletBreakdown['deposit_balance_usdt'] ?? 0.0);
$depositBonus = (float)($walletBreakdown['deposit_bonus_usdt'] ?? 0.0);
$totalDeposited = (float)($walletBreakdown['funded_deposit_principal_usdt'] ?? 0.0);

$minReq = 100.0;
// Future balance is used for Trade & Signals. Referral bonus cannot be transferred to Future.
$eligibleCapital = round(max($totalDeposited, $depositBalance + $depositBonus), 2);
$isAdminOrVip = $user && in_array(strtoupper($user['role'] ?? ''), ['ADMIN', 'SUPER_ADMIN', 'VIP', 'FINANCE_MANAGER', 'KYC_MANAGER'], true);
$isEligible = ($futureBalance >= $minReq && $eligibleCapital >= $minReq) || $isAdminOrVip;
$requiresFutureTransfer = (!$isAdminOrVip && $futureBalance < $minReq && $transferableSpot >= $minReq);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('METHOD_NOT_ALLOWED', 'GET method required', 405);
}

$timezoneName = 'Asia/Karachi';
$tz = new DateTimeZone('Asia/Karachi');
$now = new DateTime('now', $tz);
$nowTs = $now->getTimestamp();
$today = $now->format('Y-m-d');
$minute = ((int)$now->format('H') * 60) + (int)$now->format('i');
$activeSlot = null;
if ($minute >= 18 * 60) $activeSlot = 1;
if ($minute >= 20 * 60) $activeSlot = 2;
if ($minute >= (21 * 60 + 30)) $activeSlot = 3;

$sigRes = $supabase->select('trading_signals', [
    'select' => 'id,symbol,direction,entry_price_min,entry_price_max,target_price_1,target_price_2,stop_loss,status,duration_minutes,daily_slot,profit_percentage,timezone_label,scheduled_at,published_at,expires_at,created_at',
    'order' => 'created_at.desc',
    'limit' => '500'
]);
$allSignals = ($sigRes['success'] && is_array($sigRes['data'])) ? $sigRes['data'] : [];
foreach ($allSignals as &$dailyDisplaySignal) {
    $sid = (string)($dailyDisplaySignal['id'] ?? '');
    $dSlot = (int)($dailyDisplaySignal['daily_slot'] ?? 0);
    if (in_array($dSlot, [1, 2], true) && strpos($sid, 'sig_test_') !== 0) {
        $dailyDisplaySignal['profit_percentage'] = 1.67;
    } elseif (($dSlot === 3 || strpos($sid, 'sig_add_') === 0) && strpos($sid, 'sig_test_') !== 0) {
        $dailyDisplaySignal['profit_percentage'] = 0;
        $dailyDisplaySignal['reward_usdt'] = 4.00;
        $dailyDisplaySignal['is_additional'] = true;
    }
}
unset($dailyDisplaySignal);

$templatesBySlot = [1 => null, 2 => null, 3 => null];
foreach ($allSignals as $existingSignal) {
    $existingId = trim((string)($existingSignal['id'] ?? ''));
    if (strpos($existingId, 'sig_test_') === 0) continue;
    $slot = (int)($existingSignal['daily_slot'] ?? 0);
    if (in_array($slot, [1, 2, 3], true) && $templatesBySlot[$slot] === null) {
        $templatesBySlot[$slot] = $existingSignal;
    }
}

$tomorrowDate = (clone $now)->modify('+1 day')->format('Y-m-d');
$todaySlot3End = (clone $now);
$todaySlot3End->setTime(21, 30, 0);
$slot3TemplateDuration = $templatesBySlot[3] ? max(1, (int)($templatesBySlot[3]['duration_minutes'] ?? 15)) : 15;
$todaySlot3End->modify('+' . $slot3TemplateDuration . ' minutes');
$dailyCycleFinished = $nowTs >= $todaySlot3End->getTimestamp();
$ensureDate = $dailyCycleFinished ? $tomorrowDate : $today;

$slotSchedules = [
    1 => ['hour' => 18, 'minute' => 0,  'prefix' => 'sig_daily_', 'pct' => 1.67],
    2 => ['hour' => 20, 'minute' => 0,  'prefix' => 'sig_daily_', 'pct' => 1.67],
    3 => ['hour' => 21, 'minute' => 30, 'prefix' => 'sig_add_',   'pct' => 0.0],
];

foreach ($slotSchedules as $ensureSlot => $cfg) {
    $sessionStart = new DateTime($ensureDate . sprintf(' %02d:%02d:00', $cfg['hour'], $cfg['minute']), $tz);
    $foundForDay = false;
    $foundIndex = null;
    $canonicalId = $cfg['prefix'] . $sessionStart->format('Ymd') . '_' . $ensureSlot;

    foreach ($allSignals as $idx => $existingSignal) {
        $existingId = (string)($existingSignal['id'] ?? '');
        if ($existingId === $canonicalId) {
            $foundForDay = true;
            $foundIndex = $idx;
            break;
        }
    }

    if (!$foundForDay) {
        foreach ($allSignals as $idx => $existingSignal) {
            if ((int)($existingSignal['daily_slot'] ?? 0) !== $ensureSlot) continue;
            $candidate = (string)($existingSignal['scheduled_at'] ?? $existingSignal['published_at'] ?? '');
            if ($candidate === '') continue;
            try {
                $candidateUtc = new DateTime($candidate, new DateTimeZone('UTC'));
                $candidateUtc->setTimezone($tz);
                if ($candidateUtc->format('Y-m-d H:i') === $sessionStart->format('Y-m-d H:i')) {
                    $foundForDay = true;
                    $foundIndex = $idx;
                    break;
                }
            } catch (Throwable $e) {}
        }
    }

    $template = $templatesBySlot[$ensureSlot] ?? ($templatesBySlot[1] ?? $templatesBySlot[2]);
    if ($template === null) {
        $template = [
            'symbol' => $ensureSlot === 3 ? 'ETH/USDT' : 'BTC/USDT',
            'direction' => 'BUY',
            'entry_price_min' => 0,
            'entry_price_max' => 0,
            'target_price_1' => 0,
            'target_price_2' => 0,
            'stop_loss' => 0,
            'profit_percentage' => $cfg['pct'],
            'duration_minutes' => 15,
        ];
    }

    $templateDuration = max(1, (int)($template['duration_minutes'] ?? 15));
    $sessionEnd = (clone $sessionStart)->modify('+' . $templateDuration . ' minutes');
    $isLiveNow = ($ensureDate === $today && $nowTs >= $sessionStart->getTimestamp() && $nowTs < $sessionEnd->getTimestamp());

    if (!$foundForDay && $ensureDate === $today && $nowTs >= $sessionEnd->getTimestamp()) {
        continue;
    }

    if (!$foundForDay) {
        $utcStart = (clone $sessionStart)->setTimezone(new DateTimeZone('UTC'));
        $utcEnd = (clone $sessionEnd)->setTimezone(new DateTimeZone('UTC'));
        $payload = [
            'id' => $canonicalId,
            'symbol' => $template['symbol'] ?? 'BTC/USDT',
            'direction' => $template['direction'] ?? 'BUY',
            'entry_price_min' => (float)($template['entry_price_min'] ?? 0),
            'entry_price_max' => (float)($template['entry_price_max'] ?? 0),
            'target_price_1' => (float)($template['target_price_1'] ?? 0),
            'target_price_2' => (float)($template['target_price_2'] ?? 0),
            'stop_loss' => (float)($template['stop_loss'] ?? 0),
            'status' => $isLiveNow ? 'PUBLISHED' : 'SCHEDULED',
            'duration_minutes' => $templateDuration,
            'daily_slot' => $ensureSlot,
            'profit_percentage' => $cfg['pct'],
            'timezone_label' => 'GLOBAL — ALL COUNTRIES (PKT)',
            'scheduled_at' => $utcStart->format('Y-m-d H:i:sP'),
            'published_at' => $utcStart->format('Y-m-d H:i:sP'),
            'expires_at' => $utcEnd->format('Y-m-d H:i:sP'),
            'created_at' => gmdate('Y-m-d H:i:s')
        ];
        if ($ensureSlot === 3) {
            $payload['is_additional'] = true;
            $payload['reward_usdt'] = 4.00;
        }
        $createDaily = $supabase->insert('trading_signals', [$payload]);
        if ($createDaily['success']) $allSignals[] = $payload;
    } else {
        $existing = $allSignals[$foundIndex] ?? null;
        if ($existing && $ensureDate === $today) {
            $existingStatus = strtoupper((string)($existing['status'] ?? ''));
            $storedStart = (string)($existing['scheduled_at'] ?? $existing['published_at'] ?? '');
            $storedStartMismatch = false;
            if ($storedStart !== '') {
                try {
                    $storedStartDt = new DateTime($storedStart, new DateTimeZone('UTC'));
                    $storedStartMismatch = abs($storedStartDt->getTimestamp() - $sessionStart->getTimestamp()) > 60;
                } catch (Throwable $e) {
                    $storedStartMismatch = true;
                }
            }
            $storedExpires = (string)($existing['expires_at'] ?? '');
            $storedExpired = false;
            if ($storedExpires !== '') {
                try { $storedExpired = (new DateTime($storedExpires, new DateTimeZone('UTC')))->getTimestamp() <= $nowTs; } catch (Throwable $e) {}
            }
            $withinOrBeforeSession = $nowTs < $sessionEnd->getTimestamp();
            if ($withinOrBeforeSession && ($storedStartMismatch || $existingStatus === 'EXPIRED' || $storedExpired || $existingStatus === 'CANCELLED')) {
                $utcStart = (clone $sessionStart)->setTimezone(new DateTimeZone('UTC'));
                $utcEnd = (clone $sessionEnd)->setTimezone(new DateTimeZone('UTC'));
                $repair = [
                    'status' => $isLiveNow ? 'PUBLISHED' : 'SCHEDULED',
                    'duration_minutes' => $templateDuration,
                    'profit_percentage' => $cfg['pct'],
                    'scheduled_at' => $utcStart->format('Y-m-d H:i:sP'),
                    'published_at' => $utcStart->format('Y-m-d H:i:sP'),
                    'expires_at' => $utcEnd->format('Y-m-d H:i:sP'),
                    'timezone_label' => 'GLOBAL — ALL COUNTRIES (PKT)'
                ];
                $repairRes = $supabase->update('trading_signals', $repair, ['id' => 'eq.' . (string)$existing['id']]);
                if ($repairRes['success']) {
                    $allSignals[$foundIndex] = array_merge($existing, $repair);
                }
            } elseif ($isLiveNow && $existingStatus === 'SCHEDULED') {
                $supabase->update('trading_signals', ['status' => 'PUBLISHED'], ['id' => 'eq.' . (string)$existing['id']]);
                $allSignals[$foundIndex]['status'] = 'PUBLISHED';
            }
        }
    }
}

$executedMap = [];
$userExecutions = [];
$userSignalProfitTotal = 0.0;
$executedSignalIds = [];
if ($userId) {
    $executionBatch = $supabase->selectMany([
        'executions' => [
            'table' => 'user_signal_executions',
            'params' => ['user_id' => "eq.{$userId}", 'order' => 'executed_at.desc', 'limit' => '500']
        ],
        'ledger' => [
            'table' => 'ledger_entries',
            'params' => ['user_id' => "eq.{$userId}", 'entry_type' => 'eq.TRADE_PNL', 'order' => 'created_at.desc', 'limit' => '500']
        ]
    ]);
    $exRes = $executionBatch['executions'] ?? ['success'=>false];
    if ($exRes['success'] && is_array($exRes['data'])) {
        foreach ($exRes['data'] as $ex) {
            if (!empty($ex['signal_id'])) {
                $executionSignalId = (string)$ex['signal_id'];
                if (strpos($executionSignalId, 'sig_test_') === 0) continue;
                $executedMap[$executionSignalId] = $ex;
                $executedSignalIds[] = $executionSignalId;
                $userExecutions[] = $ex;
            }
        }
    }
    $ledgerRes = $executionBatch['ledger'] ?? ['success'=>false];
    if ($ledgerRes['success'] && is_array($ledgerRes['data'])) {
        foreach ($ledgerRes['data'] as $entry) {
            $userSignalProfitTotal += max(0.0, (float)($entry['amount'] ?? 0));
            $ref = (string)($entry['reference_id'] ?? '');
            $desc = (string)($entry['description'] ?? '');
            if (strpos($ref, 'sig_exec_') === 0 && preg_match('/signal\s+([^\s)]+)/i', $desc, $m)) {
                $signalRef = $m[1];
                if (strpos($signalRef, 'sig_test_') === 0) continue;
                if (!isset($executedMap[$signalRef])) {
                    $marker = ['signal_id'=>$signalRef,'profit_amount'=>(float)($entry['amount'] ?? 0),'executed_at'=>$entry['created_at'] ?? null];
                    $executedMap[$signalRef] = $marker;
                    $executedSignalIds[] = $signalRef;
                    $userExecutions[] = $marker;
                }
            }
        }
    }
}

$additionalStatus = $userId
    ? primex_get_additional_signal_status($supabase, (string)$userId, $executedSignalIds)
    : primex_summarize_additional_signal_record(['grants' => [], 'usages' => []], []);
$additionalRemaining = (int)($additionalStatus['remaining'] ?? 0);

$tzLabel = $now->format('T');
if ($tzLabel === 'GMT') $tzLabel = 'UTC';
$liveSignals = [];
$liveDailyCount = 0;

foreach ($allSignals as $s) {
    $sigId = trim((string)($s['id'] ?? ''));
    if ($sigId === '') continue;
    $isTesting = strpos($sigId, 'sig_test_') === 0
        || filter_var($s['is_testing'] ?? false, FILTER_VALIDATE_BOOLEAN)
        || filter_var($s['no_profit'] ?? false, FILTER_VALIDATE_BOOLEAN);
    if (!$isTesting && isset($executedMap[$sigId])) continue;
    $status = strtoupper((string)($s['status'] ?? 'PUBLISHED'));
    if (!in_array($status, ['PUBLISHED', 'ACTIVE', 'SCHEDULED'], true)) continue;
    $slot = (int)($s['daily_slot'] ?? 0);
    $isAdditional = (!$isTesting) && ($slot === 3 || strpos($sigId, 'sig_add_') === 0);

    // Additional Signals are unlocked only by $300+ deposit or referral deposit tiers
    if ($isAdditional && $additionalRemaining <= 0 && !$isAdminOrVip) {
        continue;
    }

    if (in_array($slot, [1, 2, 3], true) && !$isTesting) {
        $hour = $slot === 3 ? 21 : ($slot === 2 ? 20 : 18);
        $minSlot = $slot === 3 ? 30 : 0;
        $sessionStart = new DateTime($today . sprintf(' %02d:%02d:00', $hour, $minSlot), $tz);
        $storedStart = (string)($s['scheduled_at'] ?? $s['published_at'] ?? '');
        if ($storedStart !== '') {
            try {
                $storedStartDt = new DateTime($storedStart, new DateTimeZone('UTC'));
                if ($storedStartDt->getTimestamp() !== $sessionStart->getTimestamp()) continue;
                $published = $storedStartDt;
            } catch (Throwable $e) {
                continue;
            }
        } elseif (strpos($sigId, 'sig_daily_' . $today . '_') !== 0 && strpos($sigId, 'sig_add_' . $today . '_') !== 0) {
            continue;
        } else {
            $published = clone $sessionStart;
        }
        try {
            $expires = !empty($s['expires_at'])
                ? new DateTime((string)$s['expires_at'], new DateTimeZone('UTC'))
                : (clone $published)->modify('+' . max(1, (int)($s['duration_minutes'] ?? 15)) . ' minutes');
        } catch (Throwable $e) {
            $expires = (clone $published)->modify('+' . max(1, (int)($s['duration_minutes'] ?? 15)) . ' minutes');
        }
        if ($nowTs < $published->getTimestamp() || $nowTs >= $expires->getTimestamp()) continue;
        $activeSlot = $slot;
        $timeLeft = max(0, $expires->getTimestamp() - $nowTs);
        if ($isAdditional) {
            $label = 'Additional Signal • $4.00 Fixed';
            $schedule = '09:30 PM ' . $tzLabel;
        } else {
            $label = 'Daily Signal #' . $slot;
            $schedule = $slot === 2 ? '08:00 PM ' . $tzLabel : '06:00 PM ' . $tzLabel;
        }
    } else {
        $rawStart = (string)($s['published_at'] ?? $s['scheduled_at'] ?? '');
        if ($rawStart === '') continue;
        try { $published = new DateTime($rawStart, new DateTimeZone('UTC')); } catch (Throwable $e) { continue; }
        try { $expires = !empty($s['expires_at']) ? new DateTime((string)$s['expires_at'], new DateTimeZone('UTC')) : (clone $published)->modify('+15 minutes'); } catch (Throwable $e) { $expires = (clone $published)->modify('+15 minutes'); }
        if ($nowTs < $published->getTimestamp() || $nowTs >= $expires->getTimestamp()) continue;
        $timeLeft = max(0, $expires->getTimestamp() - $nowTs);
        $label = $isTesting ? 'Testing Signal • No Profit' : 'Manual Signal';
        $schedule = $published->setTimezone($tz)->format('Y-m-d h:i A T');
    }

    if (!$isAdditional && !$isTesting) {
        $liveDailyCount++;
    }

    $canExec = $isAdditional ? ($additionalRemaining > 0 && !$isTesting) : ($isEligible && !$isTesting);
    $liveSignals[] = array_merge($s, [
        'status' => 'PUBLISHED',
        'is_live' => true,
        'is_expired' => false,
        'is_scheduled' => false,
        'is_executed' => false,
        'user_executed' => false,
        'has_used' => false,
        'can_execute' => $canExec,
        'visible_to_user' => true,
        'is_testing' => $isTesting,
        'no_profit' => $isTesting,
        'is_additional' => $isAdditional,
        'reward_usdt' => $isAdditional ? 4.00 : 0.0,
        'profit_percentage' => ($isTesting || $isAdditional) ? 0 : (float)($s['profit_percentage'] ?? 1.67),
        'time_left_seconds' => $timeLeft,
        'time_until_start_seconds' => 0,
        'published_at' => $published->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d H:i:s'),
        'expires_at' => $expires->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d H:i:s'),
        'schedule_time' => $schedule,
        'slot_label' => $label,
        'timezone_label' => 'PKT'
    ]);
}

if (!empty($liveSignals)) {
    primex_schedule_signal_live_broadcast($supabase, $liveSignals);
}

sendSuccess([
    'signals' => $liveSignals,
    'eligible' => $isEligible,
    'is_eligible' => $isEligible,
    'requires_future_transfer' => $requiresFutureTransfer,
    'min_deposit_required' => $minReq,
    'user_balance' => $totalBalance,
    'future_balance_usdt' => $futureBalance,
    'spot_balance_usdt' => $spotBalance,
    'transferable_spot_usdt' => $transferableSpot,
    'referral_bonus_usdt' => $referralBonus,
    'user_deposited' => $totalDeposited,
    'today_signals_count' => $liveDailyCount,
    'daily_limit' => 2,
    'additional_signals' => $additionalStatus,
    'user_executions' => $userExecutions,
    'signal_profit_total' => round($userSignalProfitTotal, 2),
    'runtime_mode' => 'LIVE',
    'schedule' => [
        'timezone' => 'Asia/Karachi',
        'label' => 'PKT',
        'times' => ['06:00 PM', '08:00 PM', '09:30 PM'],
        'daily_times' => ['06:00 PM', '08:00 PM'],
        'additional_time' => '09:30 PM',
        'duration_minutes' => !empty($liveSignals[0]['duration_minutes']) ? (int)$liveSignals[0]['duration_minutes'] : 15,
        'active_slot' => $activeSlot,
        'date' => $today
    ]
], 'Active quantitative trading signals loaded');
