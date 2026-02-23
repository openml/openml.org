# Implementation: Runtime Configuration for Single-Image Deployment

## 1. Overview

To achieve a "Build Once, Run Anywhere" strategy for OpenML, we move away from Next.js build-time environment inlining. Instead, we use **Server-side Injection** to provide configuration to the browser at request time.

### Benefits

- **Single Docker Image:** The same image works for Dev, Test, Pre-prod, and Production.
- **Zero Extra Roundtrips:** No `/api/config` call is needed; config is embedded in the initial HTML.
- **No Proxy Conflicts:** Bypasses PHP/Flask routing entirely by staying within the Next.js rendering pipeline.

---

## 2. Server-Side: The Root Layout

The `RootLayout` is a Server Component. It reads the environment variables from the running Docker container and injects them into the HTML via a script tag.

**File:** `app-next/src/app/layout.tsx`

```tsx
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Select the variables you want to expose to the client
    const clientEnv = {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_ELASTICSEARCH_SERVER:
            process.env.NEXT_PUBLIC_ELASTICSEARCH_SERVER,
        NEXT_PUBLIC_URL_MINIO: process.env.NEXT_PUBLIC_URL_MINIO,
        NEXT_PUBLIC_ENABLE_ELASTICSEARCH:
            process.env.NEXT_PUBLIC_ENABLE_ELASTICSEARCH,
        // Add any other NEXT_PUBLIC variables here
    };

    return (
        <html lang='en'>
            <head>
                <script
                    id='runtime-config'
                    dangerouslySetInnerHTML={{
                        __html: `window.__ENV__ = ${JSON.stringify(clientEnv)};`,
                    }}
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
```

---

## 3. The Client-Side Helper

Since `process.env` is not available in the browser at runtime, we use a helper utility to retrieve values.

**File:** `app-next/src/lib/config.ts`

```typescript
/**
 * Utility to get environment variables at runtime.
 * Works on both Server and Client.
 */
export const getConfig = (key: string): string => {
    if (typeof window !== 'undefined') {
        // Client-side: Read from the injected window object
        return (window as any).__ENV__?.[key] || '';
    }
    // Server-side: Read from the container's process.env
    return process.env[key] || '';
};
```

---

## 4. Usage in Components

Instead of calling `process.env.NEXT_PUBLIC_API_URL` directly in your components (which Next.js would try to bake in during build), use the helper:

```tsx
'use client';
import { getConfig } from '@/lib/config';

const MyComponent = () => {
    const apiUrl = getConfig('NEXT_PUBLIC_API_URL');

    return <div>API is at: {apiUrl}</div>;
};
```

---

## 5. Deployment Workflow

### Step A: Docker Build

The Dockerfile remains generic. No `--build-arg` is required for the public URLs.

```dockerfile
# Standard build without environment-specific args
RUN npm run build

```

### Step B: Kubernetes Runtime

Joaquin configures the specific environment variables in the K8s Deployment manifest.

```yaml
# k8s-environment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: openml-next
spec:
    template:
        spec:
            containers:
                - name: openml-next
                  image: openml-next:3.1.20251119
                  env:
                      - name: NEXT_PUBLIC_API_URL
                        value: 'https://api.test.openml.org'
                      - name: NEXT_PUBLIC_ELASTICSEARCH_SERVER
                        value: 'https://es.test.openml.org'
```

---

## 6. Addressing Team Concerns

| Concern                    | Solution                                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Extra Latency**          | **Resolved.** The config is part of the initial HTML. There are 0 additional network requests.                            |
| **`/api/config` Conflict** | **Resolved.** No API endpoint is created. We use Next.js's internal Server Side Rendering (SSR).                          |
| **PHP Proxy Conflicts**    | **Resolved.** The data injection happens before the page is delivered, so it never hits the rewrite rules for legacy PHP. |
| **Multiple Images**        | **Resolved.** The Docker image is now environment-agnostic.                                                               |

#--- **\*\*\*\***\*\***\*\*\*\*** -------

Here is the updated `next.config.ts` tailored for the **standalone** build and runtime configuration.

When using `output: "standalone"`, Next.js creates a minimal server that only includes the files necessary for production. This is perfect for Docker/Kubernetes because it results in much smaller images.

### Updated `next.config.ts`

```typescript
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
    // 1. Optimize for Docker/K8s deployment
    output: 'standalone',

    // 2. Ensure server-side environment variables are NOT optimized away
    // Next.js will now check process.env at runtime for these keys
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },

    // ... (Keep your Webpack WASM, Images, and Redirects config as they were)

    async rewrites() {
        const FLASK_BACKEND =
            process.env.FLASK_BACKEND_URL || 'https://www.openml.org';

        return {
            afterFiles: [
                // Your existing PHP/Flask proxy rules remain safe here
                {
                    source: '/api/v1/:path*',
                    destination: `${FLASK_BACKEND}/api/v1/:path*`,
                },
                // etc...
            ],
        };
    },
};

export default withNextIntl(nextConfig);
```

---

## Technical Summary of the Final Flow

1. **Build Phase:** `npm run build` generates the `.next/standalone` folder. Since `NEXT_PUBLIC_` variables aren't provided at build time, the JS chunks remain clean of hardcoded URLs.
2. **Startup:** Joaquin starts the container in K8s. The Node.js process starts and populates `process.env` with the cluster-specific values.
3. **Request Phase:** A user hits the site. `layout.tsx` (Server Component) reads the fresh `process.env` and sends it down in the HTML.
4. **Client Phase:** The `getConfig` helper ensures your ElasticSearch, MinIO, and API components use the injected `window.__ENV__` values immediately.

---

### Comparison for the Team

| Feature             | Build-time (Old)                    | Runtime Injection (New)          |
| ------------------- | ----------------------------------- | -------------------------------- |
| **Images required** | 1 per environment (Dev, Test, Prod) | **1 single image for all**       |
| **Re-deployment**   | Requires new build/CI cycle         | **Restart pod with new Env Var** |
| **Security**        | Secrets baked into JS code          | **Secrets stay in K8s/Server**   |
| **Performance**     | Fast (static)                       | **Equal (injected during SSR)**  |
