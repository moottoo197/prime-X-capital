<?php
/**
 * Prime X Capital - Authentic Real-Time User Presence & Activity Tracker
 *
 * Tracks live active view, device, OS, browser, IP, country, and last heartbeat
 * using an atomic server-local cache + throttled Supabase system_settings
 * (`user_presence:<user_id>`) so multi-worker deployments always share state.
 */

declare(strict_types=1);

if (!function_exists('primex_presence_storage_path')) {
    function primex_presence_storage_path(): string {
        $candidates = [
            dirname(__DIR__, 3) . '/server/storage',
            dirname(__DIR__, 2) . '/server/storage',
            rtrim(sys_get_temp_dir(), '/\\') . '/primex_presence'
        ];
        foreach ($candidates as $dir) {
            if (!is_dir($dir)) {
                @mkdir($dir, 0750, true);
            }
            if (is_dir($dir) && is_writable($dir)) {
                return $dir . '/user_presence.json';
            }
        }
        return rtrim(sys_get_temp_dir(), '/\\') . '/primex_user_presence.json';
    }
}

if (!function_exists('primex_presence_client_ip')) {
    function primex_presence_client_ip(): string {
        $headers = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
        foreach ($headers as $key) {
            $raw = trim((string)($_SERVER[$key] ?? ''));
            if ($raw === '') continue;
            $parts = explode(',', $raw);
            foreach ($parts as $p) {
                $ip = trim($p);
                if (filter_var($ip, FILTER_VALIDATE_IP)) {
                    return $ip;
                }
            }
        }
        return '';
    }
}

if (!function_exists('primex_presence_parse_ua')) {
    function primex_presence_parse_ua(string $ua): array {
        $uaLow = strtolower($ua);
        $device = 'Desktop';
        if (preg_match('/ipad|tablet|playbook|silk|(android(?!.*mobi))/i', $ua)) {
            $device = 'Tablet';
        } elseif (preg_match('/iphone|ipod|android.*mobile|windows phone|blackberry|iemobile|opera mini|mobile/i', $ua)) {
            $device = 'Mobile';
        }

        $os = 'Unknown';
        if (strpos($uaLow, 'iphone') !== false || strpos($uaLow, 'ipad') !== false || strpos($uaLow, 'ios') !== false) {
            $os = 'iOS';
        } elseif (strpos($uaLow, 'android') !== false) {
            $os = 'Android';
        } elseif (strpos($uaLow, 'windows') !== false) {
            $os = 'Windows';
        } elseif (strpos($uaLow, 'mac os') !== false || strpos($uaLow, 'macintosh') !== false) {
            $os = 'macOS';
        } elseif (strpos($uaLow, 'linux') !== false) {
            $os = 'Linux';
        }

        $browser = 'Browser';
        if (strpos($uaLow, 'edg/') !== false || strpos($uaLow, 'edge/') !== false) {
            $browser = 'Edge';
        } elseif (strpos($uaLow, 'opr/') !== false || strpos($uaLow, 'opera') !== false) {
            $browser = 'Opera';
        } elseif (strpos($uaLow, 'chrome/') !== false || strpos($uaLow, 'crios/') !== false) {
            $browser = 'Chrome';
        } elseif (strpos($uaLow, 'firefox/') !== false || strpos($uaLow, 'fxios/') !== false) {
            $browser = 'Firefox';
        } elseif (strpos($uaLow, 'safari/') !== false) {
            $browser = 'Safari';
        }

        return ['device' => $device, 'os' => $os, 'browser' => $browser];
    }
}

if (!function_exists('primex_presence_read_local_map')) {
    function primex_presence_read_local_map(): array {
        $path = primex_presence_storage_path();
        if (!@is_file($path)) return [];
        $raw = @file_get_contents($path);
        if (!is_string($raw) || trim($raw) === '') return [];
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : [];
    }
}

