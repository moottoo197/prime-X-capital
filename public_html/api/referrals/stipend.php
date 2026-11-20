<?php
/**
 * Referral Stipend Claim
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = getCurrentUser();
if (!$user) {
    sendError('UNAUTHORIZED', 'Please log in to claim stipend', 401);
}

sendSuccess(['status' => 'PENDING', 'amount' => 50.0], 'Referral leadership stipend claim submitted');
