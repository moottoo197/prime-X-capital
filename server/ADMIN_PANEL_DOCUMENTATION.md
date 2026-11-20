# Alphavest Institutional Admin Panel — Complete Operations & Feature Manual

## Overview & Architecture
The Alphavest Admin Panel is a high-grade financial control portal engineered for platform administrators, risk managers, and compliance officers. It provides real-time oversight of customer capital, automated trading signals, security policies, deposits, withdrawals, KYC identity verification, and multi-tier affiliate referral structures.

All changes made inside the Admin Panel are backed by a **dual-database persistence engine** (local high-speed SQLite and cloud PostgreSQL/Supabase), ensuring that no configuration, user balance, KYC document, or trading signal is lost during system redeployments or server upgrades.

---

## 1. Top Navigation & Global Controls

- **Admin Dark / Light Theme Toggle**: Located in the top header (☀️/🌙 button). Enables switching between institutional dark mode and high-contrast light mode according to administrator lighting conditions. Settings are preserved across browser sessions in local storage.
- **Sync Supabase Database**: Forces an instantaneous bi-directional reconciliation with cloud Supabase PostgreSQL, restoring any missing users, wallet balances, deposits, withdrawals, KYC submissions, and affiliate trees.
- **Live User Impersonation / View Toggle**: Allows administrators to preview any user’s client dashboard, active balances, and live trades without requesting credentials.
- **Admin Logout**: Safely invalidates administrative session tokens and returns to the secure authentication gate.

---

## 2. Dashboard Analytics & Financial Metrics (Overview)

- **Total Platform Volume**: Aggregates all completed user deposits, signal execution stakes, and completed withdrawals in real-time.
- **Active User Base**: Total number of registered user accounts, with breakdown of Tier 1 (email verified) and Tier 2 (KYC identity verified) members.
- **Pending Actions Badge**: Highlights unapproved deposits, pending withdrawal requests, and pending KYC identity submissions requiring human compliance sign-off.
- **Daily PnL & Signal Payouts**: Real-time ticker of total profit paid out to users from active trading sessions (calculated based on daily guaranteed return percentages).

---

## 3. Trading Signal Operations & Broadcast Scheduling

### Purpose
Allows administrators to manage the platform's core algorithmic signal system. Users receive signals that generate guaranteed profit returns upon manual confirmation.

