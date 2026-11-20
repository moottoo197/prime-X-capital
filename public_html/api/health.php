<?php
/**
 * Minimal public health endpoint. Does not disclose table names, row counts,
 * schema details, or database errors.
 */
require_once __DIR__ . '/bootstrap.php';
$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) sendError('SERVICE_UNAVAILABLE','Service is not configured.',503);
$res = $supabase->select('profiles', ['select'=>'id','limit'=>'1'], ['Range: 0-0']);
if (!$res['success']) sendError('SERVICE_UNAVAILABLE','Persistent service is temporarily unavailable.',503);
sendSuccess([
    'status' => 'healthy',
    'database_engine' => 'supabase-rest',
    'persistent_store' => 'supabase',
    'supabase_reachable' => true,
    'timestamp' => gmdate('Y-m-d\TH:i:s\Z')
], 'Service healthy');
