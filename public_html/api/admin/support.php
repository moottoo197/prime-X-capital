<?php
/**
 * Admin Support Desk Endpoint (Single WhatsApp-Style Conversation per User)
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/auth_tokens.php';

$admin = requireAdmin();
$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SERVICE_UNAVAILABLE', 'Database service is unavailable.', 503);
}

$method = strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET'));

$fetchUserMergedMessages = static function (SupabaseClient $sb, string $userId, string $fallbackTicketId): array {
    $ticketIds = [];
    if ($userId !== '') {
        $tRes = $sb->select('support_tickets', [
            'user_id' => 'eq.' . $userId,
            'select' => 'id',
            'limit' => '50'
        ]);
        if (!empty($tRes['success']) && is_array($tRes['data'])) {
            foreach ($tRes['data'] as $row) {
                $tid = trim((string)($row['id'] ?? ''));
                if ($tid !== '') {
                    $ticketIds[] = $tid;
                }
            }
        }
    }
    if (empty($ticketIds) && $fallbackTicketId !== '') {
        $ticketIds[] = $fallbackTicketId;
    }
    if (empty($ticketIds)) {
        return [];
    }
    $inList = '(' . implode(',', array_unique($ticketIds)) . ')';
    $res = $sb->select('support_messages', [
        'ticket_id' => 'in.' . $inList,
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
            'params' => ['order' => 'created_at.asc,id.asc', 'limit' => '500']
        ],
        'profiles' => [
            'table' => 'profiles',
            'params' => ['select' => 'id,email,first_name,last_name,numeric_uid,avatar', 'limit' => '1000']
        ],
        'messages' => [
            'table' => 'support_messages',
            'params' => ['is_internal' => 'eq.0', 'order' => 'created_at.asc', 'limit' => '3000']
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

    $ticketOwnerById = [];
    $userTicketsMap = [];
    foreach ($tickets as $t) {
        $tid = (string)($t['id'] ?? '');
        $uid = (string)($t['user_id'] ?? '');
        if ($tid === '') continue;
        $ownerKey = $uid !== '' ? $uid : ('ticket:' . $tid);
        $ticketOwnerById[$tid] = $ownerKey;
        $userTicketsMap[$ownerKey][] = $t;
    }

    $messagesByUser = [];
    foreach ($allMessages as $m) {
        $tid = (string)($m['ticket_id'] ?? '');
        if ($tid === '' || !isset($ticketOwnerById[$tid])) continue;
        $ownerKey = $ticketOwnerById[$tid];
        $messagesByUser[$ownerKey][] = $m;
    }

    $enriched = [];
    $openCount = 0;
    $needsReplyCount = 0;

    foreach ($userTicketsMap as $ownerKey => $uTickets) {
        $primaryTicket = $uTickets[0];
        // Pick latest ticket metadata for status & subject while keeping canonical primary ticket ID
        $latestTicket = $uTickets[count($uTickets) - 1];
        foreach ($uTickets as $cand) {
            if (strcmp((string)($cand['updated_at'] ?? ''), (string)($latestTicket['updated_at'] ?? '')) >= 0) {
                $latestTicket = $cand;
            }
        }

        $tid = (string)($primaryTicket['id'] ?? '');
        $uid = (string)($primaryTicket['user_id'] ?? '');
        $prof = $profileById[$uid] ?? [];
        $fullName = trim((string)($prof['first_name'] ?? '') . ' ' . (string)($prof['last_name'] ?? ''));
        $tMsgs = $messagesByUser[$ownerKey] ?? [];
        $lastMsg = !empty($tMsgs) ? $tMsgs[count($tMsgs) - 1] : null;
        $status = strtoupper((string)($latestTicket['status'] ?? ($primaryTicket['status'] ?? 'OPEN')));
        $lastRole = strtoupper((string)($lastMsg['sender_role'] ?? 'USER'));
        $isClosed = in_array($status, ['RESOLVED', 'CLOSED'], true);
        $needsReply = !$isClosed && ($lastMsg !== null ? $lastRole === 'USER' : true);

        if (!$isClosed) {
            $openCount++;
        }
        if ($needsReply) {
            $needsReplyCount++;
        }

        $row = $primaryTicket;
        $row['status'] = $status;
        $row['subject'] = (string)($latestTicket['subject'] ?? ($primaryTicket['subject'] ?? 'Support Inquiry'));
        $row['updated_at'] = (string)($latestTicket['updated_at'] ?? ($primaryTicket['updated_at'] ?? ($primaryTicket['created_at'] ?? '')));
        $row['user_email'] = (string)($prof['email'] ?? 'Unknown user');
        $row['user_name'] = $fullName !== '' ? $fullName : explode('@', (string)$row['user_email'])[0];
        $row['user_avatar'] = !empty($prof) ? primex_get_user_avatar($prof) : '';
        $row['numeric_uid'] = $prof['numeric_uid'] ?? null;
        $row['message_count'] = count($tMsgs);
        $row['last_message'] = (string)($lastMsg['message'] ?? '');
        $row['last_sender_role'] = $lastRole;
        $row['last_message_at'] = (string)($lastMsg['created_at'] ?? $row['updated_at']);
        $row['needs_reply'] = $needsReply;
        $row['all_ticket_ids'] = array_values(array_map(static function ($x) { return (string)($x['id'] ?? ''); }, $uTickets));
        $enriched[] = $row;
    }

    usort($enriched, static function ($a, $b) {
        return strcmp((string)($b['last_message_at'] ?? ''), (string)($a['last_message_at'] ?? ''));
    });

    $requestedId = trim((string)($_GET['ticket_id'] ?? ''));
    $activeId = '';
    $activeOwnerKey = '';
    if ($requestedId !== '') {
        foreach ($enriched as $et) {
            if ((string)$et['id'] === $requestedId || in_array($requestedId, $et['all_ticket_ids'] ?? [], true)) {
                $activeId = (string)$et['id'];
                $uid = (string)($et['user_id'] ?? '');
                $activeOwnerKey = $uid !== '' ? $uid : ('ticket:' . $activeId);
                break;
            }
        }
    }
    if ($activeId === '' && !empty($enriched)) {
        $activeId = (string)$enriched[0]['id'];
        $uid = (string)($enriched[0]['user_id'] ?? '');
        $activeOwnerKey = $uid !== '' ? $uid : ('ticket:' . $activeId);
    }

    sendSuccess([
        'tickets' => $enriched,
        'active_ticket_id' => $activeId,
        'messages' => $activeOwnerKey !== '' ? ($messagesByUser[$activeOwnerKey] ?? []) : [],
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
        $updFilter = $targetUserId !== '' ? ['user_id' => 'eq.' . $targetUserId] : ['id' => 'eq.' . $ticketId];
        $updRes = $supabase->update('support_tickets', [
            'status' => $nextStatus,
            'assigned_staff' => (string)($admin['email'] ?? 'admin'),
            'updated_at' => $now
        ], $updFilter);
        $updatedTicket = (!empty($updRes['success']) && !empty($updRes['data'][0])) ? $updRes['data'][0] : $ticket;

        primex_record_log('ADMIN_SUPPORT', 'ADMIN_REPLY_SENT', 'Admin replied to support conversation', [
            'ticket_id' => $ticketId,
            'user_id' => $targetUserId
        ], 'INFO', (string)($admin['id'] ?? ''), (string)($admin['email'] ?? ''));

        sendSuccess([
            'ticket' => $updatedTicket,
            'messages' => $fetchUserMergedMessages($supabase, $targetUserId, $ticketId)
        ], 'Reply sent to user');
    }

    if ($action === 'STATUS') {
        $nextStatus = strtoupper(trim((string)($input['status'] ?? '')));
        if (!in_array($nextStatus, ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED'], true)) {
            sendError('VALIDATION_ERROR', 'Invalid ticket status.', 400);
        }
        $updFilter = $targetUserId !== '' ? ['user_id' => 'eq.' . $targetUserId] : ['id' => 'eq.' . $ticketId];
        $updRes = $supabase->update('support_tickets', [
            'status' => $nextStatus,
            'assigned_staff' => (string)($admin['email'] ?? 'admin'),
            'updated_at' => $now
        ], $updFilter);
        if (empty($updRes['success'])) {
            sendError('STATUS_UPDATE_FAILED', 'Unable to update ticket status.', 500);
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
