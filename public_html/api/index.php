<?php
/**
 * Strict API dispatcher.
 * Only known endpoints are routed. Unknown paths return 404 instead of a
 * fabricated success response. Every state-changing endpoint remains behind
 * its own authentication/authorization checks.
 */
require_once __DIR__ . '/bootstrap.php';

$uri = $_SERVER['REQUEST_URI'] ?? '';
$path = parse_url($uri, PHP_URL_PATH) ?: '';
$apiPath = preg_replace('#^.*?/api/#', '', $path);
$apiPath = trim($apiPath, '/');

$routes = [
    'auth/login' => 'auth/login.php', 'auth/register' => 'auth/register.php',
    'auth/me' => 'auth/me.php', 'auth/logout' => 'auth/logout.php', 'auth/csrf' => 'auth/csrf.php',
    'auth/send-signup-code' => 'auth/send-signup-code.php',
    'auth/verify-email' => 'auth/verify-email.php', 'auth/resend-verification' => 'auth/resend-verification.php',
    'auth/forgot-password' => 'auth/forgot-password.php', 'auth/reset-password' => 'auth/reset-password.php',
    'auth/change-password' => 'auth/change-password.php',
    'markets/tickers' => 'markets/tickers.php', 'markets/klines' => 'markets/klines.php',
    'markets/orderbook' => 'markets/orderbook.php',
    'wallet/balances' => 'wallet/balances.php', 'wallet/deposit' => 'wallet/deposit.php',
    'wallet/withdraw' => 'wallet/withdraw.php', 'wallet/withdraw-info' => 'wallet/withdraw-info.php',
    'wallet/transfer' => 'wallet/transfer.php', 'wallet/history' => 'wallet/history.php',
    'wallet/transactions' => 'wallet/transactions.php',
    'signals' => 'signals.php', 'signals/active' => 'signals/active.php',
    'signals/execute' => 'signals/execute.php', 'signals/use' => 'signals/use.php',
    'notifications' => 'notifications.php', 'notifications/read' => 'notifications/read.php',
    'user/profile' => 'user/profile.php', 'user/country' => 'user/country.php',
    'user/update-email' => 'user/update-email.php', 'user/withdraw-address' => 'user/withdraw-address.php',
    'user/withdrawal-pin' => 'user/withdrawal-pin.php', 'user/notifications' => 'user/notifications.php',
    'kyc/upload' => 'kyc/upload.php', 'kyc/submit' => 'kyc/submit.php', 'kyc/file' => 'kyc/file.php',
    'referrals/stats' => 'referrals/stats.php', 'referrals/tree' => 'referrals/tree.php',
    'referrals/claim-stipend' => 'referrals/claim-stipend.php', 'referrals/stipend' => 'referrals/stipend.php',
    'referrals/admin_tree' => 'referrals/admin_tree.php',
    'system/config' => 'system/config.php', 'health' => 'health.php',
    'app/download' => 'app/download.php',
    'marketing/assets' => 'marketing/assets.php', 'marketing/claims' => 'marketing/claims.php',
    'marketing/promotions' => 'marketing/promotions.php', 'marketing/schedules' => 'marketing/schedules.php',
    'admin/overview' => 'admin/overview.php', 'admin/settings' => 'admin/settings.php',
    'admin/deposit-config' => 'admin/deposit-config.php', 'admin/deposits' => 'admin/deposits.php',
    'admin/withdrawals' => 'admin/withdrawals.php', 'admin/adjustments' => 'admin/adjustments.php',
    'admin/signals' => 'admin/signals.php', 'admin/kyc' => 'admin/kyc.php',
    'admin/users' => 'admin/users.php', 'admin/users/reset-password' => 'admin/users/reset-password.php',
    'admin/test-email' => 'admin/test-email.php',
    'support/chat' => 'support/chat.php', 'admin/support' => 'admin/support.php'
];

$key = preg_replace('/\.php$/i', '', $apiPath);
if (isset($routes[$key])) {
    $file = __DIR__ . '/' . $routes[$key];
    if (is_file($file)) { require $file; exit(); }
}

sendError('NOT_FOUND', 'API endpoint not found.', 404);
