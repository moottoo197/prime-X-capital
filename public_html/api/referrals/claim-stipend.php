<?php
require_once dirname(__DIR__) . '/bootstrap.php';

$user = requireAuth();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

$userId = (string)$user['id'];
$code = strtoupper(trim((string)($user['referral_code'] ?? '')));

if ($code === '') {
    sendError('BAD_REQUEST', 'Regional leadership stipend requires at least 5 active network members (Current: 0)', 400);
}

$profRes = $supabase->select('profiles', [
    'select' => 'id,referral_code,referred_by,is_active',
    'limit' => '5000'
]);
if (!$profRes['success'] || !is_array($profRes['data'])) {
    sendError('REFERRAL_LOOKUP_FAILED', 'Unable to verify your referral network right now. Please try again.', 502);
}

$childrenByParent = [];
foreach ($profRes['data'] as $p) {
    $parent = strtoupper(trim((string)($p['referred_by'] ?? '')));
    if ($parent === '' || (string)($p['id'] ?? '') === $userId) {
        continue;
    }
    $childrenByParent[$parent][] = $p;
}

$countTree = static function (string $parentCode, int $depth) use (&$countTree, &$childrenByParent): int {
    if ($depth > 3) {
        return 0;
    }
    $total = 0;
    foreach (($childrenByParent[strtoupper(trim($parentCode))] ?? []) as $child) {
        if (isset($child['is_active']) && !$child['is_active']) {
            continue;
        }
        $total++;
        $childCode = strtoupper(trim((string)($child['referral_code'] ?? '')));
        if ($childCode !== '') {
            $total += $countTree($childCode, $depth + 1);
        }
    }
    return $total;
};

$totalTeam = $countTree($code, 1);
if ($totalTeam < 5) {
    sendError('BAD_REQUEST', 'Regional leadership stipend requires at least 5 active network members (Current: ' . $totalTeam . ')', 400);
}

$stipendAmount = 150.0;
$tierName = 'Tier 1 Regional Leader';
if ($totalTeam >= 50) {
    $stipendAmount = 1200.0;
    $tierName = 'Tier 3 Global Ambassador';
} elseif ($totalTeam >= 20) {
    $stipendAmount = 450.0;
    $tierName = 'Tier 2 Senior Director';
}

$oneWeekAgoTs = time() - (7 * 86400);
$oneWeekAgoIso = gmdate('Y-m-d\TH:i:s\Z', $oneWeekAgoTs);
$recentLedger = $supabase->select('ledger_entries', [
    'user_id' => 'eq.' . $userId,
    'entry_type' => 'eq.REFERRAL_COMMISSION',
    'created_at' => 'gte.' . $oneWeekAgoIso,
    'select' => 'id,description,created_at',
    'limit' => '25'
]);
if ($recentLedger['success'] && is_array($recentLedger['data'])) {
    foreach ($recentLedger['data'] as $row) {
        if (stripos((string)($row['description'] ?? ''), 'Leadership Stipend') !== false) {
            sendError('BAD_REQUEST', 'Leadership stipend has already been claimed for this weekly period. Try again next week.', 400);
        }
    }
}

$claimsFile = dirname(__DIR__, 3) . '/server/storage/stipend_claims.json';
$claimsStore = is_file($claimsFile) ? (json_decode((string)@file_get_contents($claimsFile), true) ?: []) : [];
$lastClaimTs = isset($claimsStore[$userId]['created_ts']) ? (int)$claimsStore[$userId]['created_ts'] : 0;
if ($lastClaimTs > $oneWeekAgoTs) {
    sendError('BAD_REQUEST', 'A leadership stipend claim has already been submitted this week.', 400);
}

$claimId = 'STIP-' . strtoupper(substr(bin2hex(random_bytes(6)), 0, 10));
$claimsStore[$userId] = [
    'claim_id' => $claimId,
    'tier_name' => $tierName,
    'stipend_amount' => $stipendAmount,
    'team_count' => $totalTeam,
    'status' => 'PENDING',
    'created_ts' => time(),
    'created_at' => gmdate('Y-m-d H:i:s')
];
$storageDir = dirname($claimsFile);
if (!is_dir($storageDir)) {
    @mkdir($storageDir, 0750, true);
}
@file_put_contents($claimsFile, json_encode($claimsStore, JSON_PRETTY_PRINT), LOCK_EX);

primex_record_log('REFERRALS', 'STIPEND_CLAIM_SUBMITTED', 'Leadership stipend claim submitted for review', [
    'claim_id' => $claimId,
    'tier_name' => $tierName,
    'stipend_amount' => $stipendAmount,
    'team_count' => $totalTeam
], 'INFO', $userId, (string)($user['email'] ?? ''));

sendSuccess([
    'claim_id' => $claimId,
    'tier_name' => $tierName,
    'stipend_amount' => $stipendAmount,
    'team_count' => $totalTeam,
    'status' => 'PENDING'
], "Weekly stipend claim of \${$stipendAmount} USDT ({$tierName}) submitted for compliance approval!");
