<?php
/**
 * Alphavest API Bootstrap
 * Pure Supabase REST Architecture (Single Source of Truth)
 * Shared-Hosting, LiteSpeed, Apache, cPanel, and InfinityFree Compatible
 */

// Load configuration from the server-only directory outside htdocs.
$configPaths = [
    __DIR__ . '/config.php',
    dirname(__DIR__, 2) . '/server/config.php',
    dirname(__DIR__, 2) . '/config.php'
];
foreach ($configPaths as $cp) {
    if (is_file($cp)) {
        require_once $cp;
        break;
    }
}

if (!defined('SUPABASE_URL') || !SUPABASE_URL || !defined('SUPABASE_SERVICE_ROLE_KEY') || !SUPABASE_SERVICE_ROLE_KEY) {
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'error_code' => 'SERVER_MISCONFIGURED', 'message' => 'Server configuration is unavailable.']);
    exit;
}

// Load the REST client shipped with the public API layer.
require_once __DIR__ . '/SupabaseClient.php';

// Load server-side log engine from outside webroot when deployed alongside /server.
foreach ([dirname(__DIR__, 2) . '/server/logs.php', dirname(__DIR__, 3) . '/server/logs.php'] as $serverLogsPath) {
    if (is_file($serverLogsPath)) {
        require_once $serverLogsPath;
        break;
    }
}

function primex_record_log(
    string $category,
    string $event,
    string $message = '',
    array $context = [],
    string $level = 'INFO',
    ?string $actorId = null,
    ?string $actorEmail = null
): void {
    if (function_exists('primex_write_log')) {
        primex_write_log($category, $event, $message, $context, $level, $actorId, $actorEmail);
    }
}

// Disable PHP display_errors to guarantee pristine JSON responses
error_reporting(E_ALL);
ini_set('display_errors', '0');

