# Open Items — app-next

Last updated: 2026-02-18

## 1. Backend/API Needs

| Item                        | Status      | File                           | Details                                                                                                                                                                   |
| --------------------------- | ----------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CORS on `data.openml.org`   | Blocked     | `hooks/useParquetData.ts`      | All data files proxied through `/api/proxy-file` because `data.openml.org` blocks browser requests. Adding `Access-Control-Allow-Origin: *` would remove this workaround. |
| Dash 502 for large datasets | Bug         | (server-side)                  | `openml.org/dashboard/data/47160` returns 502. Missing `metric` component in Dash callback.                                                                               |
| Bookmark API                | Not started | `dataset-actions-menu.tsx:98`  | UI exists, no backend call.                                                                                                                                               |
| Collections API             | Not started | `dataset-actions-menu.tsx:289` | Dialog is placeholder, needs endpoint to fetch/create collections.                                                                                                        |
| Report submission           | Not started | `dataset-actions-menu.tsx:379` | Report dialog exists, submit does nothing.                                                                                                                                |
| Notifications               | Not started | `layout/header.tsx:164`        | Bell icon hidden, waiting for backend.                                                                                                                                    |

## 2. Search & Filters

| Item                 | Status   | File                                 | Details                                                                           |
| -------------------- | -------- | ------------------------------------ | --------------------------------------------------------------------------------- |
| Benchmark facets     | Empty    | `benchmarks-search-container.tsx:23` | No facets defined yet.                                                            |
| Flow facets          | Partial  | `flows-search-container.tsx:43`      | Only "Libraries", needs Language/Framework.                                       |
| Dataset stat filters | Question | `dataset-header-new.tsx`             | Instances/Features/Classes are display-only. Should they link to filtered search? |

## 3. Data Visualization

| Item                          | Status       | Details                                                                           |
| ----------------------------- | ------------ | --------------------------------------------------------------------------------- |
| Distribution (small datasets) | Working      | Parquet/ARFF < 10MB loads in browser.                                             |
| Distribution (large datasets) | Partial      | Nominal features show from metadata. Numeric shows "coming soon".                 |
| Correlation                   | Working      | Shows when parquet loads. "Coming soon" otherwise.                                |
| Parquet-wasm                  | Intermittent | Sometimes fails silently on valid files (e.g. dataset 1590). Falls back to ARFF.  |
| Dash JSON API                 | Future       | Server-side computation for large datasets. Would replace "coming soon" messages. |

## 4. Auth & Infrastructure

| Item               | Status      | File                                         | Details                                                         |
| ------------------ | ----------- | -------------------------------------------- | --------------------------------------------------------------- |
| Avatar upload      | Temporary   | `api/upload-avatar-vercel/route.ts`          | Uses Vercel Blob. Needs Flask `/image` endpoint for production. |
| Passkey login      | Placeholder | `api/auth/passkey/login-verify/route.ts:103` | Uses placeholder token. NextAuth handles session.               |
| Dashboard redirect | Fixed       | `dashboard/user-dashboard.tsx`               | `/auth/signin` → `/auth/sign-in`                                |

## 5. Process

- **Question for team**: Incremental pushes to Vercel preview vs. batched PRs — what works best?
- Minor merge conflicts when syncing with upstream.
