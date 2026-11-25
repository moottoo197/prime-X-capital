<?php
/**
 * User Trading Signals & Scheduling - Direct Supabase REST
 * Two daily sessions: 04:00 PM and 08:00 PM Pakistan Time (PKT), broadcast globally.
 * Each session is valid for exactly 15 minutes.
 */
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/lib/signal_lifecycle.php';
require_once __DIR__ . '/lib/wallet_breakdown.php';
require_once __DIR__ . '/lib/signal_broadcast.php';

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

// Keep signal status/deletion current even if the Supabase scheduler is temporarily unavailable.
// The database job remains the primary automatic cleanup mechanism.
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

$minReq = 20.0;
// Future balance is used for Trade & Signals. Referral bonus cannot be transferred to Future.
$eligibleCapital = round(max($totalDeposited, $depositBalance + $depositBonus), 2);
$isAdminOrVip = $user && in_array(strtoupper($user['role'] ?? ''), ['ADMIN', 'SUPER_ADMIN', 'VIP', 'FINANCE_MANAGER', 'KYC_MANAGER'], true);
$isEligible = ($futureBalance >= $minReq && $eligibleCapital >= $minReq) || $isAdminOrVip;
$requiresFutureTransfer = (!$isAdminOrVip && $futureBalance < $minReq && $transferableSpot >= $minReq);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('METHOD_NOT_ALLOWED', 'GET method required', 405);
}

// Daily signals use one canonical global broadcast timezone: Pakistan Time (PKT).
// User profile timezones remain unchanged for profile/localization purposes, but they
// must never shift the shared 4 PM / 8 PM signal windows.
$timezoneName = 'Asia/Karachi';
$tz = new DateTimeZone('Asia/Karachi');
$now = new DateTime('now', $tz);
$nowTs = $now->getTimestamp();
$today = $now->format('Y-m-d');
$minute = ((int)$now->format('H') * 60) + (int)$now->format('i');
$activeSlot = null;
if ($minute >= 16 * 60) $activeSlot = 1;
if ($minute >= 20 * 60) $activeSlot = 2;

$sigRes = $supabase->select('trading_signals', [
    'select' => 'id,symbol,direction,entry_price_min,entry_price_max,target_price_1,target_price_2,stop_loss,status,duration_minutes,daily_slot,profit_percentage,timezone_label,scheduled_at,published_at,expires_at,created_at',
    'order' => 'created_at.desc',
    'limit' => '500'
]);
$allSignals = ($sigRes['success'] && is_array($sigRes['data'])) ? $sigRes['data'] : [];
foreach ($allSignals as &$dailyDisplaySignal) {
    if (in_array((int)($dailyDisplaySignal['daily_slot'] ?? 0), [1, 2], true)
        && strpos((string)($dailyDisplaySignal['id'] ?? ''), 'sig_test_') !== 0) {
        $dailyDisplaySignal['profit_percentage'] = 1.67;
    }
}
unset($dailyDisplaySignal);

// Ensure exactly the two canonical daily sessions for the current day.
// The next day's pair is created only after BOTH of today's 4 PM / 8 PM sessions
// have finished. This prevents four daily records (today + tomorrow) from being
// shown at once while still allowing the next day's pair to be queued automatically.
$templatesBySlot = [1 => null, 2 => null];
foreach ($allSignals as $existingSignal) {
    // Testing signals are intentionally isolated from the normal daily scheduler.
    $existingId = trim((string)($existingSignal['id'] ?? ''));
    if (strpos($existingId, 'sig_test_') === 0) continue;
    $slot = (int)($existingSignal['daily_slot'] ?? 0);
    if (in_array($slot, [1, 2], true) && $templatesBySlot[$slot] === null) {
        $templatesBySlot[$slot] = $existingSignal;
    }
}

