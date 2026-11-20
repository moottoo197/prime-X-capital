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
    if ($supabase->isConfigured()) {
        $supabase->insert('marketing_assets', [$payload]);
    }
    sendSuccess($payload, 'Asset created');
}
