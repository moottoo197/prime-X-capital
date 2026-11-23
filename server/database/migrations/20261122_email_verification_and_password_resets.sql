-- Prime X Capital: Email Verification & Single-Use Password Reset Tokens
-- Run in Supabase SQL Editor. Idempotent & RLS-locked for server-side service role access only.

BEGIN;

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS email_verified INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ NULL;

CREATE TABLE IF NOT EXISTS public.email_verification_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    email TEXT NOT NULL,
    token_hash TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_verification_user
    ON public.email_verification_tokens(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_verification_expires
    ON public.email_verification_tokens(expires_at);

CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    email TEXT NOT NULL,
    token_hash TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_user
    ON public.password_reset_tokens(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_password_reset_expires
    ON public.password_reset_tokens(expires_at);

-- Lock direct anon/authenticated PostgREST access (PHP API uses service_role).
ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.email_verification_tokens FROM anon, authenticated;

ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.password_reset_tokens FROM anon, authenticated;

COMMIT;
