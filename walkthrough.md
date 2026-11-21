# Security Summary

**Reviewed Files**: 48
**Issues Resolved**: 11

### Issues Resolved
| Area | File | Line | What Was Happening | Impact | Status | How It Was Fixed |
|---|---|---|---|---|---|---|
| Console Access Control | `public_html/logs.php` | 56 | Any signed-in user could view, export, or clear server and security logs instead of administrators only. | High | Fixed | Enforced administrator role and active-account verification for all signed-in visitors; non-admin users receive HTTP `403` and an audit event is recorded. |
| Role Assignment & Registration | `public_html/api/bootstrap.php`, `public_html/api/auth/register.php`, `public_html/api/user/update-email.php`, `public_html/assets/js/app.js` | 513, 39, 19, 9818 | Wildcard domain matching and client-side email lists treated any matching domain email as Super Admin, and self-registration/email-update flows did not block reserved admin emails. | Critical | Fixed | Removed wildcard domain promotion and hardcoded client-side admin emails; enforced exact `ADMIN_EMAILS` matching on the server and blocked self-registration or email reassignment to reserved admin addresses. |
| Certificate Verification | `public_html/api/SupabaseClient.php` | 124 | Outbound HTTPS requests to Supabase had SSL certificate and hostname verification disabled. | High | Fixed | Re-enabled strict TLS certificate and hostname verification (`CURLOPT_SSL_VERIFYPEER => true`, `CURLOPT_SSL_VERIFYHOST => 2`, `verify_peer => true`) across all REST and streaming calls. |
| Suspended Account & Session Revocation | `public_html/api/admin/users.php`, `public_html/api/wallet/withdraw.php`, `public_html/api/signals/execute.php`, `public_html/api/kyc/upload.php`, `public_html/api/user/profile.php`, and 7 sibling endpoints | 536, 7, 7, 11, 7 | Multiple user, wallet, signal, KYC, and referral endpoints used `getCurrentUser()` without checking `is_active`, and suspending or changing a user's role did not revoke active sessions. | High | Fixed | Switched all protected endpoints to `requireAuth()` (which blocks suspended accounts) and revoked all database and file-backed sessions immediately on account suspension, role change, or deletion. |
| Withdrawal PIN Verification | `public_html/api/user/withdrawal-pin.php`, `public_html/api/wallet/withdraw.php`, `public_html/api/user/withdraw-address.php`, `public_html/api/auth/register.php`, `public_html/assets/js/app.js` | 39, 41, 51, 128, 4364 | PIN updates ignored `current_pin`, failed Supabase profile lookups could fall through to an empty-PIN bypass branch, and plaintext PINs could be written to `profiles` and `localStorage`. | Critical | Fixed | Required rate-limited `current_pin` verification before changing an existing PIN, failed closed (`502`) whenever Supabase profile lookup fails, enforced constant-time comparison and `password_hash`, and removed plaintext PIN storage from both database writes and `localStorage`. |
| CORS Host Allowlist | `public_html/api/bootstrap.php` | 66 | CORS validation dynamically trusted the incoming `HTTP_HOST` request header alongside `ALLOWED_ORIGINS`. | Medium | Fixed | Removed `$_SERVER['HTTP_HOST']` from the CORS allowlist so only explicitly configured origins (`ALLOWED_ORIGINS` and verified deployment domains) receive credentialed CORS headers. |
| Filter & ID Validation | `public_html/api/bootstrap.php`, `public_html/api/auth/login.php`, `public_html/api/auth/register.php`, `public_html/api/admin/users.php`, `public_html/api/admin/signals.php`, `public_html/api/admin/deposits.php`, `public_html/api/admin/withdrawals.php`, `public_html/api/signals/execute.php` | 534, 15, 36, 22, 21, 93, 77, 14 | Email filters and resource identifiers were interpolated into PostgREST queries without strict email or character-set validation and wildcard escaping. | Medium | Fixed | Validated emails with `filter_var(..., FILTER_VALIDATE_EMAIL)`, escaped PostgREST wildcard characters in `ilike` lookups, and enforced strict identifier patterns on user, signal, deposit, and withdrawal IDs. |
| Health Diagnostics Exposure | `public_html/api/health.php` | 21 | Public `/api/health` responses returned the internal Supabase project host and raw backend error messages to unauthenticated callers. | Low | Fixed | Restricted `supabase_host`, HTTP status diagnostics, and raw backend error details to authenticated administrator sessions only. |
| Legacy Broken Stipend Endpoint | `public_html/api/referrals/claim-stipend.php` | 1 | Referenced a removed PDO database helper (`getDB()`) and returned raw exception messages, causing server errors on POST. | Medium | Fixed | Rebuilt on `requireAuth()`, `POST` enforcement, and Supabase REST team-count verification with compliance-pending claim logging and no exception leakage. |
| Cookie & Document Protections | `public_html/api/auth/register.php`, `public_html/api/user/country.php`, `public_html/api/notifications/read.php`, `public_html/.htaccess` | 191, 62, 28, 6 | Preference cookies omitted the `secure` attribute on HTTPS connections, and `.md`/`.jsonl` files were not covered by the main deny rule in `.htaccess`. | Low | Fixed | Added `'secure' => isHttpsRequest()` to preference cookies and extended `.htaccess` `<FilesMatch>` to deny `.md` and `.jsonl` files. |
| Example Credential Cleanup | `server/SUPABASE_SETUP_GUIDE.md` | 76 | Setup documentation contained sample literal account passwords (`Password123!`). | Low | Fixed | Replaced sample literal passwords in `server/SUPABASE_SETUP_GUIDE.md` with `<CONFIGURE_STRONG_PASSWORD>`. |

