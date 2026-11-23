<?php
/**
 * Prime X Capital - Reusable Server-Side Hostinger SMTP Mailer
 *
 * Reads configuration strictly from server-side environment variables and
 * admin-protected Supabase `system_settings`. Never exposes credentials or
 * raw SMTP protocol diagnostics to callers or browser responses.
 */

declare(strict_types=1);

if (!function_exists('primex_sanitize_mail_header')) {
    function primex_sanitize_mail_header(string $value): string {
        return trim(str_replace(["\r", "\n", "\0"], '', $value));
    }
}

if (!function_exists('primex_app_url')) {
    function primex_app_url(): string {
        $candidates = [];
        if (defined('APP_URL') && is_string(APP_URL)) {
            $candidates[] = APP_URL;
        }
        $envUrl = getenv('APP_URL');
        if ($envUrl !== false && $envUrl !== '') {
            $candidates[] = (string)$envUrl;
        }
        if (!empty($_ENV['APP_URL'])) {
            $candidates[] = (string)$_ENV['APP_URL'];
        }
        foreach ($candidates as $candidate) {
            $trimmed = rtrim(trim($candidate), '/');
            $parts = parse_url($trimmed);
            if (is_array($parts) && !empty($parts['scheme']) && !empty($parts['host'])) {
                $scheme = strtolower((string)$parts['scheme']);
                $host = strtolower((string)$parts['host']);
                $isLoopback = in_array($host, ['localhost', '127.0.0.1', '::1'], true);
                if (in_array($scheme, ['http', 'https'], true) && $host !== '' && !$isLoopback) {
                    return $trimmed;
                }
            }
        }
        return 'https://prime-x-capital.com';
    }
}

if (!function_exists('primex_is_placeholder_secret')) {
    function primex_is_placeholder_secret(string $value): bool {
        $trimmed = trim($value);
        if ($trimmed === '') {
            return true;
        }
        return (bool)preg_match('/^(?:REPLACE_WITH_|replace_with_|YOUR_|your_)/i', $trimmed);
    }
}

if (!function_exists('primex_env_first')) {
    function primex_env_first(array $keys, string $default = ''): string {
        foreach ($keys as $key) {
            $val = getenv($key);
            if ($val === false || $val === '') {
                $val = $_ENV[$key] ?? $_SERVER[$key] ?? '';
            }
            $str = trim((string)$val);
            if ($str !== '' && !primex_is_placeholder_secret($str)) {
                return $str;
            }
        }
        return $default;
    }
}

