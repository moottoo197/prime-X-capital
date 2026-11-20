<?php
require_once __DIR__ . '/../bootstrap.php';

try {
    $db = getDB();
    $user = getCurrentUser($db);
    if (!$user) {
        sendError('UNAUTHORIZED', 'Authentication required to claim stipend', 401);
    }

    $userId = $user['id'];
    $code = $user['referral_code'] ?? '';

    // Calculate team counts
    $stmtL1 = $db->prepare("SELECT COUNT(*) FROM profiles WHERE UPPER(TRIM(referred_by)) = UPPER(TRIM(:code))");
    $stmtL1->execute([':code' => $code]);
    $l1Count = (int)$stmtL1->fetchColumn();

    $stmtL2 = $db->prepare("
        SELECT COUNT(*) FROM profiles
        WHERE UPPER(TRIM(referred_by)) IN (
            SELECT UPPER(TRIM(referral_code)) FROM profiles WHERE UPPER(TRIM(referred_by)) = UPPER(TRIM(:code))
        )
    ");
    $stmtL2->execute([':code' => $code]);
    $l2Count = (int)$stmtL2->fetchColumn();

    $stmtL3 = $db->prepare("
        SELECT COUNT(*) FROM profiles
        WHERE UPPER(TRIM(referred_by)) IN (
            SELECT UPPER(TRIM(referral_code)) FROM profiles
            WHERE UPPER(TRIM(referred_by)) IN (
                SELECT UPPER(TRIM(referral_code)) FROM profiles WHERE UPPER(TRIM(referred_by)) = UPPER(TRIM(:code))
            )
        )
    ");
    $stmtL3->execute([':code' => $code]);
    $l3Count = (int)$stmtL3->fetchColumn();

    $totalTeam = $l1Count + $l2Count + $l3Count;

    // Minimum requirement: 5 active members
    if ($totalTeam < 5) {
        sendError('BAD_REQUEST', 'Regional leadership stipend requires at least 5 active network members (Current: ' . $totalTeam . ')', 400);
    }

    // Determine tier stipend
    $stipendAmount = 150.0;
    $tierName = 'Tier 1 Regional Leader';
    if ($totalTeam >= 50) {
        $stipendAmount = 1200.0;
        $tierName = 'Tier 3 Global Ambassador';
    } elseif ($totalTeam >= 20) {
        $stipendAmount = 450.0;
        $tierName = 'Tier 2 Senior Director';
    }

    // Check if already claimed this week
    $oneWeekAgo = date('Y-m-d H:i:s', time() - 7 * 86400);
    $stmtCheck = $db->prepare("
        SELECT id FROM transactions
        WHERE user_id = :uid AND type = 'REFERRAL_COMMISSION' AND description LIKE '%Leadership Stipend%' AND created_at >= :dt
    ");
    $stmtCheck->execute([':uid' => $userId, ':dt' => $oneWeekAgo]);
    if ($stmtCheck->fetch()) {
        sendError('BAD_REQUEST', 'Leadership stipend has already been claimed for this weekly period. Try again next week.', 400);
    }

    // Credit funding wallet
    $db->beginTransaction();

    $stmtWallet = $db->prepare("SELECT * FROM wallet_balances WHERE user_id = :uid AND wallet_type = 'FUNDING' AND asset = 'USDT'");
    $stmtWallet->execute([':uid' => $userId]);
    $wallet = $stmtWallet->fetch(PDO::FETCH_ASSOC);

    if (!$wallet) {
        $db->prepare("
            INSERT INTO wallet_balances (user_id, wallet_type, asset, balance, available_balance, reserved_balance, promotional_balance, created_at, updated_at)
            VALUES (:uid, 'FUNDING', 'USDT', :bal, :abal, 0.0, 0.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ")->execute([
            ':uid' => $userId,
            ':bal' => $stipendAmount,
            ':abal' => $stipendAmount
        ]);
    } else {
        $newBal = (float)$wallet['balance'] + $stipendAmount;
        $newAvail = (float)$wallet['available_balance'] + $stipendAmount;
        $db->prepare("
            UPDATE wallet_balances
            SET balance = :bal, available_balance = :abal, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ")->execute([
            ':bal' => $newBal,
            ':abal' => $newAvail,
            ':id' => $wallet['id']
        ]);
    }

    $claimId = 'STIP-' . strtoupper(substr(bin2hex(random_bytes(6)), 0, 10));
    $stmtTx = $db->prepare("
        INSERT INTO transactions (id, user_id, type, amount, asset, status, reference_id, description, created_at)
        VALUES (:id, :uid, 'REFERRAL_COMMISSION', :amount, 'USDT', 'COMPLETED', :ref, :desc, CURRENT_TIMESTAMP)
    ");
    $stmtTx->execute([
        ':id' => 'tx_' . bin2hex(random_bytes(8)),
        ':uid' => $userId,
        ':amount' => $stipendAmount,
        ':ref' => $claimId,
        ':desc' => "Weekly Regional Partner Leadership Stipend ({$tierName})"
    ]);

    $db->commit();

    sendSuccess([
        'claim_id' => $claimId,
        'tier_name' => $tierName,
        'stipend_amount' => $stipendAmount,
        'status' => 'CREDITED'
    ], "Weekly stipend of \${$stipendAmount} USDT ({$tierName}) credited to your funding wallet!");

} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    sendError('INTERNAL_ERROR', $e->getMessage(), 500);
}
