<?php
/**
 * Auth Logout - Invalidate Session
 */
require_once dirname(__DIR__) . '/bootstrap.php';

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
