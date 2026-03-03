# Open Items — app-next

Last updated: 2026-03-02

## 0. Backend Team — Required Actions for Production

> **Context:** The Next.js migration adds three new sign-in methods (passkey, OAuth, email confirmation) without modifying any existing tables or columns. The only requirement is creating **three new tables** in the production MySQL database.

### New Tables to Create

Run these statements once on the production database. They are additive — no existing tables or columns are changed.

```sql
-- 1. Email confirmation tokens (used by email/password registration)
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

-- 2. Password reset tokens (used by forgot-password flow)
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

-- 3. Passkey credentials (used by WebAuthn/Passkey sign-up & sign-in)
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

### What happens without these tables?

| Missing table              | Feature that breaks                             |
| -------------------------- | ----------------------------------------------- |
| `email_confirmation_token` | Email/password registration (confirmation step) |
| `password_reset_token`     | Forgot password / reset password                |
| `user_passkeys`            | Passkey sign-up and sign-in (WebAuthn)          |

> **Note:** Traditional email/password **sign-in** (for existing users) still works without these tables — it only reads from the existing `users` table.

### What is NOT changed

- `users` table — **zero column or schema changes**. All queries use the existing Ion Auth columns.
- `groups` / `users_groups` — **no changes**. New users are assigned to group 2 (Regular User) using the existing pattern.
- `session_hash` column — already present in production. Accessed defensively (try/catch), so auth works even if it's missing.

### Local development

The local init script (`scripts/init-local-db.js`) already creates all tables including the three new ones. Run:

```bash
docker compose -f docker-compose.local.yml up -d
node scripts/init-local-db.js
```

### Architecture note — SQLite removed

The SQLite fallback (`better-sqlite3`) has been removed. Both local dev and production now require MySQL:

- **Local dev:** Docker MySQL via `docker-compose.local.yml` (set `DATABASE_URL` in `.env.local`)
- **Production:** MySQL via `DATABASE_URL` or `MYSQL_*` env vars

The app will throw a clear error on startup if no database is configured.

---

## 1. Auth & Infrastructure

| Item               | Status      | File                                         | Details                                           |
| ------------------ | ----------- | -------------------------------------------- | ------------------------------------------------- |
| Avatar upload      | Temporary   | `api/upload-avatar-vercel/route.ts`          | Needs Flask `/image` endpoint for production.     |
| Passkey login      | Placeholder | `api/auth/passkey/login-verify/route.ts:103` | Uses placeholder token. NextAuth handles session. |
| Dashboard redirect | Fixed       | `dashboard/user-dashboard.tsx`               | `/auth/signin` → `/auth/sign-in`                  |

## Extras improvements

### Dataset Edit Form - Markdown Preview

**Current state**: The dataset edit form (`dataset-edit-form.tsx`) has a plain `<Textarea>` for the description field.

**Enhancement opportunity**: The legacy React app (`server/src/client/app/src/pages/auth/DataEdit.js`) includes a nice 2-tab interface for editing descriptions with Markdown:

- **Tab 1 "Description"**: Edit mode with raw Markdown syntax
- **Tab 2 "Preview"**: Rendered preview using `ReactMarkdown`
- Includes a Markdown icon linking to GitHub's Markdown guide

**Implementation**:

- Add tabs component (Edit/Preview) for the description field
- Use `react-markdown` or similar library for preview rendering
- Add Markdown helper icon/link for user guidance
- Consider applying to other multiline text fields (citation, etc.)

**Files affected**:

- `app-next/src/components/dataset/dataset-edit-form.tsx`

**Priority**: Low (nice-to-have UX improvement)
