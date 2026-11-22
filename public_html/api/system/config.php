<?php
/**
 * Platform System Configuration - Direct API Endpoint
 * Returns public platform flags (never exposes SMTP or secret credentials).
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$languageEnabled = true;
$maintenanceMode = false;

$supabase = getSupabaseClient();
if ($supabase->isConfigured()) {
    $res = $supabase->select('system_settings', [
        'setting_key' => 'in.(FEATURE_LANGUAGE_ENABLED,MAINTENANCE_MODE)'
    ]);
    if (!empty($res['success']) && is_array($res['data'])) {
        foreach ($res['data'] as $row) {
            $k = strtoupper(trim((string)($row['setting_key'] ?? '')));
            $v = trim((string)($row['setting_value'] ?? ''));
            if ($k === 'FEATURE_LANGUAGE_ENABLED') {
                $languageEnabled = ($v !== '0' && strtolower($v) !== 'false');
            } elseif ($k === 'MAINTENANCE_MODE') {
                $maintenanceMode = ($v === '1' || strtolower($v) === 'true');
            }
        }
    }
}

sendSuccess([
    'environment'     => 'production',
    'platform'        => 'PRIME X CAPITAL Institutional',
    'version'         => '1.0.0',
    'maintenance'     => $maintenanceMode,
    'real_money_mode' => true,
    'database_engine' => 'Supabase REST',
    'features'        => [
        'trading'     => false,
        'signals'     => true,
        'copytrading' => false,
        'custody'     => true,
        'admin'       => true,
        'referrals'   => true,
        'kyc'         => true,
        'marketing'   => true,
        'language'    => $languageEnabled
    ],
    'time_sync'   => [
        'utc_time'    => gmdate('Y-m-d\TH:i:s\Z'),
        'timestamp'   => time()
    ],
    'supabase'    => [
        'connected'   => true,
        'mode'        => 'LIVE'
    ]
], 'System configuration loaded');
