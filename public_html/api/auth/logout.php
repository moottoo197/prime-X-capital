<?php
/**
 * Auth Logout - Invalidate Session & Mark Presence Offline
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/presence.php';

$currentUser = getCurrentUser();
if ($currentUser) {
    try {
        primex_touch_user_presence(getSupabaseClient(), $currentUser, ['offline' => true]);
    } catch (Throwable $e) {}
}

$token = extractBearerToken();
if (!empty($token)) {
    primex_delete_session_by_token($token);
}

if (!headers_sent()) {
    setcookie('alphavest_session', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => isHttpsRequest()
    ]);
}

sendSuccess([], 'Logged out successfully');
