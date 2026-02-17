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
│    ├── Local: SQLite (server/openml.db)                         │
│    └── Production: MySQL (via MYSQL_* env vars)                 │
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
const USE_MYSQL = process.env.MYSQL_HOST !== undefined;
```

### Local Development (SQLite)

No configuration needed. Uses `server/openml.db` automatically.

### Production/Vercel (MySQL)

```env
MYSQL_HOST=your-mysql-host.tue.nl
MYSQL_USER=openml_user
MYSQL_PASSWORD=your-secure-password
MYSQL_DATABASE=openml
MYSQL_PORT=3306
```

### Database Tables

```sql
-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  image VARCHAR(500),
  bio TEXT,
  active TINYINT DEFAULT 0,
  activation_code VARCHAR(255),
  session_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Passkeys table (WebAuthn)
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

-- User groups
CREATE TABLE user_groups (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE users_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  group_id INT NOT NULL
);
```

## Environment Variables

### Required for All Environments

```env
# NextAuth
NEXTAUTH_SECRET=your-random-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3050  # or your production URL

# OpenML REST API (for likes, data fetching)
NEXT_PUBLIC_OPENML_API_URL=https://www.openml.org
```

### OAuth (Optional)

```env
# GitHub OAuth
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Passkey/WebAuthn (Optional)

```env
RP_ID=localhost                    # or your domain
RP_ORIGIN=http://localhost:3050    # or your production URL
```

### Email (Optional, for registration confirmation)

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-email-password
EMAIL_FROM=noreply@openml.org
```

## API Routes

### Authentication Routes

| Route                       | Method | Description                 |
| --------------------------- | ------ | --------------------------- |
| `/api/auth/[...nextauth]`   | \*     | NextAuth.js handler         |
| `/api/auth/register`        | POST   | Email/password registration |
| `/api/auth/confirm`         | GET    | Email confirmation          |
| `/api/auth/forgot-password` | POST   | Request password reset      |
| `/api/auth/reset-password`  | POST   | Reset password with token   |

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
    // session.apikey  // For OpenML REST API calls
}
```

## User Flows

### Email/Password Registration

1. User fills registration form (first name, last name, email, password)
2. `POST /api/auth/register` creates user with `active=0`
3. Confirmation email sent with activation link
4. User clicks link → `GET /api/auth/confirm?code=xxx`
5. User activated, can now sign in

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

Passwords are hashed using **Argon2id** (memory-hard, GPU-resistant):

```typescript
import argon2 from 'argon2';

// Hash password
const hash = await argon2.hash(password);

// Verify password
const valid = await argon2.verify(hash, password);
```

### Session Security

- Sessions managed by NextAuth.js with JWT strategy
- Tokens stored in HTTP-only cookies (not localStorage)
- CSRF protection enabled by default

### Passkey Security

- Credentials stored server-side (public key only)
- Private key never leaves user's device
- Phishing-resistant (bound to origin)

## Deployment Environments

| Environment           | Database   | Auth Works?    |
| --------------------- | ---------- | -------------- |
| **Local dev**         | SQLite     | ✅ All methods |
| **Vercel (no MySQL)** | None       | ⚠️ OAuth only  |
| **Vercel + MySQL**    | TU/e MySQL | ✅ All methods |
| **TU/e Production**   | TU/e MySQL | ✅ All methods |

### Connecting Vercel to TU/e MySQL

1. Ensure TU/e MySQL is accessible from internet (IP whitelist or VPN)
2. Add `MYSQL_*` environment variables in Vercel dashboard
3. Deploy - users register in TU/e database directly

## Troubleshooting

### "Passkey not found in database"

- User needs to register a passkey first before signing in with it
- Check `user_passkeys` table has records

### "Invalid credentials"

- Verify password is correct
- Check user is active (`active=1` in database)
- Ensure password was hashed with Argon2

### "Registration failed"

- Check SMTP settings for confirmation emails
- Verify database is writable
- Check for duplicate email/username

### OAuth errors

- Verify OAuth app callback URLs match your domain
- Check client ID/secret are correct
- Ensure OAuth provider is enabled in NextAuth config

## File Structure

```
src/
├── app/api/auth/
│   ├── [...nextauth]/route.ts    # NextAuth configuration
│   ├── register/route.ts         # Email registration
│   ├── confirm/route.ts          # Email confirmation
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
│   ├── forgot-password-form.tsx
│   ├── reset-password-form.tsx
│   └── account-page.tsx
├── hooks/
│   └── use-auth.ts               # Unified auth hook
├── lib/
│   └── db.ts                     # Database abstraction
└── types/
    └── next-auth.d.ts            # NextAuth type extensions
```
