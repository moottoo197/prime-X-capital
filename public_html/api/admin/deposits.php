<?php
/**
 * Admin Deposits Management - Direct Supabase REST
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$admin = requireAdmin();
$adminId = (string)($admin['id'] ?? '');
$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Keep the normal recent-deposits query, but also fetch pending rows explicitly.
    // This prevents an older/large deposits ledger from hiding a newly submitted
    // user request simply because it falls outside the recent-row window.
    $batch = $supabase->selectMany([
        'deposits' => [
            'table' => 'deposits',
            'params' => ['select' => '*', 'order' => 'created_at.desc', 'limit' => '2000']
        ],
        'pending_deposits' => [
            'table' => 'deposits',
            'params' => ['select' => '*', 'status' => 'in.(PENDING,REQUESTED,PENDING_REVIEW,pending,requested,pending_review)', 'order' => 'created_at.desc', 'limit' => '2000']
        ],
        'profiles' => [
            'table' => 'profiles',
            'params' => ['select' => 'id,email,kyc_status']
        ]
    ]);
    $depRes = $batch['deposits'] ?? ['success'=>false];
    $pendingRes = $batch['pending_deposits'] ?? ['success'=>false];
    if (!$depRes['success'] && !$pendingRes['success']) {
        sendError('SUPABASE_QUERY_FAILED', 'Failed to retrieve deposits.', 502);
    }
    $deposits = [];
    foreach ([
        $depRes['success'] && is_array($depRes['data'] ?? null) ? $depRes['data'] : [],
        $pendingRes['success'] && is_array($pendingRes['data'] ?? null) ? $pendingRes['data'] : []
    ] as $rows) {
        foreach ($rows as $row) {
            $id = (string)($row['id'] ?? '');
            if ($id === '') continue;
            $deposits[$id] = $row;
        }
    }
    $deposits = array_values($deposits);
    usort($deposits, static function($a, $b) {
        return strcmp((string)($b['created_at'] ?? ''), (string)($a['created_at'] ?? ''));
    });

    // Attach user emails and kyc statuses
    $profRes = $batch['profiles'] ?? ['success'=>false];
    $userMap = [];
    if ($profRes['success'] && is_array($profRes['data'])) {
        foreach ($profRes['data'] as $p) {
            $userMap[$p['id']] = $p;
        }
    }

    $formattedDeposits = array_map(function($d) use ($userMap) {
        $uid = $d['user_id'] ?? '';
        $user = $userMap[$uid] ?? [];
        return [
            'id' => $d['id'] ?? '',
            'user_id' => $uid,
            'email' => $user['email'] ?? $uid,
            'kyc_status' => $user['kyc_status'] ?? 'UNKNOWN',
            'asset' => $d['asset'] ?? 'USDT',
            'network' => $d['network'] ?? 'TRC20',
            'amount' => (float)($d['amount'] ?? 0),
            'fee' => (float)($d['fee'] ?? 0),
            'net_amount' => (float)($d['net_amount'] ?? $d['amount'] ?? 0),
            'deposit_address' => $d['deposit_address'] ?? '',
            'tx_hash' => $d['tx_hash'] ?? '',
            'status' => $d['status'] ?? 'PENDING',
            'rejection_reason' => $d['rejection_reason'] ?? null,
            'created_at' => $d['created_at'] ?? gmdate('Y-m-d H:i:s'),
            'updated_at' => $d['updated_at'] ?? gmdate('Y-m-d H:i:s')
        ];
    }, $deposits);

    sendSuccess(['deposits' => $formattedDeposits], 'Deposits retrieved successfully from Supabase');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonBody();
    $depId = trim((string)($input['deposit_id'] ?? ''));
    $decision = strtoupper(trim((string)($input['decision'] ?? $input['action'] ?? 'APPROVE')));
    $reason = trim((string)($input['reason'] ?? $input['rejection_reason'] ?? ''));

    if ($depId === '') sendError('VALIDATION_ERROR', 'deposit_id is required');
    if (!in_array($decision, ['APPROVE', 'REJECT'], true)) sendError('INVALID_DECISION', 'Decision must be APPROVE or REJECT');

    $operatorId = $adminId;

    $rpc = $supabase->rpc('admin_process_deposit', [
        'p_deposit_id' => $depId,
        'p_decision' => $decision,
        'p_reason' => $reason,
        'p_operator_id' => $operatorId
    ]);

    if (!$rpc['success']) {
        $rpcMsg = (string)($rpc['message'] ?? $rpc['error'] ?? '');
        if (stripos($rpcMsg, 'PGRST202') !== false || stripos($rpcMsg, 'admin_process_deposit') !== false) {
            sendError('DEPOSIT_PROCESS_MIGRATION_REQUIRED', 'Database duplicate-click protection is not installed. Run server/database/migrations/20260930_duplicate_click_protection.sql once in Supabase SQL Editor.', 503);
        }
        sendError('DEPOSIT_PROCESS_FAILED', (string)($rpc['message'] ?? $rpc['error'] ?? 'Deposit processing failed.'), 502);
    }

    $result = $rpc['data'];
    if (is_array($result) && isset($result[0]) && is_array($result[0])) $result = $result[0];
    if (!is_array($result)) $result = [];
    if (($result['success'] ?? false) === false) {
        sendError(
            (string)($result['error_code'] ?? 'DEPOSIT_PROCESS_FAILED'),
            (string)($result['message'] ?? 'Deposit processing failed.'),
            400
        );
    }

    $already = !empty($result['already_processed']);
    $status = (string)($result['status'] ?? ($decision === 'APPROVE' ? 'COMPLETED' : 'REJECTED'));
    sendSuccess([
        'deposit_id' => $depId,
        'status' => $status,
        'already_processed' => $already
    ], $already ? 'This deposit was already processed once.' : ($decision === 'APPROVE' ? 'Deposit approved and credited to wallet' : 'Deposit marked as REJECTED'));
}
