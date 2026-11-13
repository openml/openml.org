# Auth Architecture — Old vs New

Last updated: 2026-03-06

---

## Why This Document Exists

The OpenML frontend is being migrated from a legacy React SPA (backed by a Flask proxy) to a
modern Next.js application. One of the most significant architectural changes is in
**authentication and authorization**: we removed Flask as a middleman and replaced it with a
direct, modern auth layer built into Next.js.

This document explains:

- What the old architecture looked like and why it had limitations
- What the new architecture does and why it is better
- What the **backend team must do** before deploying to production or test.openml.org
- What is still Flask-dependent and what has been fully migrated

> For detailed implementation docs see:
>
> - [AUTHENTICATION.md](./AUTHENTICATION.md) — NextAuth.js flows, tables, env vars
> - [ENVIRONMENTS.md](./ENVIRONMENTS.md) — localhost vs test vs production differences
> - [flask-vs-migration.md](./flask-vs-migration.md) — full feature migration status

---

## Before: Old React + Flask Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (React SPA)                       │
└─────────────────────────┬───────────────────────────────────┘
                          │ All requests
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  Flask Backend (Python)                      │
│   ├── Auth: login, register, session management             │
│   ├── API key: read/write session_hash in MySQL             │
│   ├── Proxy: forwards data requests to OpenML REST API      │
│   └── Profile: read/write user data                         │
└──────────┬──────────────────────────┬───────────────────────┘
           │                          │
           ▼                          ▼
    MySQL Database             OpenML REST API
    (users, sessions)          (Java/PHP backend)
                               (datasets, tasks, runs)
```

**Problems with this architecture:**

- Every browser request went through Flask, even for read-only data
- Flask was a proxy bottleneck — two network hops for most operations
- Authentication was tightly coupled to Flask's session management
- Modern features (OAuth, passkeys) would require Flask changes
- No type safety, no built-in CSRF protection

---

## After: New Next.js Architecture

```
┌─────────────────────────────────────────────────────────────┐
│               Browser (Next.js — Server + Client)            │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  NextAuth.js (/api/auth/...)                        │  │
│   │  ├── Email/password (Argon2i, same hash as Flask)   │  │
│   │  ├── OAuth: GitHub, Google                          │  │
│   │  ├── Passkeys (WebAuthn / biometrics)               │  │
│   │  └── Session: JWT in HTTP-only cookie               │  │
│   └──────────────────────┬──────────────────────────────┘  │
│                          │ DIRECT                           │
└──────────────────────────┼──────────────────────────────────┘
                           │                    │
                           ▼                    ▼
                    MySQL Database       OpenML REST API
                    (auth only)          (datasets, tasks,
                    DIRECT connection    runs, uploads)
                    no Flask proxy       DIRECT — no Flask
```

**What changed:**

- Next.js connects **directly** to MySQL for authentication — no Flask in between
- Data requests go **directly** to the OpenML REST API — no Flask proxy
- Flask is now only used for three small features (see below)
- Modern auth methods (OAuth, passkeys) are handled natively by NextAuth.js

---

## What Is Still Flask-Dependent

| Feature                  | Status           | Notes                                                              |
| ------------------------ | ---------------- | ------------------------------------------------------------------ |
| **API key regeneration** | Still uses Flask | Can be migrated to direct MySQL (easy)                             |
| **API key fetch**        | Still uses Flask | Can be migrated to direct MySQL (easy)                             |
| **Dataset stats**        | Still uses Flask | Stats endpoint proxies to `FLASK_BACKEND_URL`                      |
| All other auth           | ✅ Migrated      | NextAuth.js + direct MySQL                                         |
| All data reads           | ✅ No Flask      | Elasticsearch + OpenML REST API                                    |
| Uploads / likes          | ✅ No Flask      | Direct to OpenML REST API with user's `session_hash`               |

> See [flask-vs-migration.md](./flask-vs-migration.md) for the complete feature list.

---

## The API Key — How It Flows

The `session_hash` column in the `users` table is the OpenML API key. It is the same value
that users copy from their OpenML profile page and paste into Python/R clients.

```
MySQL users.session_hash
        │
        ▼  (loaded at login by NextAuth)
NextAuth session  (server-side JWT, HTTP-only cookie)
        │
        ▼  (passed to API routes on the server)
