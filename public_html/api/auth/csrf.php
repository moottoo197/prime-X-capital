<?php
require_once dirname(__DIR__) . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('METHOD_NOT_ALLOWED', 'GET method required', 405);
}

$token = ensureCsrfCookie();
sendSuccess(['csrf_token' => $token], 'Security token ready');
