# OpenML Next.js - Deployment Roadmap

## Strategy

**Phase 1 (NOW)**: OpenML credentials login → Vercel + Development  
**Phase 2 (LATER)**: OAuth + Sign-up → TU/e Production

---

## Phase 1: OpenML Credentials Login ✅

### Status

- ✅ Development working (localhost:3050)
- 🔄 Vercel ready for testing
- ⏳ TU/e backend needs CORS update

### Required Backend Changes

**CORS Configuration** (Flask):

```python
CORS_ORIGINS = [
    "https://openmlorg.vercel.app",
    "https://www.openml.org",
    "http://localhost:3050"
]
```

**Endpoints** (should exist):

- `POST /login` → Returns JWT
- `GET /profile` → Returns user data (needs JWT in Authorization header)
- `POST /image` → Avatar upload (optional)

### Testing Checklist

- [ ] Login at `https://openmlorg.vercel.app/auth/signin`
- [ ] Avatar/initials appear in header
- [ ] Profile page loads (`/auth/profile`)
- [ ] Session persists across navigation
- [ ] Logout works
- [ ] No CORS errors in console

---

## Phase 2: OAuth & Sign-Up (Prepared)

### Frontend Status

✅ Code implemented, needs production config

### Backend Requirements

#### 1. GitHub OAuth

**Create OAuth App**:

```
URL: https://github.com/settings/developers
Homepage: https://www.openml.org
Callback: https://www.openml.org/api/auth/callback/github
```

**Environment Variables**:

```bash
GITHUB_ID=<client_id>
GITHUB_SECRET=<client_secret>
```

**Backend Endpoint** (`POST /auth/oauth/github`):

```python
# Request body:
{
  "provider": "github",
  "providerId": "12345678",
  "email": "user@example.com",
  "name": "John Doe",
  "image": "https://avatars.githubusercontent.com/..."
}

# Response:
{
  "access_token": "jwt_token",
  "id": 123,
  "username": "johndoe"
}

# Logic:
# 1. Find/create user by providerId or email
# 2. Link OAuth provider to account
# 3. Return JWT
```

#### 2. Google OAuth (Optional)

**Create OAuth App**:

```
URL: https://console.cloud.google.com/
Authorized origins: https://www.openml.org
Callback: https://www.openml.org/api/auth/callback/google
```

**Environment Variables**:

```bash
GOOGLE_ID=<client_id>
GOOGLE_SECRET=<client_secret>
```

**Backend**: Same as GitHub, endpoint `/auth/oauth/google`

#### 3. Email Verification

**SMTP Configuration**:

```bash
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SMTP_LOGIN=apikey
SMTP_PASS=<sendgrid_api_key>
EMAIL_SENDER=noreply@openml.org
```

**Backend Endpoints**:

- `POST /register` → Create inactive user, send verification email
- `GET /verify-email/<token>` → Activate account

#### 4. Database Schema

```sql
-- OAuth linking (option 1: add columns to users table)
ALTER TABLE users ADD oauth_provider VARCHAR(50);
ALTER TABLE users ADD oauth_provider_id VARCHAR(255);
ALTER TABLE users ADD email_verified BOOLEAN DEFAULT FALSE;

-- OAuth linking (option 2: separate table)
CREATE TABLE oauth_providers (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  provider VARCHAR(50),
  provider_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Security Checklist (Production)

```python
# Flask
JWT_SECRET_KEY = <strong_random_32+_chars>
APP_SECRET_KEY = <different_strong_random>
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# CORS (production only)
CORS_ORIGINS = ["https://www.openml.org", "https://openml.org"]

# Database
DATABASE_URI = "postgresql://..."  # SSL enabled
```

---

## Current Status

| Feature         | Dev | Vercel | Production |
| --------------- | --- | ------ | ---------- |
| OpenML Login    | ✅  | 🔄     | ⏳ CORS    |
| Avatar/Initials | ✅  | ✅     | ✅         |
| Profile Display | ✅  | ✅     | ✅         |
| Logout          | ✅  | ✅     | ✅         |
| GitHub OAuth    | ⚠️  | ❌     | ⏳ Setup   |
| Google OAuth    | ❌  | ❌     | ⏳ Setup   |
| Sign Up         | ⚠️  | ❌     | ⏳ SMTP    |

**Legend**: ✅ Working | 🔄 Ready | ⚠️ Partial | ❌ Not configured | ⏳ Needs setup

---

## Next Steps

### Immediate (This Week)

1. Push to Vercel: `git push origin clean-app-next-v2`
2. Backend: Add Vercel domain to CORS
3. Test login flow on Vercel
4. Document issues

### Future (Before TU/e Production)

1. Create GitHub OAuth app
2. Configure SMTP (SendGrid recommended)
3. Implement backend OAuth endpoints
4. Update database schema
5. Configure production secrets

---

**Version**: 1.0  
**Updated**: Dec 18, 2025  
**Status**: Phase 1 ready for Vercel testing
