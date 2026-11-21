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
$supabaseHost = $configured ? (parse_url($supabase->getUrl(), PHP_URL_HOST) ?: '') : '';
if (!$configured || !$reachable) {
    http_response_code(503);
    echo json_encode([
        'success' => false,
        'error_code' => !$configured ? 'SUPABASE_CONFIG_MISSING' : 'SERVICE_UNAVAILABLE',
        'message' => !$configured
            ? 'Supabase configuration is missing in server/.env.'
            : ('Supabase REST check failed: ' . $errorMessage),
        'data' => [
            'status' => 'degraded',
            'database_engine' => 'supabase-rest',
            'persistent_store' => 'supabase',
            'supabase_configured' => $configured,
            'supabase_reachable' => false,
            'supabase_host' => $supabaseHost,
            'supabase_http_code' => $httpCode,
            'supabase_error' => $errorCode,
            'timestamp' => gmdate('Y-m-d\TH:i:s\Z')
        ]
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit();
}

sendSuccess([
    'status' => 'healthy',
    'database_engine' => 'supabase-rest',
    'persistent_store' => 'supabase',
    'supabase_configured' => true,
    'supabase_reachable' => true,
    'supabase_host' => $supabaseHost,
    'timestamp' => gmdate('Y-m-d\TH:i:s\Z')
], 'Service healthy');
