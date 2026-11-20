-- AlphaVest v90: ensure expired signal history storage exists.
-- Safe to run once after prior v82-v89 migrations.
BEGIN;

CREATE TABLE IF NOT EXISTS public.trading_signal_history (LIKE public.trading_signals INCLUDING ALL);

ALTER TABLE public.trading_signal_history
  ADD COLUMN IF NOT EXISTS archived_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_trading_signal_history_expires_at
  ON public.trading_signal_history (expires_at DESC);

CREATE INDEX IF NOT EXISTS idx_trading_signal_history_created_at
  ON public.trading_signal_history (created_at DESC);

-- Safety net: any direct deletion of an expired signal is archived first.
-- This covers scheduled cleanup as well as request-time cleanup.
CREATE OR REPLACE FUNCTION public.alphavest_archive_signal_before_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.trading_signal_history
  SELECT OLD.*, now()
  ON CONFLICT (id) DO UPDATE
    SET status = EXCLUDED.status,
        archived_at = EXCLUDED.archived_at;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_alphavest_archive_signal_before_delete ON public.trading_signals;
CREATE TRIGGER trg_alphavest_archive_signal_before_delete
BEFORE DELETE ON public.trading_signals
FOR EACH ROW
WHEN (OLD.expires_at IS NOT NULL AND OLD.expires_at <= now())
EXECUTE FUNCTION public.alphavest_archive_signal_before_delete();

COMMIT;
