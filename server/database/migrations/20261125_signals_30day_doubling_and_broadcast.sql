-- Prime X Capital: 30-Day Deposit Doubling Signal Rate (1.67% per session x 2 daily = 3.33%/day -> 100% in 30 days)
ALTER TABLE IF EXISTS public.trading_signals
    ALTER COLUMN profit_percentage SET DEFAULT 1.67;

UPDATE public.trading_signals
SET profit_percentage = 1.67
WHERE daily_slot IN (1, 2)
  AND id NOT LIKE 'sig_test_%'
  AND status IN ('SCHEDULED', 'PUBLISHED', 'ACTIVE');
