-- AlphaVest v83: typed financial adjustments + deposit-only signal principal
-- Run ONCE in Supabase SQL Editor after deploying v83.
-- Principal = approved/completed deposits + Deposit-type admin adjustments.
-- New records use [DEPOSIT]. Legacy admin adjustments with an explicit deposit
-- reason are also recognized; Referral Bonus, Profit, and Other are excluded.

BEGIN;
CREATE OR REPLACE FUNCTION public.calculate_signal_profit_principal(p_user_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  funded_deposits NUMERIC := 0;
  deposit_adjustments NUMERIC := 0;
  principal_amount NUMERIC := 0;
BEGIN
  IF COALESCE(TRIM(p_user_id), '') = '' THEN RAISE EXCEPTION 'INVALID_USER_ID'; END IF;

  SELECT COALESCE(SUM(COALESCE(amount,0)),0) INTO funded_deposits
  FROM public.deposits
  WHERE user_id::text = p_user_id
    AND UPPER(COALESCE(status,'')) IN ('COMPLETED','APPROVED','CONFIRMED');

  SELECT COALESCE(SUM(COALESCE(amount,0)),0) INTO deposit_adjustments
  FROM public.ledger_entries
  WHERE user_id::text = p_user_id
    AND UPPER(COALESCE(entry_type,'')) = 'ADJUSTMENT'
    AND UPPER(COALESCE(asset,'USDT')) = 'USDT'
    AND (
      UPPER(COALESCE(description,'')) LIKE '[DEPOSIT]%'
      OR (
        UPPER(COALESCE(description,'')) NOT LIKE '[REFERRAL_BONUS]%'
        AND UPPER(COALESCE(description,'')) NOT LIKE '[PROFIT]%'
        AND UPPER(COALESCE(description,'')) NOT LIKE '[OTHER]%'
        AND UPPER(COALESCE(description,'')) ~ '\mDEPOSIT\M'
      )
    );

  principal_amount := GREATEST(0, funded_deposits + deposit_adjustments);

  RETURN jsonb_build_object(
    'success', true,
    'completed_deposits', ROUND(funded_deposits,2),
    'deposit_adjustments', ROUND(deposit_adjustments,2),
    'principal_amount', ROUND(principal_amount,2)
  );
END;
$$;
REVOKE ALL ON FUNCTION public.calculate_signal_profit_principal(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.calculate_signal_profit_principal(TEXT) TO service_role;
COMMIT;
