# OpenML.org Deployment Strategy & Implementation Roadmap

## 🎯 Strategy Overview

### Phase 1: OpenML Credentials Login (NOW - Development + Vercel)

**Goal**: Users can login with existing OpenML.org credentials and see their profile with avatar/initials

**Status**: ✅ Ready to deploy

### Phase 2: OAuth & Sign Up (LATER - Final TU/e Production)

**Goal**: Add GitHub/Google OAuth and new account registration

**Status**: 🔧 Prepared, needs production configuration

---

## 📋 Phase 1: OpenML Credentials Login (PRIORITY)

### ✅ What's Already Working

#### Development (localhost:3050)

- ✅ Login form at `/auth/signin`
- ✅ Calls Flask backend `/login` endpoint
- ✅ JWT token stored in NextAuth session
- ✅ Profile page loads user data from backend
- ✅ Avatar upload to Flask backend `/image`
- ✅ Initials fallback when no avatar
- ✅ Session persists across pages
- ✅ Logout functionality

#### Components Ready

- ✅ Sidebar shows user avatar/initials
- ✅ Header avatar button (top-right)
- ✅ User Activity Sidebar (Kaggle-style)
- ✅ Profile settings page
- ✅ Responsive on mobile/desktop

---

### 🔧 Phase 1: What Needs to Be Done

#### 1. Environment Variables (Vercel)

**Already Set** ✅:

```bash
NEXT_PUBLIC_API_URL=https://www.openml.org
NEXT_PUBLIC_URL_API=https://www.openml.org/api/v1
NEXT_PUBLIC_URL_SITE_BACKEND=https://www.openml.org
```

**Verify on Vercel Dashboard**:

- Settings → Environment Variables
- All 13 variables present
- Applied to: Production, Preview, Development

#### 2. Test Login Flow on Vercel

**Steps**:

1. Deploy to Vercel (already done)
2. Go to `https://openmlorg.vercel.app/auth/signin`
3. Login with OpenML credentials
4. Verify:
   - ✅ User redirected to homepage or dashboard
   - ✅ Avatar/initials appear in top-right
   - ✅ Profile page shows correct data
   - ✅ Logout works

#### 3. Backend Requirements (OpenML.org)

**Required Endpoints** (should already exist):

- `POST /login` - Accepts email/username + password, returns JWT
- `GET /profile` - Returns user profile (requires JWT in Authorization header)
- `POST /image` - Avatar upload (requires JWT)
- `POST /api-key/regenerate` - API key management

**CORS Configuration**:

```python
# Flask backend needs to allow Vercel domain
CORS_ORIGINS = [
    "https://openmlorg.vercel.app",
    "https://www.openml.org",
    "http://localhost:3050"  # For development
]
```

#### 4. Image Domain Configuration

**Already configured** ✅:

```typescript
// next.config.ts
images: {
  remotePatterns: [
    { hostname: "www.openml.org" }, // OpenML avatars
    { hostname: "avatars.githubusercontent.com" }, // GitHub (for Phase 2)
    { hostname: "lh3.googleusercontent.com" }, // Google (for Phase 2)
  ];
}
```

---

## 🚀 Phase 1 Deployment Checklist

### Before Deploying to Vercel

- [x] Environment variables set in Vercel
- [x] Login with OpenML credentials works in development
- [x] Avatar upload works in development
- [x] Profile page displays correctly
- [x] Session persists across page navigation
- [x] Logout functionality works
- [ ] Test on Vercel preview deployment
- [ ] Verify CORS allows Vercel domain

### Testing on Vercel Preview

1. **Login Test**:

   ```
   URL: https://openmlorg.vercel.app/auth/signin
   Credentials: Use real OpenML account
   Expected: Successful login, redirect to home
   ```

2. **Profile Display**:

   ```
   Check: Avatar/initials in header
   Check: User name in sidebar
   Check: Profile page loads (/auth/profile)
   ```

3. **Avatar Upload** (if needed):

   ```
   Note: Will use Vercel Blob Storage (auto-configured)
   Expected: Upload successful, image appears
   ```

4. **Session Persistence**:
   ```
   Navigate: Home → Datasets → Profile → Logout
   Expected: User stays logged in until logout
   ```

---

## 📝 Phase 2: OAuth & Sign Up (PREPARED FOR PRODUCTION)

### 🔧 Already Implemented (Code Ready)

#### OAuth Login

**GitHub OAuth**:

- ✅ Provider configured in NextAuth
- ✅ Callback route: `/api/auth/callback/github`
- ✅ Calls backend `/auth/oauth/github` after OAuth
- ✅ Profile picture loaded from GitHub
- ⚠️ Needs production credentials

**Google OAuth**:

