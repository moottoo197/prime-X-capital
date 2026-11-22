<?php
/**
 * User Support Chat Endpoint (Persistent Supabase support_tickets + support_messages)
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = requireAuth();
$userId = (string)($user['id'] ?? '');
if ($userId === '') {
    sendError('UNAUTHORIZED', 'Authenticated user record is missing.', 401);
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SERVICE_UNAVAILABLE', 'Database service is temporarily unavailable.', 503);
}

$method = strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET'));

$fetchUserTickets = static function (SupabaseClient $sb, string $uid): array {
    $res = $sb->select('support_tickets', [
        'user_id' => 'eq.' . $uid,
        'order' => 'updated_at.desc,created_at.desc',
        'limit' => '15'
    ]);
    if (!$res['success'] || !is_array($res['data'])) {
        return [];
    }
    return $res['data'];
};

$fetchTicketMessages = static function (SupabaseClient $sb, string $ticketId): array {
    if ($ticketId === '') {
        return [];
    }
    $res = $sb->select('support_messages', [
        'ticket_id' => 'eq.' . $ticketId,
        'is_internal' => 'eq.0',
        'order' => 'created_at.asc',
        'limit' => '200'
    ]);
    if (!$res['success'] || !is_array($res['data'])) {
        return [];
    }
    return $res['data'];
};

if ($method === 'GET') {
    $tickets = $fetchUserTickets($supabase, $userId);
    $requestedId = trim((string)($_GET['ticket_id'] ?? ''));
    $activeTicket = null;

    if ($requestedId !== '') {
        foreach ($tickets as $t) {
            if ((string)($t['id'] ?? '') === $requestedId && (string)($t['user_id'] ?? '') === $userId) {
                $activeTicket = $t;
                break;
            }
        }
    }

    if ($activeTicket === null && !empty($tickets)) {
        foreach ($tickets as $t) {
            $st = strtoupper((string)($t['status'] ?? 'OPEN'));
            if (!in_array($st, ['RESOLVED', 'CLOSED'], true)) {
                $activeTicket = $t;
                break;
            }
        }
        if ($activeTicket === null) {
            $activeTicket = $tickets[0];
        }
    }

    $messages = $activeTicket ? $fetchTicketMessages($supabase, (string)$activeTicket['id']) : [];

    sendSuccess([
        'ticket' => $activeTicket,
        'tickets' => $tickets,
        'messages' => $messages
    ], 'Support chat loaded');
}

if ($method === 'POST') {
    if (!empty($user['_admin_preview'])) {
        sendError('PREVIEW_READONLY', 'Support messages cannot be sent in read-only admin preview mode.', 403);
    }

    $input = getJsonBody();
    $rawMessage = trim((string)($input['message'] ?? ''));
    if ($rawMessage === '') {
        sendError('VALIDATION_ERROR', 'Please enter a message before sending.', 400);
    }
    $msgLen = function_exists('mb_strlen') ? mb_strlen($rawMessage, 'UTF-8') : strlen($rawMessage);
    if ($msgLen > 2000) {
        $rawMessage = function_exists('mb_substr') ? mb_substr($rawMessage, 0, 2000, 'UTF-8') : substr($rawMessage, 0, 2000);
    }

    $subject = trim((string)($input['subject'] ?? 'Platform Support Inquiry'));
    if ($subject === '') {
        $subject = 'Platform Support Inquiry';
    }
    if ((function_exists('mb_strlen') ? mb_strlen($subject, 'UTF-8') : strlen($subject)) > 140) {
        $subject = function_exists('mb_substr') ? mb_substr($subject, 0, 140, 'UTF-8') : substr($subject, 0, 140);
    }

    $requestedId = trim((string)($input['ticket_id'] ?? ''));
    $forceNew = !empty($input['new_ticket']);
    $now = gmdate('Y-m-d H:i:s');
    $ticket = null;

    if (!$forceNew && $requestedId !== '') {
        $existingRes = $supabase->select('support_tickets', [
            'id' => 'eq.' . $requestedId,
            'user_id' => 'eq.' . $userId,
            'limit' => '1'
        ]);
        if (!$existingRes['success'] || empty($existingRes['data'][0])) {
            sendError('TICKET_NOT_FOUND', 'Support conversation not found.', 404);
        }
        $ticket = $existingRes['data'][0];
        $status = strtoupper((string)($ticket['status'] ?? 'OPEN'));
        if ($status === 'CLOSED') {
            $ticket = null;
            $forceNew = true;
        }
    } elseif (!$forceNew) {
        $tickets = $fetchUserTickets($supabase, $userId);
        foreach ($tickets as $t) {
            $st = strtoupper((string)($t['status'] ?? 'OPEN'));
            if (!in_array($st, ['RESOLVED', 'CLOSED'], true)) {
                $ticket = $t;
                break;
            }
        }
    }

    if ($ticket === null) {
        $newTicketId = primex_uuid_v4();
        $newTicketPayload = [
            'id' => $newTicketId,
            'user_id' => $userId,
            'subject' => $subject,
            'priority' => 'MEDIUM',
            'status' => 'OPEN',
            'created_at' => $now,
            'updated_at' => $now
        ];
        $insTicket = $supabase->insert('support_tickets', [$newTicketPayload]);
        if (empty($insTicket['success'])) {
            primex_record_log('SUPPORT', 'TICKET_CREATE_FAILED', (string)($insTicket['message'] ?? 'Insert failed'), [
                'http_code' => $insTicket['http_code'] ?? 0,
                'error' => $insTicket['error'] ?? null
            ], 'ERROR', $userId, (string)($user['email'] ?? ''));
            sendError('SUPPORT_CREATE_FAILED', 'Unable to start support conversation right now. Please try again.', 500);
        }
        $ticket = $insTicket['data'][0] ?? $newTicketPayload;
    } else {
        $updTicket = $supabase->update('support_tickets', [
            'status' => 'OPEN',
            'updated_at' => $now
        ], [
            'id' => 'eq.' . $ticket['id'],
            'user_id' => 'eq.' . $userId
        ]);
        if (!empty($updTicket['success']) && !empty($updTicket['data'][0])) {
            $ticket = $updTicket['data'][0];
        } else {
            $ticket['status'] = 'OPEN';
            $ticket['updated_at'] = $now;
        }
    }

    $msgPayload = [
        'id' => primex_uuid_v4(),
        'ticket_id' => (string)$ticket['id'],
        'sender_id' => $userId,
        'sender_role' => 'USER',
        'message' => $rawMessage,
        'is_internal' => 0,
        'created_at' => $now
    ];
    $insMsg = $supabase->insert('support_messages', [$msgPayload]);
    if (empty($insMsg['success'])) {
        primex_record_log('SUPPORT', 'MESSAGE_INSERT_FAILED', (string)($insMsg['message'] ?? 'Insert failed'), [
            'ticket_id' => (string)$ticket['id'],
            'http_code' => $insMsg['http_code'] ?? 0
        ], 'ERROR', $userId, (string)($user['email'] ?? ''));
        sendError('MESSAGE_SEND_FAILED', 'Unable to send your support message right now.', 500);
    }

    primex_record_log('SUPPORT', 'USER_MESSAGE_SENT', 'User sent support message', [
        'ticket_id' => (string)$ticket['id'],
        'length' => $msgLen
    ], 'INFO', $userId, (string)($user['email'] ?? ''));

    $tickets = $fetchUserTickets($supabase, $userId);
    $messages = $fetchTicketMessages($supabase, (string)$ticket['id']);

    sendSuccess([
        'ticket' => $ticket,
        'tickets' => $tickets,
        'messages' => $messages
    ], 'Message sent to support desk');
}

sendError('METHOD_NOT_ALLOWED', 'Method not allowed.', 405);
