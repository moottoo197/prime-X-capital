<?php
/**
 * User Transaction History - Direct Supabase REST
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = getCurrentUser();
if (!$user) {
    sendError('UNAUTHORIZED', 'Authentication required', 401);
}

$userId = $user['id'];
$type = strtoupper(trim($_GET['type'] ?? 'ALL'));
$limit = min(200, max(1, (int)($_GET['limit'] ?? 100)));

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

$deposits = [];
$withdrawals = [];
$signals = [];
$adjustments = [];

if ($type === 'ALL' || $type === 'DEPOSITS') {
    $dRes = $supabase->select('deposits', [
        'user_id' => "eq.{$userId}",
        'order' => 'created_at.desc',
        'limit' => (string)$limit
    ]);
    if ($dRes['success'] && is_array($dRes['data'])) {
        $deposits = array_map(function($d) {
            return array_merge($d, [
                'type' => 'DEPOSIT',
                'transaction_type' => 'DEPOSIT',
                'target_address' => $d['deposit_address'] ?? ''
            ]);
        }, $dRes['data']);
    }
}

if ($type === 'ALL' || $type === 'WITHDRAWALS') {
    $wRes = $supabase->select('withdrawals', [
        'user_id' => "eq.{$userId}",
        'order' => 'created_at.desc',
        'limit' => (string)$limit
    ]);
    if ($wRes['success'] && is_array($wRes['data'])) {
        $withdrawals = array_map(function($w) {
            return array_merge($w, [
                'type' => 'WITHDRAWAL',
                'transaction_type' => 'WITHDRAWAL',
                'target_address' => $w['destination_address'] ?? ''
            ]);
        }, $wRes['data']);
    }
}

if ($type === 'ALL') {
    // Administrative balance adjustments are shown in the user's unified wallet history.
    // This is the same immutable ledger entry written by the admin adjustment endpoint,
    // including the admin-provided reason/description.
    $aRes = $supabase->select('ledger_entries', [
        'user_id' => "eq.{$userId}",
        'entry_type' => 'eq.ADJUSTMENT',
        'order' => 'created_at.desc',
        'limit' => (string)$limit
    ]);
    if ($aRes['success'] && is_array($aRes['data'])) {
        $adjustments = array_map(function($a) {
            $amount = (float)($a['amount'] ?? 0);
            return [
                'id' => $a['id'] ?? '',
                'type' => 'ADJUSTMENT',
                'transaction_type' => 'ADJUSTMENT',
                'asset' => $a['asset'] ?? 'USDT',
                'network' => 'LEDGER',
                'amount' => $amount,
                'fee' => 0,
                'net_amount' => $amount,
                'target_address' => '',
                'status' => 'COMPLETED',
                'description' => $a['description'] ?? 'Administrative Balance Adjustment',
                'reason' => $a['description'] ?? 'Administrative Balance Adjustment',
                'balance_before' => (float)($a['balance_before'] ?? 0),
                'balance_after' => (float)($a['balance_after'] ?? 0),
                'created_at' => $a['created_at'] ?? gmdate('Y-m-d H:i:s'),
                'updated_at' => $a['created_at'] ?? gmdate('Y-m-d H:i:s')
            ];
        }, $aRes['data']);
    }
}

// Ledger fallback: completed financial state changes are also recorded in the
// immutable ledger. Use it as a read-only fallback/completeness source so the
// dashboard still shows approved deposits, withdrawals and signal profit credits
// if a legacy transaction row is missing or a table view is temporarily incomplete.
$ledgerFinancial = [];
if (in_array($type, ['ALL', 'DEPOSITS', 'WITHDRAWALS', 'SIGNALS'], true)) {
    $lRes = $supabase->select('ledger_entries', [
        'user_id' => "eq.{$userId}",
        'entry_type' => 'in.(DEPOSIT,WITHDRAWAL,TRADE_PNL)',
        'order' => 'created_at.desc',
        'limit' => (string)$limit
    ]);
    if ($lRes['success'] && is_array($lRes['data'])) {
        foreach ($lRes['data'] as $entry) {
            $et = strtoupper((string)($entry['entry_type'] ?? ''));
            $mappedType = $et === 'DEPOSIT' ? 'DEPOSIT' : ($et === 'WITHDRAWAL' ? 'WITHDRAWAL' : 'SIGNAL_PROFIT');
            if ($type === 'DEPOSITS' && $mappedType !== 'DEPOSIT') continue;
            if ($type === 'WITHDRAWALS' && $mappedType !== 'WITHDRAWAL') continue;
            if ($type === 'SIGNALS' && $mappedType !== 'SIGNAL_PROFIT') continue;
            if ($mappedType === 'SIGNAL_PROFIT') {
                $ref = (string)($entry['reference_id'] ?? '');
                $desc = (string)($entry['description'] ?? '');
                if (strpos($ref, 'sig_test_') === 0 || preg_match('/(?:signal\s+)?sig_test_[a-z0-9_-]+/i', $desc)) continue;
            }
            $ledgerFinancial[] = [
                'id' => $entry['id'] ?? ('ledger_' . ($entry['reference_id'] ?? uniqid('', true))),
                'type' => $mappedType,
                'transaction_type' => $mappedType,
                'asset' => $entry['asset'] ?? 'USDT',
                'network' => $entry['network'] ?? 'LEDGER',
                'amount' => (float)($entry['amount'] ?? 0),
                'fee' => 0,
                'net_amount' => (float)($entry['amount'] ?? 0),
                'target_address' => $entry['description'] ?? ($entry['reference_id'] ?? ''),
                'status' => 'COMPLETED',
                'description' => $entry['description'] ?? '',
                'reference_id' => $entry['reference_id'] ?? '',
                'created_at' => $entry['created_at'] ?? gmdate('Y-m-d H:i:s'),
                'updated_at' => $entry['created_at'] ?? gmdate('Y-m-d H:i:s'),
                '_source' => 'ledger'
            ];
        }
    }
}

if ($type === 'ALL' || $type === 'SIGNALS') {
    $sRes = $supabase->select('user_signal_executions', [
        'user_id' => "eq.{$userId}",
        'order' => 'executed_at.desc',
        'limit' => (string)$limit
    ]);
    if ($sRes['success'] && is_array($sRes['data'])) {
        $signals = array_map(function($s) {
            // Test signals are never profit transactions.
            $signalId = (string)($s['signal_id'] ?? '');
            if (strpos($signalId, 'sig_test_') === 0) return null;
            return [
                'id' => $s['id'] ?? '',
                'type' => 'SIGNAL_PROFIT',
                'transaction_type' => 'SIGNAL_PROFIT',
                'asset' => 'USDT',
                'network' => 'LEDGER',
                'amount' => (float)($s['profit_amount'] ?? 0),
                'fee' => 0,
                'net_amount' => (float)($s['profit_amount'] ?? 0),
                'target_address' => $s['symbol'] ?? 'TRADE',
                'status' => 'COMPLETED',
                'created_at' => $s['executed_at'] ?? ($s['created_at'] ?? gmdate('Y-m-d H:i:s')),
                'updated_at' => $s['executed_at'] ?? ($s['created_at'] ?? gmdate('Y-m-d H:i:s'))
            ];
        }, $sRes['data']);
        $signals = array_values(array_filter($signals, static fn($row) => is_array($row)));
    }
}

$primary = array_merge($deposits, $withdrawals, $signals, $adjustments);
$seen = [];
foreach ($primary as $row) {
    $key = strtoupper((string)($row['type'] ?? '')) . ':' . (string)($row['id'] ?? '');
    if ($key !== ':') $seen[$key] = true;
    if (!empty($row['reference_id'])) $seen[strtoupper((string)($row['type'] ?? '')) . ':REF:' . (string)$row['reference_id']] = true;
}
foreach ($ledgerFinancial as $row) {
    $key = strtoupper((string)($row['type'] ?? '')) . ':REF:' . (string)($row['reference_id'] ?? '');
    $idKey = strtoupper((string)($row['type'] ?? '')) . ':' . (string)($row['id'] ?? '');
    if (($row['reference_id'] ?? '') !== '' && isset($seen[$key])) continue;
    if (isset($seen[$idKey])) continue;
    $primary[] = $row;
    $seen[$key] = true;
    $seen[$idKey] = true;
}
$combined = $primary;
usort($combined, function ($a, $b) {
    return strcmp($b['created_at'] ?? '', $a['created_at'] ?? '');
});

sendSuccess([
    'history'     => array_slice($combined, 0, $limit),
    'deposits'    => $deposits,
    'withdrawals' => $withdrawals,
    'signals'     => $signals,
    'adjustments' => $adjustments,
    'ledger_financial' => $ledgerFinancial
], 'Transaction history retrieved from Supabase');