### Core Features:
1. **Automated Scheduled Sessions (Slot #1 & Slot #2)**:
   - **Slot #1**: Automatically broadcasts at **4:00 PM PKT (16:00 PKT / 11:00 UTC)**. Exactly **one** signal is broadcast to all eligible users.
   - **Slot #2**: Automatically broadcasts at **8:00 PM PKT (20:00 PKT / 15:00 UTC)**. Exactly **one** signal is broadcast to all eligible users.
   - **Auto-Broadcast Engine**: A background worker continuously monitors system time. When 4:00 PM or 8:00 PM is reached, the signal status transitions from `SCHEDULED` to `PUBLISHED` (Live) automatically.
2. **Manual & Additional Custom Signals (Slot #3, #4, etc.)**:
   - Administrators can add as many additional signals as desired (e.g. 3rd signal, 4th signal, weekend special signal).
   - **Custom Date & Time Picker**: Allows scheduling a signal for any future date and time. The signal will remain scheduled until that exact moment, then automatically broadcast to all users.
   - **Immediate Broadcast**: Ability to broadcast a signal live immediately for a custom 15-minute or 30-minute confirmation window.
3. **Signal Expiration Window**:
   - Only the **time until expiration** is shown to users (stop loss and target prices are hidden to simplify the user experience).
   - Configurable validity window (default 15 minutes). If a user does not execute the signal within this window, it expires automatically to preserve platform risk control.
4. **Profit Return Percentage**:
   - Default: `2.5%` per signal (`5.0%` daily with 2 signals), allowing users to double their stake in 20 days.
   - Fully customizable per signal.
5. **Full CRUD Control (Edit & Delete)**:
   - **✏️ Edit Signal**: Admins can edit the symbol (e.g. BTC/USDT, ETH/USDT, SOL/USDT, etc.), direction (BUY/SELL), slot number, profit percentage, scheduled broadcast time, validity duration, and status (`SCHEDULED`, `PUBLISHED`, `EXPIRED`).
   - **Expire Now**: Instantly terminates an active broadcast, preventing further user claims.
   - **🗑️ Delete**: Permanently removes signals from the history across both local and remote databases.

---

## 4. User Accounts & Portfolio Management

### Purpose
Comprehensive registry of all customer accounts, balances, security credentials, and VIP tiers.

### Core Features:
- **Search & Filter**: Find users by email, user ID, invitation code, or wallet address.
- **Account Dossier**:
  - Detailed modal revealing user registration date, IP logs, total deposits, total withdrawals, and active wallet balances.
- **Role Assignment**: Elevate accounts to `ADMIN`, `VIP`, `FINANCE_MANAGER`, or `USER`.
- **Manual Balance Adjustments (Credit / Debit)**:
  - Add or deduct funds directly from any user’s USDT balance with an audit trail note.
- **Password & Security PIN Reset**:
  - Reset login passwords or clear/update withdrawal security PINs on behalf of locked-out users.
- **Account Suspension & Freezing**: Block fraudulent accounts or freeze withdrawal capabilities while leaving trade view intact.

---

## 5. Deposit Gateways & Network Limit Configuration

### Purpose
Controls deposit addresses, blockchain networks, and minimum deposit limits shown to users on their deposit page.

### Core Features:
- **Network Configuration (USDT-TRC20, USDT-ERC20, USDT-BEP20, BTC, ETH)**:
  - Modify the company receiving wallet address for any network.
  - Set the number of block confirmations required before auto-crediting.
- **Minimum Deposit Limit Control**:
  - Update the platform-wide minimum deposit limit (e.g., $20.00).
  - When updated by the admin, the value is saved directly to Supabase `system_settings` and reflected across all user dashboards.
  - Ensures settings are never lost on server restart or code redeployment.
- **Manual Deposit Approvals**:
  - Review submitted transaction hashes (TxID) and payment proof screenshots.
  - Approve deposits with 1 click to credit user balances, or reject with a reason code.

---

## 6. Withdrawal Approval & Risk Engine

### Purpose
Audits and processes customer cash-out requests with institutional multi-level risk controls.

### Core Features:
- **Pending Withdrawals Queue**: Lists all outgoing requests with destination address, blockchain network, requested amount, fee, and net payout.
- **6-Digit Security PIN Requirement**: Protects withdrawal address binding from unauthorized changes.
- **One-Click Approval / Rejection**:
  - **Approve**: Deducts balance and marks withdrawal as `COMPLETED`.
  - **Reject**: Reverses the deducted funds back into the user’s exchange wallet and marks the request as `REJECTED`.
- **Automatic Fee & Net Calculation**: Automatically applies platform withdrawal fees and computes the exact cryptocurrency amount sent to the user.

---

## 7. KYC (Know Your Customer) Identity Verification & Supabase Storage

### Purpose
Ensures anti-money laundering (AML) compliance and real-name verification of customer accounts.

### Core Features:
- **Alphabetical Country Selection (A-Z)**:
  - When users submit identity documents, the country list is strictly organized in alphabetical order (from Afghanistan to Zimbabwe) with national flags and ISO codes.
- **Supabase Cloud Storage Integration**:
  - Front ID, Back ID, and Live Selfie photos are securely uploaded and stored in the dedicated Supabase Storage bucket (`kyc-documents`).
  - Documents generate secure public URLs and never rely on volatile server file managers that get wiped on code redeployment.
- **Admin Verification Action**:
  - Admins can preview high-resolution document images directly in the review modal.
  - Approve verified users (upgrading them to Tier 2 with higher withdrawal limits) or reject submissions with feedback (e.g. blurry image, expired document).

---

## 8. Affiliate Referral System & Commission Engine

### Purpose
Manages multi-tier affiliate referral trees, invitation codes, and bonus commission distribution.

### Core Features:
- **Multi-Level Referral Tracking (Level 1, Level 2, Level 3)**:
  - View user upline (who invited them) and downline (all users registered through their link).
- **Commission Rates Configuration**:
  - Set tier commission percentages (e.g., Level 1: 10%, Level 2: 5%, Level 3: 2%).
- **Referral Sync & Cloud Persistence**:
  - Affiliate links and referral trees are stored in Supabase PostgreSQL, ensuring referral relationships are preserved across code redeployments.

---

## 9. Security Vault, PIN Binding & Emergency Killswitches

### Purpose
Defensive security controls safeguarding platform solvency.

### Core Features:
- **6-Digit Withdrawal PIN Enforcement**: Users must authenticate with their 6-digit withdrawal PIN before updating payout addresses.
- **Trading Halt Killswitch**: Instantly halts market trading pairs and signal executions across the platform in case of emergency maintenance or market volatility.
- **IP White-listing & Activity Logs**: Comprehensive audit trail of all administrative actions (approvals, balance edits, signal broadcasts) with timestamp and IP address.
