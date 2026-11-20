<?php
// Protected Cron Job: System Cleanup
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

echo "[" . gmdate('Y-m-d H:i:s') . "] Starting System Cleanup...\n";

// Remove expired sessions
$stmt = $db->prepare("DELETE FROM user_sessions WHERE expires_at < datetime('now')");
$stmt->execute();
echo "Cleaned up {$stmt->rowCount()} expired sessions.\n";

// Remove expired idempotency keys
$idemStmt = $db->prepare("DELETE FROM idempotency_keys WHERE expires_at < datetime('now')");
$idemStmt->execute();
echo "Cleaned up {$idemStmt->rowCount()} expired idempotency keys.\n";

echo "Cleanup completed successfully.\n";