if (!function_exists('primex_load_smtp_config')) {
    function primex_load_smtp_config(?SupabaseClient $supabase = null): array {
        $portRaw = primex_env_first(['SMTP_PORT'], '465');
        $port = max(1, min(65535, (int)$portRaw));
        $defaultEnc = ($port === 587) ? 'tls' : 'ssl';
        $encRaw = strtolower(primex_env_first(['SMTP_ENCRYPTION'], $defaultEnc));
        if (!in_array($encRaw, ['ssl', 'tls', 'starttls', 'none'], true)) {
            $encRaw = $defaultEnc;
        }
        if ($encRaw === 'starttls') {
            $encRaw = 'tls';
        }

        $user = primex_env_first(['SMTP_USERNAME', 'SMTP_USER'], '');
        $pass = primex_env_first(['SMTP_PASSWORD', 'SMTP_PASS'], '');
        $from = primex_env_first(['MAIL_FROM_ADDRESS', 'SMTP_FROM'], $user);
        $fromName = primex_env_first(['MAIL_FROM_NAME', 'SMTP_FROM_NAME'], 'Prime X Capital');

        $config = [
            'host'       => primex_env_first(['SMTP_HOST'], 'smtp.hostinger.com'),
            'port'       => $port,
            'encryption' => $encRaw,
            'user'       => $user,
            'pass'       => $pass,
            'from'       => $from,
            'from_name'  => $fromName,
        ];

        if ($supabase === null && function_exists('getSupabaseClient')) {
            $supabase = getSupabaseClient();
        }

        if ($supabase && $supabase->isConfigured()) {
            $res = $supabase->select('system_settings', [
                'setting_key' => 'in.(SMTP_HOST,SMTP_PORT,SMTP_ENCRYPTION,SMTP_USER,SMTP_USERNAME,SMTP_PASS,SMTP_PASSWORD,SMTP_FROM,MAIL_FROM_ADDRESS,SMTP_FROM_NAME,MAIL_FROM_NAME)'
            ]);
            if (!empty($res['success']) && is_array($res['data'])) {
                $map = [];
                foreach ($res['data'] as $row) {
                    $k = strtoupper(trim((string)($row['setting_key'] ?? '')));
                    if ($k !== '') {
                        $map[$k] = (string)($row['setting_value'] ?? '');
                    }
                }
                if (!empty($map['SMTP_HOST']) && !primex_is_placeholder_secret($map['SMTP_HOST'])) {
                    $config['host'] = trim($map['SMTP_HOST']);
                }
                if (!empty($map['SMTP_PORT']) && is_numeric($map['SMTP_PORT'])) {
                    $config['port'] = max(1, min(65535, (int)$map['SMTP_PORT']));
                }
                if (isset($map['SMTP_ENCRYPTION']) && trim($map['SMTP_ENCRYPTION']) !== '') {
                    $enc = strtolower(trim($map['SMTP_ENCRYPTION']));
                    if ($enc === 'starttls') {
                        $enc = 'tls';
                    }
                    if (in_array($enc, ['tls', 'ssl', 'none'], true)) {
                        $config['encryption'] = $enc;
                    }
                }
                $dbUser = trim((string)($map['SMTP_USERNAME'] ?? $map['SMTP_USER'] ?? ''));
                if ($dbUser !== '' && !primex_is_placeholder_secret($dbUser)) {
                    $config['user'] = $dbUser;
                }
                $dbPass = (string)($map['SMTP_PASSWORD'] ?? $map['SMTP_PASS'] ?? '');
                if ($dbPass !== '' && !primex_is_placeholder_secret($dbPass)) {
                    $config['pass'] = $dbPass;
                }
                $dbFrom = trim((string)($map['MAIL_FROM_ADDRESS'] ?? $map['SMTP_FROM'] ?? ''));
                if ($dbFrom !== '' && !primex_is_placeholder_secret($dbFrom)) {
                    $config['from'] = $dbFrom;
                }
                $dbFromName = trim((string)($map['MAIL_FROM_NAME'] ?? $map['SMTP_FROM_NAME'] ?? ''));
                if ($dbFromName !== '') {
                    $config['from_name'] = $dbFromName;
                }
            }
        }

        if ($config['from'] === '' && filter_var($config['user'], FILTER_VALIDATE_EMAIL)) {
            $config['from'] = $config['user'];
        }
        if ($config['port'] === 465 && $config['encryption'] === 'tls') {
            $config['encryption'] = 'ssl';
        } elseif ($config['port'] === 587 && $config['encryption'] === 'ssl') {
            $config['encryption'] = 'tls';
        }

        return $config;
    }
}

if (!function_exists('primex_html_to_plain_text')) {
    function primex_html_to_plain_text(string $html): string {
        $text = preg_replace('/<\s*br\s*\/?>/i', "\n", $html);
        $text = preg_replace('/<\/(?:p|div|h1|h2|h3|h4|tr|li)>/i', "\n", (string)$text);
        $text = strip_tags((string)$text);
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = preg_replace("/\n{3,}/", "\n\n", (string)$text);
        return trim((string)$text);
    }
}

if (!function_exists('primex_smtp_read')) {
    function primex_smtp_read($socket): array {
        $response = '';
        $code = 0;
        while (!feof($socket)) {
            $line = @fgets($socket, 1024);
            if ($line === false) {
                break;
            }
            $response .= $line;
            if (preg_match('/^(\d{3})([ -])/', $line, $m)) {
                $code = (int)$m[1];
                if ($m[2] === ' ') {
                    break;
                }
            } else {
                break;
            }
        }
        return ['code' => $code, 'raw' => trim($response)];
    }
}

if (!function_exists('primex_smtp_cmd')) {
    function primex_smtp_cmd($socket, string $command, array $expectedCodes): array {
        if (@fwrite($socket, $command . "\r\n") === false) {
            return ['ok' => false, 'code' => 0, 'raw' => 'Failed writing SMTP command'];
        }
        $reply = primex_smtp_read($socket);
        return [
            'ok'   => in_array($reply['code'], $expectedCodes, true),
            'code' => $reply['code'],
            'raw'  => $reply['raw'],
        ];
    }
}

if (!function_exists('primex_log_smtp_error')) {
    function primex_log_smtp_error(string $stage, string $detail, array $meta = []): void {
        $safeMeta = array_merge($meta, ['stage' => $stage, 'detail' => $detail]);
        if (function_exists('primex_record_log')) {
            primex_record_log('EMAIL', 'SMTP_DELIVERY_FAILED', 'Transactional email dispatch failed', $safeMeta, 'ERROR');
        }
        error_log('[PrimeX Mailer] ' . $stage . ': ' . $detail);
    }
}

