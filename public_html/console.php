<?php
/**
 * PRIME X CAPITAL - Restricted Platform Control Console (/console)
 * Strictly inaccessible to standard users and never linked from the user dashboard or admin panel UI.
 */

declare(strict_types=1);

define('PRIMEX_LOGS_WEB_ENTRY', true);

require_once __DIR__ . '/api/bootstrap.php';
require_once __DIR__ . '/api/lib/mailer.php';

$serverLogsFallback = dirname(__DIR__) . '/server/logs.php';
if (!function_exists('primex_write_log') && is_file($serverLogsFallback)) {
    require_once $serverLogsFallback;
}

if (!headers_sent()) {
    header('X-Robots-Tag: noindex, nofollow');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0, proxy-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Content-Type: text/html; charset=utf-8');
}

function primex_console_h($value): string {
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function primex_console_verify_csrf(string $csrfCookie): bool {
    $submitted = (string)($_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    if ($csrfCookie === '' || $submitted === '' || !hash_equals($csrfCookie, $submitted)) {
        return false;
    }
    $origin = trim((string)($_SERVER['HTTP_ORIGIN'] ?? ''));
    $host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
    if ($origin !== '' && $host !== '') {
        $originHost = strtolower((string)(parse_url($origin, PHP_URL_HOST) ?? ''));
        $originPort = parse_url($origin, PHP_URL_PORT);
        $normalizedOriginHost = $originPort ? ($originHost . ':' . $originPort) : $originHost;
        if ($originHost !== $host && $normalizedOriginHost !== $host) {
            return false;
        }
    }
    return true;
}

$csrfCookie = ensureCsrfCookie();
$supabase = getSupabaseClient();
$currentUser = getCurrentUser();
$adminRoles = ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'KYC_MANAGER'];

// Strictly enforce administrator privileges for any authenticated visitor.
if ($currentUser !== null) {
    $currentUser = primex_normalize_effective_user($currentUser);
    $userRole = strtoupper(trim((string)($currentUser['role'] ?? 'USER')));
    $userActive = !isset($currentUser['is_active']) || (bool)$currentUser['is_active'];
    if (!$userActive || !in_array($userRole, $adminRoles, true)) {
        if (function_exists('primex_write_log')) {
            primex_write_log(
                'SECURITY',
                'CONSOLE_UNAUTHORIZED_USER_ATTEMPT',
                'Blocked non-admin user access to /console',
                ['role' => $userRole, 'is_active' => $userActive],
                'SECURITY',
                (string)($currentUser['id'] ?? ''),
                (string)($currentUser['email'] ?? '')
            );
        }
        http_response_code(403);
        ?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>403 Forbidden · PRIME X CAPITAL</title>
  <style>
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;display:grid;place-items:center;padding:20px;background:#F7F8FA;color:#111827;font-family:Inter,system-ui,-apple-system,sans-serif}
    .panel{width:min(100%,420px);background:#FFFFFF;border:1px solid #EEF1F6;border-radius:20px;padding:30px 26px;box-shadow:0 20px 45px rgba(15,23,42,.08);text-align:center}
    h1{margin:0 0 8px;font-size:20px;font-weight:800;color:#DC2626}
    p{margin:0 0 20px;font-size:13.5px;color:#6B7280;line-height:1.55}
    .btn{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 20px;border-radius:12px;background:#0052FF;color:#FFFFFF;font-size:13.5px;font-weight:700;text-decoration:none}
  </style>
</head>
<body>
  <main class="panel">
    <h1>403 · Restricted Access</h1>
    <p>This system console is restricted to authorized platform administrators only.</p>
    <a class="btn" href="/">Return to Platform</a>
  </main>
</body>
</html><?php
        exit();
    }
}

// Handle unauthenticated visitors: show admin-only sign-in gate.
$authError = '';
if ($currentUser === null) {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST' && ($_POST['action'] ?? '') === 'admin_login') {
        if (!primex_console_verify_csrf($csrfCookie)) {
            $authError = 'Security verification expired. Please refresh and try again.';
        } else {
            $email = strtolower(trim((string)($_POST['email'] ?? '')));
            $password = (string)($_POST['password'] ?? '');
            if ($email === '' || $password === '') {
                $authError = 'Administrator email and password are required.';
            } elseif (!$supabase->isConfigured()) {
                $authError = 'Authentication backend is unavailable.';
            } elseif (($rateMsg = checkLoginRateLimit($email, true)) !== null) {
                $authError = $rateMsg;
            } else {
                $userProfile = primex_find_profile_by_email($supabase, $email);
                $isWhitelistedAdmin = primex_is_admin_email($email);
                $authenticated = false;

                if ($userProfile && !empty($userProfile['password_hash']) && password_verify($password, (string)$userProfile['password_hash'])) {
                    $authenticated = true;
                }
                if (!$authenticated) {
                    $sbAuth = $supabase->authSignIn($email, $password);
                    if ($sbAuth['success'] && !empty($sbAuth['data']['access_token'])) {
                        $authenticated = true;
                    }
                }

                $masterPassword = defined('ADMIN_MASTER_PASSWORD') ? (string)ADMIN_MASTER_PASSWORD : '';
                if (
                    !$authenticated &&
                    strlen($masterPassword) >= 12 &&
                    strpos($masterPassword, 'REPLACE_WITH_') !== 0 &&
                    $isWhitelistedAdmin &&
                    hash_equals($masterPassword, $password)
                ) {
                    $authenticated = true;
                    $adminId = !empty($userProfile['id']) ? (string)$userProfile['id'] : primex_deterministic_uuid('admin:' . $email);
                    $masterProfile = [
                        'id' => $adminId,
                        'email' => $email,
                        'password_hash' => password_hash($password, PASSWORD_BCRYPT),
                        'role' => 'SUPER_ADMIN',
                        'is_active' => 1,
                        'kyc_status' => 'APPROVED',
                        'referral_code' => !empty($userProfile['referral_code']) ? (string)$userProfile['referral_code'] : ('ADM' . strtoupper(substr(hash('sha256', $email), 0, 6))),
                        'created_at' => !empty($userProfile['created_at']) ? (string)$userProfile['created_at'] : gmdate('Y-m-d H:i:s'),
                        'updated_at' => gmdate('Y-m-d H:i:s')
                    ];
                    $upsertRes = $supabase->upsert('profiles', [$masterProfile], 'id');
                    if (empty($upsertRes['success'])) {
                        $supabase->upsert('profiles', [[
                            'id' => $adminId,
                            'email' => $email,
                            'password_hash' => $masterProfile['password_hash'],
                            'role' => 'SUPER_ADMIN',
                            'is_active' => 1
                        ]], 'id');
                    }
                    $userProfile = array_merge($userProfile ?: [], $masterProfile);
                }

                if ($authenticated && $userProfile && $isWhitelistedAdmin) {
                    $currentRole = strtoupper(trim((string)($userProfile['role'] ?? 'USER')));
                    if (!in_array($currentRole, $adminRoles, true)) {
                        $userProfile['role'] = 'SUPER_ADMIN';
                        if (!empty($userProfile['id'])) {
                            $supabase->update('profiles', [
                                'role' => 'SUPER_ADMIN',
                                'updated_at' => gmdate('Y-m-d H:i:s')
                            ], ['id' => 'eq.' . $userProfile['id']]);
                        }
                    }
                }

                $profileRole = strtoupper(trim((string)($userProfile['role'] ?? 'USER')));
                $isActive = !isset($userProfile['is_active']) || (bool)$userProfile['is_active'];

                if (!$authenticated || !$userProfile || !$isActive || !in_array($profileRole, $adminRoles, true)) {
                    recordLoginFailure($email);
                    if (function_exists('primex_write_log')) {
                        primex_write_log(
                            'SECURITY',
                            'CONSOLE_LOGIN_DENIED',
                            'Denied login attempt on /console',
                            ['role' => $profileRole],
                            'SECURITY',
                            $userProfile['id'] ?? null,
                            $email
                        );
                    }
                    $authError = 'Invalid administrator credentials or insufficient privileges.';
                } else {
                    clearLoginFailures($email);
                    primex_create_session($userProfile);
                    if (function_exists('primex_write_log')) {
                        primex_write_log(
                            'AUTH',
                            'CONSOLE_ADMIN_LOGIN',
                            'Administrator authenticated on /console',
                            ['role' => $profileRole],
                            'INFO',
                            (string)$userProfile['id'],
                            $email
                        );
                    }
                    header('Location: /console', true, 303);
                    exit();
                }
            }
        }
    }

    http_response_code($authError !== '' ? 403 : 401);
    ?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Platform Console · Administrator Sign In · PRIME X CAPITAL</title>
  <link rel="icon" type="image/webp" href="/assets/aistudio/primex-mark_326fd678.webp">
  <style>
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;display:grid;place-items:center;padding:20px;background:radial-gradient(circle at top left, rgba(0,82,255,.08), transparent 45%), #F7F8FA;color:#111827;font-family:Inter,system-ui,-apple-system,sans-serif}
    .panel{width:min(100%,440px);background:#FFFFFF;border:1px solid #EEF1F6;border-radius:22px;padding:30px 26px;box-shadow:0 22px 48px rgba(15,23,42,.08)}
    .brand{display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #EEF1F6}
    .brand img{width:42px;height:42px;border-radius:12px;object-fit:contain;background:#FFFFFF;border:1px solid #EEF1F6;padding:4px}
    .brand-title{font-size:16px;font-weight:800;color:#111827;letter-spacing:-.01em}
    .brand-sub{font-size:11px;font-weight:700;color:#0052FF;letter-spacing:.06em;text-transform:uppercase;margin-top:2px}
    h1{margin:0 0 6px;font-size:21px;font-weight:800;letter-spacing:-.01em}
    .desc{margin:0 0 20px;font-size:13.5px;color:#6B7280;line-height:1.55}
    .err{margin-bottom:16px;padding:11px 14px;border-radius:12px;background:#FEF2F2;border:1px solid #FECACA;color:#B91C1C;font-size:13px;font-weight:600}
    label{display:block;font-size:12.5px;font-weight:700;color:#374151;margin-bottom:6px}
    .pw-wrap{position:relative;margin-bottom:16px}
    input[type=email],.pw-wrap input{width:100%;height:46px;padding:0 14px;border:1px solid #D1D5DB;border-radius:12px;font-size:14px;color:#111827;background:#F8FAFC;outline:none;transition:border-color .15s, box-shadow .15s, background .15s}
    input[type=email]{margin-bottom:14px}
    .pw-wrap input{padding-right:46px}
    input:focus{border-color:#0052FF;background:#FFFFFF;box-shadow:0 0 0 3px rgba(0,82,255,.12)}
    .eye-btn{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:34px;height:34px;border:0;border-radius:8px;background:transparent;color:#6B7280;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
    .eye-btn:hover{background:#EEF1F6;color:#111827}
    .submit-btn{width:100%;height:48px;border:0;border-radius:12px;background:linear-gradient(135deg,#0052FF,#1D6FFF);color:#FFFFFF;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 8px 20px rgba(0,82,255,.22)}
    .submit-btn:hover{background:linear-gradient(135deg,#0044D6,#0052FF)}
  </style>
</head>
<body>
  <main class="panel">
    <div class="brand">
      <img src="/assets/aistudio/primex-mark_326fd678.webp" alt="PRIME X CAPITAL">
      <div>
        <div class="brand-title">PRIME X CAPITAL</div>
        <div class="brand-sub">Hidden Control Console</div>
      </div>
    </div>
    <h1>Administrator Sign In</h1>
    <p class="desc">Protected system console for feature flags and Hostinger SMTP email settings. Standard users are blocked.</p>
    <?php if ($authError !== ''): ?>
      <div class="err"><?= primex_console_h($authError) ?></div>
    <?php endif; ?>
    <form method="post" action="/console" autocomplete="on">
      <input type="hidden" name="action" value="admin_login">
      <input type="hidden" name="csrf_token" value="<?= primex_console_h($csrfCookie) ?>">
      <label for="console-email">Administrator Email</label>
      <input id="console-email" name="email" type="email" required placeholder="admin@prime-x-capital.com" autocomplete="username">
      <label for="console-password">Password</label>
      <div class="pw-wrap">
        <input id="console-password" name="password" type="password" required placeholder="Enter administrator password" autocomplete="current-password">
        <button type="button" class="eye-btn" onclick="togglePw('console-password', this)" aria-label="Show password">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
      <button type="submit" class="submit-btn">Authenticate &amp; Open Console</button>
    </form>
  </main>
  <script>
    function togglePw(id, btn) {
      var el = document.getElementById(id);
      if (!el) return;
      var show = el.type === 'password';
      el.type = show ? 'text' : 'password';
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    }
  </script>
</body>
</html><?php
    exit();
}

// Authenticated Administrator Actions
$flashOk = '';
$flashErr = '';

$loadAllSettings = static function () use ($supabase): array {
    $envHost = primex_env_first(['SMTP_HOST'], 'smtp.hostinger.com');
    $envPort = primex_env_first(['SMTP_PORT'], '465');
    $envEnc  = strtolower(primex_env_first(['SMTP_ENCRYPTION'], $envPort === '587' ? 'tls' : 'ssl'));
    $envUser = primex_env_first(['SMTP_USERNAME', 'SMTP_USER'], '');
    $envPass = primex_env_first(['SMTP_PASSWORD', 'SMTP_PASS'], '');
    $envFrom = primex_env_first(['MAIL_FROM_ADDRESS', 'SMTP_FROM'], $envUser);
    $envName = primex_env_first(['MAIL_FROM_NAME', 'SMTP_FROM_NAME'], 'Prime X Capital');

    $map = [
        'FEATURE_LANGUAGE_ENABLED' => '1',
        'MAINTENANCE_MODE'         => '0',
        'SMTP_HOST'                => $envHost,
        'SMTP_PORT'                => $envPort,
        'SMTP_ENCRYPTION'          => $envEnc,
        'SMTP_USER'                => $envUser,
        'SMTP_PASS'                => $envPass,
        'SMTP_FROM'                => $envFrom,
        'SMTP_FROM_NAME'           => $envName,
        'APP_URL'                  => function_exists('primex_app_url') ? primex_app_url() : 'https://prime-x-capital.com',
        '_env_smtp_configured'     => ($envPass !== '' && $envUser !== '') ? '1' : '0',
    ];

    if ($supabase->isConfigured()) {
        $res = $supabase->select('system_settings', [
            'setting_key' => 'in.(FEATURE_LANGUAGE_ENABLED,MAINTENANCE_MODE,SMTP_HOST,SMTP_PORT,SMTP_ENCRYPTION,SMTP_USER,SMTP_USERNAME,SMTP_PASS,SMTP_PASSWORD,SMTP_FROM,MAIL_FROM_ADDRESS,SMTP_FROM_NAME,MAIL_FROM_NAME)'
        ]);
        if (!empty($res['success']) && is_array($res['data'])) {
            $aliasMap = [
                'SMTP_USERNAME'     => 'SMTP_USER',
                'SMTP_PASSWORD'     => 'SMTP_PASS',
                'MAIL_FROM_ADDRESS' => 'SMTP_FROM',
                'MAIL_FROM_NAME'    => 'SMTP_FROM_NAME',
            ];
            foreach ($res['data'] as $row) {
                $rawKey = strtoupper(trim((string)($row['setting_key'] ?? '')));
                $k = $aliasMap[$rawKey] ?? $rawKey;
                $v = (string)($row['setting_value'] ?? '');
                if ($k === '' || !isset($map[$k])) {
                    continue;
                }
                if (in_array($k, ['FEATURE_LANGUAGE_ENABLED', 'MAINTENANCE_MODE'], true)) {
                    $map[$k] = $v;
                } elseif (trim($v) !== '' && !primex_is_placeholder_secret($v)) {
                    $map[$k] = $v;
                }
            }
        }
    }

    if ($map['SMTP_FROM'] === '' && filter_var($map['SMTP_USER'], FILTER_VALIDATE_EMAIL)) {
        $map['SMTP_FROM'] = $map['SMTP_USER'];
    }
    return $map;
};

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    if (!primex_console_verify_csrf($csrfCookie)) {
        $flashErr = 'Security token validation failed. Please refresh and submit again.';
    } elseif (!$supabase->isConfigured()) {
        $flashErr = 'Supabase backend is not configured.';
    } else {
        $action = trim((string)($_POST['action'] ?? ''));
        $now = gmdate('Y-m-d H:i:s');
        $adminEmail = (string)($currentUser['email'] ?? '');
        $adminId = (string)($currentUser['id'] ?? '');

        if ($action === 'save_features') {
            $langEnabled = !empty($_POST['feature_language_enabled']) ? '1' : '0';
            $maintEnabled = !empty($_POST['maintenance_mode']) ? '1' : '0';

            $rows = [
                [
                    'setting_key'   => 'FEATURE_LANGUAGE_ENABLED',
                    'setting_value' => $langEnabled,
                    'description'   => 'Global language selector toggle (user dashboard + admin panel)',
                    'updated_at'    => $now,
                ],
                [
                    'setting_key'   => 'MAINTENANCE_MODE',
                    'setting_value' => $maintEnabled,
                    'description'   => 'Platform maintenance mode switch',
                    'updated_at'    => $now,
                ]
            ];
            $up = $supabase->upsert('system_settings', $rows, 'setting_key');
            if (!empty($up['success'])) {
                $flashOk = 'Feature controls updated. Language switcher is now ' . ($langEnabled === '1' ? 'ENABLED' : 'DISABLED') . ' across the website.';
                primex_record_log('ADMIN', 'CONSOLE_FEATURES_UPDATED', 'Updated feature flags via /console', [
                    'language_enabled' => $langEnabled,
                    'maintenance_mode' => $maintEnabled,
                ], 'INFO', $adminId, $adminEmail);
            } else {
                $flashErr = 'Unable to save feature toggles: ' . ($up['message'] ?? 'Database error');
            }
        } elseif ($action === 'save_smtp') {
            $existingCfg = $loadAllSettings();
            $smtpHost = trim((string)($_POST['smtp_host'] ?? ''));
            $smtpPort = (int)($_POST['smtp_port'] ?? 465);
            $smtpEnc  = strtolower(trim((string)($_POST['smtp_encryption'] ?? 'ssl')));
            $smtpUser = trim((string)($_POST['smtp_user'] ?? ''));
            $smtpPass = (string)($_POST['smtp_pass'] ?? '');
            $clearPass = !empty($_POST['clear_smtp_pass']);
            $smtpFrom = trim((string)($_POST['smtp_from'] ?? ''));
            $smtpFromName = trim((string)($_POST['smtp_from_name'] ?? 'Prime X Capital'));

            if ($smtpHost !== '' && !preg_match('/^[A-Za-z0-9.\-]+$/', $smtpHost)) {
                $flashErr = 'SMTP host contains invalid characters.';
            } elseif ($smtpPort < 1 || $smtpPort > 65535) {
                $flashErr = 'SMTP port must be between 1 and 65535.';
            } elseif (!in_array($smtpEnc, ['tls', 'ssl', 'none'], true)) {
                $flashErr = 'Invalid SMTP encryption protocol selected.';
            } elseif ($smtpFrom !== '' && !filter_var($smtpFrom, FILTER_VALIDATE_EMAIL)) {
                $flashErr = 'From Email must be a valid email address.';
            } else {
                $rows = [
                    ['setting_key' => 'SMTP_HOST',       'setting_value' => primex_sanitize_mail_header($smtpHost), 'description' => 'SMTP server hostname', 'updated_at' => $now],
                    ['setting_key' => 'SMTP_PORT',       'setting_value' => (string)$smtpPort, 'description' => 'SMTP server port', 'updated_at' => $now],
                    ['setting_key' => 'SMTP_ENCRYPTION', 'setting_value' => $smtpEnc, 'description' => 'SMTP encryption mode (ssl/tls/none)', 'updated_at' => $now],
                    ['setting_key' => 'SMTP_USER',       'setting_value' => primex_sanitize_mail_header($smtpUser), 'description' => 'SMTP authentication username', 'updated_at' => $now],
                    ['setting_key' => 'SMTP_FROM',       'setting_value' => primex_sanitize_mail_header($smtpFrom), 'description' => 'Outbound sender email address', 'updated_at' => $now],
                    ['setting_key' => 'SMTP_FROM_NAME',  'setting_value' => primex_sanitize_mail_header($smtpFromName ?: 'Prime X Capital'), 'description' => 'Outbound sender display name', 'updated_at' => $now],
                ];
                if ($clearPass) {
                    $rows[] = ['setting_key' => 'SMTP_PASS', 'setting_value' => '', 'description' => 'SMTP password cleared by admin', 'updated_at' => $now];
                } elseif ($smtpPass !== '') {
                    $rows[] = ['setting_key' => 'SMTP_PASS', 'setting_value' => $smtpPass, 'description' => 'SMTP authentication password', 'updated_at' => $now];
                }

                $up = $supabase->upsert('system_settings', $rows, 'setting_key');
                if (!empty($up['success'])) {
                    $flashOk = $clearPass
                        ? 'SMTP settings updated and stored SMTP password cleared.'
                        : 'SMTP configuration saved securely. All credentials remain preserved.';
                    primex_record_log('ADMIN', 'CONSOLE_SMTP_UPDATED', 'Updated SMTP settings via /console', [
                        'smtp_host' => $smtpHost,
                        'smtp_port' => $smtpPort,
                        'smtp_enc'  => $smtpEnc,
                        'smtp_user' => $smtpUser,
                        'pass_changed' => ($smtpPass !== '' && $smtpPass !== $existingCfg['SMTP_PASS']) || $clearPass,
                    ], 'INFO', $adminId, $adminEmail);
                } else {
                    $flashErr = 'Unable to save SMTP settings: ' . ($up['message'] ?? 'Database error');
                }
            }
        } elseif ($action === 'send_test_email') {
            $testTo = trim((string)($_POST['test_to'] ?? ''));
            if (!filter_var($testTo, FILTER_VALIDATE_EMAIL)) {
                $flashErr = 'Enter a valid recipient email address for the SMTP test.';
            } else {
                $appUrl = primex_app_url();
                $utcNow = gmdate('Y-m-d H:i:s') . ' UTC';
                require_once __DIR__ . '/api/lib/email_templates.php';
                $bodyHtml = ''
                    . '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#374151;">This is a live delivery test sent from your <strong>Prime X Capital</strong> Platform Control Console.</p>'
                    . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:18px 0;background-color:#F7F8FA;border:1px solid #EEF1F6;border-radius:12px;">'
                    . '<tr><td style="padding:14px 16px;font-size:13px;line-height:1.6;color:#4B5563;">'
                    . '<strong>Status:</strong> Outbound Hostinger SMTP authenticated &amp; operational<br>'
                    . '<strong>Timestamp:</strong> ' . primex_console_h($utcNow) . '</td></tr></table>'
                    . '<p style="margin:0;font-size:12.5px;line-height:1.55;color:#6B7280;">If you did not trigger this test, inspect your administrator logs immediately.</p>';
                $html = primex_email_layout(
                    'SMTP Delivery Test Confirmed',
                    'Your Prime X Capital Hostinger SMTP relay is working properly.',
                    $bodyHtml,
                    'Sent via Prime X Capital transactional email relay.',
                    'DELIVERY VERIFIED',
                    '#00B87C',
                    '#ECFDF5'
                );
                $text = "Prime X Capital SMTP Delivery Test\n\nOutbound Hostinger SMTP delivery succeeded at {$utcNow}.\nPlatform URL: {$appUrl}\n";
                $mailRes = primex_send_smtp_email($testTo, 'Prime X Capital · SMTP Delivery Verified', $html, null, $text);
                if (!empty($mailRes['success'])) {
                    $flashOk = 'Test email dispatched successfully to ' . $testTo . '. Check your inbox.';
                } else {
                    $flashErr = 'SMTP test delivery failed. Check secure server logs (/logs) for connection diagnostics.';
                }
            }
        }
    }
}

$cfg = $loadAllSettings();
$langOn = ($cfg['FEATURE_LANGUAGE_ENABLED'] !== '0');
$maintOn = ($cfg['MAINTENANCE_MODE'] === '1');
$hasSmtpPass = ($cfg['SMTP_PASS'] !== '');
$envSynced = ($cfg['_env_smtp_configured'] === '1');
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Platform Control Console · PRIME X CAPITAL</title>
  <link rel="icon" type="image/webp" href="/assets/aistudio/primex-mark_326fd678.webp">
  <style>
    :root{
      --bg:#F7F8FA;
      --card:#FFFFFF;
      --surface:#F8FAFC;
      --border:#EEF1F6;
      --border-strong:#D8DEE9;
      --text:#111827;
      --text-sec:#4B5563;
      --muted:#6B7280;
      --blue:#0052FF;
      --blue-hover:#0044D6;
      --blue-soft:#EFF4FF;
      --green:#00B87C;
      --green-soft:#ECFDF5;
      --red:#F6465D;
      --red-soft:#FEF2F2;
      --amber:#D97706;
      --amber-soft:#FFFBEB;
      --shadow-sm:0 2px 8px rgba(15,23,42,.04);
      --shadow-md:0 12px 32px rgba(15,23,42,.06);
    }
    *{box-sizing:border-box}
    body{
      margin:0;
      background:var(--bg);
      color:var(--text);
      font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
      line-height:1.5;
      -webkit-font-smoothing:antialiased;
    }
    .topbar{
      position:sticky;
      top:0;
      z-index:30;
      background:rgba(255,255,255,.94);
      backdrop-filter:blur(12px);
      border-bottom:1px solid var(--border);
    }
    .topbar-inner{
      max-width:1160px;
      margin:0 auto;
      padding:12px 18px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:14px;
      flex-wrap:wrap;
    }
    .brand{display:flex;align-items:center;gap:12px;min-width:0}
    .brand-logo{
      width:38px;height:38px;border-radius:11px;object-fit:contain;
      border:1px solid var(--border);padding:3px;background:#FFF;
      box-shadow:var(--shadow-sm);
    }
    .brand h1{margin:0;font-size:15.5px;font-weight:800;letter-spacing:-.01em;color:var(--text)}
    .brand span{display:block;font-size:11px;font-weight:700;color:var(--blue);letter-spacing:.05em;text-transform:uppercase}
    .top-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .admin-chip{
      display:inline-flex;align-items:center;gap:6px;
      padding:6px 12px;border-radius:999px;
      background:var(--surface);border:1px solid var(--border);
      font-size:12px;font-weight:600;color:var(--text-sec);
    }
    .dot{width:7px;height:7px;border-radius:50%;background:var(--green)}
    .btn{
      display:inline-flex;align-items:center;justify-content:center;gap:7px;
      min-height:40px;padding:8px 15px;border-radius:11px;
      font-size:13px;font-weight:700;text-decoration:none;cursor:pointer;
      border:1px solid var(--border-strong);background:#FFF;color:var(--text);
      transition:all .15s ease;
    }
    .btn:hover{background:var(--surface);border-color:#CBD5E1}
    .btn-primary{
      background:linear-gradient(135deg,#0052FF,#1D6FFF);
      border-color:var(--blue);color:#FFF;
      box-shadow:0 6px 16px rgba(0,82,255,.20);
    }
    .btn-primary:hover{background:linear-gradient(135deg,#0044D6,#0052FF);border-color:var(--blue-hover)}
    .btn-soft{background:var(--blue-soft);border-color:rgba(0,82,255,.18);color:var(--blue)}
    .btn-soft:hover{background:#E0EAFF}

    .wrap{max-width:1160px;margin:0 auto;padding:22px 18px 48px}

    .status-strip{
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:14px;
      margin-bottom:20px;
    }
    @media (max-width:860px){.status-strip{grid-template-columns:1fr}}
    .stat-card{
      background:var(--card);
      border:1px solid var(--border);
      border-radius:16px;
      padding:16px 18px;
      box-shadow:var(--shadow-sm);
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:12px;
    }
    .stat-k{font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
    .stat-v{font-size:16px;font-weight:800;color:var(--text);margin-top:4px}
    .stat-sub{font-size:12px;color:var(--muted);margin-top:3px;word-break:break-word}

    .alert{
      padding:13px 16px;border-radius:13px;margin-bottom:18px;
      font-size:13.5px;font-weight:600;border:1px solid transparent;
      display:flex;align-items:center;gap:10px;
    }
    .alert-ok{background:var(--green-soft);border-color:rgba(0,184,124,.28);color:#065F46}
    .alert-err{background:var(--red-soft);border-color:rgba(246,70,93,.28);color:#991B1B}

    .grid{
      display:grid;
      grid-template-columns:minmax(0,.9fr) minmax(0,1.25fr);
      gap:18px;
      align-items:start;
    }
    @media (max-width:960px){.grid{grid-template-columns:1fr}}
    .card{
      background:var(--card);
      border:1px solid var(--border);
      border-radius:20px;
      padding:22px;
      box-shadow:var(--shadow-md);
    }
    .card-head{
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:12px;
      flex-wrap:wrap;
      padding-bottom:16px;
      margin-bottom:18px;
      border-bottom:1px solid var(--border);
    }
    .card h2{margin:0 0 3px;font-size:16.5px;font-weight:800;letter-spacing:-.01em}
    .card-sub{margin:0;font-size:12.5px;color:var(--muted);line-height:1.45}

    .pill{
      display:inline-flex;align-items:center;gap:5px;
      padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;white-space:nowrap;
    }
    .pill-on{background:var(--green-soft);color:#047857;border:1px solid rgba(0,184,124,.3)}
    .pill-off{background:var(--red-soft);color:#B91C1C;border:1px solid rgba(246,70,93,.3)}
    .pill-blue{background:var(--blue-soft);color:var(--blue);border:1px solid rgba(0,82,255,.22)}

    .toggle-row{
      display:flex;align-items:center;justify-content:space-between;gap:14px;
      padding:15px 16px;background:var(--surface);border:1px solid var(--border);
      border-radius:14px;margin-bottom:12px;cursor:pointer;transition:border-color .15s ease;
    }
    .toggle-row:hover{border-color:#CBD5E1}
    .toggle-title{font-size:13.5px;font-weight:700;color:var(--text)}
    .toggle-desc{font-size:12px;color:var(--muted);margin-top:3px;line-height:1.45}
    .switch{position:relative;display:inline-flex;width:48px;height:26px;flex-shrink:0}
    .switch input{opacity:0;width:0;height:0;position:absolute}
    .track{position:absolute;inset:0;background:#CBD5E1;border-radius:999px;transition:background .18s ease}
    .track::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#FFF;box-shadow:0 1px 3px rgba(15,23,42,.24);transition:transform .18s ease}
    .switch input:checked + .track{background:var(--blue)}
    .switch input:checked + .track::after{transform:translateX(22px)}

    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    @media (max-width:560px){.form-grid{grid-template-columns:1fr}}
    .field{margin-bottom:14px}
    .field label{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12.5px;font-weight:700;color:#374151;margin-bottom:6px}
    .field-hint{font-size:11px;font-weight:600;color:var(--muted)}
    .field input,.field select{
      width:100%;min-height:44px;padding:9px 13px;
      border:1px solid var(--border-strong);border-radius:12px;
      font-size:13.5px;color:var(--text);background:var(--surface);outline:none;
      transition:border-color .15s ease, box-shadow .15s ease, background .15s ease;
    }
    .field input:focus,.field select:focus{
      border-color:var(--blue);background:#FFF;box-shadow:0 0 0 3px rgba(0,82,255,.12);
    }
    .pw-field-wrap{position:relative}
    .pw-field-wrap input{padding-right:86px}
    .pw-toggle-btn{
      position:absolute;right:6px;top:50%;transform:translateY(-50%);
      height:32px;padding:0 10px;border-radius:8px;border:1px solid var(--border);
      background:#FFFFFF;color:var(--text-sec);font-size:11.5px;font-weight:700;
      display:inline-flex;align-items:center;gap:5px;cursor:pointer;
      transition:background .15s ease, color .15s ease, border-color .15s ease;
    }
    .pw-toggle-btn:hover{background:var(--blue-soft);color:var(--blue);border-color:rgba(0,82,255,.25)}

    .preset-bar{
      display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;
      padding:11px 14px;border-radius:12px;background:var(--blue-soft);
      border:1px solid rgba(0,82,255,.16);margin-bottom:16px;
    }
    .preset-label{font-size:12px;font-weight:700;color:#1E3A8A}
    .preset-actions{display:flex;gap:8px;flex-wrap:wrap}
    .preset-btn{
      height:30px;padding:0 10px;border-radius:8px;border:1px solid rgba(0,82,255,.25);
      background:#FFF;color:var(--blue);font-size:11.5px;font-weight:700;cursor:pointer;
    }
    .preset-btn:hover{background:var(--blue);color:#FFF}

    .clear-pw-label{
      display:inline-flex;align-items:center;gap:7px;margin-top:8px;
      font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;
    }
    .clear-pw-label input{width:auto;min-height:0;accent-color:var(--red)}

    .test-box{
      margin-top:20px;padding:18px;border-radius:16px;
      background:var(--surface);border:1px solid var(--border);
    }
    .inline-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
    .inline-row input{
      flex:1 1 220px;min-height:44px;padding:9px 13px;
      border:1px solid var(--border-strong);border-radius:12px;
      font-size:13.5px;background:#FFF;outline:none;
    }
    .inline-row input:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(0,82,255,.12)}
  </style>
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <img class="brand-logo" src="/assets/aistudio/primex-mark_326fd678.webp" alt="PRIME X CAPITAL">
        <div>
          <h1>Platform Control Console</h1>
          <span>Admin Only · Unlisted Route (/console)</span>
        </div>
      </div>
      <div class="top-actions">
        <span class="admin-chip">
          <span class="dot" aria-hidden="true"></span>
          <span><?= primex_console_h($currentUser['email'] ?? 'Administrator') ?></span>
        </span>
        <a class="btn" href="/logs">Logs</a>
        <a class="btn btn-soft" href="/?view=admin">Admin Panel</a>
        <a class="btn" href="/">Website</a>
      </div>
    </div>
  </header>

  <main class="wrap">
    <?php if ($flashOk !== ''): ?>
      <div class="alert alert-ok" role="status">
        <span>&#10003;</span>
        <span><?= primex_console_h($flashOk) ?></span>
      </div>
    <?php endif; ?>
    <?php if ($flashErr !== ''): ?>
      <div class="alert alert-err" role="alert">
        <span>&#9888;</span>
        <span><?= primex_console_h($flashErr) ?></span>
      </div>
    <?php endif; ?>

    <!-- Overview Strip -->
    <section class="status-strip" aria-label="Console status summary">
      <div class="stat-card">
        <div>
          <div class="stat-k">SMTP Relay</div>
          <div class="stat-v"><?= primex_console_h($cfg['SMTP_HOST'] ?: 'Not configured') ?></div>
          <div class="stat-sub">Port <?= primex_console_h($cfg['SMTP_PORT'] ?: '465') ?> &middot; <?= strtoupper(primex_console_h($cfg['SMTP_ENCRYPTION'] ?: 'ssl')) ?></div>
        </div>
        <span class="pill <?= $hasSmtpPass ? 'pill-on' : 'pill-off' ?>">
          <?= $hasSmtpPass ? 'Ready' : 'No Password' ?>
        </span>
      </div>

      <div class="stat-card">
        <div>
          <div class="stat-k">Environment &amp; Links</div>
          <div class="stat-v"><?= primex_console_h(parse_url($cfg['APP_URL'], PHP_URL_HOST) ?: 'prime-x-capital.com') ?></div>
          <div class="stat-sub"><?= $envSynced ? 'server/.env SMTP detected' : 'Managed via console / GitHub Secrets' ?></div>
        </div>
        <span class="pill pill-blue"><?= $envSynced ? '.env Synced' : 'DB Store' ?></span>
      </div>

      <div class="stat-card">
        <div>
          <div class="stat-k">Platform Modules</div>
          <div class="stat-v">Language: <?= $langOn ? 'ON' : 'OFF' ?></div>
          <div class="stat-sub">Maintenance Mode: <?= $maintOn ? 'ACTIVE' : 'Normal Live' ?></div>
        </div>
        <span class="pill <?= $langOn ? 'pill-on' : 'pill-off' ?>">
          <?= $maintOn ? 'Maint' : 'Live' ?>
        </span>
      </div>
    </section>

    <div class="grid">
      <!-- Card 1: Website Feature Toggles -->
      <section class="card">
        <div class="card-head">
          <div>
            <h2>Website Feature Controls</h2>
            <p class="card-sub">Toggle global UI modules across both User Dashboard and Admin Panel.</p>
          </div>
          <span class="pill <?= $langOn ? 'pill-on' : 'pill-off' ?>">
            Language: <?= $langOn ? 'ON' : 'OFF' ?>
          </span>
        </div>

        <form method="post" action="/console">
          <input type="hidden" name="action" value="save_features">
          <input type="hidden" name="csrf_token" value="<?= primex_console_h($csrfCookie) ?>">

          <label class="toggle-row" for="toggle-lang">
            <div>
              <div class="toggle-title">Website Language Switcher</div>
              <div class="toggle-desc">When turned OFF, all language selectors and translation buttons are hidden across User Dashboard, Landing, Auth, and Admin Panel.</div>
            </div>
            <span class="switch">
              <input id="toggle-lang" type="checkbox" name="feature_language_enabled" value="1" <?= $langOn ? 'checked' : '' ?>>
              <span class="track"></span>
            </span>
          </label>

          <label class="toggle-row" for="toggle-maint">
            <div>
              <div class="toggle-title">Maintenance Mode</div>
              <div class="toggle-desc">Broadcasts platform maintenance status flag via system configuration API.</div>
            </div>
            <span class="switch">
              <input id="toggle-maint" type="checkbox" name="maintenance_mode" value="1" <?= $maintOn ? 'checked' : '' ?>>
              <span class="track"></span>
            </span>
          </label>

          <button type="submit" class="btn btn-primary" style="width:100%;margin-top:6px;">Save Feature Controls</button>
        </form>
      </section>

      <!-- Card 2: Hostinger SMTP Configuration & Delivery Test -->
      <section class="card">
        <div class="card-head">
          <div>
            <h2>Hostinger SMTP Configuration</h2>
            <p class="card-sub">Manage outbound transactional email credentials for registration, password resets, and alerts.</p>
          </div>
          <span class="pill <?= $hasSmtpPass ? 'pill-on' : 'pill-off' ?>">
            <?= $hasSmtpPass ? 'Credentials Active' : 'Password Required' ?>
          </span>
        </div>

        <div class="preset-bar">
          <span class="preset-label">Hostinger Quick Presets:</span>
          <div class="preset-actions">
            <button type="button" class="preset-btn" onclick="applySmtpPreset('ssl', 465)">SSL · Port 465 (Recommended)</button>
            <button type="button" class="preset-btn" onclick="applySmtpPreset('tls', 587)">STARTTLS · Port 587</button>
          </div>
        </div>

        <form method="post" action="/console" autocomplete="off">
          <input type="hidden" name="action" value="save_smtp">
          <input type="hidden" name="csrf_token" value="<?= primex_console_h($csrfCookie) ?>">

          <div class="form-grid">
            <div class="field">
              <label for="smtp-host">SMTP Host</label>
              <input id="smtp-host" name="smtp_host" type="text" value="<?= primex_console_h($cfg['SMTP_HOST']) ?>" placeholder="smtp.hostinger.com">
            </div>
            <div class="field">
              <label for="smtp-port">SMTP Port</label>
              <input id="smtp-port" name="smtp_port" type="number" min="1" max="65535" value="<?= primex_console_h($cfg['SMTP_PORT'] ?: '465') ?>" placeholder="465">
            </div>
          </div>

          <div class="form-grid">
            <div class="field">
              <label for="smtp-enc">Encryption</label>
              <select id="smtp-enc" name="smtp_encryption" onchange="syncPortWithEncryption(this.value)">
                <option value="ssl" <?= $cfg['SMTP_ENCRYPTION'] === 'ssl' ? 'selected' : '' ?>>SSL / TLS (Port 465 · Recommended)</option>
                <option value="tls" <?= $cfg['SMTP_ENCRYPTION'] === 'tls' ? 'selected' : '' ?>>STARTTLS (Port 587 · Fallback)</option>
                <option value="none" <?= $cfg['SMTP_ENCRYPTION'] === 'none' ? 'selected' : '' ?>>None (Unencrypted)</option>
              </select>
            </div>
            <div class="field">
              <label for="smtp-user">SMTP Username</label>
              <input id="smtp-user" name="smtp_user" type="text" value="<?= primex_console_h($cfg['SMTP_USER']) ?>" placeholder="no-reply@prime-x-capital.com" autocomplete="off">
            </div>
          </div>

          <div class="field">
            <label for="smtp-pass">
              <span>SMTP Password</span>
              <span class="field-hint"><?= $hasSmtpPass ? 'Saved &amp; preserved on save' : 'Not set yet' ?></span>
            </label>
            <div class="pw-field-wrap">
              <input id="smtp-pass" name="smtp_pass" type="password" value="<?= primex_console_h($cfg['SMTP_PASS']) ?>" placeholder="Enter Hostinger mailbox password" autocomplete="off" spellcheck="false">
              <button type="button" id="btn-toggle-smtp-pass" class="pw-toggle-btn" onclick="toggleSmtpPassword()" aria-label="Show SMTP password" aria-pressed="false">
                <svg id="icon-eye-open" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg id="icon-eye-closed" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="display:none;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                <span id="txt-toggle-smtp-pass">Show</span>
              </button>
            </div>
            <?php if ($hasSmtpPass): ?>
              <label class="clear-pw-label">
                <input type="checkbox" name="clear_smtp_pass" value="1">
                <span>Clear stored SMTP password on next save</span>
              </label>
            <?php endif; ?>
          </div>

          <div class="form-grid">
            <div class="field">
              <label for="smtp-from">From Email Address</label>
              <input id="smtp-from" name="smtp_from" type="email" value="<?= primex_console_h($cfg['SMTP_FROM']) ?>" placeholder="no-reply@prime-x-capital.com">
            </div>
            <div class="field">
              <label for="smtp-from-name">From Display Name</label>
              <input id="smtp-from-name" name="smtp_from_name" type="text" value="<?= primex_console_h($cfg['SMTP_FROM_NAME']) ?>" placeholder="Prime X Capital">
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%;">Save SMTP Configuration</button>
        </form>

        <div class="test-box">
          <form method="post" action="/console">
            <input type="hidden" name="action" value="send_test_email">
            <input type="hidden" name="csrf_token" value="<?= primex_console_h($csrfCookie) ?>">
            <label for="test-to" style="display:block;font-size:12.5px;font-weight:700;color:#111827;margin-bottom:4px;">Send Delivery Test Email</label>
            <p style="margin:0 0 10px;font-size:12px;color:var(--muted);">Verifies live Hostinger SMTP authentication and branded template rendering.</p>
            <div class="inline-row">
              <input id="test-to" name="test_to" type="email" required value="<?= primex_console_h($currentUser['email'] ?? '') ?>" placeholder="recipient@domain.com">
              <button type="submit" class="btn btn-soft">Send Test Email</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  </main>

  <script>
    function toggleSmtpPassword() {
      var input = document.getElementById('smtp-pass');
      var btn = document.getElementById('btn-toggle-smtp-pass');
      var txt = document.getElementById('txt-toggle-smtp-pass');
      var eyeOpen = document.getElementById('icon-eye-open');
      var eyeClosed = document.getElementById('icon-eye-closed');
      if (!input || !btn) return;
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-pressed', show ? 'true' : 'false');
      btn.setAttribute('aria-label', show ? 'Hide SMTP password' : 'Show SMTP password');
      if (txt) txt.textContent = show ? 'Hide' : 'Show';
      if (eyeOpen) eyeOpen.style.display = show ? 'none' : 'inline';
      if (eyeClosed) eyeClosed.style.display = show ? 'inline' : 'none';
    }

    function applySmtpPreset(enc, port) {
      var hostEl = document.getElementById('smtp-host');
      var encEl = document.getElementById('smtp-enc');
      var portEl = document.getElementById('smtp-port');
      if (hostEl && !hostEl.value.trim()) hostEl.value = 'smtp.hostinger.com';
      if (encEl) encEl.value = enc;
      if (portEl) portEl.value = String(port);
    }

    function syncPortWithEncryption(enc) {
      var portEl = document.getElementById('smtp-port');
      if (!portEl) return;
      if (enc === 'ssl' && (portEl.value === '587' || !portEl.value)) portEl.value = '465';
      if (enc === 'tls' && (portEl.value === '465' || !portEl.value)) portEl.value = '587';
    }
  </script>
</body>
</html>
