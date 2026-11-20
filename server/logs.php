<?php
/**
 * PRIME X CAPITAL - Server-Side System & Security Logs Engine
 * Stored outside public_html; never web-accessible directly.
 */

declare(strict_types=1);

if (!function_exists('primex_logs_storage_path')) {
    function primex_logs_storage_path(): string {
        $storageDir = __DIR__ . '/storage';
        if (!is_dir($storageDir)) {
            @mkdir($storageDir, 0750, true);
        }
        return $storageDir . '/system_logs.jsonl';
    }
}

if (!function_exists('primex_log_sanitize')) {
    function primex_log_sanitize($data, int $depth = 0) {
        if ($depth > 4) {
            return '[TRUNCATED]';
        }
        if (is_array($data)) {
            $clean = [];
            $sensitivePattern = '/(password|pass|pin|secret|token|authorization|cookie|csrf|api_key|service_role|private_key)/i';
            foreach ($data as $k => $v) {
                $keyStr = (string)$k;
                if (preg_match($sensitivePattern, $keyStr)) {
                    $clean[$keyStr] = '[REDACTED]';
                } else {
                    $clean[$keyStr] = primex_log_sanitize($v, $depth + 1);
                }
            }
            return $clean;
        }
        if (is_object($data)) {
            return primex_log_sanitize((array)$data, $depth + 1);
        }
        if (is_string($data)) {
            $trimmed = str_replace(["\r", "\n"], ' ', $data);
            return mb_strlen($trimmed, 'UTF-8') > 400
                ? mb_substr($trimmed, 0, 400, 'UTF-8') . '...'
                : $trimmed;
        }
        return $data;
    }
}

if (!function_exists('primex_write_log')) {
    function primex_write_log(
        string $category,
        string $event,
        string $message = '',
        array $context = [],
        string $level = 'INFO',
        ?string $actorId = null,
        ?string $actorEmail = null
    ): bool {
        try {
            $path = primex_logs_storage_path();
            $normalizedLevel = strtoupper(trim($level));
            if (!in_array($normalizedLevel, ['INFO', 'WARNING', 'ERROR', 'SECURITY'], true)) {
                $normalizedLevel = 'INFO';
            }

            $ip = (string)($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
            if (strpos($ip, ',') !== false) {
                $ip = trim(explode(',', $ip)[0]);
            }
            $method = strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'CLI'));
            $requestUri = (string)($_SERVER['REQUEST_URI'] ?? '');
            $requestPath = parse_url($requestUri, PHP_URL_PATH) ?: $requestUri;

            $entry = [
                'id' => 'log_' . bin2hex(random_bytes(6)),
                'ts' => gmdate('Y-m-d\TH:i:s\Z'),
                'level' => $normalizedLevel,
                'category' => strtoupper(preg_replace('/[^A-Z0-9_-]/i', '_', $category) ?: 'SYSTEM'),
                'event' => strtoupper(preg_replace('/[^A-Z0-9_-]/i', '_', $event) ?: 'EVENT'),
                'message' => (string)primex_log_sanitize($message),
                'actor_id' => $actorId !== null ? (string)$actorId : null,
                'actor_email' => $actorEmail !== null ? (string)$actorEmail : null,
                'ip' => substr($ip, 0, 64),
                'method' => substr($method, 0, 12),
                'path' => substr((string)$requestPath, 0, 180),
                'context' => primex_log_sanitize($context),
            ];

            $line = json_encode($entry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            if ($line === false) {
                return false;
            }

            // Cap local log file size at ~4MB by retaining the newest 1500 entries when exceeded.
            if (is_file($path) && @filesize($path) > 4194304) {
                $existing = @file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                if (is_array($existing)) {
                    $tail = array_slice($existing, -1500);
                    @file_put_contents($path, implode(PHP_EOL, $tail) . PHP_EOL, LOCK_EX);
                }
            }

            $written = @file_put_contents($path, $line . PHP_EOL, FILE_APPEND | LOCK_EX);
            if (is_file($path)) {
                @chmod($path, 0600);
            }
            return $written !== false;
        } catch (Throwable $e) {
            return false;
        }
    }
}

if (!function_exists('primex_read_file_logs')) {
    function primex_read_file_logs(int $limit = 250): array {
        $path = primex_logs_storage_path();
        if (!is_file($path) || !is_readable($path)) {
            return [];
        }
        $lines = @file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (!is_array($lines) || empty($lines)) {
            return [];
        }
        $slice = array_slice(array_reverse($lines), 0, max(1, min(1000, $limit)));
        $entries = [];
        foreach ($slice as $line) {
            $decoded = json_decode($line, true);
            if (is_array($decoded)) {
                $decoded['source'] = 'SERVER_FILE';
                $entries[] = $decoded;
            }
        }
        return $entries;
    }
}

