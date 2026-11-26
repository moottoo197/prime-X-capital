<?php
/**
 * User Support Chat Endpoint (Single WhatsApp-Style Conversation per User)
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/auth_tokens.php';

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
        'order' => 'created_at.asc,id.asc',
        'limit' => '50'
    ]);
    if (!$res['success'] || !is_array($res['data'])) {
        return [];
    }
    return $res['data'];
};

$fetchMergedUserMessages = static function (SupabaseClient $sb, array $tickets): array {
    if (empty($tickets)) {
        return [];
    }
    $ticketIds = [];
    foreach ($tickets as $t) {
        $tid = trim((string)($t['id'] ?? ''));
        if ($tid !== '') {
            $ticketIds[] = $tid;
        }
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
    if (!$res['success'] || !is_array($res['data'])) {
        return [];
    }
    return $res['data'];
};

if ($method === 'GET') {
    $tickets = $fetchUserTickets($supabase, $userId);
    $primaryTicket = !empty($tickets) ? $tickets[0] : null;
    $messages = $primaryTicket ? $fetchMergedUserMessages($supabase, $tickets) : [];

    sendSuccess([
        'ticket' => $primaryTicket,
        'tickets' => $primaryTicket ? [$primaryTicket] : [],
        'messages' => $messages,
        'user_avatar' => primex_get_user_avatar($user)
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

    $topic = trim((string)($input['topic'] ?? ''));
    $subjectInput = trim((string)($input['subject'] ?? ''));
    $subject = $topic !== '' ? $topic : ($subjectInput !== '' ? $subjectInput : 'Platform Support');
    if ((function_exists('mb_strlen') ? mb_strlen($subject, 'UTF-8') : strlen($subject)) > 140) {
        $subject = function_exists('mb_substr') ? mb_substr($subject, 0, 140, 'UTF-8') : substr($subject, 0, 140);
    }

    $now = gmdate('Y-m-d H:i:s');
    $tickets = $fetchUserTickets($supabase, $userId);
    $primaryTicket = !empty($tickets) ? $tickets[0] : null;

    if ($primaryTicket === null) {
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
        $primaryTicket = $insTicket['data'][0] ?? $newTicketPayload;
        $tickets = [$primaryTicket];
    } else {
        $updFields = [
            'status' => 'OPEN',
            'updated_at' => $now
        ];
        if ($topic !== '') {
            $updFields['subject'] = $subject;
        }
        $updTicket = $supabase->update('support_tickets', $updFields, [
            'id' => 'eq.' . $primaryTicket['id'],
            'user_id' => 'eq.' . $userId
        ]);
        if (!empty($updTicket['success']) && !empty($updTicket['data'][0])) {
            $primaryTicket = $updTicket['data'][0];
        } else {
            $primaryTicket['status'] = 'OPEN';
            $primaryTicket['updated_at'] = $now;
            if ($topic !== '') {
                $primaryTicket['subject'] = $subject;
            }
        }
    }

    $finalMessage = $rawMessage;
    if ($topic !== '' && stripos($rawMessage, '[' . $topic . ']') !== 0) {
        $finalMessage = '[' . $topic . "]\n" . $rawMessage;
    }

    $msgPayload = [
        'id' => primex_uuid_v4(),
        'ticket_id' => (string)$primaryTicket['id'],
        'sender_id' => $userId,
        'sender_role' => 'USER',
        'message' => $finalMessage,
        'is_internal' => 0,
        'created_at' => $now
    ];
    $insMsg = $supabase->insert('support_messages', [$msgPayload]);
    if (empty($insMsg['success'])) {
        primex_record_log('SUPPORT', 'MESSAGE_INSERT_FAILED', (string)($insMsg['message'] ?? 'Insert failed'), [
            'ticket_id' => (string)$primaryTicket['id'],
            'http_code' => $insMsg['http_code'] ?? 0
        ], 'ERROR', $userId, (string)($user['email'] ?? ''));
        sendError('MESSAGE_SEND_FAILED', 'Unable to send your support message right now.', 500);
    }

    primex_record_log('SUPPORT', 'USER_MESSAGE_SENT', 'User sent support message', [
        'ticket_id' => (string)$primaryTicket['id'],
        'topic' => $topic,
        'length' => $msgLen
    ], 'INFO', $userId, (string)($user['email'] ?? ''));

    $messages = $fetchMergedUserMessages($supabase, $tickets);

    sendSuccess([
        'ticket' => $primaryTicket,
        'tickets' => [$primaryTicket],
        'messages' => $messages,
        'user_avatar' => primex_get_user_avatar($user)
    ], 'Message sent to support desk');
}

sendError('METHOD_NOT_ALLOWED', 'Method not allowed.', 405);
