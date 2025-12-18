# Backend Team Checklist

## Phase 1: Enable Vercel Testing (This Week)

### CORS Update

```python
# Add to Flask app configuration
CORS_ORIGINS = [
    "https://openmlorg.vercel.app",
    "https://openmlorg-*.vercel.app",  # Preview deployments
    "https://www.openml.org",
    "http://localhost:3050"  # Dev
]
```

### Verify Endpoints

- [ ] `POST /login` - Returns JWT on valid credentials
- [ ] `GET /profile` - Returns user data with valid JWT
- [ ] `POST /image` - Avatar upload (optional for Phase 1)

### Test

```bash
# Login
curl -X POST https://www.openml.org/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"xxx"}'

# Profile
curl https://www.openml.org/profile \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Phase 2: OAuth & Sign-Up (Before Production)

### 1. GitHub OAuth App

- [ ] Create at https://github.com/settings/developers
- [ ] Homepage: `https://www.openml.org`
- [ ] Callback: `https://www.openml.org/api/auth/callback/github`
- [ ] Add env vars: `GITHUB_ID`, `GITHUB_SECRET`

### 2. Backend OAuth Endpoint

```python
@app.route('/auth/oauth/github', methods=['POST'])
def github_oauth():
    """
    Request: {
        "provider": "github",
        "providerId": "12345678",
        "email": "user@example.com",
        "name": "John Doe",
        "image": "https://..."
    }

    Response: {
        "access_token": "jwt...",
        "id": 123,
        "username": "johndoe"
    }
    """
    # Logic:
    # 1. Find user by oauth_provider_id or email
    # 2. Create if new, link if existing
    # 3. Generate and return JWT
```

### 3. Database Schema

```sql
-- Option 1: Columns in users table
ALTER TABLE users ADD oauth_provider VARCHAR(50);
ALTER TABLE users ADD oauth_provider_id VARCHAR(255);
ALTER TABLE users ADD email_verified BOOLEAN DEFAULT FALSE;

-- Option 2: Separate oauth table (recommended)
CREATE TABLE oauth_providers (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  provider VARCHAR(50),
  provider_id VARCHAR(255),
  UNIQUE(provider, provider_id)
);
```

### 4. Email Verification

**SMTP**:

- [ ] Configure SendGrid/AWS SES
- [ ] Set env vars: `SMTP_SERVER`, `SMTP_PORT`, `SMTP_LOGIN`, `SMTP_PASS`

**Endpoints**:

```python
@app.route('/register', methods=['POST'])
def register():
    # 1. Create user (email_verified=False)
    # 2. Generate verification token
    # 3. Send email
    # 4. Return 201

@app.route('/verify-email/<token>')
def verify_email(token):
    # 1. Validate token
    # 2. Set email_verified=True
    # 3. Redirect to /auth/signin
```

### 5. Security

```python
# Production only
JWT_SECRET_KEY = os.urandom(32).hex()  # Generate once, store in env
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# CORS - remove dev URLs
CORS_ORIGINS = ["https://www.openml.org", "https://openml.org"]
```

---

## Timeline

| Task                   | When        | Owner              |
| ---------------------- | ----------- | ------------------ |
| CORS update            | This week   | Backend            |
| Test Vercel deployment | This week   | Frontend + Backend |
| GitHub OAuth app       | Before prod | DevOps/Admin       |
| OAuth backend endpoint | Before prod | Backend            |
| Database migration     | Before prod | Backend            |
| SMTP config            | Before prod | DevOps             |
| Security audit         | Before prod | Backend            |

---

## Contact

Questions? Ping frontend dev or check `TEAM_ROADMAP.md`
