-- Alphavest production migration: country persistence + signal scheduling/execution.
-- Run once in Supabase SQL Editor before deploying the patched PHP files.
BEGIN;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Karachi';
ALTER TABLE public.trading_signals ADD COLUMN IF NOT EXISTS daily_slot INTEGER DEFAULT 1;
ALTER TABLE public.trading_signals ADD COLUMN IF NOT EXISTS profit_percentage NUMERIC DEFAULT 2.5;
ALTER TABLE public.trading_signals ADD COLUMN IF NOT EXISTS timezone_label TEXT DEFAULT 'PKT (UTC+5)';
ALTER TABLE public.trading_signals ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
ALTER TABLE public.trading_signals ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 15;

UPDATE public.trading_signals SET duration_minutes = 15 WHERE duration_minutes IS NULL OR duration_minutes <= 0;
UPDATE public.trading_signals SET daily_slot = 1 WHERE daily_slot IS NULL OR daily_slot NOT IN (1,2);

-- Remove only execution rows whose signal no longer exists, then replace any legacy
-- institutional_signals FK with the correct trading_signals FK.
DELETE FROM public.user_signal_executions e
WHERE NOT EXISTS (SELECT 1 FROM public.trading_signals s WHERE s.id = e.signal_id);

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT DISTINCT tc.constraint_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
    WHERE tc.table_schema='public' AND tc.table_name='user_signal_executions'
      AND tc.constraint_type='FOREIGN KEY' AND ccu.table_name='institutional_signals'
  LOOP
    EXECUTE format('ALTER TABLE public.user_signal_executions DROP CONSTRAINT IF EXISTS %I', r.constraint_name);
  END LOOP;
END $$;

ALTER TABLE public.user_signal_executions
  DROP CONSTRAINT IF EXISTS user_signal_executions_signal_id_fkey;
ALTER TABLE public.user_signal_executions
  ADD CONSTRAINT user_signal_executions_signal_id_fkey
  FOREIGN KEY (signal_id) REFERENCES public.trading_signals(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS ux_user_signal_executions_user_signal
  ON public.user_signal_executions(user_id, signal_id);

-- Atomic signal confirmation: unique execution + wallet credit + ledger entry.
CREATE OR REPLACE FUNCTION public.execute_alphavest_signal(p_user_id TEXT, p_signal_id TEXT)
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
BEGIN
  SELECT * INTO sig FROM public.trading_signals WHERE id = p_signal_id LIMIT 1;
  IF NOT FOUND THEN RETURN jsonb_build_object('success',false,'error_code','SIGNAL_NOT_FOUND','message','Signal not found.'); END IF;
  IF COALESCE(sig.daily_slot,0) NOT IN (1,2) THEN RETURN jsonb_build_object('success',false,'error_code','SIGNAL_NOT_SCHEDULED','message','Signal is not assigned to a daily session.'); END IF;

  exec_id := 'sig_exec_' || md5(random()::text || clock_timestamp()::text || pg_backend_pid()::text);
  profit_pct := GREATEST(COALESCE(sig.profit_percentage,2.5),0.1);

  -- Insert first. The unique index makes concurrent duplicate confirmations fail safely.
  INSERT INTO public.user_signal_executions
    (id,user_id,signal_id,symbol,direction,stake_amount,profit_percentage,profit_amount,executed_at,created_at)
  VALUES
    (exec_id,p_user_id,p_signal_id,COALESCE(sig.symbol,'USDT'),COALESCE(sig.direction,'BUY'),0,profit_pct,0,NOW(),NOW())
  ON CONFLICT (user_id,signal_id) DO NOTHING
  RETURNING id INTO inserted_id;

  IF inserted_id IS NULL THEN
    RETURN jsonb_build_object('success',false,'error_code','SIGNAL_ALREADY_USED','message','Each user can confirm a signal one time only.');
  END IF;

  SELECT * INTO wallet FROM public.wallet_balances
  WHERE user_id=p_user_id AND wallet_type='trading' AND asset='USDT'
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.wallet_balances(user_id,wallet_type,asset,balance,available_balance,reserved_balance,promotional_balance,created_at,updated_at)
    VALUES(p_user_id,'trading','USDT',0,0,0,0,NOW(),NOW());
    SELECT * INTO wallet FROM public.wallet_balances
    WHERE user_id=p_user_id AND wallet_type='trading' AND asset='USDT' FOR UPDATE;
  END IF;

  stake := GREATEST(COALESCE(wallet.balance,0),20);
  profit_amt := ROUND(stake * profit_pct / 100, 2);
  new_bal := COALESCE(wallet.balance,0) + profit_amt;

  UPDATE public.wallet_balances
  SET balance=new_bal, available_balance=new_bal, updated_at=NOW()
  WHERE user_id=p_user_id AND wallet_type='trading' AND asset='USDT';

  UPDATE public.user_signal_executions
  SET stake_amount=stake, profit_amount=profit_amt
  WHERE id=exec_id;

  INSERT INTO public.ledger_entries
    (user_id,wallet_type,asset,amount,balance_before,balance_after,entry_type,reference_id,description,created_at)
  VALUES
    (p_user_id,'trading','USDT',profit_amt,COALESCE(wallet.balance,0),new_bal,'TRADE_PNL',exec_id,
     'Yield settlement for signal ' || p_signal_id || ' (+' || profit_pct || '%)',NOW());

  RETURN jsonb_build_object('success',true,'execution_id',exec_id,'profit_amount',profit_amt,
    'profit_percentage',profit_pct,'new_trading_balance',new_bal);
END;
$$;

REVOKE ALL ON FUNCTION public.execute_alphavest_signal(TEXT,TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.execute_alphavest_signal(TEXT,TEXT) TO service_role;

COMMIT;
