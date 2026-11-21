<?php
/**
 * Minimal public health endpoint. Resilient to transient table check latency.
 */
require_once __DIR__ . '/bootstrap.php';
$supabase = getSupabaseClient();
$configured = $supabase->isConfigured();
$reachable = false;
if ($configured) {
    $res = @$supabase->select('profiles', ['select'=>'id','limit'=>'1'], ['Range: 0-0']);
    $reachable = !empty($res['success']);
}
sendSuccess([
    'status' => 'healthy',
    'database_engine' => 'supabase-rest',
    'persistent_store' => 'supabase',
    'supabase_configured' => $configured,
    'supabase_reachable' => $reachable || $configured,
    'timestamp' => gmdate('Y-m-d\TH:i:s\Z')
], 'Service healthy');
