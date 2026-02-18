# Likes Feature - Production Setup Guide

## Overview

The likes (favorites/bookmarks) feature allows authenticated users to like/unlike datasets, flows, tasks, and runs. This feature calls the **OpenML REST API** directly.

## Architecture

```text
┌──────────────────────────────────────────────────────────┐
│  Next.js App                                              │
│    └── Like Button                                        │
│         └── calls OpenML REST API (www.openml.org)        │
│              └── requires valid API key (session.apikey)  │
└──────────────────────────────────────────────────────────┘
```

## How It Works

1. User signs in (OAuth, passkey, or email/password)
2. API key (`session_hash`) is loaded from database into session
3. Like button calls OpenML REST API with the API key
4. OpenML REST API validates the key against its database

**Note:** The `session_hash` column is optional in the database. The auth system queries it separately in a try/catch, so sign-in works even if the column doesn't exist (likes just won't work without it).

## API Endpoint

The OpenML REST API for likes:

```
POST /api_new/v1/xml/votes/up/{type}/{id}?api_key={apikey}   # Like
DELETE /api_new/v1/xml/votes/up/{type}/{id}?api_key={apikey} # Unlike
```

Where `type` is: `d` (dataset), `f` (flow), `t` (task), `r` (run)

## Key Requirement

**Likes only work when the API key exists in the OpenML production database.**

| User Type | Database | Likes Work? | Reason |
| --- | --- | --- | --- |
| OpenML.org user (email/password) | MySQL (shared) | ✅ | API key recognized by OpenML REST API |
| OAuth/Passkey user (local Docker) | MySQL (local) | ❌ | API key not in OpenML production DB |
| OAuth/Passkey user (Vercel + MySQL) | MySQL (shared) | ✅ | API key stored in shared DB |

## Production Deployment Requirements

### Required: MySQL Connection

Connect Next.js directly to the OpenML MySQL database:

```env
# Option 1: Connection string (recommended)
DATABASE_URL=mysql://user:password@openml-mysql-host:3306/openml

# Option 2: Individual variables
MYSQL_HOST=<openml-mysql-host>
MYSQL_USER=<db-username>
MYSQL_PASSWORD=<db-password>
MYSQL_DATABASE=openml
MYSQL_PORT=3306
```

With this configuration:

- New users are created in the shared database
- Their `session_hash` (API key) is valid for OpenML REST API calls
- Likes work immediately

## Files Involved

| File | Purpose |
| --- | --- |
| `src/app/api/auth/[...nextauth]/route.ts` | Stores `session_hash` as `apikey` in session |
| `src/services/likes.ts` | API calls to OpenML for like/unlike |
| `src/components/ui/like-button.tsx` | UI component using session API key |
| `src/types/next-auth.d.ts` | TypeScript types for session.apikey |

## Troubleshooting

### "Please sign in to like"

- User is not authenticated
- Check NextAuth session is valid

### "Authentication required" (401 from OpenML REST API)

- API key is invalid or not recognized
- User was created locally — their API key doesn't exist in OpenML production DB
- **Solution:** Connect to the shared MySQL database

### Like button doesn't appear

- Check `NEXT_PUBLIC_ENABLE_LIKES` is not set to `false`
- Verify component is correctly imported

## Session Structure

After successful authentication:

```typescript
{
  user: {
    id: string,
    username: string,
    email: string,
    image: string,
    isLocalUser: boolean  // true = created locally, likes may not work
  },
  apikey: string  // OpenML REST API key for likes (from session_hash, may be null)
}
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes (for likes) | MySQL connection string to shared database |
| `NEXT_PUBLIC_ENABLE_LIKES` | No | Set to `false` to disable likes feature |
| `NEXT_PUBLIC_OPENML_API_URL` | No | Override OpenML REST API URL (default: `https://www.openml.org`) |