if (!function_exists('primex_presence_write_local_map')) {
    function primex_presence_write_local_map(array $map): void {
        $path = primex_presence_storage_path();
        $tmp = $path . '.tmp.' . getmypid();
        $json = json_encode($map, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($json === false) return;
        if (@file_put_contents($tmp, $json, LOCK_EX) !== false) {
            @rename($tmp, $path);
        }
    }
}

if (!function_exists('primex_presence_setting_key')) {
    function primex_presence_setting_key(string $userId): string {
        $safe = preg_replace('/[^A-Za-z0-9._:-]/', '_', trim($userId));
        if (strlen($safe) > 100) {
            $safe = substr(hash('sha256', $userId), 0, 48);
        }
        return 'user_presence:' . $safe;
    }
}

if (!function_exists('primex_touch_user_presence')) {
    function primex_touch_user_presence(?SupabaseClient $supabase, array $user, array $meta = []): array {
        $uid = trim((string)($user['id'] ?? ''));
        if ($uid === '' || !empty($user['_admin_preview'])) {
            return [];
        }

        $nowTs = time();
        $nowIso = gmdate('Y-m-d\TH:i:s\Z', $nowTs);
        $isOffline = !empty($meta['offline']);

        $ua = trim((string)($meta['user_agent'] ?? ($_SERVER['HTTP_USER_AGENT'] ?? '')));
        $parsedUa = primex_presence_parse_ua($ua);
        $device = trim((string)($meta['device'] ?? $parsedUa['device']));
        $os = trim((string)($meta['os'] ?? $parsedUa['os']));
        $browser = trim((string)($meta['browser'] ?? $parsedUa['browser']));

        $currentView = strtolower(trim((string)($meta['view'] ?? 'home')));
        $currentView = preg_replace('/[^a-z0-9_-]/', '', $currentView) ?: 'home';
        $pageTitle = substr(trim((string)($meta['page_title'] ?? ucfirst($currentView))), 0, 80);

        $cfCountry = trim((string)($_SERVER['HTTP_CF_IPCOUNTRY'] ?? ''));
        $country = trim((string)($user['country'] ?? ''));
        if ($country === '' && $cfCountry !== '' && strtoupper($cfCountry) !== 'XX') {
            $country = strtoupper($cfCountry);
        }
        $ip = primex_presence_client_ip();

        $map = primex_presence_read_local_map();
        $prev = (isset($map[$uid]) && is_array($map[$uid])) ? $map[$uid] : [];
        $prevTs = (int)($prev['last_seen_ts'] ?? 0);
        $prevView = (string)($prev['current_view'] ?? '');
        $prevOnline = array_key_exists('is_online', $prev) ? (bool)$prev['is_online'] : false;
        $prevDbSyncTs = (int)($prev['_db_sync_ts'] ?? 0);

        // Preserve session start if user remained active within last 30 minutes
        $sessionStartTs = (int)($prev['session_started_ts'] ?? 0);
        if ($sessionStartTs <= 0 || !$prevOnline || ($nowTs - $prevTs) > 1800) {
            $sessionStartTs = $nowTs;
        }

        $record = [
            'user_id' => $uid,
            'email' => (string)($user['email'] ?? ($prev['email'] ?? '')),
            'numeric_uid' => $user['numeric_uid'] ?? ($prev['numeric_uid'] ?? null),
            'current_view' => $currentView,
            'page_title' => $pageTitle,
            'device' => $device ?: 'Desktop',
            'os' => $os ?: 'Unknown',
            'browser' => $browser ?: 'Browser',
            'ip' => $ip !== '' ? $ip : ($prev['ip'] ?? ''),
            'country' => $country !== '' ? $country : ($prev['country'] ?? ''),
            'is_online' => !$isOffline,
            'last_seen_ts' => $nowTs,
            'last_seen_at' => $nowIso,
            'session_started_ts' => $sessionStartTs,
            '_db_sync_ts' => $prevDbSyncTs
        ];

        $shouldSyncDb = $isOffline
            || !$prevOnline
            || $prevView !== $currentView
            || ($nowTs - $prevDbSyncTs) >= 20;

        if ($shouldSyncDb && $supabase && $supabase->isConfigured()) {
            $record['_db_sync_ts'] = $nowTs;
            try {
                $dbPayload = $record;
                unset($dbPayload['_db_sync_ts']);
                $supabase->upsert('system_settings', [[
                    'setting_key' => primex_presence_setting_key($uid),
                    'setting_value' => json_encode($dbPayload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                    'updated_at' => gmdate('Y-m-d H:i:s', $nowTs)
                ]], 'setting_key');
            } catch (Throwable $e) {
                // Keep local presence operational even if remote DB sync fails transiently
            }
        }

        $map[$uid] = $record;
        primex_presence_write_local_map($map);

        return $record;
    }
}

if (!function_exists('primex_read_all_presence')) {
    function primex_read_all_presence(?SupabaseClient $supabase = null, ?array $dbSettingsRows = null): array {
        $merged = [];
        $localMap = primex_presence_read_local_map();
        foreach ($localMap as $uid => $row) {
            if (!is_array($row)) continue;
            $key = trim((string)($row['user_id'] ?? $uid));
            if ($key === '') continue;
            $merged[$key] = $row;
        }

        if ($dbSettingsRows === null && $supabase && $supabase->isConfigured()) {
            $res = $supabase->selectAll('system_settings', [
                'setting_key' => 'like.user_presence:*',
                'select' => 'setting_key,setting_value,updated_at'
            ], 1000);
            $dbSettingsRows = (!empty($res['success']) && is_array($res['data'] ?? null)) ? $res['data'] : [];
        }

        if (is_array($dbSettingsRows)) {
            foreach ($dbSettingsRows as $sr) {
                $sKey = (string)($sr['setting_key'] ?? '');
                if (strpos($sKey, 'user_presence:') !== 0) continue;
                $decoded = json_decode((string)($sr['setting_value'] ?? ''), true);
                if (!is_array($decoded)) continue;
                $uid = trim((string)($decoded['user_id'] ?? substr($sKey, 14)));
                if ($uid === '') continue;
                $dbTs = (int)($decoded['last_seen_ts'] ?? 0);
                $localTs = (int)($merged[$uid]['last_seen_ts'] ?? 0);
                if (!isset($merged[$uid]) || $dbTs >= $localTs) {
                    $merged[$uid] = $decoded;
                }
            }
        }

        return $merged;
    }
}

if (!function_exists('primex_classify_presence_status')) {
    function primex_classify_presence_status(?array $presence, int $nowTs = 0): string {
        if ($nowTs <= 0) $nowTs = time();
        if (!is_array($presence) || empty($presence)) return 'OFFLINE';
        if (array_key_exists('is_online', $presence) && $presence['is_online'] === false) {
            return 'OFFLINE';
        }
        $lastTs = (int)($presence['last_seen_ts'] ?? 0);
        if ($lastTs <= 0) return 'OFFLINE';
        $age = max(0, $nowTs - $lastTs);
        if ($age <= 90) return 'ONLINE';
        if ($age <= 900) return 'IDLE';
        return 'OFFLINE';
    }
}