// Global headers: JSON format, CORS handling, cache busting
if (!headers_sent() && !defined('PRIMEX_LOGS_WEB_ENTRY')) {
    header('Content-Type: application/json; charset=utf-8');
    
    // Credentials-enabled CORS. Accept only AlphaVest production origins.
    // Normalize scheme/host/port so https://alphavest-app.com:443 and a trailing
    // slash do not cause a false CORS rejection on shared hosting/proxies.
    $origin = trim((string)($_SERVER['HTTP_ORIGIN'] ?? ''));
    $allowedOrigins = defined('ALLOWED_ORIGINS') ? ALLOWED_ORIGINS : [];
    $allowedHosts = ['alphavest-app.com', 'www.alphavest-app.com'];

    foreach ($allowedOrigins as $configuredOrigin) {
        $parts = parse_url(trim($configuredOrigin));
        if (is_array($parts) && !empty($parts['host'])) {
            $allowedHosts[] = strtolower($parts['host']);
        }
    }
    $allowedHosts = array_values(array_unique($allowedHosts));

    if ($origin !== '') {
        $parts = parse_url($origin);
        $originScheme = strtolower((string)($parts['scheme'] ?? ''));
        $originHost = strtolower((string)($parts['host'] ?? ''));
        $originPort = isset($parts['port']) ? (int)$parts['port'] : null;
        $validScheme = in_array($originScheme, ['http', 'https'], true);
        $validPort = ($originPort === null)
            || ($originScheme === 'https' && $originPort === 443)
            || ($originScheme === 'http' && $originPort === 80);
        $validHost = in_array($originHost, $allowedHosts, true);

        if ($validScheme && $validPort && $validHost) {
            // CORS is a browser policy, not an authentication mechanism.
            // Only send the CORS permission header for our own domains.
            // Do NOT reject the HTTP request here: same-origin requests may
            // legitimately omit Origin, and shared hosts/proxies can supply
            // a different Origin representation. The browser will enforce
            // CORS for an unapproved cross-origin caller because no matching
            // Access-Control-Allow-Origin header is returned.
            $normalizedOrigin = $originScheme . '://' . $originHost;
            if ($originPort !== null && !(($originScheme === 'https' && $originPort === 443) || ($originScheme === 'http' && $originPort === 80))) {
                $normalizedOrigin .= ':' . $originPort;
            }
            header('Access-Control-Allow-Origin: ' . $normalizedOrigin);
            header('Access-Control-Allow-Credentials: true');
            header('Vary: Origin');
        }
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Authorization, X-CSRF-Token, X-Idempotency-Key, Cache-Control, Range');
    header('Access-Control-Expose-Headers: Content-Range, Accept-Ranges');
    header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0, proxy-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
}

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Global Exception Handler
 */
set_exception_handler(function ($e) {
    primex_record_log('SYSTEM', 'UNHANDLED_EXCEPTION', $e->getMessage(), [
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ], 'ERROR');
    if (defined('PRIMEX_LOGS_WEB_ENTRY')) {
        if (!headers_sent()) {
            header('Content-Type: text/html; charset=utf-8');
        }
        http_response_code(500);
        echo 'Server logs console encountered an unexpected error.';
        exit();
    }
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=utf-8');
    }
    http_response_code(500);
    echo json_encode([
        'success'    => false,
        'error_code' => 'SERVER_EXCEPTION',
        'message'    => 'An unexpected server error occurred. Please try again later.'
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit();
});

/**
 * Fatal Error Shutdown Handler
 */
register_shutdown_function(function () {
    $err = error_get_last();
    if ($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        if (!headers_sent()) {
            header('Content-Type: application/json; charset=utf-8');
        }
        echo json_encode([
            'success'    => false,
            'error_code' => 'FATAL_ERROR',
            'message'    => 'An unexpected server error occurred. Please try again later.'
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
});

/**
 * CSRF protection for every state-changing API request. The session itself may
 * be supplied by an HTTP-only cookie, so a separate same-site token is required
 * in the request header to prevent cross-site form submissions.
 */
function isHttpsRequest(): bool {
    if (!empty($_SERVER['HTTPS']) && strtolower((string)$_SERVER['HTTPS']) !== 'off') {
        return true;
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_PROTO'])) {
        $proto = strtolower(trim(explode(',', (string)$_SERVER['HTTP_X_FORWARDED_PROTO'])[0]));
        if ($proto === 'https') {
            return true;
        }
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_SSL']) && strtolower((string)$_SERVER['HTTP_X_FORWARDED_SSL']) === 'on') {
        return true;
    }
    return ((int)($_SERVER['SERVER_PORT'] ?? 0) === 443);
}

function ensureCsrfCookie(): string {
    $existing = (string)($_COOKIE['alphavest_csrf'] ?? '');
    if ($existing !== '' && preg_match('/^[a-f0-9]{64}$/', $existing)) {
        return $existing;
    }
    $token = bin2hex(random_bytes(32));
    if (!headers_sent()) {
        setcookie('alphavest_csrf', $token, [
            'expires' => time() + 7200,
            'path' => '/',
            'httponly' => false,
            'samesite' => 'Lax',
            'secure' => isHttpsRequest()
        ]);
    }
    return $token;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'OPTIONS') {
    $csrfCookie = ensureCsrfCookie();
    if (!defined('PRIMEX_LOGS_WEB_ENTRY') && ($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
        $csrfHeader = (string)($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
        if ($csrfHeader === '' || !hash_equals($csrfCookie, $csrfHeader)) {
            sendError('CSRF_FAILED', 'Security token missing or invalid. Refresh the page and try again.', 403);
        }
    }
}

/**
 * Local file-backed fallback store for rate limits (stored outside public_html).
 * Ensures brute-force lockouts remain enforced even if security_rate_limits
 * has not been migrated in Supabase or experiences transient REST latency.
 */
function primex_rate_limit_file(string $key): ?string {
    $safeKey = preg_replace('/[^a-f0-9]/i', '', $key);
    if ($safeKey === '') return null;
    $candidates = [
        dirname(__DIR__, 2) . '/server/storage/rate_limits',
        rtrim(sys_get_temp_dir(), '/\\') . '/primex_rate_limits'
    ];
    foreach ($candidates as $dir) {
        if (!is_dir($dir)) {
            @mkdir($dir, 0750, true);
        }
        if (is_dir($dir) && is_writable($dir)) {
            return $dir . '/' . $safeKey . '.json';
        }
    }
    return null;
}

function primex_file_rate_read(string $key): ?array {
    $file = primex_rate_limit_file($key);
    if ($file === null || !is_file($file) || !is_readable($file)) {
        return null;
    }
    $raw = @file_get_contents($file);
    if ($raw === false || $raw === '') return null;
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : null;
}

function primex_file_rate_write(string $key, array $row): void {
    $file = primex_rate_limit_file($key);
    if ($file === null) return;
    $encoded = json_encode($row, JSON_UNESCAPED_SLASHES);
    if ($encoded !== false) {
        @file_put_contents($file, $encoded, LOCK_EX);
    }
}

function primex_file_rate_delete(string $key): void {
    $file = primex_rate_limit_file($key);
    if ($file !== null && is_file($file)) {
        @unlink($file);
    }
}

/**
 * Database-backed rate limiter for withdrawal PIN validation.
 * Three failed attempts trigger a five-minute lock for the authenticated user.
 */
function withdrawalPinRateLimitKey(string $userId): string {
    return hash('sha256', 'withdrawal-pin|' . $userId);
}

function checkWithdrawalPinRateLimit(string $userId): void {
    $supabase = getSupabaseClient();
    $key = withdrawalPinRateLimitKey($userId);
    $row = null;
    $res = $supabase->isConfigured()
        ? $supabase->select('security_rate_limits', ['id' => 'eq.' . $key, 'limit' => '1'])
        : ['success' => false, 'message' => 'Supabase client not configured'];
    if ($res['success']) {
        $row = $res['data'][0] ?? null;
    } else {
        primex_record_log('SECURITY', 'PIN_RATE_LIMIT_FALLBACK', (string)($res['message'] ?? 'lookup failed'), [
            'error' => $res['error'] ?? null,
            'http_code' => $res['http_code'] ?? 0
        ], 'WARNING', $userId);
        $row = primex_file_rate_read($key);
    }
    if ($row && !empty($row['locked_until'])) {
        $lockedUntil = strtotime((string)$row['locked_until']) ?: 0;
        if ($lockedUntil > time()) {
            sendError('PIN_LOCKED', 'Too many incorrect PIN attempts. Please wait 5 minutes before trying again.', 429);
        }
    }
}

function recordWithdrawalPinFailure(string $userId): void {
    $supabase = getSupabaseClient();
    $key = withdrawalPinRateLimitKey($userId);
    $now = gmdate('Y-m-d H:i:s');
    $res = $supabase->isConfigured()
        ? $supabase->select('security_rate_limits', ['id' => 'eq.' . $key, 'limit' => '1'])
        : ['success' => false];
    $row = $res['success'] ? ($res['data'][0] ?? null) : primex_file_rate_read($key);
    $attempts = (int)($row['failed_attempts'] ?? 0) + 1;
    $lockedUntil = $attempts >= 3 ? gmdate('Y-m-d H:i:s', time() + 300) : null;
    $payload = [
        'id' => $key,
        'user_id' => $userId,
        'action' => 'withdrawal_pin',
        'failed_attempts' => $attempts,
        'locked_until' => $lockedUntil,
        'updated_at' => $now
    ];
    primex_file_rate_write($key, $payload);
    if ($res['success']) {
        if (!empty($res['data'][0])) {
            $supabase->update('security_rate_limits', $payload, ['id' => 'eq.' . $key]);
        } else {
            $supabase->insert('security_rate_limits', [$payload]);
        }
    }
}

function clearWithdrawalPinFailures(string $userId): void {
    $supabase = getSupabaseClient();
    $key = withdrawalPinRateLimitKey($userId);
    primex_file_rate_delete($key);
    if ($supabase->isConfigured()) {
        $supabase->delete('security_rate_limits', ['id' => 'eq.' . $key]);
    }
}

/**
 * Get centralized Supabase REST client instance
 */
function getSupabaseClient(): SupabaseClient {
    static $client = null;
    if ($client === null) {
        $url = defined('SUPABASE_URL') ? SUPABASE_URL : getenv('SUPABASE_URL');
        $serviceKey = defined('SUPABASE_SERVICE_ROLE_KEY') ? SUPABASE_SERVICE_ROLE_KEY : getenv('SUPABASE_SERVICE_ROLE_KEY');
        $anonKey = defined('SUPABASE_ANON_KEY') ? SUPABASE_ANON_KEY : getenv('SUPABASE_ANON_KEY');
        $client = new SupabaseClient($url ?: null, $serviceKey ?: null, $anonKey ?: null);
    }
    return $client;
}

/**
 * Standardized JSON response helpers
 */
function sendSuccess($data = [], string $message = 'Success', int $statusCode = 200): void {
    if (!headers_sent()) {
        http_response_code($statusCode);
    }
    echo json_encode([
        'success' => true,
        'data'    => $data,
        'message' => $message
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit();
}

function sendError(string $code, string $message, int $statusCode = 400, $data = null): void {
    if (!headers_sent()) {
        http_response_code($statusCode);
    }
    echo json_encode([
        'success'    => false,
        'error_code' => $code,
        'message'    => $message,
        'data'       => $data
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Parse incoming JSON request body
 */
function getJsonBody(): array {
    $raw = file_get_contents('php://input');
    if (empty($raw)) return $_POST ?: [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : ($_POST ?: []);
}

/**
 * Extract Authorization Token
 */
function extractBearerToken(): ?string {
    // Authentication is intentionally cookie-only. Authorization headers are
    // not accepted so bearer tokens cannot become a second session channel.
    return !empty($_COOKIE['alphavest_session']) ? trim((string)$_COOKIE['alphavest_session']) : null;

}

/**
 * Generic database-backed login throttling. Five failures within a rolling
 * window lock the account/IP combination for 15 minutes.
 */
function authRateKey(string $email): string {
    $ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    return hash('sha256', 'login|' . strtolower(trim($email)) . '|' . $ip);
}
function checkLoginRateLimit(string $email, bool $returnMessage = false): ?string {
    $sb = getSupabaseClient();
    $key = authRateKey($email);
    $row = null;
    $res = $sb->isConfigured()
        ? $sb->select('security_rate_limits', ['id' => 'eq.' . $key, 'limit' => '1'])
        : ['success' => false, 'message' => 'Supabase client not configured'];
    if ($res['success']) {
        $row = $res['data'][0] ?? null;
    } else {
        error_log('Login rate-limit lookup fallback: ' . ($res['message'] ?? 'unknown'));
        primex_record_log('SECURITY', 'RATE_LIMIT_DB_FALLBACK', (string)($res['message'] ?? 'Login rate-limit lookup failed'), [
            'error' => $res['error'] ?? null,
            'http_code' => $res['http_code'] ?? 0
        ], 'WARNING', null, $email);
        $row = primex_file_rate_read($key);
    }
    if ($row && !empty($row['locked_until']) && (strtotime((string)$row['locked_until']) ?: 0) > time()) {
        $msg = 'Too many failed login attempts. Please try again later.';
        if ($returnMessage) {
            return $msg;
        }
        sendError('LOGIN_RATE_LIMITED', $msg, 429);
    }
    return null;
}
function recordLoginFailure(string $email): void {
    $sb = getSupabaseClient();
    $key = authRateKey($email);
    $now = gmdate('Y-m-d H:i:s');
    $res = $sb->isConfigured()
        ? $sb->select('security_rate_limits', ['id' => 'eq.' . $key, 'limit' => '1'])
        : ['success' => false];
    $row = $res['success'] ? ($res['data'][0] ?? null) : primex_file_rate_read($key);
    $attempts = (int)($row['failed_attempts'] ?? 0) + 1;
    $locked = $attempts >= 5 ? gmdate('Y-m-d H:i:s', time() + 900) : null;
    $payload = ['id' => $key, 'user_id' => 'ip-login', 'action' => 'login', 'failed_attempts' => $attempts, 'locked_until' => $locked, 'updated_at' => $now];
    primex_file_rate_write($key, $payload);
    if ($res['success']) {
        if (!empty($res['data'][0])) {
            $sb->update('security_rate_limits', $payload, ['id' => 'eq.' . $key]);
        } else {
            $sb->insert('security_rate_limits', [$payload]);
        }
    }
}
function clearLoginFailures(string $email): void {
    $key = authRateKey($email);
    primex_file_rate_delete($key);
    $sb = getSupabaseClient();
    if ($sb->isConfigured()) {
        $sb->delete('security_rate_limits', ['id' => 'eq.' . $key]);
    }
}

/**
 * Resolve authenticated user from Supabase Auth or Profiles
 */
function getCurrentUser(): ?array {
    $token = extractBearerToken();
    if (empty($token)) {
        return null;
    }

    $supabase = getSupabaseClient();
    if (!$supabase->isConfigured()) {
        return null;
    }

    // Fast path: every successful login is also recorded in user_sessions.
    // Sessions are intentionally persistent until explicit logout/password reset/admin
    // deletion. We still keep an expires_at column for compatibility with the existing
    // schema and refresh it on every authenticated request.
    $sessionRes = $supabase->select('user_sessions', [
        'token' => 'eq.' . hash('sha256', $token),
        'limit' => '1'
    ]);

    if ($sessionRes['success'] && !empty($sessionRes['data'][0])) {
        $session = $sessionRes['data'][0];
        $userId = $session['user_id'];
        $profileRes = $supabase->select('profiles', ['id' => "eq.{$userId}", 'limit' => '1']);
        if ($profileRes['success'] && !empty($profileRes['data'][0])) {
            // Keep the same opaque token and extend the server-side session far into
            // the future on every authenticated request. Explicit logout, password
            // reset, or admin deletion still removes the session record.
            $newExpiry = gmdate('Y-m-d H:i:s', time() + 315360000);
            $supabase->update('user_sessions', [
                'expires_at' => $newExpiry
            ], ['id' => 'eq.' . $session['id']]);
            if (!headers_sent()) {
                setcookie('alphavest_session', $token, [
                    'expires' => time() + 315360000,
                    'path' => '/',
                    'httponly' => true,
                    'samesite' => 'Lax',
                    'secure' => isHttpsRequest()
                ]);
            }
            $sessionOwner = $profileRes['data'][0];

            // Admin user-view mode is read-only and only applies to GET requests.
            // It never replaces the real session owner for admin endpoints.
            $requestMethod = strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET'));
            $requestPath = (string)($_SERVER['REQUEST_URI'] ?? '');
            $previewId = trim((string)($_SERVER['HTTP_X_ALPHAVEST_ADMIN_VIEW_USER'] ?? ''));
            $adminRoles = ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'KYC_MANAGER'];
            $previewAllowedPath = (strpos($requestPath, '/api/admin/') === false)
                && (strpos($requestPath, '/api/auth/me.php') === false)
                && (strpos($requestPath, '/api/auth/logout.php') === false)
                && (strpos($requestPath, '/logs') === false);
            if ($requestMethod === 'GET' && $previewId !== '' && $previewAllowedPath
                && in_array(strtoupper((string)($sessionOwner['role'] ?? '')), $adminRoles, true)
                && $previewId !== (string)$sessionOwner['id']) {
                $previewRes = $supabase->select('profiles', ['id' => 'eq.' . $previewId, 'limit' => '1']);
                if ($previewRes['success'] && !empty($previewRes['data'][0])) {
                    $target = $previewRes['data'][0];
                    $target['_admin_preview'] = true;
                    $target['_admin_viewer_id'] = (string)$sessionOwner['id'];
                    return $target;
                }
            }

            return $sessionOwner;
        }
    }

    // Bearer JWTs are intentionally not accepted as an authentication path.
    // Production sessions are server-issued opaque cookies only.

    return null;
}

/**
 * Require valid authenticated session or abort
 */
function requireAuth(): array {
    $user = getCurrentUser();
    if (!$user) {
        sendError('UNAUTHORIZED', 'Authentication required. Please log in.', 401);
    }
    if (isset($user['is_active']) && !$user['is_active']) {
        sendError('ACCOUNT_SUSPENDED', 'Your account has been suspended. Please contact institutional compliance.', 403);
    }
    return $user;
}

/**
 * Require admin role or abort
 */
function requireAdmin(): array {
    $user = requireAuth();
    $role = strtoupper($user['role'] ?? '');
    $adminRoles = ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'KYC_MANAGER'];
    if (!in_array($role, $adminRoles)) {
        sendError('FORBIDDEN', 'Access denied. Administrator privileges required.', 403);
    }
    return $user;
}
