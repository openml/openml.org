# OpenML Real Authentication Integration

## Overview

The Next.js app now connects to the **real OpenML backend** at `www.openml.org`, allowing users to login with their actual OpenML accounts.

## How It Works

### Architecture

```
Next.js App (Vercel) → www.openml.org/user/* → MySQL Database
```

1. **User logs in** on Next.js app
2. **Credentials sent** to `https://www.openml.org/user/login`
3. **Flask backend validates** against MySQL database
4. **JWT token returned** if credentials are valid
5. **Profile data fetched** from `/user/profile` endpoint
6. **User data stored** in localStorage

### Files Modified

#### New Files:

- `/src/services/openml-api.ts` - OpenML API service with authentication functions
- `/.env.local` - Environment variables for API URL
- `/.env.local.example` - Example environment file

#### Modified Files:

- `/src/components/auth/account-page.tsx` - Sign-in now uses real API
- `/src/components/layout/user-activity-sidebar.tsx` - Sign-out clears JWT token
- `/src/contexts/user-context.tsx` - Logout removes JWT token

## Environment Variables

### Local Development

```bash
NEXT_PUBLIC_OPENML_API_URL=https://www.openml.org
```

### Vercel Deployment

Add this environment variable in your Vercel project settings:

- **Name**: `NEXT_PUBLIC_OPENML_API_URL`
- **Value**: `https://www.openml.org`

## API Endpoints Used

### 1. Login

**Endpoint**: `POST /user/login`

**Request**:

```json
{
  "email": "username_or_email",
  "password": "user_password"
}
```

**Response (Success)**:

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (Error)**:

```json
{
  "msg": "Wrong username or password"
}
// or
{
  "msg": "NotConfirmed"
}
```

### 2. Get Profile

**Endpoint**: `GET /user/profile`

**Headers**:

```
Authorization: Bearer <jwt_token>
```

**Response**:

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "bio": "ML researcher",
  "image": "https://www.openml.org/img/avatar.jpg",
  "company": "University",
  "country": "Netherlands"
}
```

## User Flow

### Sign In

1. User enters credentials
2. App calls `loginToOpenML(email, password)`
3. JWT token saved in `localStorage.openml_token`
4. User profile saved in `localStorage.user`
5. User redirected to dashboard

### Sign Out

1. User clicks sign out
2. Both `localStorage.user` and `localStorage.openml_token` are removed
3. User state cleared
4. Redirected to home page

## Testing

### Test with Real Account

1. Go to sign-in page
2. Enter your **real OpenML credentials** (same as www.openml.org)
3. You should see your actual:
   - Name (firstName + lastName)
   - Email
   - Avatar image (if you have one uploaded)
   - Bio and other profile data

### Expected Behavior

- ✅ Real user data displayed
- ✅ Avatar shows if user has uploaded one
- ✅ User icon with gradient background if no avatar
- ✅ JWT token stored for authenticated requests
- ✅ Profile data matches www.openml.org

## Deployment to Vercel

1. **Push code to GitHub**
2. **Connect to Vercel**
3. **Add environment variable**:
   - `NEXT_PUBLIC_OPENML_API_URL=https://www.openml.org`
4. **Deploy**

## Security Notes

- JWT tokens are stored in `localStorage` (client-side)
- Tokens are sent in Authorization header for authenticated requests
- CORS is already configured on the Flask backend
- HTTPS is used for all API communication

## Troubleshooting

### "Unable to connect to OpenML server"

- Check if `www.openml.org` is accessible
- Verify environment variable is set correctly
- Check browser console for CORS errors

### "Invalid credentials"

- Verify username/email and password are correct
- Make sure account is confirmed (check email)
- Try logging in on www.openml.org first to verify credentials

### "Failed to fetch profile"

- JWT token might be expired
- Try logging out and logging in again
- Check browser console for error messages

## Next Steps

This integration allows:

- ✅ Real user authentication
- ✅ Access to actual user profiles
- ✅ Works with existing www.openml.org backend
- ✅ No additional database setup needed
- ✅ Ready for Vercel deployment

Future enhancements could include:

- Token refresh mechanism
- Remember me functionality
- OAuth2 integration (GitHub, Google)
- Profile update functionality via API
