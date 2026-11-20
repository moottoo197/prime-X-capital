-- ALPHAVEST V31
-- 1) Remove any schema dependency on fake dashboard balances (code fix is in V31 ZIP)
-- 2) Add first/last name fields for signup + Settings
-- 3) Keep referral tree data available at L1/L2/L3
-- Safe/idempotent migration for Supabase PostgreSQL.

BEGIN;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Helpful indexes for real referral-tree traversal.
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code_upper
  ON public.profiles (UPPER(TRIM(referral_code)));

CREATE INDEX IF NOT EXISTS idx_profiles_referred_by_upper
  ON public.profiles (UPPER(TRIM(referred_by)));

CREATE INDEX IF NOT EXISTS idx_profiles_email_lower
  ON public.profiles (LOWER(email));

-- Refresh PostgREST schema cache after adding the columns.
SELECT pg_notify('pgrst', 'reload schema');

COMMIT;
