<?php
/**
 * Prime X Capital - Persistent Notification Read State Helper
 *
 * Persists per-user notification read state across browser restarts,
 * logout/login cycles, and devices using Supabase `user_notifications`
 * cursor rows + server atomic file storage + cookies as cache.
 */

if (!function_exists('primex_notif_parse_utc_ts')) {
    function primex_notif_parse_utc_ts(?string $raw): int
    {
        $str = trim((string)($raw ?? ''));
        if ($str === '') return 0;
        if (ctype_digit($str)) return (int)$str;
        // If no timezone indicator (Z, GMT, UTC, or +HH:MM / -HH:MM), treat as UTC
        if (!preg_match('/(Z|GMT|UTC|[+-]\d{2}:?\d{2})$/i', $str)) {
            $ts = strtotime($str . ' UTC');
            if ($ts !== false) return (int)$ts;
        }
        $ts = strtotime($str);
        return $ts !== false ? (int)$ts : 0;
    }
}

if (!function_exists('primex_notif_reads_dir')) {
    function primex_notif_reads_dir(): ?string
    {
        $candidates = [
            dirname(__DIR__, 3) . '/server/storage/notification_reads',
            rtrim(sys_get_temp_dir(), '/\\') . '/primex_notification_reads',
        ];
        foreach ($candidates as $dir) {
            if (!is_dir($dir)) {
                @mkdir($dir, 0750, true);
            }
            if (is_dir($dir) && is_writable($dir)) {
                return $dir;
            }
        }
        return null;
    }
}

if (!function_exists('primex_notif_reads_file_path')) {
    function primex_notif_reads_file_path(string $userId): ?string
    {
        if ($userId === '') return null;
        $dir = primex_notif_reads_dir();
        if ($dir === null) return null;
        return $dir . '/' . hash('sha256', $userId) . '.json';
    }
}

if (!function_exists('primex_notif_cursor_id')) {
    function primex_notif_cursor_id(string $userId): string
    {
        return 'notif_read_cursor_' . substr(hash('sha256', $userId), 0, 24);
    }
}

if (!function_exists('primex_load_notification_read_state')) {
    function primex_load_notification_read_state(SupabaseClient $supabase, string $userId, bool $includeCookies = true): array
    {
        $ids = [];
        $beforeTs = 0;

        // 1. Cookie fallback (useful if current session just wrote it)
        if ($includeCookies) {
            if (!empty($_COOKIE['read_notifications'])) {
                foreach (explode(',', (string)$_COOKIE['read_notifications']) as $cid) {
                    $c = trim($cid);
                    if ($c !== '' && $c !== 'all') $ids[] = $c;
                }
            }
            if (!empty($_COOKIE['read_notifications_before'])) {
                $beforeTs = max($beforeTs, (int)$_COOKIE['read_notifications_before']);
            }
        }

        // 2. Server-side file store
        $file = primex_notif_reads_file_path($userId);
        if ($file !== null && is_file($file)) {
            $raw = @file_get_contents($file);
            if (is_string($raw) && $raw !== '') {
                $decoded = json_decode($raw, true);
                if (is_array($decoded)) {
                    if (is_array($decoded['ids'] ?? null)) {
                        foreach ($decoded['ids'] as $fid) {
                            $c = trim((string)$fid);
                            if ($c !== '' && $c !== 'all') $ids[] = $c;
                        }
                    }
                    $beforeTs = max($beforeTs, (int)($decoded['before_ts'] ?? 0));
                }
            }
        }

        // 3. Supabase persistent cursor row
        if ($userId !== '' && $supabase->isConfigured()) {
            $cursorId = primex_notif_cursor_id($userId);
            $res = $supabase->select('user_notifications', [
                'id' => 'eq.' . $cursorId,
                'user_id' => 'eq.' . $userId,
                'select' => 'message,created_at',
                'limit' => '1'
            ]);
            if (($res['success'] ?? false) && !empty($res['data'][0])) {
                $msg = (string)($res['data'][0]['message'] ?? '');
                $decoded = json_decode($msg, true);
                if (is_array($decoded)) {
                    if (is_array($decoded['ids'] ?? null)) {
                        foreach ($decoded['ids'] as $dbId) {
                            $c = trim((string)$dbId);
                            if ($c !== '' && $c !== 'all') $ids[] = $c;
                        }
                    }
                    $beforeTs = max($beforeTs, (int)($decoded['before_ts'] ?? 0));
                }
            }
        }

        $ids = array_values(array_unique($ids));
        if (count($ids) > 150) {
            $ids = array_slice($ids, -150);
        }

        return [
            'ids' => $ids,
            'before_ts' => $beforeTs
        ];
    }
}

if (!function_exists('primex_save_notification_read_state')) {
    function primex_save_notification_read_state(SupabaseClient $supabase, string $userId, array $newIds, int $newBeforeTs): array
    {
        $current = primex_load_notification_read_state($supabase, $userId, true);
        $mergedIds = array_values(array_unique(array_filter(array_merge(
            $current['ids'] ?? [],
            array_map(static fn($x) => trim((string)$x), $newIds)
        ), static fn($x) => $x !== '' && $x !== 'all')));
        if (count($mergedIds) > 150) {
            $mergedIds = array_slice($mergedIds, -150);
        }
        $mergedBeforeTs = max((int)($current['before_ts'] ?? 0), $newBeforeTs);

        $payload = [
            'ids' => $mergedIds,
            'before_ts' => $mergedBeforeTs,
            'updated_at' => gmdate('Y-m-d\TH:i:s\Z')
        ];

        // 1. Server-side file persistence
        $file = primex_notif_reads_file_path($userId);
        if ($file !== null) {
            @file_put_contents($file, json_encode($payload, JSON_UNESCAPED_SLASHES), LOCK_EX);
        }

        // 2. Supabase persistent cursor row
        if ($userId !== '' && $supabase->isConfigured()) {
            $cursorId = primex_notif_cursor_id($userId);
            $supabase->upsert('user_notifications', [[
                'id' => $cursorId,
                'user_id' => $userId,
                'type' => 'READ_CURSOR',
                'title' => 'Notification Read State',
                'message' => json_encode(['ids' => $mergedIds, 'before_ts' => $mergedBeforeTs], JSON_UNESCAPED_SLASHES),
                'is_read' => 1,
                'created_at' => gmdate('Y-m-d\TH:i:s\Z')
            ]], 'id');
        }

        return [
            'ids' => $mergedIds,
            'before_ts' => $mergedBeforeTs
        ];
    }
}
