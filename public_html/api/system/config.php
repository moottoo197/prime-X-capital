<?php
/**
 * Platform System Configuration - Direct API Endpoint
 */
require_once dirname(__DIR__) . '/bootstrap.php';

sendSuccess([
    'environment'     => 'production',
    'platform'        => 'PRIME X CAPITAL Institutional',
    'version'         => '1.0.0',
    'maintenance'     => false,
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
        'marketing'   => true
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
