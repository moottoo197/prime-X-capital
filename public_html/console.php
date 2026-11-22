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
    body{margin:0;min-height:100vh;display:grid;place-items:center;padding:20px;background:#F4F6FA;color:#111827;font-family:Inter,system-ui,-apple-system,sans-serif}
    .panel{width:min(100%,420px);background:#FFFFFF;border:1px solid #E5E7EB;border-radius:20px;padding:28px 24px;box-shadow:0 18px 44px rgba(15,23,42,.08);text-align:center}
    h1{margin:0 0 8px;font-size:20px;font-weight:800;color:#B91C1C}
    p{margin:0 0 20px;font-size:13px;color:#6B7280;line-height:1.5}
    .btn{display:inline-flex;align-items:center;justify-content:center;height:42px;padding:0 18px;border-radius:12px;background:#0052FF;color:#FFFFFF;font-size:13px;font-weight:700;text-decoration:none}
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
    body{margin:0;min-height:100vh;display:grid;place-items:center;padding:20px;background:#F4F6FA;color:#111827;font-family:Inter,system-ui,-apple-system,sans-serif}
    .panel{width:min(100%,420px);background:#FFFFFF;border:1px solid #E5E7EB;border-radius:20px;padding:28px 24px;box-shadow:0 18px 44px rgba(15,23,42,.08)}
    .brand{display:flex;align-items:center;gap:10px;margin-bottom:18px}
    .brand img{width:38px;height:38px;border-radius:10px;object-fit:contain;background:#FFFFFF;border:1px solid #E5E7EB;padding:3px}
    .brand-title{font-size:15px;font-weight:800;color:#111827}
    .brand-sub{font-size:11px;font-weight:700;color:#0052FF;letter-spacing:.05em;text-transform:uppercase}
    h1{margin:0 0 6px;font-size:20px;font-weight:800}
    .desc{margin:0 0 18px;font-size:13px;color:#6B7280;line-height:1.5}
    .err{margin-bottom:14px;padding:10px 12px;border-radius:10px;background:#FEF2F2;border:1px solid #FECACA;color:#B91C1C;font-size:13px;font-weight:600}
    label{display:block;font-size:12px;font-weight:700;color:#374151;margin-bottom:6px}
    input[type=email],input[type=password]{width:100%;height:46px;padding:0 14px;border:1px solid #D1D5DB;border-radius:12px;font-size:14px;color:#111827;background:#F9FAFB;margin-bottom:14px;outline:none}
    input:focus{border-color:#0052FF;background:#FFFFFF;box-shadow:0 0 0 3px rgba(0,82,255,.12)}
    button{width:100%;height:46px;border:0;border-radius:12px;background:#0052FF;color:#FFFFFF;font-size:14px;font-weight:700;cursor:pointer}
    button:hover{background:#0044D6}
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
    <p class="desc">Protected system console for feature switches and SMTP configuration. Standard user accounts are blocked.</p>
    <?php if ($authError !== ''): ?>
      <div class="err"><?= primex_console_h($authError) ?></div>
    <?php endif; ?>
    <form method="post" action="/console" autocomplete="on">
      <input type="hidden" name="action" value="admin_login">
      <input type="hidden" name="csrf_token" value="<?= primex_console_h($csrfCookie) ?>">
      <label for="console-email">Administrator Email</label>
      <input id="console-email" name="email" type="email" required placeholder="admin@alphavestapp.com" autocomplete="username">
      <label for="console-password">Password</label>
      <input id="console-password" name="password" type="password" required placeholder="Enter administrator password" autocomplete="current-password">
      <button type="submit">Authenticate &amp; Open Console</button>
    </form>
  </main>
</body>
</html><?php
    exit();
}

// Authenticated Administrator Actions
$flashOk = '';
$flashErr = '';

$loadAllSettings = static function () use ($supabase): array {
    $map = [
        'FEATURE_LANGUAGE_ENABLED' => '1',
        'MAINTENANCE_MODE'         => '0',
        'SMTP_HOST'                => (string)(getenv('SMTP_HOST') ?: ''),
        'SMTP_PORT'                => (string)(getenv('SMTP_PORT') ?: '587'),
        'SMTP_ENCRYPTION'          => strtolower((string)(getenv('SMTP_ENCRYPTION') ?: 'tls')),
        'SMTP_USER'                => (string)(getenv('SMTP_USER') ?: ''),
        'SMTP_PASS'                => (string)(getenv('SMTP_PASS') ?: ''),
        'SMTP_FROM'                => (string)(getenv('SMTP_FROM') ?: ''),
        'SMTP_FROM_NAME'           => (string)(getenv('SMTP_FROM_NAME') ?: 'PRIME X CAPITAL'),
    ];
    if ($supabase->isConfigured()) {
        $res = $supabase->select('system_settings', [
            'setting_key' => 'in.(FEATURE_LANGUAGE_ENABLED,MAINTENANCE_MODE,SMTP_HOST,SMTP_PORT,SMTP_ENCRYPTION,SMTP_USER,SMTP_PASS,SMTP_FROM,SMTP_FROM_NAME)'
        ]);
        if (!empty($res['success']) && is_array($res['data'])) {
            foreach ($res['data'] as $row) {
                $k = strtoupper(trim((string)($row['setting_key'] ?? '')));
                if ($k !== '' && isset($map[$k])) {
                    $map[$k] = (string)($row['setting_value'] ?? '');
                }
            }
        }
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
                $flashOk = 'Feature controls updated. Language switcher is now ' . ($langEnabled === '1' ? 'ENABLED' : 'DISABLED') . ' across the entire website.';
                primex_record_log('ADMIN', 'CONSOLE_FEATURES_UPDATED', 'Updated feature flags via /console', [
                    'language_enabled' => $langEnabled,
                    'maintenance_mode' => $maintEnabled,
                ], 'INFO', $adminId, $adminEmail);
            } else {
                $flashErr = 'Unable to save feature toggles: ' . ($up['message'] ?? 'Database error');
            }
        } elseif ($action === 'save_smtp') {
            $smtpHost = trim((string)($_POST['smtp_host'] ?? ''));
            $smtpPort = (int)($_POST['smtp_port'] ?? 587);
            $smtpEnc  = strtolower(trim((string)($_POST['smtp_encryption'] ?? 'tls')));
            $smtpUser = trim((string)($_POST['smtp_user'] ?? ''));
            $smtpPass = (string)($_POST['smtp_pass'] ?? '');
            $clearPass = !empty($_POST['clear_smtp_pass']);
            $smtpFrom = trim((string)($_POST['smtp_from'] ?? ''));
            $smtpFromName = trim((string)($_POST['smtp_from_name'] ?? 'PRIME X CAPITAL'));

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
                    ['setting_key' => 'SMTP_ENCRYPTION', 'setting_value' => $smtpEnc, 'description' => 'SMTP encryption mode (tls/ssl/none)', 'updated_at' => $now],
                    ['setting_key' => 'SMTP_USER',       'setting_value' => primex_sanitize_mail_header($smtpUser), 'description' => 'SMTP authentication username', 'updated_at' => $now],
                    ['setting_key' => 'SMTP_FROM',       'setting_value' => primex_sanitize_mail_header($smtpFrom), 'description' => 'Outbound sender email address', 'updated_at' => $now],
                    ['setting_key' => 'SMTP_FROM_NAME',  'setting_value' => primex_sanitize_mail_header($smtpFromName ?: 'PRIME X CAPITAL'), 'description' => 'Outbound sender display name', 'updated_at' => $now],
                ];
                if ($clearPass) {
                    $rows[] = ['setting_key' => 'SMTP_PASS', 'setting_value' => '', 'description' => 'SMTP password cleared by admin', 'updated_at' => $now];
                } elseif ($smtpPass !== '') {
                    $rows[] = ['setting_key' => 'SMTP_PASS', 'setting_value' => $smtpPass, 'description' => 'SMTP authentication password', 'updated_at' => $now];
                }

                $up = $supabase->upsert('system_settings', $rows, 'setting_key');
                if (!empty($up['success'])) {
                    $flashOk = 'SMTP configuration saved securely to Supabase.';
                    primex_record_log('ADMIN', 'CONSOLE_SMTP_UPDATED', 'Updated SMTP settings via /console', [
                        'smtp_host' => $smtpHost,
                        'smtp_port' => $smtpPort,
                        'smtp_enc'  => $smtpEnc,
                        'smtp_user' => $smtpUser,
                        'pass_changed' => ($smtpPass !== '' || $clearPass),
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
                $subject = 'PRIME X CAPITAL · SMTP Delivery Verification';
                $html = '<div style="font-family:Inter,Arial,sans-serif;padding:24px;background:#F4F6FA;color:#111827;">'
                      . '<div style="max-width:520px;margin:0 auto;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:16px;padding:24px;">'
                      . '<h2 style="margin:0 0 8px;color:#0052FF;">SMTP Configuration Verified</h2>'
                      . '<p style="margin:0 0 12px;font-size:14px;line-height:1.5;color:#374151;">This test email confirms your PRIME X CAPITAL outbound SMTP server is properly authenticated and operational.</p>'
                      . '<p style="margin:0;font-size:12px;color:#6B7280;">Dispatched at ' . gmdate('Y-m-d H:i:s') . ' UTC</p>'
                      . '</div></div>';
                $mailRes = primex_send_smtp_email($testTo, $subject, $html);
                if (!empty($mailRes['success'])) {
                    $flashOk = $mailRes['message'] ?? 'Test email sent successfully.';
                } else {
                    $flashErr = 'SMTP test failed: ' . ($mailRes['error'] ?? 'Unknown delivery error');
                }
            }
        }
    }
}

$cfg = $loadAllSettings();
$langOn = ($cfg['FEATURE_LANGUAGE_ENABLED'] !== '0');
$maintOn = ($cfg['MAINTENANCE_MODE'] === '1');
$hasSmtpPass = ($cfg['SMTP_PASS'] !== '');
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
      --bg:#F4F6FA;
      --card:#FFFFFF;
      --border:#E5E7EB;
      --text:#111827;
      --muted:#6B7280;
      --blue:#0052FF;
      --blue-dark:#0044D6;
      --green:#059669;
      --red:#DC2626;
    }
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,-apple-system,sans-serif;line-height:1.5}
    .topbar{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--border)}
    .topbar-inner{max-width:1100px;margin:0 auto;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
    .brand{display:flex;align-items:center;gap:10px;min-width:0}
    .brand img{width:34px;height:34px;border-radius:10px;object-fit:contain;border:1px solid var(--border);padding:2px;background:#FFF}
    .brand h1{margin:0;font-size:15.5px;font-weight:800}
    .brand span{display:block;font-size:11px;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.05em}
    .top-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:40px;padding:8px 14px;border-radius:10px;font-size:13px;font-weight:700;text-decoration:none;cursor:pointer;border:1px solid var(--border);background:#FFF;color:var(--text)}
    .btn:hover{background:#F9FAFB}
    .btn-primary{background:var(--blue);border-color:var(--blue);color:#FFF}
    .btn-primary:hover{background:var(--blue-dark)}
    .wrap{max-width:1100px;margin:0 auto;padding:18px 16px 40px}
    .alert{padding:12px 15px;border-radius:12px;margin-bottom:16px;font-size:13px;font-weight:600;border:1px solid transparent}
    .alert-ok{background:#ECFDF5;border-color:#A7F3D0;color:#065F46}
    .alert-err{background:#FEF2F2;border-color:#FECACA;color:#991B1B}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}
    @media (max-width:860px){.grid{grid-template-columns:1fr}}
    .card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:18px;box-shadow:0 4px 16px rgba(15,23,42,.04)}
    .card h2{margin:0 0 4px;font-size:16px;font-weight:800}
    .card-sub{margin:0 0 16px;font-size:12.5px;color:var(--muted)}
    .toggle-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px;background:#F8FAFC;border:1px solid #EEF1F6;border-radius:12px;margin-bottom:12px}
    .toggle-title{font-size:13.5px;font-weight:700;color:var(--text)}
    .toggle-desc{font-size:12px;color:var(--muted);margin-top:2px}
    .switch{position:relative;display:inline-flex;width:48px;height:26px;flex-shrink:0;cursor:pointer}
    .switch input{opacity:0;width:0;height:0;position:absolute}
    .track{position:absolute;inset:0;background:#CBD5E1;border-radius:999px;transition:background .18s ease}
    .track::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#FFF;box-shadow:0 1px 3px rgba(15,23,42,.2);transition:transform .18s ease}
    .switch input:checked + .track{background:var(--blue)}
    .switch input:checked + .track::after{transform:translateX(22px)}
    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    @media (max-width:540px){.form-grid{grid-template-columns:1fr}}
    .field{margin-bottom:12px}
    .field label{display:block;font-size:12px;font-weight:700;color:#374151;margin-bottom:5px}
    .field input,.field select{width:100%;min-height:42px;padding:8px 12px;border:1px solid #D1D5DB;border-radius:10px;font-size:13.5px;color:var(--text);background:#FFF;outline:none}
    .field input:focus,.field select:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(0,82,255,.12)}
    .pill{display:inline-flex;align-items:center;padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700}
    .pill-on{background:#ECFDF5;color:#059669;border:1px solid #A7F3D0}
    .pill-off{background:#FEF2F2;color:#DC2626;border:1px solid #FECACA}
    .meta-row{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:14px}
    .test-box{margin-top:16px;padding-top:16px;border-top:1px solid #EEF1F6}
    .inline-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
    .inline-row input{flex:1 1 200px;min-height:42px;padding:8px 12px;border:1px solid #D1D5DB;border-radius:10px;font-size:13.5px}
  </style>
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <img src="/assets/aistudio/primex-mark_326fd678.webp" alt="PRIME X CAPITAL">
        <div>
          <h1>Platform Control Console</h1>
          <span>Admin Only · Unlisted Route (/console)</span>
        </div>
      </div>
      <div class="top-actions">
        <span style="font-size:12px;font-weight:600;color:var(--muted);"><?= primex_console_h($currentUser['email'] ?? 'Administrator') ?></span>
        <a class="btn" href="/logs">Logs</a>
        <a class="btn" href="/?view=admin">Admin Panel</a>
      </div>
    </div>
  </header>

  <main class="wrap">
    <?php if ($flashOk !== ''): ?>
      <div class="alert alert-ok"><?= primex_console_h($flashOk) ?></div>
    <?php endif; ?>
    <?php if ($flashErr !== ''): ?>
      <div class="alert alert-err"><?= primex_console_h($flashErr) ?></div>
    <?php endif; ?>

    <div class="grid">
      <!-- Card 1: Website Feature Toggles -->
      <section class="card">
        <div class="meta-row">
          <div>
            <h2>Website Feature Controls</h2>
            <p class="card-sub" style="margin-bottom:0;">Enable or disable platform modules across User Dashboard and Admin Panel.</p>
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
              <div class="toggle-desc">When turned OFF, all language selectors and translation buttons are removed across User Dashboard, Landing, Auth, and Admin Panel.</div>
            </div>
            <span class="switch">
              <input id="toggle-lang" type="checkbox" name="feature_language_enabled" value="1" <?= $langOn ? 'checked' : '' ?>>
              <span class="track"></span>
            </span>
          </label>

          <label class="toggle-row" for="toggle-maint">
            <div>
              <div class="toggle-title">Maintenance Mode</div>
              <div class="toggle-desc">Broadcasts maintenance status flag via system configuration.</div>
            </div>
            <span class="switch">
              <input id="toggle-maint" type="checkbox" name="maintenance_mode" value="1" <?= $maintOn ? 'checked' : '' ?>>
              <span class="track"></span>
            </span>
          </label>

          <button type="submit" class="btn btn-primary" style="width:100%;">Save Feature Controls</button>
        </form>
      </section>

      <!-- Card 2: SMTP Configuration & Test Delivery -->
      <section class="card">
        <div class="meta-row">
          <div>
            <h2>SMTP Email Configuration</h2>
            <p class="card-sub" style="margin-bottom:0;">Configure outbound transactional SMTP credentials stored securely in Supabase.</p>
          </div>
          <span class="pill <?= $hasSmtpPass ? 'pill-on' : 'pill-off' ?>">
            <?= $hasSmtpPass ? 'Credentials Saved' : 'Password Not Set' ?>
          </span>
        </div>

        <form method="post" action="/console">
          <input type="hidden" name="action" value="save_smtp">
          <input type="hidden" name="csrf_token" value="<?= primex_console_h($csrfCookie) ?>">

          <div class="form-grid">
            <div class="field">
              <label for="smtp-host">SMTP Host</label>
              <input id="smtp-host" name="smtp_host" type="text" value="<?= primex_console_h($cfg['SMTP_HOST']) ?>" placeholder="smtp.hostinger.com">
            </div>
            <div class="field">
              <label for="smtp-port">SMTP Port</label>
              <input id="smtp-port" name="smtp_port" type="number" min="1" max="65535" value="<?= primex_console_h($cfg['SMTP_PORT'] ?: '587') ?>" placeholder="587">
            </div>
          </div>

          <div class="form-grid">
            <div class="field">
              <label for="smtp-enc">Encryption</label>
              <select id="smtp-enc" name="smtp_encryption">
                <option value="tls" <?= $cfg['SMTP_ENCRYPTION'] === 'tls' ? 'selected' : '' ?>>STARTTLS (Port 587)</option>
                <option value="ssl" <?= $cfg['SMTP_ENCRYPTION'] === 'ssl' ? 'selected' : '' ?>>SSL / TLS (Port 465)</option>
                <option value="none" <?= $cfg['SMTP_ENCRYPTION'] === 'none' ? 'selected' : '' ?>>None (Unencrypted)</option>
              </select>
            </div>
            <div class="field">
              <label for="smtp-user">SMTP Username</label>
              <input id="smtp-user" name="smtp_user" type="text" value="<?= primex_console_h($cfg['SMTP_USER']) ?>" placeholder="noreply@alphavestapp.com" autocomplete="off">
            </div>
          </div>

          <div class="field">
            <label for="smtp-pass">SMTP Password</label>
            <input id="smtp-pass" name="smtp_pass" type="password" value="" placeholder="<?= $hasSmtpPass ? '•••••••• (saved — leave blank to keep)' : 'Enter SMTP password' ?>" autocomplete="new-password">
            <?php if ($hasSmtpPass): ?>
              <label style="display:inline-flex;align-items:center;gap:6px;margin-top:6px;font-weight:600;color:var(--muted);cursor:pointer;">
                <input type="checkbox" name="clear_smtp_pass" value="1" style="width:auto;min-height:0;">
                <span>Clear stored SMTP password</span>
              </label>
            <?php endif; ?>
          </div>

          <div class="form-grid">
            <div class="field">
              <label for="smtp-from">From Email</label>
              <input id="smtp-from" name="smtp_from" type="email" value="<?= primex_console_h($cfg['SMTP_FROM']) ?>" placeholder="noreply@alphavestapp.com">
            </div>
            <div class="field">
              <label for="smtp-from-name">From Display Name</label>
              <input id="smtp-from-name" name="smtp_from_name" type="text" value="<?= primex_console_h($cfg['SMTP_FROM_NAME']) ?>" placeholder="PRIME X CAPITAL">
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%;">Save SMTP Configuration</button>
        </form>

        <div class="test-box">
          <form method="post" action="/console">
            <input type="hidden" name="action" value="send_test_email">
            <input type="hidden" name="csrf_token" value="<?= primex_console_h($csrfCookie) ?>">
            <label for="test-to" style="display:block;font-size:12px;font-weight:700;color:#374151;margin-bottom:6px;">Send Test Email</label>
            <div class="inline-row">
              <input id="test-to" name="test_to" type="email" required value="<?= primex_console_h($currentUser['email'] ?? '') ?>" placeholder="recipient@domain.com">
              <button type="submit" class="btn">Send Test</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  </main>
</body>
</html>