$tomorrowDate = (clone $now)->modify('+1 day')->format('Y-m-d');
$todaySlot1End = (clone $now);
$todaySlot1End->setTime(16, 0, 0);
$todaySlot2End = (clone $now);
$todaySlot2End->setTime(20, 0, 0);
// Use the saved/current duration for the 8 PM pair when determining when the
// complete daily cycle has finished. Fall back to the historical 15-minute default.
$slot2TemplateDuration = $templatesBySlot[2] ? max(1, (int)($templatesBySlot[2]['duration_minutes'] ?? 15)) : 15;
$todaySlot1End->modify('+15 minutes');
$todaySlot2End->modify('+' . $slot2TemplateDuration . ' minutes');
$dailyCycleFinished = $nowTs >= $todaySlot2End->getTimestamp();
$ensureDate = $dailyCycleFinished ? $tomorrowDate : $today;

for ($ensureSlot = 1; $ensureSlot <= 2; $ensureSlot++) {
        $slotHour = $ensureSlot === 2 ? 20 : 16;
        $sessionStart = new DateTime($ensureDate . sprintf(' %02d:00:00', $slotHour), $tz);
        $foundForDay = false;
        $foundIndex = null;
        $canonicalId = 'sig_daily_' . $sessionStart->format('Ymd') . '_' . $ensureSlot;

        // Prefer the canonical daily ID. Older builds could leave an expired daily
        // record behind; that must never prevent the current 4 PM/8 PM session from
        // being rebuilt and shown.
        foreach ($allSignals as $idx => $existingSignal) {
            $existingId = (string)($existingSignal['id'] ?? '');
            if ($existingId === $canonicalId) {
                $foundForDay = true;
                $foundIndex = $idx;
                break;
            }
        }

        // Compatibility with records created before the canonical daily IDs existed.
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

        $template = $templatesBySlot[$ensureSlot];
        if ($template === null) $template = $templatesBySlot[$ensureSlot === 1 ? 2 : 1];
        if ($template === null) {
            // A fresh installation may have no previous daily signal at all. Use a
            // deterministic, valid default so the daily broadcast is never absent.
            $template = [
                'symbol' => 'BTC/USDT',
                'direction' => 'BUY',
                'entry_price_min' => 0,
                'entry_price_max' => 0,
                'target_price_1' => 0,
                'target_price_2' => 0,
                'stop_loss' => 0,
                'profit_percentage' => 1.67,
                'duration_minutes' => 15,
            ];
        }

        $templateDuration = max(1, (int)($template['duration_minutes'] ?? 15));
        $sessionEnd = (clone $sessionStart)->modify('+' . $templateDuration . ' minutes');
        $isLiveNow = ($ensureDate === $today && $nowTs >= $sessionStart->getTimestamp() && $nowTs < $sessionEnd->getTimestamp());

        // Never recreate a daily signal after its own session has completely ended.
        // Once the full 8 PM session has ended, the loop switches to tomorrow above.
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
                // Both normal daily sessions are fixed at 1.67% per confirmation (2x deposit in 30 days).
                'profit_percentage' => 1.67,
                'timezone_label' => 'GLOBAL — ALL COUNTRIES (PKT)',
                'scheduled_at' => $utcStart->format('Y-m-d H:i:sP'),
                'published_at' => $utcStart->format('Y-m-d H:i:sP'),
                'expires_at' => $utcEnd->format('Y-m-d H:i:sP'),
                'created_at' => gmdate('Y-m-d H:i:s')
            ];
            $createDaily = $supabase->insert('trading_signals', [$payload]);
            if ($createDaily['success']) $allSignals[] = $payload;
        } else {
            // If the current daily record is stale/expired, rebuild its live window
            // from the canonical PKT start. This only applies to the two daily slots.
            $existing = $allSignals[$foundIndex] ?? null;
            if ($existing && $ensureDate === $today) {
                $existingStatus = strtoupper((string)($existing['status'] ?? ''));
                $storedExpires = (string)($existing['expires_at'] ?? '');
                $storedExpired = false;
                if ($storedExpires !== '') {
                    try { $storedExpired = (new DateTime($storedExpires, new DateTimeZone('UTC')))->getTimestamp() <= $nowTs; } catch (Throwable $e) {}
                }
                $withinOrBeforeSession = $nowTs < $sessionEnd->getTimestamp();
                if ($withinOrBeforeSession && ($existingStatus === 'EXPIRED' || $storedExpired || $existingStatus === 'CANCELLED')) {
                    $utcStart = (clone $sessionStart)->setTimezone(new DateTimeZone('UTC'));
                    $utcEnd = (clone $sessionEnd)->setTimezone(new DateTimeZone('UTC'));
                    $repair = [
                        'status' => $isLiveNow ? 'PUBLISHED' : 'SCHEDULED',
                        'duration_minutes' => $templateDuration,
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
if ($userId) {
    // Execution and legacy ledger checks are independent; fetch them together.
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
                $userExecutions[] = $ex;
            }
        }
    }
    // Compatibility marker for executions created before the FK migration.
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
                    $userExecutions[] = $marker;
                }
            }
        }
    }
}

