# Local Testing Setup Guide

This guide sets up a complete local testing environment for developing authentication features (email confirmation, password reset, API key regeneration).

## Prerequisites

- Docker Desktop installed
- Node.js 18+ installed
- MySQL client (optional, for direct DB access)

## Step 1: Start Local Services with Docker Compose

Create `docker-compose.local.yml` in project root:

```yaml
version: '3.8'

services:
  # MySQL database for local development
  mysql:
    image: mysql:8.0
    container_name: openml-mysql-local
    environment:
      MYSQL_ROOT_PASSWORD: openml_local_root
      MYSQL_DATABASE: openml_local
      MYSQL_USER: openml
      MYSQL_PASSWORD: openml_local_pass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    command: --default-authentication-plugin=mysql_native_password

  # MailHog - catches all emails sent locally
  mailhog:
    image: mailhog/mailhog:latest
    container_name: openml-mailhog
    ports:
      - "1025:1025"  # SMTP server
      - "8025:8025"  # Web UI
    environment:
      MH_STORAGE: maildir
      MH_MAILDIR_PATH: /maildir
    volumes:
      - mailhog_data:/maildir

volumes:
  mysql_data:
  mailhog_data:
```

Start services:
```bash
docker-compose -f docker-compose.local.yml up -d
```

Verify services are running:
```bash
docker ps
# Should see both mysql and mailhog containers running

# Check MailHog web UI
open http://localhost:8025  # macOS
# or visit http://localhost:8025 in browser
```

## Step 2: Initialize Local Database

Run the database initialization script:

```bash
cd app-next

# Install mysql2 if not already installed
npm install mysql2

# Create database tables
node -e "
const mysql = require('mysql2/promise');

async function initDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'openml',
    password: 'openml_local_pass',
    database: 'openml_local'
  });

  console.log('✅ Connected to MySQL');

  // Create user table (basic structure from Flask schema)
  await connection.execute(\`
    CREATE TABLE IF NOT EXISTS user (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      username VARCHAR(100) UNIQUE,
      api_key VARCHAR(64) UNIQUE,
      email_confirmed BOOLEAN DEFAULT FALSE,
      email_confirmed_on DATETIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_api_key (api_key)
    )
  \`);
  console.log('✅ Created user table');

  // Create email confirmation tokens table
  await connection.execute(\`
    CREATE TABLE IF NOT EXISTS email_confirmation_token (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      token VARCHAR(255) NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
      INDEX idx_token (token),
      INDEX idx_expires (expires_at)
    )
  \`);
  console.log('✅ Created email_confirmation_token table');

  // Create password reset tokens table
  await connection.execute(\`
    CREATE TABLE IF NOT EXISTS password_reset_token (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      token VARCHAR(255) NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
      INDEX idx_token (token),
      INDEX idx_expires (expires_at)
    )
  \`);
  console.log('✅ Created password_reset_token table');

  await connection.end();
  console.log('✅ Database initialization complete');
}

initDatabase().catch(console.error);
"
```

## Step 3: Configure Environment Variables

Create `app-next/.env.local`:

```bash
# Database
DATABASE_URL=mysql://openml:openml_local_pass@localhost:3306/openml_local

# Email (MailHog)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_FROM=OpenML <noreply@openml.org>

# Application
NEXT_PUBLIC_URL=http://localhost:3050
NODE_ENV=development

# Existing API endpoints
NEXT_PUBLIC_OPENML_API_URL=https://www.openml.org
NEXT_PUBLIC_URL_ELASTICSEARCH=https://www.openml.org/es/

# Session secret (generate with: openssl rand -base64 32)
SESSION_SECRET=your-random-secret-here-generate-with-openssl
```

## Step 4: Test the Setup

### Test MySQL Connection:
```bash
# Using MySQL client (if installed)
mysql -h 127.0.0.1 -u openml -popenml_local_pass openml_local -e "SHOW TABLES;"

# Should show: user, email_confirmation_token, password_reset_token
```

### Test MailHog:
1. Visit http://localhost:8025
2. You should see the MailHog web interface (inbox will be empty initially)
3. All emails sent to localhost:1025 will appear here

## Step 5: Create Test User

```bash
node -e "
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function createTestUser() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'openml',
    password: 'openml_local_pass',
    database: 'openml_local'
  });

  const hashedPassword = await bcrypt.hash('testpassword123', 10);
  const apiKey = crypto.randomBytes(32).toString('hex');

  await connection.execute(
    'INSERT INTO user (email, password, first_name, last_name, username, api_key, email_confirmed) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ['test@example.com', hashedPassword, 'Test', 'User', 'testuser', apiKey, true]
  );

  console.log('✅ Created test user:');
  console.log('   Email: test@example.com');
  console.log('   Password: testpassword123');
  console.log('   API Key:', apiKey);

  await connection.end();
}

createTestUser().catch(console.error);
"
```

## Step 6: Start Next.js Development Server

```bash
cd app-next
npm run dev
```

Visit http://localhost:3050

## Testing Workflow

### Test Email Confirmation (once implemented):
1. Register new user at http://localhost:3050/register
2. Check MailHog at http://localhost:8025 for confirmation email
3. Click the confirmation link from MailHog
4. Verify user can log in

### Test Password Reset (once implemented):
1. Go to http://localhost:3050/forgot-password
2. Enter email address
3. Check MailHog for reset email
4. Click reset link
5. Set new password
6. Log in with new password

### Test API Key Regeneration (once implemented):
1. Log in as test user
2. Go to settings page
3. Click "Regenerate API Key"
4. Verify new key works for API calls

## Troubleshooting

### MySQL Connection Refused:
```bash
# Check if MySQL is running
docker ps | grep mysql

# Check MySQL logs
docker logs openml-mysql-local

# Restart MySQL
docker-compose -f docker-compose.local.yml restart mysql
```

### MailHog Not Receiving Emails:
```bash
# Check MailHog is running
docker ps | grep mailhog

# Check MailHog logs
docker logs openml-mailhog

# Verify SMTP_PORT=1025 in .env.local
```

### Database Connection Errors:
```bash
# Verify credentials in .env.local match docker-compose.local.yml
# Test connection manually:
mysql -h 127.0.0.1 -u openml -popenml_local_pass openml_local
```

## Stopping Services

```bash
# Stop services but keep data
docker-compose -f docker-compose.local.yml stop

# Stop and remove services (keeps volumes)
docker-compose -f docker-compose.local.yml down

# Remove everything including data (fresh start)
docker-compose -f docker-compose.local.yml down -v
```

## Next Steps

Once local testing environment is working:
1. Implement email confirmation feature
2. Implement password reset feature
3. Implement API key regeneration feature
4. Move to preview/staging testing
5. Deploy to production
