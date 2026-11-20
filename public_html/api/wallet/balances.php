<?php
/**
 * User Wallet Balances - Direct Supabase REST
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = getCurrentUser();
$userId = $user ? $user['id'] : null;

if (!$userId) {
    sendSuccess([
        'total_assets_usdt' => 0.0,
        'total_assets_btc'  => 0.0,
        'breakdown' => [
            'funding_total_usdt'  => 0.0,
            'exchange_total_usdt' => 0.0,
            'trading_total_usdt'  => 0.0
        ],
        'wallets' => []
    ], 'Guest session');
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

$res = $supabase->select('wallet_balances', ['user_id' => "eq.{$userId}"]);
$rows = ($res['success'] && is_array($res['data'])) ? $res['data'] : [];

$funding = 0.0;
$exchange = 0.0;
$trading = 0.0;

foreach ($rows as $row) {
    $val = (float)($row['balance'] ?? 0);
    $wType = strtolower($row['wallet_type'] ?? '');
    if ($wType === 'funding') $funding += $val;
    if ($wType === 'exchange') $exchange += $val;
    if ($wType === 'trading') $trading += $val;
}

$totalUsdt = $funding + $exchange + $trading;
$totalBtc = round($totalUsdt / 64280, 6);

sendSuccess([
    'total_assets_usdt' => round($totalUsdt, 2),
    'total_assets_btc'  => $totalBtc,
    'breakdown' => [
        'funding_total_usdt'  => round($funding, 2),
        'exchange_total_usdt' => round($exchange, 2),
        'trading_total_usdt'  => round($trading, 2)
    ],
    'wallets' => $rows
], 'Balances loaded from Supabase');
