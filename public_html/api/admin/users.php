<?php
/**
 * Admin Users Management - Pure Supabase REST Architecture
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$admin = requireAdmin();

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

// ==========================================
// GET /api/admin/users.php
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Detailed single-user dossier. This branch is intentionally admin-only and
    // reads the same source-of-truth tables used by the financial/admin desks.
    $requestedUserId = trim((string)($_GET['user_id'] ?? ''));
    if ($requestedUserId !== '') {
        $profileRes = $supabase->select('profiles', ['id' => 'eq.' . $requestedUserId, 'limit' => '1']);
        if (!$profileRes['success'] || empty($profileRes['data'][0])) {
            sendError('USER_NOT_FOUND', 'User account was not found.', 404);
        }
        $profile = $profileRes['data'][0];
        $userId = (string)($profile['id'] ?? '');
        if ($userId === '') sendError('USER_NOT_FOUND', 'User account was not found.', 404);

        // Fetch all user-scoped evidence concurrently. We deliberately use '*'
        // for the dossier because this is an admin-only detail endpoint and the
        // schema has evolved over time (for example KYC DOB/address columns).
        $batch = $supabase->selectMany([
            'wallets' => ['table' => 'wallet_balances', 'params' => ['user_id' => 'eq.' . $userId, 'asset' => 'eq.USDT', 'order' => 'wallet_type.asc']],
            'kyc' => ['table' => 'kyc_submissions', 'params' => ['user_id' => 'eq.' . $userId, 'order' => 'created_at.desc', 'limit' => '20']],
            'deposits' => ['table' => 'deposits', 'params' => ['user_id' => 'eq.' . $userId, 'order' => 'created_at.desc', 'limit' => '500']],
            'withdrawals' => ['table' => 'withdrawals', 'params' => ['user_id' => 'eq.' . $userId, 'order' => 'created_at.desc', 'limit' => '500']],
            'ledger' => ['table' => 'ledger_entries', 'params' => ['user_id' => 'eq.' . $userId, 'order' => 'created_at.desc', 'limit' => '5000']],
            'executions' => ['table' => 'user_signal_executions', 'params' => ['user_id' => 'eq.' . $userId, 'order' => 'executed_at.desc', 'limit' => '500']],
            'signals' => ['table' => 'trading_signals', 'params' => ['created_at' => 'gte.' . (string)($profile['created_at'] ?? '1970-01-01T00:00:00Z'), 'order' => 'created_at.asc', 'limit' => '1000']],
            'signal_history' => ['table' => 'trading_signal_history', 'params' => ['created_at' => 'gte.' . (string)($profile['created_at'] ?? '1970-01-01T00:00:00Z'), 'order' => 'created_at.asc', 'limit' => '1000']]
        ]);

        $rows = static function(array $result): array {
            return ($result['success'] ?? false) && is_array($result['data'] ?? null) ? $result['data'] : [];
        };
        $walletRows = $rows($batch['wallets'] ?? []);
        $kycRows = $rows($batch['kyc'] ?? []);
        $depositRows = $rows($batch['deposits'] ?? []);
        $withdrawalRows = $rows($batch['withdrawals'] ?? []);
        $ledgerRows = $rows($batch['ledger'] ?? []);
        $executionRows = $rows($batch['executions'] ?? []);
        $signalRows = $rows($batch['signals'] ?? []);
        $signalHistoryRows = $rows($batch['signal_history'] ?? []);

        $wallets = [];
        $totalBalance = 0.0;
        foreach ($walletRows as $w) {
            $type = strtolower((string)($w['wallet_type'] ?? 'unknown'));
            $balance = (float)($w['balance'] ?? $w['available_balance'] ?? 0);
            $wallets[$type] = ($wallets[$type] ?? 0.0) + $balance;
            $totalBalance += $balance;
        }

        $sumByStatus = static function(array $items, string $amountField = 'amount'): array {
            $out = ['count' => 0, 'amount' => 0.0];
            foreach ($items as $item) {
                $out['count']++;
                $out['amount'] += (float)($item[$amountField] ?? $item['net_amount'] ?? 0);
            }
            $out['amount'] = round($out['amount'], 2);
            return $out;
        };
        $statusSummary = static function(array $items, string $amountField = 'amount'): array {
            $out = [];
            foreach ($items as $item) {
                $status = strtoupper((string)($item['status'] ?? 'UNKNOWN'));
                if (!isset($out[$status])) $out[$status] = ['count' => 0, 'amount' => 0.0];
                $out[$status]['count']++;
                $out[$status]['amount'] += (float)($item[$amountField] ?? $item['net_amount'] ?? 0);
            }
            foreach ($out as &$v) $v['amount'] = round($v['amount'], 2);
            unset($v);
            return $out;
        };

        $depositStatus = $statusSummary($depositRows, 'amount');
        $withdrawalStatus = $statusSummary($withdrawalRows, 'amount');
        $completedDeposits = ['count' => 0, 'amount' => 0.0];
        foreach (['COMPLETED','APPROVED','CONFIRMED'] as $depositPaidStatus) {
            if (!empty($depositStatus[$depositPaidStatus])) {
                $completedDeposits['count'] += (int)$depositStatus[$depositPaidStatus]['count'];
                $completedDeposits['amount'] += (float)$depositStatus[$depositPaidStatus]['amount'];
            }
        }
        $completedDeposits['amount'] = round($completedDeposits['amount'], 2);
        $completedWithdrawals = $withdrawalStatus['COMPLETED'] ?? ['count' => 0, 'amount' => 0.0];

        $adjustments = [];
        $adjustmentCredits = 0.0;
        $adjustmentDebits = 0.0;
        $adjustmentNet = 0.0;
        $signalLedger = [];
        foreach ($ledgerRows as $entry) {
            $entryType = strtoupper((string)($entry['entry_type'] ?? ''));
            if ($entryType === 'ADJUSTMENT') {
                $amount = (float)($entry['amount'] ?? 0);
                $adjustmentNet += $amount;
                if ($amount >= 0) $adjustmentCredits += $amount; else $adjustmentDebits += abs($amount);
                $adjustments[] = $entry;
            }
            if ($entryType === 'TRADE_PNL') $signalLedger[] = $entry;
        }
        $adjustmentNet = round($adjustmentNet, 2);
        $adjustmentCredits = round($adjustmentCredits, 2);
        $adjustmentDebits = round($adjustmentDebits, 2);
        $depositAdjustmentNet = 0.0;
        foreach ($adjustments as $adj) {
            $adjDesc = strtoupper(trim((string)($adj['description'] ?? '')));
            $adjReason = strtoupper(trim((string)($adj['reason'] ?? '')));
            $adjRef = strtoupper(trim((string)($adj['reference_id'] ?? '')));
            $adjTypeText = trim($adjDesc . ' ' . $adjReason . ' ' . $adjRef);
            // Deposit-type adjustments are principal. Support both the newer
            // typed format ([DEPOSIT]) and older admin adjustments whose reason
            // explicitly says Deposit. Referral Bonus, Profit, and Other are
            // never included in principal. Negative Deposit adjustments reduce
            // the principal just like a deposit reversal.
            $isTypedDeposit = strpos($adjDesc, '[DEPOSIT]') === 0 || strpos($adjReason, '[DEPOSIT]') === 0 || strpos($adjRef, '[DEPOSIT]') === 0;
            $isLegacyDeposit = !$isTypedDeposit
                && strpos($adjDesc, '[REFERRAL_BONUS]') !== 0
                && strpos($adjDesc, '[PROFIT]') !== 0
                && strpos($adjDesc, '[OTHER]') !== 0
                && preg_match('/\bDEPOSIT\b/i', $adjTypeText);
            if ($isTypedDeposit || $isLegacyDeposit) {
                $depositAdjustmentNet += (float)($adj['amount'] ?? 0);
            }
        }
        $depositAdjustmentNet = round($depositAdjustmentNet, 2);
        $fundedCapital = max(0.0, (float)$completedDeposits['amount'] + $depositAdjustmentNet);

        // Match signal execution records to their immutable TRADE_PNL ledger
        // records. This lets the admin see a confirmed execution that has no
        // corresponding positive profit-credit record without inventing a failure.
        $ledgerSignalIds = [];
        foreach ($signalLedger as $entry) {
            $ref = (string)($entry['reference_id'] ?? '');
            $desc = (string)($entry['description'] ?? '');
            if ($ref !== '') $ledgerSignalIds[$ref] = true;
            if (preg_match('/signal\s+([^\s\)]+)/i', $desc, $m)) $ledgerSignalIds[(string)$m[1]] = true;
        }
        $confirmedNoProfit = [];
        // Profit credited is the actual positive TRADE_PNL ledger amount, not a
        // client-reported execution estimate. This is the financial source of truth.
        $profitCreditTotal = 0.0;
        foreach ($signalLedger as $ledgerProfit) {
            $profitCreditTotal += max(0, (float)($ledgerProfit['amount'] ?? 0));
        }
        $failedExecutionCount = 0;
        $confirmedCount = count($executionRows);
        foreach ($executionRows as $ex) {
            $profit = (float)($ex['profit_amount'] ?? 0);
            $status = strtoupper((string)($ex['status'] ?? 'COMPLETED'));
            $execId = (string)($ex['id'] ?? '');
            $signalId = (string)($ex['signal_id'] ?? '');
            $hasLedgerCredit = ($execId !== '' && isset($ledgerSignalIds[$execId])) || ($signalId !== '' && isset($ledgerSignalIds[$signalId])) || ($signalId !== '' && isset($ledgerSignalIds['sig_exec_' . $execId]));
            if ($status === 'FAILED' || $profit <= 0 || !$hasLedgerCredit) {
                if ($status === 'FAILED') $failedExecutionCount++;
                $confirmedNoProfit[] = [
                    'signal_id' => $signalId,
                    'execution_id' => $execId,
                    'status' => $status,
                    'profit_amount' => $profit,
                    'executed_at' => $ex['executed_at'] ?? ($ex['created_at'] ?? null),
                    'reason' => $status === 'FAILED' ? 'Execution marked FAILED' : ($profit <= 0 ? 'No positive profit recorded' : 'No matching TRADE_PNL ledger credit recorded')
                ];
            }
        }
        $profitCreditTotal = round($profitCreditTotal, 2);

        $executedSignalIds = [];
        foreach ($executionRows as $ex) {
            $sid = trim((string)($ex['signal_id'] ?? ''));
            if ($sid !== '') $executedSignalIds[$sid] = true;
        }
        foreach ($signalLedger as $entry) {
            $ref = (string)($entry['reference_id'] ?? '');
            $desc = (string)($entry['description'] ?? '');
            if (preg_match('/signal\s+([^\s\)]+)/i', $desc, $m)) $executedSignalIds[(string)$m[1]] = true;
            if (strpos($ref, 'sig_exec_') === 0) {
                // Reference IDs from older rows identify an execution; the
                // execution table remains the authoritative confirmed-signal list.
            }
        }

        // A missed signal is a recorded signal whose confirmation window ended
        // after the user's account was created and for which no execution exists.
        // It is presented as a recorded-window metric, not as an assumption that
        // the user was eligible when the signal appeared.
        $nowTs = time();
        $missedSignals = [];
        $allRecordedSignals = array_merge($signalRows, $signalHistoryRows);
        $seenMissedSignalIds = [];
        foreach ($allRecordedSignals as $signal) {
            $sid = trim((string)($signal['id'] ?? ''));
            if ($sid === '' || isset($executedSignalIds[$sid]) || isset($seenMissedSignalIds[$sid])) continue;
            $status = strtoupper((string)($signal['status'] ?? ''));
            if (in_array($status, ['CANCELLED', 'DELETED'], true)) continue;
            $startRaw = (string)($signal['published_at'] ?? $signal['scheduled_at'] ?? $signal['created_at'] ?? '');
            if ($startRaw === '') continue;
            $startTs = strtotime($startRaw);
            if ($startTs === false) continue;
            $endRaw = (string)($signal['expires_at'] ?? '');
            $endTs = $endRaw !== '' ? strtotime($endRaw) : ($startTs + 15 * 60);
            if ($endTs === false || $endTs >= $nowTs) continue;
            $seenMissedSignalIds[$sid] = true;
            $missedSignals[] = [
                'signal_id' => $sid,
                'symbol' => $signal['symbol'] ?? 'SIGNAL',
                'direction' => $signal['direction'] ?? '',
                'profit_percentage' => (float)($signal['profit_percentage'] ?? 0),
                'status' => $status ?: 'EXPIRED',
                'published_at' => $signal['published_at'] ?? ($signal['scheduled_at'] ?? ($signal['created_at'] ?? null)),
                'expires_at' => $signal['expires_at'] ?? gmdate('Y-m-d H:i:s', $endTs)
            ];
        }

        $kyc = $kycRows[0] ?? null;
        if (is_array($kyc)) {
            // Never expose private password/PIN material even to an admin browser.
            foreach (['password_hash','withdrawal_pin','withdrawal_pin_hash'] as $secretField) unset($kyc[$secretField]);
        }
        $safeProfile = $profile;
        foreach (['password_hash','withdrawal_pin','withdrawal_pin_hash'] as $secretField) unset($safeProfile[$secretField]);
        $safeProfile['has_withdrawal_pin'] = !empty($profile['withdrawal_pin']) || !empty($profile['withdrawal_pin_hash']);

        $recentTransactions = [];
        foreach (array_slice($ledgerRows, 0, 200) as $entry) {
            $recentTransactions[] = [
                'id' => $entry['id'] ?? '',
                'type' => strtoupper((string)($entry['entry_type'] ?? 'LEDGER')),
                'wallet_type' => $entry['wallet_type'] ?? 'funding',
                'asset' => $entry['asset'] ?? 'USDT',
                'amount' => (float)($entry['amount'] ?? 0),
                'status' => 'COMPLETED',
                'description' => $entry['description'] ?? '',
                'reference_id' => $entry['reference_id'] ?? '',
                'created_at' => $entry['created_at'] ?? null
            ];
        }

        sendSuccess([
            'user' => $safeProfile,
            'wallets' => array_map(static fn($v) => round($v, 2), $wallets),
            'total_balance_usdt' => round($totalBalance, 2),
            'kyc' => $kyc,
            'deposits' => $depositRows,
            'withdrawals' => $withdrawalRows,
            'adjustments' => array_slice($adjustments, 0, 200),
            'recent_transactions' => $recentTransactions,
            'financial_summary' => [
                'deposit_count' => count($depositRows),
                'deposit_total_requested' => round(array_sum(array_map(static fn($r) => (float)($r['amount'] ?? 0), $depositRows)), 2),
                'deposit_completed_count' => (int)$completedDeposits['count'],
                'deposit_completed_total' => (float)$completedDeposits['amount'],
                'withdrawal_count' => count($withdrawalRows),
                'withdrawal_total_requested' => round(array_sum(array_map(static fn($r) => (float)($r['amount'] ?? 0), $withdrawalRows)), 2),
                'withdrawal_completed_count' => (int)$completedWithdrawals['count'],
                'withdrawal_completed_total' => (float)$completedWithdrawals['amount'],
                'adjustment_count' => count($adjustments),
                'adjustment_credits' => $adjustmentCredits,
                'adjustment_debits' => $adjustmentDebits,
                'adjustment_net' => $adjustmentNet,
                'funded_capital_principal' => round($fundedCapital, 2),
                'deposit_status' => $depositStatus,
                'withdrawal_status' => $withdrawalStatus
            ],
            'signal_summary' => [
                'confirmed_count' => $confirmedCount,
                'profit_credited_total' => $profitCreditTotal,
                'confirmed_without_profit_count' => count($confirmedNoProfit),
                'failed_execution_count' => $failedExecutionCount,
                'missed_signal_count' => count($missedSignals),
                'recorded_signal_count' => count($allRecordedSignals)
            ],
            'signal_executions' => $executionRows,
            'confirmed_without_profit' => $confirmedNoProfit,
            'missed_signals' => $missedSignals
        ], 'Complete user account dossier retrieved');
    }

    $search = trim($_GET['search'] ?? '');
    $roleFilter = trim($_GET['role'] ?? 'ALL');
    $kycFilter = trim($_GET['kyc_status'] ?? 'ALL');
    $limit = min(500, max(1, (int)($_GET['limit'] ?? 200)));

    // Profiles and wallet totals are independent remote reads. Run them in
    // parallel so the Users tab is bounded by the slower query instead of the
    // sum of both Supabase round-trips.
    $batch = $supabase->selectMany([
        'profiles' => [
            'table' => 'profiles',
            'params' => [
                'select' => 'id,email,role,is_active,kyc_status,referral_code,referred_by,created_at,country',
                'order' => 'created_at.desc',
                'limit' => (string)$limit
            ]
        ],
        'wallets' => [
            'table' => 'wallet_balances',
            'params' => ['select' => 'user_id,balance,available_balance,wallet_type,asset']
        ]
    ]);

    $res = $batch['profiles'] ?? ['success'=>false];
    $profiles = ($res['success'] && is_array($res['data'])) ? $res['data'] : [];
    $walletsRes = $batch['wallets'] ?? ['success'=>false];
    $walletTotals = [];
    if ($walletsRes['success'] && is_array($walletsRes['data'])) {
        foreach ($walletsRes['data'] as $wb) {
            $uid = $wb['user_id'] ?? '';
            $walletTotals[$uid] = ($walletTotals[$uid] ?? 0.0) + (float)($wb['balance'] ?? $wb['available_balance'] ?? 0);
        }
    }

    // Filter in-memory for resilience
    $formattedUsers = [];
    foreach ($profiles as $p) {
        $uid = $p['id'] ?? '';
        $email = $p['email'] ?? '';
        $role = $p['role'] ?? 'USER';
        $kyc = $p['kyc_status'] ?? 'NOT_SUBMITTED';
        $refCode = $p['referral_code'] ?? '';
        $referredBy = $p['referred_by'] ?? null;
        $isActive = isset($p['is_active']) ? (int)$p['is_active'] : 1;
        $createdAt = $p['created_at'] ?? gmdate('Y-m-d H:i:s');

        // Apply filters
        if ($roleFilter !== 'ALL' && !empty($roleFilter) && strtoupper($role) !== strtoupper($roleFilter)) {
            continue;
        }
        if ($kycFilter !== 'ALL' && !empty($kycFilter) && strtoupper($kyc) !== strtoupper($kycFilter)) {
            continue;
        }
        if (!empty($search)) {
            $sLower = strtolower($search);
            if (strpos(strtolower($email), $sLower) === false &&
                strpos(strtolower($uid), $sLower) === false &&
                strpos(strtolower($refCode), $sLower) === false) {
                continue;
            }
        }

        $formattedUsers[] = [
            'id' => $uid,
            'email' => $email,
            'role' => $role,
            'is_active' => $isActive,
            'kyc_status' => $kyc,
            'referral_code' => $refCode,
            'referred_by' => $referredBy,
            'country' => $p['country'] ?? null,
            'created_at' => $createdAt,
            'total_balance_usdt' => round($walletTotals[$uid] ?? 0.0, 2)
        ];
    }

    sendSuccess([
        'users' => $formattedUsers,
        'total' => count($formattedUsers),
        'database_engine' => 'supabase-rest'
    ], 'Users retrieved successfully from Supabase');
}

// ==========================================
// POST /api/admin/users.php
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonBody();
    $action = strtoupper(trim($input['action'] ?? ''));

    // 1. CREATE USER / ADMIN
    if ($action === 'CREATE' || $action === 'ADD') {
        $email = strtolower(trim($input['email'] ?? ''));
        $password = trim((string)($input['password'] ?? ''));
        if ($password === '' || strlen($password) < 10 || !preg_match('/[A-Z]/', $password) || !preg_match('/[a-z]/', $password) || !preg_match('/\d/', $password) || !preg_match('/[^A-Za-z0-9]/', $password)) {
            sendError('WEAK_PASSWORD', 'A strong password of at least 10 characters with upper, lower, number and symbol is required.');
        }
        $role = strtoupper(trim($input['role'] ?? 'USER'));
        if (!in_array($role, ['USER','TRADER','VIP','ADMIN','SUPER_ADMIN','FINANCE_MANAGER','KYC_MANAGER'], true)) sendError('VALIDATION_ERROR', 'Invalid role.');
        if (in_array($role, ['ADMIN','SUPER_ADMIN','FINANCE_MANAGER','KYC_MANAGER'], true) && strtoupper($admin['role'] ?? '') !== 'SUPER_ADMIN') sendError('FORBIDDEN', 'Only a SUPER_ADMIN may create privileged accounts.', 403);
        $kycStatus = strtoupper(trim($input['kyc_status'] ?? 'NOT_SUBMITTED'));
        $initialFunding = max(0, (float)($input['initial_funding'] ?? $input['balance'] ?? 0));
        $referralCode = trim($input['referral_code'] ?? ('REF' . strtoupper(bin2hex(random_bytes(4)))));

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendError('VALIDATION_ERROR', 'A valid email address is required');
        }

        // Create user in Supabase Auth
        $authRes = $supabase->authAdminCreateUser($email, $password, [
            'role' => $role,
            'kyc_status' => $kycStatus,
            'referral_code' => $referralCode
        ]);

        $userId = $authRes['data']['id'] ?? sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $profileData = [
            'id' => $userId,
            'email' => $email,
            'password_hash' => $hash,
            'role' => $role,
            'is_active' => 1,
            'kyc_status' => $kycStatus,
            'referral_code' => $referralCode,
            'created_at' => gmdate('Y-m-d H:i:s'),
            'updated_at' => gmdate('Y-m-d H:i:s')
        ];

        $supabase->upsert('profiles', [$profileData], 'id');

        // Create default wallet balances
        $wallets = [
            ['user_id' => $userId, 'wallet_type' => 'funding', 'asset' => 'USDT', 'balance' => $initialFunding, 'available_balance' => $initialFunding, 'reserved_balance' => 0.0, 'promotional_balance' => 0.0],
            ['user_id' => $userId, 'wallet_type' => 'exchange', 'asset' => 'USDT', 'balance' => 0.0, 'available_balance' => 0.0, 'reserved_balance' => 0.0, 'promotional_balance' => 0.0],
            ['user_id' => $userId, 'wallet_type' => 'trading', 'asset' => 'USDT', 'balance' => 0.0, 'available_balance' => 0.0, 'reserved_balance' => 0.0, 'promotional_balance' => 0.0]
        ];
        $supabase->upsert('wallet_balances', $wallets, 'user_id,wallet_type,asset');

        sendSuccess([
            'id' => $userId,
            'email' => $email,
            'role' => $role,
            'referral_code' => $referralCode,
            'kyc_status' => $kycStatus
        ], 'User successfully created in Supabase');
    }

    // 2. PERMANENTLY DELETE USER
    if ($action === 'DELETE') {
        $userId = trim((string)($input['user_id'] ?? $input['id'] ?? ''));
        if ($userId === '') sendError('VALIDATION_ERROR', 'User ID is required');
        if ($userId === (string)($admin['id'] ?? '')) sendError('FORBIDDEN', 'You cannot delete the currently logged-in admin account.', 403);

        $targetRes = $supabase->select('profiles', ['id' => 'eq.' . $userId, 'limit' => '1']);
        if (!$targetRes['success'] || empty($targetRes['data'][0])) sendError('USER_NOT_FOUND', 'User account was not found.', 404);
        $target = $targetRes['data'][0];

        // Remove the authentication account first. If Supabase Auth refuses the
        // deletion because a foreign key still references the account, no financial
        // records are touched and the admin receives a clear failure.
        $authDelete = $supabase->authAdminDeleteUser($userId);
        if (!$authDelete['success']) {
            sendError('AUTH_USER_DELETE_FAILED', 'Supabase could not delete the authentication account, so no user database records were deleted.', 502);
        }

        // Clean up user-owned records after Auth deletion. Most production tables
        // use user_id; a few legacy installations used from_user_id/to_user_id.
        // Optional legacy tables/columns are ignored when they are absent.
        $ownedDeletes = [
            ['table'=>'user_signal_executions','params'=>['user_id'=>'eq.' . $userId]],
            ['table'=>'ledger_entries','params'=>['user_id'=>'eq.' . $userId]],
            ['table'=>'deposits','params'=>['user_id'=>'eq.' . $userId]],
            ['table'=>'withdrawals','params'=>['user_id'=>'eq.' . $userId]],
            ['table'=>'wallet_balances','params'=>['user_id'=>'eq.' . $userId]],
            ['table'=>'kyc_submissions','params'=>['user_id'=>'eq.' . $userId]],
            ['table'=>'user_notifications','params'=>['user_id'=>'eq.' . $userId]],
            ['table'=>'user_sessions','params'=>['user_id'=>'eq.' . $userId]],
            ['table'=>'security_rate_limits','params'=>['user_id'=>'eq.' . $userId]],
            ['table'=>'idempotency_keys','params'=>['user_id'=>'eq.' . $userId]],
            ['table'=>'approval_requests','params'=>['user_id'=>'eq.' . $userId]],
            ['table'=>'internal_transfers','params'=>['user_id'=>'eq.' . $userId]],
            ['table'=>'internal_transfers','params'=>['from_user_id'=>'eq.' . $userId]],
            ['table'=>'internal_transfers','params'=>['to_user_id'=>'eq.' . $userId]],
            ['table'=>'positions','params'=>['user_id'=>'eq.' . $userId]],
            ['table'=>'orders','params'=>['user_id'=>'eq.' . $userId]],
            ['table'=>'copy_trades','params'=>['user_id'=>'eq.' . $userId]],
            ['table'=>'profiles','params'=>['id'=>'eq.' . $userId]],
        ];
        $cleanupWarnings = [];
        foreach ($ownedDeletes as $deleteSpec) {
            $result = $supabase->delete($deleteSpec['table'], $deleteSpec['params']);
            if (!$result['success']) {
                $message = (string)($result['message'] ?? $result['error'] ?? 'Database delete failed.');
                if (preg_match('/(?:relation|table).*does not exist|undefined table|column .* does not exist|schema cache/i', $message)) {
                    continue;
                }
                $cleanupWarnings[] = $deleteSpec['table'];
            }
        }

        sendSuccess([
            'user_id' => $userId,
            'email' => $target['email'] ?? '',
            'deleted' => true,
            'cleanup_warnings' => array_values(array_unique($cleanupWarnings))
        ], 'User account and user-owned database records were permanently deleted');
    }

    // 3. UPDATE ROLE / STATUS / KYC
    if ($action === 'UPDATE' || $action === 'UPDATE_ROLE' || $action === 'UPDATE_STATUS' || $action === 'UPDATE_KYC') {
        $userId = trim($input['user_id'] ?? $input['id'] ?? '');
        if (empty($userId)) {
            sendError('VALIDATION_ERROR', 'User ID is required');
        }

        $updateData = ['updated_at' => gmdate('Y-m-d H:i:s')];
        if (isset($input['role'])) {
            $requestedRole = strtoupper(trim($input['role']));
            if (in_array($requestedRole, ['ADMIN','SUPER_ADMIN','FINANCE_MANAGER','KYC_MANAGER'], true) && strtoupper($admin['role'] ?? '') !== 'SUPER_ADMIN') {
                sendError('FORBIDDEN', 'Only a SUPER_ADMIN may assign privileged roles.', 403);
            }
            if (!in_array($requestedRole, ['USER','TRADER','VIP','ADMIN','SUPER_ADMIN','FINANCE_MANAGER','KYC_MANAGER'], true)) sendError('VALIDATION_ERROR', 'Invalid role.');
            $updateData['role'] = $requestedRole;
        }
        if (isset($input['is_active'])) $updateData['is_active'] = (int)$input['is_active'];
        if (isset($input['kyc_status'])) $updateData['kyc_status'] = strtoupper(trim($input['kyc_status']));

        $res = $supabase->update('profiles', $updateData, ['id' => "eq.{$userId}"]);
        if (!$res['success']) {
            sendError('SUPABASE_UPDATE_FAILED', '\1Failed to update \2.', 502);
        }

        sendSuccess(['user_id' => $userId, 'updated' => $updateData], 'User updated successfully in Supabase');
    }

    // 4. ADJUST BALANCE
    if ($action === 'ADJUST_BALANCE' || $action === 'CREDIT' || $action === 'DEBIT') {
        $userId = trim($input['user_id'] ?? $input['id'] ?? '');
        $walletType = strtolower(trim($input['wallet_type'] ?? 'funding'));
        $asset = strtoupper(trim($input['asset'] ?? 'USDT'));
        $amount = (float)($input['amount'] ?? 0);
        $description = trim($input['reason'] ?? $input['description'] ?? 'Administrative Balance Adjustment');

        if (empty($userId) || $amount == 0) {
            sendError('VALIDATION_ERROR', 'User ID and non-zero amount are required');
        }

        // Fetch current wallet balance
        $wbRes = $supabase->select('wallet_balances', [
            'user_id' => "eq.{$userId}",
            'wallet_type' => "eq.{$walletType}",
            'asset' => "eq.{$asset}",
            'limit' => '1'
        ]);

        $curBalance = 0.0;
        if ($wbRes['success'] && !empty($wbRes['data'][0])) {
            $curBalance = (float)($wbRes['data'][0]['balance'] ?? 0);
        }

        $newBalance = max(0, $curBalance + $amount);

        // Persist the wallet first, then the ledger. Do not report success if either write fails.
        $walletPayload = [
            'user_id' => $userId,
            'wallet_type' => $walletType,
            'asset' => $asset,
            'balance' => $newBalance,
            'available_balance' => $newBalance,
            'updated_at' => gmdate('Y-m-d H:i:s')
        ];
        $walletWrite = $supabase->upsert('wallet_balances', [$walletPayload], 'user_id,wallet_type,asset');
        if (!$walletWrite['success']) {
            sendError('BALANCE_UPDATE_FAILED', 'Balance adjustment could not be saved.', 502, ['details' => $walletWrite['message'] ?? $walletWrite['error'] ?? null]);
        }

        $ledgerData = [
            'user_id' => $userId,
            'wallet_type' => $walletType,
            'asset' => $asset,
            'amount' => $amount,
            'balance_before' => $curBalance,
            'balance_after' => $newBalance,
            'entry_type' => 'ADJUSTMENT',
            'description' => $description,
            'created_at' => gmdate('Y-m-d H:i:s')
        ];
        $ledgerWrite = $supabase->insert('ledger_entries', [$ledgerData]);
        if (!$ledgerWrite['success']) {
            $supabase->upsert('wallet_balances', [[
                'user_id' => $userId,
                'wallet_type' => $walletType,
                'asset' => $asset,
                'balance' => $curBalance,
                'available_balance' => $curBalance,
                'updated_at' => gmdate('Y-m-d H:i:s')
            ]], 'user_id,wallet_type,asset');
            sendError('LEDGER_WRITE_FAILED', 'Balance was not changed because the adjustment ledger entry could not be saved.', 502);
        }

        sendSuccess([
            'user_id' => $userId,
            'wallet_type' => $walletType,
            'asset' => $asset,
            'previous_balance' => $curBalance,
            'new_balance' => $newBalance,
            'reason' => $description
        ], 'Balance adjusted successfully in Supabase');
    }

    sendError('INVALID_ACTION', 'Unrecognized admin user action');
}
