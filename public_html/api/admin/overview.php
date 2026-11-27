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

$batch = $supabase->selectMany([
    'users' => [
        'table' => 'profiles',
        'params' => ['select' => 'id,numeric_uid,email,first_name,last_name,role,is_active,kyc_status,country,created_at'],
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
    'adjustments' => [
        'table' => 'ledger_entries',
        'params' => [
            'entry_type' => 'eq.ADJUSTMENT',
            'asset' => 'eq.USDT',
            'select' => 'amount,description',
            'limit' => '10000'
        ]
    ],
    'kyc_submissions' => [
        'table' => 'kyc_submissions',
        'params' => [
            'select' => 'id,user_id,legal_name,document_type,country,status,created_at,updated_at',
            'order' => 'created_at.desc',
            'limit' => '500'
        ]
    ],
    'signals' => [
        'table' => 'trading_signals',
        'params' => ['select' => 'status', 'order' => 'created_at.desc', 'limit' => '100']
    ],
    'positions' => [
        'table' => 'positions',
        'params' => ['select' => 'status', 'order' => 'created_at.desc', 'limit' => '100']
    ],
    'support_tickets' => [
        'table' => 'support_tickets',
        'params' => ['select' => 'id,status,updated_at', 'limit' => '500']
    ],
    'support_messages' => [
        'table' => 'support_messages',
        'params' => ['select' => 'ticket_id,sender_role,created_at', 'order' => 'created_at.desc', 'limit' => '1500']
    ]
]);

$usersRes = $batch['users'] ?? ['success' => false];
$depositsRes = $batch['deposits'] ?? ['success' => false];
$withdrawalsRes = $batch['withdrawals'] ?? ['success' => false];
$signalsRes = $batch['signals'] ?? ['success' => false];
$positionsRes = $batch['positions'] ?? ['success' => false];

if (empty($usersRes['success']) && empty($depositsRes['success']) && empty($withdrawalsRes['success'])) {
    $errMsg = (string)($usersRes['message'] ?? $depositsRes['message'] ?? 'Supabase query failed');
    $httpCode = (int)($usersRes['http_code'] ?? $depositsRes['http_code'] ?? 0);
    primex_record_log('ADMIN', 'ADMIN_OVERVIEW_DB_ERROR', $errMsg, [
        'http_code' => $httpCode,
        'error' => $usersRes['error'] ?? null
    ], 'ERROR', (string)($admin['id'] ?? ''), (string)($admin['email'] ?? ''));
    sendError('SUPABASE_QUERY_FAILED', 'Unable to load admin overview from Supabase: ' . $errMsg . ' (HTTP ' . $httpCode . '). Verify server/.env Supabase API keys.', 502);
}

$users = ($usersRes['success'] && is_array($usersRes['data'])) ? $usersRes['data'] : [];
$deposits = ($depositsRes['success'] && is_array($depositsRes['data'])) ? $depositsRes['data'] : [];
$withdrawals = ($withdrawalsRes['success'] && is_array($withdrawalsRes['data'])) ? $withdrawalsRes['data'] : [];
$signals = ($signalsRes['success'] && is_array($signalsRes['data'])) ? $signalsRes['data'] : [];
$positions = ($positionsRes['success'] && is_array($positionsRes['data'])) ? $positionsRes['data'] : [];
$kycSubs = (!empty($batch['kyc_submissions']['success']) && is_array($batch['kyc_submissions']['data'] ?? null))
    ? $batch['kyc_submissions']['data']
    : [];

$totalUsers = $usersRes['count'] ?? count($users);
$userMap = [];
$suspendedUsers = 0;
foreach ($users as $u) {
    $uid = trim((string)($u['id'] ?? ''));
    if ($uid !== '') $userMap[$uid] = $u;
    if (array_key_exists('is_active', $u) && $u['is_active'] !== null) {
        $activeFlag = filter_var($u['is_active'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        if ($activeFlag === false) $suspendedUsers++;
    }
}

$totalDeposits = 0.0;
$pendingDeposits = 0;
foreach ($deposits as $d) {
    $status = strtoupper(trim((string)($d['status'] ?? '')));
    if (in_array($status, ['COMPLETED', 'APPROVED', 'CONFIRMED'], true)) {
        $totalDeposits += (float)($d['amount'] ?? 0);
    } elseif (in_array($status, ['PENDING', 'REQUESTED', 'PENDING_REVIEW'], true)) {
        $pendingDeposits++;
    }
}

$adjRes = $batch['adjustments'] ?? ['success' => false];
if (!empty($adjRes['success']) && is_array($adjRes['data'] ?? null)) {
    foreach ($adjRes['data'] as $adj) {
        $desc = strtoupper(trim((string)($adj['description'] ?? '')));
        if (strpos($desc, '[DEPOSIT]') === 0) {
            $totalDeposits += (float)($adj['amount'] ?? 0);
        }
    }
}
$totalDeposits = max(0.0, round($totalDeposits, 2));

$totalWithdrawals = 0.0;
$pendingWithdrawals = 0;
foreach ($withdrawals as $w) {
    $status = strtoupper(trim((string)($w['status'] ?? '')));
    if (in_array($status, ['COMPLETED', 'APPROVED'], true)) {
        $totalWithdrawals += (float)($w['amount'] ?? 0);
    } elseif (in_array($status, ['REQUESTED', 'PENDING', 'PENDING_REVIEW'], true)) {
        $pendingWithdrawals++;
    }
}

// Reconcile effective KYC status across kyc_submissions and profiles
$allowedStatuses = ['APPROVED', 'REJECTED', 'RESUBMIT_REQUIRED', 'PENDING', 'UNDER_REVIEW', 'NOT_SUBMITTED'];
$verifiedUsers = 0;
$pendingKycPreview = [];
$seenKycUsers = [];

foreach ($kycSubs as $sub) {
    $uid = trim((string)($sub['user_id'] ?? ''));
    if ($uid === '' || isset($seenKycUsers[$uid])) continue;
    $seenKycUsers[$uid] = true;

    $prof = $userMap[$uid] ?? [];
    $userKyc = strtoupper(trim((string)($prof['kyc_status'] ?? '')));
    $subKyc = strtoupper(trim((string)($sub['status'] ?? 'PENDING')));
    $effectiveStatus = in_array($userKyc, $allowedStatuses, true) ? $userKyc : $subKyc;

    if ($effectiveStatus === 'PENDING' || $effectiveStatus === 'UNDER_REVIEW') {
        $email = (string)($prof['email'] ?? $uid);
        $fallbackName = trim((string)($prof['first_name'] ?? '') . ' ' . (string)($prof['last_name'] ?? ''));
        if ($fallbackName === '' && strpos($email, '@') !== false) {
            $fallbackName = ucwords(str_replace(['.', '_', '-'], ' ', explode('@', $email)[0]));
        }
        $pendingKycPreview[] = [
            'id' => (string)($sub['id'] ?? $uid),
            'user_id' => $uid,
            'numeric_uid' => $prof['numeric_uid'] ?? null,
            'email' => $email,
            'legal_name' => !empty($sub['legal_name']) ? (string)$sub['legal_name'] : ($fallbackName ?: 'Applicant'),
            'document_type' => (string)($sub['document_type'] ?? 'NATIONAL_ID'),
            'country' => (string)($sub['country'] ?? ($prof['country'] ?? 'Global')),
            'status' => $effectiveStatus,
            'created_at' => (string)($sub['updated_at'] ?? $sub['created_at'] ?? '')
        ];
    }
}

foreach ($users as $u) {
    $uid = trim((string)($u['id'] ?? ''));
    $userKyc = strtoupper(trim((string)($u['kyc_status'] ?? '')));
    if ($userKyc === 'APPROVED') {
        $verifiedUsers++;
    }
    if ($uid !== '' && !isset($seenKycUsers[$uid]) && ($userKyc === 'PENDING' || $userKyc === 'UNDER_REVIEW')) {
        $email = (string)($u['email'] ?? $uid);
        $fallbackName = trim((string)($u['first_name'] ?? '') . ' ' . (string)($u['last_name'] ?? ''));
        if ($fallbackName === '' && strpos($email, '@') !== false) {
            $fallbackName = ucwords(str_replace(['.', '_', '-'], ' ', explode('@', $email)[0]));
        }
        $pendingKycPreview[] = [
            'id' => 'kyc_' . substr(md5($uid), 0, 12),
            'user_id' => $uid,
            'numeric_uid' => $u['numeric_uid'] ?? null,
            'email' => $email,
            'legal_name' => $fallbackName ?: 'Applicant',
            'document_type' => 'ID_CARD',
            'country' => (string)($u['country'] ?? 'Global'),
            'status' => $userKyc,
            'created_at' => (string)($u['created_at'] ?? '')
        ];
    }
}

usort($pendingKycPreview, static function (array $a, array $b): int {
    return strcmp((string)($b['created_at'] ?? ''), (string)($a['created_at'] ?? ''));
});
$kycPending = count($pendingKycPreview);
$pendingKycPreview = array_slice($pendingKycPreview, 0, 50);

// Support live needs-reply and open counts
$supportTickets = (!empty($batch['support_tickets']['success']) && is_array($batch['support_tickets']['data'] ?? null))
    ? $batch['support_tickets']['data']
    : [];
$supportMessages = (!empty($batch['support_messages']['success']) && is_array($batch['support_messages']['data'] ?? null))
    ? $batch['support_messages']['data']
    : [];

$lastRoleByTicket = [];
foreach ($supportMessages as $sm) {
    $tid = (string)($sm['ticket_id'] ?? '');
    if ($tid !== '' && !isset($lastRoleByTicket[$tid])) {
        $lastRoleByTicket[$tid] = strtoupper(trim((string)($sm['sender_role'] ?? 'USER')));
    }
}
$supportOpen = 0;
$supportNeedsReply = 0;
foreach ($supportTickets as $st) {
    $tid = (string)($st['id'] ?? '');
    $tStatus = strtoupper(trim((string)($st['status'] ?? 'OPEN')));
    if (!in_array($tStatus, ['RESOLVED', 'CLOSED'], true)) {
        $supportOpen++;
        $lastRole = $lastRoleByTicket[$tid] ?? 'USER';
        if ($lastRole !== 'ADMIN') {
            $supportNeedsReply++;
        }
    }
}

$activeSignals = 0;
foreach ($signals as $sig) {
    if (in_array(strtoupper((string)($sig['status'] ?? '')), ['PUBLISHED', 'ACTIVE'], true)) {
        $activeSignals++;
    }
}
$activePositions = 0;
foreach ($positions as $pos) {
    if (strtoupper((string)($pos['status'] ?? '')) === 'OPEN') {
        $activePositions++;
    }
}

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
        'support_open' => $supportOpen,
        'support_needs_reply' => $supportNeedsReply,
        'trading_volume_usdt' => 0.0,
        'active_signals' => $activeSignals,
        'active_positions' => $activePositions,
        'total_fees_usdt' => 0.0,
        'referral_rewards_usdt' => 0.0,
        'pending_actions' => $kycPending + $pendingWithdrawals + $pendingDeposits + $supportNeedsReply
    ],
    'pending_kyc_preview' => $pendingKycPreview,
    'security_alerts' => [
        ['type' => 'INFO', 'message' => 'Supabase REST connection active as primary persistent store.'],
        ['type' => 'INFO', 'message' => 'Four-eyes dual authorization active for withdrawals.']
    ]
], 'Admin overview statistics loaded from Supabase');
