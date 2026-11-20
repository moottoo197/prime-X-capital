-- AlphaVest signal profit principal + reconciliation fix (v75)
-- Run ONCE in Supabase SQL Editor after deploying the matching PHP package.
--
-- Profit principal is funded capital only:
--   1) COMPLETED deposits
--   2) net Admin Financial Adjustments (entry_type = ADJUSTMENT)
-- Referral commissions/bonuses and prior signal profits (TRADE_PNL) are excluded.
-- The principal is capped at the user's current total USDT balance so a user cannot
-- earn profit on capital that is no longer present in the account.

BEGIN;


-- Store confirmation-time snapshots for the Admin User/Signal Detail views.
-- Existing rows remain untouched; new confirmations populate these fields from
-- the server-side execution flow.
ALTER TABLE public.user_signal_executions
  ADD COLUMN IF NOT EXISTS principal_balance NUMERIC(20,8),
  ADD COLUMN IF NOT EXISTS balance_before NUMERIC(20,8),
  ADD COLUMN IF NOT EXISTS balance_after NUMERIC(20,8);

CREATE OR REPLACE FUNCTION public.calculate_signal_profit_principal(p_user_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  completed_deposits NUMERIC := 0;
  admin_adjustments NUMERIC := 0;
  current_balance NUMERIC := 0;
  principal_amount NUMERIC := 0;
BEGIN
  IF COALESCE(TRIM(p_user_id), '') = '' THEN
    RAISE EXCEPTION 'INVALID_USER_ID';
  END IF;

  SELECT COALESCE(SUM(COALESCE(amount, 0)), 0)
    INTO completed_deposits
  FROM public.deposits
  WHERE user_id::text = p_user_id
    AND UPPER(COALESCE(status, '')) = 'COMPLETED';

  SELECT COALESCE(SUM(COALESCE(amount, 0)), 0)
    INTO admin_adjustments
  FROM public.ledger_entries
  WHERE user_id::text = p_user_id
    AND UPPER(COALESCE(entry_type, '')) = 'ADJUSTMENT'
    AND UPPER(COALESCE(asset, 'USDT')) = 'USDT';

  SELECT COALESCE(SUM(GREATEST(COALESCE(balance, 0), 0)), 0)
    INTO current_balance
  FROM public.wallet_balances
  WHERE user_id::text = p_user_id
    AND UPPER(COALESCE(asset, 'USDT')) = 'USDT';

  principal_amount := GREATEST(0, LEAST(current_balance, completed_deposits + admin_adjustments));

  RETURN jsonb_build_object(
    'success', true,
    'completed_deposits', ROUND(completed_deposits, 2),
    'admin_adjustments_net', ROUND(admin_adjustments, 2),
    'current_balance', ROUND(current_balance, 2),
    'principal_amount', ROUND(principal_amount, 2)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.calculate_signal_profit_principal(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.calculate_signal_profit_principal(TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.reconcile_signal_profit_once(
  p_user_id TEXT,
  p_signal_id TEXT,
  p_amount NUMERIC,
  p_profit_percentage NUMERIC DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  wallet RECORD;
  before_balance NUMERIC;
  after_balance NUMERIC;
  ledger_id BIGINT;
  ref_id TEXT;
  now_utc TIMESTAMPTZ := NOW();
  existing RECORD;
BEGIN
  IF COALESCE(TRIM(p_user_id), '') = '' OR COALESCE(TRIM(p_signal_id), '') = '' THEN
    RAISE EXCEPTION 'INVALID_SIGNAL_PROFIT_RECONCILIATION';
  END IF;
  IF COALESCE(p_amount, 0) <= 0 THEN
    RETURN jsonb_build_object('success', true, 'credited_amount', 0, 'already_processed', true);
  END IF;

  ref_id := 'sig_profit_reconcile:' || p_signal_id || ':' || p_user_id;

  SELECT id, amount INTO existing
  FROM public.ledger_entries
  WHERE entry_type = 'TRADE_PNL'
    AND reference_id = ref_id
  ORDER BY id DESC
  LIMIT 1;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', true,
      'credited_amount', COALESCE(existing.amount, 0),
      'already_processed', true,
      'ledger_id', existing.id
    );
  END IF;

  SELECT * INTO wallet
  FROM public.wallet_balances
  WHERE user_id = p_user_id
    AND wallet_type = 'trading'
    AND asset = 'USDT'
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.wallet_balances(
      user_id, wallet_type, asset, balance, available_balance,
      reserved_balance, promotional_balance, created_at, updated_at
    ) VALUES (
      p_user_id, 'trading', 'USDT', 0, 0, 0, 0, now_utc, now_utc
    ) ON CONFLICT (user_id, wallet_type, asset) DO NOTHING;

    SELECT * INTO wallet
    FROM public.wallet_balances
    WHERE user_id = p_user_id
      AND wallet_type = 'trading'
      AND asset = 'USDT'
    FOR UPDATE;
  END IF;

  before_balance := COALESCE(wallet.balance, 0);
  after_balance := before_balance + p_amount;

  UPDATE public.wallet_balances
  SET balance = after_balance,
      available_balance = after_balance,
      updated_at = now_utc
  WHERE user_id = p_user_id
    AND wallet_type = 'trading'
    AND asset = 'USDT';

  INSERT INTO public.ledger_entries(
    user_id, wallet_type, asset, amount, balance_before, balance_after,
    entry_type, reference_id, description, created_at
  ) VALUES (
    p_user_id, 'trading', 'USDT', p_amount, before_balance, after_balance,
    'TRADE_PNL', ref_id,
    'Signal ' || p_signal_id || ' funded-capital profit reconciliation (' ||
      trim(to_char(COALESCE(p_profit_percentage, 0), 'FM999990.##')) || '%; referral bonuses and prior PNL excluded from principal)',
    now_utc
  ) RETURNING id INTO ledger_id;

  RETURN jsonb_build_object(
    'success', true,
    'credited_amount', round(p_amount, 2),
    'already_processed', false,
    'ledger_id', ledger_id
  );
END;
$$;

REVOKE ALL ON FUNCTION public.reconcile_signal_profit_once(TEXT, TEXT, NUMERIC, NUMERIC) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reconcile_signal_profit_once(TEXT, TEXT, NUMERIC, NUMERIC) TO service_role;

COMMIT;
