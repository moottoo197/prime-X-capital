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

if (!function_exists('primex_signup_otp_secret')) {
    function primex_signup_otp_secret(): string {
        if (defined('APP_SECRET') && is_string(APP_SECRET) && APP_SECRET !== '') {
            return APP_SECRET;
        }
        if (defined('SUPABASE_SERVICE_ROLE_KEY') && is_string(SUPABASE_SERVICE_ROLE_KEY) && SUPABASE_SERVICE_ROLE_KEY !== '') {
            return SUPABASE_SERVICE_ROLE_KEY;
        }
        return hash('sha256', __FILE__);
    }
}

if (!function_exists('primex_signup_otp_scope_id')) {
    function primex_signup_otp_scope_id(string $email): string {
        return 'signup:' . hash('sha256', strtolower(trim($email)));
    }
}

if (!function_exists('primex_issue_signup_otp')) {
    function primex_issue_signup_otp(SupabaseClient $supabase, string $email, int $ttlSeconds = 600): array {
        $cleanEmail = strtolower(trim($email));
        if ($cleanEmail === '' || !filter_var($cleanEmail, FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'code' => '', 'expires_at' => ''];
        }

        $code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $scopeId = primex_signup_otp_scope_id($cleanEmail);
        $otpDigest = hash_hmac('sha256', $cleanEmail . '|' . $code, primex_signup_otp_secret());
        $storedHash = $otpDigest . ':' . bin2hex(random_bytes(8));
        $nowIso = gmdate('Y-m-d\TH:i:s\Z');
        $expiresIso = gmdate('Y-m-d\TH:i:s\Z', time() + max(120, $ttlSeconds));
        $recordId = function_exists('primex_uuid_v4') ? primex_uuid_v4() : bin2hex(random_bytes(16));

        $payload = [
            'id'         => $recordId,
            'user_id'    => $scopeId,
            'email'      => $cleanEmail,
            'token_hash' => $storedHash,
            'expires_at' => $expiresIso,
            'used_at'    => null,
            'created_at' => $nowIso,
        ];

        $storedInDb = false;
        if ($supabase->isConfigured()) {
            @$supabase->update('email_verification_tokens', ['used_at' => $nowIso], [
                'user_id' => 'eq.' . $scopeId,
                'used_at' => 'is.null',
            ]);
            $ins = $supabase->insert('email_verification_tokens', [$payload]);
            if (!empty($ins['success'])) {
                $storedInDb = true;
            }
        }

        if (!$storedInDb) {
            primex_invalidate_file_tokens('signup_otp', $scopeId, $nowIso);
            $fileHash = hash('sha256', $scopeId . '|' . $recordId);
            $path = primex_file_token_path('signup_otp', $fileHash);
            if ($path === null) {
                return ['success' => false, 'code' => '', 'expires_at' => ''];
            }
            $encoded = json_encode($payload, JSON_UNESCAPED_SLASHES);
            if ($encoded === false || @file_put_contents($path, $encoded, LOCK_EX) === false) {
                return ['success' => false, 'code' => '', 'expires_at' => ''];
            }
            @chmod($path, 0600);
        }

        return [
            'success'    => true,
            'code'       => $code,
            'expires_at' => $expiresIso,
        ];
    }
}

