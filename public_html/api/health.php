<?php
/**
 * Minimal public health endpoint. Resilient to transient table check latency.
 */
require_once __DIR__ . '/bootstrap.php';
$supabase = getSupabaseClient();
$configured = $supabase->isConfigured();
$reachable = false;
$httpCode = 0;
$errorCode = null;
$errorMessage = null;
if ($configured) {
    $res = @$supabase->select('profiles', ['select'=>'id','limit'=>'1'], ['Range: 0-0']);
    $reachable = !empty($res['success']);
    if (!$reachable) {
        $httpCode = (int)($res['http_code'] ?? 0);
        $errorCode = $res['error'] ?? 'SUPABASE_UNREACHABLE';
        $errorMessage = $res['message'] ?? 'Unable to query Supabase REST API.';
    }
}
$viewer = getCurrentUser();
$viewerRole = strtoupper(trim((string)($viewer['role'] ?? 'USER')));
$isAdminViewer = $viewer !== null && (
    in_array($viewerRole, ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'KYC_MANAGER'], true)
    || primex_is_admin_email((string)($viewer['email'] ?? ''))
);
$supabaseHost = ($isAdminViewer && $configured) ? (parse_url($supabase->getUrl(), PHP_URL_HOST) ?: '') : null;

if (!$configured || !$reachable) {
    http_response_code(503);
    $degradedData = [
        'status' => 'degraded',
        'database_engine' => 'supabase-rest',
        'persistent_store' => 'supabase',
        'supabase_configured' => $configured,
        'supabase_reachable' => false,
        'timestamp' => gmdate('Y-m-d\TH:i:s\Z')
    ];
    if ($isAdminViewer) {
        $degradedData['supabase_host'] = $supabaseHost;
        $degradedData['supabase_http_code'] = $httpCode;
        $degradedData['supabase_error'] = $errorCode;
    }
    echo json_encode([
        'success' => false,
        'error_code' => !$configured ? 'SUPABASE_CONFIG_MISSING' : 'SERVICE_UNAVAILABLE',
        'message' => $isAdminViewer
            ? (!$configured ? 'Supabase configuration is missing in server/.env.' : ('Supabase REST check failed: ' . $errorMessage))
            : 'Service temporarily unavailable.',
        'data' => $degradedData
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit();
}

$healthyData = [
    'status' => 'healthy',
    'database_engine' => 'supabase-rest',
    'persistent_store' => 'supabase',
    'supabase_configured' => true,
    'supabase_reachable' => true,
    'timestamp' => gmdate('Y-m-d\TH:i:s\Z')
];
if ($isAdminViewer) {
    $healthyData['supabase_host'] = $supabaseHost;
}

sendSuccess($healthyData, 'Service healthy');
