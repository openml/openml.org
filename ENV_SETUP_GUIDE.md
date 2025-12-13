# Environment Variables Setup Guide

## 📁 File Structure

```
openml.org/
├── .env.development    # Local development
├── .env.test          # Testing environment
├── .env.production    # Production deployment
└── .env               # Active environment (gitignored)
```

## 🚀 Quick Start

### For Development

```bash
cp .env.development .env
# Edit .env with your local values
npm run dev
```

### For Testing

```bash
cp .env.test .env
npm test
```

### For Production (Vercel/Cloud)

Don't use `.env` file! Set variables in deployment platform:

-   **Vercel**: Project Settings → Environment Variables
-   **AWS**: Elastic Beanstalk → Configuration
-   **Heroku**: Settings → Config Vars

## 🔑 Critical Variables to Change

### Development

1. **Database**: Use SQLite (default) or local PostgreSQL
2. **Email**: Use Mailtrap.io for testing emails
3. **CORS**: Keep `localhost:3000,localhost:5001`

### Production

1. **APP_SECRET_KEY**: Generate with `python -c "import secrets; print(secrets.token_urlsafe(32))"`
2. **JWT_SECRET_KEY**: Generate different key (same command)
3. **DATABASE_URI**: Use PostgreSQL (not SQLite!)
4. **CORS_ORIGINS**: Your actual domain(s)
5. **SMTP**: Real email service (SendGrid, AWS SES, etc.)
6. **OAUTHLIB_INSECURE_TRANSPORT**: MUST be `False`

## 🔒 Security Checklist

-   [ ] Changed default secret keys
-   [ ] Using HTTPS in production
-   [ ] CORS limited to your domains only
-   [ ] Database uses SSL connection
-   [ ] Email credentials secured
-   [ ] OAuth uses production credentials
-   [ ] `.env` files added to `.gitignore`

## 🌍 Environment-Specific URLs

### Development

-   Frontend: http://localhost:3000
-   Backend: http://localhost:5001
-   Elasticsearch: http://localhost:9200

### Production

-   Frontend: https://your-app.vercel.app
-   Backend: https://api.openml.org
-   Elasticsearch: https://es.openml.org

## 📝 Variable Reference

### Flask Backend Variables

| Variable         | Description                       | Required |
| ---------------- | --------------------------------- | -------- |
| `DATABASE_URI`   | Database connection string        | ✅       |
| `APP_SECRET_KEY` | Flask session encryption          | ✅       |
| `JWT_SECRET_KEY` | JWT token signing                 | ✅       |
| `SMTP_SERVER`    | Email server hostname             | ✅       |
| `CORS_ORIGINS`   | Allowed origins (comma-separated) | ✅       |

### Next.js Frontend Variables

| Variable                           | Description             | Required |
| ---------------------------------- | ----------------------- | -------- |
| `NEXT_PUBLIC_API_URL`              | Backend API endpoint    | ✅       |
| `NEXT_PUBLIC_ELASTICSEARCH_SERVER` | Elasticsearch endpoint  | ✅       |
| `NEXT_PUBLIC_URL_MINIO`            | Object storage endpoint | Optional |
| `NODE_ENV`                         | Environment mode        | ✅       |

## 🧪 Testing Email (Development)

Use [Mailtrap.io](https://mailtrap.io):

```env
SMTP_SERVER=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_LOGIN=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
```

## 🚨 Common Issues

### CORS Errors

-   Check `CORS_ORIGINS` includes your frontend URL
-   Ensure no trailing slashes
-   Use comma separation (no spaces)

### Database Connection Failed

-   PostgreSQL: Check connection string format
-   SQLite: Ensure file permissions
-   Production: Verify SSL requirements

### Email Not Sending

-   Development: Use Mailtrap.io
-   Production: Verify SMTP credentials
-   Check firewall allows port 587

## 📚 Additional Resources

-   [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
-   [Flask Configuration](https://flask.palletsprojects.com/en/2.3.x/config/)
-   [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
