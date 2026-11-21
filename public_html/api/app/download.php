<?php
/**
 * Mobile App Package Download Streamer (Android APK & iOS IPA)
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$platform = strtolower(trim((string)($_GET['platform'] ?? 'android')));
$downloadsDir = dirname(__DIR__, 2) . '/downloads';

if ($platform === 'ios' || $platform === 'ipa' || $platform === 'iphone') {
    $filename = 'PRIME-X-CAPITAL-iOS.ipa';
    $filePath = $downloadsDir . '/' . $filename;
    $mime = 'application/octet-stream';
} else {
    $filename = 'PRIME-X-CAPITAL-Android.apk';
    $filePath = $downloadsDir . '/' . $filename;
    if (!is_file($filePath)) {
        $fallback = $downloadsDir . '/Alphavest-Android.apk';
        if (is_file($fallback)) $filePath = $fallback;
    }
    $mime = 'application/vnd.android.package-archive';
}

if (!is_file($filePath) || !is_readable($filePath)) {
    sendError('PACKAGE_NOT_FOUND', 'The requested mobile package is currently unavailable.', 404);
}

while (ob_get_level() > 0) {
    ob_end_clean();
}

header('Content-Description: File Transfer');
header('Content-Type: ' . $mime);
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Content-Transfer-Encoding: binary');
header('Content-Length: ' . filesize($filePath));
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');

readfile($filePath);
exit();