if (!function_exists('primex_send_smtp_email')) {
    /**
     * Send a secure HTML + plain-text email over Hostinger SMTP (SSL 465 or STARTTLS 587).
     * Never exposes credentials or raw SMTP socket responses in the return array.
     */
    function primex_send_smtp_email(
        string $to,
        string $subject,
        string $htmlBody,
        ?array $overrideConfig = null,
        ?string $textBody = null
    ): array {
        $toClean = primex_sanitize_mail_header($to);
        if (!filter_var($toClean, FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'Invalid recipient email address.', 'error' => 'Invalid recipient email address.'];
        }

        $cfg = $overrideConfig ?? primex_load_smtp_config();
        $host = primex_sanitize_mail_header((string)($cfg['host'] ?? ''));
        $port = (int)($cfg['port'] ?? 465);
        $enc  = strtolower(trim((string)($cfg['encryption'] ?? 'ssl')));
        $user = primex_sanitize_mail_header((string)($cfg['user'] ?? ''));
        $pass = (string)($cfg['pass'] ?? '');
        $from = primex_sanitize_mail_header((string)($cfg['from'] ?? ''));
        $fromName = primex_sanitize_mail_header((string)($cfg['from_name'] ?? 'Prime X Capital'));
        $subjectClean = primex_sanitize_mail_header($subject);

        $safeFail = static function (string $stage, string $internalDetail, int $code = 0) use ($host, $port, $enc): array {
            primex_log_smtp_error($stage, $internalDetail, [
                'host' => $host,
                'port' => $port,
                'encryption' => $enc,
                'smtp_code' => $code,
            ]);
            return [
                'success' => false,
                'message' => 'Email delivery is currently unavailable. Please try again later.',
                'error'   => 'Email delivery failed.',
            ];
        };

        if ($host === '' || !preg_match('/^[A-Za-z0-9.\-]+$/', $host)) {
            return $safeFail('CONFIG_HOST', 'SMTP host is empty or invalid');
        }
        if ($port < 1 || $port > 65535) {
            return $safeFail('CONFIG_PORT', 'SMTP port out of range');
        }
        if (!in_array($enc, ['ssl', 'tls', 'none'], true)) {
            return $safeFail('CONFIG_ENC', 'Unsupported SMTP encryption mode');
        }
        if ($from === '' || !filter_var($from, FILTER_VALIDATE_EMAIL)) {
            return $safeFail('CONFIG_FROM', 'Sender email address is missing or invalid');
        }
        if ($user === '' || primex_is_placeholder_secret($pass)) {
            return $safeFail('CONFIG_AUTH', 'SMTP mailbox username or password is not configured');
        }

        $transport = ($enc === 'ssl') ? "ssl://{$host}:{$port}" : "tcp://{$host}:{$port}";
        $ctx = stream_context_create([
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
                'allow_self_signed' => false,
            ]
        ]);

        $errno = 0;
        $errstr = '';
        $socket = @stream_socket_client($transport, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
        if (!$socket) {
            return $safeFail('CONNECT', "Socket connection error ({$errno}): {$errstr}");
        }
        stream_set_timeout($socket, 15);

        $closeAndFail = static function (string $stage, string $detail, int $code = 0) use ($socket, $safeFail): array {
            @fwrite($socket, "QUIT\r\n");
            @fclose($socket);
            return $safeFail($stage, $detail, $code);
        };

        $greet = primex_smtp_read($socket);
        if ($greet['code'] !== 220) {
            return $closeAndFail('GREETING', $greet['raw'] ?: 'No SMTP greeting received', $greet['code']);
        }

        $appHost = parse_url(primex_app_url(), PHP_URL_HOST) ?: '';
        $ehloHost = preg_replace('/[^A-Za-z0-9.\-]/', '', (string)($appHost ?: ($_SERVER['HTTP_HOST'] ?? 'prime-x-capital.com'))) ?: 'prime-x-capital.com';
        $ehlo = primex_smtp_cmd($socket, "EHLO {$ehloHost}", [250]);
        if (!$ehlo['ok']) {
            $helo = primex_smtp_cmd($socket, "HELO {$ehloHost}", [250]);
            if (!$helo['ok']) {
                return $closeAndFail('EHLO', $ehlo['raw'] ?: $helo['raw'], $ehlo['code']);
            }
        }

        if ($enc === 'tls') {
            $starttls = primex_smtp_cmd($socket, 'STARTTLS', [220]);
            if (!$starttls['ok']) {
                return $closeAndFail('STARTTLS', $starttls['raw'], $starttls['code']);
            }
            $cryptoMethod = defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')
                ? (STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT') ? STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT : 0))
                : STREAM_CRYPTO_METHOD_TLS_CLIENT;
            if (!@stream_socket_enable_crypto($socket, true, $cryptoMethod)) {
                return $closeAndFail('TLS_HANDSHAKE', 'TLS crypto negotiation failed');
            }
            $ehlo2 = primex_smtp_cmd($socket, "EHLO {$ehloHost}", [250]);
            if (!$ehlo2['ok']) {
                return $closeAndFail('POST_TLS_EHLO', $ehlo2['raw'], $ehlo2['code']);
            }
        }

        $auth = primex_smtp_cmd($socket, 'AUTH LOGIN', [334]);
        if ($auth['ok']) {
            $uRes = primex_smtp_cmd($socket, base64_encode($user), [334]);
            if (!$uRes['ok']) {
                return $closeAndFail('AUTH_USER', $uRes['raw'], $uRes['code']);
            }
            $pRes = primex_smtp_cmd($socket, base64_encode($pass), [235]);
            if (!$pRes['ok']) {
                return $closeAndFail('AUTH_PASS', $pRes['raw'], $pRes['code']);
            }
        } else {
            $plain = base64_encode("\0" . $user . "\0" . $pass);
            $pAuth = primex_smtp_cmd($socket, 'AUTH PLAIN ' . $plain, [235]);
            if (!$pAuth['ok']) {
                return $closeAndFail('AUTH_PLAIN', $pAuth['raw'] ?: $auth['raw'], $pAuth['code']);
            }
        }

        $mailFrom = primex_smtp_cmd($socket, "MAIL FROM:<{$from}>", [250]);
        if (!$mailFrom['ok']) {
            return $closeAndFail('MAIL_FROM', $mailFrom['raw'], $mailFrom['code']);
        }

        $rcptTo = primex_smtp_cmd($socket, "RCPT TO:<{$toClean}>", [250, 251]);
        if (!$rcptTo['ok']) {
            return $closeAndFail('RCPT_TO', $rcptTo['raw'], $rcptTo['code']);
        }

        $dataCmd = primex_smtp_cmd($socket, 'DATA', [354]);
        if (!$dataCmd['ok']) {
            return $closeAndFail('DATA', $dataCmd['raw'], $dataCmd['code']);
        }

        $plainText = ($textBody !== null && trim($textBody) !== '')
            ? trim($textBody)
            : primex_html_to_plain_text($htmlBody);

        $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
        $encodedSubject  = '=?UTF-8?B?' . base64_encode($subjectClean) . '?=';
        $messageId = '<' . bin2hex(random_bytes(12)) . '@' . $ehloHost . '>';
        $boundary = 'b1_' . bin2hex(random_bytes(16));

        $headers = [
            'Date: ' . gmdate('D, d M Y H:i:s +0000'),
            "From: {$encodedFromName} <{$from}>",
            "To: <{$toClean}>",
            "Reply-To: <{$from}>",
            "Subject: {$encodedSubject}",
            "Message-ID: {$messageId}",
            'MIME-Version: 1.0',
            "Content-Type: multipart/alternative; boundary=\"{$boundary}\"",
        ];

        $textEncoded = rtrim(chunk_split(base64_encode($plainText)));
        $htmlEncoded = rtrim(chunk_split(base64_encode($htmlBody)));

        $mimeParts = [
            "--{$boundary}",
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            $textEncoded,
            '',
            "--{$boundary}",
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            $htmlEncoded,
            '',
            "--{$boundary}--",
        ];

        $rawMessage = implode("\r\n", $headers) . "\r\n\r\n" . implode("\r\n", $mimeParts) . "\r\n.";
        $rawMessage = preg_replace('/\r\n\.(?=\r\n)/', "\r\n..", $rawMessage);

        $sent = primex_smtp_cmd($socket, (string)$rawMessage, [250]);
        if (!$sent['ok']) {
            return $closeAndFail('SEND_BODY', $sent['raw'], $sent['code']);
        }

        @fwrite($socket, "QUIT\r\n");
        @fclose($socket);

        return ['success' => true, 'message' => 'Email sent successfully.'];
    }
}

if (!function_exists('primex_send_templated_email')) {
    function primex_send_templated_email(string $to, array $template): array {
        $subject = (string)($template['subject'] ?? 'Prime X Capital Notification');
        $html = (string)($template['html'] ?? '');
        $text = isset($template['text']) ? (string)$template['text'] : null;
        return primex_send_smtp_email($to, $subject, $html, null, $text);
    }
}
