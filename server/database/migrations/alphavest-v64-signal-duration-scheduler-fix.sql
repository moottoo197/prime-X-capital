-- AlphaVest v64: preserve the configured signal duration in the automatic
-- expiry/archive/next-day scheduler. Run ONCE in Supabase SQL Editor.
BEGIN;

CREATE OR REPLACE FUNCTION public.alphavest_cleanup_signals()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  s RECORD;
  next_start TIMESTAMPTZ;
  next_end TIMESTAMPTZ;
  next_id TEXT;
  signal_duration INTEGER;
BEGIN
  -- Expire each signal using its own saved expiry timestamp.
  UPDATE public.trading_signals
  SET status = 'EXPIRED'
  WHERE expires_at IS NOT NULL
    AND expires_at <= NOW()
    AND UPPER(COALESCE(status, '')) IN ('PUBLISHED','ACTIVE','SCHEDULED');

  FOR s IN
    SELECT *
    FROM public.trading_signals
    WHERE expires_at IS NOT NULL
      AND expires_at <= NOW() - INTERVAL '2 hours'
  LOOP
    INSERT INTO public.trading_signal_history(
      id,symbol,direction,entry_price_min,entry_price_max,target_price_1,target_price_2,
      stop_loss,status,duration_minutes,daily_slot,profit_percentage,timezone_label,
      scheduled_at,published_at,expires_at,created_at,archived_at,archive_reason
    ) VALUES (
      s.id,s.symbol,s.direction,s.entry_price_min,s.entry_price_max,s.target_price_1,s.target_price_2,
      s.stop_loss,s.status,COALESCE(s.duration_minutes,15),s.daily_slot,s.profit_percentage,s.timezone_label,
      s.scheduled_at,s.published_at,s.expires_at,s.created_at,NOW(),'EXPIRED_2_HOURS'
    )
    ON CONFLICT (id) DO NOTHING;

    IF COALESCE(s.daily_slot,0) IN (1,2) THEN
      signal_duration := GREATEST(1, COALESCE(s.duration_minutes,15));
      next_start := (
        DATE_TRUNC('day', ((COALESCE(s.scheduled_at,s.published_at) AT TIME ZONE 'Asia/Karachi') + INTERVAL '1 day'))
        + CASE WHEN s.daily_slot = 2 THEN INTERVAL '20 hours' ELSE INTERVAL '16 hours' END
      ) AT TIME ZONE 'Asia/Karachi';
      next_end := next_start + make_interval(mins => signal_duration);
      next_id := 'sig_daily_' || TO_CHAR(next_start AT TIME ZONE 'Asia/Karachi','YYYYMMDD') || '_' || s.daily_slot;

      INSERT INTO public.trading_signals(
        id,symbol,direction,entry_price_min,entry_price_max,target_price_1,target_price_2,
        stop_loss,status,duration_minutes,daily_slot,profit_percentage,timezone_label,
        scheduled_at,published_at,expires_at,created_at
      ) VALUES (
        next_id,s.symbol,s.direction,s.entry_price_min,s.entry_price_max,s.target_price_1,s.target_price_2,
        s.stop_loss,'SCHEDULED',signal_duration,s.daily_slot,s.profit_percentage,COALESCE(s.timezone_label,'PKT'),
        next_start,next_start,next_end,NOW()
      )
      ON CONFLICT (id) DO NOTHING;
    END IF;

    BEGIN
      DELETE FROM public.trading_signals WHERE id = s.id;
    EXCEPTION WHEN foreign_key_violation THEN
      NULL;
    END;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.alphavest_cleanup_signals() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.alphavest_cleanup_signals() TO service_role;

COMMIT;
