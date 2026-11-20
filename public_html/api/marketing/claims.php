<?php
/**
 * Marketing Claims & Compliance
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$supabase = getSupabaseClient();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $claims = [];
    if ($supabase->isConfigured()) {
        $res = $supabase->select('marketing_claims', ['order' => 'created_at.desc']);
        if ($res['success'] && is_array($res['data'])) {
            $claims = $res['data'];
        }
    }
    sendSuccess(['claims' => $claims], 'Marketing claims loaded');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $admin = requireAdmin();
    $input = getJsonBody();
    $id = 'claim_' . bin2hex(random_bytes(6));
    $payload = [
        'id' => $id,
        'claim_text' => trim($input['claim_text'] ?? ''),
        'category' => trim($input['category'] ?? 'GENERAL'),
        'risk_level' => trim($input['risk_level'] ?? 'LOW'),
        'approval_status' => 'APPROVED',
        'created_at' => gmdate('Y-m-d H:i:s')
    ];
    if ($supabase->isConfigured()) {
        $supabase->insert('marketing_claims', [$payload]);
    }
    sendSuccess($payload, 'Claim recorded');
}
