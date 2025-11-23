# Pull Request: SEO-Friendly URLs and Search Functionality Fixes

## Summary

This PR implements SEO-friendly URLs for all entity types and fixes search functionality across datasets, tasks, flows, and runs.

## Changes Overview

### 1. **SEO-Friendly URL Structure** ✨

Migrated all entity detail pages to use descriptive, SEO-optimized URLs:

| Entity   | Old URL  | New URL (Canonical) | Status      |
| -------- | -------- | ------------------- | ----------- |
| Datasets | `/d/:id` | `/datasets/:id`     | ✅ Complete |
| Tasks    | `/t/:id` | `/tasks/:id`        | ✅ Complete |
| Flows    | `/f/:id` | `/flows/:id`        | ✅ Complete |
| Runs     | `/r/:id` | `/runs/:id`         | ✅ Complete |

**Benefits:**

- Better Google indexing and SEO ranking
- More intuitive, user-friendly URLs
- Improved sharing and citation experience
- Professional URL structure for academic referencesx

### 2. **Backward Compatibility Redirects** 🔄

Old URLs automatically redirect to new canonical URLs to maintain compatibility with:

- Academic papers and citations
- Bookmarks and saved links
- External references

**Implementation:**

- `/d/[dataId].js` → Redirects to `/datasets/[id]`
- `/t/[taskId].js` → Redirects to `/tasks/[id]`
- `/f/[flowId].js` → Redirects to `/flows/[id]`
- `/r/[runId].js` → Redirects to `/runs/[id]`

### 3. **Fixed Search Result Navigation** 🔍

Search results now correctly navigate to the new SEO-friendly URLs:

**Files Modified:**

- `app/src/components/search/ResultCard.js`
  - Added entity type detection via `_meta.rawHit._type`
  - Added ID field mapping for each entity type
  - Implemented URL generation based on entity type

**Logic:**

```javascript
// Maps entity types to correct ID fields
data → data_id
task → task_id
flow → flow_id
run → run_id

// Generates SEO-friendly URLs
data → /datasets/:id
task → /tasks/:id
flow → /flows/:id
run → /runs/:id
```

### 4. **Elasticsearch Connector Improvements** 🔧

Enhanced `OpenMLSearchConnector.js` to properly handle entity types:

**Changes:**

- Added `_meta.rawHit._type` field with index name
- Ensures entity type is correctly passed to search results
- Enables proper routing based on entity type

### 5. **Search Configuration Updates** ⚙️

Updated search configs to include necessary ID fields:

**Files Modified:**

- `app/src/search_configs/runConfig.js` - Added `run_id` to result_fields

### 6. **Component Fixes** 🐛

Fixed display issues in search result cards:

**Files Modified:**

- `app/src/components/search/taskCard.js`
  - Fixed Title to use `tasktype.name` and `source_data.name`
  - Was incorrectly using run fields

- `app/src/components/search/flowCard.js`
  - Fixed Title to use `name` field
  - Was incorrectly using run fields

### 7. **Detail Page Migrations** 📄

Moved all entity detail pages to their new canonical locations:

**Datasets:**

- Content moved: `/d/[dataId].js` → `/datasets/[id].js`
- Updated param name: `params.dataId` → `params.id`
- Updated internal links to use new URLs

**Tasks:**

- Content moved: `/t/[taskId].js` → `/tasks/[id].js`
- Updated param name: `params.taskId` → `params.id`
- Updated internal links: `/d/` → `/datasets/`

**Flows:**

- Content moved: `/f/[flowId].js` → `/flows/[id].js`
- Updated param name: `params.flowId` → `params.id`

**Runs:**

- Content moved: `/r/[runId].js` → `/runs/[id].js`
- Updated param name: `params.runId` → `params.id`
- Updated internal links: `/d/` → `/datasets/`, `/t/` → `/tasks/`, `/f/` → `/flows/`

## Testing Checklist ✅

- [x] Datasets search page displays correctly
- [x] Tasks search page displays correctly
- [x] Flows search page displays correctly
- [x] Runs search page displays correctly
- [x] Clicking dataset leads to `/datasets/:id`
- [x] Clicking task leads to `/tasks/:id`
- [x] Clicking flow leads to `/flows/:id`
- [x] Clicking run leads to `/runs/:id`
- [x] Old `/d/:id` URLs redirect to `/datasets/:id`
- [x] Old `/t/:id` URLs redirect to `/tasks/:id`
- [x] Old `/f/:id` URLs redirect to `/flows/:id`
- [x] Old `/r/:id` URLs redirect to `/runs/:id`
- [x] Detail pages load correctly with new URLs
- [x] Internal links use new URL structure

## Files Changed

### New Files Created:

- `/app/src/pages/datasets/[id].js` - Dataset detail page (canonical)
- `/app/src/pages/tasks/[id].js` - Task detail page (canonical)
- `/app/src/pages/flows/[id].js` - Flow detail page (canonical)
- `/app/src/pages/runs/[id].js` - Run detail page (canonical)

### Modified Files:

- `/app/src/pages/d/[dataId].js` - Now redirects to `/datasets/:id`
- `/app/src/pages/t/[taskId].js` - Now redirects to `/tasks/:id`
- `/app/src/pages/f/[flowId].js` - Now redirects to `/flows/:id`
- `/app/src/pages/r/[runId].js` - Now redirects to `/runs/:id`
- `/app/src/components/search/ResultCard.js` - Added entity-aware URL generation
- `/app/src/components/search/taskCard.js` - Fixed Title component
- `/app/src/components/search/flowCard.js` - Fixed Title component
- `/app/src/services/OpenMLSearchConnector.js` - Added entity type metadata
- `/app/src/search_configs/runConfig.js` - Added run_id field

## SEO Impact 📈

**Before:**

- URLs like `/d/123`, `/t/456` are not descriptive
- Search engines can't understand content from URL
- Poor user experience when sharing links

**After:**

- URLs like `/datasets/123`, `/tasks/456` are self-documenting
- Better search engine indexing
- Professional appearance for academic citations
- Improved social media sharing with descriptive URLs

## Breaking Changes ⚠️

**None** - All old URLs continue to work via automatic redirects.

## Migration Notes

For developers working with links:

- Update any hardcoded links to use new URL structure
- Internal links already updated in this PR
- External links will redirect automatically

## Documentation Updated

- `TEAM_REPORT.md` - Updated with new URL structure and redirect information

## Related Issues

Fixes navigation issues where clicking on search results led to incorrect URLs.

## Deployment Notes

No special deployment steps required. Changes are backward compatible.

---

**Tested on:** Next.js 15.3.1 with Turbopack
**Browser Compatibility:** Chrome, Firefox, Safari, Edge
**Status:** Ready for review and merge
