<?php
/**
 * Prime X Capital - Persistent Notification Read State Helper
 *
 * Persists per-user notification read state across browser restarts,
 * logout/login cycles, and devices using Supabase `system_settings`
 * cursor records + server atomic file storage + cookies as cache.
 *
 * Never stores cursor payloads inside `user_notifications` so internal
 * read-state JSON never leaks into the user's alert feed or home banner.
 */

if (!function_exists('primex_notif_parse_utc_ts')) {
    function primex_notif_parse_utc_ts(?string $raw): int
    {
        $str = trim((string)($raw ?? ''));
        if ($str === '') return 0;
        if (ctype_digit($str)) return (int)$str;
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

if (!function_exists('primex_notif_setting_key')) {
    function primex_notif_setting_key(string $userId): string
    {
        return 'notif_read_cursor:' . substr(hash('sha256', $userId), 0, 32);
    }
}

if (!function_exists('primex_is_internal_read_cursor_row')) {
    function primex_is_internal_read_cursor_row(array $row): bool
    {
        $type = strtoupper(trim((string)($row['type'] ?? '')));
        $id = trim((string)($row['id'] ?? ''));
        $title = trim((string)($row['title'] ?? ''));
        $msg = trim((string)($row['message'] ?? ''));

        if ($type === 'READ_CURSOR' || strpos($id, 'notif_read_cursor_') === 0 || strpos($id, 'notif_db_notif_read_cursor_') === 0) {
            return true;
        }
        if (strcasecmp($title, 'Notification Read State') === 0) {
            return true;
        }
        if ($msg !== '' && $msg[0] === '{' && strpos($msg, '"before_ts"') !== false && strpos($msg, '"ids"') !== false) {
            return true;
        }
        return false;
    }
}

if (!function_exists('primex_purge_legacy_read_cursor_rows')) {
    function primex_purge_legacy_read_cursor_rows(SupabaseClient $supabase, string $userId): void
    {
        if ($userId === '' || !$supabase->isConfigured()) return;
        try {
            $cursorId = primex_notif_cursor_id($userId);
            $supabase->delete('user_notifications', [
                'id' => 'eq.' . $cursorId,
                'user_id' => 'eq.' . $userId
            ]);
            $supabase->delete('user_notifications', [
                'user_id' => 'eq.' . $userId,
                'type' => 'eq.READ_CURSOR'
            ]);
        } catch (Throwable $e) {}
    }
}

if (!function_exists('primex_load_notification_read_state')) {
    function primex_load_notification_read_state(SupabaseClient $supabase, string $userId, bool $includeCookies = true): array
    {
        $ids = [];
        $beforeTs = 0;

        // 1. Cookie fallback
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

        // 3. Supabase persistent setting_key cursor (preferred clean location)
        if ($userId !== '' && $supabase->isConfigured()) {
            $settingKey = primex_notif_setting_key($userId);
            $resSetting = $supabase->select('system_settings', [
                'setting_key' => 'eq.' . $settingKey,
                'select' => 'setting_value',
                'limit' => '1'
            ]);
            if (($resSetting['success'] ?? false) && !empty($resSetting['data'][0]['setting_value'])) {
                $decoded = json_decode((string)$resSetting['data'][0]['setting_value'], true);
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

            // 4. One-time migration from legacy user_notifications cursor rows, then purge
            $cursorId = primex_notif_cursor_id($userId);
            $resLegacy = $supabase->select('user_notifications', [
                'id' => 'eq.' . $cursorId,
                'user_id' => 'eq.' . $userId,
                'select' => 'id,message',
                'limit' => '1'
            ]);
            if (($resLegacy['success'] ?? false) && !empty($resLegacy['data'][0])) {
                $msg = (string)($resLegacy['data'][0]['message'] ?? '');
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
                $migratedPayload = [
                    'ids' => array_slice(array_values(array_unique($ids)), -150),
                    'before_ts' => $beforeTs,
                    'updated_at' => gmdate('Y-m-d\TH:i:s\Z')
                ];
                $supabase->upsert('system_settings', [[
                    'setting_key' => $settingKey,
                    'setting_value' => json_encode($migratedPayload, JSON_UNESCAPED_SLASHES),
                    'description' => 'Notification read cursor for user ' . substr($userId, 0, 36),
                    'updated_at' => gmdate('Y-m-d H:i:s')
                ]], 'setting_key');
                primex_purge_legacy_read_cursor_rows($supabase, $userId);
            }
        }

        $ids = array_values(array_unique(array_filter($ids, static function ($id) {
            return $id !== '' && $id !== 'all'
                && strpos($id, 'notif_read_cursor_') !== 0
                && strpos($id, 'notif_db_notif_read_cursor_') !== 0;
        })));
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
        ), static fn($x) => $x !== '' && $x !== 'all'
            && strpos($x, 'notif_read_cursor_') !== 0
            && strpos($x, 'notif_db_notif_read_cursor_') !== 0)));
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

        // 2. Supabase persistent cursor inside `system_settings` (never `user_notifications`)
        if ($userId !== '' && $supabase->isConfigured()) {
            $settingKey = primex_notif_setting_key($userId);
            $supabase->upsert('system_settings', [[
                'setting_key' => $settingKey,
                'setting_value' => json_encode($payload, JSON_UNESCAPED_SLASHES),
                'description' => 'Notification read cursor for user ' . substr($userId, 0, 36),
                'updated_at' => gmdate('Y-m-d H:i:s')
            ]], 'setting_key');
            primex_purge_legacy_read_cursor_rows($supabase, $userId);
        }

        return [
            'ids' => $mergedIds,
            'before_ts' => $mergedBeforeTs
        ];
    }
}
