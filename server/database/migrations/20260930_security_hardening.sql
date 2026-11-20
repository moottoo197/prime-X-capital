-- AlphaVest production security hardening
-- Run this migration in Supabase SQL Editor BEFORE enabling the hardened build.

BEGIN;

-- Database-backed withdrawal PIN brute-force protection.
CREATE TABLE IF NOT EXISTS public.security_rate_limits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_rate_limits_user_action
    ON public.security_rate_limits(user_id, action);

-- Enable Row Level Security on every application table. The AlphaVest PHP API
-- uses the Supabase service role server-side, which bypasses RLS; browser code
-- does not receive the service-role key and does not query these tables directly.
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'additional_signal_rewards',
        'admin_audit_logs',
        'approval_requests',
        'copy_trades',
        'copy_trading_plans',
        'deposit_config',
        'deposits',
        'idempotency_keys',
        'internal_transfers',
        'kyc_submissions',
        'ledger_entries',
        'marketing_assets',
        'marketing_claims',
        'markets',
        'orders',
        'permissions',
        'positions',
        'profiles',
        'promotion_rules',
        'promotional_campaigns',
        'referral_rewards',
        'referrals',
        'role_permissions',
        'roles',
        'signal_schedules',
        'support_messages',
        'support_tickets',
        'system_settings',
        'team_levels',
        'trading_signals',
        'user_notifications',
        'user_sessions',
        'user_settings',
        'user_signal_executions',
        'wallet_balances',
        'withdrawals',
        'security_rate_limits'
    ] LOOP
        IF to_regclass('public.' || quote_ident(tbl)) IS NOT NULL THEN
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
        END IF;
    END LOOP;
END $$;

COMMIT;
