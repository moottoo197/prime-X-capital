<?php
/**
 * User Bind Withdrawal Address - Pure Supabase REST Architecture
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = requireAuth();

$userId = $user['id'];
$supabase = getSupabaseClient();
$addressesStoreFile = dirname(__DIR__, 3) . '/server/storage/bound_addresses.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $addresses = [];
    if (file_exists($addressesStoreFile)) {
        $all = json_decode(@file_get_contents($addressesStoreFile), true) ?: [];
        $addresses = $all[$userId] ?? [];
    }
    sendSuccess(['addresses' => $addresses], 'Bound withdrawal addresses loaded');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$supabase->isConfigured()) {
        sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
    }

    $input = getJsonBody();
    $asset = strtoupper(trim($input['asset'] ?? 'USDT'));
    $network = strtoupper(trim($input['network'] ?? 'TRC20'));
    $address = trim($input['address'] ?? '');
    $label = trim((string)($input['label'] ?? 'My Wallet'));
    if ($label === '') {
        $label = 'My Wallet';
    }
    $label = function_exists('mb_substr') ? mb_substr($label, 0, 64) : substr($label, 0, 64);
    $pin = trim($input['withdrawal_pin'] ?? $input['pin'] ?? $input['fund_password'] ?? '');

    if ($asset !== 'USDT') {
        sendError('VALIDATION_ERROR', 'Only USDT withdrawal addresses are supported');
    }
    if (!in_array($network, ['TRC20', 'ERC20', 'BEP20'], true)) {
        sendError('VALIDATION_ERROR', 'Unsupported withdrawal network. Choose TRC20, ERC20, or BEP20.');
    }
    if (empty($address) || strlen($address) < 10 || strlen($address) > 128 || !preg_match('/^[A-Za-z0-9:_-]+$/', $address)) {
        sendError('VALIDATION_ERROR', 'A valid destination wallet address is required');
    }

    // Verify fund PIN
    if (empty($pin) || !preg_match('/^\d{6}$/', $pin)) {
        sendError('INVALID_PIN', '6-digit withdrawal PIN is required to bind a withdrawal address');
    }

    // Check user profile PIN (fail closed if profile query fails)
    checkWithdrawalPinRateLimit((string)$user['id']);
    $profRes = $supabase->select('profiles', ['id' => "eq.{$userId}", 'limit' => '1']);
    if (!$profRes['success'] || empty($profRes['data'][0])) {
        sendError('PROFILE_LOOKUP_FAILED', 'Unable to verify withdrawal PIN right now. Please try again.', 502);
    }
    $prof = $profRes['data'][0];

    $storedPin = (string)($prof['withdrawal_pin'] ?? '');
    $storedHash = (string)($prof['withdrawal_pin_hash'] ?? '');

    $pinMatches = false;
    if ($storedHash !== '' && password_verify($pin, $storedHash)) {
        $pinMatches = true;
    } elseif ($storedPin !== '' && hash_equals($storedPin, $pin)) {
        $pinMatches = true;
    } elseif ($storedPin === '' && $storedHash === '') {
        // Initialize hashed PIN only when profile loaded cleanly and had no PIN configured
        $pinHash = password_hash($pin, PASSWORD_BCRYPT);
        $initRes = $supabase->update('profiles', [
            'withdrawal_pin' => null,
            'withdrawal_pin_hash' => $pinHash,
            'updated_at' => gmdate('Y-m-d H:i:s')
        ], ['id' => "eq.{$userId}"]);
        if (empty($initRes['success'])) {
            sendError('PIN_UPDATE_FAILED', 'Unable to initialize withdrawal PIN. Please try again.', 502);
        }
        $pinMatches = true;
    }

    if (!$pinMatches) {
        recordWithdrawalPinFailure((string)$user['id']);
        sendError('INCORRECT_PIN', 'Incorrect 6-digit withdrawal PIN. Address binding failed.');
    }

    clearWithdrawalPinFailures((string)$user['id']);
    if ($storedPin !== '') {
        $supabase->update('profiles', [
            'withdrawal_pin' => null,
            'withdrawal_pin_hash' => password_hash($pin, PASSWORD_BCRYPT),
            'updated_at' => gmdate('Y-m-d H:i:s')
        ], ['id' => "eq.{$userId}"]);
    }

    // Save bound address
    $addrRecord = [
        'id' => 'waddr_' . bin2hex(random_bytes(8)),
        'user_id' => $userId,
        'asset' => $asset,
        'network' => $network,
        'address' => $address,
        'label' => $label,
        'is_verified' => 1,
        'created_at' => gmdate('Y-m-d H:i:s')
    ];

    $all = file_exists($addressesStoreFile) ? (json_decode(@file_get_contents($addressesStoreFile), true) ?: []) : [];
    if (!isset($all[$userId])) {
        $all[$userId] = [];
    }

    // Replace if same network/asset exists, otherwise append
    $updated = false;
    foreach ($all[$userId] as &$item) {
        if ($item['asset'] === $asset && $item['network'] === $network) {
            $item['address'] = $address;
            $item['label'] = $label;
            $item['updated_at'] = gmdate('Y-m-d H:i:s');
            $updated = true;
            break;
        }
    }
    unset($item);

    if (!$updated) {
        $all[$userId][] = $addrRecord;
    }

    @file_put_contents($addressesStoreFile, json_encode($all, JSON_PRETTY_PRINT), LOCK_EX);

    sendSuccess([
        'address' => $address,
        'network' => $network,
        'asset'   => $asset,
        'label'   => $label
    ], "Withdrawal address for {$asset} ({$network}) bound successfully!");
}

sendError('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
