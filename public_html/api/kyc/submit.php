<?php
/**
 * User KYC Document Submission - Direct Supabase REST
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$input = getJsonBody();
$legalName = trim($input['legal_name'] ?? '');
$docNumber = trim($input['document_number'] ?? '');
$country = trim($input['country'] ?? 'United States');
$docType = strtoupper(trim($input['document_type'] ?? 'ID_CARD'));
$frontPath = trim($input['front_path'] ?? $input['front_doc_path'] ?? '');
$backPath = trim($input['back_path'] ?? $input['back_doc_path'] ?? '');
$selfiePath = trim($input['selfie_path'] ?? '');
$holdingPath = trim($input['holding_path'] ?? $input['holding_id_path'] ?? '');
$dob = trim($input['date_of_birth'] ?? '');
$address = trim($input['address'] ?? '');

foreach ([['front_doc_path', $frontPath], ['back_doc_path', $backPath], ['selfie_path', $selfiePath], ['holding_id_path', $holdingPath]] as [$field, $path]) {
    if ($path !== '') {
        $name = basename($path);
        if (!preg_match('/^kyc_[a-f0-9]{32}\.(?:jpg|jpeg|png|pdf)$/i', $name)) {
            sendError('INVALID_DOCUMENT_REFERENCE', 'A KYC document reference is invalid.', 400);
        }
    }
}
if (empty($legalName) || empty($docNumber)) {
    sendError('VALIDATION_ERROR', 'Full legal name and document number are required');
}

$supabase = getSupabaseClient();
if (!$supabase->isConfigured()) {
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase REST client is not configured.', 503);
}

// Check existing submission
$checkRes = $supabase->select('kyc_submissions', ['user_id' => "eq.{$user['id']}", 'order' => 'created_at.desc', 'limit' => '1']);
$existing = ($checkRes['success'] && !empty($checkRes['data'][0])) ? $checkRes['data'][0] : null;
$existingId = is_array($existing) ? ($existing['id'] ?? null) : null;

// DOB/address are no longer collected on the KYC page. Preserve any historical values
// when editing an existing submission, but accept omitted values for new submissions.
if ($dob === '' && is_array($existing)) $dob = trim((string)($existing['date_of_birth'] ?? ''));
if ($address === '' && is_array($existing)) $address = trim((string)($existing['address'] ?? ''));

$submissionId = ($existingId && preg_match('/^[A-Za-z0-9._:-]{1,128}$/', (string)$existingId))
    ? (string)$existingId
    : ('kyc_' . bin2hex(random_bytes(8)));

$payload = [
    'id' => $submissionId,
    'user_id' => $user['id'],
    'legal_name' => $legalName,
    'date_of_birth' => $dob,
    'country' => $country,
    'address' => $address,
    'document_type' => $docType,
    'document_number' => $docNumber,
    'front_doc_path' => $frontPath,
    'back_doc_path' => $backPath,
    'selfie_path' => $selfiePath,
    'holding_id_path' => $holdingPath,
    'status' => 'PENDING',
    'rejection_reason' => null,
    'reviewer_notes' => 'Submitted for institutional compliance review',
    'updated_at' => gmdate('Y-m-d H:i:s')
];

if (!$existingId) {
    $payload['created_at'] = gmdate('Y-m-d H:i:s');
}

$upsertRes = $supabase->upsert('kyc_submissions', [$payload], 'id');
if (empty($upsertRes['success'])) {
    sendError('KYC_SUBMIT_FAILED', 'Unable to submit KYC documents right now. Please try again.', 502);
}

// Update profile
$supabase->update('profiles', [
    'kyc_status' => 'PENDING',
    'country' => $country,
    'updated_at' => gmdate('Y-m-d H:i:s')
], ['id' => "eq.{$user['id']}"]);

sendSuccess([
    'submission_id' => $submissionId,
    'status'        => 'PENDING',
    'legal_name'    => $legalName,
    'document_type' => $docType
], 'Identity verification documents submitted for institutional compliance review');
