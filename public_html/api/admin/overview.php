<?php
/**
 * Admin Overview Metrics - Direct Supabase REST
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$admin = requireAdmin();

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

// Fetch all dashboard metrics in parallel. The previous implementation made
// five remote Supabase requests one after another, so their network latency
// accumulated into a multi-second admin dashboard load.
$batch = $supabase->selectMany([
    'users' => [
        'table' => 'profiles',
        'params' => ['select' => 'id,role,is_active,kyc_status'],
        'headers' => ['Range: 0-9999', 'Prefer: count=exact']
    ],
    'deposits' => [
        'table' => 'deposits',
        'params' => ['select' => 'amount,status'],
        'headers' => ['Range: 0-9999', 'Prefer: count=exact']
    ],
    'withdrawals' => [
        'table' => 'withdrawals',
        'params' => ['select' => 'amount,status'],
        'headers' => ['Range: 0-9999', 'Prefer: count=exact']
    ],
    'signals' => [
        'table' => 'trading_signals',
        'params' => ['select' => 'status', 'order' => 'created_at.desc', 'limit' => '100']
    ],
    'positions' => [
        'table' => 'positions',
        'params' => ['select' => 'status', 'order' => 'created_at.desc', 'limit' => '100']
    ]
]);

$usersRes = $batch['users'] ?? ['success'=>false];
$depositsRes = $batch['deposits'] ?? ['success'=>false];
$withdrawalsRes = $batch['withdrawals'] ?? ['success'=>false];
$signalsRes = $batch['signals'] ?? ['success'=>false];
$positionsRes = $batch['positions'] ?? ['success'=>false];

if (empty($usersRes['success']) && empty($depositsRes['success']) && empty($withdrawalsRes['success'])) {
    $errMsg = (string)($usersRes['message'] ?? $depositsRes['message'] ?? 'Supabase query failed');
    $httpCode = (int)($usersRes['http_code'] ?? $depositsRes['http_code'] ?? 0);
    primex_record_log('ADMIN', 'ADMIN_OVERVIEW_DB_ERROR', $errMsg, [
        'http_code' => $httpCode,
        'error' => $usersRes['error'] ?? null
    ], 'ERROR', (string)($admin['id'] ?? ''), (string)($admin['email'] ?? ''));
    sendError('SUPABASE_QUERY_FAILED', 'Unable to load admin overview from Supabase: ' . $errMsg . ' (HTTP ' . $httpCode . '). Verify server/.env Supabase API keys.', 502);
}

$users = $usersRes['success'] && is_array($usersRes['data']) ? $usersRes['data'] : [];
$deposits = $depositsRes['success'] && is_array($depositsRes['data']) ? $depositsRes['data'] : [];
$withdrawals = $withdrawalsRes['success'] && is_array($withdrawalsRes['data']) ? $withdrawalsRes['data'] : [];
$signals = $signalsRes['success'] && is_array($signalsRes['data']) ? $signalsRes['data'] : [];
$positions = $positionsRes['success'] && is_array($positionsRes['data']) ? $positionsRes['data'] : [];

$totalUsers = $usersRes['count'] ?? count($users);
$verifiedUsers = 0;
$suspendedUsers = 0;
foreach ($users as $u) {
    if (strtoupper((string)($u['kyc_status'] ?? '')) === 'APPROVED') $verifiedUsers++;
    if (isset($u['is_active']) && !$u['is_active']) $suspendedUsers++;
}

$totalDeposits = 0.0;
$pendingDeposits = 0;
foreach ($deposits as $d) {
    $status = strtoupper((string)($d['status'] ?? ''));
    if ($status === 'COMPLETED') $totalDeposits += (float)($d['amount'] ?? 0);
    elseif ($status === 'PENDING') $pendingDeposits++;
}
// A Financial Adjustment explicitly classified as DEPOSIT is funded principal
// and must also be included in the admin Total Deposits metric. Other adjustment
// types (referral bonus, profit, other) remain excluded.
$adjRes = $supabase->select('ledger_entries', [
    'entry_type' => 'eq.ADJUSTMENT',
    'asset' => 'eq.USDT',
    'select' => 'amount,description',
    'limit' => '10000'
]);
if ($adjRes['success'] && is_array($adjRes['data'])) {
    foreach ($adjRes['data'] as $adj) {
        $desc = strtoupper(trim((string)($adj['description'] ?? '')));
        if (strpos($desc, '[DEPOSIT]') === 0) $totalDeposits += (float)($adj['amount'] ?? 0);
    }
}
$totalDeposits = max(0.0, round($totalDeposits, 2));

$totalWithdrawals = 0.0;
$pendingWithdrawals = 0;
foreach ($withdrawals as $w) {
    $status = strtoupper((string)($w['status'] ?? ''));
    if ($status === 'COMPLETED') $totalWithdrawals += (float)($w['amount'] ?? 0);
    elseif ($status === 'REQUESTED' || $status === 'PENDING') $pendingWithdrawals++;
}

$kycPending = 0;
foreach ($users as $u) {
    $status = strtoupper(trim((string)($u['kyc_status'] ?? '')));
    if ($status === 'PENDING' || $status === 'UNDER_REVIEW') $kycPending++;
}

$activeSignals = 0;
foreach ($signals as $sig) if (strtoupper((string)($sig['status'] ?? '')) === 'PUBLISHED') $activeSignals++;
$activePositions = 0;
foreach ($positions as $pos) if (strtoupper((string)($pos['status'] ?? '')) === 'OPEN') $activePositions++;

sendSuccess([
    'runtime_mode' => 'LIVE',
    'database_engine' => 'supabase-rest',
    'metrics' => [
        'total_users' => $totalUsers,
        'verified_users' => $verifiedUsers,
        'kyc_pending' => $kycPending,
        'suspended_users' => $suspendedUsers,
        'total_deposits_usdt' => round($totalDeposits, 2),
        'pending_deposits' => $pendingDeposits,
        'total_withdrawals_usdt' => round($totalWithdrawals, 2),
        'pending_withdrawals' => $pendingWithdrawals,
        'trading_volume_usdt' => 0.0,
        'active_signals' => $activeSignals,
        'active_positions' => $activePositions,
        'total_fees_usdt' => 0.0,
        'referral_rewards_usdt' => 0.0,
        'pending_actions' => $kycPending + $pendingWithdrawals + $pendingDeposits
    ],
    'security_alerts' => [
        ['type' => 'INFO', 'message' => 'Supabase REST connection active as primary persistent store.'],
        ['type' => 'INFO', 'message' => 'Four-eyes dual authorization active for withdrawals.']
    ]
], 'Admin overview statistics loaded from Supabase');
