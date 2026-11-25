<?php
/**
 * User Withdrawal Info & Fee Policy Status - Pure Supabase REST
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/withdrawal_policy.php';

$user = requireAuth();
$userId = (string)$user['id'];
$supabase = getSupabaseClient();

if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

$previewAmount = isset($_GET['amount']) ? max(0.0, (float)$_GET['amount']) : 0.0;
$policy = primex_compute_withdrawal_policy($supabase, $userId, $previewAmount);

sendSuccess($policy, 'Withdrawal fee policy and account status loaded from Supabase');
