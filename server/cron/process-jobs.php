<?php
// Protected Cron Job: Process Pending Jobs & Webhooks
if (php_sapi_name() !== 'cli') {
    $token = $_GET['token'] ?? $_SERVER['HTTP_X_CRON_TOKEN'] ?? '';
    $expected = getenv('CRON_SECRET') ?: 'alphavest_secure_cron_token_change_in_production';
    if (empty($token) || !hash_equals($expected, $token)) {
        http_response_code(403);
        die("Forbidden\n");
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

echo "[" . gmdate('Y-m-d H:i:s') . "] Running Background Jobs...\n";

// Process pending deposits (e.g. check blockchain confirmations)
$pendingDeps = $db->query("SELECT * FROM deposits WHERE status = 'PENDING' LIMIT 20")->fetchAll();
foreach ($pendingDeps as $dep) {
    echo "Processing deposit {$dep['id']}...\n";
}

echo "Background jobs processed.\n";
