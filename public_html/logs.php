<?php
/**
 * PRIME X CAPITAL - Restricted Server Logs Console (/logs)
 * Strictly inaccessible to standard users and never linked from the user dashboard.
 */

declare(strict_types=1);

define('PRIMEX_LOGS_WEB_ENTRY', true);

require_once __DIR__ . '/api/bootstrap.php';

$serverLogsFallback = dirname(__DIR__) . '/server/logs.php';
if (!function_exists('primex_fetch_combined_logs') && is_file($serverLogsFallback)) {
    require_once $serverLogsFallback;
}

$isJsonFormat = (strtolower(trim((string)($_GET['format'] ?? ''))) === 'json');

if (!headers_sent()) {
    header('X-Robots-Tag: noindex, nofollow');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0, proxy-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Content-Type: ' . ($isJsonFormat ? 'application/json; charset=utf-8' : 'text/html; charset=utf-8'));
}

function primex_logs_h($value): string {
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function primex_logs_verify_csrf(string $csrfCookie): bool {
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

// Block any authenticated non-admin user (e.g. a regular dashboard user opening /logs).
if ($currentUser !== null) {
    $role = strtoupper(trim((string)($currentUser['role'] ?? 'USER')));
    if (!in_array($role, $adminRoles, true)) {
        if (function_exists('primex_write_log')) {
            primex_write_log(
                'SECURITY',
                'LOGS_UNAUTHORIZED_USER_ATTEMPT',
                'Blocked regular user from accessing /logs',
                ['role' => $role],
                'SECURITY',
                (string)($currentUser['id'] ?? ''),
                (string)($currentUser['email'] ?? '')
            );
        }
        http_response_code(403);
        if ($isJsonFormat) {
            echo json_encode(['success' => false, 'error_code' => 'FORBIDDEN', 'message' => 'Access denied. Administrator privileges required.'], JSON_UNESCAPED_SLASHES);
            exit();
        }
        ?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>403 Forbidden · PRIME X CAPITAL</title>
  <link rel="icon" type="image/webp" href="/assets/aistudio/primex-mark_326fd678.webp">
  <style>
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;display:grid;place-items:center;padding:20px;background:#F4F6FA;color:#111827;font-family:Inter,system-ui,-apple-system,sans-serif}
    .card{width:min(100%,460px);background:#FFFFFF;border:1px solid #E5E7EB;border-radius:20px;padding:32px 26px;text-align:center;box-shadow:0 16px 40px rgba(15,23,42,.08)}
    .badge{display:inline-block;padding:5px 12px;border-radius:999px;background:#FEF2F2;color:#DC2626;font-size:12px;font-weight:700;letter-spacing:.04em}
    h1{margin:14px 0 8px;font-size:22px;font-weight:800;color:#111827}
    p{margin:0 0 22px;font-size:14px;line-height:1.6;color:#6B7280}
    .btn{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 22px;border-radius:12px;background:#0052FF;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none}
  </style>
</head>
<body>
  <main class="card">
    <span class="badge">403 · RESTRICTED</span>
    <h1>Access Denied</h1>
    <p>Server logs are restricted to authorized platform administrators and cannot be accessed from user accounts.</p>
    <a class="btn" href="/">Return to Home</a>
  </main>
</body>
</html><?php
        exit();
    }
}

// Handle unauthenticated visitors: show admin-only gate (or 401 JSON).
$authError = '';
if ($currentUser === null) {
    if ($isJsonFormat) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error_code' => 'UNAUTHORIZED', 'message' => 'Administrator authentication required.'], JSON_UNESCAPED_SLASHES);
        exit();
    }

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST' && ($_POST['action'] ?? '') === 'admin_login') {
        if (!primex_logs_verify_csrf($csrfCookie)) {
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
                    $masterPassword !== '' &&
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
                            'LOGS_LOGIN_DENIED',
                            'Denied login attempt on /logs console',
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
                            'LOGS_ADMIN_LOGIN',
                            'Administrator authenticated on /logs console',
                            ['role' => $profileRole],
                            'INFO',
                            (string)$userProfile['id'],
                            $email
                        );
                    }
                    header('Location: /logs', true, 303);
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
  <title>Server Logs · Administrator Sign In · PRIME X CAPITAL</title>
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
        <div class="brand-sub">Server Logs Console</div>
      </div>
    </div>
    <h1>Administrator Access</h1>
    <p class="desc">Sign in with an authorized administrator account to inspect system and security logs.</p>
    <?php if ($authError !== ''): ?>
      <div class="err"><?php echo primex_logs_h($authError); ?></div>
    <?php endif; ?>
    <form method="POST" action="/logs" autocomplete="off">
      <input type="hidden" name="action" value="admin_login">
      <input type="hidden" name="csrf_token" value="<?php echo primex_logs_h($csrfCookie); ?>">
      <label for="log-admin-email">Administrator Email</label>
      <input id="log-admin-email" type="email" name="email" required placeholder="admin@domain.com">
      <label for="log-admin-pass">Password</label>
      <input id="log-admin-pass" type="password" name="password" required placeholder="Enter password">
      <button type="submit">Open Logs Console</button>
    </form>
  </main>
</body>
</html><?php
    exit();
}

// Authenticated Administrator from here onward.
$flashMessage = '';
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    if (!primex_logs_verify_csrf($csrfCookie)) {
        http_response_code(403);
        $flashMessage = 'Security token mismatch. Action rejected.';
    } else {
        $action = (string)($_POST['action'] ?? '');
        if ($action === 'clear_file_logs') {
            if (function_exists('primex_clear_file_logs')) {
                primex_clear_file_logs();
            }
            if (function_exists('primex_write_log')) {
                primex_write_log(
                    'SYSTEM',
                    'LOGS_CLEARED',
                    'Server file logs cleared by administrator',
                    [],
                    'WARNING',
                    (string)($currentUser['id'] ?? ''),
                    (string)($currentUser['email'] ?? '')
                );
            }
            header('Location: /logs?cleared=1', true, 303);
            exit();
        }
        if ($action === 'logout') {
            $token = extractBearerToken();
            if ($token) {
                primex_delete_session_by_token($token);
            }
            if (!headers_sent()) {
                setcookie('alphavest_session', '', [
                    'expires' => time() - 3600,
                    'path' => '/',
                    'httponly' => true,
                    'samesite' => 'Lax',
                    'secure' => isHttpsRequest()
                ]);
            }
            header('Location: /logs', true, 303);
            exit();
        }
    }
}

$levelFilter = strtoupper(trim((string)($_GET['level'] ?? 'ALL')));
$allowedLevels = ['ALL', 'INFO', 'WARNING', 'ERROR', 'SECURITY', 'AUTH', 'ADMIN_AUDIT', 'USER_ACCOUNT', 'WALLET_DEPOSIT', 'WALLET_WITHDRAW'];
if (!in_array($levelFilter, $allowedLevels, true)) {
    $levelFilter = 'ALL';
}
$searchQuery = trim((string)($_GET['q'] ?? ''));
$limit = max(25, min(500, (int)($_GET['limit'] ?? 200)));

$logs = function_exists('primex_fetch_combined_logs')
    ? primex_fetch_combined_logs($supabase, $limit, $levelFilter, $searchQuery)
    : [];

$serverEngineConnected = function_exists('primex_logs_storage_path');
$filePath = $serverEngineConnected ? primex_logs_storage_path() : '';
$fileBytes = ($filePath !== '' && is_file($filePath)) ? (int)@filesize($filePath) : 0;

if ($isJsonFormat) {
    echo json_encode([
        'success' => true,
        'count' => count($logs),
        'level' => $levelFilter,
        'server_file_bytes' => $fileBytes,
        'logs' => $logs
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

$errorCount = 0;
$securityCount = 0;
$fileSourceCount = 0;
foreach ($logs as $row) {
    $lvl = strtoupper((string)($row['level'] ?? 'INFO'));
    if ($lvl === 'ERROR' || $lvl === 'WARNING') $errorCount++;
    if ($lvl === 'SECURITY') $securityCount++;
    if (($row['source'] ?? '') === 'SERVER_FILE') $fileSourceCount++;
}
if (!empty($_GET['cleared'])) {
    $flashMessage = 'Local server log file has been cleared.';
}
?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Server Logs · PRIME X CAPITAL</title>
  <link rel="icon" type="image/webp" href="/assets/aistudio/primex-mark_326fd678.webp">
  <style>
    :root{
      --bg:#F4F6FA; --surface:#FFFFFF; --text:#111827; --muted:#6B7280;
      --border:#E5E7EB; --blue:#0052FF; --blue-soft:#EFF4FF;
    }
    *{box-sizing:border-box}
    html,body{margin:0;padding:0;max-width:100%;overflow-x:hidden;background:var(--bg);color:var(--text);font-family:Inter,system-ui,-apple-system,sans-serif}
    .shell{max-width:1320px;margin:0 auto;padding:18px 16px 40px}
    .topbar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px 18px;margin-bottom:16px}
    .brand{display:flex;align-items:center;gap:12px;min-width:0}
    .brand img{width:38px;height:38px;border-radius:10px;border:1px solid var(--border);background:#FFF;padding:3px;object-fit:contain;flex-shrink:0}
    .brand h1{margin:0;font-size:17px;font-weight:800}
    .brand p{margin:2px 0 0;font-size:12px;color:var(--muted)}
    .top-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:38px;padding:0 14px;border-radius:10px;border:1px solid var(--border);background:#FFF;color:var(--text);font-size:13px;font-weight:700;text-decoration:none;cursor:pointer}
    .btn-primary{background:var(--blue);border-color:var(--blue);color:#FFF}
    .btn-danger{background:#FEF2F2;border-color:#FECACA;color:#B91C1C}
    .kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:16px}
    .kpi{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px 16px}
    .kpi-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
    .kpi-val{margin-top:6px;font-size:22px;font-weight:800;color:var(--text)}
    .filters{display:flex;flex-wrap:wrap;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:12px 14px;margin-bottom:16px;align-items:center}
    .filters input,.filters select{height:38px;border:1px solid #D1D5DB;border-radius:10px;padding:0 12px;font-size:13px;background:#F9FAFB;color:var(--text)}
    .filters input{flex:1 1 220px;min-width:0}
    .flash{padding:10px 14px;border-radius:10px;background:var(--blue-soft);border:1px solid rgba(0,82,255,.22);color:var(--blue);font-size:13px;font-weight:700;margin-bottom:14px}
    .list-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden}
    .log-table{width:100%;border-collapse:collapse;table-layout:fixed}
    .log-table th{background:#F9FAFB;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);padding:12px 14px;border-bottom:1px solid var(--border)}
    .log-table td{padding:12px 14px;border-bottom:1px solid #F3F4F6;font-size:13px;vertical-align:top;word-break:break-word}
    .log-table tr:last-child td{border-bottom:none}
    .pill{display:inline-block;padding:3px 9px;border-radius:999px;font-size:11px;font-weight:800;letter-spacing:.03em}
    .lvl-INFO{background:#EFF4FF;color:#0052FF}
    .lvl-WARNING{background:#FFFBEB;color:#B45309}
    .lvl-ERROR{background:#FEF2F2;color:#DC2626}
    .lvl-SECURITY{background:#F5F3FF;color:#6D28D9}
    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:#374151}
    details summary{cursor:pointer;color:var(--blue);font-size:12px;font-weight:700;margin-top:4px}
    pre{margin:6px 0 0;padding:10px;border-radius:8px;background:#F8FAFC;border:1px solid #E2E8F0;font-size:11px;white-space:pre-wrap;word-break:break-word;max-width:100%}
    .empty{padding:40px 20px;text-align:center;color:var(--muted);font-size:14px}
    @media(max-width:860px){
      .kpis{grid-template-columns:repeat(2,minmax(0,1fr))}
      .log-table thead{display:none}
      .log-table,.log-table tbody,.log-table tr,.log-table td{display:block;width:100%}
      .log-table tr{padding:12px 14px;border-bottom:1px solid var(--border)}
      .log-table td{padding:4px 0;border:none}
    }
  </style>
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <div class="brand">
        <img src="/assets/aistudio/primex-mark_326fd678.webp" alt="PRIME X CAPITAL">
        <div>
          <h1>PRIME X CAPITAL · Server &amp; Security Logs</h1>
          <p>Restricted Admin Console · Signed in as <?php echo primex_logs_h($currentUser['email'] ?? 'Admin'); ?> (<?php echo primex_logs_h($currentUser['role'] ?? 'ADMIN'); ?>)</p>
        </div>
      </div>
      <div class="top-actions">
        <a class="btn btn-primary" href="/logs?level=<?php echo urlencode($levelFilter); ?>&amp;q=<?php echo urlencode($searchQuery); ?>&amp;limit=<?php echo (int)$limit; ?>">Refresh</a>
        <a class="btn" href="/logs?format=json&amp;level=<?php echo urlencode($levelFilter); ?>&amp;q=<?php echo urlencode($searchQuery); ?>&amp;limit=<?php echo (int)$limit; ?>">Export JSON</a>
        <form method="POST" action="/logs" style="display:inline;margin:0;" onsubmit="return confirm('Clear the local server log file? Database audit records remain preserved.');">
          <input type="hidden" name="action" value="clear_file_logs">
          <input type="hidden" name="csrf_token" value="<?php echo primex_logs_h($csrfCookie); ?>">
          <button type="submit" class="btn btn-danger">Clear File Logs</button>
        </form>
        <form method="POST" action="/logs" style="display:inline;margin:0;">
          <input type="hidden" name="action" value="logout">
          <input type="hidden" name="csrf_token" value="<?php echo primex_logs_h($csrfCookie); ?>">
          <button type="submit" class="btn">Sign Out</button>
        </form>
      </div>
    </header>

    <?php if ($flashMessage !== ''): ?>
      <div class="flash"><?php echo primex_logs_h($flashMessage); ?></div>
    <?php endif; ?>

    <section class="kpis">
      <div class="kpi">
        <div class="kpi-label">Log Entries Shown</div>
        <div class="kpi-val"><?php echo count($logs); ?></div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Warnings &amp; Errors</div>
        <div class="kpi-val"><?php echo $errorCount; ?></div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Security Events</div>
        <div class="kpi-val"><?php echo $securityCount; ?></div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Server Log File</div>
        <div class="kpi-val" style="font-size:16px;"><?php echo $serverEngineConnected ? primex_logs_h(number_format($fileBytes / 1024, 1) . ' KB (' . $fileSourceCount . ' rows)') : 'Fallback Mode'; ?></div>
      </div>
    </section>

    <form class="filters" method="GET" action="/logs">
      <input type="text" name="q" value="<?php echo primex_logs_h($searchQuery); ?>" placeholder="Search email, event, IP, path, message...">
      <select name="level">
        <?php foreach ($allowedLevels as $opt): ?>
          <option value="<?php echo primex_logs_h($opt); ?>" <?php echo $levelFilter === $opt ? 'selected' : ''; ?>><?php echo primex_logs_h($opt); ?></option>
        <?php endforeach; ?>
      </select>
      <select name="limit">
        <?php foreach ([50, 100, 200, 500] as $lim): ?>
          <option value="<?php echo $lim; ?>" <?php echo $limit === $lim ? 'selected' : ''; ?>>Last <?php echo $lim; ?></option>
        <?php endforeach; ?>
      </select>
      <button type="submit" class="btn btn-primary">Apply Filter</button>
    </form>

    <section class="list-card">
      <?php if (empty($logs)): ?>
        <div class="empty">No matching log entries found yet. Auth events, registrations, admin actions, and server warnings are recorded automatically.</div>
      <?php else: ?>
        <table class="log-table">
          <thead>
            <tr>
              <th style="width:170px;">Timestamp (UTC)</th>
              <th style="width:110px;">Level</th>
              <th style="width:150px;">Category / Source</th>
              <th style="width:190px;">Actor / IP</th>
              <th>Event &amp; Details</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($logs as $entry):
              $lvl = strtoupper((string)($entry['level'] ?? 'INFO'));
              $pillClass = in_array($lvl, ['INFO', 'WARNING', 'ERROR', 'SECURITY'], true) ? ('lvl-' . $lvl) : 'lvl-INFO';
              $contextJson = !empty($entry['context']) ? json_encode($entry['context'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : '';
            ?>
              <tr>
                <td class="mono"><?php echo primex_logs_h($entry['ts'] ?? '-'); ?></td>
                <td><span class="pill <?php echo primex_logs_h($pillClass); ?>"><?php echo primex_logs_h($lvl); ?></span></td>
                <td>
                  <div style="font-weight:700;font-size:12px;"><?php echo primex_logs_h($entry['category'] ?? 'SYSTEM'); ?></div>
                  <div class="mono" style="font-size:11px;color:#6B7280;"><?php echo primex_logs_h($entry['source'] ?? 'SERVER'); ?></div>
                </td>
                <td>
                  <div style="font-weight:600;font-size:12px;"><?php echo primex_logs_h($entry['actor_email'] ?: ($entry['actor_id'] ?: 'System')); ?></div>
                  <div class="mono" style="font-size:11px;color:#6B7280;"><?php echo primex_logs_h(($entry['ip'] ?: '-') . (!empty($entry['path']) ? ' · ' . $entry['path'] : '')); ?></div>
                </td>
                <td>
                  <div style="font-weight:800;font-size:13px;color:#111827;"><?php echo primex_logs_h($entry['event'] ?? 'EVENT'); ?></div>
                  <?php if (!empty($entry['message'])): ?>
                    <div style="margin-top:2px;color:#374151;"><?php echo primex_logs_h($entry['message']); ?></div>
                  <?php endif; ?>
                  <?php if ($contextJson !== ''): ?>
                    <details>
                      <summary>Inspect payload</summary>
                      <pre><?php echo primex_logs_h($contextJson); ?></pre>
                    </details>
                  <?php endif; ?>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      <?php endif; ?>
    </section>
  </div>
</body>
</html>
