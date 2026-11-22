<?php
/**
 * Admin Support Desk Endpoint (View all user support tickets, reply, and manage ticket statuses)
 */
require_once dirname(__DIR__) . '/bootstrap.php';

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
        'limit' => '300'
    ]);
    return (!empty($res['success']) && is_array($res['data'])) ? $res['data'] : [];
};

if ($method === 'GET') {
    $results = $supabase->selectMany([
        'tickets' => [
            'table' => 'support_tickets',
            'params' => ['order' => 'updated_at.desc,created_at.desc', 'limit' => '200']
        ],
        'profiles' => [
            'table' => 'profiles',
            'params' => ['select' => 'id,email,first_name,last_name,numeric_uid', 'limit' => '1000']
        ],
        'messages' => [
            'table' => 'support_messages',
            'params' => ['is_internal' => 'eq.0', 'order' => 'created_at.asc', 'limit' => '2500']
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

    $messagesByTicket = [];
    foreach ($allMessages as $m) {
        $tid = (string)($m['ticket_id'] ?? '');
        if ($tid !== '') {
            $messagesByTicket[$tid][] = $m;
        }
    }

    $enriched = [];
    $openCount = 0;
    $needsReplyCount = 0;

    foreach ($tickets as $t) {
        $tid = (string)($t['id'] ?? '');
        $uid = (string)($t['user_id'] ?? '');
        $prof = $profileById[$uid] ?? [];
        $fullName = trim((string)($prof['first_name'] ?? '') . ' ' . (string)($prof['last_name'] ?? ''));
        $tMsgs = $messagesByTicket[$tid] ?? [];
        $lastMsg = !empty($tMsgs) ? $tMsgs[count($tMsgs) - 1] : null;
        $status = strtoupper((string)($t['status'] ?? 'OPEN'));
        $lastRole = strtoupper((string)($lastMsg['sender_role'] ?? 'USER'));
        $isClosed = in_array($status, ['RESOLVED', 'CLOSED'], true);
        $needsReply = !$isClosed && ($lastMsg !== null ? $lastRole === 'USER' : true);

        if (!$isClosed) {
            $openCount++;
        }
        if ($needsReply) {
            $needsReplyCount++;
        }

        $t['user_email'] = (string)($prof['email'] ?? 'Unknown user');
        $t['user_name'] = $fullName !== '' ? $fullName : explode('@', (string)$t['user_email'])[0];
        $t['numeric_uid'] = $prof['numeric_uid'] ?? null;
        $t['message_count'] = count($tMsgs);
        $t['last_message'] = (string)($lastMsg['message'] ?? '');
        $t['last_sender_role'] = $lastRole;
        $t['last_message_at'] = (string)($lastMsg['created_at'] ?? ($t['updated_at'] ?? ($t['created_at'] ?? '')));
        $t['needs_reply'] = $needsReply;
        $enriched[] = $t;
    }

    $requestedId = trim((string)($_GET['ticket_id'] ?? ''));
    $activeId = '';
    if ($requestedId !== '' && isset($messagesByTicket[$requestedId])) {
        $activeId = $requestedId;
    } elseif ($requestedId !== '') {
        foreach ($enriched as $et) {
            if ((string)($et['id'] ?? '') === $requestedId) {
                $activeId = $requestedId;
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
        'messages' => $activeId !== '' ? ($messagesByTicket[$activeId] ?? []) : [],
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

        primex_record_log('ADMIN_SUPPORT', 'ADMIN_REPLY_SENT', 'Admin replied to support ticket', [
            'ticket_id' => $ticketId,
            'user_id' => (string)($ticket['user_id'] ?? '')
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
        $updRes = $supabase->update('support_tickets', [
            'status' => $nextStatus,
            'assigned_staff' => (string)($admin['email'] ?? 'admin'),
            'updated_at' => $now
        ], ['id' => 'eq.' . $ticketId]);
        if (empty($updRes['success'])) {
            sendError('STATUS_UPDATE_FAILED', 'Unable to update ticket status.', 500);
        }
        $updatedTicket = (!empty($updRes['data'][0])) ? $updRes['data'][0] : array_merge($ticket, ['status' => $nextStatus, 'updated_at' => $now]);

        primex_record_log('ADMIN_SUPPORT', 'TICKET_STATUS_UPDATED', 'Updated support ticket status', [
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
