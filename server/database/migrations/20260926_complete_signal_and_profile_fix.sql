-- Alphavest complete profile + signal fix. Run once in Supabase SQL Editor.
BEGIN;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Karachi';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS withdrawal_pin TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS withdrawal_pin_hash TEXT;
ALTER TABLE public.trading_signals ADD COLUMN IF NOT EXISTS daily_slot INTEGER DEFAULT 1;
ALTER TABLE public.trading_signals ADD COLUMN IF NOT EXISTS profit_percentage NUMERIC DEFAULT 2.5;
ALTER TABLE public.trading_signals ADD COLUMN IF NOT EXISTS timezone_label TEXT DEFAULT 'PKT (UTC+5)';
ALTER TABLE public.trading_signals ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
ALTER TABLE public.trading_signals ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE public.trading_signals ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE public.trading_signals ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 15;
CREATE TABLE IF NOT EXISTS public.user_signal_executions (
 id TEXT PRIMARY KEY,user_id TEXT NOT NULL,signal_id TEXT NOT NULL,symbol TEXT NOT NULL DEFAULT 'USDT',direction TEXT NOT NULL DEFAULT 'BUY',stake_amount NUMERIC NOT NULL DEFAULT 0,profit_percentage NUMERIC NOT NULL DEFAULT 2.5,profit_amount NUMERIC NOT NULL DEFAULT 0,status TEXT NOT NULL DEFAULT 'COMPLETED',executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX IF NOT EXISTS idx_user_signal_executions_user ON public.user_signal_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_signal_executions_signal ON public.user_signal_executions(signal_id);
DELETE FROM public.user_signal_executions e WHERE NOT EXISTS (SELECT 1 FROM public.trading_signals s WHERE s.id=e.signal_id);
ALTER TABLE public.user_signal_executions DROP CONSTRAINT IF EXISTS user_signal_executions_signal_id_fkey;
ALTER TABLE public.user_signal_executions ADD CONSTRAINT user_signal_executions_signal_id_fkey FOREIGN KEY(signal_id) REFERENCES public.trading_signals(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX IF NOT EXISTS ux_user_signal_executions_user_signal ON public.user_signal_executions(user_id,signal_id);
CREATE OR REPLACE FUNCTION public.execute_alphavest_signal(p_user_id TEXT,p_signal_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE sig RECORD; wallet RECORD; exec_id TEXT; stake NUMERIC; profit_pct NUMERIC; profit_amt NUMERIC; new_bal NUMERIC; inserted_id TEXT; now_utc TIMESTAMPTZ:=NOW(); start_at TIMESTAMPTZ; end_at TIMESTAMPTZ;
BEGIN
 SELECT * INTO sig FROM public.trading_signals WHERE id=p_signal_id LIMIT 1;
 IF NOT FOUND THEN RETURN jsonb_build_object('success',false,'error_code','SIGNAL_NOT_FOUND','message','Signal not found.'); END IF;
 start_at := CASE
    WHEN NULLIF(sig.published_at::text,'') IS NOT NULL THEN NULLIF(sig.published_at::text,'')::TIMESTAMPTZ
    WHEN NULLIF(sig.scheduled_at::text,'') IS NOT NULL THEN NULLIF(sig.scheduled_at::text,'')::TIMESTAMPTZ
    ELSE NULL
  END;
  end_at := CASE
    WHEN NULLIF(sig.expires_at::text,'') IS NOT NULL THEN NULLIF(sig.expires_at::text,'')::TIMESTAMPTZ
    WHEN start_at IS NOT NULL THEN start_at + INTERVAL '15 minutes'
    ELSE NULL
  END;
 IF start_at IS NULL OR now_utc<start_at OR now_utc>=end_at THEN RETURN jsonb_build_object('success',false,'error_code','SIGNAL_NOT_LIVE','message','This signal is outside its 15-minute confirmation window.'); END IF;
 IF COALESCE(sig.daily_slot,0) NOT IN(0,1,2) THEN RETURN jsonb_build_object('success',false,'error_code','SIGNAL_NOT_SCHEDULED','message','Signal is not assigned to a valid session.'); END IF;
 exec_id:='sig_exec_'||md5(random()::text || clock_timestamp()::text || pg_backend_pid()::text); profit_pct:=GREATEST(COALESCE(sig.profit_percentage,2.5),0.1);
 INSERT INTO public.user_signal_executions(id,user_id,signal_id,symbol,direction,stake_amount,profit_percentage,profit_amount,status,executed_at,created_at)
 VALUES(exec_id,p_user_id,p_signal_id,COALESCE(sig.symbol,'USDT'),COALESCE(sig.direction,'BUY'),0,profit_pct,0,'COMPLETED',now_utc,now_utc)
 ON CONFLICT(user_id,signal_id) DO NOTHING RETURNING id INTO inserted_id;
 IF inserted_id IS NULL THEN RETURN jsonb_build_object('success',false,'error_code','SIGNAL_ALREADY_USED','message','Each user can confirm a signal one time only.'); END IF;
 SELECT * INTO wallet FROM public.wallet_balances WHERE user_id=p_user_id AND wallet_type='trading' AND asset='USDT' FOR UPDATE;
 IF NOT FOUND THEN INSERT INTO public.wallet_balances(user_id,wallet_type,asset,balance,available_balance,reserved_balance,promotional_balance,created_at,updated_at) VALUES(p_user_id,'trading','USDT',0,0,0,0,now_utc,now_utc); SELECT * INTO wallet FROM public.wallet_balances WHERE user_id=p_user_id AND wallet_type='trading' AND asset='USDT' FOR UPDATE; END IF;
 stake:=GREATEST(COALESCE(wallet.balance,0),20); profit_amt:=ROUND(stake*profit_pct/100,2); new_bal:=COALESCE(wallet.balance,0)+profit_amt;
 UPDATE public.wallet_balances SET balance=new_bal,available_balance=new_bal,updated_at=now_utc WHERE user_id=p_user_id AND wallet_type='trading' AND asset='USDT';
 UPDATE public.user_signal_executions SET stake_amount=stake,profit_amount=profit_amt WHERE id=exec_id;
 INSERT INTO public.ledger_entries(user_id,wallet_type,asset,amount,balance_before,balance_after,entry_type,reference_id,description,created_at) VALUES(p_user_id,'trading','USDT',profit_amt,COALESCE(wallet.balance,0),new_bal,'TRADE_PNL',exec_id,'Yield settlement for signal '||p_signal_id||' (+'||profit_pct||'%)',now_utc);
 RETURN jsonb_build_object('success',true,'execution_id',exec_id,'signal_id',p_signal_id,'symbol',COALESCE(sig.symbol,'USDT'),'direction',COALESCE(sig.direction,'BUY'),'stake_amount',stake,'profit_amount',profit_amt,'profit_percentage',profit_pct,'new_trading_balance',new_bal);
END;$$;
REVOKE ALL ON FUNCTION public.execute_alphavest_signal(TEXT,TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.execute_alphavest_signal(TEXT,TEXT) TO service_role;
NOTIFY pgrst,'reload schema';
COMMIT;
