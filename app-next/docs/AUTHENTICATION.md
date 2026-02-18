# OpenML Authentication System

## Overview

The Next.js app uses **NextAuth.js** with direct database authentication, supporting multiple sign-in methods without relying on the legacy Flask backend.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App                               │
├─────────────────────────────────────────────────────────────────┤
│  NextAuth.js (/api/auth/[...nextauth])                          │
│    ├── Credentials Provider (email/password)                    │
│    ├── OAuth Providers (GitHub, Google)                         │
│    └── Passkey Authentication (WebAuthn)                        │
├─────────────────────────────────────────────────────────────────┤
│  Database Layer (@/lib/db.ts)                                   │
│    ├── Local dev: MySQL via Docker (docker-compose.local.yml)   │
│    ├── Fallback: SQLite (server/openml.db)                      │
│    └── Production: MySQL (via DATABASE_URL or MYSQL_* env vars) │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Methods

| Method                 | Description                                      | Status |
| ---------------------- | ------------------------------------------------ | ------ |
| **Email/Password**     | Traditional sign-in with Argon2 hashed passwords | ✅     |
| **Passkey (WebAuthn)** | FaceID, TouchID, Fingerprint, Security Keys      | ✅     |
| **GitHub OAuth**       | Sign in with GitHub account                      | ✅     |
| **Google OAuth**       | Sign in with Google account                      | ✅     |

## Database Configuration

### Environment Detection

The app automatically selects the database based on environment variables:

```typescript
// @/lib/db.ts
const USE_MYSQL =
  process.env.DATABASE_URL !== undefined ||
  process.env.MYSQL_HOST !== undefined;
```

- If `DATABASE_URL` or `MYSQL_HOST` is set → **MySQL**
- Otherwise → **SQLite** fallback (`server/openml.db`)

### Local Development (Docker MySQL)

Start the local MySQL database with Docker:

```bash
docker compose -f docker-compose.local.yml up -d
node scripts/init-local-db.js
```

Configure in `.env.local`:

```env
DATABASE_URL=mysql://openml:openml_local_pass@localhost:3306/openml_local
```

### Production (MySQL)

Use either `DATABASE_URL` or individual `MYSQL_*` variables:

```env
# Option 1: Connection string (recommended)
DATABASE_URL=mysql://user:password@host:3306/openml

# Option 2: Individual variables
MYSQL_HOST=your-mysql-host
MYSQL_USER=openml_user
MYSQL_PASSWORD=your-secure-password
MYSQL_DATABASE=openml
MYSQL_PORT=3306
```

### Database Tables

The app uses the **existing production users table**. Required columns:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  active TINYINT(1) DEFAULT 0,
  activation_code VARCHAR(40),
  created_on INT,
  last_login INT,
  ip_address VARCHAR(45),
  company VARCHAR(100),
  phone VARCHAR(20),
  country VARCHAR(100),
  image VARCHAR(255),
  bio TEXT,
  core VARCHAR(10),
  external_source VARCHAR(100),
  external_id VARCHAR(255),
  forgotten_password_code VARCHAR(40),
  forgotten_password_selector VARCHAR(40),
  forgotten_password_time VARCHAR(40),
  remember_code VARCHAR(40),
  remember_selector VARCHAR(40),
  activation_selector VARCHAR(40),
  session_hash VARCHAR(255)     -- Optional: API key, queried separately for backward compatibility
);
```

**Note:** The `session_hash` column is optional. The auth system queries it separately in a try/catch so it works with or without the column.

Additional tables created automatically if missing:

```sql
-- Email confirmation tokens
CREATE TABLE email_confirmation_token (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  INDEX idx_token (token)
);

-- Password reset tokens
CREATE TABLE password_reset_token (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used TINYINT(1) DEFAULT 0,
  used_at DATETIME,
  INDEX idx_token (token)
);

-- Passkeys (WebAuthn)
CREATE TABLE user_passkeys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  credential_id BLOB NOT NULL,
  public_key BLOB NOT NULL,
  sign_count INT DEFAULT 0,
  transports VARCHAR(255),
  device_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Environment Variables

### Required for All Environments

