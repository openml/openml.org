# Environment Variables - Quick Reference for Deployment

## 🚀 Complete List for Vercel/Production Deployment

Copy these to your deployment platform (Vercel Dashboard → Settings → Environment Variables):

### Required Environment Variables

```bash
# Flask Backend URL
FLASK_API_URL=https://api.openml.org

# Next.js API Configuration
NEXT_PUBLIC_API_URL=https://api.openml.org
NEXT_PUBLIC_URL_API=https://api.openml.org/api
NEXT_PUBLIC_URL_SITE_BACKEND=https://api.openml.org

# Elasticsearch Configuration
NEXT_PUBLIC_ENABLE_ELASTICSEARCH=true
NEXT_PUBLIC_ELASTICSEARCH_SERVER=https://es.openml.org
NEXT_PUBLIC_URL_ELASTICSEARCH=https://es.openml.org
ELASTICSEARCH_SERVER=https://es.openml.org
NEXT_PUBLIC_ELASTICSEARCH_VERSION_MAYOR=8

# MinIO/S3 Storage
NEXT_PUBLIC_ENABLE_MINIO=true
NEXT_PUBLIC_URL_MINIO=https://minio.openml.org

# OAuth
NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID=your-production-github-client-id

# Next.js Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# CORS (Backend)
CORS_ORIGINS=https://your-app.vercel.app,https://www.openml.org,https://openml.org
```

---

## 📋 For Local Development (.env file)

```bash
# Flask Backend URL
FLASK_API_URL=http://localhost:5001

# Next.js API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_URL_API=http://localhost:5001/api
NEXT_PUBLIC_URL_SITE_BACKEND=http://localhost:5001

# Elasticsearch Configuration
NEXT_PUBLIC_ENABLE_ELASTICSEARCH=true
NEXT_PUBLIC_ELASTICSEARCH_SERVER=http://localhost:9200
NEXT_PUBLIC_URL_ELASTICSEARCH=http://localhost:9200
ELASTICSEARCH_SERVER=http://localhost:9200
NEXT_PUBLIC_ELASTICSEARCH_VERSION_MAYOR=8

# MinIO/S3 Storage
NEXT_PUBLIC_ENABLE_MINIO=true
NEXT_PUBLIC_URL_MINIO=http://localhost:9000

# OAuth
NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID=your-github-dev-client-id

# Next.js Configuration
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# CORS (Backend)
CORS_ORIGINS=http://localhost:3000,http://localhost:5001,http://127.0.0.1:3000
```

---

## 🔧 Variable Explanations

| Variable                                  | Purpose                                     | Example Value                         |
| ----------------------------------------- | ------------------------------------------- | ------------------------------------- |
| `FLASK_API_URL`                           | Backend Flask server                        | `https://api.openml.org`              |
| `NEXT_PUBLIC_API_URL`                     | Main API endpoint (exposed to browser)      | `https://api.openml.org`              |
| `NEXT_PUBLIC_URL_API`                     | API with path (exposed to browser)          | `https://api.openml.org/api`          |
| `NEXT_PUBLIC_URL_SITE_BACKEND`            | Backend site URL (exposed to browser)       | `https://api.openml.org`              |
| `NEXT_PUBLIC_ENABLE_ELASTICSEARCH`        | Enable/disable Elasticsearch features       | `true` or `false`                     |
| `NEXT_PUBLIC_ELASTICSEARCH_SERVER`        | Elasticsearch endpoint (exposed to browser) | `https://es.openml.org`               |
| `NEXT_PUBLIC_URL_ELASTICSEARCH`           | Alt Elasticsearch URL (exposed to browser)  | `https://es.openml.org`               |
| `ELASTICSEARCH_SERVER`                    | Server-side Elasticsearch (NOT exposed)     | `https://es.openml.org`               |
| `NEXT_PUBLIC_ELASTICSEARCH_VERSION_MAYOR` | Elasticsearch major version                 | `8`                                   |
| `NEXT_PUBLIC_ENABLE_MINIO`                | Enable/disable MinIO features               | `true` or `false`                     |
| `NEXT_PUBLIC_URL_MINIO`                   | MinIO/S3 storage endpoint                   | `https://minio.openml.org`            |
| `NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID`      | GitHub OAuth client ID                      | Your OAuth client ID                  |
| `NODE_ENV`                                | Environment mode                            | `development` / `production`          |
| `NEXT_TELEMETRY_DISABLED`                 | Disable Next.js telemetry                   | `1` (disabled)                        |
| `CORS_ORIGINS`                            | Allowed CORS origins (comma-separated)      | `https://app.com,https://www.app.com` |

---

## ⚙️ Vercel Setup Instructions

1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Add each variable with appropriate values for each environment:
    - **Production**: Use production URLs
    - **Preview**: Optional - use staging URLs
    - **Development**: Use localhost URLs

### Example in Vercel:

```
Key: NEXT_PUBLIC_API_URL
Value (Production): https://api.openml.org
Value (Preview): https://staging-api.openml.org (optional)
Value (Development): http://localhost:5001
```

---

## 🔐 Security Notes

### Variables with `NEXT_PUBLIC_` prefix:

-   ✅ Exposed to browser (client-side)
-   ⚠️ DO NOT put secrets here (API keys, passwords, etc.)
-   Use for public URLs and configuration only

### Variables WITHOUT `NEXT_PUBLIC_` prefix:

-   🔒 Server-side only
-   Safe for secrets
-   Not accessible in browser

### CORS Setup:

-   Production: `CORS_ORIGINS=https://your-app.vercel.app`
-   Development: `CORS_ORIGINS=http://localhost:3000,http://localhost:5001`
-   Multiple domains: Comma-separated, no spaces

---

## 🧪 Testing Your Configuration

### Development

```bash
cp .env.development .env
npm run dev
# Visit http://localhost:3000
```

### Production (Vercel)

1. Set all environment variables in Vercel dashboard
2. Deploy: `vercel --prod`
3. Check deployment logs for any missing variables

---

## ❓ Troubleshooting

### "Failed to fetch" errors

-   Check `NEXT_PUBLIC_API_URL` matches your backend
-   Verify CORS settings on backend

### Elasticsearch not working

-   Confirm `NEXT_PUBLIC_ENABLE_ELASTICSEARCH=true`
-   Check `NEXT_PUBLIC_ELASTICSEARCH_SERVER` is accessible

### OAuth redirect issues

-   Verify `NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID` matches GitHub app settings
-   Update redirect URLs in GitHub OAuth app settings

---

## 📚 Related Files

-   `.env.development` - Development environment template
-   `.env.test` - Testing environment template
-   `.env.production` - Production environment template
-   `ENV_SETUP_GUIDE.md` - Comprehensive setup guide
