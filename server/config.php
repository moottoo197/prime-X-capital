<?php
/**
 * Alphavest production configuration.
 * This file MUST remain outside the web document root (htdocs).
 */

declare(strict_types=1);

$envPaths = [
    __DIR__ . '/.env',
    dirname(__DIR__) . '/.env',
];

foreach ($envPaths as $envFile) {
    if (!is_file($envFile) || !is_readable($envFile)) {
        continue;
    }
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = preg_replace('/^\xEF\xBB\xBF/', '', (string)$line);
        $line = trim((string)$line);
        if ($line === '' || $line[0] === '#') continue;
        if (strpos($line, '=') === false) continue;
        [$key, $val] = explode('=', $line, 2);
        $key = trim($key);
        $val = trim($val, " \t\n\r\0\x0B\"'");
        $existingEnv = getenv($key);
        if ($key !== '' && ($existingEnv === false || $existingEnv === '')) {
            putenv("{$key}={$val}");
            $_ENV[$key] = $val;
            $_SERVER[$key] = $val;
        }
    }
    break;
}

function alphavest_env(string $key, ?string $default = null): ?string {
    $value = getenv($key);
    if ($value === false || $value === '') {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? $default;
    }
    return ($value === null || $value === '') ? $default : (string)$value;
}

function alphavest_required_env(string $key): string {
    // Do not terminate before the API bootstrap can return a controlled JSON
    // 503 response. Missing production configuration is a deployment error,
    // not a reason to expose PHP/runtime details.
    $value = alphavest_env($key, '');
    if ($value === null || trim($value) === '') {
        error_log('Alphavest production configuration is incomplete: ' . $key);
        return '';
    }
    return $value;
}

define('SUPABASE_URL', rtrim(alphavest_required_env('SUPABASE_URL'), '/'));
define('SUPABASE_ANON_KEY', alphavest_required_env('SUPABASE_ANON_KEY'));
define('SUPABASE_SERVICE_ROLE_KEY', alphavest_required_env('SUPABASE_SERVICE_ROLE_KEY'));

define('DATABASE_URL', alphavest_env('DATABASE_URL', ''));
define('PG_HOST', alphavest_env('PGHOST', ''));
define('PG_PORT', alphavest_env('PGPORT', '5432'));
define('PG_DATABASE', alphavest_env('PGDATABASE', 'postgres'));
define('PG_USER', alphavest_env('PGUSER', ''));
define('PG_PASSWORD', alphavest_env('PGPASSWORD', ''));
define('DB_DRIVER', alphavest_env('DB_DRIVER', 'supabase'));

define('APP_SECRET', alphavest_required_env('APP_SECRET'));

define('ADMIN_EMAILS', array_values(array_filter(array_map(static function ($e) {
    return strtolower(trim((string)$e));
}, explode(',', alphavest_env('ADMIN_EMAILS', 'trader@alphavest.io'))))));
define('ADMIN_MASTER_PASSWORD', alphavest_env('ADMIN_MASTER_PASSWORD', ''));

$allowedOrigins = alphavest_env('ALLOWED_ORIGINS', 'https://alphavestapp.com,https://www.alphavestapp.com,https://alphavest-app.com,https://www.alphavest-app.com');
define('ALLOWED_ORIGINS', array_values(array_filter(array_map('trim', explode(',', $allowedOrigins)))));
