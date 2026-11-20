<?php
/**
 * Auth Logout - Invalidate Session
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$token = extractBearerToken();
if (!empty($token)) {
    $supabase = getSupabaseClient();
    if ($supabase->isConfigured()) {
        $supabase->delete('user_sessions', ['token' => 'eq.' . hash('sha256', $token)]);
    }
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
