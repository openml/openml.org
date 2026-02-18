# Open Items — app-next

Last updated: 2026-02-18

## 1. Backend/API Needs

| Item                        | Status      | File                           | Details                                                                                                                                                                   |
| --------------------------- | ----------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CORS on `data.openml.org`   | Discussing  | `hooks/useParquetData.ts`      | **Current**: Data files < 5MB proxied through `/api/proxy-file` due to missing CORS headers. **Team feedback** (Joaquin): Need to understand why CORS is needed; may be unsafe. **Alternative being considered**: Precompute stats and serve via main REST API instead of requiring browser access to raw data files. |
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
| Distribution (small datasets) | Working      | Parquet/ARFF < 5MB loads in browser via `/api/proxy-file`.                        |
| Distribution (large datasets) | Partial      | Datasets > 5MB use Dash iframe: `/dashboard/data-features/{id}`. Nominal features show from metadata. Numeric shows "coming soon". |
| Correlation                   | Working      | Shows when parquet loads. "Coming soon" otherwise.                                |
| Parquet-wasm                  | Intermittent | Sometimes fails silently on valid files (e.g. dataset 1590). Falls back to ARFF.  |
| Dash JSON API                 | Discussing   | **Current**: Large datasets use Dash iframe. **Team feedback** (Joaquin): Considering precomputing main statistics and dataset preview, serving via main REST API (not Flask). Would allow rendering charts in Next.js with consistent styling instead of iframes. |

## 4. Auth & Infrastructure

| Item               | Status      | File                                         | Details                                                         |
| ------------------ | ----------- | -------------------------------------------- | --------------------------------------------------------------- |
| Avatar upload      | Temporary   | `api/upload-avatar-vercel/route.ts`          | Uses Vercel Blob. Needs Flask `/image` endpoint for production. |
| Passkey login      | Placeholder | `api/auth/passkey/login-verify/route.ts:103` | Uses placeholder token. NextAuth handles session.               |
| Dashboard redirect | Fixed       | `dashboard/user-dashboard.tsx`               | `/auth/signin` → `/auth/sign-in`                                |

## 5. Process

- **Question for team**: Incremental pushes to Vercel preview vs. batched PRs — what works best?
- Minor merge conflicts when syncing with upstream.

## Extras improvements

### Dataset Edit Form - Markdown Preview

**Current state**: The dataset edit form (`dataset-edit-form.tsx`) has a plain `<Textarea>` for the description field.

**Enhancement opportunity**: The legacy React app (`server/src/client/app/src/pages/auth/DataEdit.js`) includes a nice 2-tab interface for editing descriptions with Markdown:

- **Tab 1 "Description"**: Edit mode with raw Markdown syntax
- **Tab 2 "Preview"**: Rendered preview using `ReactMarkdown`
- Includes a Markdown icon linking to GitHub's Markdown guide

**Implementation**:

- Add tabs component (Edit/Preview) for the description field
- Use `react-markdown` or similar library for preview rendering
- Add Markdown helper icon/link for user guidance
- Consider applying to other multiline text fields (citation, etc.)

**Files affected**:

- `app-next/src/components/dataset/dataset-edit-form.tsx`

**Priority**: Low (nice-to-have UX improvement)
