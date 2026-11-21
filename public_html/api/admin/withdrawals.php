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
            'params' => ['select' => 'id,email,kyc_status']
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

    $formattedWithdrawals = array_map(function($w) use ($userMap) {
        $uid = $w['user_id'] ?? '';
        $user = $userMap[$uid] ?? [];
        return [
            'id' => $w['id'] ?? '',
            'user_id' => $uid,
            'email' => $user['email'] ?? $uid,
            'kyc_status' => $user['kyc_status'] ?? 'UNKNOWN',
            'asset' => $w['asset'] ?? 'USDT',
            'network' => $w['network'] ?? 'TRC20',
            'destination_address' => $w['destination_address'] ?? '',
            'amount' => (float)($w['amount'] ?? 0),
            'fee' => (float)($w['fee'] ?? 1.0),
            'net_amount' => (float)($w['net_amount'] ?? $w['amount'] ?? 0),
            'early_deduction' => (float)($w['early_deduction'] ?? 0),
            'is_early_withdrawal' => !empty($w['is_early_withdrawal']) ? 1 : 0,
            'status' => $w['status'] ?? 'REQUESTED',
            'rejection_reason' => $w['rejection_reason'] ?? null,
            'tx_hash' => $w['tx_hash'] ?? null,
            'created_at' => $w['created_at'] ?? gmdate('Y-m-d H:i:s'),
            'updated_at' => $w['updated_at'] ?? gmdate('Y-m-d H:i:s')
        ];
    }, $withdrawals);

    sendSuccess(['withdrawals' => $formattedWithdrawals], 'Withdrawals retrieved successfully from Supabase');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonBody();
    $withId = trim((string)($input['withdrawal_id'] ?? ''));
    $decision = strtoupper(trim((string)($input['decision'] ?? $input['action'] ?? 'APPROVE')));
    $reason = trim((string)($input['reason'] ?? $input['rejection_reason'] ?? ''));
    $txHash = trim((string)($input['tx_hash'] ?? ''));
    if ($txHash === '') $txHash = '0x' . bin2hex(random_bytes(32));

    if ($withId === '') sendError('VALIDATION_ERROR', 'withdrawal_id is required');
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
