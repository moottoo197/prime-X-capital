<?php
/**
 * Mark Notifications as Read
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/notification_reads.php';

$user = requireAuth();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}
$userId = (string)($user['id'] ?? '');
$supabase = getSupabaseClient();

$input = getJsonBody();
$notifId = trim((string)($input['id'] ?? $input['notification_id'] ?? ''));
$markAll = !empty($input['mark_all']) || $notifId === 'all' || $notifId === '';
$idsInput = is_array($input['ids'] ?? null) ? $input['ids'] : [];

$newIds = [];
if ($notifId !== '' && $notifId !== 'all') {
    $newIds[] = $notifId;
}
foreach ($idsInput as $idItem) {
    $cleanId = trim((string)$idItem);
    if ($cleanId !== '' && $cleanId !== 'all') {
        $newIds[] = $cleanId;
    }
}

$reqBefore = (int)($input['before_ts'] ?? 0);
$nextBeforeTs = $markAll ? max($reqBefore, time()) : 0;

$saved = primex_save_notification_read_state($supabase, $userId, $newIds, $nextBeforeTs);

$cookieOpts = [
    'expires' => time() + (365 * 86400),
    'path' => '/',
    'httponly' => false,
    'samesite' => 'Lax',
    'secure' => isHttpsRequest()
];

setcookie('read_notifications', implode(',', array_slice($saved['ids'], -60)), $cookieOpts);

if ($saved['before_ts'] > 0) {
    setcookie('read_notifications_before', (string)$saved['before_ts'], $cookieOpts);
}

sendSuccess([
    'status' => 'MARKED_READ',
    'mark_all' => $markAll,
    'read_count' => count($saved['ids']),
    'read_before_ts' => $saved['before_ts']
], 'Notifications marked as read');
