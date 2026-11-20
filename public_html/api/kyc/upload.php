<?php
/**
 * KYC Document Upload Handler - hardened upload validation.
 *
 * Documents are written outside the public web root when possible and then
 * uploaded to the configured private storage gateway. Original filenames are
 * never trusted or persisted as storage names.
 */
require_once dirname(__DIR__) . '/bootstrap.php';

$user = getCurrentUser();
if (!$user) {
    sendError('UNAUTHORIZED', 'Please log in to upload KYC documents', 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('METHOD_NOT_ALLOWED', 'POST method required', 405);
}

$maxBytes = 10 * 1024 * 1024;
if (!empty($_SERVER['CONTENT_LENGTH']) && (int)$_SERVER['CONTENT_LENGTH'] > $maxBytes + (1024 * 1024)) {
    sendError('FILE_TOO_LARGE', 'KYC document exceeds the 10 MB upload limit', 413);
}

$input = getJsonBody();
$fileBinary = null;
$declaredMime = null;
$declaredExt = null;
$side = strtolower(preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($_POST['side'] ?? ($input['side'] ?? 'doc'))));
if (!in_array($side, ['front','reverse','back','selfie','holding'], true)) { sendError('INVALID_DOCUMENT_SIDE', 'Invalid KYC document category.', 400); }
$allowedExts = ['jpg', 'jpeg', 'png', 'pdf'];
$allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];

if (!function_exists('finfo_open')) {
    sendError('UPLOAD_UNAVAILABLE', 'Secure file validation is unavailable on this server.', 503);
}

// Multipart upload.
if (!empty($_FILES['file'])) {
    $file = $_FILES['file'];
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        sendError('UPLOAD_FAILED', 'The document upload could not be completed.');
    }
    if (!is_uploaded_file($file['tmp_name'])) {
        sendError('UPLOAD_FAILED', 'The uploaded document could not be verified.');
    }

    $declaredExt = strtolower(pathinfo((string)$file['name'], PATHINFO_EXTENSION));
    if (!in_array($declaredExt, $allowedExts, true)) {
        sendError('INVALID_FILE_TYPE', 'Only JPG, JPEG, PNG, and PDF documents are accepted.', 415);
    }
    if ((int)($file['size'] ?? 0) <= 0 || (int)($file['size'] ?? 0) > $maxBytes) {
        sendError('FILE_TOO_LARGE', 'KYC document exceeds the 10 MB upload limit', 413);
    }
    $fileBinary = file_get_contents($file['tmp_name']);
    if ($fileBinary === false) {
        sendError('UPLOAD_FAILED', 'The document could not be read securely.');
    }
} elseif (!empty($input['file_data'])) {
    // Base64 Data URL payload used by the current frontend.
    $fileData = (string)$input['file_data'];
    if (preg_match('/^data:image\/(jpeg|jpg|png);base64,/i', $fileData, $matches)) {
        $declaredExt = strtolower($matches[1]) === 'jpeg' ? 'jpg' : strtolower($matches[1]);
        $declaredMime = $declaredExt === 'png' ? 'image/png' : 'image/jpeg';
        $fileData = substr($fileData, strpos($fileData, ',') + 1);
    } elseif (preg_match('/^data:application\/pdf;base64,/i', $fileData)) {
        $declaredExt = 'pdf';
        $declaredMime = 'application/pdf';
        $fileData = substr($fileData, strpos($fileData, ',') + 1);
    } else {
        sendError('INVALID_FILE_TYPE', 'Only JPG, JPEG, PNG, and PDF documents are accepted.', 415);
    }

    $fileBinary = base64_decode($fileData, true);
    if ($fileBinary === false || $fileBinary === '') {
        sendError('INVALID_DATA', 'Invalid document data.');
    }
    if (strlen($fileBinary) > $maxBytes) {
        sendError('FILE_TOO_LARGE', 'KYC document exceeds the 10 MB upload limit', 413);
    }
} else {
    sendError('VALIDATION_ERROR', 'No document data or file provided');
}

// Verify actual content, never trust the extension or client MIME type.
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$detectedMime = $finfo ? finfo_buffer($finfo, $fileBinary) : false;
if ($finfo) finfo_close($finfo);
if (!is_string($detectedMime) || !in_array($detectedMime, $allowedMimes, true)) {
    sendError('INVALID_FILE_TYPE', 'The document content is not an accepted JPG, PNG, or PDF file.', 415);
}

if ($detectedMime === 'application/pdf') {
    $ext = 'pdf';
} elseif ($detectedMime === 'image/png') {
    $ext = 'png';
} else {
    $ext = 'jpg';
}

// Use an unpredictable storage name. No user ID, side, timestamp, or original
// filename is included in the public storage object name.
$fileName = 'kyc_' . bin2hex(random_bytes(16)) . '.' . $ext;

// Keep the emergency local copy outside the public document root. If the
// directory cannot be created, do not fall back to a publicly reachable upload.
$privateUploadDir = dirname(__DIR__, 3) . '/server/storage/kyc';
if (!is_dir($privateUploadDir) && !@mkdir($privateUploadDir, 0700, true)) {
    sendError('UPLOAD_STORAGE_UNAVAILABLE', 'Secure document storage is unavailable.', 503);
}
$localDest = $privateUploadDir . '/' . $fileName;
if (@file_put_contents($localDest, $fileBinary, LOCK_EX) === false) {
    sendError('UPLOAD_STORAGE_UNAVAILABLE', 'Secure document storage is unavailable.', 503);
}
@chmod($localDest, 0600);

// Upload to Supabase Storage bucket 'kyc-documents'.
$supabaseBaseUrl = rtrim(SUPABASE_URL, '/');
$supabaseStorageUrl = "{$supabaseBaseUrl}/storage/v1/object/kyc-documents/{$fileName}";
$apiKey = defined('SUPABASE_SERVICE_ROLE_KEY') ? SUPABASE_SERVICE_ROLE_KEY : '';
if ($apiKey === '') {
    @unlink($localDest);
    sendError('SUPABASE_CONFIG_MISSING', 'Supabase storage is not configured.', 503);
}

$uploaded = false;
if (function_exists('curl_init')) {
    $ch = curl_init($supabaseStorageUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $fileBinary,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer {$apiKey}",
            "apikey: {$apiKey}",
            "Content-Type: {$detectedMime}",
            'x-upsert: true'
        ],
        CURLOPT_TIMEOUT => 15,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2
    ]);
    curl_exec($ch);
    $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $uploaded = $httpCode >= 200 && $httpCode < 300;
}

if (!$uploaded) {
    @unlink($localDest);
    sendError('UPLOAD_FAILED', 'The compliance document could not be securely stored. Please try again.', 502);
}

// The local copy is not needed after successful cloud storage and is removed.
@unlink($localDest);

sendSuccess([
    'path' => 'kyc-documents/' . $fileName,
    'url' => null,
    'signed_url' => null,
    'file_name' => $fileName,
    'local_path' => null,
    'side' => $side,
    'storage' => 'active'
], 'Document uploaded successfully');
