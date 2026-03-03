# Avatar Upload System

## Overview

The Next.js app supports avatar uploads with two storage strategies depending on the deployment environment.

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Avatar Upload                             │
├─────────────────────────────────────────────────────────────────┤
│  Local Development (Docker MySQL)                                │
│    └── /api/upload-avatar → Filesystem (dev_data/) + MySQL      │
├─────────────────────────────────────────────────────────────────┤
│  Vercel Production                                               │
│    └── /api/upload-avatar-vercel → Vercel Blob Storage          │
└─────────────────────────────────────────────────────────────────┘
```

## API Routes

| Route | Environment | Storage | Description |
| --- | --- | --- | --- |
| `/api/upload-avatar` | Local dev | Filesystem + DB | Saves to `dev_data/[username]/` |
| `/api/upload-avatar-vercel` | Vercel | Blob Storage | Saves to Vercel CDN |
| `/api/user/avatar` | Local dev | Filesystem + DB | Alternative endpoint |

## Local Development Upload

### How It Works

1. User uploads image via form
2. File validated (size, type)
3. Saved to `dev_data/[username]/[filename]`
4. Database updated with path `imgs/dev_data/[username]/[filename]`

### API: `/api/upload-avatar`

**Request:**

```http
POST /api/upload-avatar
Content-Type: multipart/form-data
Authorization: (NextAuth session required)

file: [binary image data]
```

**Response:**

```json
{
    "success": true,
    "message": "Avatar uploaded successfully",
    "imagePath": "imgs/dev_data/username/avatar.jpg"
}
```

### File Storage Location

```text
app-next/
└── dev_data/
    └── [username]/
        └── [filename].jpg
```

### Validation Rules

| Rule | Value |
| --- | --- |
| Max file size | 5 MB |
| Allowed types | `image/jpeg`, `image/png`, `image/webp` |
| Filename sanitization | Lowercase, alphanumeric + dots only |

## Vercel Production Upload

### Vercel Upload Flow

1. User uploads image via form
2. File validated (size, type)
3. Uploaded to Vercel Blob Storage
4. CDN URL returned for immediate use

### API: `/api/upload-avatar-vercel`

**Request:**

```http
POST /api/upload-avatar-vercel
Content-Type: multipart/form-data

file: [binary image data]
```

**Response:**

```json
{
    "success": true,
    "message": "Avatar uploaded successfully to Vercel Blob",
    "imagePath": "https://xyz.public.blob.vercel-storage.com/avatars/image.jpg"
}
```

### Environment Variables

```env
# Required for Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

**Note:** Without `BLOB_READ_WRITE_TOKEN`, the Vercel upload route returns a 503 error. This is expected in local development.

## Database Schema

The avatar path is stored in the `users` table:

```sql
-- users.image column stores the avatar path/URL
UPDATE users SET image = ? WHERE id = ?
```

| Environment | Image Value Format |
| --- | --- |
| Local dev | `imgs/dev_data/username/avatar.jpg` |
| Vercel | `https://xyz.blob.vercel-storage.com/avatars/image.jpg` |

## Security

### Authentication

- All upload endpoints require NextAuth session
- User ID extracted from session to prevent unauthorized updates

### File Validation

```typescript
// Size validation
const maxSize = 5 * 1024 * 1024; // 5MB
if (file.size > maxSize) { /* reject */ }

// Type validation
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
if (!allowedTypes.includes(file.type)) { /* reject */ }

// Filename sanitization
const fileName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
```

## Deployment Environments

| Environment | Storage | Database | Works? |
| --- | --- | --- | --- |
| **Local dev (Docker MySQL)** | Filesystem | MySQL | ✅ |
| **Vercel (no token)** | - | - | ❌ 503 error |
| **Vercel (with token)** | Blob Storage | MySQL* | ✅ |
| **k8s Production** | TBD | MySQL | TBD |

*Vercel needs MySQL connection for database updates

## File Structure

```text
src/app/api/
├── upload-avatar/
│   └── route.ts           # Local filesystem upload
├── upload-avatar-vercel/
│   └── route.ts           # Vercel Blob upload
└── user/
    └── avatar/
        └── route.ts       # Alternative local upload
```
