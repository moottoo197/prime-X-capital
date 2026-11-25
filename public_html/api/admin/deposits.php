<?php
/**
 * Admin Deposits Management - Direct Supabase REST
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/mailer.php';
require_once dirname(__DIR__) . '/lib/email_templates.php';
require_once dirname(__DIR__) . '/lib/additional_signals.php';

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
            'params' => ['select' => 'id,email,kyc_status,numeric_uid,first_name,last_name']
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

    $totalApprovedUsdt = 0.0;
    $pendingCount = 0;
    $pendingAmountUsdt = 0.0;
    $networksSet = [];

    $formattedDeposits = array_map(function($d) use ($userMap, &$totalApprovedUsdt, &$pendingCount, &$pendingAmountUsdt, &$networksSet) {
        $uid = (string)($d['user_id'] ?? '');
        $user = $userMap[$uid] ?? [];
        $fullName = trim((string)($user['first_name'] ?? '') . ' ' . (string)($user['last_name'] ?? ''));
        $status = strtoupper(trim((string)($d['status'] ?? 'PENDING')));
        $network = strtoupper(trim((string)($d['network'] ?? 'TRC20')));
        $amount = (float)($d['amount'] ?? 0);
        if ($network !== '') $networksSet[$network] = true;
        if (in_array($status, ['COMPLETED', 'APPROVED', 'CONFIRMED'], true)) {
            $totalApprovedUsdt += $amount;
        } elseif (in_array($status, ['PENDING', 'REQUESTED', 'PENDING_REVIEW'], true)) {
            $pendingCount++;
            $pendingAmountUsdt += $amount;
        }
        $rawId = (string)($d['id'] ?? '');
        $shortDigits = preg_replace('/[^A-Za-z0-9]/', '', $rawId);
        $shortId = 'DEP-' . strtoupper(substr($shortDigits !== '' ? $shortDigits : '0000', -4));
        $txHash = (string)($d['tx_hash'] ?? '');
        $proofLabel = !empty($d['proof_filename']) ? (string)$d['proof_filename'] : ($txHash !== '' ? 'receipt_tx_' . substr(preg_replace('/[^A-Za-z0-9]/', '', $txHash), 0, 6) . '.png' : 'vault_receipt.png');

        return [
            'id' => $rawId,
            'short_id' => $shortId,
            'user_id' => $uid,
            'numeric_uid' => $user['numeric_uid'] ?? null,
            'full_name' => $fullName !== '' ? $fullName : ($user['email'] ?? $uid),
            'email' => $user['email'] ?? $uid,
            'kyc_status' => $user['kyc_status'] ?? 'UNKNOWN',
            'asset' => $d['asset'] ?? 'USDT',
            'network' => $network,
            'amount' => $amount,
            'fee' => (float)($d['fee'] ?? 0),
            'net_amount' => (float)($d['net_amount'] ?? $amount),
            'deposit_address' => $d['deposit_address'] ?? '',
            'tx_hash' => $txHash,
            'proof_url' => $d['proof_url'] ?? $d['receipt_url'] ?? '',
            'proof_label' => $proofLabel,
            'status' => $status,
            'rejection_reason' => $d['rejection_reason'] ?? null,
            'created_at' => $d['created_at'] ?? gmdate('Y-m-d H:i:s'),
            'updated_at' => $d['updated_at'] ?? gmdate('Y-m-d H:i:s')
        ];
    }, $deposits);

    sendSuccess([
        'deposits' => $formattedDeposits,
        'summary' => [
            'total_deposits_usdt' => round($totalApprovedUsdt, 2),
            'pending_count' => $pendingCount,
            'pending_amount_usdt' => round($pendingAmountUsdt, 2),
            'active_networks' => array_keys($networksSet) ?: ['TRC20', 'BEP20', 'ERC20']
        ]
    ], 'Deposits retrieved successfully from Supabase');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonBody();
    $depId = trim((string)($input['deposit_id'] ?? ''));
    $decision = strtoupper(trim((string)($input['decision'] ?? $input['action'] ?? 'APPROVE')));
    $reason = trim((string)($input['reason'] ?? $input['rejection_reason'] ?? ''));

    if ($depId === '' || !preg_match('/^[A-Za-z0-9._:-]{1,128}$/', $depId)) sendError('VALIDATION_ERROR', 'Valid deposit_id is required');
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
    $additionalGrantResult = ['credits' => 0, 'depositor_granted' => false, 'inviter_granted' => false];

    if (!$already) {
        try {
            $depLookup = $supabase->select('deposits', [
                'id' => 'eq.' . $depId,
                'select' => 'id,user_id,amount,asset,network',
                'limit' => '1'
            ]);
            $depRow = (!empty($depLookup['success']) && !empty($depLookup['data'][0])) ? $depLookup['data'][0] : null;
            $depUserId = trim((string)($depRow['user_id'] ?? ''));
            $depAmount = (float)($depRow['amount'] ?? 0);

            if ($depUserId !== '' && $decision === 'APPROVE' && $depAmount >= 300.0) {
                $additionalGrantResult = primex_grant_additional_signals_for_deposit($supabase, $depId, $depUserId, $depAmount);
            }

            if ($depUserId !== '') {
                $profLookup = $supabase->select('profiles', [
                    'id' => 'eq.' . $depUserId,
                    'select' => 'id,email,first_name',
                    'limit' => '1'
                ]);
                $profRow = (!empty($profLookup['success']) && !empty($profLookup['data'][0])) ? $profLookup['data'][0] : [];
                $recipientEmail = trim((string)($profRow['email'] ?? ''));
                if ($recipientEmail !== '' && filter_var($recipientEmail, FILTER_VALIDATE_EMAIL)) {
                    $recipientName = trim((string)($profRow['first_name'] ?? ''));
                    $tpl = primex_email_template_deposit_status(
                        $recipientName,
                        $decision,
                        $depAmount,
                        (string)($depRow['asset'] ?? 'USDT'),
                        (string)($depRow['network'] ?? 'TRC20'),
                        $depId,
                        $reason,
                        gmdate('Y-m-d H:i:s') . ' UTC',
                        primex_app_url() . '/?view=wallet'
                    );
                    $mailRes = primex_send_templated_email($recipientEmail, $tpl);
                    if (empty($mailRes['success'])) {
                        primex_record_log('EMAIL', 'ADMIN_DEPOSIT_MAIL_FAILED', (string)($mailRes['message'] ?? 'Mail delivery failed'), [
                            'deposit_id' => $depId,
                            'decision' => $decision
                        ], 'WARN', $depUserId, $recipientEmail);
                    }
                }
            }
        } catch (Throwable $mailErr) {
            primex_record_log('EMAIL', 'ADMIN_DEPOSIT_MAIL_EXCEPTION', $mailErr->getMessage(), [
                'deposit_id' => $depId
            ], 'WARN', $adminId, (string)($admin['email'] ?? ''));
        }
    }

    sendSuccess([
        'deposit_id' => $depId,
        'status' => $status,
        'already_processed' => $already,
        'additional_signals' => $additionalGrantResult
    ], $already ? 'This deposit was already processed once.' : ($decision === 'APPROVE' ? 'Deposit approved and credited to wallet' : 'Deposit marked as REJECTED'));
}
