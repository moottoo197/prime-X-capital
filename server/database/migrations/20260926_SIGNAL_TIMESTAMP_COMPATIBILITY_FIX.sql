-- Alphavest: timestamp-type compatibility fix for signal execution.
-- Run this once in Supabase SQL Editor after the previous Alphavest migrations.
-- This fixes databases where published_at/scheduled_at/expires_at were created
-- with different physical types (e.g. TEXT vs TIMESTAMPTZ).

BEGIN;

CREATE OR REPLACE FUNCTION public.execute_alphavest_signal(p_signal_id TEXT, p_user_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sig RECORD;
  wallet RECORD;
  exec_id TEXT;
  stake NUMERIC;
  profit_pct NUMERIC;
  profit_amt NUMERIC;
  new_bal NUMERIC;
  inserted_id TEXT;
  now_utc TIMESTAMPTZ := NOW();
  start_at TIMESTAMPTZ;
  end_at TIMESTAMPTZ;
  slot_value INTEGER;
BEGIN
  SELECT * INTO sig
  FROM public.trading_signals
  WHERE id = p_signal_id
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success',false,'error_code','SIGNAL_NOT_FOUND','message','Signal not found.');
  END IF;

  -- Cast through TEXT first so this works whether the existing columns are
  -- TEXT, TIMESTAMP, or TIMESTAMPTZ. Never COALESCE unlike PostgreSQL types.
  start_at := CASE
    WHEN NULLIF(sig.published_at::text,'') IS NOT NULL
      THEN NULLIF(sig.published_at::text,'')::TIMESTAMPTZ
    WHEN NULLIF(sig.scheduled_at::text,'') IS NOT NULL
      THEN NULLIF(sig.scheduled_at::text,'')::TIMESTAMPTZ
    ELSE NULL
  END;

  end_at := CASE
    WHEN NULLIF(sig.expires_at::text,'') IS NOT NULL
      THEN NULLIF(sig.expires_at::text,'')::TIMESTAMPTZ
    WHEN start_at IS NOT NULL
      THEN start_at + INTERVAL '15 minutes'
    ELSE NULL
  END;

  IF start_at IS NULL OR now_utc < start_at OR now_utc >= end_at THEN
    RETURN jsonb_build_object(
      'success',false,
      'error_code','SIGNAL_NOT_LIVE',
      'message','This signal is outside its 15-minute confirmation window.'
    );
  END IF;

  slot_value := COALESCE(NULLIF(sig.daily_slot::text,'')::INTEGER,0);
  IF slot_value NOT IN (0,1,2) THEN
    RETURN jsonb_build_object(
      'success',false,
      'error_code','SIGNAL_NOT_SCHEDULED',
      'message','Signal is not assigned to a valid session.'
    );
  END IF;

  exec_id := 'sig_exec_' || md5(random()::text || clock_timestamp()::text || pg_backend_pid()::text);
  profit_pct := GREATEST(COALESCE(NULLIF(sig.profit_percentage::text,'')::NUMERIC,2.5),0.1);

  INSERT INTO public.user_signal_executions
    (id,user_id,signal_id,symbol,direction,stake_amount,profit_percentage,profit_amount,status,executed_at,created_at)
  VALUES
    (exec_id,p_user_id,p_signal_id,COALESCE(NULLIF(sig.symbol::text,''),'USDT'),COALESCE(NULLIF(sig.direction::text,''),'BUY'),0,profit_pct,0,'COMPLETED',now_utc,now_utc)
  ON CONFLICT (user_id,signal_id) DO NOTHING
  RETURNING id INTO inserted_id;

  IF inserted_id IS NULL THEN
    RETURN jsonb_build_object(
      'success',false,
      'error_code','SIGNAL_ALREADY_USED',
      'message','Each user can confirm a signal one time only.'
    );
  END IF;

  SELECT * INTO wallet
  FROM public.wallet_balances
  WHERE user_id=p_user_id AND wallet_type='trading' AND asset='USDT'
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.wallet_balances
      (user_id,wallet_type,asset,balance,available_balance,reserved_balance,promotional_balance,created_at,updated_at)
    VALUES
      (p_user_id,'trading','USDT',0,0,0,0,now_utc,now_utc);

    SELECT * INTO wallet
    FROM public.wallet_balances
    WHERE user_id=p_user_id AND wallet_type='trading' AND asset='USDT'
    FOR UPDATE;
  END IF;

  stake := GREATEST(COALESCE(wallet.balance,0),20);
  profit_amt := ROUND(stake * profit_pct / 100,2);
  new_bal := COALESCE(wallet.balance,0) + profit_amt;

  UPDATE public.wallet_balances
  SET balance=new_bal,available_balance=new_bal,updated_at=now_utc
  WHERE user_id=p_user_id AND wallet_type='trading' AND asset='USDT';

  UPDATE public.user_signal_executions
  SET stake_amount=stake,profit_amount=profit_amt
  WHERE id=exec_id;

  INSERT INTO public.ledger_entries
    (user_id,wallet_type,asset,amount,balance_before,balance_after,entry_type,reference_id,description,created_at)
  VALUES
    (p_user_id,'trading','USDT',profit_amt,COALESCE(wallet.balance,0),new_bal,'TRADE_PNL',exec_id,
     'Yield settlement for signal ' || p_signal_id || ' (+' || profit_pct || '%)',now_utc);

  RETURN jsonb_build_object(
    'success',true,
    'execution_id',exec_id,
    'signal_id',p_signal_id,
    'symbol',COALESCE(NULLIF(sig.symbol::text,''),'USDT'),
    'direction',COALESCE(NULLIF(sig.direction::text,''),'BUY'),
    'stake_amount',stake,
    'profit_amount',profit_amt,
    'profit_percentage',profit_pct,
    'new_trading_balance',new_bal
  );
END;
$$;

REVOKE ALL ON FUNCTION public.execute_alphavest_signal(TEXT,TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.execute_alphavest_signal(TEXT,TEXT) TO service_role;
NOTIFY pgrst, 'reload schema';

COMMIT;
