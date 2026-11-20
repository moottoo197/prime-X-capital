<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

$files = [
    __DIR__ . '/index.html',
    __DIR__ . '/sw.js',
    __DIR__ . '/assets/js/app.js',
    __DIR__ . '/assets/js/chart.js',
    __DIR__ . '/assets/js/3d-engine.js',
    __DIR__ . '/assets/css/app.css',
];
$parts = [];
foreach ($files as $file) {
    if (is_file($file)) {
        $parts[] = basename($file) . ':' . (string) filemtime($file) . ':' . (string) filesize($file);
    }
}
$version = substr(hash('sha256', implode('|', $parts)), 0, 16);
echo json_encode(['version' => $version], JSON_UNESCAPED_SLASHES);
