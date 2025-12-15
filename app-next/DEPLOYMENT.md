# Deploying app-next to Vercel

## Quick Start

### 1. Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your `openml.org` repository
4. Select the **app-next** directory as the root directory
5. Framework Preset: **Next.js** (auto-detected)
6. Click **Deploy**

### 3. Configure Environment Variables

After deployment, go to **Project Settings** → **Environment Variables** and add:

#### Minimal Configuration (Using Public OpenML API)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://www.openml.org
NEXT_PUBLIC_URL_API=https://www.openml.org/api/v1
NEXT_PUBLIC_URL_SITE_BACKEND=https://www.openml.org

# Elasticsearch
NEXT_PUBLIC_ENABLE_ELASTICSEARCH=true
NEXT_PUBLIC_ELASTICSEARCH_SERVER=https://www.openml.org/es
NEXT_PUBLIC_URL_ELASTICSEARCH=https://www.openml.org/es
NEXT_PUBLIC_ELASTICSEARCH_VERSION_MAYOR=8

# MinIO (File Storage)
NEXT_PUBLIC_ENABLE_MINIO=true
NEXT_PUBLIC_URL_MINIO=https://www.openml.org/data

# Node Environment
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

For each variable:

- Click **Add New**
- Enter **Name** and **Value**
- Select: **Production**, **Preview**, **Development**
- Click **Save**

### 4. Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click **⋯** on latest deployment
3. Click **Redeploy**

Your app will be live at `https://your-project.vercel.app`

---

## Optional Configurations

### Analytics (Recommended)

#### Vercel Analytics

Automatically enabled on Vercel. No configuration needed.

#### Google Analytics

Add to environment variables:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### OAuth Login (GitHub)

1. Create GitHub OAuth App:
   - Go to: https://github.com/settings/developers
   - Click **New OAuth App**
   - **Application name**: OpenML
   - **Homepage URL**: https://your-project.vercel.app
   - **Authorization callback URL**: https://your-project.vercel.app/api/auth/github/callback
   - Click **Register application**
   - Copy **Client ID** and generate **Client Secret**

2. Add to Vercel environment variables:

```bash
NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID=your_github_client_id
GITHUB_OAUTH_CLIENT_SECRET=your_github_client_secret
```

### Error Tracking (Sentry)

1. Create Sentry project at [sentry.io](https://sentry.io)
2. Get your DSN
3. Add to environment variables:

```bash
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### Custom Domain

1. Go to **Settings** → **Domains**
2. Add your domain (e.g., `openml.org`)
3. Update DNS records as instructed by Vercel
4. Vercel automatically provisions SSL certificate

---

## Advanced: Deploy Your Own Backend

If you want to deploy the Python backend (`server/`) separately:

### Option 1: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Select `server/` directory
4. Add environment variables (PostgreSQL, etc.)
5. Deploy

### Option 2: Fly.io

```bash
cd server
fly launch
fly deploy
```

### Update Frontend Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_URL_API=https://your-backend.railway.app/api/v1
NEXT_PUBLIC_URL_SITE_BACKEND=https://your-backend.railway.app
```

---

## Troubleshooting

### Build Errors

**Issue**: Module not found errors

- **Solution**: Check `package.json` dependencies are installed
- Run `npm install` locally to verify

**Issue**: Environment variable not found

- **Solution**: Ensure variables starting with `NEXT_PUBLIC_` are set in Vercel

### Runtime Errors

**Issue**: API calls failing

- **Solution**: Check CORS settings on backend
- Verify `NEXT_PUBLIC_API_URL` is correct

**Issue**: Images not loading

- **Solution**: Verify `remotePatterns` in `next.config.ts`
- Check MinIO URL is correct

### Performance Issues

**Issue**: Slow page loads

- **Solution**: Enable Vercel Analytics to identify bottlenecks
- Use dynamic imports for heavy components:
  ```tsx
  const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
    loading: () => <Loader />,
  });
  ```

---

## Monitoring

### Vercel Dashboard

Monitor your deployment:

- **Analytics**: Page views, performance metrics
- **Logs**: Runtime logs and errors
- **Deployments**: Build history and status

### Health Checks

Create a health check endpoint:

```tsx
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: "ok", timestamp: new Date().toISOString() });
}
```

Test: `https://your-project.vercel.app/api/health`

---

## Security Checklist

- [ ] Environment variables set in Vercel (not in `.env.production`)
- [ ] Secrets (API keys, OAuth secrets) are private
- [ ] CORS configured correctly on backend
- [ ] OAuth callback URLs match deployment domain
- [ ] CSP headers configured (if needed)
- [ ] Rate limiting on API routes (if applicable)

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure environment variables
3. ✅ Test all pages and functionality
4. ⬜ Add custom domain
5. ⬜ Enable analytics
6. ⬜ Set up error tracking (Sentry)
7. ⬜ Configure OAuth for login
8. ⬜ Monitor performance and errors

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **OpenML GitHub**: https://github.com/openml/openml.org
