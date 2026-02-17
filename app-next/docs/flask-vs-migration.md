## Complete List: Flask-Dependent vs Migrated Features

### ✅ Already Migrated (No Flask Needed)

| Feature                | Implementation                  | Env Vars Needed                         |
| ---------------------- | ------------------------------- | --------------------------------------- |
| Login (email/password) | Direct DB (Argon2 verification) | `MYSQL_*`                               |
| Registration           | Direct DB insert                | `MYSQL_*` + `SMTP_*`                    |
| OAuth (Google/GitHub)  | NextAuth + Direct DB            | `MYSQL_*` + `GITHUB_*` + `GOOGLE_*`     |
| Passkey signup/login   | Direct DB (WebAuthn)            | `MYSQL_*` + `RP_ID` + `RP_ORIGIN`       |
| Profile updates        | Direct DB                       | `MYSQL_*`                               |
| Avatar upload          | Direct filesystem/Vercel Blob   | `BLOB_READ_WRITE_TOKEN` (Vercel only)\* |
| Search/Data            | Elasticsearch + OpenML REST API | `NEXT_PUBLIC_ELASTICSEARCH_SERVER`      |
| User profiles          | Elasticsearch                   | `NEXT_PUBLIC_ELASTICSEARCH_SERVER`      |

-| File uploads (datasets) | Direct filesystem/MinIO/S3 | `S3_*` or `MINIO_*` (production) |

### 🔧 Still Uses Flask (Could Be Migrated)

| Feature                  | Current          | Migration Effort | Env Vars After Migration |
| ------------------------ | ---------------- | ---------------- | ------------------------ |
| **Forgot password**      | Proxies to Flask | Medium           | `MYSQL_*` + `SMTP_*`     |
| **Reset password**       | Proxies to Flask | Medium           | `MYSQL_*` + `SMTP_*`     |
| **API key regeneration** | Proxies to Flask | Easy             | `MYSQL_*`                |
| **API key fetch**        | Proxies to Flask | Easy             | `MYSQL_*`                |

### ❌ Not Migratable (Requires OpenML REST API)

| Feature             | Reason                              | Env Vars Needed               |
| ------------------- | ----------------------------------- | ----------------------------- |
| **Likes**           | Must call OpenML REST API           | `MYSQL_*` (for valid API key) |
| **Data uploads**    | OpenML REST API handles processing  | `MYSQL_*` (for valid API key) |
| **Run submissions** | OpenML REST API handles ML pipeline | `MYSQL_*` (for valid API key) |

---

**Minimal `.env` for full functionality (after migration):**

```env
# Database
MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT

# Email
SMTP_SERVER, SMTP_PORT, SMTP_LOGIN, SMTP_PASS, EMAIL_SENDER

# OAuth
GITHUB_ID, GITHUB_SECRET, GOOGLE_ID, GOOGLE_SECRET

# Passkey
RP_ID, RP_ORIGIN

# Storage (Vercel)
BLOB_READ_WRITE_TOKEN
```