/api/datasets/upload      →  POST to OpenML REST API with api_key=session_hash
/api/datasets/[id]/edit   →  POST to OpenML REST API with api_key=session_hash
/api/tasks/create         →  POST to OpenML REST API with api_key=session_hash
/api/collections/create   →  POST to OpenML REST API with api_key=session_hash
```

**Critical:** API keys are NOT shared between servers.

- A `session_hash` from `openml.org` is rejected by `test.openml.org` and vice versa.
- Local accounts (Docker MySQL) have no `session_hash` recognized by either server.

---

## Backend Team: Required Actions

### For Production (`openml.org`)

**One-time setup — run these SQL statements on the production MySQL database:**

```sql
-- 1. Email confirmation tokens (required for new user registration)
CREATE TABLE IF NOT EXISTS email_confirmation_token (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Password reset tokens (required for forgot-password flow)
CREATE TABLE IF NOT EXISTS password_reset_token (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used BOOLEAN DEFAULT FALSE,
  used_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Passkey credentials (required for WebAuthn biometric login)
CREATE TABLE IF NOT EXISTS user_passkeys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  credential_id BLOB NOT NULL,
  public_key BLOB NOT NULL,
  sign_count INT DEFAULT 0,
  transports VARCHAR(255),
  device_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

> These are **additive only** — nothing existing is modified or deleted.

**What breaks without each table:**

| Missing table              | What breaks                                 | What still works       |
| -------------------------- | ------------------------------------------- | ---------------------- |
| `email_confirmation_token` | New user registration (stuck at `active=0`) | Existing user sign-in  |
| `password_reset_token`     | Forgot password / reset password            | Everything else        |
| `user_passkeys`            | Passkey sign-up and sign-in                 | All other auth methods |

**Environment variables required on the production server:**

```env
# Next.js
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://openml.org         # Must match the exact public URL

# Database — direct MySQL connection (replaces Flask DB proxy)
DATABASE_URL=mysql://user:pass@mysql-host:3306/openml

# Email — for registration confirmation and password reset
SMTP_HOST=your.smtp.server
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@email.com
SMTP_PASS=yourpassword
SMTP_FROM=OpenML <noreply@openml.org>

# OAuth (if enabled)
GITHUB_ID=...
GITHUB_SECRET=...
GOOGLE_ID=...
GOOGLE_SECRET=...

# Passkeys
RP_ID=openml.org
RP_ORIGIN=https://openml.org

# OpenML REST API
NEXT_PUBLIC_OPENML_API_URL=https://www.openml.org

# Flask backend — still required for API key fetch/regeneration and dataset stats
FLASK_BACKEND_URL=https://www.openml.org
```

---

### For Test Server (`test.openml.org`)

The test server needs the **exact same 3 tables** and the same environment variables,
but pointing to the test database and test domain.

**Key differences from production:**

```env
NEXTAUTH_URL=https://test.openml.org    # ← test domain
RP_ID=test.openml.org                  # ← test domain for passkeys
RP_ORIGIN=https://test.openml.org      # ← test domain for passkeys
NEXT_PUBLIC_OPENML_API_URL=https://test.openml.org  # ← test API
FLASK_BACKEND_URL=https://test.openml.org           # ← test Flask backend
DATABASE_URL=mysql://user:pass@test-mysql-host:3306/openml_test
```

**Important:** test.openml.org has a completely separate MySQL database.

- Users registered on `openml.org` do NOT exist on `test.openml.org`
- API keys from `openml.org` are NOT valid on `test.openml.org`
- The 3 new tables must be created separately on each database

---

### For Local Development (Backend Team Docker Stack)

> **Action required:** When setting up the local Docker stack (full backend environment, like `openml/openml.org`), add the **same 3 SQL statements** from the "For Production" section above to your MySQL init script (e.g. `docker-entrypoint-initdb.d/init.sql`). Without them, registration, password reset, and passkey login will not work locally.

---

## Feature Impact Summary

| User action                 | Old (React + Flask)         | New (Next.js)                  |
| --------------------------- | --------------------------- | ------------------------------ |
| Sign in (email/password)    | Flask session               | NextAuth.js → MySQL direct     |
| Register                    | Flask → MySQL               | NextAuth.js → MySQL direct     |
| OAuth login (GitHub/Google) | Not supported               | NextAuth.js                    |
| Passkey login               | Not supported               | NextAuth.js + WebAuthn         |
| Forgot password             | Flask                       | Next.js → MySQL direct         |
| Upload dataset              | Flask proxy → OpenML API    | Next.js → OpenML API direct    |
| Like / Unlike               | Flask proxy → OpenML API    | Next.js → OpenML API direct    |
| Search / Browse             | Direct → Elasticsearch      | Next.js → Elasticsearch direct |
| API key regeneration        | Flask                       | Still Flask (to be migrated)   |

---

## For New Frontend Developers

**What you need to know:**

1. **Auth is NextAuth.js** — use `useSession()` on the client, `getServerSession()` on the server.
2. **API key is `session.apikey`** — this is `users.session_hash` from MySQL, loaded at login. It must be sent to the OpenML REST API for any write operation (upload, edit, like).
3. **Never call Flask directly** for auth — it is not in the auth path anymore.
4. **DATABASE_URL is mandatory** — the app will not start without it.
5. **Two separate data sources:**
   - MySQL (`DATABASE_URL`) → auth only (users, sessions, passkeys, tokens)
   - OpenML REST API (`NEXT_PUBLIC_OPENML_API_URL`) → all content (datasets, tasks, runs)
6. **Environments are isolated** — API keys and user accounts are separate between `openml.org`, `test.openml.org`, and `localhost`.

> See [ENVIRONMENTS.md](./ENVIRONMENTS.md) for the full environment reference.
> See [AUTHENTICATION.md](./AUTHENTICATION.md) for NextAuth.js implementation details.
