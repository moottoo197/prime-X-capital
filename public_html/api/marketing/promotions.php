<?php
/**
 * Marketing Promotions Management
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$supabase = getSupabaseClient();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $promotions = [];
    if ($supabase->isConfigured()) {
        $res = $supabase->select('marketing_promotions', ['order' => 'created_at.desc']);
        if ($res['success'] && is_array($res['data'])) {
            $promotions = $res['data'];
        }
    }
    sendSuccess(['promotions' => $promotions], 'Promotions loaded');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $admin = requireAdmin();
    $input = getJsonBody();
    $id = 'promo_' . bin2hex(random_bytes(6));
    $payload = [
        'id' => $id,
        'title' => trim($input['title'] ?? 'Campaign'),
        'description' => trim($input['description'] ?? ''),
        'status' => 'ACTIVE',
        'created_at' => gmdate('Y-m-d H:i:s')
    ];
    if ($supabase->isConfigured()) {
        $supabase->insert('marketing_promotions', [$payload]);
    }
    sendSuccess($payload, 'Promotion saved');
}
