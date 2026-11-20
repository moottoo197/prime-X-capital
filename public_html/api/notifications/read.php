<?php
/**
 * Mark Notifications as Read
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = requireAuth();
$input = getJsonBody();
$notifId = trim((string)($input['id'] ?? $input['notification_id'] ?? ''));
$markAll = !empty($input['mark_all']) || $notifId === 'all' || $notifId === '';
$idsInput = is_array($input['ids'] ?? null) ? $input['ids'] : [];

$existing = !empty($_COOKIE['read_notifications']) ? explode(',', (string)$_COOKIE['read_notifications']) : [];
if ($notifId !== '' && $notifId !== 'all') {
    $existing[] = $notifId;
}
foreach ($idsInput as $idItem) {
    $cleanId = trim((string)$idItem);
    if ($cleanId !== '' && $cleanId !== 'all') {
        $existing[] = $cleanId;
    }
}
$existing = array_values(array_unique(array_filter($existing)));
if (count($existing) > 60) {
    $existing = array_slice($existing, -60);
}

$cookieOpts = [
    'expires' => time() + (30 * 86400),
    'path' => '/',
    'httponly' => false,
    'samesite' => 'Lax'
];

setcookie('read_notifications', implode(',', $existing), $cookieOpts);

if ($markAll) {
    $prevBefore = (int)($_COOKIE['read_notifications_before'] ?? 0);
    $reqBefore = (int)($input['before_ts'] ?? 0);
    $readBeforeTs = max($prevBefore, $reqBefore, time());
    setcookie('read_notifications_before', (string)$readBeforeTs, $cookieOpts);
}

sendSuccess([
    'status' => 'MARKED_READ',
    'mark_all' => $markAll,
    'read_count' => count($existing)
], 'Notifications marked as read');
