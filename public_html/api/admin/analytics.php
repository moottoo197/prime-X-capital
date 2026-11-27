<?php
/**
 * Admin Real-Time Analytics & User Presence Tracking API
 * Computes 100% authentic metrics from Supabase tables + live presence telemetry.
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/presence.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('METHOD_NOT_ALLOWED', 'GET method required', 405);
}

$admin = requireAdmin();
$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

$batch = $supabase->selectMany([
    'profiles' => [
        'table' => 'profiles',
        'params' => [
            'select' => 'id,numeric_uid,email,first_name,last_name,role,country,kyc_status,is_active,created_at,updated_at',
            'order' => 'created_at.desc'
        ],
        'headers' => ['Range: 0-9999', 'Prefer: count=exact']
    ],
    'deposits' => [
        'table' => 'deposits',
        'params' => [
            'select' => 'id,user_id,amount,status,network,asset,created_at',
            'order' => 'created_at.desc'
        ],
        'headers' => ['Range: 0-9999', 'Prefer: count=exact']
    ],
    'withdrawals' => [
        'table' => 'withdrawals',
        'params' => [
            'select' => 'id,user_id,amount,status,network,asset,created_at',
            'order' => 'created_at.desc'
        ],
        'headers' => ['Range: 0-9999', 'Prefer: count=exact']
    ],
    'executions' => [
        'table' => 'user_signal_executions',
        'params' => [
            'select' => 'id,user_id,signal_id,symbol,profit_amount,executed_at,created_at',
            'order' => 'executed_at.desc'
        ],
        'headers' => ['Range: 0-9999', 'Prefer: count=exact']
    ],
    'ledger' => [
        'table' => 'ledger_entries',
        'params' => [
            'select' => 'user_id,entry_type,amount,description,created_at',
            'entry_type' => 'in.(ADJUSTMENT,TRADE_PNL,REFERRAL_COMMISSION)',
            'order' => 'created_at.desc'
        ],
        'headers' => ['Range: 0-9999', 'Prefer: count=exact']
    ],
    'tickets' => [
        'table' => 'support_tickets',
        'params' => [
            'select' => 'id,user_id,status,created_at',
            'order' => 'created_at.desc'
        ],
        'headers' => ['Range: 0-4999', 'Prefer: count=exact']
    ],
    'presence_settings' => [
        'table' => 'system_settings',
        'params' => [
            'setting_key' => 'like.user_presence:*',
            'select' => 'setting_key,setting_value,updated_at'
        ],
        'headers' => ['Range: 0-9999', 'Prefer: count=exact']
    ]
]);

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

$profiles = $extractAll('profiles', 'profiles', [
    'select' => 'id,numeric_uid,email,first_name,last_name,role,country,kyc_status,is_active,created_at,updated_at',
    'order' => 'created_at.desc'
]);
$deposits = $extractAll('deposits', 'deposits', [
    'select' => 'id,user_id,amount,status,network,asset,created_at',
    'order' => 'created_at.desc'
]);
$withdrawals = $extractAll('withdrawals', 'withdrawals', [
    'select' => 'id,user_id,amount,status,network,asset,created_at',
    'order' => 'created_at.desc'
]);
$executions = $extractAll('executions', 'user_signal_executions', [
    'select' => 'id,user_id,signal_id,symbol,profit_amount,executed_at,created_at',
    'order' => 'executed_at.desc'
]);
$ledger = $extractAll('ledger', 'ledger_entries', [
    'select' => 'user_id,entry_type,amount,description,created_at',
    'entry_type' => 'in.(ADJUSTMENT,TRADE_PNL,REFERRAL_COMMISSION)',
    'order' => 'created_at.desc'
]);
$tickets = $extractAll('tickets', 'support_tickets', [
    'select' => 'id,user_id,status,created_at',
    'order' => 'created_at.desc'
]);
$presenceSettings = $extractAll('presence_settings', 'system_settings', [
    'setting_key' => 'like.user_presence:*',
    'select' => 'setting_key,setting_value,updated_at'
]);

$presenceMap = primex_read_all_presence($supabase, $presenceSettings);

$nowTs = time();
$pktTz = new DateTimeZone('Asia/Karachi');
$pktNow = new DateTime('now', $pktTz);
$todayPkt = $pktNow->format('Y-m-d');

$parseDayPkt = static function (?string $raw) use ($pktTz): string {
    if (!$raw) return '';
    try {
        $dt = new DateTime($raw);
        $dt->setTimezone($pktTz);
        return $dt->format('Y-m-d');
    } catch (Throwable $e) {
        return substr((string)$raw, 0, 10);
    }
};

// Build 7-day real daily series in PKT
$dailySeries = [];
$seriesIdxByDate = [];
for ($offset = 6; $offset >= 0; $offset--) {
    $d = (clone $pktNow)->modify("-{$offset} days");
    $dateKey = $d->format('Y-m-d');
    $seriesIdxByDate[$dateKey] = count($dailySeries);
    $dailySeries[] = [
        'date' => $dateKey,
        'label' => $offset === 0 ? 'Today' : $d->format('D'),
        'signups' => 0,
        'deposits_usdt' => 0.0,
        'deposit_count' => 0,
        'withdrawals_usdt' => 0.0,
        'signal_executions' => 0
    ];
}

// Per-user financial & operational rollups (authentic records only)
$userStats = [];
$ensureStats = static function (string $uid) use (&$userStats): void {
    if (!isset($userStats[$uid])) {
        $userStats[$uid] = [
            'deposits_total_usdt' => 0.0,
            'deposits_count' => 0,
            'withdrawals_total_usdt' => 0.0,
            'withdrawals_count' => 0,
            'signal_executions_count' => 0,
            'signal_profit_usdt' => 0.0,
            'referral_commission_usdt' => 0.0,
            'tickets_count' => 0,
            'last_activity_at' => ''
        ];
    }
};
$trackLastActivity = static function (string $uid, ?string $ts) use (&$userStats): void {
    if (!$ts) return;
    $cur = (string)($userStats[$uid]['last_activity_at'] ?? '');
    if ($cur === '' || strtotime($ts) > strtotime($cur)) {
        $userStats[$uid]['last_activity_at'] = $ts;
    }
};

$depositsTodayUsdt = 0.0;
$totalDepositsUsdt = 0.0;
foreach ($deposits as $dep) {
    $uid = trim((string)($dep['user_id'] ?? ''));
    $status = strtoupper(trim((string)($dep['status'] ?? '')));
    $amt = max(0.0, (float)($dep['amount'] ?? 0));
    $createdAt = (string)($dep['created_at'] ?? '');
    if ($uid !== '') {
        $ensureStats($uid);
        $trackLastActivity($uid, $createdAt);
    }
    if (in_array($status, ['COMPLETED', 'APPROVED', 'CONFIRMED'], true)) {
        $totalDepositsUsdt += $amt;
        if ($uid !== '') {
            $userStats[$uid]['deposits_total_usdt'] += $amt;
            $userStats[$uid]['deposits_count']++;
        }
        $dayKey = $parseDayPkt($createdAt);
        if ($dayKey === $todayPkt) {
            $depositsTodayUsdt += $amt;
        }
        if (isset($seriesIdxByDate[$dayKey])) {
            $idx = $seriesIdxByDate[$dayKey];
            $dailySeries[$idx]['deposits_usdt'] += $amt;
            $dailySeries[$idx]['deposit_count']++;
        }
    }
}

$totalWithdrawalsUsdt = 0.0;
$withdrawalsTodayUsdt = 0.0;
foreach ($withdrawals as $wit) {
    $uid = trim((string)($wit['user_id'] ?? ''));
    $status = strtoupper(trim((string)($wit['status'] ?? '')));
    $amt = max(0.0, (float)($wit['amount'] ?? 0));
    $createdAt = (string)($wit['created_at'] ?? '');
    if ($uid !== '') {
        $ensureStats($uid);
        $trackLastActivity($uid, $createdAt);
    }
    if (in_array($status, ['COMPLETED', 'APPROVED'], true)) {
        $totalWithdrawalsUsdt += $amt;
        if ($uid !== '') {
            $userStats[$uid]['withdrawals_total_usdt'] += $amt;
            $userStats[$uid]['withdrawals_count']++;
        }
        $dayKey = $parseDayPkt($createdAt);
        if ($dayKey === $todayPkt) {
            $withdrawalsTodayUsdt += $amt;
        }
        if (isset($seriesIdxByDate[$dayKey])) {
            $idx = $seriesIdxByDate[$dayKey];
            $dailySeries[$idx]['withdrawals_usdt'] += $amt;
        }
    }
}

$totalExecutionsCount = 0;
$executionsTodayCount = 0;
$seenExecPerUserSig = [];
foreach ($executions as $ex) {
    $sigId = trim((string)($ex['signal_id'] ?? ''));
    if ($sigId !== '' && strpos($sigId, 'sig_test_') === 0) continue;
    $uid = trim((string)($ex['user_id'] ?? ''));
    $profit = max(0.0, (float)($ex['profit_amount'] ?? 0));
    $execAt = (string)($ex['executed_at'] ?? $ex['created_at'] ?? '');
    if ($uid !== '' && $sigId !== '') {
        $k = $uid . '|' . $sigId;
        if (isset($seenExecPerUserSig[$k])) continue;
        $seenExecPerUserSig[$k] = true;
    }
    $totalExecutionsCount++;
    if ($uid !== '') {
        $ensureStats($uid);
        $userStats[$uid]['signal_executions_count']++;
        $userStats[$uid]['signal_profit_usdt'] += $profit;
        $trackLastActivity($uid, $execAt);
    }
    $dayKey = $parseDayPkt($execAt);
    if ($dayKey === $todayPkt) {
        $executionsTodayCount++;
    }
    if (isset($seriesIdxByDate[$dayKey])) {
        $dailySeries[$seriesIdxByDate[$dayKey]]['signal_executions']++;
    }
}

foreach ($ledger as $entry) {
    $uid = trim((string)($entry['user_id'] ?? ''));
    if ($uid === '') continue;
    $ensureStats($uid);
    $eType = strtoupper(trim((string)($entry['entry_type'] ?? '')));
    $amt = (float)($entry['amount'] ?? 0);
    $desc = strtoupper(trim((string)($entry['description'] ?? '')));
    $createdAt = (string)($entry['created_at'] ?? '');
    $trackLastActivity($uid, $createdAt);

    if ($eType === 'ADJUSTMENT' && strpos($desc, '[DEPOSIT]') === 0 && $amt > 0) {
        $totalDepositsUsdt += $amt;
        $userStats[$uid]['deposits_total_usdt'] += $amt;
        $userStats[$uid]['deposits_count']++;
        $dayKey = $parseDayPkt($createdAt);
        if ($dayKey === $todayPkt) $depositsTodayUsdt += $amt;
        if (isset($seriesIdxByDate[$dayKey])) {
            $dailySeries[$seriesIdxByDate[$dayKey]]['deposits_usdt'] += $amt;
            $dailySeries[$seriesIdxByDate[$dayKey]]['deposit_count']++;
        }
    } elseif ($eType === 'REFERRAL_COMMISSION' || ($eType === 'ADJUSTMENT' && strpos($desc, '[REFERRAL_BONUS]') === 0)) {
        $userStats[$uid]['referral_commission_usdt'] += max(0.0, $amt);
    }
}

foreach ($tickets as $tk) {
    $uid = trim((string)($tk['user_id'] ?? ''));
    if ($uid === '') continue;
    $ensureStats($uid);
    $userStats[$uid]['tickets_count']++;
    $trackLastActivity($uid, (string)($tk['created_at'] ?? ''));
}

foreach ($dailySeries as &$dsRow) {
    $dsRow['deposits_usdt'] = round((float)$dsRow['deposits_usdt'], 2);
    $dsRow['withdrawals_usdt'] = round((float)$dsRow['withdrawals_usdt'], 2);
}
unset($dsRow);

// Presence, country, device & view breakdowns across ALL real registered users
$onlineCount = 0;
$idleCount = 0;
$offlineCount = 0;
$activeTodayCount = 0;
$newUsersTodayCount = 0;
$verifiedCount = 0;
$deviceCounts = ['Mobile' => 0, 'Desktop' => 0, 'Tablet' => 0];
$viewCounts = [];
$countryCounts = [];
$userRows = [];

foreach ($profiles as $p) {
    $uid = trim((string)($p['id'] ?? ''));
    if ($uid === '') continue;
    $ensureStats($uid);

    $email = (string)($p['email'] ?? $uid);
    $fullName = trim((string)($p['first_name'] ?? '') . ' ' . (string)($p['last_name'] ?? ''));
    if ($fullName === '' && strpos($email, '@') !== false) {
        $fullName = ucwords(str_replace(['.', '_', '-'], ' ', explode('@', $email)[0]));
    }

    $createdAt = (string)($p['created_at'] ?? '');
    $createdDay = $parseDayPkt($createdAt);
    if ($createdDay === $todayPkt) {
        $newUsersTodayCount++;
    }
    if (isset($seriesIdxByDate[$createdDay])) {
        $dailySeries[$seriesIdxByDate[$createdDay]]['signups']++;
    }

    $kycStatus = strtoupper(trim((string)($p['kyc_status'] ?? 'NOT_SUBMITTED')));
    if ($kycStatus === 'APPROVED') {
        $verifiedCount++;
    }

    $pres = $presenceMap[$uid] ?? null;
    $status = primex_classify_presence_status($pres, $nowTs);
    if ($status === 'ONLINE') $onlineCount++;
    elseif ($status === 'IDLE') $idleCount++;
    else $offlineCount++;

    $lastSeenTs = is_array($pres) ? (int)($pres['last_seen_ts'] ?? 0) : 0;
    $lastSeenAt = is_array($pres) ? (string)($pres['last_seen_at'] ?? '') : '';
    if ($lastSeenAt === '' && !empty($userStats[$uid]['last_activity_at'])) {
        $lastSeenAt = (string)$userStats[$uid]['last_activity_at'];
        $parsedAct = strtotime($lastSeenAt);
        if ($parsedAct !== false) $lastSeenTs = $parsedAct;
    }

    if ($lastSeenTs > 0 && $parseDayPkt(gmdate('Y-m-d H:i:s', $lastSeenTs)) === $todayPkt) {
        $activeTodayCount++;
    }

    $country = trim((string)($p['country'] ?? ($pres['country'] ?? '')));
    if ($country === '') $country = 'Unspecified';
    $countryCounts[$country] = ($countryCounts[$country] ?? 0) + 1;

    $device = is_array($pres) ? trim((string)($pres['device'] ?? '')) : '';
    $os = is_array($pres) ? trim((string)($pres['os'] ?? '')) : '';
    $browser = is_array($pres) ? trim((string)($pres['browser'] ?? '')) : '';
    $currentView = is_array($pres) ? trim((string)($pres['current_view'] ?? '')) : '';
    $ip = is_array($pres) ? trim((string)($pres['ip'] ?? '')) : '';
    $sessionStartedTs = is_array($pres) ? (int)($pres['session_started_ts'] ?? 0) : 0;

    if ($status === 'ONLINE' || $status === 'IDLE') {
        $devKey = isset($deviceCounts[$device]) ? $device : 'Desktop';
        $deviceCounts[$devKey]++;
        if ($currentView !== '') {
            $viewCounts[$currentView] = ($viewCounts[$currentView] ?? 0) + 1;
        }
    } elseif ($device !== '' && isset($deviceCounts[$device])) {
        $deviceCounts[$device]++;
    }

    $sessionDurationSec = ($status !== 'OFFLINE' && $sessionStartedTs > 0)
        ? max(0, $nowTs - $sessionStartedTs)
        : 0;

    $st = $userStats[$uid];
    $userRows[] = [
        'id' => $uid,
        'numeric_uid' => $p['numeric_uid'] ?? null,
        'email' => $email,
        'full_name' => $fullName ?: 'Member',
        'role' => strtoupper(trim((string)($p['role'] ?? 'USER'))),
        'kyc_status' => $kycStatus,
        'is_active' => array_key_exists('is_active', $p) && $p['is_active'] !== null
            ? (filter_var($p['is_active'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) !== false)
            : true,
        'country' => $country,
        'presence_status' => $status,
        'current_view' => $currentView,
        'device' => $device ?: 'Unknown',
        'os' => $os ?: 'Unknown',
        'browser' => $browser ?: 'Unknown',
        'ip' => $ip,
        'last_seen_ts' => $lastSeenTs,
        'last_seen_at' => $lastSeenAt,
        'session_duration_sec' => $sessionDurationSec,
        'deposits_total_usdt' => round((float)$st['deposits_total_usdt'], 2),
        'deposits_count' => (int)$st['deposits_count'],
        'withdrawals_total_usdt' => round((float)$st['withdrawals_total_usdt'], 2),
        'withdrawals_count' => (int)$st['withdrawals_count'],
        'signal_executions_count' => (int)$st['signal_executions_count'],
        'signal_profit_usdt' => round((float)$st['signal_profit_usdt'], 2),
        'referral_commission_usdt' => round((float)$st['referral_commission_usdt'], 2),
        'tickets_count' => (int)$st['tickets_count'],
        'joined_at' => $createdAt
    ];
}

// Sort users: ONLINE first, then IDLE, then OFFLINE, then freshest last_seen_ts, then newest signup
$statusWeight = ['ONLINE' => 0, 'IDLE' => 1, 'OFFLINE' => 2];
usort($userRows, static function (array $a, array $b) use ($statusWeight): int {
    $wa = $statusWeight[$a['presence_status']] ?? 2;
    $wb = $statusWeight[$b['presence_status']] ?? 2;
    if ($wa !== $wb) return $wa <=> $wb;
    $ta = (int)($a['last_seen_ts'] ?? 0);
    $tb = (int)($b['last_seen_ts'] ?? 0);
    if ($ta !== $tb) return $tb <=> $ta;
    return strcmp((string)($b['joined_at'] ?? ''), (string)($a['joined_at'] ?? ''));
});

arsort($countryCounts);
$countryBreakdown = [];
foreach (array_slice($countryCounts, 0, 8, true) as $cName => $cCount) {
    $countryBreakdown[] = ['country' => $cName, 'count' => (int)$cCount];
}

arsort($viewCounts);
$viewBreakdown = [];
foreach (array_slice($viewCounts, 0, 8, true) as $vName => $vCount) {
    $viewBreakdown[] = ['view' => $vName, 'count' => (int)$vCount];
}

$totalUsersCount = count($userRows);

sendSuccess([
    'summary' => [
        'total_users' => $totalUsersCount,
        'online_now' => $onlineCount,
        'idle_now' => $idleCount,
        'offline_now' => $offlineCount,
        'active_today' => $activeTodayCount,
        'new_users_today' => $newUsersTodayCount,
        'verified_users' => $verifiedCount,
        'total_deposits_usdt' => round($totalDepositsUsdt, 2),
        'deposits_today_usdt' => round($depositsTodayUsdt, 2),
        'total_withdrawals_usdt' => round($totalWithdrawalsUsdt, 2),
        'withdrawals_today_usdt' => round($withdrawalsTodayUsdt, 2),
        'signal_executions_total' => $totalExecutionsCount,
        'signal_executions_today' => $executionsTodayCount
    ],
    'device_breakdown' => $deviceCounts,
    'view_breakdown' => $viewBreakdown,
    'country_breakdown' => $countryBreakdown,
    'daily_series' => $dailySeries,
    'users' => $userRows,
    'server_time_utc' => gmdate('Y-m-d\TH:i:s\Z', $nowTs)
], 'Real-time analytics and user tracking loaded');
