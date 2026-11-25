<?php
/**
 * Admin Deposit Configuration - Supabase system_settings & Resilient Storage
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/deposit_addresses.php';

$admin = requireAdmin();

$supabase = getSupabaseClient();
$configFilePath = dirname(__DIR__, 3) . '/server/storage/deposit_config_store.json';

// Default institutional custody vaults
$defaultConfigs = [
    'TRC20' => [
        'id' => 'dep_cfg_trc20',
        'network' => 'TRC20',
        'asset' => 'USDT',
        'address' => 'TLuCocpgveoDMeyJPTS7hydVg9eSwYzcwE',
        'deposit_address' => 'TLuCocpgveoDMeyJPTS7hydVg9eSwYzcwE',
        'min_deposit' => 100.0,
        'minimum_deposit' => 100.0,
        'confirmations' => 1,
        'instructions' => "Don't send NFTs to this address."
    ],
    'BEP20' => [
        'id' => 'dep_cfg_bep20',
        'network' => 'BEP20',
        'asset' => 'USDT',
        'address' => '0x18a5db369d3c304529fd6c398e66fb7730ff1fd7',
        'deposit_address' => '0x18a5db369d3c304529fd6c398e66fb7730ff1fd7',
        'min_deposit' => 100.0,
        'minimum_deposit' => 100.0,
        'confirmations' => 15,
        'instructions' => "Don't send NFTs to this address."
    ],
    'ERC20' => [
        'id' => 'dep_cfg_erc20',
        'network' => 'ERC20',
        'asset' => 'USDT',
        'address' => '0x18a5db369d3c304529fd6c398e66fb7730ff1fd7',
        'deposit_address' => '0x18a5db369d3c304529fd6c398e66fb7730ff1fd7',
        'min_deposit' => 100.0,
        'minimum_deposit' => 100.0,
        'confirmations' => 12,
        'instructions' => "Don't send NFTs to this address."
    ]
];

// Permanent deposit destinations are stored in Supabase system_settings.
$permanentDepositAddresses = getPermanentDepositAddresses($supabase);

function getDepositEnabled(SupabaseClient $supabase, string $configFilePath): bool {
    $enabled = true;
    if (file_exists($configFilePath)) {
        $saved = json_decode(@file_get_contents($configFilePath), true);
        if (is_array($saved) && array_key_exists('_deposit_enabled', $saved)) {
            $enabled = !in_array(strtolower((string)$saved['_deposit_enabled']), ['0','false','off','no'], true);
        }
    }
    if ($supabase->isConfigured()) {
        try {
            $res = $supabase->select('system_settings', ['order' => 'setting_key.asc']);
            if ($res['success'] && is_array($res['data'])) {
                foreach ($res['data'] as $row) {
                    if (($row['setting_key'] ?? '') === 'DEPOSITS_ENABLED') {
                        $enabled = !in_array(strtolower((string)($row['setting_value'] ?? '1')), ['0','false','off','no'], true);
                        break;
                    }
                }
            }
        } catch (Exception $e) {}
    }
    return $enabled;
}

function saveDepositEnabled(SupabaseClient $supabase, string $configFilePath, bool $enabled): void {
    $saved = [];
    if (file_exists($configFilePath)) {
        $decoded = json_decode(@file_get_contents($configFilePath), true);
        if (is_array($decoded)) $saved = $decoded;
    }
    $saved['_deposit_enabled'] = $enabled ? 1 : 0;
    @file_put_contents($configFilePath, json_encode($saved, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    if ($supabase->isConfigured()) {
        $supabase->upsert('system_settings', [[
            'setting_key' => 'DEPOSITS_ENABLED',
            'setting_value' => $enabled ? '1' : '0',
            'description' => 'Controls whether users can submit new deposits',
            'updated_at' => gmdate('Y-m-d H:i:s')
        ]], 'setting_key');
    }
}

// Helper to load current configs from Supabase system_settings or file
function loadCurrentConfigs(SupabaseClient $supabase, array $defaultConfigs, string $configFilePath): array {
    $permanentDepositAddresses = getPermanentDepositAddresses($supabase);
    $configs = $defaultConfigs;

    // 1. Try to read from local file
    if (file_exists($configFilePath)) {
        $saved = json_decode(@file_get_contents($configFilePath), true);
        if (is_array($saved)) {
            foreach ($saved as $net => $cfg) {
                if (str_starts_with((string)$net, '_') || !is_array($cfg)) continue;
                $configs[strtoupper($net)] = array_merge($configs[strtoupper($net)] ?? [], $cfg);
            }
        }
    }

    // 2. Try to read from Supabase system_settings
    if ($supabase->isConfigured()) {
        try {
            $ssRes = $supabase->select('system_settings', ['order' => 'setting_key.asc']);
            if ($ssRes['success'] && is_array($ssRes['data'])) {
                $minDepFromSS = null;
                foreach ($ssRes['data'] as $s) {
                    $k = $s['setting_key'] ?? '';
                    $v = $s['setting_value'] ?? '';

                    if ($k === 'DEPOSIT_CONFIGS_JSON' && !empty($v)) {
                        $decoded = json_decode($v, true);
                        if (is_array($decoded)) {
                            foreach ($decoded as $net => $cfg) {
                                $configs[strtoupper($net)] = array_merge($configs[strtoupper($net)] ?? [], $cfg);
                            }
                        }
                    }

                    if (in_array($k, ['MIN_DEPOSIT_USDT', 'deposit_min_usdt', 'min_deposit']) && is_numeric($v)) {
                        $minDepFromSS = (float)$v;
                    }

                    if (str_starts_with($k, 'DEPOSIT_ADDRESS_')) {
                        $net = strtoupper(str_replace('DEPOSIT_ADDRESS_', '', $k));
                        if (isset($configs[$net])) {
                            $configs[$net]['address'] = $v;
                            $configs[$net]['deposit_address'] = $v;
                        }
                    }
                }

                if ($minDepFromSS !== null && $minDepFromSS > 0) {
                    foreach ($configs as &$cfg) {
                        $cfg['min_deposit'] = $minDepFromSS;
                        $cfg['minimum_deposit'] = $minDepFromSS;
                    }
                    unset($cfg);
                }
            }
        } catch (Exception $e) {}
    }

    // Always restore the permanent addresses after reading any legacy/configured data.
    foreach ($configs as $net => &$cfg) {
        $net = strtoupper((string)$net);
        if (isset($permanentDepositAddresses[$net])) {
            $cfg['network'] = $net;
            $cfg['asset'] = 'USDT';
            $cfg['address'] = $permanentDepositAddresses[$net];
            $cfg['deposit_address'] = $permanentDepositAddresses[$net];
            $enforcedMin = max(100.0, (float)($cfg['min_deposit'] ?? $cfg['minimum_deposit'] ?? 100.0));
            $cfg['min_deposit'] = $enforcedMin;
            $cfg['minimum_deposit'] = $enforcedMin;
        } else {
            unset($configs[$net]);
        }
    }
    unset($cfg);

    return array_values($configs);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $configsList = loadCurrentConfigs($supabase, $defaultConfigs, $configFilePath);
    sendSuccess([
        'enabled' => getDepositEnabled($supabase, $configFilePath),
        'configs' => $configsList,
        'config' => $configsList,
        'database_engine' => 'supabase-rest'
    ], 'Deposit configurations loaded');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonBody();

    if (($input['action'] ?? '') === 'toggle_status') {
        $enabled = !in_array(strtolower((string)($input['enabled'] ?? '1')), ['0','false','off','no'], true);
        saveDepositEnabled($supabase, $configFilePath, $enabled);
        sendSuccess(['enabled' => $enabled], $enabled ? 'User deposits enabled' : 'User deposits disabled');
    }
    $network = strtoupper(trim($input['network'] ?? 'TRC20'));
    if (!isset($permanentDepositAddresses[$network])) {
        sendError('UNSUPPORTED_DEPOSIT_NETWORK', 'Only USDT TRC20, ERC20, and BEP20 deposit networks are supported.', 400);
    }
    $asset = 'USDT';
    // Ignore any address supplied by the client. The destination is permanent.
    $address = $permanentDepositAddresses[$network];
    $minDeposit = max(100.0, (float)($input['min_deposit'] ?? $input['minimum_deposit'] ?? 100.0));
    $instructions = trim($input['instructions'] ?? "Don't send NFTs to this address.");
    $confirmations = (int)($input['confirmations'] ?? ($network === 'TRC20' ? 1 : 12));

    // Address is always supplied by the permanent address map above.

    // Load existing
    $currentConfigs = [];
    foreach ($defaultConfigs as $net => $cfg) {
        $currentConfigs[$net] = $cfg;
    }
    if (file_exists($configFilePath)) {
        $saved = json_decode(@file_get_contents($configFilePath), true);
        if (is_array($saved)) {
            foreach ($saved as $net => $cfg) {
                if (str_starts_with((string)$net, '_') || !is_array($cfg)) continue;
                $currentConfigs[strtoupper($net)] = $cfg;
            }
        }
    }

    $currentConfigs[$network] = [
        'id' => 'dep_cfg_' . strtolower($network),
        'network' => $network,
        'asset' => $asset,
        'address' => $address,
        'deposit_address' => $address,
        'min_deposit' => $minDeposit,
        'minimum_deposit' => $minDeposit,
        'confirmations' => $confirmations,
        'instructions' => $instructions,
        'updated_at' => gmdate('Y-m-d H:i:s')
    ];

    // If minimum deposit was updated, sync for all networks
    if ($minDeposit > 0) {
        foreach ($currentConfigs as &$c) {
            $c['min_deposit'] = $minDeposit;
            $c['minimum_deposit'] = $minDeposit;
        }
        unset($c);
    }

    // Save to local file cache
    @file_put_contents($configFilePath, json_encode($currentConfigs, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

    // Persist to Supabase system_settings table
    if ($supabase->isConfigured()) {
        try {
            $settingsToSave = [
                [
                    'setting_key' => 'MIN_DEPOSIT_USDT',
                    'setting_value' => (string)$minDeposit,
                    'description' => 'Platform minimum deposit limit in USDT'
                ],
                [
                    'setting_key' => 'deposit_min_usdt',
                    'setting_value' => (string)$minDeposit,
                    'description' => 'Minimum deposit limit in USDT'
                ],
                [
                    'setting_key' => "DEPOSIT_ADDRESS_{$network}",
                    'setting_value' => $address,
                    'description' => "Custody vault address for {$network}"
                ],
                [
                    'setting_key' => 'DEPOSIT_CONFIGS_JSON',
                    'setting_value' => json_encode($currentConfigs),
                    'description' => 'All network deposit configurations'
                ]
            ];

            foreach ($settingsToSave as $setting) {
                $supabase->upsert('system_settings', [$setting], 'setting_key');
            }

            // Also try deposit_config table without crashing if table is not cached
            $supabase->upsert('deposit_config', [$currentConfigs[$network]], 'network');
        } catch (Exception $e) {
            // Graceful capture: settings are already safely preserved in system_settings and local store
        }
    }

    sendSuccess($currentConfigs[$network], "Deposit configuration for {$network} saved successfully");
}
