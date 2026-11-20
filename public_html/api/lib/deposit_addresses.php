<?php
/**
 * Permanent USDT deposit destinations. Supabase system_settings is the source
 * of truth after the first seed; application updates never overwrite existing
 * addresses.
 */
function getPermanentDepositAddresses(SupabaseClient $supabase): array {
    $defaults = [
        'TRC20' => 'TLuCocpgveoDMeyJPTS7hydVg9eSwYzcwE',
        'ERC20' => '0x18a5db369d3c304529fd6c398e66fb7730ff1fd7',
        'BEP20' => '0x18a5db369d3c304529fd6c398e66fb7730ff1fd7'
    ];

    $addresses = $defaults;
    if (!$supabase->isConfigured()) return $addresses;

    $keyMap = [
        'DEPOSIT_ADDRESS_TRC20' => 'TRC20',
        'DEPOSIT_ADDRESS_ERC20' => 'ERC20',
        'DEPOSIT_ADDRESS_BEP20' => 'BEP20'
    ];
    $missing = [];

    try {
        $res = $supabase->select('system_settings', ['order' => 'setting_key.asc']);
        $found = [];
        if ($res['success'] && is_array($res['data'])) {
            foreach ($res['data'] as $row) {
                $key = strtoupper(trim((string)($row['setting_key'] ?? '')));
                if (!isset($keyMap[$key])) continue;
                $value = trim((string)($row['setting_value'] ?? ''));
                if ($value !== '') {
                    $addresses[$keyMap[$key]] = $value;
                    $found[$key] = true;
                }
            }
        }

        foreach ($keyMap as $key => $network) {
            if (empty($found[$key])) {
                $missing[] = [
                    'setting_key' => $key,
                    'setting_value' => $defaults[$network],
                    'description' => "Permanent USDT {$network} deposit address",
                    'updated_at' => gmdate('Y-m-d H:i:s')
                ];
            }
        }
        // Seed only missing keys. Existing Supabase values are never overwritten.
        if ($missing) {
            $supabase->upsert('system_settings', $missing, 'setting_key');
        }
    } catch (Throwable $e) {
        // Keep the known-good defaults if Supabase settings are temporarily unavailable.
    }

    return $addresses;
}
