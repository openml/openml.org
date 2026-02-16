# API Key Regeneration

## Overview

The API key regeneration feature allows users to generate a new API key if their current key is compromised. The API key (`session_hash`) is used for OpenML REST API calls (likes, uploads, etc.).

## Current Status

| Feature            | Status   | Implementation           |
| ------------------ | -------- | ------------------------ |
| View API Key       | ✅ Works | Direct database read     |
| Copy API Key       | ✅ Works | Frontend only            |
| Regenerate API Key | 🔧 Flask | Proxies to Flask backend |

## Architecture

```text
┌──────────────────────────────────────────────────────────┐
│  Profile Settings (profile-settings.tsx)                  │
│    └── "Regenerate API Key" button                        │
│         └── calls Flask: POST /api-key/regenerate         │
│              └── Flask updates session_hash in DB         │
└──────────────────────────────────────────────────────────┘
```

## Current Implementation

### Frontend Component

Location: `src/components/auth/profile-settings.tsx`

```typescript
const handleRegenerateApiKey = async () => {
    // Calls Flask backend
    const response = await fetch(`${apiUrl}/api-key/regenerate`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    // Updates local state with new key
};
```

### Flask Endpoint (Still Required)

The Flask backend handles:

1. Validating the JWT token
2. Generating a new `session_hash`
3. Updating the database
4. Returning the new API key

## Migration to Direct Database

To remove Flask dependency, create a new API route:

### Proposed: `/api/user/api-key/regenerate`

```typescript
// src/app/api/user/api-key/regenerate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { execute } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const userId = (session.user as any).id;

        // Generate new API key (same format as Flask)
        const newApiKey = crypto.randomBytes(32).toString('hex');

        // Update database
        await execute('UPDATE users SET session_hash = ? WHERE id = ?', [
            newApiKey,
            userId,
        ]);

        return NextResponse.json({
            success: true,
            apiKey: newApiKey,
        });
    } catch (error) {
        console.error('API key regeneration error:', error);
        return NextResponse.json(
            { error: 'Failed to regenerate API key' },
            { status: 500 },
        );
    }
}
```

### Update Frontend

```typescript
// In profile-settings.tsx
const handleRegenerateApiKey = async () => {
    // Use new direct endpoint instead of Flask
    const response = await fetch('/api/user/api-key/regenerate', {
        method: 'POST',
    });

    if (response.ok) {
        const data = await response.json();
        setApiKey(data.apiKey);
        // Also update session
        await update({ apikey: data.apiKey });
    }
};
```

## Database Schema

The API key is stored in the `users` table:

```sql
-- session_hash column stores the API key
UPDATE users SET session_hash = ? WHERE id = ?
```

## Environment Requirements

| Environment                      | Regeneration Works? | Reason                                |
| -------------------------------- | ------------------- | ------------------------------------- |
| Local (SQLite)                   | ❌ (Flask needed)   | Current implementation requires Flask |
| Local (after migration)          | ✅                  | Direct database update                |
| Vercel + MySQL                   | ❌ (Flask needed)   | Current implementation requires Flask |
| Vercel + MySQL (after migration) | ✅                  | Direct database update                |

## Security Considerations

1. **Authentication Required**: Only authenticated users can regenerate their own key
2. **Immediate Invalidation**: Old key stops working immediately
3. **Session Update**: New key should be updated in NextAuth session
4. **Confirmation Dialog**: User must confirm before regeneration

## Files Involved

| File                                           | Purpose                                    |
| ---------------------------------------------- | ------------------------------------------ |
| `src/components/auth/profile-settings.tsx`     | UI component with regenerate button        |
| `src/app/api/user/api-key/route.ts`            | GET endpoint (view key)                    |
| `src/app/api/user/api-key/regenerate/route.ts` | POST endpoint (regenerate) - TO BE CREATED |

## Testing

### Before Migration (Flask Required)

1. Start Flask backend: `docker run -d -p 8000:5000 openmlorg-backend`
2. Sign in to the app
3. Go to Profile Settings → API Key tab
4. Click "Regenerate API Key"
5. Confirm the action
6. Verify new key is displayed

### After Migration

1. Sign in to the app
2. Go to Profile Settings → API Key tab
3. Click "Regenerate API Key"
4. Confirm the action
5. Verify new key is displayed
6. Verify likes still work with new key

## Migration Checklist

- [ ] Create `/api/user/api-key/regenerate/route.ts`
- [ ] Update `profile-settings.tsx` to use new endpoint
- [ ] Update NextAuth session with new API key
- [ ] Test locally with SQLite
- [ ] Test on Vercel with MySQL
- [ ] Remove Flask proxy fallback
