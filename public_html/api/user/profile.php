<?php
/**
 * User Profile & Country/Region Setting - Direct Supabase REST
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/auth_tokens.php';

$user = requireAuth();

$userId = $user['id'];
$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $res = $supabase->select('profiles', ['id' => "eq.{$userId}", 'limit' => '1']);
    $prof = ($res['success'] && !empty($res['data'][0])) ? $res['data'][0] : $user;
    $prof['has_withdrawal_pin'] = primex_has_withdrawal_pin_resolved($prof, $supabase);
    $prof['email_verified'] = primex_is_email_verified_resolved($prof, $supabase);
    $prof['avatar'] = primex_get_user_avatar($prof);
    unset($prof['withdrawal_pin'], $prof['withdrawal_pin_hash'], $prof['password_hash']);

    sendSuccess(['user' => $prof], 'Profile loaded from Supabase');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonBody();
    $updateData = ['updated_at' => gmdate('Y-m-d H:i:s')];
    $validAvatar = null;
    if (isset($input['first_name'])) { $updateData['first_name'] = trim((string)$input['first_name']); }
    if (isset($input['last_name'])) { $updateData['last_name'] = trim((string)$input['last_name']); }
    if (isset($input['country'])) {
        $updateData['country'] = trim((string)$input['country']);
    }
    if (isset($input['timezone'])) {
        $tz = trim((string)$input['timezone']);
        if (in_array($tz, DateTimeZone::listIdentifiers(), true)) $updateData['timezone'] = $tz;
    }
    if (isset($input['language'])) {
        $updateData['language'] = trim($input['language']);
    }
    if (array_key_exists('avatar', $input)) {
        $validAvatar = primex_validate_avatar_path((string)($input['avatar'] ?? ''));
        if ($validAvatar === null) {
            sendError('VALIDATION_ERROR', 'Invalid avatar selection');
        }
        $updateData['avatar'] = $validAvatar;
        primex_save_user_avatar((string)$userId, $validAvatar, (string)($user['email'] ?? ''));
    }

    if (count($updateData) > 1) {
        $updateRes = $supabase->update('profiles', $updateData, ['id' => "eq.{$userId}"]);
        if (!$updateRes['success']) {
            $msg = strtolower((string)($updateRes['message'] ?? ''));
            foreach (['first_name','last_name','avatar','timezone','language','updated_at'] as $optionalColumn) {
                if (strpos($msg, $optionalColumn) !== false) unset($updateData[$optionalColumn]);
            }
            if (count($updateData) > 1) $supabase->update('profiles', $updateData, ['id' => "eq.{$userId}"]);
        }
    }

    if ($validAvatar !== null) {
        $updateData['avatar'] = $validAvatar;
    }

    sendSuccess($updateData, 'Profile settings updated in Supabase');
}
