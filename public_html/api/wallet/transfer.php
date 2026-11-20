<?php
require_once dirname(__DIR__) . '/bootstrap.php';
$user=requireAuth();
if($_SERVER['REQUEST_METHOD']!=='POST') sendError('METHOD_NOT_ALLOWED','POST method required',405);
$input=getJsonBody();
$amount=(float)($input['amount']??0); $from=strtolower(trim((string)($input['from_wallet']??$input['from']??''))); $to=strtolower(trim((string)($input['to_wallet']??$input['to']??''))); $asset=strtoupper(trim((string)($input['asset']??'USDT')));
if($amount<=0) sendError('INVALID_AMOUNT','Transfer amount must be positive');
if(!in_array($from,['funding','exchange','trading'],true)||!in_array($to,['funding','exchange','trading'],true)||$from===$to) sendError('INVALID_WALLET','Invalid source or destination wallet');
$key=trim((string)($_SERVER['HTTP_X_IDEMPOTENCY_KEY']??$input['idempotency_key']??'')); if(!preg_match('/^[A-Za-z0-9._:-]{16,128}$/',$key)) sendError('IDEMPOTENCY_KEY_REQUIRED','A unique idempotency key is required.',400);
$sb=getSupabaseClient(); if(!$sb->isConfigured()) sendError('SUPABASE_CONFIG_MISSING','Supabase REST client is not configured.',503);
$res=$sb->rpc('user_transfer_once',['p_user_id'=>$user['id'],'p_idempotency_key'=>$key,'p_from_wallet'=>$from,'p_to_wallet'=>$to,'p_asset'=>$asset,'p_amount'=>$amount]);
if(!$res['success']) { $msg=strtolower((string)($res['message']??'')); if(strpos($msg,'insufficient')!==false) sendError('INSUFFICIENT_FUNDS','Insufficient funds.',400); sendError('TRANSFER_FAILED','The transfer could not be completed.',502); }
$data=is_array($res['data'])?$res['data']:[]; sendSuccess($data,'Transfer completed successfully');
