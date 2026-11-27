<?php
/**
 * User Notifications - Event Driven & Real-time Synchronization
 */
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/lib/notification_reads.php';

$user = getCurrentUser();
if (!$user) {
    sendSuccess([
        'notifications' => [],
        'unread_count'  => 0
    ], 'Guest notifications');
}

$userId = (string)$user['id'];
$isAdminPreview = !empty($user['_admin_preview']);
$supabase = getSupabaseClient();
$notifications = [];

if ($supabase->isConfigured()) {
    // All notification sources are independent. Fetch them concurrently so the
    // dashboard is not delayed by four sequential Supabase round-trips.
    $batch = $supabase->selectMany([
        'deposits' => [
            'table' => 'deposits',
            'params' => ['user_id' => "eq.{$userId}", 'order' => 'created_at.desc', 'limit' => '20']
        ],
        'withdrawals' => [
            'table' => 'withdrawals',
            'params' => ['user_id' => "eq.{$userId}", 'order' => 'created_at.desc', 'limit' => '20']
        ],
        'kyc' => [
            'table' => 'kyc_submissions',
            'params' => ['user_id' => "eq.{$userId}", 'select' => 'id,user_id,status,reviewer_notes,reviewed_at,updated_at,created_at', 'order' => 'created_at.desc', 'limit' => '5']
        ],
        'signals' => [
            'table' => 'user_signal_executions',
            'params' => ['user_id' => "eq.{$userId}", 'order' => 'executed_at.desc', 'limit' => '10']
        ],
        'live_signals' => [
            'table' => 'trading_signals',
            'params' => ['status' => 'in.(PUBLISHED,ACTIVE,SCHEDULED)', 'select' => 'id,symbol,direction,profit_percentage,duration_minutes,daily_slot,status,published_at,scheduled_at,expires_at,created_at', 'order' => 'published_at.desc', 'limit' => '15']
        ],
        'stored_notifications' => [
            'table' => 'user_notifications',
            'params' => ['user_id' => "eq.{$userId}", 'select' => 'id,user_id,type,title,message,is_read,created_at', 'order' => 'created_at.desc', 'limit' => '25']
        ]
    ]);

    // -1. Stored user notifications (e.g. Additional Signal deposit/referral unlocks)
    // Strictly exclude internal READ_CURSOR metadata rows so JSON cursors never appear in UI.
    $storedRes = $batch['stored_notifications'] ?? ['success' => false];
    if (!empty($storedRes['success']) && is_array($storedRes['data'] ?? null)) {
        foreach ($storedRes['data'] as $sn) {
            if (!is_array($sn) || primex_is_internal_read_cursor_row($sn)) {
                continue;
            }
            $notifications[] = [
                'id' => 'notif_db_' . ($sn['id'] ?? bin2hex(random_bytes(4))),
                'user_id' => $userId,
                'type' => (string)($sn['type'] ?? 'SIGNAL_AVAILABLE'),
                'title' => (string)($sn['title'] ?? 'Prime X Capital Alert'),
                'message' => (string)($sn['message'] ?? ''),
                'is_read' => !empty($sn['is_read']) ? 1 : 0,
                'created_at' => (string)($sn['created_at'] ?? gmdate('Y-m-d H:i:s'))
            ];
        }
    }

    // 0. Live trading signal broadcasts (shown on all user dashboards while active)
    $liveSigRes = $batch['live_signals'] ?? ['success' => false];
    if ($liveSigRes['success'] && is_array($liveSigRes['data'])) {
        require_once __DIR__ . '/lib/signal_broadcast.php';
        $liveRows = $liveSigRes['data'];
        primex_promote_due_signals($supabase, $liveRows);
        primex_schedule_signal_live_broadcast($supabase, $liveRows);
        $nowUtcTs = time();
        foreach ($liveRows as $ls) {
            $lsId = trim((string)($ls['id'] ?? ''));
            if ($lsId === '' || strpos($lsId, 'sig_test_') === 0) continue;
            $lsStatus = strtoupper(trim((string)($ls['status'] ?? '')));
            if (!in_array($lsStatus, ['PUBLISHED', 'ACTIVE'], true)) continue;
            $pubRaw = (string)($ls['published_at'] ?? $ls['scheduled_at'] ?? $ls['created_at'] ?? '');
            $expRaw = (string)($ls['expires_at'] ?? '');
            $pubTs = $pubRaw !== '' ? strtotime($pubRaw) : false;
            $expTs = $expRaw !== '' ? strtotime($expRaw) : false;
            if ($pubTs !== false && $nowUtcTs < $pubTs) continue;
            if ($expTs !== false && $nowUtcTs >= $expTs) continue;

            $lsSym = strtoupper(trim((string)($ls['symbol'] ?? 'BTC/USDT')));
            $lsDirRaw = strtoupper(trim((string)($ls['direction'] ?? 'BUY')));
            $lsIsBuy = in_array($lsDirRaw, ['BUY', 'LONG', 'UP'], true);
            $lsDirLabel = $lsIsBuy ? 'UP / BUY (LONG)' : 'DOWN / SELL (SHORT)';
            $lsSlot = (int)($ls['daily_slot'] ?? 0);
            $lsIsAdditional = ($lsSlot === 3 || strpos($lsId, 'sig_add_') === 0);
            $lsPct = in_array($lsSlot, [1, 2], true) ? 1.67 : (float)($ls['profit_percentage'] ?? 1.67);
            $lsRewardTxt = $lsIsAdditional ? 'Additional Signal reward' : "+{$lsPct}% target";
            $lsDur = max(1, (int)($ls['duration_minutes'] ?? 15));
            $lsTime = $pubRaw !== '' ? $pubRaw : gmdate('Y-m-d H:i:s');

            $notifications[] = [
                'id' => 'notif_live_sig_' . $lsId,
                'user_id' => $userId,
                'type' => 'SIGNAL_AVAILABLE',
                'title' => ($lsIsAdditional ? "🎁 Additional Signal Live: " : "⚡ Live Signal: ") . "{$lsSym} ({$lsDirLabel})",
                'message' => "{$lsSym} {$lsDirLabel} signal is LIVE now ({$lsRewardTxt}, {$lsDur}m window). Open Signals Terminal to confirm.",
                'is_read' => 0,
                'created_at' => $lsTime
            ];
        }
    }

    // 1. Deposits events
    $depRes = $batch['deposits'] ?? ['success'=>false];
    if ($depRes['success'] && is_array($depRes['data'])) {
        foreach ($depRes['data'] as $d) {
            $status = strtoupper((string)($d['status'] ?? 'PENDING'));
            $amt = (float)($d['amount'] ?? 0);
            $asset = $d['asset'] ?? 'USDT';
            $net = $d['network'] ?? 'TRC20';
            $time = $d['updated_at'] ?? $d['created_at'] ?? gmdate('Y-m-d H:i:s');

            if (in_array($status, ['COMPLETED', 'APPROVED', 'CONFIRMED'], true)) {
                $notifications[] = [
                    'id' => 'notif_dep_' . ($d['id'] ?? bin2hex(random_bytes(4))),
                    'user_id' => $userId,
                    'type' => 'DEPOSIT_APPROVED',
                    'title' => 'Deposit Credited & Confirmed',
                    'message' => "Your deposit of {$amt} {$asset} ({$net}) has been verified and credited to your Funding Wallet.",
                    'is_read' => 0,
                    'created_at' => $time
                ];
            } elseif ($status === 'REJECTED') {
                $reason = !empty($d['rejection_reason']) ? " Reason: {$d['rejection_reason']}" : "";
                $notifications[] = [
                    'id' => 'notif_dep_rej_' . ($d['id'] ?? bin2hex(random_bytes(4))),
                    'user_id' => $userId,
                    'type' => 'DEPOSIT_REJECTED',
                    'title' => 'Deposit Request Declined',
                    'message' => "Your deposit of {$amt} {$asset} ({$net}) was not approved.{$reason}",
                    'is_read' => 0,
                    'created_at' => $time
                ];
            }
        }
    }

    // 2. Withdrawals events
    $withRes = $batch['withdrawals'] ?? ['success'=>false];
    if ($withRes['success'] && is_array($withRes['data'])) {
        foreach ($withRes['data'] as $w) {
            $status = strtoupper((string)($w['status'] ?? 'REQUESTED'));
            $amt = (float)($w['amount'] ?? 0);
            $asset = $w['asset'] ?? 'USDT';
            $net = $w['network'] ?? 'TRC20';
            $txHash = $w['tx_hash'] ?? '';
            $time = $w['updated_at'] ?? $w['created_at'] ?? gmdate('Y-m-d H:i:s');

            if (in_array($status, ['COMPLETED', 'APPROVED', 'CONFIRMED'], true)) {
                $txMsg = !empty($txHash) ? " Transaction Hash: {$txHash}" : "";
                $notifications[] = [
                    'id' => 'notif_with_' . ($w['id'] ?? bin2hex(random_bytes(4))),
                    'user_id' => $userId,
                    'type' => 'WITHDRAWAL_COMPLETED',
                    'title' => 'Withdrawal Confirmed & Broadcast',
                    'message' => "Your withdrawal of {$amt} {$asset} ({$net}) has been approved and broadcast to the blockchain.{$txMsg}",
                    'is_read' => 0,
                    'created_at' => $time
                ];
            } elseif ($status === 'REJECTED') {
                $reason = !empty($w['rejection_reason']) ? " Reason: {$w['rejection_reason']}" : "";
                $notifications[] = [
                    'id' => 'notif_with_rej_' . ($w['id'] ?? bin2hex(random_bytes(4))),
                    'user_id' => $userId,
                    'type' => 'WITHDRAWAL_REJECTED',
                    'title' => 'Withdrawal Request Refunded',
                    'message' => "Your withdrawal of {$amt} {$asset} was declined and fully refunded to your Funding Wallet.{$reason}",
                    'is_read' => 0,
                    'created_at' => $time
                ];
            }
        }
    }

    // 3. KYC Submissions events
    $kycRes = $batch['kyc'] ?? ['success'=>false];
    if ($kycRes['success'] && is_array($kycRes['data'])) {
        foreach ($kycRes['data'] as $k) {
            $status = strtoupper((string)($k['status'] ?? 'PENDING'));
            $time = $k['reviewed_at'] ?? $k['updated_at'] ?? $k['created_at'] ?? gmdate('Y-m-d H:i:s');

            if ($status === 'APPROVED') {
                $notifications[] = [
                    'id' => 'notif_kyc_' . ($k['id'] ?? bin2hex(random_bytes(4))),
                    'user_id' => $userId,
                    'type' => 'KYC_APPROVED',
                    'title' => 'Identity Verification Approved',
                    'message' => 'Your Real-Name identity documents have been approved by compliance. High withdrawal limits and institutional privileges are active.',
                    'is_read' => 0,
                    'created_at' => $time
                ];
            } elseif ($status === 'RESUBMIT_REQUIRED') {
                $reason = !empty($k['reviewer_notes']) ? " Note: {$k['reviewer_notes']}" : (!empty($k['rejection_reason']) ? " Note: {$k['rejection_reason']}" : '');
                $notifications[] = [
                    'id' => 'notif_kyc_resubmit_' . ($k['id'] ?? bin2hex(random_bytes(4))) . '_' . substr(md5($time), 0, 6),
                    'user_id' => $userId,
                    'type' => 'KYC_RESUBMIT_REQUIRED',
                    'title' => 'KYC Document Resubmission Requested',
                    'message' => "Compliance requested updated identity verification documents.{$reason} Please open KYC Verification to resubmit.",
                    'is_read' => 0,
                    'created_at' => $time
                ];
            } elseif ($status === 'REJECTED') {
                $reason = !empty($k['reviewer_notes']) ? " Note: {$k['reviewer_notes']}" : "";
                $notifications[] = [
                    'id' => 'notif_kyc_rej_' . ($k['id'] ?? bin2hex(random_bytes(4))),
                    'user_id' => $userId,
                    'type' => 'KYC_REJECTED',
                    'title' => 'Identity Verification Declined',
                    'message' => "Your submitted identity documents were declined.{$reason} Please re-submit clear documents.",
                    'is_read' => 0,
                    'created_at' => $time
                ];
            }
        }
    }

    // 4. Signal executions profit events
    $sigRes = $batch['signals'] ?? ['success'=>false];
    if ($sigRes['success'] && is_array($sigRes['data'])) {
        foreach ($sigRes['data'] as $s) {
            $signalId = (string)($s['signal_id'] ?? '');
            if (strpos($signalId, 'sig_test_') === 0) continue;
            $profit = (float)($s['profit_amount'] ?? 0);
            $sym = $s['symbol'] ?? 'USDT';
            $pct = (float)($s['profit_percentage'] ?? 0);
            $isAddExec = (strpos($signalId, 'sig_add_') === 0 || ($pct <= 0 && abs($profit - 4.0) < 0.01));
            $time = $s['executed_at'] ?? $s['created_at'] ?? gmdate('Y-m-d H:i:s');

            $notifications[] = [
                'id' => 'notif_sig_' . ($s['id'] ?? bin2hex(random_bytes(4))),
                'user_id' => $userId,
                'type' => 'SIGNAL_SETTLED',
                'title' => $isAddExec ? "🎁 Additional Signal Completed" : "⚡ High-Yield Signal Profit: +{$profit} USDT",
                'message' => $isAddExec
                    ? "Your Additional Signal for {$sym} settled and bonus reward has been credited (separate from 30-day 2x plan)."
                    : "Your quantitative trading signal for {$sym} settled with +{$pct}% return. Profit has been credited to your Trading Wallet.",
                'is_read' => 0,
                'created_at' => $time
            ];
        }
    }
}

// Sort newest first
usort($notifications, function($a, $b) {
    return strcmp($b['created_at'] ?? '', $a['created_at'] ?? '');
});

// Load persistent per-user read state (Supabase + server file + cookies)
$readState = primex_load_notification_read_state($supabase, $userId, !$isAdminPreview);
$readIds = $readState['ids'] ?? [];
$readBeforeTs = (int)($readState['before_ts'] ?? 0);

$unreadCount = 0;
foreach ($notifications as &$n) {
    $createdTs = !empty($n['created_at']) ? primex_notif_parse_utc_ts((string)$n['created_at']) : 0;
    $isMarkedById = in_array($n['id'], $readIds, true);
    $isMarkedByTime = ($readBeforeTs > 0 && $createdTs > 0 && $createdTs <= $readBeforeTs);
    if ($isMarkedById || $isMarkedByTime) {
        $n['is_read'] = 1;
    } else {
        $unreadCount++;
    }
}
unset($n);

sendSuccess([
    'notifications' => array_slice($notifications, 0, 30),
    'unread_count'  => $unreadCount,
    'read_before_ts' => $readBeforeTs,
    'read_ids' => $readIds
], 'Notifications loaded');