```env
# NextAuth
NEXTAUTH_SECRET=your-random-secret-key-min-32-chars   # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3050                      # MUST match the URL where the app runs

# Database (one of these)
DATABASE_URL=mysql://user:pass@host:3306/dbname
```

**Important:** `NEXTAUTH_URL` must match the actual URL of the running app. Using `https://` when running on `http://localhost` will cause CSRF failures and all credential sign-ins will silently fail.

### OAuth (Optional)

```env
# GitHub OAuth
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret

# Google OAuth
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
```

### Passkey/WebAuthn (Optional)

```env
RP_ID=localhost                    # or your domain (e.g., openml.org)
RP_ORIGIN=http://localhost:3050    # or your production URL
```

### Email (Optional, for registration confirmation & password reset)

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
SMTP_FROM=OpenML <your-email@example.com>
```

**Note:** The `SMTP_FROM` address must be authorized by your SMTP provider. For example, with one.com the from address must match the authenticated user's domain.

## API Routes

### Authentication Routes

| Route                       | Method | Description                      |
| --------------------------- | ------ | -------------------------------- |
| `/api/auth/[...nextauth]`   | *      | NextAuth.js handler              |
| `/api/auth/register`        | POST   | Email/password registration      |
| `/api/auth/confirm-email`   | GET    | Email confirmation (token-based) |
| `/api/auth/check-email`     | GET    | Check if email is already taken  |
| `/api/auth/forgot-password` | POST   | Request password reset           |
| `/api/auth/reset-password`  | POST   | Reset password with token        |

### Passkey Routes

| Route                                | Method | Description                                 |
| ------------------------------------ | ------ | ------------------------------------------- |
| `/api/auth/passkey/signup-options`   | POST   | Get passkey registration options (new user) |
| `/api/auth/passkey/signup-verify`    | POST   | Verify and complete passkey signup          |
| `/api/auth/passkey/login-options`    | GET    | Get passkey authentication options          |
| `/api/auth/passkey/login-verify`     | POST   | Verify passkey and sign in                  |
| `/api/auth/passkey/register-options` | GET    | Get options to add passkey (existing user)  |
| `/api/auth/passkey/register-verify`  | POST   | Verify and save new passkey                 |
| `/api/auth/passkey/list`             | GET    | List user's passkeys                        |
| `/api/auth/passkey/remove`           | DELETE | Remove a passkey                            |

## Frontend Integration

### useAuth Hook

```typescript
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
  const {
    user,           // Current user object
    isAuthenticated,// Boolean
    isLoading,      // Boolean
    signIn,         // (provider?: string) => void
    signOut,        // () => void
  } = useAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <SignInPrompt />;
  return <Dashboard user={user} />;
}
```

### Session Access

```typescript
import { useSession } from 'next-auth/react';

function MyComponent() {
    const { data: session, status } = useSession();

    // session.user.id
    // session.user.email
    // session.user.username
    // session.user.firstName
    // session.user.lastName
    // session.user.image
    // session.apikey  // For OpenML REST API calls (from session_hash)
}
```

## User Flows

### Email/Password Registration

1. User fills registration form (first name, last name, email, password)
2. `POST /api/auth/register` creates user with `active=0`
3. Confirmation email sent with token link
4. User clicks link → `GET /api/auth/confirm-email?token=xxx`
5. User activated (`active=1`), can now sign in

### Passkey Sign-up (Passwordless)

1. User enters name and email
2. `POST /api/auth/passkey/signup-options` creates pending user, returns WebAuthn options
3. Browser prompts for FaceID/TouchID/Fingerprint
4. `POST /api/auth/passkey/signup-verify` verifies and activates user
5. User automatically signed in

### Passkey Sign-in

1. User clicks "Sign in with Passkey"
2. `GET /api/auth/passkey/login-options` returns WebAuthn challenge
3. Browser prompts for biometric
4. `POST /api/auth/passkey/login-verify` verifies credential
5. NextAuth session created

### OAuth Sign-in

1. User clicks "Sign in with GitHub/Google"
2. Redirected to OAuth provider
3. On callback, user created/linked in database
4. Session created automatically

## Security

### Password Hashing

Passwords are hashed using **Argon2i** (memory-hard, GPU-resistant) with parameters matching the legacy Flask backend:

```typescript
import argon2 from 'argon2';