if (!function_exists('primex_consume_signup_otp')) {
    function primex_consume_signup_otp(SupabaseClient $supabase, string $email, string $code): array {
        $cleanEmail = strtolower(trim($email));
        $cleanCode = preg_replace('/\s+/', '', trim($code));
        if ($cleanEmail === '' || !preg_match('/^\d{6}$/', (string)$cleanCode)) {
            return ['success' => false, 'error_code' => 'INVALID_VERIFICATION_CODE', 'message' => 'Please enter the 6-digit verification code sent to your email.'];
        }

        if (!primex_check_email_rate_limit('signup_otp_verify', $cleanEmail, 5, 600, 0)) {
            return ['success' => false, 'error_code' => 'RATE_LIMITED', 'message' => 'Too many incorrect verification code attempts. Please request a new code.'];
        }

        $scopeId = primex_signup_otp_scope_id($cleanEmail);
        $expectedDigest = hash_hmac('sha256', $cleanEmail . '|' . $cleanCode, primex_signup_otp_secret());
        $nowIso = gmdate('Y-m-d\TH:i:s\Z');

        $record = null;
        $source = 'none';
        $filePath = null;

        if ($supabase->isConfigured()) {
            $res = $supabase->select('email_verification_tokens', [
                'user_id' => 'eq.' . $scopeId,
                'used_at' => 'is.null',
                'order'   => 'created_at.desc',
                'limit'   => '1',
            ]);
            if (!empty($res['success']) && !empty($res['data'][0])) {
                $record = $res['data'][0];
                $source = 'db';
            }
        }

        if ($record === null) {
            $dir = primex_email_tokens_dir();
            if ($dir !== null) {
                $files = @glob($dir . '/signup_otp_*.json');
                if (is_array($files)) {
                    $latestTs = -1;
                    foreach ($files as $file) {
                        $row = json_decode((string)@file_get_contents($file), true);
                        if (!is_array($row) || (string)($row['user_id'] ?? '') !== $scopeId || !empty($row['used_at'])) {
                            continue;
                        }
                        $ts = strtotime((string)($row['created_at'] ?? '')) ?: 0;
                        if ($ts >= $latestTs) {
                            $latestTs = $ts;
                            $record = $row;
                            $filePath = $file;
                            $source = 'file';
                        }
                    }
                }
            }
        }

        if (!is_array($record)) {
            return ['success' => false, 'error_code' => 'INVALID_VERIFICATION_CODE', 'message' => 'Verification code not found or expired. Click Send Code to receive a new one.'];
        }

        $expTs = strtotime((string)($record['expires_at'] ?? '')) ?: 0;
        if ($expTs <= time()) {
            return ['success' => false, 'error_code' => 'VERIFICATION_CODE_EXPIRED', 'message' => 'Your verification code has expired. Please click Send Code for a new one.'];
        }

        $storedParts = explode(':', (string)($record['token_hash'] ?? ''), 2);
        $storedDigest = $storedParts[0] ?? '';
        if ($storedDigest === '' || !hash_equals($storedDigest, $expectedDigest)) {
            primex_record_email_rate_attempt('signup_otp_verify', $cleanEmail, 5, 600);
            if (!primex_check_email_rate_limit('signup_otp_verify', $cleanEmail, 5, 600, 0)) {
                if ($source === 'db') {
                    @$supabase->update('email_verification_tokens', ['used_at' => $nowIso], [
                        'user_id' => 'eq.' . $scopeId,
                        'used_at' => 'is.null',
                    ]);
                } else {
                    primex_invalidate_file_tokens('signup_otp', $scopeId, $nowIso);
                }
                return ['success' => false, 'error_code' => 'RATE_LIMITED', 'message' => 'Too many incorrect verification code attempts. Please request a new code.'];
            }
            return ['success' => false, 'error_code' => 'INVALID_VERIFICATION_CODE', 'message' => 'Incorrect email verification code. Please check your inbox and try again.'];
        }

        if ($source === 'db' && !empty($record['id'])) {
            $upd = $supabase->update('email_verification_tokens', ['used_at' => $nowIso], [
                'id'      => 'eq.' . (string)$record['id'],
                'used_at' => 'is.null',
            ]);
            if (empty($upd['success']) || empty($upd['data'][0])) {
                return ['success' => false, 'error_code' => 'INVALID_VERIFICATION_CODE', 'message' => 'This verification code has already been used. Please request a new code.'];
            }
            return ['success' => true];
        }

        if ($source === 'file' && $filePath !== null) {
            $fp = @fopen($filePath, 'c+');
            if (!$fp) {
                return ['success' => false, 'error_code' => 'INVALID_VERIFICATION_CODE', 'message' => 'Verification failed. Please request a new code.'];
            }
            $ok = false;
            if (@flock($fp, LOCK_EX)) {
                $row = json_decode((string)stream_get_contents($fp), true);
                if (is_array($row) && empty($row['used_at'])) {
                    $row['used_at'] = $nowIso;
                    ftruncate($fp, 0);
                    rewind($fp);
                    fwrite($fp, (string)json_encode($row, JSON_UNESCAPED_SLASHES));
                    fflush($fp);
                    $ok = true;
                }
                @flock($fp, LOCK_UN);
            }
            @fclose($fp);
            if ($ok) {
                return ['success' => true];
            }
        }

        return ['success' => false, 'error_code' => 'INVALID_VERIFICATION_CODE', 'message' => 'Verification code is no longer valid. Please request a new code.'];
    }
}

