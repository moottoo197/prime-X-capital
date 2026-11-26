<?php
/**
 * Admin Support Desk Endpoint
 * - Resolves user profiles reliably (select=* + targeted lookup + Supabase Auth metadata fallback)
 * - Keeps active WhatsApp-style thread per user while preserving resolved tickets independently
 * - Updates only the targeted ticket_id on reply or status change
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/auth_tokens.php';

$admin = requireAdmin();
$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SERVICE_UNAVAILABLE', 'Database service is unavailable.', 503);
}

$method = strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET'));

$fetchTicketMessages = static function (SupabaseClient $sb, string $ticketId): array {
    if ($ticketId === '') {
        return [];
    }
    $res = $sb->select('support_messages', [
        'ticket_id' => 'eq.' . $ticketId,
        'is_internal' => 'eq.0',
        'order' => 'created_at.asc',
        'limit' => '500'
    ]);
    return (!empty($res['success']) && is_array($res['data'])) ? $res['data'] : [];
};

if ($method === 'GET') {
    $results = $supabase->selectMany([
        'tickets' => [
            'table' => 'support_tickets',
            'params' => ['order' => 'created_at.asc,id.asc', 'limit' => '800']
        ],
        'profiles' => [
            'table' => 'profiles',
            'params' => ['select' => '*', 'limit' => '2000']
        ],
        'messages' => [
            'table' => 'support_messages',
            'params' => ['is_internal' => 'eq.0', 'order' => 'created_at.asc', 'limit' => '5000']
        ]
    ]);

    $tickets = (!empty($results['tickets']['success']) && is_array($results['tickets']['data'])) ? $results['tickets']['data'] : [];
    $profiles = (!empty($results['profiles']['success']) && is_array($results['profiles']['data'])) ? $results['profiles']['data'] : [];
    $allMessages = (!empty($results['messages']['success']) && is_array($results['messages']['data'])) ? $results['messages']['data'] : [];

    $profileById = [];
    foreach ($profiles as $p) {
        if (!empty($p['id'])) {
            $profileById[(string)$p['id']] = $p;
        }
    }

    // Batch-resolve any ticket user_ids missing from initial profiles query
    $missingUids = [];
    foreach ($tickets as $t) {
        $uid = trim((string)($t['user_id'] ?? ''));
        if ($uid !== '' && !isset($profileById[$uid])) {
            $missingUids[$uid] = $uid;
        }
    }
    if (!empty($missingUids)) {
        $inList = '(' . implode(',', array_values($missingUids)) . ')';
        $extraRes = $supabase->select('profiles', ['id' => 'in.' . $inList, 'select' => '*']);
        if (!empty($extraRes['success']) && is_array($extraRes['data'])) {
            foreach ($extraRes['data'] as $ep) {
                if (!empty($ep['id'])) {
                    $profileById[(string)$ep['id']] = $ep;
                    unset($missingUids[(string)$ep['id']]);
                }
            }
        }
        // Fallback to Supabase Auth metadata for any remaining user IDs
        foreach (array_slice(array_values($missingUids), 0, 25) as $uid) {
            if (!method_exists($supabase, 'authAdminGetUser')) break;
            try {
                $authGet = $supabase->authAdminGetUser($uid);
                if (!empty($authGet['success']) && is_array($authGet['data'] ?? null)) {
                    $au = $authGet['data'];
                    $meta = is_array($au['user_metadata'] ?? null) ? $au['user_metadata'] : [];
                    $profileById[$uid] = [
                        'id' => $uid,
                        'email' => (string)($au['email'] ?? ''),
                        'first_name' => (string)($meta['first_name'] ?? ''),
                        'last_name' => (string)($meta['last_name'] ?? ''),
                        'numeric_uid' => $meta['numeric_uid'] ?? null,
                        'avatar' => $meta['avatar'] ?? ''
                    ];
                }
            } catch (Throwable $e) {}
        }
    }

    $messagesByTicket = [];
    foreach ($allMessages as $m) {
        $tid = trim((string)($m['ticket_id'] ?? ''));
        if ($tid === '') continue;
        $messagesByTicket[$tid][] = $m;
    }

    // Group active open tickets per user (single live conversation), while keeping
    // each resolved/closed ticket as its own historical thread so resolved issues
    // remain distinct from subsequent new conversations.
    $groups = [];
    foreach ($tickets as $t) {
        $tid = trim((string)($t['id'] ?? ''));
        if ($tid === '') continue;
        $uid = trim((string)($t['user_id'] ?? ''));
        $st = strtoupper(trim((string)($t['status'] ?? 'OPEN')));
        $isClosed = in_array($st, ['RESOLVED', 'CLOSED'], true);
        $groupKey = $isClosed
            ? ('resolved:' . $tid)
            : ($uid !== '' ? ('active_user:' . $uid) : ('active_ticket:' . $tid));
        $groups[$groupKey][] = $t;
    }

    $enriched = [];
    $openCount = 0;
    $needsReplyCount = 0;
    $messagesByGroupKey = [];

    foreach ($groups as $groupKey => $gTickets) {
        $latestTicket = $gTickets[count($gTickets) - 1];
        foreach ($gTickets as $cand) {
            if (strcmp((string)($cand['updated_at'] ?? ''), (string)($latestTicket['updated_at'] ?? '')) >= 0) {
                $latestTicket = $cand;
            }
        }

        $tid = (string)($latestTicket['id'] ?? '');
        $uid = trim((string)($latestTicket['user_id'] ?? ''));
        $prof = $profileById[$uid] ?? [];
        $fullName = trim((string)($prof['first_name'] ?? '') . ' ' . (string)($prof['last_name'] ?? ''));

        $tMsgs = [];
        foreach ($gTickets as $gt) {
            $gtid = trim((string)($gt['id'] ?? ''));
            if ($gtid !== '' && !empty($messagesByTicket[$gtid])) {
                foreach ($messagesByTicket[$gtid] as $m) {
                    $tMsgs[] = $m;
                }
            }
        }
        usort($tMsgs, static function ($a, $b) {
            return strcmp((string)($a['created_at'] ?? ''), (string)($b['created_at'] ?? ''));
        });
        $messagesByGroupKey[$tid] = $tMsgs;

        $lastMsg = !empty($tMsgs) ? $tMsgs[count($tMsgs) - 1] : null;
        $status = strtoupper((string)($latestTicket['status'] ?? 'OPEN'));
        $lastRole = strtoupper((string)($lastMsg['sender_role'] ?? 'USER'));
        $isClosed = in_array($status, ['RESOLVED', 'CLOSED'], true);
        $needsReply = !$isClosed && ($lastMsg !== null ? $lastRole === 'USER' : true);

        if (!$isClosed) {
            $openCount++;
        }
        if ($needsReply) {
            $needsReplyCount++;
        }

        $resolvedEmail = trim((string)($prof['email'] ?? ''));
        $fallbackUserLabel = $uid !== '' ? ('User ' . substr($uid, 0, 8)) : ('Ticket #' . substr($tid, 0, 8));
        $row = $latestTicket;
        $row['id'] = $tid;
        $row['status'] = $status;
        $row['subject'] = (string)($latestTicket['subject'] ?? 'Support Inquiry');
        $row['updated_at'] = (string)($latestTicket['updated_at'] ?? ($latestTicket['created_at'] ?? ''));
        $row['user_email'] = $resolvedEmail !== '' ? $resolvedEmail : $fallbackUserLabel;
        $row['user_name'] = $fullName !== '' ? $fullName : ($resolvedEmail !== '' ? explode('@', $resolvedEmail)[0] : $fallbackUserLabel);
        $row['user_avatar'] = !empty($prof) ? primex_get_user_avatar($prof) : '';
        $row['numeric_uid'] = $prof['numeric_uid'] ?? null;
        $row['message_count'] = count($tMsgs);
        $row['last_message'] = (string)($lastMsg['message'] ?? '');
        $row['last_sender_role'] = $lastRole;
        $row['last_message_at'] = (string)($lastMsg['created_at'] ?? $row['updated_at']);
        $row['needs_reply'] = $needsReply;
        $row['all_ticket_ids'] = array_values(array_map(static function ($x) { return (string)($x['id'] ?? ''); }, $gTickets));
        $enriched[] = $row;
    }

    usort($enriched, static function ($a, $b) {
        return strcmp((string)($b['last_message_at'] ?? ''), (string)($a['last_message_at'] ?? ''));
    });

    $requestedId = trim((string)($_GET['ticket_id'] ?? ''));
    $activeId = '';
    if ($requestedId !== '') {
        foreach ($enriched as $et) {
            if ((string)$et['id'] === $requestedId || in_array($requestedId, $et['all_ticket_ids'] ?? [], true)) {
                $activeId = (string)$et['id'];
                break;
            }
        }
    }
    if ($activeId === '' && !empty($enriched)) {
        $activeId = (string)$enriched[0]['id'];
    }

    sendSuccess([
        'tickets' => $enriched,
        'active_ticket_id' => $activeId,
        'messages' => $activeId !== '' ? ($messagesByGroupKey[$activeId] ?? []) : [],
        'open_count' => $openCount,
        'needs_reply_count' => $needsReplyCount
    ], 'Support tickets loaded');
}

if ($method === 'POST') {
    $input = getJsonBody();
    $action = strtoupper(trim((string)($input['action'] ?? 'REPLY')));
    $ticketId = trim((string)($input['ticket_id'] ?? ''));
    if ($ticketId === '') {
        sendError('VALIDATION_ERROR', 'Ticket ID is required.', 400);
    }

    $ticketRes = $supabase->select('support_tickets', ['id' => 'eq.' . $ticketId, 'limit' => '1']);
    if (empty($ticketRes['success']) || empty($ticketRes['data'][0])) {
        sendError('TICKET_NOT_FOUND', 'Support ticket not found.', 404);
    }
    $ticket = $ticketRes['data'][0];
    $targetUserId = (string)($ticket['user_id'] ?? '');
    $now = gmdate('Y-m-d H:i:s');

    if ($action === 'REPLY') {
        $rawMessage = trim((string)($input['message'] ?? ''));
        if ($rawMessage === '') {
            sendError('VALIDATION_ERROR', 'Reply message cannot be empty.', 400);
        }
        $msgLen = function_exists('mb_strlen') ? mb_strlen($rawMessage, 'UTF-8') : strlen($rawMessage);
        if ($msgLen > 2000) {
            $rawMessage = function_exists('mb_substr') ? mb_substr($rawMessage, 0, 2000, 'UTF-8') : substr($rawMessage, 0, 2000);
        }

        $msgPayload = [
            'id' => primex_uuid_v4(),
            'ticket_id' => $ticketId,
            'sender_id' => (string)($admin['id'] ?? 'admin'),
            'sender_role' => 'ADMIN',
            'message' => $rawMessage,
            'is_internal' => 0,
            'created_at' => $now
        ];
        $insRes = $supabase->insert('support_messages', [$msgPayload]);
        if (empty($insRes['success'])) {
            sendError('REPLY_FAILED', 'Unable to save admin reply.', 500);
        }

        $nextStatus = strtoupper(trim((string)($input['status'] ?? 'WAITING_FOR_USER')));
        if (!in_array($nextStatus, ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED'], true)) {
            $nextStatus = 'WAITING_FOR_USER';
        }
        $updRes = $supabase->update('support_tickets', [
            'status' => $nextStatus,
            'assigned_staff' => (string)($admin['email'] ?? 'admin'),
            'updated_at' => $now
        ], ['id' => 'eq.' . $ticketId]);
        $updatedTicket = (!empty($updRes['success']) && !empty($updRes['data'][0])) ? $updRes['data'][0] : $ticket;

        primex_record_log('ADMIN_SUPPORT', 'ADMIN_REPLY_SENT', 'Admin replied to support conversation', [
            'ticket_id' => $ticketId,
            'user_id' => $targetUserId
        ], 'INFO', (string)($admin['id'] ?? ''), (string)($admin['email'] ?? ''));

        sendSuccess([
            'ticket' => $updatedTicket,
            'messages' => $fetchTicketMessages($supabase, $ticketId)
        ], 'Reply sent to user');
    }

    if ($action === 'STATUS') {
        $nextStatus = strtoupper(trim((string)($input['status'] ?? '')));
        if (!in_array($nextStatus, ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED'], true)) {
            sendError('VALIDATION_ERROR', 'Invalid ticket status.', 400);
        }
        $updFilter = ['id' => 'eq.' . $ticketId];
        $updRes = $supabase->update('support_tickets', [
            'status' => $nextStatus,
            'assigned_staff' => (string)($admin['email'] ?? 'admin'),
            'updated_at' => $now
        ], $updFilter);
        if (empty($updRes['success'])) {
            sendError('STATUS_UPDATE_FAILED', 'Unable to update ticket status.', 500);
        }
        // If marking RESOLVED/CLOSED, also close any older unresolved tickets for this user so a fresh chat opens cleanly
        if (in_array($nextStatus, ['RESOLVED', 'CLOSED'], true) && $targetUserId !== '') {
            @$supabase->update('support_tickets', [
                'status' => $nextStatus,
                'updated_at' => $now
            ], [
                'user_id' => 'eq.' . $targetUserId,
                'status' => 'not.in.(RESOLVED,CLOSED)'
            ]);
        }
        $updatedTicket = (!empty($updRes['data'][0])) ? $updRes['data'][0] : array_merge($ticket, ['status' => $nextStatus, 'updated_at' => $now]);

        primex_record_log('ADMIN_SUPPORT', 'TICKET_STATUS_UPDATED', 'Updated support conversation status', [
            'ticket_id' => $ticketId,
            'status' => $nextStatus
        ], 'INFO', (string)($admin['id'] ?? ''), (string)($admin['email'] ?? ''));

        sendSuccess([
            'ticket' => $updatedTicket
        ], 'Ticket status updated');
    }

    sendError('INVALID_ACTION', 'Unsupported action.', 400);
}

sendError('METHOD_NOT_ALLOWED', 'Method not allowed.', 405);