// Hash password (same params used in register + reset-password)
const hash = await argon2.hash(password, {
  type: argon2.argon2i,
  timeCost: 4,
  memoryCost: 16384,
  parallelism: 2,
});

// Verify password
const valid = await argon2.verify(hash, password);
```

### Session Security

- Sessions managed by NextAuth.js with JWT strategy
- Tokens stored in HTTP-only cookies (not localStorage)
- Session expires after 2 hours (matches Flask JWT)
- CSRF protection enabled by default

### Passkey Security

- Credentials stored server-side (public key only)
- Private key never leaves user's device
- Phishing-resistant (bound to origin)

## Backward Compatibility

The auth system is designed to work with any existing OpenML database:

- **No schema changes required** — all queries use only columns from the legacy Flask schema
- **`session_hash` is optional** — queried separately in a try/catch block, so auth works even if the column doesn't exist
- **OAuth user creation** — inserts `session_hash` via a separate UPDATE (fails silently if column missing)
- **Password format** — uses the same Argon2i parameters as the Flask backend

## Deployment Environments

| Environment               | Database     | Auth Works?    |
| ------------------------- | ------------ | -------------- |
| **Local dev (Docker)**    | MySQL        | ✅ All methods |
| **Local dev (no Docker)** | SQLite       | ✅ All methods |
| **Vercel (no MySQL)**     | None         | ⚠️ OAuth only  |
| **Vercel + MySQL**        | TU/e MySQL   | ✅ All methods |
| **k8s Production**        | TU/e MySQL   | ✅ All methods |

## Troubleshooting

### "Invalid email or password" but credentials are correct

- **Check `NEXTAUTH_URL`**: Must match the actual URL (e.g., `http://localhost:3050` for local dev, NOT `https://...` for a production URL). A mismatch causes CSRF failures that show as "Invalid credentials".
- **Check database columns**: If the SQL query requests a column that doesn't exist (like `session_hash`), the error is caught silently and returns "Invalid credentials". Check server console for `Login error:` messages.
- **Check user is active**: User must have `active=1` in the database (set after email confirmation).

### "Passkey not found in database"

- User needs to register a passkey first before signing in with it
- Check `user_passkeys` table has records

### "Registration failed"

- Check SMTP settings for confirmation emails
- Verify database is writable
- Check for duplicate email/username

### OAuth errors

- Verify OAuth app callback URLs match your domain
- Check client ID/secret are correct
- Ensure OAuth provider is enabled in NextAuth config

### Confirmation email not received

- Check `SMTP_FROM` address is authorized by your SMTP provider
- Check spam folder
- Verify SMTP credentials are correct (test with a simple send)

## File Structure

```
src/
├── app/api/auth/
│   ├── [...nextauth]/route.ts    # NextAuth configuration
│   ├── register/route.ts         # Email registration
│   ├── confirm-email/route.ts    # Email confirmation
│   ├── check-email/route.ts      # Email availability check
│   ├── forgot-password/route.ts  # Password reset request
│   ├── reset-password/route.ts   # Password reset
│   └── passkey/
│       ├── signup-options/route.ts
│       ├── signup-verify/route.ts
│       ├── login-options/route.ts
│       ├── login-verify/route.ts
│       ├── register-options/route.ts
│       ├── register-verify/route.ts
│       ├── list/route.ts
│       └── remove/route.ts
├── components/auth/
│   ├── sign-in-form.tsx
│   ├── sign-up-form.tsx
│   ├── passkey-signin-button.tsx
│   └── auth-tabs.tsx
├── app/[locale]/(extra)/auth/
│   ├── sign-in/page.tsx
│   ├── sign-up/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   └── confirm-email/page.tsx
├── hooks/
│   └── use-auth.ts               # Unified auth hook
├── lib/
│   └── db.ts                     # Database abstraction (MySQL/SQLite)
└── types/
    └── next-auth.d.ts            # NextAuth type extensions
```