- ✅ Provider configured in NextAuth
- ✅ Callback route: `/api/auth/callback/google`
- ✅ Calls backend `/auth/oauth/google`
- ⚠️ Needs credentials (not tested yet)

#### Sign Up Form

- ✅ Form at `/auth/sign-up`
- ✅ Fields: First name, Last name, Email, Password
- ✅ Calls backend `POST /register`
- ⚠️ Needs email verification service

---

### 📋 Phase 2: TU/e Team Action Items

#### 1. GitHub OAuth App Setup

**What**: Create GitHub OAuth Application for production

**Who**: TU/e team admin with GitHub org access

**Steps**:

```
1. Go to: https://github.com/settings/developers
   (or GitHub Organization settings)

2. Click "New OAuth App"

3. Fill in:
   Application name: OpenML (Production)
   Homepage URL: https://www.openml.org
   Authorization callback URL: https://www.openml.org/api/auth/callback/github

4. Click "Register application"

5. Copy these values:
   Client ID: Ov23li... (example)
   Client Secret: [Generate and copy]

6. Add to production environment variables:
   GITHUB_ID=<Client ID>
   GITHUB_SECRET=<Client Secret>
```

**Backend Integration**:

```python
# Flask backend needs endpoint:
@app.route('/auth/oauth/github', methods=['POST'])
def github_oauth():
    data = request.json
    # {
    #   "provider": "github",
    #   "providerId": "12345678",
    #   "email": "user@example.com",
    #   "name": "John Doe",
    #   "image": "https://avatars.githubusercontent.com/..."
    # }

    # Logic:
    # 1. Check if user exists by providerId or email
    # 2. If exists: link OAuth provider, return JWT
    # 3. If new: create user, return JWT
    # 4. Return: {"access_token": "...", "id": ..., "username": "..."}
```

#### 2. Google OAuth App Setup (Optional)

**What**: Create Google Cloud OAuth credentials

**Who**: TU/e team admin with Google Cloud access

**Steps**:

```
1. Go to: https://console.cloud.google.com/
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
   - Authorized JavaScript origins: https://www.openml.org
   - Authorized redirect URIs: https://www.openml.org/api/auth/callback/google
5. Copy Client ID and Client Secret
6. Add to environment variables:
   GOOGLE_ID=<Client ID>
   GOOGLE_SECRET=<Client Secret>
```

**Backend Integration**: Same as GitHub, use `/auth/oauth/google` endpoint

#### 3. Email Service for Sign Up

**What**: Configure SMTP for email verification

**Options**:

- SendGrid (recommended)
- AWS SES
- Gmail SMTP (not for production)

**Environment Variables Needed**:

```bash
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SMTP_LOGIN=apikey
SMTP_PASS=<SendGrid API Key>
EMAIL_SENDER=noreply@openml.org
```

**Backend Requirements**:

```python
# POST /register endpoint needs:
1. Create user account (inactive)
2. Generate verification token
3. Send verification email
4. Return success message

# GET /verify-email/<token> endpoint needs:
1. Validate token
2. Activate user account
3. Redirect to login page
```

#### 4. Database Schema Updates

**Required Tables/Fields**:

```sql
-- Users table
ALTER TABLE users ADD COLUMN oauth_provider VARCHAR(50);
ALTER TABLE users ADD COLUMN oauth_provider_id VARCHAR(255);
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN verification_token VARCHAR(255);

-- Or create OAuth linking table
CREATE TABLE oauth_providers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  provider VARCHAR(50),  -- 'github', 'google'
  provider_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔒 Security Checklist for TU/e Production

### Environment Variables

- [ ] All secrets stored in secure environment (not in code)
- [ ] `JWT_SECRET_KEY` is strong random string (32+ chars)
- [ ] `APP_SECRET_KEY` is different from JWT secret
- [ ] OAuth secrets are production credentials (not dev)
- [ ] SMTP password is API key (not actual password)

### CORS Configuration

- [ ] Only allow production domains:
  ```python
  CORS_ORIGINS = [
      "https://www.openml.org",
      "https://openml.org"  # Without www
  ]
  ```
- [ ] Remove localhost from production CORS

### OAuth Callbacks

- [ ] GitHub callback: `https://www.openml.org/api/auth/callback/github`
- [ ] Google callback: `https://www.openml.org/api/auth/callback/google`
- [ ] No http:// URLs in production

### Database

- [ ] Use PostgreSQL (not SQLite) in production
- [ ] Enable SSL connections
- [ ] Regular backups configured
- [ ] User passwords hashed with bcrypt/argon2

### Session Security

- [ ] `SESSION_COOKIE_SECURE=True` (HTTPS only)
- [ ] `CSRF_COOKIE_SECURE=True`
- [ ] Session timeout configured (e.g., 7 days)

---

## 📊 Current Implementation Status

