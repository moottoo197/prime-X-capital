<?php
/**
 * Pure-PHP Institutional SMTP Mailer
 * Reads SMTP credentials from Supabase `system_settings` (with env fallback).
 * Supports SMTPS (ssl:// port 465), STARTTLS (port 587), and plain AUTH LOGIN/PLAIN.
 */

function primex_sanitize_mail_header(string $value): string {
    return trim(str_replace(["\r", "\n", "\0"], '', $value));
}

function primex_load_smtp_config(?SupabaseClient $supabase = null): array {
    $config = [
        'host'       => (string)(getenv('SMTP_HOST') ?: ''),
        'port'       => (int)(getenv('SMTP_PORT') ?: 587),
        'encryption' => strtolower((string)(getenv('SMTP_ENCRYPTION') ?: 'tls')),
        'user'       => (string)(getenv('SMTP_USER') ?: ''),
        'pass'       => (string)(getenv('SMTP_PASS') ?: ''),
        'from'       => (string)(getenv('SMTP_FROM') ?: ''),
        'from_name'  => (string)(getenv('SMTP_FROM_NAME') ?: 'PRIME X CAPITAL'),
    ];

    if ($supabase === null && function_exists('getSupabaseClient')) {
        $supabase = getSupabaseClient();
    }

    if ($supabase && $supabase->isConfigured()) {
        $res = $supabase->select('system_settings', [
            'setting_key' => 'in.(SMTP_HOST,SMTP_PORT,SMTP_ENCRYPTION,SMTP_USER,SMTP_PASS,SMTP_FROM,SMTP_FROM_NAME)'
        ]);
        if (!empty($res['success']) && is_array($res['data'])) {
            $map = [];
            foreach ($res['data'] as $row) {
                $k = strtoupper(trim((string)($row['setting_key'] ?? '')));
                if ($k !== '') {
                    $map[$k] = (string)($row['setting_value'] ?? '');
                }
            }
            if (!empty($map['SMTP_HOST']))       $config['host'] = trim($map['SMTP_HOST']);
            if (!empty($map['SMTP_PORT']))       $config['port'] = max(1, min(65535, (int)$map['SMTP_PORT']));
            if (isset($map['SMTP_ENCRYPTION']) && $map['SMTP_ENCRYPTION'] !== '') {
                $enc = strtolower(trim($map['SMTP_ENCRYPTION']));
                if (in_array($enc, ['tls', 'ssl', 'none'], true)) {
                    $config['encryption'] = $enc;
                }
            }
            if (isset($map['SMTP_USER']) && $map['SMTP_USER'] !== '') $config['user'] = trim($map['SMTP_USER']);
            if (isset($map['SMTP_PASS']) && $map['SMTP_PASS'] !== '') $config['pass'] = $map['SMTP_PASS'];
            if (!empty($map['SMTP_FROM']))       $config['from'] = trim($map['SMTP_FROM']);
            if (!empty($map['SMTP_FROM_NAME']))  $config['from_name'] = trim($map['SMTP_FROM_NAME']);
        }
    }

    if ($config['from'] === '' && filter_var($config['user'], FILTER_VALIDATE_EMAIL)) {
        $config['from'] = $config['user'];
    }
    if ($config['port'] === 465 && $config['encryption'] === 'tls') {
        $config['encryption'] = 'ssl';
    }

    return $config;
}

function primex_smtp_read($socket): array {
    $response = '';
    $code = 0;
    while (!feof($socket)) {
        $line = @fgets($socket, 1024);
        if ($line === false) break;
        $response .= $line;
        if (preg_match('/^(\d{3})([ -])/', $line, $m)) {
            $code = (int)$m[1];
            if ($m[2] === ' ') break;
        } else {
            break;
        }
    }
    return ['code' => $code, 'raw' => trim($response)];
}

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