if (!function_exists('primex_scoped_otp_scope_id')) {
    function primex_scoped_otp_scope_id(string $purpose, string $identifier): string {
        $safePurpose = preg_replace('/[^a-z0-9_]/', '_', strtolower(trim($purpose)));
        $cleanId = strtolower(trim($identifier));
        return 'sec:' . $safePurpose . ':' . hash('sha256', $cleanId);
    }
}

if (!function_exists('primex_issue_scoped_otp')) {
    function primex_issue_scoped_otp(SupabaseClient $supabase, string $purpose, string $identifier, int $ttlSeconds = 600): array {
        $safePurpose = preg_replace('/[^a-z0-9_]/', '_', strtolower(trim($purpose)));
        $cleanId = strtolower(trim($identifier));
        if ($safePurpose === '' || $cleanId === '') {
            return ['success' => false, 'code' => '', 'expires_at' => ''];
        }

        $code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $scopeId = primex_scoped_otp_scope_id($safePurpose, $cleanId);
        $otpDigest = hash_hmac('sha256', $safePurpose . '|' . $cleanId . '|' . $code, primex_signup_otp_secret());
        $storedHash = $otpDigest . ':' . bin2hex(random_bytes(8));
        $nowIso = gmdate('Y-m-d\TH:i:s\Z');
        $expiresIso = gmdate('Y-m-d\TH:i:s\Z', time() + max(120, $ttlSeconds));
        $recordId = function_exists('primex_uuid_v4') ? primex_uuid_v4() : bin2hex(random_bytes(16));
        $emailVal = filter_var($cleanId, FILTER_VALIDATE_EMAIL) ? $cleanId : ('otp+' . $safePurpose . '@primex.local');

        $payload = [
            'id'         => $recordId,
            'user_id'    => $scopeId,
            'email'      => $emailVal,
            'token_hash' => $storedHash,
            'expires_at' => $expiresIso,
            'used_at'    => null,
            'created_at' => $nowIso,
        ];

        $fileType = 'sec_otp_' . $safePurpose;
        $storedInDb = false;
        if ($supabase->isConfigured()) {
            @$supabase->update('email_verification_tokens', ['used_at' => $nowIso], [
                'user_id' => 'eq.' . $scopeId,
                'used_at' => 'is.null',
            ]);
            $ins = $supabase->insert('email_verification_tokens', [$payload]);
            if (!empty($ins['success'])) {
                $storedInDb = true;
            }
        }

        if (!$storedInDb) {
            primex_invalidate_file_tokens($fileType, $scopeId, $nowIso);
            $fileHash = hash('sha256', $scopeId . '|' . $recordId);
            $path = primex_file_token_path($fileType, $fileHash);
            if ($path === null) {
                return ['success' => false, 'code' => '', 'expires_at' => ''];
            }
            $encoded = json_encode($payload, JSON_UNESCAPED_SLASHES);
            if ($encoded === false || @file_put_contents($path, $encoded, LOCK_EX) === false) {
                return ['success' => false, 'code' => '', 'expires_at' => ''];
            }
            @chmod($path, 0600);
        }

        return [
            'success'    => true,
            'code'       => $code,
            'expires_at' => $expiresIso,
        ];
    }
}

