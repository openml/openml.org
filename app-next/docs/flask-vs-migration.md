## Complete List: Flask-Dependent vs Migrated Features

### ✅ Already Migrated (No Flask Needed)

| Feature                | Implementation                  | Env Vars Needed                          |
| ---------------------- | ------------------------------- | ---------------------------------------- |
| Login (email/password) | Direct DB (Argon2i verification)| `DATABASE_URL`                           |
| Registration           | Direct DB insert                | `DATABASE_URL` + `SMTP_*`               |
| Email confirmation     | Direct DB (token-based)         | `DATABASE_URL`                           |
| Forgot password        | Direct DB + email               | `DATABASE_URL` + `SMTP_*`               |
| Reset password         | Direct DB (Argon2i hashing)     | `DATABASE_URL`                           |
| OAuth (Google/GitHub)  | NextAuth + Direct DB            | `DATABASE_URL` + `GITHUB_*` + `GOOGLE_*` |
| Passkey signup/login   | Direct DB (WebAuthn)            | `DATABASE_URL` + `RP_ID` + `RP_ORIGIN`   |
| Profile updates        | Direct DB                       | `DATABASE_URL`                           |
| Avatar upload          | Direct filesystem/Vercel Blob   | `BLOB_READ_WRITE_TOKEN` (Vercel only)   |
| Search/Data            | Elasticsearch + OpenML REST API | `NEXT_PUBLIC_URL_ELASTICSEARCH`          |
| User profiles          | Elasticsearch                   | `NEXT_PUBLIC_URL_ELASTICSEARCH`          |

### 🔧 Still Uses Flask (Could Be Migrated)

| Feature                  | Current          | Migration Effort | Env Vars After Migration |
| ------------------------ | ---------------- | ---------------- | ------------------------ |
| **API key regeneration** | Proxies to Flask | Easy             | `DATABASE_URL`           |
| **API key fetch**        | Proxies to Flask | Easy             | `DATABASE_URL`           |

### ❌ Not Migratable (Requires OpenML REST API)

| Feature             | Reason                              | Env Vars Needed                      |
| ------------------- | ----------------------------------- | ------------------------------------ |
| **Likes**           | Must call OpenML REST API           | `DATABASE_URL` (for valid API key)   |
| **Data uploads**    | OpenML REST API handles processing  | `DATABASE_URL` (for valid API key)   |
| **Run submissions** | OpenML REST API handles ML pipeline | `DATABASE_URL` (for valid API key)   |

---

**Minimal `.env` for full functionality:**

```env
# Database
DATABASE_URL=mysql://user:pass@host:3306/openml

# NextAuth
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3050   # Must match where the app actually runs

# Email (for registration confirmation & password reset)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
SMTP_FROM=OpenML <your-email@example.com>

# OAuth
GITHUB_ID=xxx
GITHUB_SECRET=xxx
GOOGLE_ID=xxx
GOOGLE_SECRET=xxx

# Passkey
RP_ID=localhost
RP_ORIGIN=http://localhost:3050

# Storage (Vercel only)
BLOB_READ_WRITE_TOKEN=xxx
```
