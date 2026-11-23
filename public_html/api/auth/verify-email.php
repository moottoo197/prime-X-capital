<?php
/**
 * Email Verification Endpoint
 * GET  -> non-destructive token check
 * POST -> atomic single-use verification consumption
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/auth_tokens.php';

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Authentication backend is unavailable.', 503);
}

$method = strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET'));

if ($method === 'GET') {
    $token = trim((string)($_GET['token'] ?? ''));
    $row = primex_peek_auth_token($supabase, 'email_verification', $token);
    if (!$row) {
        sendError('INVALID_OR_EXPIRED_TOKEN', 'This verification link is invalid or has expired.', 400);
    }
    sendSuccess(['valid' => true], 'Verification link is valid.');
}

if ($method !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
if (!primex_check_email_rate_limit('verify_email_attempt', $ip, 15, 900, 0)) {
    sendError('RATE_LIMITED', 'Too many verification attempts. Please wait a few minutes before trying again.', 429);
}

$body = getJsonBody();
$rawToken = trim((string)($body['token'] ?? ''));
if (primex_validate_raw_token_format($rawToken) === '') {
    primex_record_email_rate_attempt('verify_email_attempt', $ip, 15, 900);
    sendError('INVALID_OR_EXPIRED_TOKEN', 'This verification link is invalid or has expired.', 400);
}

$consumed = primex_consume_auth_token($supabase, 'email_verification', $rawToken);
if (!$consumed || empty($consumed['user_id'])) {
    primex_record_email_rate_attempt('verify_email_attempt', $ip, 15, 900);
    sendError('INVALID_OR_EXPIRED_TOKEN', 'This verification link is invalid, expired, or has already been used.', 400);
}

$userId = (string)$consumed['user_id'];
$tokenEmail = strtolower(trim((string)($consumed['email'] ?? '')));

$profRes = $supabase->select('profiles', ['id' => 'eq.' . $userId, 'limit' => '1']);
$profile = (!empty($profRes['success']) && !empty($profRes['data'][0])) ? $profRes['data'][0] : null;
if (!$profile) {
    sendError('ACCOUNT_NOT_FOUND', 'Account could not be verified.', 404);
}

$currentEmail = strtolower(trim((string)($profile['email'] ?? '')));
if ($tokenEmail !== '' && $currentEmail !== '' && $tokenEmail !== $currentEmail) {
    sendError('INVALID_OR_EXPIRED_TOKEN', 'This verification link no longer matches your current email address.', 400);
}

$nowIso = gmdate('Y-m-d\TH:i:s\Z');
$upd = $supabase->update('profiles', [
    'email_verified'    => 1,
    'email_verified_at' => $nowIso,
    'updated_at'        => gmdate('Y-m-d H:i:s'),
], ['id' => 'eq.' . $userId]);

if (empty($upd['success'])) {
    $msg = strtolower((string)($upd['message'] ?? ''));
    if (strpos($msg, 'email_verified') !== false) {
        @$supabase->update('profiles', ['updated_at' => gmdate('Y-m-d H:i:s')], ['id' => 'eq.' . $userId]);
    }
}

@$supabase->authAdminUpdateUser($userId, ['email_confirm' => true]);

// Update active file session snapshot if caller has an open session cookie
$sessionToken = extractBearerToken();
if (!empty($sessionToken)) {
    $tokenHash = hash('sha256', $sessionToken);
    $fileSession = primex_file_session_read($tokenHash);
    if (is_array($fileSession) && (string)($fileSession['user_id'] ?? '') === $userId) {
        if (!isset($fileSession['profile_snapshot']) || !is_array($fileSession['profile_snapshot'])) {
            $fileSession['profile_snapshot'] = [];
        }
        $fileSession['profile_snapshot']['email_verified'] = true;
        primex_file_session_write($tokenHash, $fileSession);
    }
}

primex_record_log('AUTH', 'EMAIL_VERIFIED', 'User verified email address', [], 'INFO', $userId, $currentEmail);

sendSuccess([
    'email_verified' => true,
], 'Your email address has been verified.');
