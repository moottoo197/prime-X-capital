<?php
/**
 * User Referral Statistics & Direct Invitees - Pure Supabase REST Architecture
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = getCurrentUser();
$userId = $user ? $user['id'] : null;

$supabase = getSupabaseClient();
$referralCode = $user['referral_code'] ?? 'ALPHAPRO';
$refCodeUpper = strtoupper(trim($referralCode));

$totalReferrals = 0;
$totalEarned = 0.0;
$directInvitees = [];
$level1Count = 0;
$level2Count = 0;
$level3Count = 0;

if ($userId && $supabase->isConfigured()) {
    $res = $supabase->select('profiles', [
        'select' => 'id,email,referral_code,referred_by,kyc_status,created_at,role',
        'order' => 'created_at.desc',
        'limit' => '1000'
    ]);

    if ($res['success'] && is_array($res['data'])) {
        $allProfiles = $res['data'];
        
        // Build map of parent to children
        $parentToChildren = [];
        $idToProfile = [];
        $codeToProfile = [];

        foreach ($allProfiles as $p) {
            $idToProfile[$p['id']] = $p;
            $c = strtoupper(trim($p['referral_code'] ?? ''));
            if (!empty($c)) {
                $codeToProfile[$c] = $p;
            }
            $parent = strtoupper(trim($p['referred_by'] ?? ''));
            if (!empty($parent)) {
                if (!isset($parentToChildren[$parent])) {
                    $parentToChildren[$parent] = [];
                }
                $parentToChildren[$parent][] = $p;
            }
        }

        // 1. Direct Invitees (Level 1)
        $l1List = [];
        // Match by referral code
        if (!empty($refCodeUpper) && isset($parentToChildren[$refCodeUpper])) {
            $l1List = array_merge($l1List, $parentToChildren[$refCodeUpper]);
        }
        // Match by user ID in referred_by
        $uidUpper = strtoupper(trim($userId));
        if (isset($parentToChildren[$uidUpper])) {
            $l1List = array_merge($l1List, $parentToChildren[$uidUpper]);
        }

        // Deduplicate L1
        $uniqueL1 = [];
        foreach ($l1List as $p) {
            if ($p['id'] !== $userId && !isset($uniqueL1[$p['id']])) {
                $uniqueL1[$p['id']] = $p;
            }
        }

        $level1Count = count($uniqueL1);
        $totalReferrals = $level1Count;

        // Count sub-invites (Level 2)
        $uniqueL2 = [];
        foreach ($uniqueL1 as $l1User) {
            $l1Code = strtoupper(trim($l1User['referral_code'] ?? ''));
            $l1Uid = strtoupper(trim($l1User['id'] ?? ''));
            $subChildren = array_merge(
                $parentToChildren[$l1Code] ?? [],
                $parentToChildren[$l1Uid] ?? []
            );
            $subCount = 0;
            foreach ($subChildren as $sc) {
                if ($sc['id'] !== $userId && !isset($uniqueL1[$sc['id']])) {
                    $subCount++;
                    $uniqueL2[$sc['id']] = $sc;
                }
            }

            $directInvitees[] = [
                'id' => $l1User['id'],
                'email' => $l1User['email'],
                'kyc_status' => $l1User['kyc_status'] ?? 'NOT_SUBMITTED',
                'referral_code' => $l1User['referral_code'] ?? '',
                'direct_invites' => $subCount,
                'created_at' => $l1User['created_at'] ?? gmdate('Y-m-d H:i:s')
            ];
        }

        $level2Count = count($uniqueL2);

        // Count Level 3
        $uniqueL3 = [];
        foreach ($uniqueL2 as $l2User) {
            $l2Code = strtoupper(trim($l2User['referral_code'] ?? ''));
            $l2Uid = strtoupper(trim($l2User['id'] ?? ''));
            $subChildren3 = array_merge(
                $parentToChildren[$l2Code] ?? [],
                $parentToChildren[$l2Uid] ?? []
            );
            foreach ($subChildren3 as $sc3) {
                if ($sc3['id'] !== $userId && !isset($uniqueL1[$sc3['id']]) && !isset($uniqueL2[$sc3['id']])) {
                    $uniqueL3[$sc3['id']] = $sc3;
                }
            }
        }
        $level3Count = count($uniqueL3);

        // Compute actual referral earnings from immutable ledger records
        $totalEarned = 0.0;
        $ledgerRes = $supabase->select('ledger_entries', [
            'user_id' => 'eq.' . $userId,
            'asset' => 'eq.USDT',
            'select' => 'entry_type,amount,description,reference_id',
            'limit' => '1000'
        ]);
        if (!empty($ledgerRes['success']) && is_array($ledgerRes['data'] ?? null)) {
            foreach ($ledgerRes['data'] as $entry) {
                $et = strtoupper(trim((string)($entry['entry_type'] ?? '')));
                $amt = (float)($entry['amount'] ?? 0);
                $desc = strtoupper(trim((string)($entry['description'] ?? '')));
                $ref = strtoupper(trim((string)($entry['reference_id'] ?? '')));
                if ($et === 'REFERRAL_COMMISSION') {
                    $totalEarned += $amt;
                } elseif ($et === 'ADJUSTMENT' && (strpos($desc, '[REFERRAL_BONUS]') === 0 || strpos($ref, '[REFERRAL_BONUS]') === 0 || preg_match('/\bREFERRAL\b/i', $desc))) {
                    $totalEarned += $amt;
                }
            }
        }
        $totalEarned = round(max(0.0, $totalEarned), 2);
    }
}

$host = $_SERVER['HTTP_HOST'] ?? 'prime-x-capital.com';
$proto = (function_exists('isHttpsRequest') ? isHttpsRequest() : (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on')) ? 'https' : 'http';

sendSuccess([
    'referral_code' => $referralCode,
    'referral_link' => "{$proto}://{$host}/?ref={$referralCode}#ref={$referralCode}",
    'invite_link' => "{$proto}://{$host}/?ref={$referralCode}#ref={$referralCode}",
    'total_referrals' => $totalReferrals,
    'total_team_members' => ($level1Count + $level2Count + $level3Count),
    'level_1_count' => $level1Count,
    'level_2_count' => $level2Count,
    'level_3_count' => $level3Count,
    'total_earned_usdt' => $totalEarned,
    'total_commissions' => number_format($totalEarned, 2, '.', ''),
    'active_directs' => $totalReferrals,
    'downline_count' => ($level1Count + $level2Count + $level3Count),
    'invitees' => $directInvitees,
    'stipend_claimed' => false,
    'tiers' => [
        ['level' => 1, 'percent' => 10, 'title' => 'Tier 1 Direct'],
        ['level' => 2, 'percent' => 5, 'title' => 'Tier 2 Secondary'],
        ['level' => 3, 'percent' => 2.5, 'title' => 'Tier 3 Institutional']
    ]
], 'Referral statistics loaded from Supabase');
