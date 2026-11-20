<?php
/** Protected KYC document retrieval. Never exposes a public bucket URL. */
require_once dirname(__DIR__) . '/bootstrap.php';
$admin = requireAdmin();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') sendError('METHOD_NOT_ALLOWED','GET method required',405);
$object = trim((string)($_GET['object'] ?? $_GET['path'] ?? ''));
$object = preg_replace('#^kyc-documents/#','',$object);
if (!preg_match('/^kyc_[a-f0-9]{32}\.(?:jpg|jpeg|png|pdf)$/i', $object)) {
    sendError('INVALID_DOCUMENT','Invalid KYC document reference.',400);
}
$url=rtrim(SUPABASE_URL,'/').'/storage/v1/object/kyc-documents/'.rawurlencode($object);
$key=SUPABASE_SERVICE_ROLE_KEY;
if (!function_exists('curl_init')) sendError('STORAGE_UNAVAILABLE','Secure document retrieval is unavailable.',503);
$ch=curl_init($url); curl_setopt_array($ch,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_HTTPHEADER=>["Authorization: Bearer {$key}","apikey: {$key}"],CURLOPT_TIMEOUT=>20,CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_SSL_VERIFYHOST=>2]);
$body=curl_exec($ch); $code=(int)curl_getinfo($ch,CURLINFO_HTTP_CODE); $type=(string)curl_getinfo($ch,CURLINFO_CONTENT_TYPE); curl_close($ch);
if($code!==200 || $body===false){ sendError('DOCUMENT_NOT_FOUND','KYC document could not be retrieved.',404); }
$allowed=['image/jpeg'=>'jpg','image/png'=>'png','application/pdf'=>'pdf']; $mime=strtolower(trim(explode(';',$type)[0])); if(!isset($allowed[$mime])) sendError('INVALID_DOCUMENT','Unsupported document type.',415);
header('Content-Type: '.$mime); header('Content-Length: '.strlen($body)); header('Content-Disposition: inline; filename="'.basename($object).'"'); header('X-Content-Type-Options: nosniff'); header('Cache-Control: private, no-store, max-age=0'); echo $body; exit;
