<?php
/**
 * User Wallet Balances - Direct Supabase REST
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/wallet_breakdown.php';

$user = getCurrentUser();
$userId = $user ? (string)$user['id'] : null;

if (!$userId) {
    sendSuccess([
        'total_assets_usdt' => 0.0,
        'total_assets_btc'  => 0.0,
        'spot_total_usdt' => 0.0,
        'future_total_usdt' => 0.0,
        'deposit_balance_usdt' => 0.0,
        'deposit_bonus_usdt' => 0.0,
        'referral_bonus_usdt' => 0.0,
        'transferable_spot_usdt' => 0.0,
        'locked_referral_spot_usdt' => 0.0,
        'breakdown' => [
            'funding_total_usdt'  => 0.0,
            'exchange_total_usdt' => 0.0,
            'trading_total_usdt'  => 0.0,
            'spot_total_usdt' => 0.0,
            'future_total_usdt' => 0.0,
            'deposit_balance_usdt' => 0.0,
            'deposit_bonus_usdt' => 0.0,
            'referral_bonus_usdt' => 0.0,
            'transferable_spot_usdt' => 0.0,
            'locked_referral_spot_usdt' => 0.0,
            'funded_deposit_principal_usdt' => 0.0
        ],
        'wallets' => []
    ], 'Guest session');
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

$summary = primex_compute_wallet_breakdown($supabase, $userId);
sendSuccess($summary, 'Balances loaded from Supabase');