function primex_send_smtp_email(string $to, string $subject, string $htmlBody, ?array $overrideConfig = null): array {
    $toClean = primex_sanitize_mail_header($to);
    if (!filter_var($toClean, FILTER_VALIDATE_EMAIL)) {
        return ['success' => false, 'error' => 'Invalid recipient email address.'];
    }

    $cfg = $overrideConfig ?? primex_load_smtp_config();
    $host = primex_sanitize_mail_header((string)($cfg['host'] ?? ''));
    $port = (int)($cfg['port'] ?? 587);
    $enc  = strtolower(trim((string)($cfg['encryption'] ?? 'tls')));
    $user = primex_sanitize_mail_header((string)($cfg['user'] ?? ''));
    $pass = (string)($cfg['pass'] ?? '');
    $from = primex_sanitize_mail_header((string)($cfg['from'] ?? ''));
    $fromName = primex_sanitize_mail_header((string)($cfg['from_name'] ?? 'PRIME X CAPITAL'));
    $subjectClean = primex_sanitize_mail_header($subject);

    if ($host === '' || !preg_match('/^[A-Za-z0-9.\-]+$/', $host)) {
        return ['success' => false, 'error' => 'SMTP host is not configured or invalid.'];
    }
    if ($port < 1 || $port > 65535) {
        return ['success' => false, 'error' => 'SMTP port must be between 1 and 65535.'];
    }
    if ($from === '' || !filter_var($from, FILTER_VALIDATE_EMAIL)) {
        return ['success' => false, 'error' => 'Valid SMTP From email address is required.'];
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
    $socket = @stream_socket_client($transport, $errno, $errstr, 12, STREAM_CLIENT_CONNECT, $ctx);
    if (!$socket) {
        return ['success' => false, 'error' => "SMTP connection failed ({$errno}): {$errstr}"];
    }
    stream_set_timeout($socket, 12);

    $closeWithError = static function (string $msg) use ($socket): array {
        @fwrite($socket, "QUIT\r\n");
        @fclose($socket);
        return ['success' => false, 'error' => $msg];
    };

    $greet = primex_smtp_read($socket);
    if ($greet['code'] !== 220) {
        return $closeWithError('SMTP greeting failed: ' . ($greet['raw'] ?: 'No response'));
    }

    $ehloHost = preg_replace('/[^A-Za-z0-9.\-]/', '', (string)($_SERVER['HTTP_HOST'] ?? 'localhost')) ?: 'localhost';
    $ehlo = primex_smtp_cmd($socket, "EHLO {$ehloHost}", [250]);
    if (!$ehlo['ok']) {
        $helo = primex_smtp_cmd($socket, "HELO {$ehloHost}", [250]);
        if (!$helo['ok']) {
            return $closeWithError('SMTP EHLO/HELO rejected: ' . $ehlo['raw']);
        }
    }

    if ($enc === 'tls') {
        $starttls = primex_smtp_cmd($socket, 'STARTTLS', [220]);
        if (!$starttls['ok']) {
            return $closeWithError('SMTP STARTTLS failed: ' . $starttls['raw']);
        }
        $cryptoMethod = defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')
            ? (STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT') ? STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT : 0))
            : STREAM_CRYPTO_METHOD_TLS_CLIENT;
        if (!@stream_socket_enable_crypto($socket, true, $cryptoMethod)) {
            return $closeWithError('TLS encryption negotiation failed.');
        }
        $ehlo2 = primex_smtp_cmd($socket, "EHLO {$ehloHost}", [250]);
        if (!$ehlo2['ok']) {
            return $closeWithError('SMTP post-TLS EHLO failed: ' . $ehlo2['raw']);
        }
    }

    if ($user !== '') {
        $auth = primex_smtp_cmd($socket, 'AUTH LOGIN', [334]);
        if ($auth['ok']) {
            $uRes = primex_smtp_cmd($socket, base64_encode($user), [334]);
            if (!$uRes['ok']) {
                return $closeWithError('SMTP username rejected: ' . $uRes['raw']);
            }
            $pRes = primex_smtp_cmd($socket, base64_encode($pass), [235]);
            if (!$pRes['ok']) {
                return $closeWithError('SMTP authentication failed: ' . $pRes['raw']);
            }
        } else {
            $plain = base64_encode("\0" . $user . "\0" . $pass);
            $pAuth = primex_smtp_cmd($socket, 'AUTH PLAIN ' . $plain, [235]);
            if (!$pAuth['ok']) {
                return $closeWithError('SMTP AUTH rejected: ' . ($pAuth['raw'] ?: $auth['raw']));
            }
        }
    }

    $mailFrom = primex_smtp_cmd($socket, "MAIL FROM:<{$from}>", [250]);
    if (!$mailFrom['ok']) {
        return $closeWithError('MAIL FROM rejected: ' . $mailFrom['raw']);
    }

    $rcptTo = primex_smtp_cmd($socket, "RCPT TO:<{$toClean}>", [250, 251]);
    if (!$rcptTo['ok']) {
        return $closeWithError('RCPT TO rejected: ' . $rcptTo['raw']);
    }

    $dataCmd = primex_smtp_cmd($socket, 'DATA', [354]);
    if (!$dataCmd['ok']) {
        return $closeWithError('SMTP DATA command rejected: ' . $dataCmd['raw']);
    }

    $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $encodedSubject  = '=?UTF-8?B?' . base64_encode($subjectClean) . '?=';
    $messageId = '<' . bin2hex(random_bytes(12)) . '@' . $ehloHost . '>';

    $headers = [
        'Date: ' . gmdate('D, d M Y H:i:s +0000'),
        "From: {$encodedFromName} <{$from}>",
        "To: <{$toClean}>",
        "Reply-To: <{$from}>",
        "Subject: {$encodedSubject}",
        "Message-ID: {$messageId}",
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
    ];

    $normalizedBody = chunk_split(base64_encode($htmlBody));
    $rawMessage = implode("\r\n", $headers) . "\r\n\r\n" . $normalizedBody . "\r\n.";
    // Dot-stuffing safety for single dots on a line
    $rawMessage = preg_replace('/\r\n\.(?=\r\n)/', "\r\n..", $rawMessage);

    $sent = primex_smtp_cmd($socket, $rawMessage, [250]);
    if (!$sent['ok']) {
        return $closeWithError('SMTP message body rejected: ' . $sent['raw']);
    }

    @fwrite($socket, "QUIT\r\n");
    @fclose($socket);

    return ['success' => true, 'message' => "Email dispatched to {$toClean} via {$host}:{$port}"];
}
