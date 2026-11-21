<?php
/**
 * User Referral Network Tree - Supabase REST, hierarchical L1/L2/L3
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = requireAuth();
$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) { sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503); }

$userId = $user['id'];
$rootCode = strtoupper(trim((string)($user['referral_code'] ?? '')));
if ($rootCode === '') {
    sendSuccess(['tree' => null, 'stats' => ['total_network_members'=>0,'level_1_count'=>0,'level_2_count'=>0,'level_3_count'=>0]], 'Referral tree loaded');
}

$res = $supabase->select('profiles', [
    'select' => 'id,email,referral_code,referred_by,kyc_status,created_at,country',
    'limit' => '5000'
]);
if (!$res['success'] || !is_array($res['data'])) {
    sendError('REFERRAL_TREE_LOAD_FAILED', $res['message'] ?? 'Could not load referral profiles', 502);
}

$profiles = $res['data'];
$childrenByParent = [];
foreach ($profiles as $profile) {
    $parent = strtoupper(trim((string)($profile['referred_by'] ?? '')));
    if ($parent === '' || $profile['id'] === $userId) continue;
    $childrenByParent[$parent][] = $profile;
}

$mask = function($email) {
    $parts = explode('@', (string)$email, 2);
    $local = $parts[0] ?? 'user'; $domain = $parts[1] ?? 'domain.com';
    $maskedLocal = strlen($local) <= 3 ? substr($local,0,1).'***' : substr($local,0,3).'***';
    return $maskedLocal.'@'.$domain;
};

$build = function($parentCode, $depth) use (&$build, &$childrenByParent, $mask) {
    if ($depth > 3) return [];
    $out = [];
    foreach (($childrenByParent[strtoupper(trim($parentCode))] ?? []) as $p) {
        $code = trim((string)($p['referral_code'] ?? ''));
        $children = $code !== '' ? $build($code, $depth + 1) : [];
        $out[] = [
            'id' => $p['id'],
            'email' => $mask($p['email'] ?? ''),
            'masked_email' => $mask($p['email'] ?? ''),
            'kyc_status' => $p['kyc_status'] ?? 'NOT_SUBMITTED',
            'referral_code' => $code,
            'referred_by' => $p['referred_by'] ?? null,
            'country' => $p['country'] ?? 'Global',
            'created_at' => $p['created_at'] ?? '',
            'joined_at' => $p['created_at'] ?? '',
            'level' => $depth,
            'direct_invites' => count($children),
            'children' => $children
        ];
    }
    return $out;
};

$l1 = $build($rootCode, 1);
$l2 = 0; $l3 = 0;
foreach ($l1 as $a) {
    $l2 += count($a['children']);
    foreach ($a['children'] as $b) $l3 += count($b['children']);
}

$root = [
    'id' => $userId,
    'email' => $mask($user['email'] ?? ''),
    'referral_code' => $user['referral_code'] ?? '',
    'country' => $user['country'] ?? 'Global',
    'level' => 0,
    'children' => $l1
];
$stats = [
    'referral_code' => $user['referral_code'] ?? '',
    'total_network_members' => count($l1) + $l2 + $l3,
    'total_team_members' => count($l1) + $l2 + $l3,
    'level_1_count' => count($l1),
    'level_2_count' => $l2,
    'level_3_count' => $l3
];

sendSuccess(['tree'=>$root, 'stats'=>$stats, 'summary'=>$stats], 'Referral tree hierarchy loaded');
