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

## Database Schema

The API key is stored in the `users` table as `session_hash`:

```sql
-- session_hash column stores the API key (optional column, may not exist in all deployments)
UPDATE users SET session_hash = ? WHERE id = ?
```

**Note:** The `session_hash` column is queried separately with a try/catch in the auth system, so it works even if the column doesn't exist.

## Migration to Direct Database

To remove the Flask dependency, create a new API route:

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

        // Update database (will fail silently if session_hash column doesn't exist)
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

## Environment Requirements

| Environment | Regeneration Works? | Reason |
| --- | --- | --- |
| Local (Docker MySQL) | ❌ (Flask needed) | Current implementation requires Flask |
| Local (after migration) | ✅ | Direct database update |
| Vercel + MySQL | ❌ (Flask needed) | Current implementation requires Flask |
| Vercel + MySQL (after migration) | ✅ | Direct database update |

## Security Considerations

1. **Authentication Required**: Only authenticated users can regenerate their own key
2. **Immediate Invalidation**: Old key stops working immediately
3. **Session Update**: New key should be updated in NextAuth session
4. **Confirmation Dialog**: User must confirm before regeneration

## Migration Checklist

- [ ] Create `/api/user/api-key/regenerate/route.ts`
- [ ] Update `profile-settings.tsx` to use new endpoint
- [ ] Update NextAuth session with new API key
- [ ] Test locally with Docker MySQL
- [ ] Test on Vercel with MySQL
- [ ] Remove Flask proxy fallback
