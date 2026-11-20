<?php
// Protected Cron Job: Financial Ledger Reconciliation
if (php_sapi_name() !== 'cli') {
    $token = $_GET['token'] ?? $_SERVER['HTTP_X_CRON_TOKEN'] ?? '';
    $expected = getenv('CRON_SECRET') ?: 'alphavest_secure_cron_token_change_in_production';
    if (empty($token) || !hash_equals($expected, $token)) {
        http_response_code(403);
        die("Forbidden: Invalid cron authorization token\n");
    }
}

$bootstrapCandidates = [
    dirname(__DIR__, 2) . '/public_html/api/bootstrap.php',
    __DIR__ . '/../public_html/api/bootstrap.php',
    __DIR__ . '/../htdocs/api/bootstrap.php',
    dirname(__DIR__, 2) . '/htdocs/api/bootstrap.php',
    __DIR__ . '/../api/bootstrap.php',
];
$bootstrapped = false;
foreach ($bootstrapCandidates as $candidate) {
    if (file_exists($candidate)) {
        require_once $candidate;
        $bootstrapped = true;
        break;
    }
}
if (!$bootstrapped) {
    die("Error: Could not locate api/bootstrap.php\n");
}

echo "[" . gmdate('Y-m-d H:i:s') . "] Starting Accounting Ledger Reconciliation...\n";

// Query sum of ledger entries vs recorded balances
$sql = "
    SELECT 
        wb.user_id, wb.wallet_type, wb.asset, wb.balance as cached_balance,
        COALESCE(SUM(le.amount), 0) as ledger_calculated_balance
    FROM wallet_balances wb
    LEFT JOIN ledger_entries le ON wb.user_id = le.user_id 
        AND wb.wallet_type = le.wallet_type 
        AND wb.asset = le.asset
    GROUP BY wb.user_id, wb.wallet_type, wb.asset, wb.balance
";

$stmt = $db->query($sql);
$discrepancies = 0;
$checked = 0;

while ($row = $stmt->fetch()) {
    $checked++;
    $cached = round((float)$row['cached_balance'], 8);
    $calculated = round((float)$row['ledger_calculated_balance'], 8);

    if (abs($cached - $calculated) > 0.00000001) {
        $discrepancies++;
        echo "ALERT! Ledger mismatch for User: {$row['user_id']} ({$row['wallet_type']}-{$row['asset']}). Cached: {$cached}, Calculated: {$calculated}\n";
    }
}

echo "Reconciliation completed. Checked {$checked} wallets. Discrepancies found: {$discrepancies}.\n";
