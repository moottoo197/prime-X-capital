<?php
/**
 * Prime X Capital - Secure Auth Token & Email Rate-Limit Engine
 *
 * Generates cryptographically secure single-use tokens for email verification
 * and password reset. Stores only SHA-256 hashes (never raw tokens) in
 * Supabase with atomic single-use consumption and server-only fallback storage.
 */

declare(strict_types=1);

if (!function_exists('primex_hash_password')) {
    function primex_hash_password(string $password): string {
        if (defined('PASSWORD_ARGON2ID')) {
            $hashed = @password_hash($password, PASSWORD_ARGON2ID);
            if (is_string($hashed) && $hashed !== '') {
                return $hashed;
            }
        }
        return password_hash($password, PASSWORD_BCRYPT);
    }
}

if (!function_exists('primex_token_table_for_type')) {
    function primex_token_table_for_type(string $type): ?string {
        if ($type === 'email_verification') {
            return 'email_verification_tokens';
        }
        if ($type === 'password_reset') {
            return 'password_reset_tokens';
        }
        return null;
    }
}

if (!function_exists('primex_email_tokens_dir')) {
    function primex_email_tokens_dir(): ?string {
        $candidates = [
            dirname(__DIR__, 3) . '/server/storage/email_tokens',
            rtrim(sys_get_temp_dir(), '/\\') . '/primex_email_tokens',
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

if (!function_exists('primex_file_token_path')) {
    function primex_file_token_path(string $type, string $tokenHash): ?string {
        $safeType = preg_replace('/[^a-z_]/', '', $type);
        $safeHash = preg_replace('/[^a-f0-9]/i', '', $tokenHash);
        if ($safeType === '' || strlen($safeHash) !== 64) {
            return null;
        }
        $dir = primex_email_tokens_dir();
        return $dir !== null ? ($dir . '/' . $safeType . '_' . strtolower($safeHash) . '.json') : null;
    }
}

if (!function_exists('primex_invalidate_file_tokens')) {
    function primex_invalidate_file_tokens(string $type, string $userId, string $nowIso): void {
        $dir = primex_email_tokens_dir();
        if ($dir === null) {
            return;
        }
        $safeType = preg_replace('/[^a-z_]/', '', $type);
        $files = @glob($dir . '/' . $safeType . '_*.json');
        if (!is_array($files)) {
            return;
        }
        foreach ($files as $file) {
            $raw = @file_get_contents($file);
            if ($raw === false || $raw === '') {
                continue;
            }
            $row = json_decode($raw, true);
            if (is_array($row) && (string)($row['user_id'] ?? '') === $userId && empty($row['used_at'])) {
                $row['used_at'] = $nowIso;
                @file_put_contents($file, json_encode($row, JSON_UNESCAPED_SLASHES), LOCK_EX);
            }
        }
    }
}

if (!function_exists('primex_issue_auth_token')) {
    function primex_issue_auth_token(
        SupabaseClient $supabase,
        string $type,
        string $userId,
        string $email,
        int $ttlSeconds
    ): array {
        $table = primex_token_table_for_type($type);
        if ($table === null || $userId === '' || $email === '') {
            return ['success' => false, 'token' => '', 'expires_at' => ''];
        }

        $rawToken = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $rawToken);
        $nowIso = gmdate('Y-m-d\TH:i:s\Z');
        $expiresIso = gmdate('Y-m-d\TH:i:s\Z', time() + max(60, $ttlSeconds));
        $recordId = function_exists('primex_uuid_v4') ? primex_uuid_v4() : bin2hex(random_bytes(16));

        $payload = [
            'id'         => $recordId,
            'user_id'    => $userId,
            'email'      => strtolower(trim($email)),
            'token_hash' => $tokenHash,
            'expires_at' => $expiresIso,
            'used_at'    => null,
            'created_at' => $nowIso,
        ];

        $storedInDb = false;
        if ($supabase->isConfigured()) {
            // Invalidate any older unused tokens for this user first
            @$supabase->update($table, ['used_at' => $nowIso], [
                'user_id' => 'eq.' . $userId,
                'used_at' => 'is.null',
            ]);
            $ins = $supabase->insert($table, [$payload]);
            if (!empty($ins['success'])) {
                $storedInDb = true;
            }
        }

        if (!$storedInDb) {
            primex_invalidate_file_tokens($type, $userId, $nowIso);
            $path = primex_file_token_path($type, $tokenHash);
            if ($path === null) {
                return ['success' => false, 'token' => '', 'expires_at' => ''];
            }
            $encoded = json_encode($payload, JSON_UNESCAPED_SLASHES);
            if ($encoded === false || @file_put_contents($path, $encoded, LOCK_EX) === false) {
                return ['success' => false, 'token' => '', 'expires_at' => ''];
            }
            @chmod($path, 0600);
        }

        return [
            'success'    => true,
            'token'      => $rawToken,
            'expires_at' => $expiresIso,
        ];
    }
}

if (!function_exists('primex_validate_raw_token_format')) {
    function primex_validate_raw_token_format(string $rawToken): string {
        $trimmed = trim($rawToken);
        return preg_match('/^[a-f0-9]{64}$/i', $trimmed) ? strtolower($trimmed) : '';
    }
}

if (!function_exists('primex_peek_auth_token')) {
    function primex_peek_auth_token(SupabaseClient $supabase, string $type, string $rawToken): ?array {
        $table = primex_token_table_for_type($type);
        $cleanToken = primex_validate_raw_token_format($rawToken);
        if ($table === null || $cleanToken === '') {
            return null;
        }
        $tokenHash = hash('sha256', $cleanToken);

        $row = null;
        if ($supabase->isConfigured()) {
            $res = $supabase->select($table, [
                'token_hash' => 'eq.' . $tokenHash,
                'limit'      => '1',
            ]);
            if (!empty($res['success']) && !empty($res['data'][0])) {
                $row = $res['data'][0];
            }
        }

        if ($row === null) {
            $path = primex_file_token_path($type, $tokenHash);
            if ($path !== null && is_file($path) && is_readable($path)) {
                $decoded = json_decode((string)@file_get_contents($path), true);
                if (is_array($decoded)) {
                    $row = $decoded;
                }
            }
        }

        if (!is_array($row) || !empty($row['used_at'])) {
            return null;
        }
        $expTs = strtotime((string)($row['expires_at'] ?? '')) ?: 0;
        if ($expTs <= time()) {
            return null;
        }
        return $row;
    }
}

if (!function_exists('primex_consume_auth_token')) {
    function primex_consume_auth_token(SupabaseClient $supabase, string $type, string $rawToken): ?array {
        $table = primex_token_table_for_type($type);
        $cleanToken = primex_validate_raw_token_format($rawToken);
        if ($table === null || $cleanToken === '') {
            return null;
        }

        $tokenHash = hash('sha256', $cleanToken);
        $nowIso = gmdate('Y-m-d\TH:i:s\Z');

        if ($supabase->isConfigured()) {
            $res = $supabase->select($table, [
                'token_hash' => 'eq.' . $tokenHash,
                'used_at'    => 'is.null',
                'limit'      => '1',
            ]);
            if (!empty($res['success']) && !empty($res['data'][0])) {
                $candidate = $res['data'][0];
                $expTs = strtotime((string)($candidate['expires_at'] ?? '')) ?: 0;
                if ($expTs <= time()) {
                    return null;
                }
                // Atomic conditional update: only succeeds if used_at is still NULL
                $upd = $supabase->update($table, ['used_at' => $nowIso], [
                    'token_hash' => 'eq.' . $tokenHash,
                    'used_at'    => 'is.null',
                ]);
                if (!empty($upd['success']) && !empty($upd['data'][0])) {
                    return $upd['data'][0];
                }
                return null;
            }
        }

        // File fallback path (if migration table is not present yet)
        $path = primex_file_token_path($type, $tokenHash);
        if ($path === null || !is_file($path) || !is_readable($path)) {
            return null;
        }
        $fp = @fopen($path, 'c+');
        if (!$fp) {
            return null;
        }
        $consumed = null;
        if (@flock($fp, LOCK_EX)) {
            $contents = stream_get_contents($fp);
            $row = json_decode((string)$contents, true);
            if (is_array($row) && empty($row['used_at'])) {
                $expTs = strtotime((string)($row['expires_at'] ?? '')) ?: 0;
                if ($expTs > time()) {
                    $row['used_at'] = $nowIso;
                    ftruncate($fp, 0);
                    rewind($fp);
                    fwrite($fp, (string)json_encode($row, JSON_UNESCAPED_SLASHES));
                    fflush($fp);
                    $consumed = $row;
                }
            }
            @flock($fp, LOCK_UN);
        }
        @fclose($fp);
        return $consumed;
    }
}

if (!function_exists('primex_email_rate_key')) {
    function primex_email_rate_key(string $action, string $identifier): string {
        $ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
        return hash('sha256', 'email-action|' . strtolower($action) . '|' . strtolower(trim($identifier)) . '|' . $ip);
    }
}

if (!function_exists('primex_check_email_rate_limit')) {
    function primex_check_email_rate_limit(
        string $action,
        string $identifier,
        int $maxAttempts = 5,
        int $windowSeconds = 900,
        int $cooldownSeconds = 45
    ): bool {
        $key = primex_email_rate_key($action, $identifier);
        $sb = getSupabaseClient();
        $row = null;
        $res = $sb->isConfigured()
            ? $sb->select('security_rate_limits', ['id' => 'eq.' . $key, 'limit' => '1'])
            : ['success' => false];
        if (!empty($res['success'])) {
            $row = $res['data'][0] ?? null;
        } elseif (function_exists('primex_file_rate_read')) {
            $row = primex_file_rate_read($key);
        }

        if (!is_array($row)) {
            return true;
        }

        $now = time();
        $lockedUntil = strtotime((string)($row['locked_until'] ?? '')) ?: 0;
        if ($lockedUntil > $now) {
            return false;
        }

        $updatedAt = strtotime((string)($row['updated_at'] ?? '')) ?: 0;
        if ($updatedAt > 0 && ($now - $updatedAt) > $windowSeconds) {
            return true;
        }
        if ($cooldownSeconds > 0 && $updatedAt > 0 && ($now - $updatedAt) < $cooldownSeconds) {
            return false;
        }
        $attempts = (int)($row['failed_attempts'] ?? 0);
        return $attempts < $maxAttempts;
    }
}

if (!function_exists('primex_record_email_rate_attempt')) {
    function primex_record_email_rate_attempt(
        string $action,
        string $identifier,
        int $maxAttempts = 5,
        int $windowSeconds = 900
    ): void {
        $key = primex_email_rate_key($action, $identifier);
        $sb = getSupabaseClient();
        $now = time();
        $nowIso = gmdate('Y-m-d H:i:s', $now);

        $res = $sb->isConfigured()
            ? $sb->select('security_rate_limits', ['id' => 'eq.' . $key, 'limit' => '1'])
            : ['success' => false];
        $row = !empty($res['success'])
            ? ($res['data'][0] ?? null)
            : (function_exists('primex_file_rate_read') ? primex_file_rate_read($key) : null);

        $prevUpdated = is_array($row) ? (strtotime((string)($row['updated_at'] ?? '')) ?: 0) : 0;
        $attempts = (is_array($row) && $prevUpdated > 0 && ($now - $prevUpdated) <= $windowSeconds)
            ? ((int)($row['failed_attempts'] ?? 0) + 1)
            : 1;

        $lockedUntil = $attempts >= $maxAttempts ? gmdate('Y-m-d H:i:s', $now + $windowSeconds) : null;
        $payload = [
            'id'              => $key,
            'user_id'         => 'email-rate',
            'action'          => substr($action, 0, 48),
            'failed_attempts' => $attempts,
            'locked_until'    => $lockedUntil,
            'updated_at'      => $nowIso,
        ];

        if (function_exists('primex_file_rate_write')) {
            primex_file_rate_write($key, $payload);
        }
        if (!empty($res['success'])) {
            if (!empty($res['data'][0])) {
                $sb->update('security_rate_limits', $payload, ['id' => 'eq.' . $key]);
            } else {
                $sb->insert('security_rate_limits', [$payload]);
            }
        }
    }
}
