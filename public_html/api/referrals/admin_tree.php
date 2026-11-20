<?php
/**
 * Admin Referral Tree Analytics - Pure Supabase REST Architecture
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$admin = requireAdmin();

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

// Profiles and completed-deposit volume are independent reads. Fetch them
// concurrently so referral analytics do not add their network latencies.
$batch = $supabase->selectMany([
    'profiles' => [
        'table' => 'profiles',
        'params' => [
            'select' => 'id,numeric_uid,email,role,kyc_status,referral_code,referred_by,created_at,country',
            'order' => 'created_at.asc',
            'limit' => '1000'
        ]
    ],
    'deposits' => [
        'table' => 'deposits',
        'params' => ['select' => 'user_id,amount,status,created_at', 'order' => 'created_at.desc', 'limit' => '5000']
    ],
    'wallet_balances' => [
        'table' => 'wallet_balances',
        'params' => ['select' => 'user_id,wallet_type,asset,balance,available_balance', 'limit' => '10000']
    ],
    'transactions' => [
        'table' => 'transactions',
        'params' => ['select' => 'user_id,amount,type,status', 'limit' => '10000']
    ]
]);

$profRes = $batch['profiles'] ?? ['success'=>false];
$profiles = ($profRes['success'] && is_array($profRes['data'])) ? $profRes['data'] : [];

// There is no separate trading-orders table in this build. The real, auditable volume
// available to the referral system is each user's completed deposit volume.
$walletBalanceByUser = [];
$walletAvailableByUser = [];
$walletRes = $batch['wallet_balances'] ?? ['success'=>false];
if ($walletRes['success'] && is_array($walletRes['data'])) {
    foreach ($walletRes['data'] as $w) {
        $uid = (string)($w['user_id'] ?? '');
        if ($uid === '' || strtoupper((string)($w['asset'] ?? 'USDT')) !== 'USDT') continue;
        $walletBalanceByUser[$uid] = ($walletBalanceByUser[$uid] ?? 0) + (float)($w['balance'] ?? 0);
        $walletAvailableByUser[$uid] = ($walletAvailableByUser[$uid] ?? 0) + (float)($w['available_balance'] ?? 0);
    }
}

$depositVolumeByUser = [];
$latestDepositDateByUser = [];
$depRes = $batch['deposits'] ?? ['success'=>false];
if ($depRes['success'] && is_array($depRes['data'])) {
    foreach ($depRes['data'] as $d) {
        if (strtoupper((string)($d['status'] ?? '')) !== 'COMPLETED') continue;
        $uid = (string)($d['user_id'] ?? '');
        if ($uid === '') continue;
        $depositVolumeByUser[$uid] = ($depositVolumeByUser[$uid] ?? 0) + (float)($d['amount'] ?? 0);
        if (!isset($latestDepositDateByUser[$uid]) && !empty($d['created_at'])) {
            $latestDepositDateByUser[$uid] = $d['created_at'];
        }
    }
}

// Calculate referral commissions from actual completed ledger transactions instead of
// returning a fabricated zero. Only referral commission transactions are included.
$totalReferralCommissions = 0.0;
$txRes = $batch['transactions'] ?? ['success'=>false];
if ($txRes['success'] && is_array($txRes['data'])) {
    foreach ($txRes['data'] as $tx) {
        if (strtoupper((string)($tx['type'] ?? '')) !== 'REFERRAL_COMMISSION') continue;
        if (strtoupper((string)($tx['status'] ?? '')) !== 'COMPLETED') continue;
        $totalReferralCommissions += (float)($tx['amount'] ?? 0);
    }
}

$nodes = [];
$codeToNodeIndex = [];
$uidToNodeIndex = [];

// 1. Initialize nodes
foreach ($profiles as $idx => $p) {
    $uid = $p['id'];
    $rawCode = $p['referral_code'] ?? ('REF' . strtoupper(substr(md5($uid), 0, 6)));
    $code = strtoupper(trim($rawCode));
    $parentRaw = $p['referred_by'] ?? null;
    $parentCode = !empty($parentRaw) ? strtoupper(trim($parentRaw)) : null;

    $volume = (float)($depositVolumeByUser[$uid] ?? 0);
    $walletBalance = (float)($walletBalanceByUser[$uid] ?? 0);
    $walletAvailable = (float)($walletAvailableByUser[$uid] ?? 0);

    $nodes[$idx] = [
        'id' => $uid,
        'numeric_uid' => $p['numeric_uid'] ?? null,
        'email' => $p['email'] ?? 'user@primexcapital.io',
        'role' => $p['role'] ?? 'USER',
        'kyc_status' => $p['kyc_status'] ?? 'NOT_SUBMITTED',
        'referral_code' => $code,
        'parent_code' => $parentCode,
        'referred_by' => $parentCode,
        'country' => $p['country'] ?? 'Global',
        'trading_volume' => $volume,
        'wallet_balance' => round($walletBalance, 2),
        'available_balance' => round($walletAvailable, 2),
        'level_1_count' => 0,
        'total_sub_members' => 0,
        'created_at' => $p['created_at'] ?? gmdate('Y-m-d H:i:s'),
        'deposit_date' => $latestDepositDateByUser[$uid] ?? null,
        'children' => []
    ];

    $codeToNodeIndex[$code] = $idx;
    $uidToNodeIndex[$uid] = $idx;
}

// 2. Link children to parents
$rootIndices = [];
$totalLinks = 0;

foreach ($nodes as $idx => &$node) {
    $parent = $node['parent_code'];
    $parentIdx = null;

    if (!empty($parent)) {
        if (isset($codeToNodeIndex[$parent])) {
            $parentIdx = $codeToNodeIndex[$parent];
        } elseif (isset($uidToNodeIndex[$parent])) {
            $parentIdx = $uidToNodeIndex[$parent];
        }
    }

    if ($parentIdx !== null && $parentIdx !== $idx) {
        $nodes[$parentIdx]['level_1_count']++;
        $nodes[$parentIdx]['children'][] = &$nodes[$idx];
        $totalLinks++;
    } else {
        $rootIndices[] = $idx;
    }
}
unset($node);

// Recursive helper for sub-members count
function computeSubMembers(&$node) {
    $count = count($node['children']);
    foreach ($node['children'] as &$child) {
        $count += computeSubMembers($child);
    }
    $node['total_sub_members'] = $count;
    return $count;
}

$roots = [];
foreach ($rootIndices as $rIdx) {
    computeSubMembers($nodes[$rIdx]);
    $roots[] = $nodes[$rIdx];
}

// Flat list for roster view
$flatUsers = [];
$topReferrers = [];
$recentEvents = [];

foreach ($nodes as $n) {
    $flatUsers[] = [
        'id' => $n['id'],
        'numeric_uid' => $n['numeric_uid'],
        'email' => $n['email'],
        'role' => $n['role'],
        'kyc_status' => $n['kyc_status'],
        'referral_code' => $n['referral_code'],
        'parent_code' => $n['parent_code'] ?: 'ROOT',
        'referred_by' => $n['parent_code'],
        'country' => $n['country'],
        'trading_volume' => $n['trading_volume'],
        'wallet_balance' => $n['wallet_balance'],
        'available_balance' => $n['available_balance'],
        'level_1_count' => $n['level_1_count'],
        'total_sub_members' => $n['total_sub_members'],
        'created_at' => $n['created_at'],
        'deposit_date' => $n['deposit_date']
    ];

    if ($n['level_1_count'] > 0) {
        $topReferrers[] = [
            'id' => $n['id'],
            'email' => $n['email'],
            'role' => $n['role'],
            'kyc_status' => $n['kyc_status'],
            'referral_code' => $n['referral_code'],
            'country' => $n['country'],
            'direct_invites' => $n['level_1_count']
        ];
    }

    if (!empty($n['parent_code'])) {
        $recentEvents[] = [
            'invitee_id' => $n['id'],
            'invitee_email' => $n['email'],
            'invitee_kyc' => $n['kyc_status'],
            'inviter_code' => $n['parent_code'],
            'joined_at' => $n['created_at']
        ];
    }
}

usort($topReferrers, function($a, $b) {
    return $b['direct_invites'] - $a['direct_invites'];
});

$topAffiliate = !empty($topReferrers[0]['email']) ? $topReferrers[0]['email'] : 'N/A';

sendSuccess([
    'roots' => $roots,
    'trees' => $roots,
    'flat_users' => $flatUsers,
    'total_users' => count($profiles),
    'total_invites' => $totalLinks,
    'active_inviters_count' => count($topReferrers),
    'top_referrers' => array_slice($topReferrers, 0, 15),
    'recent_events' => array_slice($recentEvents, 0, 30),
    'stats' => [
        'total_users' => count($profiles),
        'total_links' => $totalLinks,
        'root_count' => count($roots),
        'downline_count' => $totalLinks,
        'total_volume' => array_sum($depositVolumeByUser),
        'total_wallet_balance' => array_sum($walletBalanceByUser),
        'total_available_balance' => array_sum($walletAvailableByUser),
        'total_commissions' => round($totalReferralCommissions, 2),
        'top_affiliate' => $topAffiliate
    ]
], 'Admin referral tree loaded successfully from Supabase');