if (!function_exists('primex_consume_scoped_otp')) {
    function primex_consume_scoped_otp(SupabaseClient $supabase, string $purpose, string $identifier, string $code): array {
        $safePurpose = preg_replace('/[^a-z0-9_]/', '_', strtolower(trim($purpose)));
        $cleanId = strtolower(trim($identifier));
        $cleanCode = preg_replace('/\s+/', '', trim($code));
        if ($safePurpose === '' || $cleanId === '' || !preg_match('/^\d{6}$/', (string)$cleanCode)) {
            return ['success' => false, 'error_code' => 'INVALID_VERIFICATION_CODE', 'message' => 'Please enter the 6-digit verification code sent to your email.'];
        }

        $rateAction = 'sec_otp_verify_' . substr($safePurpose, 0, 24);
        if (!primex_check_email_rate_limit($rateAction, $cleanId, 5, 600, 0)) {
            return ['success' => false, 'error_code' => 'RATE_LIMITED', 'message' => 'Too many incorrect verification code attempts. Please request a new code.'];
        }

        $scopeId = primex_scoped_otp_scope_id($safePurpose, $cleanId);
        $expectedDigest = hash_hmac('sha256', $safePurpose . '|' . $cleanId . '|' . $cleanCode, primex_signup_otp_secret());
        $nowIso = gmdate('Y-m-d\TH:i:s\Z');
        $fileType = 'sec_otp_' . $safePurpose;

        $record = null;
        $source = 'none';
        $filePath = null;

        if ($supabase->isConfigured()) {
            $res = $supabase->select('email_verification_tokens', [
                'user_id' => 'eq.' . $scopeId,
                'used_at' => 'is.null',
                'order'   => 'created_at.desc',
                'limit'   => '1',
            ]);
            if (!empty($res['success']) && !empty($res['data'][0])) {
                $record = $res['data'][0];
                $source = 'db';
            }
        }

        if ($record === null) {
            $dir = primex_email_tokens_dir();
            if ($dir !== null) {
                $files = @glob($dir . '/' . $fileType . '_*.json');
                if (is_array($files)) {
                    $latestTs = -1;
                    foreach ($files as $file) {
                        $row = json_decode((string)@file_get_contents($file), true);
                        if (!is_array($row) || (string)($row['user_id'] ?? '') !== $scopeId || !empty($row['used_at'])) {
                            continue;
                        }
                        $ts = strtotime((string)($row['created_at'] ?? '')) ?: 0;
                        if ($ts >= $latestTs) {
                            $latestTs = $ts;
                            $record = $row;
                            $filePath = $file;
                            $source = 'file';
                        }
                    }
                }
            }
        }

        if (!is_array($record)) {
            return ['success' => false, 'error_code' => 'INVALID_VERIFICATION_CODE', 'message' => 'Verification code not found or expired. Click Send Code to receive a new one.'];
        }

        $expTs = strtotime((string)($record['expires_at'] ?? '')) ?: 0;
        if ($expTs <= time()) {
            return ['success' => false, 'error_code' => 'VERIFICATION_CODE_EXPIRED', 'message' => 'Your verification code has expired. Please click Send Code for a new one.'];
        }

        $storedParts = explode(':', (string)($record['token_hash'] ?? ''), 2);
        $storedDigest = $storedParts[0] ?? '';
        if ($storedDigest === '' || !hash_equals($storedDigest, $expectedDigest)) {
            primex_record_email_rate_attempt($rateAction, $cleanId, 5, 600);
            if (!primex_check_email_rate_limit($rateAction, $cleanId, 5, 600, 0)) {
                if ($source === 'db') {
                    @$supabase->update('email_verification_tokens', ['used_at' => $nowIso], [
                        'user_id' => 'eq.' . $scopeId,
                        'used_at' => 'is.null',
                    ]);
                } else {
                    primex_invalidate_file_tokens($fileType, $scopeId, $nowIso);
                }
                return ['success' => false, 'error_code' => 'RATE_LIMITED', 'message' => 'Too many incorrect verification code attempts. Please request a new code.'];
            }
            return ['success' => false, 'error_code' => 'INVALID_VERIFICATION_CODE', 'message' => 'Incorrect email verification code. Please check your inbox and try again.'];
        }

        if ($source === 'db' && !empty($record['id'])) {
            $upd = $supabase->update('email_verification_tokens', ['used_at' => $nowIso], [
                'id'      => 'eq.' . (string)$record['id'],
                'used_at' => 'is.null',
            ]);
            if (empty($upd['success']) || empty($upd['data'][0])) {
                return ['success' => false, 'error_code' => 'INVALID_VERIFICATION_CODE', 'message' => 'This verification code has already been used. Please request a new code.'];
            }
            return ['success' => true];
        }

        if ($source === 'file' && $filePath !== null) {
            $fp = @fopen($filePath, 'c+');
            if (!$fp) {
                return ['success' => false, 'error_code' => 'INVALID_VERIFICATION_CODE', 'message' => 'Verification failed. Please request a new code.'];
            }
            $ok = false;
            if (@flock($fp, LOCK_EX)) {
                $row = json_decode((string)stream_get_contents($fp), true);
                if (is_array($row) && empty($row['used_at'])) {
                    $row['used_at'] = $nowIso;
                    ftruncate($fp, 0);
                    rewind($fp);
                    fwrite($fp, (string)json_encode($row, JSON_UNESCAPED_SLASHES));
                    fflush($fp);
                    $ok = true;
                }
                @flock($fp, LOCK_UN);
            }
            @fclose($fp);
            if ($ok) {
                return ['success' => true];
            }
        }

        return ['success' => false, 'error_code' => 'INVALID_VERIFICATION_CODE', 'message' => 'Verification code is no longer valid. Please request a new code.'];
    }
}

