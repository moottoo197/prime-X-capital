<?php
/**
 * Referral Stipend Claim
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = requireAuth();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

sendSuccess(['status' => 'PENDING', 'amount' => 50.0], 'Referral leadership stipend claim submitted');