$tzLabel = $now->format('T');
if ($tzLabel === 'GMT') $tzLabel = 'UTC';
$liveSignals = [];
foreach ($allSignals as $s) {
    $sigId = trim((string)($s['id'] ?? ''));
    if ($sigId === '') continue;
    $isTesting = strpos($sigId, 'sig_test_') === 0
        || filter_var($s['is_testing'] ?? false, FILTER_VALIDATE_BOOLEAN)
        || filter_var($s['no_profit'] ?? false, FILTER_VALIDATE_BOOLEAN);
    // Normal signals stay single-use exactly as before. Test signals are never
    // considered executed/profit-bearing, even if a legacy record exists.
    if (!$isTesting && isset($executedMap[$sigId])) continue;
    $status = strtoupper((string)($s['status'] ?? 'PUBLISHED'));
    if (!in_array($status, ['PUBLISHED', 'ACTIVE', 'SCHEDULED'], true)) continue;
    $slot = (int)($s['daily_slot'] ?? 0);
    if (in_array($slot, [1,2], true) && !$isTesting) {
        // Daily signals use the canonical PKT schedule, but their actual expiry is
        // taken from the saved signal record so an admin-edited duration is honored.
        $hour = $slot === 2 ? 20 : 16;
        $sessionStart = new DateTime($today . sprintf(' %02d:00:00', $hour), $tz);
        // Only the canonical PKT daily record can be shown. This prevents legacy
        // user-timezone copies from appearing at different local times.
        $storedStart = (string)($s['scheduled_at'] ?? $s['published_at'] ?? '');
        if ($storedStart !== '') {
            try {
                $storedStartDt = new DateTime($storedStart, new DateTimeZone('UTC'));
                if ($storedStartDt->getTimestamp() !== $sessionStart->getTimestamp()) continue;
                $published = $storedStartDt;
            } catch (Throwable $e) {
                continue;
            }
        } elseif (strpos($sigId, 'sig_daily_' . $today . '_') !== 0) {
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
        $label = 'Daily Signal #' . $slot;
        $schedule = $slot === 2 ? '08:00 PM ' . $tzLabel : '04:00 PM ' . $tzLabel;
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
    $liveSignals[] = array_merge($s, [
        'status' => 'PUBLISHED', 'is_live' => true, 'is_expired' => false,
        'is_scheduled' => false, 'is_executed' => false, 'user_executed' => false,
        'has_used' => false, 'can_execute' => ($isEligible && !$isTesting), 'visible_to_user' => true, 'is_testing' => $isTesting, 'no_profit' => $isTesting, 'profit_percentage' => $isTesting ? 0 : (float)($s['profit_percentage'] ?? 1.67), 'time_left_seconds' => $timeLeft,
        'time_until_start_seconds' => 0,
        'published_at' => $published->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d H:i:s'),
        'expires_at' => $expires->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d H:i:s'),
        'schedule_time' => $schedule, 'slot_label' => $label, 'timezone_label' => 'PKT'
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
    'today_signals_count' => count($liveSignals),
    'daily_limit' => 2,
    'user_executions' => $userExecutions,
    'signal_profit_total' => round($userSignalProfitTotal, 2),
    'runtime_mode' => 'LIVE',
    'schedule' => [
        'timezone' => 'Asia/Karachi',
        'label' => 'PKT',
        'times' => ['04:00 PM', '08:00 PM'],
        'duration_minutes' => !empty($liveSignals[0]['duration_minutes']) ? (int)$liveSignals[0]['duration_minutes'] : 15,
        'active_slot' => $activeSlot,
        'date' => $today
    ]
], 'Active quantitative trading signals loaded');
