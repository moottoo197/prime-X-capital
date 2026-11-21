<?php
/**
 * User Region / Country Update API
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$input = getJsonBody();
$country = trim((string)($input['country'] ?? $input['region'] ?? ''));
$timezone = trim((string)($input['timezone'] ?? 'Asia/Karachi'));
if (!in_array($timezone, DateTimeZone::listIdentifiers(), true)) $timezone = 'Asia/Karachi';

if (empty($country)) {
    sendError('VALIDATION_ERROR', 'Country / region name is required');
}

$userId = $user['id'];
$supabase = getSupabaseClient();

// 1. Update in Supabase profiles
if ($supabase->isConfigured()) {
    try {
        $payload = [
            'country' => $country,
            'timezone' => $timezone,
            'updated_at' => gmdate('Y-m-d H:i:s')
        ];
        $updateRes = $supabase->update('profiles', $payload, ['id' => "eq.{$userId}"]);
        // Compatibility path: if PostgREST reports any missing legacy column,
        // retry with the country field only. Country persistence must not depend
        // on withdrawal PIN columns or timezone being present in the schema cache.
        if (!$updateRes['success']) {
            $msg = strtolower((string)($updateRes['message'] ?? ''));
            if (strpos($msg, 'schema cache') !== false || strpos($msg, 'column') !== false) {
                $updateRes = $supabase->update('profiles', [
                    'country' => $country,
                    'updated_at' => gmdate('Y-m-d H:i:s')
                ], ['id' => "eq.{$userId}"]);
            }
        }
        // Some older accounts have a profile row whose id differs from the legacy session id.
        // Fall back to the authenticated email so country changes are not silently lost.
        if (!$updateRes['success'] || empty($updateRes['data'][0])) {
            $email = trim((string)($user['email'] ?? ''));
            if ($email !== '') {
                $updateRes = $supabase->update('profiles', $payload, ['email' => 'eq.' . rawurlencode($email)]);
            }
        }
        if (!$updateRes['success'] || empty($updateRes['data'][0])) {
            sendError('COUNTRY_UPDATE_FAILED', 'Could not save the selected country/region: ' . ($updateRes['message'] ?? 'No matching profile row was found.'), 502);
        }
    } catch (Exception $e) {
        sendError('COUNTRY_UPDATE_FAILED', 'Could not save the selected country/region.', 502);
    }
}

// 2. Set persistent cookie (30 days)
if (!headers_sent()) {
    $isHttps = isHttpsRequest();
    setcookie('alphavest_country', $country, [
        'expires' => time() + (30 * 86400),
        'path' => '/',
        'httponly' => false,
        'samesite' => 'Lax',
        'secure' => $isHttps
    ]);
    setcookie('alphavest_timezone', $timezone, [
        'expires' => time() + (30 * 86400),
        'path' => '/',
        'httponly' => false,
        'samesite' => 'Lax',
        'secure' => $isHttps
    ]);
}

sendSuccess([
    'country' => $country,
    'timezone' => $timezone,
], "Region updated to {$country}.");
