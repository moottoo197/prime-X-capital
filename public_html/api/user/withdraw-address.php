<?php
/**
 * User Bind Withdrawal Address - Pure Supabase REST Architecture
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = getCurrentUser();
if (!$user) {
    sendError('UNAUTHORIZED', 'Authentication required', 401);
}

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
    $input = getJsonBody();
    $asset = strtoupper(trim($input['asset'] ?? 'USDT'));
    $network = strtoupper(trim($input['network'] ?? 'TRC20'));
    $address = trim($input['address'] ?? '');
    $label = trim($input['label'] ?? 'My Wallet');
    $pin = trim($input['withdrawal_pin'] ?? $input['pin'] ?? $input['fund_password'] ?? '');

    if (empty($address)) {
        sendError('VALIDATION_ERROR', 'Destination address is required');
    }

    // Verify fund PIN
    if (empty($pin) || !preg_match('/^\d{6}$/', $pin)) {
        sendError('INVALID_PIN', '6-digit withdrawal PIN is required to bind a withdrawal address');
    }

    // Check user profile PIN
    checkWithdrawalPinRateLimit((string)$user['id']);
    $profRes = $supabase->select('profiles', ['id' => "eq.{$userId}", 'limit' => '1']);
    $prof = ($profRes['success'] && !empty($profRes['data'][0])) ? $profRes['data'][0] : $user;

    $storedPin = $prof['withdrawal_pin'] ?? null;
    $storedHash = $prof['withdrawal_pin_hash'] ?? null;

    $pinMatches = false;
    if (!empty($storedPin) && $storedPin === $pin) {
        $pinMatches = true;
    } elseif (!empty($storedHash) && (password_verify($pin, $storedHash) || $storedHash === $pin)) {
        $pinMatches = true;
    } elseif (empty($storedPin) && empty($storedHash)) {
        // Set PIN if first time
        $pinHash = password_hash($pin, PASSWORD_BCRYPT);
        $supabase->update('profiles', [
            'withdrawal_pin' => $pin,
            'withdrawal_pin_hash' => $pinHash,
            'updated_at' => gmdate('Y-m-d H:i:s')
        ], ['id' => "eq.{$userId}"]);
        $pinMatches = true;
    }

    if (!$pinMatches) {
        recordWithdrawalPinFailure((string)$user['id']);
        sendError('INCORRECT_PIN', 'Incorrect 6-digit withdrawal PIN. Address binding failed.');
    }

    clearWithdrawalPinFailures((string)$user['id']);
    if (!empty($storedPin)) {
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

    @file_put_contents($addressesStoreFile, json_encode($all, JSON_PRETTY_PRINT));

    sendSuccess([
        'address' => $address,
        'network' => $network,
        'asset'   => $asset,
        'label'   => $label
    ], "Withdrawal address for {$asset} ({$network}) bound successfully!");
}
