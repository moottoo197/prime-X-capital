<?php
/**
 * Admin Withdrawals Management - Direct Supabase REST
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$admin = requireAdmin();
$adminId = (string)($admin['id'] ?? '');
$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Withdrawals and profile labels are independent; fetch them concurrently.
    $batch = $supabase->selectMany([
        'withdrawals' => [
            'table' => 'withdrawals',
            'params' => ['select' => '*', 'order' => 'created_at.desc', 'limit' => '500']
        ],
        'profiles' => [
            'table' => 'profiles',
            'params' => ['select' => 'id,email,kyc_status,numeric_uid,first_name,last_name']
        ]
    ]);
    $withRes = $batch['withdrawals'] ?? ['success'=>false];
    if (!$withRes['success']) {
        $errMsg = (string)($withRes['message'] ?? 'Failed to retrieve withdrawals.');
        sendError('SUPABASE_QUERY_FAILED', 'Failed to retrieve withdrawals: ' . $errMsg, 502);
    }
    $withdrawals = is_array($withRes['data']) ? $withRes['data'] : [];

    // Attach user emails and kyc statuses
    $profRes = $batch['profiles'] ?? ['success'=>false];
    $userMap = [];
    if ($profRes['success'] && is_array($profRes['data'])) {
        foreach ($profRes['data'] as $p) {
            $userMap[$p['id']] = $p;
        }
    }

    // Load bound withdrawal addresses for address validation column & batch verification preview
    $boundAddressesFile = dirname(__DIR__, 3) . '/server/storage/bound_addresses.json';
    $boundMap = [];
    if (is_file($boundAddressesFile)) {
        $decodedBound = json_decode((string)@file_get_contents($boundAddressesFile), true);
        if (is_array($decodedBound)) $boundMap = $decodedBound;
    }

    $todayPrefix = gmdate('Y-m-d');
    $pendingCount = 0;
    $pendingAmountUsdt = 0.0;
    $batchReadyCount = 0;
    $batchReadyAmountUsdt = 0.0;
    $processedTodayCount = 0;
    $processedTodayUsdt = 0.0;

    $formattedWithdrawals = array_map(function($w) use ($userMap, $boundMap, $todayPrefix, &$pendingCount, &$pendingAmountUsdt, &$batchReadyCount, &$batchReadyAmountUsdt, &$processedTodayCount, &$processedTodayUsdt) {
        $uid = (string)($w['user_id'] ?? '');
        $user = $userMap[$uid] ?? [];
        $fullName = trim((string)($user['first_name'] ?? '') . ' ' . (string)($user['last_name'] ?? ''));
        $status = strtoupper(trim((string)($w['status'] ?? 'REQUESTED')));
        $network = strtoupper(trim((string)($w['network'] ?? 'TRC20')));
        $destAddr = trim((string)($w['destination_address'] ?? ''));
        $amount = (float)($w['amount'] ?? 0);
        $kycStatus = strtoupper(trim((string)($user['kyc_status'] ?? 'UNKNOWN')));

        // Validate against user's bound addresses
        $userBoundList = is_array($boundMap[$uid] ?? null) ? $boundMap[$uid] : [];
        $exactBoundMatch = false;
        $hasAnyBound = count($userBoundList) > 0;
        foreach ($userBoundList as $bRow) {
            if (!is_array($bRow)) continue;
            $bAddr = trim((string)($bRow['address'] ?? ''));
            $bNet = strtoupper(trim((string)($bRow['network'] ?? '')));
            if ($bAddr !== '' && strcasecmp($bAddr, $destAddr) === 0 && ($bNet === '' || $bNet === $network)) {
                $exactBoundMatch = true;
                break;
            }
        }
        if ($exactBoundMatch && $kycStatus === 'APPROVED') {
            $boundStatus = 'ADDRESS_BOUND_VERIFIED';
            $boundLabel = 'Address Bound & Verified';
        } elseif ($exactBoundMatch || $hasAnyBound) {
            $boundStatus = $exactBoundMatch ? 'BOUND' : 'UNBOUND';
            $boundLabel = $exactBoundMatch ? 'Bound' : 'Unbound';
        } else {
            $boundStatus = 'UNBOUND';
            $boundLabel = 'Unbound';
        }

        if (in_array($status, ['PENDING', 'REQUESTED', 'PENDING_REVIEW'], true)) {
            $pendingCount++;
            $pendingAmountUsdt += $amount;
            if ($exactBoundMatch || $boundStatus === 'ADDRESS_BOUND_VERIFIED' || $kycStatus === 'APPROVED') {
                $batchReadyCount++;
                $batchReadyAmountUsdt += $amount;
            }
        } elseif (in_array($status, ['COMPLETED', 'APPROVED'], true)) {
            $updatedStr = (string)($w['updated_at'] ?? $w['created_at'] ?? '');
            if (strpos($updatedStr, $todayPrefix) === 0) {
                $processedTodayCount++;
                $processedTodayUsdt += $amount;
            }
        }

        $rawId = (string)($w['id'] ?? '');
        $shortDigits = preg_replace('/[^A-Za-z0-9]/', '', $rawId);
        $shortId = 'WIT-' . strtoupper(substr($shortDigits !== '' ? $shortDigits : '0000', -4));

        return [
            'id' => $rawId,
            'short_id' => $shortId,
            'user_id' => $uid,
            'numeric_uid' => $user['numeric_uid'] ?? null,
            'full_name' => $fullName !== '' ? $fullName : ($user['email'] ?? $uid),
            'email' => $user['email'] ?? $uid,
            'kyc_status' => $kycStatus,
            'asset' => $w['asset'] ?? 'USDT',
            'network' => $network,
            'destination_address' => $destAddr,
            'bound_status' => $boundStatus,
            'bound_label' => $boundLabel,
            'amount' => $amount,
            'fee' => (float)($w['fee'] ?? 1.0),
            'net_amount' => (float)($w['net_amount'] ?? $amount),
            'early_deduction' => (float)($w['early_deduction'] ?? 0),
            'is_early_withdrawal' => !empty($w['is_early_withdrawal']) ? 1 : 0,
            'status' => $status,
            'rejection_reason' => $w['rejection_reason'] ?? null,
            'tx_hash' => $w['tx_hash'] ?? null,
            'created_at' => $w['created_at'] ?? gmdate('Y-m-d H:i:s'),
            'updated_at' => $w['updated_at'] ?? gmdate('Y-m-d H:i:s')
        ];
    }, $withdrawals);

    sendSuccess([
        'withdrawals' => $formattedWithdrawals,
        'summary' => [
            'pending_count' => $pendingCount,
            'pending_amount_usdt' => round($pendingAmountUsdt, 2),
            'batch_ready_count' => $batchReadyCount,
            'batch_ready_amount_usdt' => round($batchReadyAmountUsdt, 2),
            'processed_today_count' => $processedTodayCount,
            'processed_today_usdt' => round($processedTodayUsdt, 2)
        ]
    ], 'Withdrawals retrieved successfully from Supabase');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonBody();
    $withId = trim((string)($input['withdrawal_id'] ?? ''));
    $decision = strtoupper(trim((string)($input['decision'] ?? $input['action'] ?? 'APPROVE')));
    $reason = trim((string)($input['reason'] ?? $input['rejection_reason'] ?? ''));
    $txHash = trim((string)($input['tx_hash'] ?? ''));
    if ($txHash === '') $txHash = '0x' . bin2hex(random_bytes(32));

    if ($withId === '' || !preg_match('/^[A-Za-z0-9._:-]{1,128}$/', $withId)) sendError('VALIDATION_ERROR', 'Valid withdrawal_id is required');
    if (!in_array($decision, ['APPROVE', 'REJECT'], true)) sendError('INVALID_DECISION', 'Decision must be APPROVE or REJECT');

    $operatorId = $adminId;

    $rpc = $supabase->rpc('admin_process_withdrawal', [
        'p_withdrawal_id' => $withId,
        'p_decision' => $decision,
        'p_reason' => $reason,
        'p_tx_hash' => $txHash,
        'p_operator_id' => $operatorId
    ]);

    if (!$rpc['success']) {
        $rpcMsg = (string)($rpc['message'] ?? $rpc['error'] ?? '');
        if (stripos($rpcMsg, 'PGRST202') !== false || stripos($rpcMsg, 'admin_process_withdrawal') !== false) {
            sendError('WITHDRAWAL_PROCESS_MIGRATION_REQUIRED', 'Database duplicate-click protection is not installed. Run server/database/migrations/20260930_duplicate_click_protection.sql once in Supabase SQL Editor.', 503);
        }
        sendError('WITHDRAWAL_PROCESS_FAILED', (string)($rpc['message'] ?? $rpc['error'] ?? 'Withdrawal processing failed.'), 502);
    }

    $result = $rpc['data'];
    if (is_array($result) && isset($result[0]) && is_array($result[0])) $result = $result[0];
    if (!is_array($result)) $result = [];
    if (($result['success'] ?? false) === false) {
        sendError(
            (string)($result['error_code'] ?? 'WITHDRAWAL_PROCESS_FAILED'),
            (string)($result['message'] ?? 'Withdrawal processing failed.'),
            400
        );
    }

    $already = !empty($result['already_processed']);
    $status = (string)($result['status'] ?? ($decision === 'APPROVE' ? 'COMPLETED' : 'REJECTED'));
    sendSuccess([
        'withdrawal_id' => $withId,
        'status' => $status,
        'tx_hash' => $result['tx_hash'] ?? $txHash,
        'already_processed' => $already
    ], $already ? 'This withdrawal was already processed once.' : ($decision === 'APPROVE' ? 'Withdrawal approved and dispatched' : 'Withdrawal rejected and refunded'));
}
