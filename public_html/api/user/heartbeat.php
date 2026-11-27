<?php
/**
 * User Presence Heartbeat Endpoint
 * Records active view, device telemetry, and clean offline transitions.
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/presence.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$user = getCurrentUser();
if (!$user) {
    sendSuccess(['tracked' => false], 'Guest session');
}

$input = getJsonBody();
$supabase = getSupabaseClient();

$meta = [
    'view' => (string)($input['view'] ?? 'home'),
    'page_title' => (string)($input['page_title'] ?? ''),
    'offline' => !empty($input['offline']),
    'device' => (string)($input['device'] ?? ''),
    'os' => (string)($input['os'] ?? ''),
    'browser' => (string)($input['browser'] ?? '')
];

$presence = primex_touch_user_presence($supabase, $user, $meta);

sendSuccess([
    'tracked' => true,
    'status' => primex_classify_presence_status($presence),
    'current_view' => $presence['current_view'] ?? 'home',
    'last_seen_at' => $presence['last_seen_at'] ?? gmdate('Y-m-d\TH:i:s\Z')
], 'Presence updated');
