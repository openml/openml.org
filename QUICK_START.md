# Quick Start: Local Testing Environment

This guide gets you up and running with local testing in **5 minutes**.

## 1. Start Services (30 seconds)

```bash
# From project root
docker-compose -f docker-compose.local.yml up -d

# Verify services are running
docker ps
# Should see: openml-mysql-local and openml-mailhog
```

**Check services:**
- MailHog UI: http://localhost:8025 (email inbox)
- MySQL: localhost:3306

## 2. Initialize Database (30 seconds)

```bash
cd app-next

# Install dependencies if needed
npm install mysql2 bcryptjs

# Create database tables
node scripts/init-local-db.js
```

## 3. Configure Environment (1 minute)

```bash
# Copy example to .env.local
cp .env.local.example .env.local

# Generate session secret
openssl rand -base64 32

# Edit .env.local and replace SESSION_SECRET with generated value
```

## 4. Create Test User (30 seconds)

```bash
# Create test user with confirmed email
node scripts/create-test-user.js

# Output will show:
# Email: test@example.com
# Password: testpassword123
# API Key: [generated]
```

**Or create custom user:**
```bash
node scripts/create-test-user.js your@email.com yourpassword123
```

## 5. Start Development Server (30 seconds)

```bash
npm run dev
```

Visit: **http://localhost:3050**

## ✅ You're Ready!

### Test the Setup

1. **Login** with test account:
   - Email: `test@example.com`
   - Password: `testpassword123`

2. **Check MailHog** at http://localhost:8025
   - All emails sent by the app appear here

3. **Verify Database**:
   ```bash
   mysql -h 127.0.0.1 -u openml -popenml_local_pass openml_local

   mysql> SELECT email, email_confirmed FROM user;
   ```

## Next: Implement Features

Now that testing environment is ready, implement:

1. **Email Confirmation** (Week 1)
   - See: `docs/EMAIL_CONFIRMATION_IMPLEMENTATION.md` (coming next)

2. **Password Reset** (Week 2)
   - After email confirmation is tested

3. **API Key Regeneration** (Week 3)
   - Simplest feature, do last

## Common Commands

```bash
# Stop services (keep data)
docker-compose -f docker-compose.local.yml stop

# Restart services
docker-compose -f docker-compose.local.yml restart

# View logs
docker logs openml-mysql-local
docker logs openml-mailhog

# Clean start (removes all data)
docker-compose -f docker-compose.local.yml down -v
node scripts/init-local-db.js
node scripts/create-test-user.js

# Create additional test users
node scripts/create-test-user.js user2@example.com pass123
node scripts/create-test-user.js user3@example.com pass456 false  # unconfirmed email
```

## Troubleshooting

### Port 3306 already in use
```bash
# Stop local MySQL if running
brew services stop mysql  # macOS
sudo service mysql stop   # Linux

# Or change port in docker-compose.local.yml to "3307:3306"
# Then update .env.local: DATABASE_URL=...@localhost:3307/...
```

### Can't connect to database
```bash
# Wait for MySQL to fully start (takes ~10 seconds)
docker logs openml-mysql-local

# Look for: "MySQL init process done. Ready for start up."
```

### MailHog not showing emails
```bash
# Check SMTP_PORT in .env.local is 1025
grep SMTP_PORT .env.local

# Verify MailHog is running
curl http://localhost:8025
```

## What's Next?

Once local testing works, you'll implement email confirmation. The workflow will be:

1. Add email confirmation endpoint
2. Test locally with MailHog
3. See confirmation emails at http://localhost:8025
4. Click confirmation links
5. Verify in database

**Full details coming in EMAIL_CONFIRMATION_IMPLEMENTATION.md**