if (!function_exists('primex_clear_file_logs')) {
    function primex_clear_file_logs(): bool {
        $path = primex_logs_storage_path();
        if (!is_file($path)) {
            return true;
        }
        return @file_put_contents($path, '', LOCK_EX) !== false;
    }
}

if (!function_exists('primex_fetch_combined_logs')) {
    function primex_fetch_combined_logs($supabase = null, int $limit = 250, string $levelFilter = 'ALL', string $search = ''): array {
        $entries = primex_read_file_logs($limit);

        if ($supabase && method_exists($supabase, 'isConfigured') && $supabase->isConfigured() && method_exists($supabase, 'selectMany')) {
            $batch = $supabase->selectMany([
                'audit' => [
                    'table' => 'admin_audit_logs',
                    'params' => ['select' => 'id,actor_id,actor_role,action,target_type,target_id,reason,reference_id,ip_address,created_at', 'order' => 'created_at.desc', 'limit' => '100']
                ],
                'rate_limits' => [
                    'table' => 'security_rate_limits',
                    'params' => ['select' => 'id,user_id,action,failed_attempts,locked_until,updated_at', 'order' => 'updated_at.desc', 'limit' => '50']
                ],
                'profiles' => [
                    'table' => 'profiles',
                    'params' => ['select' => 'id,email,role,country,kyc_status,created_at', 'order' => 'created_at.desc', 'limit' => '50']
                ],
                'deposits' => [
                    'table' => 'deposits',
                    'params' => ['select' => 'id,user_id,asset,network,amount,status,created_at', 'order' => 'created_at.desc', 'limit' => '40']
                ],
                'withdrawals' => [
                    'table' => 'withdrawals',
                    'params' => ['select' => 'id,user_id,asset,network,amount,status,created_at', 'order' => 'created_at.desc', 'limit' => '40']
                ]
            ]);

            if (!empty($batch['audit']['success']) && is_array($batch['audit']['data'] ?? null)) {
                foreach ($batch['audit']['data'] as $row) {
                    $entries[] = [
                        'id' => 'aud_' . ($row['id'] ?? bin2hex(random_bytes(3))),
                        'ts' => (string)($row['created_at'] ?? ''),
                        'level' => 'INFO',
                        'category' => 'ADMIN_AUDIT',
                        'event' => strtoupper((string)($row['action'] ?? 'ADMIN_ACTION')),
                        'message' => trim(((string)($row['target_type'] ?? 'TARGET')) . ' #' . ((string)($row['target_id'] ?? '')) . (!empty($row['reason']) ? ' — ' . (string)$row['reason'] : '')),
                        'actor_id' => $row['actor_id'] ?? null,
                        'actor_email' => $row['actor_role'] ?? null,
                        'ip' => $row['ip_address'] ?? '',
                        'method' => 'POST',
                        'path' => '/api/admin',
                        'source' => 'SUPABASE_AUDIT',
                        'context' => primex_log_sanitize($row)
                    ];
                }
            }

            if (!empty($batch['rate_limits']['success']) && is_array($batch['rate_limits']['data'] ?? null)) {
                foreach ($batch['rate_limits']['data'] as $row) {
                    $locked = !empty($row['locked_until']) && strtotime((string)$row['locked_until']) > time();
                    $entries[] = [
                        'id' => 'rl_' . substr((string)($row['id'] ?? ''), 0, 10),
                        'ts' => (string)($row['updated_at'] ?? ''),
                        'level' => $locked ? 'SECURITY' : 'WARNING',
                        'category' => 'SECURITY',
                        'event' => strtoupper((string)($row['action'] ?? 'RATE_LIMIT')) . ($locked ? '_LOCKED' : '_ATTEMPT'),
                        'message' => 'Failed attempts: ' . (int)($row['failed_attempts'] ?? 0) . ($locked ? ' (Locked until ' . (string)$row['locked_until'] . ')' : ''),
                        'actor_id' => $row['user_id'] ?? null,
                        'actor_email' => null,
                        'ip' => '-',
                        'method' => 'POST',
                        'path' => '/api/auth',
                        'source' => 'SUPABASE_SECURITY',
                        'context' => primex_log_sanitize($row)
                    ];
                }
            }

            if (!empty($batch['profiles']['success']) && is_array($batch['profiles']['data'] ?? null)) {
                foreach ($batch['profiles']['data'] as $row) {
                    $entries[] = [
                        'id' => 'reg_' . substr((string)($row['id'] ?? ''), 0, 10),
                        'ts' => (string)($row['created_at'] ?? ''),
                        'level' => 'INFO',
                        'category' => 'USER_ACCOUNT',
                        'event' => 'ACCOUNT_CREATED',
                        'message' => 'Registered ' . (string)($row['email'] ?? 'user') . (!empty($row['country']) ? ' (' . (string)$row['country'] . ')' : ''),
                        'actor_id' => $row['id'] ?? null,
                        'actor_email' => $row['email'] ?? null,
                        'ip' => '-',
                        'method' => 'POST',
                        'path' => '/api/auth/register',
                        'source' => 'SUPABASE_PROFILES',
                        'context' => ['role' => $row['role'] ?? 'USER', 'kyc_status' => $row['kyc_status'] ?? 'NOT_SUBMITTED', 'country' => $row['country'] ?? '']
                    ];
                }
            }

            if (!empty($batch['deposits']['success']) && is_array($batch['deposits']['data'] ?? null)) {
                foreach ($batch['deposits']['data'] as $row) {
                    $entries[] = [
                        'id' => 'dep_' . substr((string)($row['id'] ?? ''), 0, 10),
                        'ts' => (string)($row['created_at'] ?? ''),
                        'level' => 'INFO',
                        'category' => 'WALLET_DEPOSIT',
                        'event' => 'DEPOSIT_' . strtoupper((string)($row['status'] ?? 'PENDING')),
                        'message' => number_format((float)($row['amount'] ?? 0), 2) . ' ' . (string)($row['asset'] ?? 'USDT') . ' via ' . (string)($row['network'] ?? '-'),
                        'actor_id' => $row['user_id'] ?? null,
                        'actor_email' => null,
                        'ip' => '-',
                        'method' => 'POST',
                        'path' => '/api/wallet/deposit',
                        'source' => 'SUPABASE_WALLET',
                        'context' => primex_log_sanitize($row)
                    ];
                }
            }

            if (!empty($batch['withdrawals']['success']) && is_array($batch['withdrawals']['data'] ?? null)) {
                foreach ($batch['withdrawals']['data'] as $row) {
                    $entries[] = [
                        'id' => 'wd_' . substr((string)($row['id'] ?? ''), 0, 10),
                        'ts' => (string)($row['created_at'] ?? ''),
                        'level' => strtoupper((string)($row['status'] ?? '')) === 'REJECTED' ? 'WARNING' : 'INFO',
                        'category' => 'WALLET_WITHDRAW',
                        'event' => 'WITHDRAWAL_' . strtoupper((string)($row['status'] ?? 'REQUESTED')),
                        'message' => number_format((float)($row['amount'] ?? 0), 2) . ' ' . (string)($row['asset'] ?? 'USDT') . ' via ' . (string)($row['network'] ?? '-'),
                        'actor_id' => $row['user_id'] ?? null,
                        'actor_email' => null,
                        'ip' => '-',
                        'method' => 'POST',
                        'path' => '/api/wallet/withdraw',
                        'source' => 'SUPABASE_WALLET',
                        'context' => primex_log_sanitize($row)
                    ];
                }
            }
        }

        // Normalize timestamps and sort newest-first.
        usort($entries, static function (array $a, array $b): int {
            $ta = strtotime((string)($a['ts'] ?? '')) ?: 0;
            $tb = strtotime((string)($b['ts'] ?? '')) ?: 0;
            return $tb <=> $ta;
        });

        $levelUpper = strtoupper(trim($levelFilter));
        $searchLower = mb_strtolower(trim($search), 'UTF-8');

        $filtered = [];
        foreach ($entries as $item) {
            if ($levelUpper !== '' && $levelUpper !== 'ALL') {
                $itemLevel = strtoupper((string)($item['level'] ?? 'INFO'));
                $itemCat = strtoupper((string)($item['category'] ?? ''));
                if ($itemLevel !== $levelUpper && $itemCat !== $levelUpper) {
                    continue;
                }
            }
            if ($searchLower !== '') {
                $haystack = mb_strtolower(
                    (string)($item['event'] ?? '') . ' ' .
                    (string)($item['category'] ?? '') . ' ' .
                    (string)($item['message'] ?? '') . ' ' .
                    (string)($item['actor_email'] ?? '') . ' ' .
                    (string)($item['actor_id'] ?? '') . ' ' .
                    (string)($item['ip'] ?? '') . ' ' .
                    (string)($item['path'] ?? ''),
                    'UTF-8'
                );
                if (mb_strpos($haystack, $searchLower, 0, 'UTF-8') === false) {
                    continue;
                }
            }
            $filtered[] = $item;
            if (count($filtered) >= $limit) {
                break;
            }
        }

        return $filtered;
    }
}