### Safeguards Verified
| Area | File | How It's Protected |
|---|---|---|
| Secrets & Environment Keys | `server/config.php`, `server/.env.example` | All Supabase keys, session settings, and master admin credentials are loaded from `server/.env` outside `public_html` and never hardcoded in tracked files. |
| Session Cookies & CSRF | `public_html/api/bootstrap.php` | Sessions use HTTP-only opaque tokens stored hashed (`SHA-256`) on the server, and all state-changing API requests validate matching `X-CSRF-Token` headers against the `alphavest_csrf` cookie. |
| File Uploads (KYC) | `public_html/api/kyc/upload.php` | Validates actual file content via `finfo`, restricts types to JPG/PNG/PDF up to 10 MB, stores files in private Supabase Storage (`kyc-documents`) using random names, and removes temporary local files immediately. |
| Financial Ledger & Concurrency | `public_html/api/wallet/deposit.php`, `public_html/api/wallet/withdraw.php`, `public_html/api/admin/deposits.php`, `public_html/api/admin/withdrawals.php` | Financial operations enforce idempotency keys and execute inside atomic PostgreSQL database functions (`submit_deposit_once`, `submit_withdrawal_once`, `admin_process_deposit`, `admin_process_withdrawal`). |

---

## PoC Verification

### 1. Unauthorized Regular User Access to `/logs` Console

#### Summary
| Field | Value |
|---|---|
| Issue Type | Missing Role Authorization |
| Impact | High |
| Affected File | `public_html/logs.php:56` |
| Test Scenario | Authenticated standard user (`role: USER`) requests `GET /logs.php?format=json` |

#### How It Was Fixed
Removed the condition that allowed any signed-in non-admin user into the console and added explicit administrator role (`SUPER_ADMIN`, `ADMIN`, `FINANCE_MANAGER`, `KYC_MANAGER`) and `is_active` checks.

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | Signed-in standard user session is resolved by `getCurrentUser()` at `public_html/logs.php:52` | Session owner loaded with `role: USER` |
| 2 | Guard checks `$userActive` and `in_array($userRole, $adminRoles, true)` at `public_html/logs.php:60` | Fails admin role check |
| 3 | Writes `LOGS_UNAUTHORIZED_USER_ATTEMPT` security log, sets HTTP `403`, and returns `FORBIDDEN` JSON or `403 · Restricted Access` HTML | **Handled Safely** |

