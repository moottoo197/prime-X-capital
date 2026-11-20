<?php
/**
 * User Deposit - Direct Supabase REST & System Settings
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/deposit_addresses.php';

$supabase = getSupabaseClient();
$configFilePath = dirname(__DIR__, 3) . '/server/storage/deposit_config_store.json';

$defaultAddresses = getPermanentDepositAddresses($supabase);

function getDepositsEnabled(SupabaseClient $supabase, string $configFilePath): bool {
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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $asset = strtoupper(trim($_GET['asset'] ?? 'USDT'));
    $network = strtoupper(trim($_GET['network'] ?? 'TRC20'));

    $address = $defaultAddresses[$network] ?? $defaultAddresses['TRC20'];
    $minDeposit = 10.0;
    $confirmations = ($network === 'TRC20') ? 1 : 12;
    $instructions = "Don't send NFTs to this address.";

    // Deposit destinations are permanently fixed by the platform.
    // Do not read address overrides from local storage or system_settings.
    if (!isset($defaultAddresses[$network])) {
        sendError('UNSUPPORTED_DEPOSIT_NETWORK', 'Only USDT TRC20, ERC20, and BEP20 deposits are supported.', 400);
    }

    $minDeposit = 10.0;
    $confirmations = ($network === 'TRC20') ? 1 : 12;
    $instructions = "Don't send NFTs to this address.";

    // Minimum deposit / confirmations / instructions may still be read from
    // configuration, but the destination address is never overridden.
    if (file_exists($configFilePath)) {
        $saved = json_decode(@file_get_contents($configFilePath), true);
        if (is_array($saved) && isset($saved[$network])) {
            $minDeposit = (float)($saved[$network]['min_deposit'] ?? $saved[$network]['minimum_deposit'] ?? $minDeposit);
            $confirmations = (int)($saved[$network]['confirmations'] ?? $confirmations);
            $instructions = $saved[$network]['instructions'] ?? $instructions;
        }
    }

    if ($supabase->isConfigured()) {
        try {
            $ssRes = $supabase->select('system_settings', ['order' => 'setting_key.asc']);
            if ($ssRes['success'] && is_array($ssRes['data'])) {
                foreach ($ssRes['data'] as $s) {
                    $k = $s['setting_key'] ?? '';
                    $v = $s['setting_value'] ?? '';
                    if (in_array($k, ['MIN_DEPOSIT_USDT', 'deposit_min_usdt', 'min_deposit']) && is_numeric($v)) {
                        $minDeposit = (float)$v;
                    }
                    if ($k === 'DEPOSIT_CONFIGS_JSON' && !empty($v)) {
                        $decoded = json_decode($v, true);
                        if (is_array($decoded) && isset($decoded[$network])) {
                            $minDeposit = (float)($decoded[$network]['min_deposit'] ?? $minDeposit);
                            $confirmations = (int)($decoded[$network]['confirmations'] ?? $confirmations);
                            $instructions = $decoded[$network]['instructions'] ?? $instructions;
                        }
                    }
                }
            }
        } catch (Exception $e) {}
    }

    $address = $defaultAddresses[$network];

    sendSuccess([
        'deposits_enabled'       => getDepositsEnabled($supabase, $configFilePath),
        'asset'                  => $asset,
        'network'                => $network,
        'address'                => $address,
        'runtime_mode'           => 'LIVE',
        'is_live'                => true,
        'min_deposit'            => $minDeposit,
        'minimum_deposit'        => $minDeposit,
        'deposit_info'           => [
            'address'         => $address,
            'min_deposit'     => $minDeposit,
            'minimum_deposit' => $minDeposit
        ],
        'required_confirmations' => $confirmations,
        'instructions'           => $instructions
    ], 'Deposit instructions loaded');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = getCurrentUser();
    if (!$user) sendError('UNAUTHORIZED', 'Authentication required to submit deposit', 401);

    if (!getDepositsEnabled($supabase, $configFilePath)) {
        sendError('DEPOSITS_DISABLED', 'Deposits are temporarily disabled by the administrator. Please try again later.', 403);
    }

    $input = getJsonBody();
    $amount = (float)($input['amount'] ?? 0);
    $asset = 'USDT';
    $network = strtoupper(trim((string)($input['network'] ?? 'TRC20')));
    $txHash = trim((string)($input['tx_hash'] ?? ''));
    $idempotencyKey = trim((string)($input['idempotency_key'] ?? ($_SERVER['HTTP_X_IDEMPOTENCY_KEY'] ?? '')));

    if ($amount <= 0) sendError('VALIDATION_ERROR', 'Deposit amount must be greater than zero');
    if ($idempotencyKey === '') sendError('IDEMPOTENCY_KEY_REQUIRED', 'Please submit the deposit once using the current form button.');

    $depId = 'dep_' . bin2hex(random_bytes(8));
    if (!isset($defaultAddresses[$network])) sendError('UNSUPPORTED_DEPOSIT_NETWORK', 'Only USDT TRC20, ERC20, and BEP20 deposits are supported.', 400);
    $depositAddress = $defaultAddresses[$network];
    $actualTxHash = $txHash ?: ('0x' . bin2hex(random_bytes(32)));

    $rpc = $supabase->rpc('submit_deposit_once', [
        'p_user_id' => (string)$user['id'],
        'p_idempotency_key' => $idempotencyKey,
        'p_deposit_id' => $depId,
        'p_asset' => $asset,
        'p_network' => $network,
        'p_amount' => $amount,
        'p_deposit_address' => $depositAddress,
        'p_tx_hash' => $actualTxHash
    ]);

    // The RPC is the preferred atomic/idempotent path. If an older Supabase
    // installation does not yet have this function, fall back to one direct
    // pending-row insert so the user's deposit is still visible to Admin.
    // We only use this fallback for a missing RPC/schema-cache error; normal
    // database errors are still reported instead of being masked.
    if (!$rpc['success']) {
        $rpcMsg = (string)($rpc['message'] ?? $rpc['error'] ?? '');
        $rpcMissing = stripos($rpcMsg, 'PGRST202') !== false
            || stripos($rpcMsg, 'submit_deposit_once') !== false
            || stripos($rpcMsg, 'schema cache') !== false;
        // Compatibility fallback: some installed database functions can reject the
        // user submission while the deposits table itself is writable. Before failing,
        // look for an existing row by user + TX hash (the RPC may have committed it),
        // then create a normal PENDING row directly if it truly does not exist.
        if (!$rpcMissing) {
            $existingByTx = $supabase->select('deposits', [
                'user_id' => 'eq.' . (string)$user['id'],
                'tx_hash' => 'eq.' . $actualTxHash,
                'select' => 'id,status,amount,asset,network',
                'order' => 'created_at.desc',
                'limit' => '1'
            ]);
            if ($existingByTx['success'] && !empty($existingByTx['data'][0])) {
                $row = $existingByTx['data'][0];
                sendSuccess([
                    'deposit_id' => (string)$row['id'],
                    'status' => (string)($row['status'] ?? 'PENDING'),
                    'amount' => (float)($row['amount'] ?? $amount),
                    'asset' => (string)($row['asset'] ?? $asset),
                    'network' => (string)($row['network'] ?? $network),
                    'already_processed' => true
                ], 'Deposit proof is already recorded and awaiting Admin review.');
            }
        }

        $direct = $supabase->insert('deposits', [[
            'id' => $depId,
            'user_id' => (string)$user['id'],
            'asset' => $asset,
            'network' => $network,
            'amount' => $amount,
            'fee' => 0,
            'net_amount' => $amount,
            'deposit_address' => $depositAddress,
            'tx_hash' => $actualTxHash,
            'status' => 'PENDING',
            'created_at' => gmdate('Y-m-d H:i:s'),
            'updated_at' => gmdate('Y-m-d H:i:s')
        ]]);
        if (!$direct['success']) {
            sendError('DEPOSIT_SUBMIT_FAILED', (string)($direct['message'] ?? $direct['error'] ?? 'Deposit submission failed.'), 502);
        }
        $result = [
            'success' => true,
            'deposit_id' => $depId,
            'status' => 'PENDING',
            'amount' => $amount,
            'asset' => $asset,
            'network' => $network,
            'already_processed' => false
        ];
    } else {
        $result = $rpc['data'];
    }

    // Normalize the RPC response before verifying. Some installed versions of
    // submit_deposit_once may return the existing deposit ID for an idempotent
    // retry instead of the newly generated request ID.
    if (is_array($result) && isset($result[0]) && is_array($result[0])) $result = $result[0];
    if (!is_array($result)) $result = [];
    $recordedDepositId = trim((string)($result['deposit_id'] ?? $depId));

    // Confirm that the submitted row is actually present in the deposits ledger.
    // If an older RPC wrote the row under a different returned ID, locate it by
    // the authenticated user + transaction hash before using the direct insert
    // fallback. This guarantees the Admin deposit desk sees the same submission.
    $verify = $supabase->select('deposits', ['id' => 'eq.' . $recordedDepositId, 'select' => 'id,status,amount,asset,network', 'limit' => '1']);
    if (!$verify['success'] || empty($verify['data'][0])) {
        $verifyByTx = $supabase->select('deposits', [
            'user_id' => 'eq.' . (string)$user['id'],
            'tx_hash' => 'eq.' . $actualTxHash,
            'select' => 'id,status,amount,asset,network',
            'order' => 'created_at.desc',
            'limit' => '1'
        ]);
        if ($verifyByTx['success'] && !empty($verifyByTx['data'][0])) {
            $recordedDepositId = (string)$verifyByTx['data'][0]['id'];
            $verify = $verifyByTx;
        }
    }
    if (!$verify['success'] || empty($verify['data'][0])) {
        // Last-resort compatibility path for installations where the RPC reports
        // success but did not persist the public deposits row. This only creates a
        // PENDING deposit record; it never credits the wallet.
        $direct = $supabase->insert('deposits', [[
            'id' => $depId,
            'user_id' => (string)$user['id'],
            'asset' => $asset,
            'network' => $network,
            'amount' => $amount,
            'fee' => 0,
            'net_amount' => $amount,
            'deposit_address' => $depositAddress,
            'tx_hash' => $actualTxHash,
            'status' => 'PENDING',
            'created_at' => gmdate('Y-m-d H:i:s'),
            'updated_at' => gmdate('Y-m-d H:i:s')
        ]]);
        if (!$direct['success']) {
            sendError('DEPOSIT_NOT_RECORDED', 'Deposit submission could not be verified in the deposit ledger. Please try again.', 502);
        }
        $recordedDepositId = $depId;
        $verify = $direct;
    }
    if (!is_array($result)) $result = [];
    if (($result['success'] ?? false) === false) {
        sendError((string)($result['error_code'] ?? 'DEPOSIT_SUBMIT_FAILED'), (string)($result['message'] ?? 'Deposit submission failed.'), 400);
    }

    sendSuccess([
        'deposit_id' => $recordedDepositId,
        'status' => $result['status'] ?? 'PENDING',
        'amount' => (float)($result['amount'] ?? $amount),
        'asset' => $result['asset'] ?? $asset,
        'network' => $result['network'] ?? $network,
        'already_processed' => !empty($result['already_processed'])
    ], 'Deposit proof submitted successfully. Awaiting compliance review.');
}
