-- AlphaVest v82 + v83 COMBINED SQL MIGRATION
-- Run this ONE time in Supabase SQL Editor after deploying v83.
--
-- v82: principal-based daily signal profit calculation.
-- v83: restricts the principal to REAL approved/completed deposits
--      plus admin adjustments explicitly marked [DEPOSIT].
--
-- Final rule after this migration:
--   Principal = approved/completed deposits + [DEPOSIT] admin adjustments
--   Referral bonuses, profit adjustments, other adjustments, and TRADE_PNL
--   are excluded from the signal-profit principal.
--
-- The v83 definition intentionally replaces the v82 definition, so there is
-- no need to run v82 separately when using this combined migration.

BEGIN;

-- ============================================================
-- V82 BASE: principal-based signal profit helper
-- ============================================================
-- This establishes the principal calculation function used by the
-- signal execution/reconciliation logic.

CREATE OR REPLACE FUNCTION public.calculate_signal_profit_principal(p_user_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  funded_deposits NUMERIC := 0;
  admin_adjustments NUMERIC := 0;
  principal_amount NUMERIC := 0;
BEGIN
  IF COALESCE(TRIM(p_user_id), '') = '' THEN
    RAISE EXCEPTION 'INVALID_USER_ID';
  END IF;

  SELECT COALESCE(SUM(COALESCE(amount, 0)), 0)
    INTO funded_deposits
  FROM public.deposits
  WHERE user_id::text = p_user_id
    AND UPPER(COALESCE(status, '')) IN ('COMPLETED', 'APPROVED', 'CONFIRMED');

  SELECT COALESCE(SUM(COALESCE(amount, 0)), 0)
    INTO admin_adjustments
  FROM public.ledger_entries
  WHERE user_id::text = p_user_id
    AND UPPER(COALESCE(entry_type, '')) = 'ADJUSTMENT'
    AND UPPER(COALESCE(asset, 'USDT')) = 'USDT';

  principal_amount := GREATEST(0, funded_deposits + admin_adjustments);

  RETURN jsonb_build_object(
    'success', true,
    'completed_deposits', ROUND(funded_deposits, 2),
    'admin_adjustments_net', ROUND(admin_adjustments, 2),
    'current_balance', NULL,
    'principal_amount', ROUND(principal_amount, 2)
  );
END;
$$;

-- ============================================================
-- V83 FINAL OVERRIDE: DEPOSIT-ONLY principal
-- ============================================================
-- Only normal deposits and admin adjustments explicitly tagged
-- [DEPOSIT] count toward the signal-profit principal.
-- Referral Bonus, Profit, Other, and TRADE_PNL are excluded.

CREATE OR REPLACE FUNCTION public.calculate_signal_profit_principal(p_user_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  funded_deposits NUMERIC := 0;
  deposit_adjustments NUMERIC := 0;
  principal_amount NUMERIC := 0;
BEGIN
  IF COALESCE(TRIM(p_user_id), '') = '' THEN
    RAISE EXCEPTION 'INVALID_USER_ID';
  END IF;

  SELECT COALESCE(SUM(COALESCE(amount, 0)), 0)
    INTO funded_deposits
  FROM public.deposits
  WHERE user_id::text = p_user_id
    AND UPPER(COALESCE(status, '')) IN ('COMPLETED', 'APPROVED', 'CONFIRMED');

  SELECT COALESCE(SUM(COALESCE(amount, 0)), 0)
    INTO deposit_adjustments
  FROM public.ledger_entries
  WHERE user_id::text = p_user_id
    AND UPPER(COALESCE(entry_type, '')) = 'ADJUSTMENT'
    AND UPPER(COALESCE(asset, 'USDT')) = 'USDT'
    AND UPPER(COALESCE(description, '')) LIKE '[DEPOSIT]%';

  principal_amount := GREATEST(0, funded_deposits + deposit_adjustments);

  RETURN jsonb_build_object(
    'success', true,
    'completed_deposits', ROUND(funded_deposits, 2),
    'deposit_adjustments', ROUND(deposit_adjustments, 2),
    'principal_amount', ROUND(principal_amount, 2)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.calculate_signal_profit_principal(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.calculate_signal_profit_principal(TEXT) TO service_role;

COMMIT;

-- Verification query (optional):
-- SELECT public.calculate_signal_profit_principal('<USER_ID>');
