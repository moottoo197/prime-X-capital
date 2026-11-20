-- Alphavest manual/custom signal execution compatibility patch.
-- Run once in Supabase SQL Editor after the signal-execution migration.

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
  IF COALESCE(sig.daily_slot,0) NOT IN (0,1,2) THEN RETURN jsonb_build_object('success',false,'error_code','SIGNAL_NOT_SCHEDULED','message','Signal is not assigned to a valid session.'); END IF;

  exec_id := 'sig_exec_' || md5(random()::text || clock_timestamp()::text || pg_backend_pid()::text);
  profit_pct := GREATEST(COALESCE(sig.profit_percentage,2.5),0.1);

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

NOTIFY pgrst, 'reload schema';
