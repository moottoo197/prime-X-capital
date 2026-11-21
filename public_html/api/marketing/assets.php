<?php
/**
 * Marketing Assets Management
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$supabase = getSupabaseClient();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $assets = [];
    if ($supabase->isConfigured()) {
        $res = $supabase->select('marketing_assets', ['order' => 'display_order.asc']);
        if ($res['success'] && is_array($res['data'])) {
            $assets = $res['data'];
        }
    }
    sendSuccess(['assets' => $assets], 'Marketing assets loaded');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $admin = requireAdmin();
    if (!$supabase->isConfigured()) {
        sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
    }
    $input = getJsonBody();
    $id = 'asset_' . bin2hex(random_bytes(6));
    $payload = [
        'id' => $id,
        'title' => trim($input['title'] ?? 'Asset'),
        'description' => trim($input['description'] ?? ''),
        'file_path' => trim($input['file_path'] ?? ''),
        'page' => trim($input['page'] ?? 'HOME'),
        'section' => trim($input['section'] ?? 'HERO'),
        'status' => 'ACTIVE',
        'created_at' => gmdate('Y-m-d H:i:s')
    ];
    $insRes = $supabase->insert('marketing_assets', [$payload]);
    if (empty($insRes['success'])) {
        sendError('SUPABASE_INSERT_FAILED', 'Unable to save marketing asset right now.', 502);
    }
    sendSuccess($payload, 'Asset created');
}

sendError('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
