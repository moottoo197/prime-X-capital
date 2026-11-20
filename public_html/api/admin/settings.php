<?php
/**
 * Admin System Settings - Pure Supabase system_settings Table & Deposit Sync
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/deposit_addresses.php';

$admin = requireAdmin();

$supabase = getSupabaseClient();
$configFilePath = dirname(__DIR__, 3) . '/server/storage/deposit_config_store.json';

$defaultSettings = [
    'withdrawal_fee' => '1.00',
    'maker_fee' => '0.001',
    'taker_fee' => '0.002',
    'copy_trading_profit_split' => '0.10',
    'min_withdrawal' => '3.00',
    'min_withdrawal_usdt' => '3.00',
    'min_deposit' => '10.00',
    'deposit_min_usdt' => '10.00',
    'system_notice' => 'System operating with zero-trust ledger protection.',
    'hot_wallet_trc20' => 'TLuCocpgveoDMeyJPTS7hydVg9eSwYzcwE',
    'hot_wallet_erc20' => '0x18a5db369d3c304529fd6c398e66fb7730ff1fd7',
    'hot_wallet_bep20' => '0x18a5db369d3c304529fd6c398e66fb7730ff1fd7',
    'maintenance_mode' => '0'
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($supabase->isConfigured()) {
        $res = $supabase->select('system_settings', ['order' => 'setting_key.asc']);
        if ($res['success'] && is_array($res['data'])) {
            foreach ($res['data'] as $r) {
                $k = strtolower($r['setting_key'] ?? '');
                $v = $r['setting_value'] ?? '';
                if (!empty($k)) {
                    $defaultSettings[$k] = $v;
                }
            }
        }
    }

    // Deposit receiving addresses are permanent and are read from Supabase.
    $addresses = getPermanentDepositAddresses($supabase);
    $defaultSettings['hot_wallet_trc20'] = $addresses['TRC20'];
    $defaultSettings['hot_wallet_erc20'] = $addresses['ERC20'];
    $defaultSettings['hot_wallet_bep20'] = $addresses['BEP20'];
    $defaultSettings['trc20_deposit_address'] = $addresses['TRC20'];
    $defaultSettings['erc20_deposit_address'] = $addresses['ERC20'];
    $defaultSettings['bep20_deposit_address'] = $addresses['BEP20'];
    // Minimum withdrawal is a fixed platform rule. Never let an old setting override it.
    $defaultSettings['min_withdrawal'] = '3.00';
    $defaultSettings['min_withdrawal_usdt'] = '3.00';

    sendSuccess(['settings' => $defaultSettings], 'Settings loaded from Supabase');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonBody();
    if (empty($input)) {
        $input = $_POST;
    }

    // Unpack nested 'settings' object if sent by client
    if (isset($input['settings']) && is_array($input['settings'])) {
        $input = array_merge($input, $input['settings']);
    }

    // Minimum withdrawal is permanently 3 USDT. Ignore legacy/admin attempts to change it.
    unset($input['min_withdrawal'], $input['min_withdrawal_usdt'], $input['minimum_withdrawal']);
    $minDep = null;
    if (isset($input['min_deposit']) && is_numeric($input['min_deposit'])) {
        $minDep = (float)$input['min_deposit'];
    } elseif (isset($input['deposit_min_usdt']) && is_numeric($input['deposit_min_usdt'])) {
        $minDep = (float)$input['deposit_min_usdt'];
    } elseif (isset($input['minimum_deposit']) && is_numeric($input['minimum_deposit'])) {
        $minDep = (float)$input['minimum_deposit'];
    }

    // Never persist deposit receiving-address changes. They are permanent.
    unset($input['hot_wallet_trc20'], $input['hot_wallet_erc20'], $input['trc20_deposit_address'], $input['erc20_deposit_address']);

    if ($supabase->isConfigured()) {
        foreach ($input as $k => $v) {
            if (is_array($v) || is_object($v)) continue;
            $valStr = (string)$v;
            $supabase->upsert('system_settings', [[
                'setting_key' => strtoupper($k),
                'setting_value' => $valStr,
                'description' => "Admin configured {$k}",
                'updated_at' => gmdate('Y-m-d H:i:s')
            ]], 'setting_key');
        }

        if ($minDep !== null && $minDep > 0) {
            $supabase->upsert('system_settings', [
                [
                    'setting_key' => 'MIN_DEPOSIT_USDT',
                    'setting_value' => (string)$minDep,
                    'description' => 'Minimum deposit limit in USDT',
                    'updated_at' => gmdate('Y-m-d H:i:s')
                ],
                [
                    'setting_key' => 'deposit_min_usdt',
                    'setting_value' => (string)$minDep,
                    'description' => 'Minimum deposit limit in USDT',
                    'updated_at' => gmdate('Y-m-d H:i:s')
                ]
            ], 'setting_key');

            // Also update deposit_config store
            try {
                $supabase->update('deposit_config', [
                    'min_deposit' => $minDep,
                    'minimum_deposit' => $minDep,
                    'updated_at' => gmdate('Y-m-d H:i:s')
                ], []);
            } catch (Exception $e) {}

            // Update local file cache
            if (file_exists($configFilePath)) {
                $saved = json_decode(@file_get_contents($configFilePath), true);
                if (is_array($saved)) {
                    foreach ($saved as &$netCfg) {
                        $netCfg['min_deposit'] = $minDep;
                        $netCfg['minimum_deposit'] = $minDep;
                    }
                    unset($netCfg);
                    @file_put_contents($configFilePath, json_encode($saved, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
                }
            }
        }
    }

    sendSuccess([
        'min_deposit' => $minDep ?? 10.0,
        'deposit_min_usdt' => $minDep ?? 10.0
    ], 'Platform configuration saved successfully in Supabase');
}
