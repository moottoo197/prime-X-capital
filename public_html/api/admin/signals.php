<?php
/**
 * Admin Trading Signals Management - Direct Supabase REST
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/signal_lifecycle.php';

$admin = requireAdmin();
$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Archive first so expired signals are available in history before any cleanup RPC can remove them.
    alphavest_archive_expired_signals($supabase);
    // Admin-only single-signal detail. This is read-only analytics and does not
    // change signal creation, scheduling, execution, expiry, or deletion logic.
    $requestedSignalId = trim((string)($_GET['signal_id'] ?? ''));
    if ($requestedSignalId !== '') {
        $signalRes = $supabase->select('trading_signals', [
            'id' => 'eq.' . $requestedSignalId,
            'limit' => '1'
        ]);
        $signal = ($signalRes['success'] && !empty($signalRes['data'][0])) ? $signalRes['data'][0] : null;
        $source = 'LIVE_RECORD';
        if (!$signal) {
            $historyRes = $supabase->select('trading_signal_history', [
                'id' => 'eq.' . $requestedSignalId,
                'limit' => '1'
            ]);
            $signal = ($historyRes['success'] && !empty($historyRes['data'][0])) ? $historyRes['data'][0] : null;
            $source = 'ARCHIVED_HISTORY';
        }
        if (!$signal) sendError('SIGNAL_NOT_FOUND', 'Signal record was not found.', 404);
        $signalIsTesting = strpos((string)($signal['id'] ?? ''), 'sig_test_') === 0
            || filter_var($signal['is_testing'] ?? false, FILTER_VALIDATE_BOOLEAN)
            || filter_var($signal['no_profit'] ?? false, FILTER_VALIDATE_BOOLEAN);
        if ($signalIsTesting) $signal['profit_percentage'] = 0;

        $startRaw = (string)($signal['published_at'] ?? $signal['scheduled_at'] ?? $signal['created_at'] ?? '');
        $startTs = $startRaw !== '' ? strtotime($startRaw) : false;
        $endRaw = (string)($signal['expires_at'] ?? '');
        $endTs = $endRaw !== '' ? strtotime($endRaw) : false;
        if ($endTs === false && $startTs !== false) $endTs = $startTs + max(1, (int)($signal['duration_minutes'] ?? 15)) * 60;

        $profilesRes = $supabase->selectAll('profiles', [
            'select' => 'id,email,country,is_active,role,created_at',
            'order' => 'created_at.asc'
        ], 1000);
        $depositsRes = $supabase->selectAll('deposits', [
            'select' => 'user_id,amount,status'
        ], 1000);
        $walletsRes = $supabase->selectAll('wallet_balances', [
            'select' => 'user_id,asset,balance,wallet_type'
        ], 1000);
        $adjustmentsRes = $supabase->selectAll('ledger_entries', [
            'entry_type' => 'eq.ADJUSTMENT',
            'select' => 'user_id,asset,amount,description,reason,reference_id,created_at'
        ], 1000);
        $execRes = $supabase->selectAll('user_signal_executions', [
            'signal_id' => 'eq.' . $requestedSignalId,
            'order' => 'executed_at.asc'
        ], 1000);
        $ledgerRes = $supabase->selectAll('ledger_entries', [
            'entry_type' => 'eq.TRADE_PNL',
            'order' => 'created_at.asc'
        ], 1000);

        $profiles = ($profilesRes['success'] && is_array($profilesRes['data'])) ? $profilesRes['data'] : [];
        $deposits = ($depositsRes['success'] && is_array($depositsRes['data'])) ? $depositsRes['data'] : [];
        $wallets = ($walletsRes['success'] && is_array($walletsRes['data'])) ? $walletsRes['data'] : [];
        $adjustments = ($adjustmentsRes['success'] && is_array($adjustmentsRes['data'])) ? $adjustmentsRes['data'] : [];
        $executions = ($execRes['success'] && is_array($execRes['data'])) ? $execRes['data'] : [];
        $ledger = ($ledgerRes['success'] && is_array($ledgerRes['data'])) ? $ledgerRes['data'] : [];

        $depositByUser = [];
        foreach ($deposits as $d) {
            if (!in_array(strtoupper((string)($d['status'] ?? '')), ['COMPLETED','APPROVED','CONFIRMED'], true)) continue;
            $uid = (string)($d['user_id'] ?? '');
            if ($uid === '') continue;
            $depositByUser[$uid] = ($depositByUser[$uid] ?? 0.0) + (float)($d['amount'] ?? 0);
        }
        $balanceByUser = [];
        foreach ($wallets as $w) {
            if (strtoupper((string)($w['asset'] ?? 'USDT')) !== 'USDT') continue;
            $uid = (string)($w['user_id'] ?? '');
            if ($uid === '') continue;
            $balanceByUser[$uid] = ($balanceByUser[$uid] ?? 0.0) + (float)($w['balance'] ?? 0);
        }
        $adjustmentByUser = [];
        foreach ($adjustments as $adj) {
            if (strtoupper((string)($adj['asset'] ?? 'USDT')) !== 'USDT') continue;
            $uid = (string)($adj['user_id'] ?? '');
            if ($uid === '') continue;
            $desc = strtoupper(trim((string)($adj['description'] ?? '')));
            $reason = strtoupper(trim((string)($adj['reason'] ?? '')));
            $reference = strtoupper(trim((string)($adj['reference_id'] ?? '')));
            $sourceText = trim($desc . ' ' . $reason . ' ' . $reference);
            $typedDeposit = strpos($desc, '[DEPOSIT]') === 0 || strpos($reason, '[DEPOSIT]') === 0 || strpos($reference, '[DEPOSIT]') === 0;
            $legacyDeposit = !$typedDeposit
                && strpos($desc, '[REFERRAL_BONUS]') !== 0
                && strpos($desc, '[PROFIT]') !== 0
                && strpos($desc, '[OTHER]') !== 0
                && preg_match('/\bDEPOSIT\b/i', $sourceText);
            if ($typedDeposit || $legacyDeposit) {
                $adjustmentByUser[$uid] = ($adjustmentByUser[$uid] ?? 0.0) + (float)($adj['amount'] ?? 0);
            }
        }
        $fundedCapitalByUser = [];
        foreach ($balanceByUser as $uid => $balance) {
            $fundedCapitalByUser[$uid] = max(0.0, (float)($depositByUser[$uid] ?? 0) + (float)($adjustmentByUser[$uid] ?? 0));
        }
        $execByUser = [];
        $execIds = [];
        $execSignalById = [];
        foreach ($executions as $ex) {
            $uid = (string)($ex['user_id'] ?? '');
            if ($uid === '') continue;
            $execByUser[$uid] = $ex;
            $eid = (string)($ex['id'] ?? '');
            if ($eid !== '') { $execIds[$eid] = $uid; $execSignalById[$eid] = (string)($ex['signal_id'] ?? ''); }
        }
        $profitByUser = [];
        $profitByExecution = [];
        $snapshotByExecution = [];
        foreach ($ledger as $entry) {
            $refForExecution = (string)($entry['reference_id'] ?? '');
            if (strpos($refForExecution, 'sig_exec_') === 0) {
                $execKey = substr($refForExecution, 9);
                if ($execKey !== '') {
                    $entryAmount = max(0.0, (float)($entry['amount'] ?? 0));
                    $profitByExecution[$execKey] = ($profitByExecution[$execKey] ?? 0.0) + $entryAmount;
                    $snapshotByExecution[$execKey] = $entry;
                }
            }
            if ($signalIsTesting) continue;
            $ref = (string)($entry['reference_id'] ?? '');
            $desc = (string)($entry['description'] ?? '');
            $uid = (string)($entry['user_id'] ?? '');
            if ($uid === '' && strpos($ref, 'sig_exec_') === 0) {
                $execId = substr($ref, 9);
                $uid = (string)($execIds[$execId] ?? '');
            }
            $matchesSignal = ($ref === $requestedSignalId) || ($ref === 'sig_' . $requestedSignalId);
            if (!$matchesSignal && strpos($ref, 'sig_exec_') === 0) {
                $execKey = substr($ref, 9);
                $matchesSignal = isset($execSignalById[$execKey]) && $execSignalById[$execKey] === $requestedSignalId;
            }
            // Reconciliation rows use the exact signal ID after the prefix.
            if (!$matchesSignal && strpos($ref, 'sig_profit_reconcile:') === 0) {
                $parts = explode(':', $ref);
                $matchesSignal = ((string)($parts[1] ?? '') === $requestedSignalId);
            }
            if (!$matchesSignal) continue;
            if ($uid === '') continue;
            $profitByUser[$uid] = ($profitByUser[$uid] ?? 0.0) + max(0, (float)($entry['amount'] ?? 0));
        }

        $privilegedRoles = ['ADMIN','SUPER_ADMIN','VIP','FINANCE_MANAGER','KYC_MANAGER'];
        $countryStats = [];
        $userResults = [];
        $eligibleUsers = 0;
        $notEligibleUsers = 0;
        $confirmedUsers = 0;
        $profitCreditedUsers = 0;
        $confirmedNoProfitUsers = 0;
        $failedUsers = 0;
        $notConfirmedUsers = 0;
        $totalProfit = 0.0;

        foreach ($profiles as $profile) {
            $uid = (string)($profile['id'] ?? '');
            if ($uid === '') continue;
            $createdTs = strtotime((string)($profile['created_at'] ?? ''));
            $existsAtStart = ($startTs === false || $createdTs === false) ? true : ($createdTs <= $startTs);
            $active = !empty($profile['is_active']);
            $role = strtoupper((string)($profile['role'] ?? 'USER'));
            $eligible = $existsAtStart && ($active) && ((float)($fundedCapitalByUser[$uid] ?? 0) >= 20.0 || in_array($role, $privilegedRoles, true));
            $country = trim((string)($profile['country'] ?? ''));
            if ($country === '') $country = 'Unknown / Not Set';
            $key = strtoupper($country);
            if (!isset($countryStats[$key])) $countryStats[$key] = ['country'=>$country,'eligible'=>0,'not_eligible'=>0,'confirmed'=>0,'profit_credited'=>0,'confirmed_no_profit'=>0,'failed'=>0,'not_confirmed'=>0,'users'=>0];
            $countryStats[$key]['users']++;

            $ex = $execByUser[$uid] ?? null;
            $executionIdForRow = (string)($ex['id'] ?? '');
            $executionProfit = (float)($ex['profit_amount'] ?? 0);
            $profit = (float)($profitByUser[$uid] ?? 0.0);
            if ($profit <= 0 && !$signalIsTesting && $executionIdForRow !== '') {
                $profit = (float)($profitByExecution[$executionIdForRow] ?? $executionProfit);
            }
            $state = 'NOT_ELIGIBLE_OR_NOT_SHOWN';
            $reason = !$existsAtStart ? 'Account was created after the signal started.' : (!$active ? 'Account was inactive/suspended during the signal window.' : 'User did not meet the signal eligibility threshold.');
            if ($eligible) {
                $eligibleUsers++;
                $countryStats[$key]['eligible']++;
                if ($ex) {
                    $confirmedUsers++;
                    $countryStats[$key]['confirmed']++;
                    $status = strtoupper((string)($ex['status'] ?? 'COMPLETED'));
                    $executionProfit = (float)($ex['profit_amount'] ?? 0);
                    if ($status === 'FAILED') {
                        $failedUsers++;
                        $countryStats[$key]['failed']++;
                        $state = 'FAILED';
                        $reason = 'Execution record is marked FAILED.';
                    } elseif ($profit > 0) {
                        $profitCreditedUsers++;
                        $countryStats[$key]['profit_credited']++;
                        $totalProfit += $profit;
                        $state = 'CONFIRMED_PROFIT_CREDITED';
                        $reason = 'Positive TRADE_PNL ledger credit recorded.';
                    } else {
                        $confirmedNoProfitUsers++;
                        $countryStats[$key]['confirmed_no_profit']++;
                        $state = 'CONFIRMED_NO_PROFIT';
                        $reason = $executionProfit > 0 ? 'Execution reported profit, but no positive TRADE_PNL ledger credit was found.' : 'No positive profit was recorded.';
                    }
                } else {
                    $notConfirmedUsers++;
                    $countryStats[$key]['not_confirmed']++;
                    $state = 'NOT_CONFIRMED';
                    $reason = 'No confirmation execution record was found for this signal.';
                }
            } else {
                $notEligibleUsers++;
                $countryStats[$key]['not_eligible']++;
            }

            // The "Every User — Signal Result" list is intentionally confirmation-only.
            // Do not expose eligible users who never confirmed this signal.
            if (!$ex) continue;

            $ledgerSnapshot = $executionIdForRow !== '' ? ($snapshotByExecution[$executionIdForRow] ?? null) : null;
            $principalSnapshot = isset($ex['principal_balance']) ? (float)$ex['principal_balance'] : 0.0;
            $balanceBeforeSnapshot = isset($ex['balance_before']) ? (float)$ex['balance_before'] : 0.0;
            $balanceAfterSnapshot = isset($ex['balance_after']) ? (float)$ex['balance_after'] : 0.0;

            // Backfill display-only values for older confirmations from the immutable
            // TRADE_PNL ledger row. New confirmations continue using their stored
            // execution snapshots. No wallet balance is changed by this fallback.
            if ($ledgerSnapshot) {
                if ($balanceBeforeSnapshot <= 0 && isset($ledgerSnapshot['balance_before'])) {
                    $balanceBeforeSnapshot = (float)$ledgerSnapshot['balance_before'];
                }
                if ($balanceAfterSnapshot <= 0 && isset($ledgerSnapshot['balance_after'])) {
                    $balanceAfterSnapshot = (float)$ledgerSnapshot['balance_after'];
                }
            }
            if ($principalSnapshot <= 0 && $balanceBeforeSnapshot > 0) {
                $executedAtTs = strtotime((string)($ex['executed_at'] ?? $ex['created_at'] ?? ''));
                $historicalDeposits = 0.0;
                foreach ($deposits as $dep) {
                    if (strtoupper((string)($dep['status'] ?? '')) !== 'COMPLETED') continue;
                    $depTs = strtotime((string)($dep['created_at'] ?? ''));
                    if ($executedAtTs !== false && $depTs !== false && $depTs > $executedAtTs) continue;
                    if ($depTs === false && $executedAtTs !== false) continue;
                    if ((string)($dep['user_id'] ?? '') === $uid) $historicalDeposits += (float)($dep['amount'] ?? 0);
                }
                $historicalAdjustments = 0.0;
                foreach ($adjustments as $adj) {
                    $adjTs = strtotime((string)($adj['created_at'] ?? ''));
                    if ($executedAtTs !== false && $adjTs !== false && $adjTs > $executedAtTs) continue;
                    if ($adjTs === false && $executedAtTs !== false) continue;
                    if ((string)($adj['user_id'] ?? '') !== $uid || strtoupper((string)($adj['asset'] ?? 'USDT')) !== 'USDT') continue;
                    $desc = strtoupper(trim((string)($adj['description'] ?? '')));
                    $reasonText = strtoupper(trim((string)($adj['reason'] ?? '')));
                    $reference = strtoupper(trim((string)($adj['reference_id'] ?? '')));
                    $sourceText = trim($desc . ' ' . $reasonText . ' ' . $reference);
                    $typedDeposit = strpos($desc, '[DEPOSIT]') === 0 || strpos($reasonText, '[DEPOSIT]') === 0 || strpos($reference, '[DEPOSIT]') === 0;
                    $legacyDeposit = !$typedDeposit
                        && strpos($desc, '[REFERRAL_BONUS]') !== 0
                        && strpos($desc, '[PROFIT]') !== 0
                        && strpos($desc, '[OTHER]') !== 0
                        && preg_match('/\bDEPOSIT\b/i', $sourceText);
                    if ($typedDeposit || $legacyDeposit) $historicalAdjustments += (float)($adj['amount'] ?? 0);
                }
                $principalSnapshot = max(0.0, min($balanceBeforeSnapshot, $historicalDeposits + $historicalAdjustments));
            }

            $userResults[] = [
                'user_id' => $uid,
                'email' => $profile['email'] ?? '',
                'country' => $country,
                'status' => $state,
                'reason' => $reason,
                'profit_credited' => round($profit, 2),
                'principal_balance' => round($principalSnapshot, 2),
                'balance_before' => round($balanceBeforeSnapshot, 2),
                'balance_after' => round($balanceAfterSnapshot, 2),
                'execution_status' => $ex['status'] ?? null,
                'confirmed_at' => $ex['executed_at'] ?? ($ex['created_at'] ?? null),
                'is_active' => $active,
                'eligible' => $eligible
            ];
        }

        uasort($countryStats, static function($a, $b) { return strcasecmp($a['country'], $b['country']); });
        $countriesShown = array_values(array_filter($countryStats, static fn($x) => $x['eligible'] > 0));
        $countriesNotShown = array_values(array_filter($countryStats, static fn($x) => $x['eligible'] === 0 && $x['users'] > 0));
        $countriesConfirmed = array_values(array_filter($countryStats, static fn($x) => $x['confirmed'] > 0));
        $countriesFailed = array_values(array_filter($countryStats, static fn($x) => $x['failed'] > 0 || $x['confirmed_no_profit'] > 0));

        sendSuccess([
            'signal' => $signal,
            'source' => $source,
            'audience' => [
                'scope' => 'ALL_COUNTRIES',
                'label' => 'Worldwide — All Countries',
                'eligible_users' => $eligibleUsers,
                'not_eligible_or_not_shown_users' => $notEligibleUsers,
                'countries_with_eligible_users' => count($countriesShown),
                'countries_with_no_eligible_users' => count($countriesNotShown)
            ],
            'analytics' => [
                'confirmed_users' => $confirmedUsers,
                'profit_credited_users' => $profitCreditedUsers,
                'confirmed_without_profit_users' => $confirmedNoProfitUsers,
                'failed_execution_users' => $failedUsers,
                'eligible_not_confirmed_users' => $notConfirmedUsers,
                'total_profit_credited' => round($totalProfit, 2),
                'total_profiles_reviewed' => count($userResults),
                'note' => 'Worldwide delivery is determined by the existing signal eligibility rules. The current system does not record a per-user screen-view event, so eligible means the signal was available to that user; it does not prove the user opened the signal screen.'
            ],
            'countries' => [
                'shown' => array_values($countriesShown),
                'confirmed' => array_values($countriesConfirmed),
                'failed_or_no_profit' => array_values($countriesFailed),
                'not_shown_or_not_eligible' => array_values($countriesNotShown)
            ],
            'users' => $userResults
        ], 'Signal detail analytics retrieved from Supabase');
    }

    // Archive first, then let the cleanup RPC remove any remaining expired live rows.
    alphavest_archive_expired_signals($supabase);
    try { $supabase->rpc('alphavest_cleanup_signals'); } catch (Throwable $e) {}
    $sigRes = $supabase->select('trading_signals', [
        'status' => 'in.(PUBLISHED,ACTIVE,SCHEDULED)',
        'select' => '*',
        'order' => 'created_at.desc',
        'limit' => '500'
    ]);

    if (!$sigRes['success']) {
        sendError('SUPABASE_QUERY_FAILED', '\1Failed to retrieve \2.', 502);
    }

    $rawSignals = is_array($sigRes['data']) ? $sigRes['data'] : [];
    $adminNow = new DateTime('now', new DateTimeZone('Asia/Karachi'));
    $adminToday = $adminNow->format('Y-m-d');
    $signals = [];
    foreach ($rawSignals as $signalRow) {
        $sigId = (string)($signalRow['id'] ?? '');
        $isTesting = strpos($sigId, 'sig_test_') === 0;
        $slot = (int)($signalRow['daily_slot'] ?? 0);
        if (!$isTesting && in_array($slot, [1, 2], true)) {
            // Normal daily sessions always use the fixed 2.5% rate.
            $signalRow['profit_percentage'] = 2.5;
        }
        $rawStart = (string)($signalRow['scheduled_at'] ?? $signalRow['published_at'] ?? $signalRow['created_at'] ?? '');
        $startDay = '';
        if ($rawStart !== '') {
            try { $d = new DateTime($rawStart); $d->setTimezone(new DateTimeZone('Asia/Karachi')); $startDay = $d->format('Y-m-d'); } catch (Throwable $e) {}
        }
        // Normal daily view = today's pair only. Testing/custom records remain visible.
        if (!$isTesting && in_array($slot, [1,2], true) && $startDay !== $adminToday) continue;
        $signalRow['is_testing'] = $isTesting;
        $signalRow['no_profit'] = $isTesting;
        if ($isTesting) $signalRow['profit_percentage'] = 0;
        $signalRow['schedule_time'] = $slot === 2 ? '08:00 PM PKT' : ($slot === 1 ? '04:00 PM PKT' : '');
        if ($isTesting) {
            $signalRow['slot_label'] = 'Testing Signal • No Profit';
        } else {
            $signalRow['slot_label'] = $slot > 0 ? ('Daily Signal #' . $slot) : 'Custom Signal';
        }
        $signals[] = $signalRow;
    }

    // Archived signal history: cleanup moves expired records here after the configured retention period.
    $historyRes = $supabase->select('trading_signal_history', [
        'select' => '*',
        'order' => 'expires_at.desc',
        'limit' => '500'
    ]);
    $history = ($historyRes['success'] && is_array($historyRes['data'])) ? $historyRes['data'] : [];
    $historyNow = new DateTime('now', new DateTimeZone('Asia/Karachi'));
    $historyToday = $historyNow->format('Y-m-d');
    $historyTomorrow = (clone $historyNow)->modify('+1 day')->format('Y-m-d');
    foreach ($history as &$historyRow) {
        $raw = (string)($historyRow['scheduled_at'] ?? $historyRow['published_at'] ?? $historyRow['created_at'] ?? '');
        $day = '';
        if ($raw !== '') {
            try { $d = new DateTime($raw); $d->setTimezone(new DateTimeZone('Asia/Karachi')); $day = $d->format('Y-m-d'); } catch (Throwable $e) {}
        }
        $historyRow['schedule_day_label'] = $day === $historyToday ? 'TODAY' : ($day === $historyTomorrow ? 'TOMORROW' : 'HISTORY');
        $historyRow['published_at_pkt'] = alphavest_pkt_datetime($historyRow['published_at'] ?? $historyRow['scheduled_at'] ?? $historyRow['created_at'] ?? '');
        $historyRow['expires_at_pkt'] = alphavest_pkt_datetime($historyRow['expires_at'] ?? '');
        $historyRow['created_at_pkt'] = alphavest_pkt_datetime($historyRow['created_at'] ?? '');
        $slot = (int)($historyRow['daily_slot'] ?? 0);
        $historyRow['slot_label'] = $slot === 2 ? 'Daily Signal #2 • 8 PM PKT' : ($slot === 1 ? 'Daily Signal #1 • 4 PM PKT' : 'Custom / Manual');
    }
    unset($historyRow);

    // Executions
    $execRes = $supabase->select('user_signal_executions', [
        'select' => '*',
        'order' => 'executed_at.desc',
        'limit' => '100'
    ]);
    $executions = is_array($execRes['data']) ? $execRes['data'] : [];

    $totalProfitPaid = 0.0;
    foreach ($executions as $ex) {
        $totalProfitPaid += (float)($ex['profit_amount'] ?? 0);
    }

    sendSuccess([
        'signals' => $signals,
        'today_count' => count($signals),
        'daily_limit' => max(2, count($signals)),
        'executions' => $executions,
        'history' => $history,
        'total_profit_paid' => round($totalProfitPaid, 2)
    ], 'Signals and execution analytics retrieved from Supabase');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonBody();
    $action = strtoupper(trim($input['action'] ?? ''));

    if ($action === 'EXPIRE' || $action === 'CANCEL') {
        $sigId = trim($input['signal_id'] ?? '');
        if (empty($sigId)) {
            sendError('VALIDATION_ERROR', 'signal_id is required');
        }
        $supabase->update('trading_signals', [
            'status' => 'EXPIRED'
        ], ['id' => "eq.{$sigId}"]);
        sendSuccess(['signal_id' => $sigId, 'status' => 'EXPIRED'], 'Signal marked as EXPIRED');
    }

    if ($action === 'DELETE') {
        $sigId = trim($input['signal_id'] ?? '');
        if (empty($sigId)) {
            sendError('VALIDATION_ERROR', 'signal_id is required');
        }
        $supabase->delete('trading_signals', ['id' => "eq.{$sigId}"]);
        sendSuccess(['signal_id' => $sigId], 'Signal deleted successfully from Supabase');
    }

    if ($action === 'EDIT') {
        $sigId = trim((string)($input['signal_id'] ?? ''));
        if ($sigId === '') sendError('VALIDATION_ERROR', 'signal_id is required');
        $symbol = strtoupper(trim((string)($input['symbol'] ?? 'BTC/USDT')));
        $direction = strtoupper(trim((string)($input['direction'] ?? 'BUY')));
        $dailySlot = max(0, min(2, (int)($input['daily_slot'] ?? 0)));
        $profitPercentage = max(0.1, (float)($input['profit_percentage'] ?? 2.5));
        if (in_array($dailySlot, [1, 2], true)) $profitPercentage = 2.5;
        $durationMinutes = max(1, min(1440, (int)($input['duration_minutes'] ?? 15)));
        $requestedStatus = strtoupper(trim((string)($input['status'] ?? '')));

        // Read the existing record first. Editing duration must modify the actual
        // signal being edited (including a currently-live signal), not silently
        // move it to the next day's 4 PM/8 PM slot.
        $existingRes = $supabase->select('trading_signals', [
            'select' => '*',
            'id' => 'eq.' . $sigId,
            'limit' => '1'
        ]);
        if (!$existingRes['success'] || empty($existingRes['data'][0])) {
            sendError('SIGNAL_NOT_FOUND', 'Signal record was not found.', 404);
        }
        $existing = $existingRes['data'][0];
        $isTestingExisting = strpos((string)($existing['id'] ?? ''), 'sig_test_') === 0;
        if ($isTestingExisting) {
            $dailySlot = 0;
            $profitPercentage = 0.0;
        }

        $tz = new DateTimeZone('Asia/Karachi');
        $utc = new DateTimeZone('UTC');
        $nowUtc = new DateTime('now', $utc);
        $startRaw = (string)($existing['published_at'] ?? $existing['scheduled_at'] ?? '');
        try {
            $scheduled = $startRaw !== '' ? new DateTime($startRaw, $utc) : new DateTime('now', $utc);
        } catch (Throwable $e) {
            $scheduled = new DateTime('now', $utc);
        }

        // If the admin explicitly changed the broadcast time, honor it. Otherwise
        // retain the signal's existing start time so changing duration only changes expiry.
        // Duration-only edits must keep the existing stored start instant. A browser's
        // datetime-local field is presentation-only and must never shift a live signal.
        $timeRaw = trim((string)($input['broadcast_time_iso'] ?? ''));
        if ($timeRaw !== '' && strtoupper($timeRaw) !== 'NOW') {
            try {
                $candidate = new DateTime($timeRaw, $utc);
                $scheduled = $candidate->setTimezone($utc);
            } catch (Throwable $e) {
                // Keep the existing start time if an optional edit-time value is invalid.
            }
        }

        $publishedAt = clone $scheduled;
        $expiresAt = (clone $scheduled)->modify('+' . $durationMinutes . ' minutes');
        $nowTs = $nowUtc->getTimestamp();
        $startTs = $publishedAt->getTimestamp();
        $expireTs = $expiresAt->getTimestamp();

        if ($requestedStatus === 'EXPIRED') {
            $status = 'EXPIRED';
        } elseif ($nowTs >= $expireTs) {
            $status = 'EXPIRED';
        } elseif ($nowTs >= $startTs) {
            $status = 'PUBLISHED';
        } else {
            $status = 'SCHEDULED';
        }

        $upd = $supabase->update('trading_signals', [
            'symbol' => $symbol,
            'direction' => $direction,
            'daily_slot' => $dailySlot,
            'profit_percentage' => $profitPercentage,
            'duration_minutes' => $durationMinutes,
            'status' => $status,
            'scheduled_at' => $scheduled->format('Y-m-d H:i:sP'),
            'published_at' => $publishedAt->format('Y-m-d H:i:sP'),
            'expires_at' => $expiresAt->format('Y-m-d H:i:sP'),
            'timezone_label' => $isTestingExisting ? 'TEST — GLOBAL ALL COUNTRIES (PKT)' : 'GLOBAL — ALL COUNTRIES (PKT)'
        ], ['id' => "eq.{$sigId}"]);
        if (!$upd['success']) sendError('SUPABASE_UPDATE_FAILED', 'Failed to update signal.', 502);
        $saved = !empty($upd['data'][0]) ? $upd['data'][0] : [
            'id' => $sigId,
            'symbol' => $symbol,
            'direction' => $direction,
            'daily_slot' => $dailySlot,
            'profit_percentage' => $profitPercentage,
            'duration_minutes' => $durationMinutes,
            'status' => $status,
            'scheduled_at' => $scheduled->format('Y-m-d H:i:sP'),
            'published_at' => $publishedAt->format('Y-m-d H:i:sP'),
            'expires_at' => $expiresAt->format('Y-m-d H:i:sP'),
            'timezone_label' => $isTestingExisting ? 'TEST — GLOBAL ALL COUNTRIES (PKT)' : 'GLOBAL — ALL COUNTRIES (PKT)'
        ];
        $saved['audience_scope'] = 'ALL_COUNTRIES';
        $saved['is_testing'] = $isTestingExisting;
        $saved['no_profit'] = $isTestingExisting;
        sendSuccess(['signal' => $saved], 'Signal updated successfully');
    }

    if ($action === 'CREATE' || $action === 'PUBLISH' || empty($action)) {
        $symbol = strtoupper(trim($input['symbol'] ?? 'BTC/USDT'));
        $direction = strtoupper(trim($input['direction'] ?? 'BUY'));
        $duration = max(1, min(1440, (int)($input['duration_minutes'] ?? 15))); // 15 minutes remains the default; admin selection is honored.
        $profitPercentage = max(0.1, (float)($input['profit_percentage'] ?? 2.5));
        $timezoneLabel = 'GLOBAL — ALL COUNTRIES (PKT)'; // Every signal is broadcast worldwide; PKT is the canonical schedule timezone.
        $signalMode = strtoupper(trim((string)($input['signal_mode'] ?? $input['mode'] ?? 'DAILY')));
        $broadcastTime = trim((string)($input['broadcast_time'] ?? ''));
        $broadcastIso = trim((string)($input['broadcast_time_iso'] ?? ''));
        $isManual = in_array($signalMode, ['MANUAL','NOW','LIVE'], true) || $broadcastTime === 'NOW';
        $isCustom = in_array($signalMode, ['CUSTOM','SCHEDULED'], true) || ($broadcastTime !== '' && $broadcastTime !== 'NOW' && (int)($input['daily_slot'] ?? 0) > 2);
        $dailySlotInput = (int)($input['daily_slot'] ?? 0);
        $isTesting = filter_var($input['testing'] ?? false, FILTER_VALIDATE_BOOLEAN);
        if ($isTesting) $profitPercentage = 0.0;
        $testTimeSlot = strtoupper(trim((string)($input['test_time_slot'] ?? '')));

        $tz = new DateTimeZone('Asia/Karachi');
        $now = new DateTime('now', $tz);

        // DAILY = exactly 4 PM or 8 PM. MANUAL = immediately live. CUSTOM = exact admin date/time.
        // TEST signals reuse the same scheduling windows but are permanently non-profit.
        if ($isTesting && !$isManual && !$isCustom && in_array($testTimeSlot, ['4 PM','8 PM'], true)) {
            $dailySlot = 0;
            $hour = $testTimeSlot === '8 PM' ? 20 : 16;
            $scheduled = new DateTime($now->format('Y-m-d') . sprintf(' %02d:00:00', $hour), $tz);
            if ($scheduled <= $now) $scheduled->modify('+1 day');
            $publishedAt = clone $scheduled;
            $expiresAt = (clone $scheduled)->modify('+' . $duration . ' minutes');
            $status = 'SCHEDULED';
            $slotLabel = 'Testing Signal • ' . $testTimeSlot . ' PKT';
        } elseif ($isManual) {
            $dailySlot = 0;
            $scheduled = clone $now;
            $publishedAt = clone $now;
            $expiresAt = (clone $now)->modify('+' . $duration . ' minutes');
            $status = 'PUBLISHED';
            $slotLabel = $isTesting ? 'Testing Signal • Live Now • No Profit' : 'Manual Signal';
        } elseif ($isCustom || $dailySlotInput > 2 || ($isTesting && $broadcastTime !== '')) {
            $dailySlot = 0;
            $raw = $broadcastIso ?: $broadcastTime;
            try {
                $scheduled = new DateTime($raw, $tz);
            } catch (Throwable $e) {
                sendError('INVALID_SCHEDULE', 'Please provide a valid custom broadcast date and time.');
            }
            if ($scheduled <= $now) {
                sendError('INVALID_SCHEDULE', 'Custom broadcast date/time must be in the future.');
            }
            $publishedAt = clone $scheduled;
            $expiresAt = (clone $scheduled)->modify('+' . $duration . ' minutes');
            $status = 'SCHEDULED';
            $slotLabel = $isTesting ? 'Testing Signal • Custom • No Profit' : 'Custom Signal';
        } else {
            $dailySlot = ($dailySlotInput === 2) ? 2 : 1;
            // The two normal daily sessions are fixed at 2.5% each. Custom/manual
            // signal rates remain independently configurable below.
            $profitPercentage = 2.5;
            $hour = $dailySlot === 2 ? 20 : 16;
            $scheduled = new DateTime($now->format('Y-m-d') . sprintf(' %02d:00:00', $hour), $tz);
            if ($scheduled <= $now) $scheduled->modify('+1 day');
            $publishedAt = clone $scheduled;
            $expiresAt = (clone $scheduled)->modify('+' . $duration . ' minutes');
            $status = 'SCHEDULED';
            $slotLabel = $dailySlot === 2 ? 'Daily Signal #2' : 'Daily Signal #1';
        }

        $sigId = ($isTesting ? 'sig_test_' : 'sig_') . bin2hex(random_bytes(6));
        $nowUtc = gmdate('Y-m-d H:i:s');
        // All timestamptz values are written explicitly in UTC. This prevents
        // Supabase/server timezone differences from moving a 4 PM/8 PM signal.
        $scheduledUtc = (clone $scheduled)->setTimezone(new DateTimeZone('UTC'));
        $publishedUtc = (clone $publishedAt)->setTimezone(new DateTimeZone('UTC'));
        $expiresUtc = (clone $expiresAt)->setTimezone(new DateTimeZone('UTC'));
        $fullPayload = [
            'id' => $sigId,
            'symbol' => $symbol,
            'direction' => $direction,
            'entry_price_min' => (float)($input['entry_price_min'] ?? $input['entry_min'] ?? 0),
            'entry_price_max' => (float)($input['entry_price_max'] ?? $input['entry_max'] ?? 0),
            'target_price_1' => (float)($input['target_price_1'] ?? $input['tp1'] ?? 0),
            'target_price_2' => (float)($input['target_price_2'] ?? $input['tp2'] ?? 0),
            'stop_loss' => (float)($input['stop_loss'] ?? $input['sl'] ?? 0),
            'status' => $status,
            'duration_minutes' => $duration,
            'daily_slot' => $dailySlot,
            'profit_percentage' => $profitPercentage,
            'timezone_label' => $isTesting ? 'TEST — GLOBAL ALL COUNTRIES (PKT)' : $timezoneLabel,
            'scheduled_at' => $scheduledUtc->format('Y-m-d H:i:sP'),
            'published_at' => $publishedUtc->format('Y-m-d H:i:sP'),
            'expires_at' => $expiresUtc->format('Y-m-d H:i:sP'),
            'created_at' => $nowUtc
        ];

        $insRes = $supabase->insert('trading_signals', [$fullPayload]);
        if (!$insRes['success']) {
            // Retry only for optional scheduling columns missing from an older schema.
            $corePayload = $fullPayload;
            unset($corePayload['timezone_label'], $corePayload['scheduled_at']);
            $insRes = $supabase->insert('trading_signals', [$corePayload]);
        }
        if (!$insRes['success']) sendError('SUPABASE_INSERT_FAILED', 'Failed to publish signal: ', 502);

        $savedSignal = !empty($insRes['data'][0]) && is_array($insRes['data'][0]) ? $insRes['data'][0] : $fullPayload;
        $savedSignal['schedule_time'] = $isManual ? 'LIVE NOW' : ($isCustom ? $scheduled->format('Y-m-d H:i') . ' PKT' : ($dailySlot === 2 ? '08:00 PM PKT' : '04:00 PM PKT'));
        $savedSignal['slot_label'] = $slotLabel;
        $savedSignal['signal_mode'] = $isTesting ? 'TEST' : ($isManual ? 'MANUAL' : ($isCustom ? 'CUSTOM' : 'DAILY'));
        $savedSignal['is_testing'] = $isTesting;
        $savedSignal['no_profit'] = $isTesting;
        $savedSignal['audience_scope'] = 'ALL_COUNTRIES';
        sendSuccess(['signal' => $savedSignal, 'signals' => [$savedSignal]], 'Trading signal saved successfully to the signal list');
    }

    sendError('INVALID_ACTION', 'Unrecognized signal action');
}