if (!function_exists('primex_verified_marker_path')) {
    function primex_verified_marker_path(string $scope, string $value): ?string {
        $clean = strtolower(trim($value));
        if ($clean === '') {
            return null;
        }
        $dir = primex_email_tokens_dir();
        if ($dir === null) {
            return null;
        }
        $safeScope = preg_replace('/[^a-z]/', '', $scope);
        return $dir . '/verified_' . $safeScope . '_' . hash('sha256', $clean) . '.json';
    }
}

if (!function_exists('primex_mark_email_verified_local')) {
    function primex_mark_email_verified_local(string $userId, string $email): void {
        $nowIso = gmdate('Y-m-d\TH:i:s\Z');
        $cleanId = trim($userId);
        $cleanEmail = strtolower(trim($email));
        $payload = json_encode([
            'user_id'     => $cleanId,
            'email'       => $cleanEmail,
            'verified_at' => $nowIso,
        ], JSON_UNESCAPED_SLASHES);
        if ($payload === false) {
            return;
        }
        if ($cleanId !== '') {
            $idPath = primex_verified_marker_path('uid', $cleanId);
            if ($idPath !== null) {
                @file_put_contents($idPath, $payload, LOCK_EX);
                @chmod($idPath, 0600);
            }
        }
        if ($cleanEmail !== '' && filter_var($cleanEmail, FILTER_VALIDATE_EMAIL)) {
            $emPath = primex_verified_marker_path('email', $cleanEmail);
            if ($emPath !== null) {
                @file_put_contents($emPath, $payload, LOCK_EX);
                @chmod($emPath, 0600);
            }
        }
    }
}

if (!function_exists('primex_clear_email_verified_local')) {
    function primex_clear_email_verified_local(string $userId, string $email = ''): void {
        $cleanId = trim($userId);
        $cleanEmail = strtolower(trim($email));
        if ($cleanId !== '') {
            $idPath = primex_verified_marker_path('uid', $cleanId);
            if ($idPath !== null && is_file($idPath)) {
                @unlink($idPath);
            }
        }
        if ($cleanEmail !== '') {
            $emPath = primex_verified_marker_path('email', $cleanEmail);
            if ($emPath !== null && is_file($emPath)) {
                @unlink($emPath);
            }
        }
    }
}

