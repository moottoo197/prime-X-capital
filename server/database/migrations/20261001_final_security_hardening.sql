-- AlphaVest final security hardening migration.
-- Run AFTER the previous AlphaVest migrations.
BEGIN;

-- Private KYC storage bucket. Service-role backend access is retained.
INSERT INTO storage.buckets(id,name,public) VALUES ('kyc-documents','kyc-documents',false) ON CONFLICT (id) DO UPDATE SET public=false;

-- Browser clients must not have direct table access. The PHP backend uses the
-- Supabase service role and therefore remains able to operate these tables.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles','wallet_balances','ledger_entries','deposits','withdrawals',
    'internal_transfers','kyc_submissions','user_sessions','security_rate_limits',
    'idempotency_keys','admin_audit_logs','approval_requests','user_notifications',
    'trading_signals','user_signal_executions','positions','orders','copy_trades',
    'referrals','referral_rewards','system_settings','deposit_config'
  ] LOOP
    IF to_regclass('public.'||quote_ident(t)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated',t);
    END IF;
  END LOOP;
END $$;

-- Invalidate legacy sessions because previous builds stored raw session tokens.
DELETE FROM public.user_sessions;

-- Atomic internal wallet transfer. This closes the read/modify/write race in
-- the previous REST-only implementation and makes duplicate requests safe.
CREATE OR REPLACE FUNCTION public.user_transfer_once(
  p_user_id text, p_idempotency_key text, p_from_wallet text, p_to_wallet text,
  p_asset text, p_amount numeric
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE a record; b record; existing record; new_a numeric; new_b numeric; ref text;
BEGIN
  IF coalesce(trim(p_idempotency_key),'')='' THEN RAISE EXCEPTION 'IDEMPOTENCY_KEY_REQUIRED'; END IF;
  IF p_amount <= 0 OR p_from_wallet = p_to_wallet THEN RAISE EXCEPTION 'INVALID_TRANSFER'; END IF;
  INSERT INTO idempotency_keys(idempotency_key,user_id,endpoint,status,expires_at)
  VALUES(p_idempotency_key,p_user_id,'user_transfer_once','PROCESSING',now()+interval '24 hours')
  ON CONFLICT (idempotency_key,user_id) DO NOTHING;
  SELECT * INTO existing FROM idempotency_keys WHERE idempotency_key=p_idempotency_key AND user_id=p_user_id FOR UPDATE;
  IF existing.status='COMPLETED' AND coalesce(existing.response_payload,'')<>'' THEN RETURN existing.response_payload::jsonb; END IF;
  IF existing.status='PROCESSING' AND existing.created_at > now()-interval '5 minutes' THEN
    RETURN jsonb_build_object('success',false,'error_code','ACTION_IN_PROGRESS','message','This transfer is already being processed.');
  END IF;
  UPDATE idempotency_keys SET status='PROCESSING',response_payload=NULL,completed_at=NULL,expires_at=now()+interval '24 hours' WHERE idempotency_key=p_idempotency_key AND user_id=p_user_id;
  SELECT * INTO a FROM wallet_balances WHERE user_id=p_user_id AND wallet_type=lower(p_from_wallet) AND asset=upper(p_asset) FOR UPDATE;
  IF NOT FOUND OR coalesce(a.available_balance,a.balance,0) < p_amount THEN RAISE EXCEPTION 'INSUFFICIENT_FUNDS'; END IF;
  SELECT * INTO b FROM wallet_balances WHERE user_id=p_user_id AND wallet_type=lower(p_to_wallet) AND asset=upper(p_asset) FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO wallet_balances(user_id,wallet_type,asset,balance,available_balance,reserved_balance,promotional_balance) VALUES(p_user_id,lower(p_to_wallet),upper(p_asset),0,0,0,0) RETURNING * INTO b;
  END IF;
  new_a=coalesce(a.available_balance,a.balance,0)-p_amount; new_b=coalesce(b.balance,0)+p_amount; ref='trf_'||md5(random()::text||clock_timestamp()::text);
  UPDATE wallet_balances SET balance=new_a,available_balance=new_a,updated_at=now() WHERE id=a.id;
  UPDATE wallet_balances SET balance=new_b,available_balance=new_b,updated_at=now() WHERE id=b.id;
  INSERT INTO internal_transfers(id,user_id,from_wallet,to_wallet,asset,amount,fee,status) VALUES(ref,p_user_id,lower(p_from_wallet),lower(p_to_wallet),upper(p_asset),p_amount,0,'COMPLETED');
  INSERT INTO ledger_entries(user_id,wallet_type,asset,amount,balance_before,balance_after,entry_type,reference_id,description) VALUES
    (p_user_id,lower(p_from_wallet),upper(p_asset),-p_amount,coalesce(a.available_balance,a.balance,0),new_a,'TRANSFER_OUT',ref,'Internal wallet transfer'),
    (p_user_id,lower(p_to_wallet),upper(p_asset),p_amount,coalesce(b.balance,0),new_b,'TRANSFER_IN',ref,'Internal wallet transfer');
  UPDATE idempotency_keys SET status='COMPLETED',response_payload=jsonb_build_object('success',true,'transfer_id',ref,'from_wallet',lower(p_from_wallet),'to_wallet',lower(p_to_wallet),'asset',upper(p_asset),'amount',p_amount),completed_at=now() WHERE idempotency_key=p_idempotency_key AND user_id=p_user_id;
  RETURN (SELECT response_payload::jsonb FROM idempotency_keys WHERE idempotency_key=p_idempotency_key AND user_id=p_user_id);
END $$;

REVOKE ALL ON FUNCTION public.user_transfer_once(text,text,text,text,text,numeric) FROM PUBLIC, anon, authenticated;

COMMIT;