| Feature                | Development        | Vercel (Pre-Prod)   | TU/e Production            |
| ---------------------- | ------------------ | ------------------- | -------------------------- |
| **OpenML Login**       | ✅ Working         | 🔄 Ready to test    | ⏳ Needs CORS update       |
| **Profile Display**    | ✅ Working         | ✅ Working          | ✅ Ready                   |
| **Avatar/Initials**    | ✅ Working         | ✅ Working          | ✅ Ready                   |
| **Avatar Upload**      | ✅ Flask backend   | ✅ Vercel Blob      | ⏳ Needs `/image` endpoint |
| **Logout**             | ✅ Working         | ✅ Working          | ✅ Ready                   |
| **GitHub OAuth**       | ⚠️ Dev credentials | ❌ Not configured   | ⏳ Needs setup             |
| **Google OAuth**       | ❌ Not configured  | ❌ Not configured   | ⏳ Needs setup             |
| **Sign Up**            | ⚠️ Form ready      | ❌ No email service | ⏳ Needs SMTP              |
| **Email Verification** | ❌ Not implemented | ❌ Not implemented  | ⏳ Needs backend work      |

**Legend**:

- ✅ = Working
- 🔄 = Ready, needs testing
- ⚠️ = Partial/limited
- ❌ = Not configured
- ⏳ = Prepared, needs configuration

---

## 🎯 Immediate Next Steps (This Week)

### For You (Developer)

1. ✅ Push latest fixes to Vercel

   ```bash
   git push origin clean-app-next-v2
   ```

2. 🔄 Test login on Vercel preview
   - Use real OpenML credentials
   - Verify avatar/initials display
   - Check profile page

3. 📝 Document any issues found

### For TU/e Team

1. ⏳ Verify CORS allows Vercel domain
   - Add `https://openmlorg.vercel.app` to allowed origins
   - Test from Vercel deployment

2. ⏳ Confirm backend endpoints work:
   - `/login` - Returns JWT
   - `/profile` - Returns user data (with JWT)
   - `/image` - Accepts avatar upload (optional for now)

---

## 📞 Communication Plan for TU/e Team

### Email Template for Team

```
Subject: OpenML Next.js Frontend - Phase 1 Ready for Testing

Hi Team,

The new Next.js frontend is ready for Phase 1 testing on Vercel:
https://openmlorg.vercel.app

**Phase 1: OpenML Credentials Login** ✅
- Users can login with existing OpenML.org credentials
- Profile displays with avatar or initials
- Session management working
- Responsive design (mobile + desktop)

**What I need from the backend team:**

1. CORS Configuration:
   Please add this domain to allowed CORS origins:
   - https://openmlorg.vercel.app
   - https://openmlorg-[project].vercel.app (preview deployments)

2. Test Endpoints:
   Can you verify these endpoints are working with CORS?
   - POST /login (email/password → JWT)
   - GET /profile (JWT → user data)

**Phase 2: OAuth & Sign Up** (Future - see attached checklist)
I've prepared the implementation for GitHub/Google OAuth and sign-up.
Please review the attached "TU_TEAM_CHECKLIST.md" for what needs to be
configured before final production deployment.

**Testing Instructions:**
1. Go to https://openmlorg.vercel.app/auth/signin
2. Login with your OpenML credentials
3. Verify profile loads correctly

Let me know if you encounter any issues!

Best regards,
[Your name]
```

---

## 📄 Files to Share with Team

### 1. This Implementation Roadmap

`IMPLEMENTATION_ROADMAP.md` (this file)

### 2. Backend Requirements

Create: `BACKEND_REQUIREMENTS.md` with API specs

### 3. TU/e Team Checklist

Create: `TU_TEAM_CHECKLIST.md` with action items

---

## 🔄 Rollback Plan (If Issues Arise)

If something breaks in production:

1. **Vercel**: Click "Rollback" to previous deployment
2. **Backend**: Keep current backend running unchanged
3. **DNS**: Frontend and backend are separate, no DNS changes needed

**Safe Strategy**:

- Keep current openml.org frontend running
- Test new frontend on Vercel subdomain
- Switch DNS only when everything is verified

---

## ✅ Success Criteria

### Phase 1 Complete When:

- [ ] User can login on Vercel with OpenML credentials
- [ ] Profile page displays user data correctly
- [ ] Avatar or initials appear in header
- [ ] Session persists across navigation
- [ ] Logout works correctly
- [ ] No CORS errors in browser console
- [ ] Mobile and desktop layouts work

### Phase 2 Complete When:

- [ ] GitHub OAuth login works
- [ ] Google OAuth login works (optional)
- [ ] New users can sign up
- [ ] Email verification works
- [ ] All OAuth profiles linked to backend accounts

---

**Last Updated**: December 18, 2025
**Version**: 1.0
**Status**: Phase 1 Ready for Testing