if (!function_exists('primex_is_email_verified_resolved')) {
    function primex_is_email_verified_resolved(array $user, ?SupabaseClient $supabase = null): bool {
        if (!empty($user['email_verified']) || !empty($user['email_verified_at'])) {
            return true;
        }
        $userId = trim((string)($user['id'] ?? ''));
        $email = strtolower(trim((string)($user['email'] ?? '')));

        if ($userId !== '') {
            $idPath = primex_verified_marker_path('uid', $userId);
            if ($idPath !== null && is_file($idPath)) {
                $marker = json_decode((string)@file_get_contents($idPath), true);
                if (is_array($marker)) {
                    $markerEmail = strtolower(trim((string)($marker['email'] ?? '')));
                    if ($markerEmail === '' || $email === '' || $markerEmail === $email) {
                        return true;
                    }
                }
            }
        }

        if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $emPath = primex_verified_marker_path('email', $email);
            if ($emPath !== null && is_file($emPath)) {
                return true;
            }

            // Check DB tokens (covers accounts verified via OTP or verify link even if profiles.email_verified column was missing)
            if ($supabase !== null && $supabase->isConfigured()) {
                $tokRes = $supabase->select('email_verification_tokens', [
                    'email'   => 'eq.' . $email,
                    'used_at' => 'not.is.null',
                    'select'  => 'id,user_id,used_at',
                    'limit'   => '1',
                ]);
                if (!empty($tokRes['success']) && !empty($tokRes['data'][0])) {
                    primex_mark_email_verified_local($userId, $email);
                    return true;
                }
            }

            // Check file-backed consumed OTP records
            $dir = primex_email_tokens_dir();
            if ($dir !== null) {
                $scopeId = primex_signup_otp_scope_id($email);
                $files = @glob($dir . '/signup_otp_*.json');
                if (is_array($files)) {
                    foreach ($files as $file) {
                        $row = json_decode((string)@file_get_contents($file), true);
                        if (is_array($row) && (string)($row['user_id'] ?? '') === $scopeId && !empty($row['used_at'])) {
                            primex_mark_email_verified_local($userId, $email);
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }
}

if (!function_exists('primex_validate_avatar_path')) {
    function primex_validate_avatar_path(?string $avatar): ?string {
        $val = trim((string)$avatar);
        if ($val === '') {
            return '';
        }
        if (!preg_match('#^/assets/avatars/(male|female)/(male|female)_(\d{2})\.png$#', $val, $m)) {
            return null;
        }
        if ($m[1] !== $m[2]) {
            return null;
        }
        $publicRoot = dirname(__DIR__, 2);
        $fullPath = $publicRoot . $val;
        if (!is_file($fullPath)) {
            return null;
        }
        return $val;
    }
}

if (!function_exists('primex_avatar_store_dir')) {
    function primex_avatar_store_dir(): ?string {
        $candidates = [
            dirname(__DIR__, 3) . '/server/storage/avatars',
            rtrim(sys_get_temp_dir(), '/\\') . '/primex_avatars',
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

if (!function_exists('primex_avatar_store_file')) {
    function primex_avatar_store_file(string $userId, string $email = ''): ?string {
        $dir = primex_avatar_store_dir();
        if ($dir === null) {
            return null;
        }
        $seed = trim($userId) !== '' ? ('id:' . trim($userId)) : ('em:' . strtolower(trim($email)));
        if ($seed === 'id:' || $seed === 'em:') {
            return null;
        }
        return $dir . '/avatar_' . hash('sha256', $seed) . '.json';
    }
}

if (!function_exists('primex_save_user_avatar')) {
    function primex_save_user_avatar(string $userId, string $avatar, string $email = ''): void {
        $valid = primex_validate_avatar_path($avatar);
        if ($valid === null) {
            return;
        }
        $paths = array_filter([
            primex_avatar_store_file($userId, ''),
            $email !== '' ? primex_avatar_store_file('', $email) : null,
        ]);
        $payload = json_encode([
            'user_id'    => $userId,
            'avatar'     => $valid,
            'updated_at' => gmdate('c'),
        ], JSON_UNESCAPED_SLASHES);
        foreach ($paths as $path) {
            @file_put_contents($path, $payload, LOCK_EX);
        }
    }
}

if (!function_exists('primex_get_user_avatar')) {
    function primex_get_user_avatar(array $user): string {
        $dbAvatar = primex_validate_avatar_path((string)($user['avatar'] ?? ''));
        if ($dbAvatar !== null && $dbAvatar !== '') {
            return $dbAvatar;
        }
        $userId = (string)($user['id'] ?? '');
        $email = (string)($user['email'] ?? '');
        $paths = array_filter([
            primex_avatar_store_file($userId, ''),
            $email !== '' ? primex_avatar_store_file('', $email) : null,
        ]);
        foreach ($paths as $path) {
            if (!is_file($path)) {
                continue;
            }
            $data = json_decode((string)@file_get_contents($path), true);
            if (is_array($data) && array_key_exists('avatar', $data)) {
                $stored = primex_validate_avatar_path((string)$data['avatar']);
                if ($stored !== null) {
                    return $stored;
                }
            }
        }
        return '';
    }
}
