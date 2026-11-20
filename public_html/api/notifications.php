<?php
/**
 * User Notifications - Event Driven & Real-time Synchronization
 */
require_once __DIR__ . '/bootstrap.php';

$user = getCurrentUser();
if (!$user) {
    sendSuccess([
        'notifications' => [],
        'unread_count'  => 0
    ], 'Guest notifications');
}

$userId = $user['id'];
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
            'params' => ['user_id' => "eq.{$userId}", 'order' => 'created_at.desc', 'limit' => '5']
        ],
        'signals' => [
            'table' => 'user_signal_executions',
            'params' => ['user_id' => "eq.{$userId}", 'order' => 'executed_at.desc', 'limit' => '10']
        ]
    ]);

    // 1. Deposits events
    $depRes = $batch['deposits'] ?? ['success'=>false];
    if ($depRes['success'] && is_array($depRes['data'])) {
        foreach ($depRes['data'] as $d) {
            $status = $d['status'] ?? 'PENDING';
            $amt = (float)($d['amount'] ?? 0);
            $asset = $d['asset'] ?? 'USDT';
            $net = $d['network'] ?? 'TRC20';
            $time = $d['updated_at'] ?? $d['created_at'] ?? gmdate('Y-m-d H:i:s');

            if ($status === 'COMPLETED') {
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
            $status = $w['status'] ?? 'REQUESTED';
            $amt = (float)($w['amount'] ?? 0);
            $asset = $w['asset'] ?? 'USDT';
            $net = $w['network'] ?? 'TRC20';
            $txHash = $w['tx_hash'] ?? '';
            $time = $w['updated_at'] ?? $w['created_at'] ?? gmdate('Y-m-d H:i:s');

            if ($status === 'COMPLETED') {
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
            $status = $k['status'] ?? 'PENDING';
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
            $profit = (float)($s['profit_amount'] ?? 0);
            $sym = $s['symbol'] ?? 'USDT';
            $pct = $s['profit_percentage'] ?? '2.5';
            $time = $s['executed_at'] ?? $s['created_at'] ?? gmdate('Y-m-d H:i:s');

            $notifications[] = [
                'id' => 'notif_sig_' . ($s['id'] ?? bin2hex(random_bytes(4))),
                'user_id' => $userId,
                'type' => 'SIGNAL_SETTLED',
                'title' => "⚡ High-Yield Signal Profit: +{$profit} USDT",
                'message' => "Your quantitative trading signal for {$sym} settled with +{$pct}% return. Profit has been credited to your Trading Wallet.",
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

// Check read status from cookie / cutoff timestamp
$readIds = [];
if (!empty($_COOKIE['read_notifications'])) {
    $readIds = array_values(array_filter(explode(',', (string)$_COOKIE['read_notifications'])));
}
$readBeforeTs = !empty($_COOKIE['read_notifications_before']) ? (int)$_COOKIE['read_notifications_before'] : 0;

$unreadCount = 0;
foreach ($notifications as &$n) {
    $createdTs = !empty($n['created_at']) ? (int)strtotime((string)$n['created_at']) : 0;
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
    'unread_count'  => $unreadCount
], 'Notifications loaded');
