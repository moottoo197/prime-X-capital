<?php
/**
 * User Support Chat Endpoint
 * - Single active WhatsApp-style conversation while unresolved
 * - Resolved / closed conversations are preserved in History and a fresh chat begins
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
        'limit' => '100'
    ]);
    if (!$res['success'] || !is_array($res['data'])) {
        return [];
    }
    return $res['data'];
};

$fetchMessagesByTickets = static function (SupabaseClient $sb, array $tickets): array {
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
        'limit' => '2000'
    ]);
    if (!$res['success'] || !is_array($res['data'])) {
        return [];
    }
    $grouped = [];
    foreach ($res['data'] as $msg) {
        $tid = trim((string)($msg['ticket_id'] ?? ''));
        if ($tid !== '') {
            $grouped[$tid][] = $msg;
        }
    }
    return $grouped;
};

$partitionSupportState = static function (array $tickets, array $msgsByTicket): array {
    $activeTickets = [];
    $resolvedTickets = [];
    foreach ($tickets as $t) {
        $st = strtoupper(trim((string)($t['status'] ?? 'OPEN')));
        if (in_array($st, ['RESOLVED', 'CLOSED'], true)) {
            $resolvedTickets[] = $t;
        } else {
            $activeTickets[] = $t;
        }
    }

    $activeTicket = null;
    $activeMessages = [];
    if (!empty($activeTickets)) {
        // Keep the latest open ticket as the active conversation and combine any open-thread messages
        $activeTicket = $activeTickets[count($activeTickets) - 1];
        foreach ($activeTickets as $at) {
            if (strcmp((string)($at['updated_at'] ?? ''), (string)($activeTicket['updated_at'] ?? '')) >= 0) {
                $activeTicket = $at;
            }
            $tid = trim((string)($at['id'] ?? ''));
            if ($tid !== '' && !empty($msgsByTicket[$tid])) {
                foreach ($msgsByTicket[$tid] as $m) {
                    $activeMessages[] = $m;
                }
            }
        }
        usort($activeMessages, static function ($a, $b) {
            return strcmp((string)($a['created_at'] ?? ''), (string)($b['created_at'] ?? ''));
        });
    }

    $history = [];
    foreach ($resolvedTickets as $rt) {
        $tid = trim((string)($rt['id'] ?? ''));
        if ($tid === '') continue;
        $tMsgs = $msgsByTicket[$tid] ?? [];
        $lastMsg = !empty($tMsgs) ? $tMsgs[count($tMsgs) - 1] : null;
        $history[] = [
            'id' => $tid,
            'subject' => (string)($rt['subject'] ?? 'Support Issue'),
            'status' => strtoupper(trim((string)($rt['status'] ?? 'RESOLVED'))),
            'created_at' => (string)($rt['created_at'] ?? ''),
            'updated_at' => (string)($rt['updated_at'] ?? ($rt['created_at'] ?? '')),
            'resolved_at' => (string)($lastMsg['created_at'] ?? ($rt['updated_at'] ?? ($rt['created_at'] ?? ''))),
            'message_count' => count($tMsgs),
            'last_message' => (string)($lastMsg['message'] ?? ''),
            'last_sender_role' => strtoupper((string)($lastMsg['sender_role'] ?? 'ADMIN')),
            'messages' => $tMsgs
        ];
    }
    usort($history, static function ($a, $b) {
        return strcmp((string)($b['updated_at'] ?? ''), (string)($a['updated_at'] ?? ''));
    });

    return [
        'active_ticket' => $activeTicket,
        'active_messages' => $activeMessages,
        'history' => $history
    ];
};

if ($method === 'GET') {
    $tickets = $fetchUserTickets($supabase, $userId);
    $msgsByTicket = $fetchMessagesByTickets($supabase, $tickets);
    $state = $partitionSupportState($tickets, $msgsByTicket);

    sendSuccess([
        'ticket' => $state['active_ticket'],
        'tickets' => $state['active_ticket'] ? [$state['active_ticket']] : [],
        'messages' => $state['active_messages'],
        'history' => $state['history'],
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
    $activeTicket = null;
    foreach ($tickets as $t) {
        $st = strtoupper(trim((string)($t['status'] ?? 'OPEN')));
        if (!in_array($st, ['RESOLVED', 'CLOSED'], true)) {
            $activeTicket = $t;
        }
    }

    if ($activeTicket === null) {
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
        $activeTicket = $insTicket['data'][0] ?? $newTicketPayload;
        $tickets[] = $activeTicket;
    } else {
        $updFields = [
            'status' => 'OPEN',
            'updated_at' => $now
        ];
        if ($topic !== '' || ($subjectInput !== '' && $subjectInput !== 'Platform Support Inquiry')) {
            $updFields['subject'] = $subject;
        }
        $updTicket = $supabase->update('support_tickets', $updFields, [
            'id' => 'eq.' . $activeTicket['id'],
            'user_id' => 'eq.' . $userId
        ]);
        if (!empty($updTicket['success']) && !empty($updTicket['data'][0])) {
            $activeTicket = $updTicket['data'][0];
        } else {
            $activeTicket['status'] = 'OPEN';
            $activeTicket['updated_at'] = $now;
            if (isset($updFields['subject'])) {
                $activeTicket['subject'] = $updFields['subject'];
            }
        }
        foreach ($tickets as &$tRef) {
            if ((string)($tRef['id'] ?? '') === (string)($activeTicket['id'] ?? '')) {
                $tRef = $activeTicket;
                break;
            }
        }
        unset($tRef);
    }

    $finalMessage = $rawMessage;
    if ($topic !== '' && stripos($rawMessage, '[' . $topic . ']') !== 0) {
        $finalMessage = '[' . $topic . "]\n" . $rawMessage;
    }

    $msgPayload = [
        'id' => primex_uuid_v4(),
        'ticket_id' => (string)$activeTicket['id'],
        'sender_id' => $userId,
        'sender_role' => 'USER',
        'message' => $finalMessage,
        'is_internal' => 0,
        'created_at' => $now
    ];
    $insMsg = $supabase->insert('support_messages', [$msgPayload]);
    if (empty($insMsg['success'])) {
        primex_record_log('SUPPORT', 'MESSAGE_INSERT_FAILED', (string)($insMsg['message'] ?? 'Insert failed'), [
            'ticket_id' => (string)$activeTicket['id'],
            'http_code' => $insMsg['http_code'] ?? 0
        ], 'ERROR', $userId, (string)($user['email'] ?? ''));
        sendError('MESSAGE_SEND_FAILED', 'Unable to send your support message right now.', 500);
    }

    primex_record_log('SUPPORT', 'USER_MESSAGE_SENT', 'User sent support message', [
        'ticket_id' => (string)$activeTicket['id'],
        'topic' => $topic,
        'length' => $msgLen
    ], 'INFO', $userId, (string)($user['email'] ?? ''));

    $msgsByTicket = $fetchMessagesByTickets($supabase, $tickets);
    $state = $partitionSupportState($tickets, $msgsByTicket);

    sendSuccess([
        'ticket' => $state['active_ticket'] ?: $activeTicket,
        'tickets' => ($state['active_ticket'] ?: $activeTicket) ? [$state['active_ticket'] ?: $activeTicket] : [],
        'messages' => $state['active_messages'],
        'history' => $state['history'],
        'user_avatar' => primex_get_user_avatar($user)
    ], 'Message sent to support desk');
}

sendError('METHOD_NOT_ALLOWED', 'Method not allowed.', 405);
