# Alphavest Backend (`/server`)

Private PHP backend configuration, core services, database schemas/migrations, cron dispatchers, and protected storage for Hostinger deployment.

> **Security Note:** This `/server` directory MUST stay **outside** `public_html` (the web document root). On Hostinger, upload `public_html/` contents into your domain's `public_html/` directory and upload `server/` one level above it (alongside `public_html/`), then copy `/server/.env.example` to `/server/.env` and fill in your credentials.

## Environment Setup (`.env`)

1. Copy `.env.example` to `.env` inside `/server/.env` (or in the parent directory above `public_html/`).
2. Configure the required keys loaded by `/server/config.php`:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `APP_SECRET`
   - `ADMIN_EMAILS`, `ADMIN_MASTER_PASSWORD`
   - `ALLOWED_ORIGINS`
   - `CRON_SECRET`

## Directory Structure

- `config.php` — Loads `.env` and defines Supabase, PostgreSQL, CORS, and Admin constants.
- `app/` — Core PHP domain classes (`Auth.php`, `AuditLogger.php`, `Database.php`, `Idempotency.php`, `Ledger.php`, `SupabaseClient.php`) and `Providers/`.
- `cron/` — Protected scheduled tasks (`publish-signals.php`, `process-jobs.php`, `reconciliation.php`, `cleanup.php`).
- `database/` — `schema.sql` and incremental SQL migrations for Supabase PostgreSQL.
- `storage/` — Protected private storage (`bound_addresses.json`, `deposit_config_store.json`, blocked via `.htaccess`).
- `.htaccess` — Denies direct HTTP access if the directory is ever placed inside a web root.