#### Conclusion
**Fix Verified** - Standard or suspended users can no longer read, export, or clear server logs via `/logs` or `/logs.php`.

---

### 2. Withdrawal PIN Overwrite & Database-Failure Bypass

#### Summary
| Field | Value |
|---|---|
| Issue Type | Broken Authorization & Fail-Open Logic |
| Impact | Critical |
| Affected File | `public_html/api/user/withdrawal-pin.php:26`, `public_html/api/wallet/withdraw.php:40`, `public_html/api/user/withdraw-address.php:51` |
| Test Scenario | Request to `POST /api/user/withdrawal-pin.php` with `{ "new_pin": "999999" }` and missing/wrong `current_pin`, or withdrawal request during a failed Supabase `profiles` lookup |

#### How It Was Fixed
Added rate-limited verification of `current_pin` whenever a PIN/hash already exists on the user's profile, and changed `withdraw.php` and `withdraw-address.php` to fail closed with HTTP `502` if the profile query fails instead of treating missing query results as an unset PIN.

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | Request reaches `public_html/api/user/withdrawal-pin.php:7` | Active user verified via `requireAuth()` |
| 2 | Profile row queried at `public_html/api/user/withdrawal-pin.php:26`; if missing/failed, returns `502 PROFILE_LOOKUP_FAILED` | Fail-closed check passed |
| 3 | Since `$storedHash` or `$storedPin` is non-empty (`line 39`), missing or wrong `current_pin` triggers `checkWithdrawalPinRateLimit()` and `recordWithdrawalPinFailure()`, rejecting with `400 CURRENT_PIN_REQUIRED` or `403 INCORRECT_PIN` | **Handled Safely** |

#### Conclusion
**Fix Verified** - Existing withdrawal PINs cannot be overwritten without verifying the current PIN under rate limiting, and transient database failures cannot bypass PIN validation.

---

### 3. Domain-Based Admin Self-Registration & Session Persistence After Suspension

#### Summary
| Field | Value |
|---|---|
| Issue Type | Privilege Escalation & Missing Session Revocation |
| Impact | Critical |
| Affected File | `public_html/api/bootstrap.php:526`, `public_html/api/auth/register.php:39`, `public_html/api/admin/users.php:536` |
| Test Scenario | Self-registration attempt with a configured admin email or arbitrary `@alphavest.io` address, and an active session cookie belonging to a newly suspended user hitting `POST /api/wallet/withdraw.php` |

#### How It Was Fixed
Replaced wildcard `@alphavest.io` / `@alphavest-app.com` domain promotion with exact `ADMIN_EMAILS` matching, blocked self-registration and email updates targeting reserved admin emails, switched protected endpoints to `requireAuth()`, and revoked all DB and file-backed sessions in `admin/users.php` upon suspension or role change.

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | Registration with reserved admin email reaches `public_html/api/auth/register.php:39` (`primex_is_admin_email($email)`) | Blocked with `403 EMAIL_RESERVED` |
| 2 | Arbitrary `@alphavest.io` address is evaluated by `primex_is_admin_email()` at `public_html/api/bootstrap.php:531` | Returns `false` (no automatic Super Admin promotion) |
| 3 | When an admin suspends an account at `public_html/api/admin/users.php:543`, `primex_delete_sessions_by_user($userId)` deletes all DB and file sessions; any remaining request hits `requireAuth()` (`bootstrap.php:875`) and returns `403 ACCOUNT_SUSPENDED` | **Handled Safely** |

#### Conclusion
**Fix Verified** - Admin privileges cannot be claimed via domain matching or registration, and suspended users lose access immediately.
