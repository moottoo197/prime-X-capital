-- Alphavest Database Schema
-- Compatible with PostgreSQL (Supabase / Cloud SQL) and SQLite

CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    password_hash TEXT,
    role TEXT DEFAULT 'USER',
    is_active INTEGER DEFAULT 1,
    kyc_status TEXT DEFAULT 'NOT_SUBMITTED',
    referral_code TEXT UNIQUE,
    referred_by TEXT,
    withdrawal_pin TEXT,
    withdrawal_pin_hash TEXT,
    two_factor_enabled INTEGER DEFAULT 0,
    two_factor_secret TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    country TEXT,
    timezone TEXT DEFAULT 'Asia/Karachi'
);

CREATE TABLE IF NOT EXISTS user_settings (
    user_id TEXT PRIMARY KEY,
    language TEXT DEFAULT 'en',
    currency TEXT DEFAULT 'USD',
    theme TEXT DEFAULT 'dark',
    notification_email INTEGER DEFAULT 1,
    notification_signals INTEGER DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    country TEXT,
    timezone TEXT DEFAULT 'Asia/Karachi'
);

CREATE TABLE IF NOT EXISTS user_notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user_created
    ON user_notifications(user_id, created_at);

CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS wallet_balances (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    wallet_type TEXT NOT NULL, -- 'funding', 'exchange', 'trading'
    asset TEXT NOT NULL,       -- 'USDT', 'BTC', 'ETH', etc.
    balance REAL DEFAULT 0.0,
    available_balance REAL DEFAULT 0.0,
    reserved_balance REAL DEFAULT 0.0,
    promotional_balance REAL DEFAULT 0.0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, wallet_type, asset)
);

