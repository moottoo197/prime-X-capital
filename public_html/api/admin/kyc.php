<?php
/**
 * Admin KYC Management - Direct Supabase REST
 * Handles Complete Document Inspection & User Synchronization
 */
require_once dirname(__DIR__) . '/bootstrap.php';
require_once dirname(__DIR__) . '/lib/mailer.php';
require_once dirname(__DIR__) . '/lib/email_templates.php';

$admin = requireAdmin();

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // KYC submissions and profile status are independent reads; fetch both together.
    $batch = $supabase->selectMany([
        'kyc' => [
            'table' => 'kyc_submissions',
            'params' => ['order' => 'created_at.desc', 'limit' => '500']
        ],
        'profiles' => [
            'table' => 'profiles',
            'params' => ['select' => 'id,email,role,kyc_status,referral_code,country,created_at']
        ]
    ]);

    $kycRes = $batch['kyc'] ?? ['success'=>false];
    $profRes = $batch['profiles'] ?? ['success'=>false];
    if (empty($kycRes['success']) && empty($profRes['success'])) {
        $errMsg = (string)($kycRes['message'] ?? $profRes['message'] ?? 'Supabase KYC query failed');
        $httpCode = (int)($kycRes['http_code'] ?? $profRes['http_code'] ?? 0);
        primex_record_log('ADMIN', 'ADMIN_KYC_DB_ERROR', $errMsg, [
            'http_code' => $httpCode,
            'error' => $kycRes['error'] ?? null
        ], 'ERROR', (string)($admin['id'] ?? ''), (string)($admin['email'] ?? ''));
        sendError('SUPABASE_QUERY_FAILED', 'Unable to load KYC records from Supabase: ' . $errMsg . ' (HTTP ' . $httpCode . ').', 502);
    }
    $submissions = ($kycRes['success'] && is_array($kycRes['data'])) ? $kycRes['data'] : [];

    // 2. Fetch all profiles to sync verified users
    $userMap = [];
    $approvedProfiles = [];

    if ($profRes['success'] && is_array($profRes['data'])) {
        foreach ($profRes['data'] as $p) {
            $uid = $p['id'];
            $userMap[$uid] = $p;
            if (in_array(strtoupper($p['kyc_status'] ?? ''), ['APPROVED', 'PENDING', 'UNDER_REVIEW', 'REJECTED', 'RESUBMIT_REQUIRED'], true)) {
                $approvedProfiles[$uid] = $p;
            }
        }
    }

    $existingUserIds = [];
    $formatted = [];

    foreach ($submissions as $k) {
        $uid = $k['user_id'] ?? '';
        $existingUserIds[$uid] = true;
        $user = $userMap[$uid] ?? [];

        $docType = $k['document_type'] ?? 'NATIONAL_ID';
        $docNum = $k['document_number'] ?? ('ID-' . strtoupper(substr(md5($uid), 0, 8)));
        $legalName = !empty($k['legal_name']) ? $k['legal_name'] : (!empty($user['email']) ? explode('@', $user['email'])[0] : 'Applicant');

        $front = trim((string)($k['front_doc_path'] ?? ''));
        $back = trim((string)($k['back_doc_path'] ?? ''));
        $selfie = trim((string)($k['selfie_path'] ?? ''));
        $holding = trim((string)($k['holding_id_path'] ?? ''));

        $userKyc = strtoupper(trim((string)($user['kyc_status'] ?? '')));
        $subKyc = strtoupper(trim((string)($k['status'] ?? 'PENDING')));
        $effectiveStatus = in_array($userKyc, ['APPROVED', 'REJECTED', 'RESUBMIT_REQUIRED', 'PENDING', 'UNDER_REVIEW', 'NOT_SUBMITTED'], true)
            ? $userKyc
            : $subKyc;

        $frontUrl = ($front !== '' && preg_match('/kyc_[a-f0-9]{32}\.(?:jpg|jpeg|png|pdf)$/i', basename($front)))
            ? ('/api/kyc/file.php?object=' . rawurlencode(basename($front)))
            : $front;
        $backUrl = ($back !== '' && preg_match('/kyc_[a-f0-9]{32}\.(?:jpg|jpeg|png|pdf)$/i', basename($back)))
            ? ('/api/kyc/file.php?object=' . rawurlencode(basename($back)))
            : $back;
        $selfieUrl = ($selfie !== '' && preg_match('/kyc_[a-f0-9]{32}\.(?:jpg|jpeg|png|pdf)$/i', basename($selfie)))
            ? ('/api/kyc/file.php?object=' . rawurlencode(basename($selfie)))
            : $selfie;

        $formatted[] = [
            'id' => $k['id'] ?? ('kyc_' . bin2hex(random_bytes(6))),
            'user_id' => $uid,
            'email' => $user['email'] ?? $uid,
            'referral_code' => $user['referral_code'] ?? '',
            'legal_name' => $legalName,
            'date_of_birth' => $k['date_of_birth'] ?? '',
            'country' => $k['country'] ?? ($user['country'] ?? 'Global'),
            'address' => $k['address'] ?? '',
            'document_type' => $docType,
            'document_number' => $docNum,
            'front_doc_path' => $front,
            'back_doc_path' => $back,
            'selfie_path' => $selfie,
            'holding_id_path' => $holding,
            'front_url' => $frontUrl,
            'back_url' => $backUrl,
            'selfie_url' => $selfieUrl,
            'status' => $effectiveStatus,
            'reviewer_notes' => $k['reviewer_notes'] ?? ($effectiveStatus === 'APPROVED' ? 'Identity verified and approved' : ($effectiveStatus === 'RESUBMIT_REQUIRED' ? 'Document resubmission requested' : 'Pending compliance audit')),
            'rejection_reason' => $k['rejection_reason'] ?? '',
            'reviewed_at' => $k['reviewed_at'] ?? ($k['created_at'] ?? gmdate('Y-m-d H:i:s')),
            'created_at' => $k['created_at'] ?? gmdate('Y-m-d H:i:s'),
            'updated_at' => $k['updated_at'] ?? gmdate('Y-m-d H:i:s')
        ];
    }

    // 3. For any user who has KYC status in profiles but has no kyc_submissions row
    foreach ($approvedProfiles as $uid => $p) {
        if (!isset($existingUserIds[$uid])) {
            $name = ucwords(str_replace(['.', '_', '-'], ' ', explode('@', $p['email'])[0]));
            $subId = 'kyc_' . substr(md5($uid), 0, 12);
            $profStatus = strtoupper(trim((string)($p['kyc_status'] ?? 'PENDING')));

            $formatted[] = [
                'id' => $subId,
                'user_id' => $uid,
                'email' => $p['email'],
                'referral_code' => $p['referral_code'] ?? '',
                'legal_name' => $name,
                'date_of_birth' => '',
                'country' => $p['country'] ?? 'Global',
                'address' => '',
                'document_type' => 'ID_CARD',
                'document_number' => 'ID-' . strtoupper(substr(md5($uid), 0, 8)),
                'front_doc_path' => '',
                'back_doc_path' => '',
                'selfie_path' => '',
                'holding_id_path' => null,
                'front_url' => '',
                'back_url' => '',
                'selfie_url' => '',
                'status' => $profStatus,
                'reviewer_notes' => $profStatus === 'APPROVED' ? 'Institutional clearance & identity verified' : 'Pending compliance audit',
                'rejection_reason' => '',
                'reviewed_at' => $p['created_at'] ?? gmdate('Y-m-d H:i:s'),
                'created_at' => $p['created_at'] ?? gmdate('Y-m-d H:i:s'),
                'updated_at' => $p['created_at'] ?? gmdate('Y-m-d H:i:s')
            ];
        }
    }

    sendSuccess([
        'submissions' => $formatted,
        'total' => count($formatted),
        'database_engine' => 'supabase-rest'
    ], 'KYC submissions retrieved successfully from Supabase');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonBody();
    $submissionId = trim((string)($input['submission_id'] ?? ''));
    $rawDecision = strtoupper(trim((string)($input['decision'] ?? 'APPROVED')));

    if (in_array($rawDecision, ['APPROVE', 'APPROVED'], true)) {
        $decision = 'APPROVED';
    } elseif (in_array($rawDecision, ['REJECT', 'REJECTED'], true)) {
        $decision = 'REJECTED';
    } elseif (in_array($rawDecision, ['RESUBMIT', 'RESUBMIT_REQUIRED', 'RESUBMIT_DOCUMENTS'], true)) {
        $decision = 'RESUBMIT_REQUIRED';
    } else {
        sendError('VALIDATION_ERROR', 'Invalid KYC decision. Use APPROVED, REJECTED, or RESUBMIT_REQUIRED.');
    }

    $defaultReason = $decision === 'APPROVED'
        ? 'Verified by Compliance Officer'
        : ($decision === 'RESUBMIT_REQUIRED'
            ? 'Please upload clearer identity verification documents and resubmit your KYC.'
            : 'Identity verification requirements not met');
    $reason = trim((string)($input['reason'] ?? ''));
    if ($reason === '') {
        $reason = $defaultReason;
    }

    if (empty($submissionId)) {
        sendError('VALIDATION_ERROR', 'submission_id is required');
    }

    // Try finding submission by ID
    $userId = null;
    $subFetch = $supabase->select('kyc_submissions', ['id' => "eq.{$submissionId}", 'limit' => '1']);
    if ($subFetch['success'] && !empty($subFetch['data'][0])) {
        $userId = $subFetch['data'][0]['user_id'] ?? null;
    }

    // If not found by submission ID, it could be user_id directly
    if (!$userId) {
        $userCheck = $supabase->select('profiles', ['id' => "eq.{$submissionId}", 'limit' => '1']);
        if ($userCheck['success'] && !empty($userCheck['data'][0])) {
            $userId = $submissionId;
        }
    }

    // Also resolve deterministic fallback id 'kyc_' . substr(md5($uid), 0, 12) when profile has no submission row
    if (!$userId && strpos($submissionId, 'kyc_') === 0) {
        $allProfRes = $supabase->select('profiles', ['select' => 'id', 'limit' => '5000']);
        if (!empty($allProfRes['success']) && is_array($allProfRes['data'] ?? null)) {
            foreach ($allProfRes['data'] as $pRow) {
                $candUid = (string)($pRow['id'] ?? '');
                if ($candUid !== '' && ('kyc_' . substr(md5($candUid), 0, 12)) === $submissionId) {
                    $userId = $candUid;
                    break;
                }
            }
        }
    }

    // 1. Update KYC record(s)
    $kycUpdate = [
        'status' => $decision,
        'reviewer_notes' => $reason,
        'rejection_reason' => in_array($decision, ['REJECTED', 'RESUBMIT_REQUIRED'], true) ? $reason : null,
        'reviewed_at' => gmdate('Y-m-d H:i:s'),
        'updated_at' => gmdate('Y-m-d H:i:s')
    ];

    $supabase->update('kyc_submissions', $kycUpdate, ['id' => "eq.{$submissionId}"]);
    if ($userId) {
        $supabase->update('kyc_submissions', $kycUpdate, ['user_id' => "eq.{$userId}"]);

        // 2. Update profile KYC status
        $supabase->update('profiles', [
            'kyc_status' => $decision,
            'updated_at' => gmdate('Y-m-d H:i:s')
        ], ['id' => "eq.{$userId}"]);
    }

    // 3. User notification
    if ($userId) {
        if ($decision === 'APPROVED') {
            $notifType = 'KYC_APPROVED';
            $notifTitle = 'Identity Verification Approved';
            $notifMsg = 'Your Real-Name identity documents have been approved by compliance. Full platform privileges and high limits are active.';
        } elseif ($decision === 'RESUBMIT_REQUIRED') {
            $notifType = 'KYC_RESUBMIT_REQUIRED';
            $notifTitle = 'KYC Document Resubmission Requested';
            $notifMsg = "Compliance requested updated identity documents: {$reason} Open KYC Verification to resubmit.";
        } else {
            $notifType = 'KYC_REJECTED';
            $notifTitle = 'Identity Verification Declined';
            $notifMsg = "Your KYC verification was not approved. Reason: {$reason}";
        }

        $supabase->insert('user_notifications', [[
            'id' => 'notif_' . bin2hex(random_bytes(8)),
            'user_id' => $userId,
            'type' => $notifType,
            'title' => $notifTitle,
            'message' => $notifMsg,
            'is_read' => 0,
            'created_at' => gmdate('Y-m-d H:i:s')
        ]]);

        if (in_array($decision, ['APPROVED', 'REJECTED', 'RESUBMIT_REQUIRED'], true)) {
            try {
                $profLookup = $supabase->select('profiles', [
                    'id' => 'eq.' . (string)$userId,
                    'select' => 'id,email,first_name',
                    'limit' => '1'
                ]);
                $profRow = (!empty($profLookup['success']) && !empty($profLookup['data'][0])) ? $profLookup['data'][0] : [];
                $recipientEmail = trim((string)($profRow['email'] ?? ''));
                if ($recipientEmail !== '' && filter_var($recipientEmail, FILTER_VALIDATE_EMAIL)) {
                    $recipientName = trim((string)($profRow['first_name'] ?? ''));
                    $tpl = primex_email_template_kyc_status(
                        $recipientName,
                        $decision,
                        $reason,
                        gmdate('Y-m-d H:i:s') . ' UTC',
                        primex_app_url()
                    );
                    $mailRes = primex_send_templated_email($recipientEmail, $tpl);
                    if (empty($mailRes['success'])) {
                        primex_record_log('EMAIL', 'ADMIN_KYC_MAIL_FAILED', (string)($mailRes['message'] ?? 'Mail delivery failed'), [
                            'submission_id' => $submissionId,
                            'decision' => $decision
                        ], 'WARN', (string)$userId, $recipientEmail);
                    }
                }
            } catch (Throwable $mailErr) {
                primex_record_log('EMAIL', 'ADMIN_KYC_MAIL_EXCEPTION', $mailErr->getMessage(), [
                    'submission_id' => $submissionId
                ], 'WARN', (string)$userId, (string)($admin['email'] ?? ''));
            }
        }
    }

    sendSuccess([
        'submission_id' => $submissionId,
        'user_id' => $userId,
        'status' => $decision,
        'reason' => $reason
    ], "KYC submission marked as {$decision}");
}
