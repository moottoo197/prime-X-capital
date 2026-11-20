-- AlphaVest duplicate-click / replay protection
-- Run this migration ONCE in the Supabase SQL Editor.
-- It preserves the existing application logic while making balance-changing
-- operations atomic and idempotent at the database level.

BEGIN;


-- ---------------------------------------------------------------------------
-- Notification table required by deposit/withdrawal/KYC processing.
-- Kept as a standalone table so notification writes never fail when a
-- decision function emits a user notification.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user_created
  ON public.user_notifications(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.idempotency_keys (
  idempotency_key TEXT NOT NULL,
  user_id TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PROCESSING',
  response_payload TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  PRIMARY KEY (idempotency_key, user_id)
);

CREATE INDEX IF NOT EXISTS idx_idempotency_keys_expires_at
  ON public.idempotency_keys(expires_at);

-- Older AlphaVest schema versions stored these timestamps as TEXT. Convert them
-- to real PostgreSQL timestamps so transactional expiry checks are reliable.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='idempotency_keys' AND column_name='created_at' AND data_type='text') THEN
    EXECUTE 'ALTER TABLE public.idempotency_keys ALTER COLUMN created_at DROP DEFAULT';
    EXECUTE 'ALTER TABLE public.idempotency_keys ALTER COLUMN expires_at DROP DEFAULT';
    EXECUTE 'ALTER TABLE public.idempotency_keys ALTER COLUMN created_at TYPE TIMESTAMPTZ USING NULLIF(created_at,'''')::TIMESTAMPTZ';
    EXECUTE 'ALTER TABLE public.idempotency_keys ALTER COLUMN completed_at TYPE TIMESTAMPTZ USING NULLIF(completed_at,'''')::TIMESTAMPTZ';
    EXECUTE 'ALTER TABLE public.idempotency_keys ALTER COLUMN expires_at TYPE TIMESTAMPTZ USING NULLIF(expires_at,'''')::TIMESTAMPTZ';
    EXECUTE 'ALTER TABLE public.idempotency_keys ALTER COLUMN created_at SET DEFAULT NOW()';
    EXECUTE 'ALTER TABLE public.idempotency_keys ALTER COLUMN expires_at SET DEFAULT (NOW() + INTERVAL ''24 hours'')';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 1) Admin financial adjustment: one idempotency key = one balance change.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_adjust_balance_once(
  p_scope_user TEXT,
  p_idempotency_key TEXT,
  p_user_id TEXT,
  p_wallet_type TEXT,
  p_asset TEXT,
  p_amount NUMERIC,
  p_description TEXT,
  p_operator_id TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  idem RECORD;
  inserted_key TEXT;
  wallet RECORD;
  cur_balance NUMERIC;
  new_balance NUMERIC;
  result JSONB;
  ledger_id BIGINT;
  now_utc TIMESTAMPTZ := NOW();
BEGIN
  IF COALESCE(TRIM(p_idempotency_key), '') = '' THEN
    RAISE EXCEPTION 'IDEMPOTENCY_KEY_REQUIRED';
  END IF;

  -- A unique key is claimed inside this transaction. Concurrent duplicate
  -- requests wait for the first transaction and then see its COMPLETED result.
  INSERT INTO public.idempotency_keys(
    idempotency_key,user_id,endpoint,status,created_at,expires_at
  ) VALUES (
    p_idempotency_key,p_scope_user,'admin_adjust_balance_once','PROCESSING',now_utc,now_utc + INTERVAL '24 hours'
  ) ON CONFLICT (idempotency_key,user_id) DO NOTHING
  RETURNING idempotency_key INTO inserted_key;

  IF inserted_key IS NULL THEN
    SELECT * INTO idem FROM public.idempotency_keys
    WHERE idempotency_key=p_idempotency_key AND user_id=p_scope_user
    FOR UPDATE;
    IF idem.status='COMPLETED' AND COALESCE(idem.response_payload,'')<>'' THEN
      RETURN idem.response_payload::JSONB;
    END IF;
    IF COALESCE(idem.expires_at,now_utc) <= now_utc OR idem.created_at < now_utc - INTERVAL '5 minutes' THEN
      UPDATE public.idempotency_keys SET status='PROCESSING',response_payload=NULL,completed_at=NULL,expires_at=now_utc+INTERVAL '24 hours'
      WHERE idempotency_key=p_idempotency_key AND user_id=p_scope_user;
    ELSE
      RETURN jsonb_build_object('success',false,'error_code','ACTION_IN_PROGRESS','message','This financial adjustment is already being processed.');
    END IF;
  END IF;

  SELECT * INTO wallet
  FROM public.wallet_balances
  WHERE user_id=p_user_id AND wallet_type=LOWER(p_wallet_type) AND asset=UPPER(p_asset)
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.wallet_balances(
      user_id,wallet_type,asset,balance,available_balance,reserved_balance,promotional_balance,created_at,updated_at
    ) VALUES (
      p_user_id,LOWER(p_wallet_type),UPPER(p_asset),0,0,0,0,now_utc,now_utc
    ) ON CONFLICT (user_id,wallet_type,asset) DO NOTHING;

    SELECT * INTO wallet
    FROM public.wallet_balances
    WHERE user_id=p_user_id AND wallet_type=LOWER(p_wallet_type) AND asset=UPPER(p_asset)
    FOR UPDATE;
  END IF;

  cur_balance := COALESCE(wallet.balance,0);
  new_balance := GREATEST(0, cur_balance + p_amount);
  UPDATE public.wallet_balances
  SET balance=new_balance,
      available_balance=new_balance,
      updated_at=now_utc
  WHERE user_id=p_user_id AND wallet_type=LOWER(p_wallet_type) AND asset=UPPER(p_asset);

  INSERT INTO public.ledger_entries(
    user_id,wallet_type,asset,amount,balance_before,balance_after,
    entry_type,reference_id,description,operator_id,created_at
  ) VALUES (
    p_user_id,LOWER(p_wallet_type),UPPER(p_asset),p_amount,cur_balance,new_balance,
    'ADJUSTMENT',p_idempotency_key,p_description,p_operator_id,now_utc
  ) RETURNING id INTO ledger_id;

  result := jsonb_build_object(
    'success',true,
    'user_id',p_user_id,
    'wallet_type',LOWER(p_wallet_type),
    'asset',UPPER(p_asset),
    'previous_balance',cur_balance,
    'new_balance',new_balance,
    'ledger_id',ledger_id
  );

  UPDATE public.idempotency_keys
  SET status='COMPLETED', response_payload=result::TEXT,
      completed_at=now_utc, expires_at=now_utc + INTERVAL '24 hours'
  WHERE idempotency_key=p_idempotency_key AND user_id=p_scope_user;

  RETURN result;
END;
$$;

-- ---------------------------------------------------------------------------
-- 2) User deposit submission: duplicate clicks with the same client key
--    return the original deposit instead of creating another request.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_deposit_once(
  p_user_id TEXT,
  p_idempotency_key TEXT,
  p_deposit_id TEXT,
  p_asset TEXT,
  p_network TEXT,
  p_amount NUMERIC,
  p_deposit_address TEXT,
  p_tx_hash TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  idem RECORD;
  inserted_key TEXT;
  dep RECORD;
  result JSONB;
  now_utc TIMESTAMPTZ := NOW();
BEGIN
  IF COALESCE(TRIM(p_idempotency_key),'')='' THEN RAISE EXCEPTION 'IDEMPOTENCY_KEY_REQUIRED'; END IF;

  INSERT INTO public.idempotency_keys(idempotency_key,user_id,endpoint,status,created_at,expires_at)
  VALUES(p_idempotency_key,p_user_id,'submit_deposit_once','PROCESSING',now_utc,now_utc+INTERVAL '24 hours')
  ON CONFLICT (idempotency_key,user_id) DO NOTHING
  RETURNING idempotency_key INTO inserted_key;

  IF inserted_key IS NULL THEN
    SELECT * INTO idem FROM public.idempotency_keys
    WHERE idempotency_key=p_idempotency_key AND user_id=p_user_id
    FOR UPDATE;
    IF idem.status='COMPLETED' AND COALESCE(idem.response_payload,'')<>'' THEN
      RETURN idem.response_payload::JSONB;
    END IF;
    IF COALESCE(idem.expires_at,now_utc) <= now_utc OR idem.created_at < now_utc - INTERVAL '5 minutes' THEN
      UPDATE public.idempotency_keys SET status='PROCESSING',response_payload=NULL,completed_at=NULL,expires_at=now_utc+INTERVAL '24 hours'
      WHERE idempotency_key=p_idempotency_key AND user_id=p_user_id;
    ELSE
      RETURN jsonb_build_object('success',false,'error_code','ACTION_IN_PROGRESS','message','This deposit submission is already being processed.');
    END IF;
  END IF;

  INSERT INTO public.deposits(
    id,user_id,asset,network,amount,fee,net_amount,deposit_address,tx_hash,status,created_at,updated_at
  ) VALUES (
    p_deposit_id,p_user_id,UPPER(p_asset),UPPER(p_network),p_amount,0,p_amount,
    p_deposit_address,p_tx_hash,'PENDING',now_utc,now_utc
  );

  result := jsonb_build_object(
    'success',true,
    'deposit_id',p_deposit_id,
    'status','PENDING',
    'amount',p_amount,
    'asset',UPPER(p_asset),
    'network',UPPER(p_network)
  );

  UPDATE public.idempotency_keys SET status='COMPLETED',response_payload=result::TEXT,
    completed_at=now_utc,expires_at=now_utc+INTERVAL '24 hours'
  WHERE idempotency_key=p_idempotency_key AND user_id=p_user_id;

  RETURN result;
END;
$$;

-- ---------------------------------------------------------------------------
-- 3) User withdrawal: atomic balance deduction + withdrawal + ledger.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_withdrawal_once(
  p_user_id TEXT,
  p_idempotency_key TEXT,
  p_withdrawal_id TEXT,
  p_asset TEXT,
  p_network TEXT,
  p_destination TEXT,
  p_amount NUMERIC,
  p_fee NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  idem RECORD;
  inserted_key TEXT;
  wallet RECORD;
  funding_balance NUMERIC;
  new_balance NUMERIC;
  net_amount NUMERIC;
  result JSONB;
  now_utc TIMESTAMPTZ := NOW();
BEGIN
  IF COALESCE(TRIM(p_idempotency_key),'')='' THEN RAISE EXCEPTION 'IDEMPOTENCY_KEY_REQUIRED'; END IF;

  INSERT INTO public.idempotency_keys(idempotency_key,user_id,endpoint,status,created_at,expires_at)
  VALUES(p_idempotency_key,p_user_id,'submit_withdrawal_once','PROCESSING',now_utc,now_utc+INTERVAL '24 hours')
  ON CONFLICT (idempotency_key,user_id) DO NOTHING
  RETURNING idempotency_key INTO inserted_key;

  IF inserted_key IS NULL THEN
    SELECT * INTO idem FROM public.idempotency_keys
    WHERE idempotency_key=p_idempotency_key AND user_id=p_user_id
    FOR UPDATE;
    IF idem.status='COMPLETED' AND COALESCE(idem.response_payload,'')<>'' THEN
      RETURN idem.response_payload::JSONB;
    END IF;
    IF COALESCE(idem.expires_at,now_utc) <= now_utc OR idem.created_at < now_utc - INTERVAL '5 minutes' THEN
      UPDATE public.idempotency_keys SET status='PROCESSING',response_payload=NULL,completed_at=NULL,expires_at=now_utc+INTERVAL '24 hours'
      WHERE idempotency_key=p_idempotency_key AND user_id=p_user_id;
    ELSE
      RETURN jsonb_build_object('success',false,'error_code','ACTION_IN_PROGRESS','message','This withdrawal request is already being processed.');
    END IF;
  END IF;

  SELECT * INTO wallet FROM public.wallet_balances
  WHERE user_id=p_user_id AND wallet_type='funding' AND asset=UPPER(p_asset)
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'INSUFFICIENT_FUNDS';
  END IF;

  funding_balance := COALESCE(wallet.available_balance,wallet.balance,0);
  IF funding_balance < p_amount THEN
    RETURN jsonb_build_object('success',false,'error_code','INSUFFICIENT_FUNDS','message',format('Insufficient available balance in Funding Wallet. Available: %s %s',funding_balance,UPPER(p_asset)));
  END IF;

  new_balance := funding_balance - p_amount;
  net_amount := GREATEST(0,p_amount-p_fee);

  UPDATE public.wallet_balances
  SET balance=COALESCE(balance,0)-p_amount,
      available_balance=COALESCE(available_balance,0)-p_amount,
      updated_at=now_utc
  WHERE user_id=p_user_id AND wallet_type='funding' AND asset=UPPER(p_asset);

  INSERT INTO public.withdrawals(
    id,user_id,asset,network,destination_address,amount,fee,net_amount,status,created_at,updated_at
  ) VALUES (
    p_withdrawal_id,p_user_id,UPPER(p_asset),UPPER(p_network),p_destination,p_amount,p_fee,net_amount,'REQUESTED',now_utc,now_utc
  );

  INSERT INTO public.ledger_entries(
    user_id,wallet_type,asset,amount,balance_before,balance_after,entry_type,reference_id,description,created_at
  ) VALUES (
    p_user_id,'funding',UPPER(p_asset),-p_amount,funding_balance,new_balance,
    'WITHDRAWAL',p_withdrawal_id,format('Withdrawal request of %s %s to %s',p_amount,UPPER(p_asset),p_destination),now_utc
  );

  result := jsonb_build_object(
    'success',true,
    'withdrawal_id',p_withdrawal_id,
    'amount',p_amount,
    'fee',p_fee,
    'net_amount',net_amount,
    'status','REQUESTED',
    'new_balance',new_balance
  );

  UPDATE public.idempotency_keys SET status='COMPLETED',response_payload=result::TEXT,
    completed_at=now_utc,expires_at=now_utc+INTERVAL '24 hours'
  WHERE idempotency_key=p_idempotency_key AND user_id=p_user_id;

  RETURN result;
END;
$$;

-- ---------------------------------------------------------------------------
-- 4) Admin deposit approval/rejection: lock the deposit row so only the first
--    decision can credit/refund and notify the user.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_process_deposit(
  p_deposit_id TEXT,
  p_decision TEXT,
  p_reason TEXT,
  p_operator_id TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  dep RECORD;
  wallet RECORD;
  cur_balance NUMERIC;
  new_balance NUMERIC;
  now_utc TIMESTAMPTZ := NOW();
  decision TEXT := UPPER(TRIM(p_decision));
BEGIN
  SELECT * INTO dep FROM public.deposits WHERE id=p_deposit_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success',false,'error_code','NOT_FOUND','message','Deposit record not found in Supabase.');
  END IF;

  IF decision='APPROVE' THEN
    IF UPPER(COALESCE(dep.status,'PENDING'))='COMPLETED' THEN
      RETURN jsonb_build_object('success',true,'already_processed',true,'deposit_id',p_deposit_id,'status','COMPLETED');
    END IF;
    IF UPPER(COALESCE(dep.status,'PENDING'))<>'PENDING' THEN
      RETURN jsonb_build_object('success',false,'error_code','DEPOSIT_ALREADY_PROCESSED','message','This deposit has already been processed.');
    END IF;

    SELECT * INTO wallet FROM public.wallet_balances
    WHERE user_id=dep.user_id AND wallet_type='funding' AND asset=UPPER(dep.asset)
    FOR UPDATE;
    IF NOT FOUND THEN
      INSERT INTO public.wallet_balances(user_id,wallet_type,asset,balance,available_balance,reserved_balance,promotional_balance,created_at,updated_at)
      VALUES(dep.user_id,'funding',UPPER(dep.asset),0,0,0,0,now_utc,now_utc)
      ON CONFLICT (user_id,wallet_type,asset) DO NOTHING;
      SELECT * INTO wallet FROM public.wallet_balances
      WHERE user_id=dep.user_id AND wallet_type='funding' AND asset=UPPER(dep.asset)
      FOR UPDATE;
    END IF;

    cur_balance := COALESCE(wallet.balance,0);
    new_balance := cur_balance + COALESCE(dep.amount,0);

    UPDATE public.wallet_balances
    SET balance=new_balance,
        available_balance=COALESCE(wallet.available_balance,cur_balance)+COALESCE(dep.amount,0),
        updated_at=now_utc
    WHERE user_id=dep.user_id AND wallet_type='funding' AND asset=UPPER(dep.asset);

    UPDATE public.deposits
    SET status='COMPLETED',updated_at=now_utc
    WHERE id=p_deposit_id;

    INSERT INTO public.ledger_entries(
      user_id,wallet_type,asset,amount,balance_before,balance_after,entry_type,reference_id,description,operator_id,created_at
    ) VALUES (
      dep.user_id,'funding',UPPER(dep.asset),COALESCE(dep.amount,0),cur_balance,new_balance,
      'DEPOSIT',p_deposit_id,format('Deposit of %s %s approved by compliance',dep.amount,UPPER(dep.asset)),p_operator_id,now_utc
    );

    INSERT INTO public.user_notifications(id,user_id,type,title,message,is_read,created_at)
    VALUES(
      'notif_'||md5(random()::text || clock_timestamp()::text || pg_backend_pid()::text),dep.user_id,'DEPOSIT_APPROVED','Deposit Credited',
      format('Your deposit of %s %s has been verified and credited to your Funding Wallet.',dep.amount,UPPER(dep.asset)),0,now_utc
    );

    RETURN jsonb_build_object('success',true,'deposit_id',p_deposit_id,'status','COMPLETED','processed',true);
  END IF;

  IF decision='REJECT' THEN
    IF UPPER(COALESCE(dep.status,'PENDING'))='REJECTED' THEN
      RETURN jsonb_build_object('success',true,'already_processed',true,'deposit_id',p_deposit_id,'status','REJECTED');
    END IF;
    IF UPPER(COALESCE(dep.status,'PENDING'))<>'PENDING' THEN
      RETURN jsonb_build_object('success',false,'error_code','DEPOSIT_ALREADY_PROCESSED','message','This deposit has already been processed.');
    END IF;

    UPDATE public.deposits
    SET status='REJECTED',rejection_reason=p_reason,updated_at=now_utc
    WHERE id=p_deposit_id;

    INSERT INTO public.user_notifications(id,user_id,type,title,message,is_read,created_at)
    VALUES(
      'notif_'||md5(random()::text || clock_timestamp()::text || pg_backend_pid()::text),dep.user_id,'DEPOSIT_REJECTED','Deposit Declined',
      format('Your deposit request for %s %s was declined.%s',dep.amount,UPPER(dep.asset),CASE WHEN COALESCE(TRIM(p_reason),'')<>'' THEN ' Reason: '||p_reason ELSE '' END),0,now_utc
    );

    RETURN jsonb_build_object('success',true,'deposit_id',p_deposit_id,'status','REJECTED','processed',true);
  END IF;

  RETURN jsonb_build_object('success',false,'error_code','INVALID_DECISION','message','Decision must be APPROVE or REJECT.');
END;
$$;

-- ---------------------------------------------------------------------------
-- 5) Admin withdrawal approval/rejection: lock the withdrawal row. Reject
--    refunds exactly once; approve changes status exactly once.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_process_withdrawal(
  p_withdrawal_id TEXT,
  p_decision TEXT,
  p_reason TEXT,
  p_tx_hash TEXT,
  p_operator_id TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  w RECORD;
  wallet RECORD;
  cur_balance NUMERIC;
  new_balance NUMERIC;
  now_utc TIMESTAMPTZ := NOW();
  decision TEXT := UPPER(TRIM(p_decision));
BEGIN
  SELECT * INTO w FROM public.withdrawals WHERE id=p_withdrawal_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success',false,'error_code','NOT_FOUND','message','Withdrawal record not found in Supabase.');
  END IF;

  IF decision='APPROVE' THEN
    IF UPPER(COALESCE(w.status,'REQUESTED'))='COMPLETED' THEN
      RETURN jsonb_build_object('success',true,'already_processed',true,'withdrawal_id',p_withdrawal_id,'status','COMPLETED','tx_hash',w.tx_hash);
    END IF;
    IF UPPER(COALESCE(w.status,'REQUESTED'))='REJECTED' THEN
      RETURN jsonb_build_object('success',false,'error_code','WITHDRAWAL_ALREADY_PROCESSED','message','This withdrawal has already been rejected.');
    END IF;

    UPDATE public.withdrawals
    SET status='COMPLETED',tx_hash=p_tx_hash,approved_by=p_operator_id,reviewed_by=p_operator_id,updated_at=now_utc
    WHERE id=p_withdrawal_id;

    INSERT INTO public.user_notifications(id,user_id,type,title,message,is_read,created_at)
    VALUES(
      'notif_'||md5(random()::text || clock_timestamp()::text || pg_backend_pid()::text),w.user_id,'WITHDRAWAL_COMPLETED','Withdrawal Dispatched',
      format('Your withdrawal of %s %s has been broadcast to the blockchain. Transaction ID: %s',w.amount,UPPER(w.asset),p_tx_hash),0,now_utc
    );

    RETURN jsonb_build_object('success',true,'withdrawal_id',p_withdrawal_id,'status','COMPLETED','tx_hash',p_tx_hash,'processed',true);
  END IF;

  IF decision='REJECT' THEN
    IF UPPER(COALESCE(w.status,'REQUESTED'))='REJECTED' THEN
      RETURN jsonb_build_object('success',true,'already_processed',true,'withdrawal_id',p_withdrawal_id,'status','REJECTED');
    END IF;

    SELECT * INTO wallet FROM public.wallet_balances
    WHERE user_id=w.user_id AND wallet_type='funding' AND asset=UPPER(w.asset)
    FOR UPDATE;
    IF NOT FOUND THEN
      INSERT INTO public.wallet_balances(user_id,wallet_type,asset,balance,available_balance,reserved_balance,promotional_balance,created_at,updated_at)
      VALUES(w.user_id,'funding',UPPER(w.asset),0,0,0,0,now_utc,now_utc)
      ON CONFLICT (user_id,wallet_type,asset) DO NOTHING;
      SELECT * INTO wallet FROM public.wallet_balances
      WHERE user_id=w.user_id AND wallet_type='funding' AND asset=UPPER(w.asset)
      FOR UPDATE;
    END IF;

    cur_balance := COALESCE(wallet.balance,0);
    new_balance := cur_balance + COALESCE(w.amount,0);

    UPDATE public.wallet_balances
    SET balance=new_balance,
        available_balance=COALESCE(wallet.available_balance,cur_balance)+COALESCE(w.amount,0),
        updated_at=now_utc
    WHERE user_id=w.user_id AND wallet_type='funding' AND asset=UPPER(w.asset);

    UPDATE public.withdrawals
    SET status='REJECTED',rejection_reason=p_reason,reviewed_by=p_operator_id,updated_at=now_utc
    WHERE id=p_withdrawal_id;

    INSERT INTO public.ledger_entries(
      user_id,wallet_type,asset,amount,balance_before,balance_after,entry_type,reference_id,description,operator_id,created_at
    ) VALUES(
      w.user_id,'funding',UPPER(w.asset),COALESCE(w.amount,0),cur_balance,new_balance,
      'REFUND',p_withdrawal_id,format('Withdrawal rejected and refunded. Reason: %s',COALESCE(NULLIF(TRIM(p_reason),''),'Declined by financial audit')),p_operator_id,now_utc
    );

    INSERT INTO public.user_notifications(id,user_id,type,title,message,is_read,created_at)
    VALUES(
      'notif_'||md5(random()::text || clock_timestamp()::text || pg_backend_pid()::text),w.user_id,'WITHDRAWAL_REJECTED','Withdrawal Declined & Refunded',
      format('Your withdrawal request for %s %s was declined and refunded to your Funding Wallet.%s',w.amount,UPPER(w.asset),CASE WHEN COALESCE(TRIM(p_reason),'')<>'' THEN ' Reason: '||p_reason ELSE '' END),0,now_utc
    );

    RETURN jsonb_build_object('success',true,'withdrawal_id',p_withdrawal_id,'status','REJECTED','processed',true);
  END IF;

  RETURN jsonb_build_object('success',false,'error_code','INVALID_DECISION','message','Decision must be APPROVE or REJECT.');
END;
$$;

-- ---------------------------------------------------------------------------
-- 6) Keep signal execution single-use at the DB level.
-- ---------------------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS ux_user_signal_executions_user_signal
  ON public.user_signal_executions(user_id,signal_id);

REVOKE ALL ON FUNCTION public.admin_adjust_balance_once(TEXT,TEXT,TEXT,TEXT,TEXT,NUMERIC,TEXT,TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_adjust_balance_once(TEXT,TEXT,TEXT,TEXT,TEXT,NUMERIC,TEXT,TEXT) TO service_role;

REVOKE ALL ON FUNCTION public.submit_deposit_once(TEXT,TEXT,TEXT,TEXT,TEXT,NUMERIC,TEXT,TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_deposit_once(TEXT,TEXT,TEXT,TEXT,TEXT,NUMERIC,TEXT,TEXT) TO service_role;

REVOKE ALL ON FUNCTION public.submit_withdrawal_once(TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,NUMERIC,NUMERIC) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_withdrawal_once(TEXT,TEXT,TEXT,TEXT,TEXT,TEXT,NUMERIC,NUMERIC) TO service_role;

REVOKE ALL ON FUNCTION public.admin_process_deposit(TEXT,TEXT,TEXT,TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_process_deposit(TEXT,TEXT,TEXT,TEXT) TO service_role;

REVOKE ALL ON FUNCTION public.admin_process_withdrawal(TEXT,TEXT,TEXT,TEXT,TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_process_withdrawal(TEXT,TEXT,TEXT,TEXT,TEXT) TO service_role;

COMMIT;