CREATE TABLE IF NOT EXISTS ledger_entries (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    wallet_type TEXT NOT NULL,
    asset TEXT NOT NULL,
    amount REAL NOT NULL,
    balance_before REAL NOT NULL,
    balance_after REAL NOT NULL,
    entry_type TEXT NOT NULL,
    reference_id TEXT,
    description TEXT,
    is_promotional INTEGER DEFAULT 0,
    operator_id TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deposits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    asset TEXT NOT NULL,
    network TEXT NOT NULL,
    amount REAL NOT NULL,
    fee REAL DEFAULT 0.0,
    net_amount REAL NOT NULL,
    deposit_address TEXT NOT NULL,
    tx_hash TEXT,
    status TEXT DEFAULT 'PENDING', -- PENDING, CONFIRMING, COMPLETED, FAILED, REJECTED
    confirmations INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS withdrawals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    asset TEXT NOT NULL,
    network TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    amount REAL NOT NULL,
    fee REAL NOT NULL,
    net_amount REAL NOT NULL,
    status TEXT DEFAULT 'REQUESTED', -- REQUESTED, UNDER_REVIEW, APPROVED, PROCESSING, COMPLETED, FAILED, REJECTED
    tx_hash TEXT,
    reviewed_by TEXT,
    approved_by TEXT,
    rejection_reason TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internal_transfers (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    from_wallet TEXT NOT NULL,
    to_wallet TEXT NOT NULL,
    asset TEXT NOT NULL,
    amount REAL NOT NULL,
    fee REAL DEFAULT 0.0,
    status TEXT DEFAULT 'COMPLETED',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kyc_submissions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    legal_name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    country TEXT NOT NULL,
    address TEXT NOT NULL,
    document_type TEXT NOT NULL,
    document_number TEXT NOT NULL,
    front_doc_path TEXT,
    back_doc_path TEXT,
    selfie_path TEXT,
    holding_id_path TEXT,
    status TEXT DEFAULT 'PENDING', -- NOT_SUBMITTED, PENDING, UNDER_REVIEW, MORE_INFORMATION_REQUIRED, APPROVED, REJECTED
    reviewer_notes TEXT,
    reviewed_by TEXT,
    reviewed_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS markets (
    symbol TEXT PRIMARY KEY,
    base_asset TEXT NOT NULL,
    quote_asset TEXT NOT NULL,
    category TEXT DEFAULT 'HOT', -- HOT, SELF SERVICE, OPTIONS
    is_active INTEGER DEFAULT 1,
    min_order_size REAL DEFAULT 10.0,
    max_leverage INTEGER DEFAULT 100,
    maker_fee REAL DEFAULT 0.0002,
    taker_fee REAL DEFAULT 0.0004
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,        -- BUY (LONG), SELL (SHORT)
    order_type TEXT NOT NULL,  -- MARKET, LIMIT, STOP
    price REAL,
    quantity REAL NOT NULL,
    filled_quantity REAL DEFAULT 0.0,
    leverage INTEGER DEFAULT 10,
    margin REAL NOT NULL,
    status TEXT DEFAULT 'OPEN', -- OPEN, FILLED, PARTIALLY_FILLED, CANCELLED, REJECTED
    provider_order_id TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS positions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,       -- LONG, SHORT
    entry_price REAL NOT NULL,
    current_price REAL NOT NULL,
    quantity REAL NOT NULL,
    leverage INTEGER NOT NULL,
    margin REAL NOT NULL,
    liquidation_price REAL NOT NULL,
    unrealized_pnl REAL DEFAULT 0.0,
    realized_pnl REAL DEFAULT 0.0,
    status TEXT DEFAULT 'OPEN', -- OPEN, CLOSED, LIQUIDATED
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trading_signals (
    id TEXT PRIMARY KEY,
    symbol TEXT NOT NULL,
    direction TEXT NOT NULL, -- BUY (LONG), SELL (SHORT)
    entry_price_min REAL NOT NULL,
    entry_price_max REAL NOT NULL,
    target_price_1 REAL NOT NULL,
    target_price_2 REAL NOT NULL,
    stop_loss REAL NOT NULL,
    status TEXT DEFAULT 'PUBLISHED', -- DRAFT, SCHEDULED, PUBLISHED, EXPIRED, CANCELLED
    duration_minutes INTEGER DEFAULT 15,
    daily_slot INTEGER DEFAULT 1,
    profit_percentage REAL DEFAULT 2.5,
    timezone_label TEXT DEFAULT 'PKT (UTC+5)',
    scheduled_at TEXT,
    published_at TEXT,
    expires_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS copy_trading_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    trader_name TEXT NOT NULL,
    win_rate REAL NOT NULL,
    roi_30d REAL NOT NULL,
    risk_score TEXT DEFAULT 'MODERATE',
    min_balance REAL DEFAULT 50.0,
    max_allocation REAL DEFAULT 10000.0,
    followers_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'ACTIVE',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS copy_trades (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    allocation_percentage REAL NOT NULL,
    allocated_amount REAL NOT NULL,
    current_value REAL NOT NULL,
    pnl REAL DEFAULT 0.0,
    status TEXT DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, CLOSED
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
    id TEXT PRIMARY KEY,
    referrer_id TEXT NOT NULL,
    referred_id TEXT NOT NULL,
    level INTEGER DEFAULT 1, -- 1, 2, 3
    qualification_status TEXT DEFAULT 'QUALIFIED',
    total_commission REAL DEFAULT 0.0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referral_rewards (
    id TEXT PRIMARY KEY,
    referrer_id TEXT NOT NULL,
    referred_id TEXT NOT NULL,
    level INTEGER NOT NULL,
    reward_type TEXT NOT NULL,
    amount REAL NOT NULL,
    ledger_entry_id INTEGER,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_levels (
    level INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    min_team_size INTEGER NOT NULL,
    commission_rate REAL NOT NULL,
    weekly_bonus REAL DEFAULT 0.0,
    active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS support_tickets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    priority TEXT DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    status TEXT DEFAULT 'OPEN',     -- OPEN, IN_PROGRESS, WAITING_FOR_USER, RESOLVED, CLOSED
    assigned_staff TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_messages (
    id TEXT PRIMARY KEY,
    ticket_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    sender_role TEXT NOT NULL,
    message TEXT NOT NULL,
    is_internal INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
    name TEXT PRIMARY KEY,
    description TEXT
);

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role TEXT NOT NULL,
    permission_id INTEGER NOT NULL,
    PRIMARY KEY(role, permission_id)
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id SERIAL PRIMARY KEY,
    actor_id TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    previous_state TEXT,
    new_state TEXT,
    reason TEXT,
    reference_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS approval_requests (
    id TEXT PRIMARY KEY,
    action_type TEXT NOT NULL, -- LARGE_WITHDRAWAL, FINANCIAL_ADJUSTMENT, PRIVILEGE_ESCALATION
    target_id TEXT NOT NULL,
    requested_by TEXT NOT NULL,
    first_approval_by TEXT,
    second_approval_by TEXT,
    status TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS idempotency_keys (
    idempotency_key TEXT NOT NULL,
    user_id TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    status TEXT DEFAULT 'PROCESSING',
    response_payload TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TEXT,
    expires_at TEXT NOT NULL,
    PRIMARY KEY (idempotency_key, user_id)
);

CREATE TABLE IF NOT EXISTS system_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Default Configuration & Permissions
INSERT INTO roles (name, description) VALUES
('SUPER_ADMIN', 'Unrestricted System Authority'),
('ADMIN', 'Full Administrative Operations'),
('FINANCE_MANAGER', 'Treasury, Ledger, Dual Approvals'),
('FINANCE_OPERATOR', 'Deposit and Withdrawal Processing'),
('KYC_MANAGER', 'Identity Verification Management'),
('SIGNAL_MANAGER', 'Trading Signals and Dispatcher'),
('SUPPORT_AGENT', 'Customer Support'),
('USER', 'Standard Trader Account')
ON CONFLICT DO NOTHING;

INSERT INTO team_levels (level, name, min_team_size, commission_rate, weekly_bonus, active) VALUES
(1, 'Bronze Partner', 0, 0.10, 0.0, 1),
(2, 'Silver Partner', 10, 0.05, 50.0, 1),
(3, 'Gold Partner', 30, 0.02, 150.0, 1),
(4, 'Platinum Partner', 100, 0.01, 500.0, 1)
ON CONFLICT DO NOTHING;

INSERT INTO markets (symbol, base_asset, quote_asset, category, is_active, max_leverage) VALUES
('BTC/USDT', 'BTC', 'USDT', 'HOT', 1, 100),
('ETH/USDT', 'ETH', 'USDT', 'HOT', 1, 100),
('SOL/USDT', 'SOL', 'USDT', 'HOT', 1, 50),
('BNB/USDT', 'BNB', 'USDT', 'HOT', 1, 50),
('XNO/USDT', 'XNO', 'USDT', 'SELF SERVICE', 1, 20),
('APE/USDT', 'APE', 'USDT', 'SELF SERVICE', 1, 20),
('APT/USDT', 'APT', 'USDT', 'SELF SERVICE', 1, 20),
('GOLD/USDT', 'GOLD', 'USDT', 'OPTIONS', 1, 20),
('NGAS/USDT', 'NGAS', 'USDT', 'OPTIONS', 1, 20),
('EUR/USDT', 'EUR', 'USDT', 'OPTIONS', 1, 50),
('AAVE/USDT', 'AAVE', 'USDT', 'HOT', 1, 25)
ON CONFLICT DO NOTHING;

INSERT INTO copy_trading_plans (id, name, description, trader_name, win_rate, roi_30d, risk_score, min_balance, followers_count, created_at) VALUES
('plan_alpha_quant', 'Alpha Quant Futures Strategy', 'High-frequency statistical arbitrage on Top 5 liquid assets.', 'Alexandre Vance', 86.4, 42.8, 'MODERATE', 20.0, 1420, CURRENT_TIMESTAMP),
('plan_trend_surfer', 'Trend Surfer Momentum', 'Multi-day trend following with strict trailing stop-loss execution.', 'Elena Rostova', 79.2, 31.5, 'LOW', 20.0, 984, CURRENT_TIMESTAMP),
('plan_scalp_master', 'Dynamic Scalp Matrix', 'Aggressive 5-minute liquidity breakout captures.', 'Kenji Sato', 91.8, 64.2, 'HIGH', 20.0, 2310, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

INSERT INTO trading_signals (id, symbol, direction, entry_price_min, entry_price_max, target_price_1, target_price_2, stop_loss, status, duration_minutes, published_at, expires_at, created_at) VALUES
('sig_btc_01', 'BTC/USDT', 'BUY', 63800.0, 64200.0, 65400.0, 66800.0, 62900.0, 'PUBLISHED', 240, CAST(CURRENT_TIMESTAMP AS TEXT), CAST(CURRENT_TIMESTAMP AS TEXT), CAST(CURRENT_TIMESTAMP AS TEXT)),
('sig_eth_01', 'ETH/USDT', 'BUY', 3450.0, 3490.0, 3580.0, 3680.0, 3380.0, 'PUBLISHED', 240, CAST(CURRENT_TIMESTAMP AS TEXT), CAST(CURRENT_TIMESTAMP AS TEXT), CAST(CURRENT_TIMESTAMP AS TEXT))
ON CONFLICT DO NOTHING;

INSERT INTO system_settings (setting_key, setting_value, description, updated_at) VALUES
('REAL_MONEY_MODE', 'false', 'Platform money mode (false = simulated demo)', CAST(CURRENT_TIMESTAMP AS TEXT)),
('SIGNALS_PER_DAY', '2', 'Automated signals per day', CAST(CURRENT_TIMESTAMP AS TEXT)),
('RELEASE_TIMES', '12:00,16:00', 'Automated signal release schedule (UTC)', CAST(CURRENT_TIMESTAMP AS TEXT)),
('MAINTENANCE_MODE', 'false', 'Global maintenance status', CAST(CURRENT_TIMESTAMP AS TEXT)),
('DEFAULT_TIMEZONE', 'UTC', 'System default timezone', CAST(CURRENT_TIMESTAMP AS TEXT))
ON CONFLICT DO NOTHING;

-- MARKETING ASSETS & SOURCE-OF-TRUTH ENGINE
CREATE TABLE IF NOT EXISTS marketing_assets (
    id TEXT PRIMARY KEY,
    campaign_id TEXT,
    file_path TEXT NOT NULL,
    webp_path TEXT,
    mobile_path TEXT,
    title TEXT NOT NULL,
    description TEXT,
    alt_text TEXT NOT NULL,
    page TEXT NOT NULL, -- home, wallet, copy-trading, referral, more, white-paper, login, register, signals
    section TEXT NOT NULL,
    display_order INTEGER DEFAULT 1,
    status TEXT DEFAULT 'ACTIVE', -- DRAFT, ACTIVE, PAUSED, EXPIRED, ARCHIVED
    start_at TEXT,
    end_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promotional_campaigns (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    banner_asset_id TEXT,
    description TEXT,
    cta_label TEXT DEFAULT 'Get Started',
    cta_url TEXT DEFAULT '#',
    status TEXT DEFAULT 'ACTIVE', -- DRAFT, ACTIVE, PAUSED, EXPIRED
    start_at TEXT,
    end_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promotion_rules (
    id TEXT PRIMARY KEY,
    campaign_id TEXT,
    rule_type TEXT NOT NULL, -- FIRST_DEPOSIT, TIERED_DEPOSIT, REFERRAL_SIGNUP, REFERRAL_DEPOSIT, TRADING_VOLUME
    min_deposit REAL DEFAULT 0.0,
    max_deposit REAL,
    bonus_percentage REAL DEFAULT 0.0,
    fixed_bonus REAL DEFAULT 0.0,
    voucher_amount REAL DEFAULT 0.0,
    max_reward_cap REAL DEFAULT 0.0,
    currency TEXT DEFAULT 'USDT',
    eligibility_criteria TEXT,
    status TEXT DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, ARCHIVED
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marketing_claims (
    id TEXT PRIMARY KEY,
    claim_text TEXT NOT NULL,
    category TEXT NOT NULL, -- PERFORMANCE, SECURITY, TECHNOLOGY, REGULATORY, SIGNALS
    risk_level TEXT NOT NULL DEFAULT 'LOW', -- LOW, MEDIUM, HIGH
    approval_status TEXT NOT NULL DEFAULT 'DRAFT', -- DRAFT, COMPLIANCE_REVIEW, APPROVED, REJECTED
    disclaimer TEXT,
    supporting_evidence TEXT,
    reviewed_by TEXT,
    approved_by TEXT,
    approved_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS signal_schedules (
    id TEXT PRIMARY KEY,
    session_name TEXT NOT NULL,
    release_time_utc TEXT NOT NULL,
    window_minutes INTEGER DEFAULT 30,
    validity_minutes INTEGER DEFAULT 240,
    expected_frequency TEXT DEFAULT 'DAILY',
    win_probability_estimate REAL DEFAULT 88.5,
    active INTEGER DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS additional_signal_rewards (
    id TEXT PRIMARY KEY,
    tier_name TEXT NOT NULL,
    min_trading_days INTEGER DEFAULT 7,
    min_signal_volume REAL DEFAULT 1000.0,
    extra_bonus_percent REAL DEFAULT 5.0,
    exclusive_vip_signals INTEGER DEFAULT 1,
    status TEXT DEFAULT 'ACTIVE',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_signal_executions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    signal_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    direction TEXT NOT NULL,
    stake_amount REAL NOT NULL DEFAULT 20.0,
    profit_percentage REAL NOT NULL DEFAULT 2.5,
    profit_amount REAL NOT NULL DEFAULT 0.5,
    executed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY(signal_id) REFERENCES trading_signals(id) ON DELETE CASCADE,
    UNIQUE(user_id, signal_id)
);

CREATE INDEX IF NOT EXISTS idx_user_signal_executions_user ON user_signal_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_signal_executions_signal ON user_signal_executions(signal_id);

CREATE TABLE IF NOT EXISTS deposit_config (
    id TEXT PRIMARY KEY,
    asset TEXT NOT NULL,
    network TEXT NOT NULL,
    deposit_address TEXT NOT NULL,
    qr_code_url TEXT,
    min_deposit REAL DEFAULT 10.0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO deposit_config (id, asset, network, deposit_address, qr_code_url, min_deposit, is_active) VALUES
('dep_cfg_usdt_trc20', 'USDT', 'TRC20', 'TN8qInstitutionalAlphaTRC20LedgerVault2026', '', 10.0, 1),
('dep_cfg_usdt_bep20', 'USDT', 'BEP20', '0x71C8F39182068e17F38e078712C7D1a61Fe78922', '', 10.0, 1),
('dep_cfg_usdt_erc20', 'USDT', 'ERC20', '0x71C8F39182068e17F38e078712C7D1a61Fe78922', '', 20.0, 1),
('dep_cfg_btc_main', 'BTC', 'BITCOIN', 'bc1q9v8tq9institutionalalphavault992026', '', 0.0005, 1)
ON CONFLICT (id) DO NOTHING;

-- Seed Default Super Administrator Profiles
INSERT INTO profiles (id, email, role, kyc_status, referral_code, created_at, updated_at) VALUES
('usr_super_admin_adeel', 'shahzadadeel197@gmail.com', 'SUPER_ADMIN', 'APPROVED', 'ADEEL99', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('usr_super_admin_trader', 'trader@alphavest.io', 'SUPER_ADMIN', 'APPROVED', 'ALPHA88', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO UPDATE SET role = 'SUPER_ADMIN', kyc_status = 'APPROVED';

-- Seed Wallets for Super Administrators
INSERT INTO wallet_balances (user_id, wallet_type, asset, balance, available_balance, created_at, updated_at) VALUES
('usr_super_admin_adeel', 'funding', 'USDT', 50000.0, 50000.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('usr_super_admin_adeel', 'exchange', 'USDT', 25000.0, 25000.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('usr_super_admin_adeel', 'trading', 'USDT', 25000.0, 25000.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('usr_super_admin_trader', 'funding', 'USDT', 50000.0, 50000.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('usr_super_admin_trader', 'exchange', 'USDT', 25000.0, 25000.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('usr_super_admin_trader', 'trading', 'USDT', 25000.0, 25000.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (user_id, wallet_type, asset) DO NOTHING;

