# 🎯 Entity Migration Strategy

## Overview

Strategy for migrating all OpenML entity types (tasks, flows, runs, collections, etc.) from the old React app to the new Next.js 15 app-next structure, while maintaining backwards compatibility and supporting translations.

---

## 📋 Entities to Migrate

1. ✅ **Datasets** - COMPLETE (reference implementation)
2. 🔄 **Tasks** - TODO
3. 🔄 **Flows** - TODO
4. 🔄 **Runs** - TODO
5. 🔄 **Collections** - TODO
6. 🔄 **Benchmarks** - TODO
7. 🔄 **Measures** - TODO

---

## 🏗️ Architecture Approach

### **Option A: Generic + Override Pattern** ⭐ RECOMMENDED

**Pros:**

- Minimal code duplication
- Easy to add new entities
- Consistent UX across all entities
- Easy to maintain

**Cons:**

- Requires upfront abstraction work
- Slightly more complex initially

**Structure:**

```
components/
├── entity/                       # Generic components
│   ├── entity-header.tsx         # Works for ALL entities
│   ├── entity-description.tsx
│   ├── entity-metadata-grid.tsx
│   └── entity-toc.tsx
├── dataset/                      # Dataset-specific overrides
│   ├── feature-table.tsx
│   └── quality-table.tsx
├── task/                         # Task-specific overrides
│   └── evaluation-setup.tsx
└── flow/                         # Flow-specific overrides
    ├── parameters-table.tsx
    └── dependencies-list.tsx
```

### **Option B: Copy & Customize Pattern**

**Pros:**

- Faster initial implementation
- Each entity is independent

**Cons:**

- Lots of code duplication
- Hard to maintain consistency
- Bug fixes need to be applied everywhere

---

## 🔧 Implementation Steps

### **Phase 1: Create Generic Infrastructure** (Week 1)

1. **Central Configuration** ✅ DONE
   - [x] `src/config/entities.ts` - Entity metadata
   - [ ] Add translation keys mapping

2. **Generic Components**

   ```typescript
   // entity-header.tsx
   export function EntityHeader({ entity, config }: Props) {
     const Icon = config.icon;
     return (
       <header>
         <Icon style={{ color: config.color }} />
         <h1>{entity[config.nameField]}</h1>
         {/* Render stats dynamically from config */}
       </header>
     );
   }
   ```

3. **Update Search Components**
   - Make `result-card.tsx` entity-aware
   - Make `results-table.tsx` entity-aware
   - `search-container.tsx` already generic ✅

### **Phase 2: Migrate Each Entity** (Weeks 2-4)

For each entity (task, flow, run):

1. **Create Search Config**

   ```typescript
   // src/search_configs/taskConfig.ts
   import OpenMLSearchConnector from "../services/OpenMLSearchConnector";
   const apiConnector = new OpenMLSearchConnector("task");

   export default {
     apiConnector,
     // ... search fields, facets, etc.
   };
   ```

2. **Create List Page**

   ```typescript
   // app/[locale]/tasks/page.tsx
   import { entityConfigs } from '@/config/entities';
   import { SearchContainer } from '@/components/search/search-container';

   export default function TasksPage() {
     const config = entityConfigs.task;
     return <SearchContainer entityType="task" config={taskConfig} />;
   }
   ```

3. **Create Detail Page**

   ```typescript
   // app/[locale]/tasks/[id]/page.tsx
   import { EntityHeader } from '@/components/entity/entity-header';
   import { EntityDescription } from '@/components/entity/entity-description';

   export default async function TaskDetailPage({ params }) {
     const task = await fetchTask(params.id);
     const config = entityConfigs.task;

     return (
       <>
         <EntityHeader entity={task} config={config} />
         <EntityDescription entity={task} config={config} />
         {/* Task-specific sections */}
         <EvaluationSetup task={task} />
       </>
     );
   }
   ```

4. **Create Entity-Specific Components** (only if needed)
   - `components/task/evaluation-setup.tsx`
   - `components/flow/parameters-table.tsx`

---

## 🔄 Backwards Compatibility Strategy

### **URL Redirects**

```typescript
// middleware.ts or next.config.ts
const redirects = {
  "/search?type=data": "/datasets",
  "/search?type=task": "/tasks",
  "/search?type=flow": "/flows",
  "/d/:id": "/datasets/:id",
  "/t/:id": "/tasks/:id",
  "/f/:id": "/flows/:id",
  "/r/:id": "/runs/:id",
};
```

### **API Compatibility**

Keep old API endpoints working:

```
/api/v1/json/data/31       → Still works
/datasets/31               → New URL (preferred)
```

### **Query Parameter Migration**

```typescript
// utils/legacyUrlMapper.ts
export function migrateLegacyUrl(oldParams: URLSearchParams) {
  // Old: /search?type=data&status=active&sort=runs
  // New: /datasets?status=active&sort=runs

  const type = oldParams.get("type");
  const filters = {};
  // ... map old params to new format

  return { path: `/${type}s`, filters };
}
```

---

## 🌍 Translation Strategy

### **What to Translate:**

✅ **User-Facing Text:**

- Entity names: "Dataset", "Task", "Flow"
- Section labels: "Description", "Information", "Features"
- Stat labels: "Runs", "Likes", "Downloads"
- Facet labels: "Status", "License", "Task Type"
- Button text: "Download", "Like", "Run Experiment"

❌ **Do NOT Translate:**

- Field names: `data_id`, `task_id`, `flow_id`
- API keys: `source_data.name`, `tasktype.name`
- Filter values from API: "classification", "active", "CC BY"
- Status codes: "active", "deactivated"

### **Translation Files:**

```json
// messages/en.json
{
  "entity": {
    "dataset": {
      "singular": "Dataset",
      "plural": "Datasets",
      "section": {
        "description": "Description",
        "information": "Dataset Information",
        "features": "Features",
        "qualities": "Dataset Qualities"
      },
      "stat": {
        "runs": "Runs",
        "nr_of_likes": "Likes",
        "nr_of_downloads": "Downloads"
      }
    },
    "task": {
      "singular": "Task",
      "plural": "Tasks"
      // ...
    }
  }
}
```

```json
// messages/nl.json
{
  "entity": {
    "dataset": {
      "singular": "Dataset",
      "plural": "Datasets",
      "section": {
        "description": "Beschrijving",
        "information": "Dataset Informatie",
        "features": "Kenmerken",
        "qualities": "Dataset Kwaliteiten"
      }
    }
  }
}
```

### **Usage in Components:**

```typescript
import { useTranslations } from 'next-intl';

export function EntityHeader({ entity, config }: Props) {
  const t = useTranslations('entity');

  return (
    <h1>
      {t(`${config.type}.singular`)}: {entity.name}
    </h1>
  );
}
```

### **Filter Translation Pattern:**

```typescript
// For facets - translate the LABEL, not the VALUE
<Facet
  field="status"
  label={t('entity.dataset.facet.status')}  // ✅ Translate this
  // values from API stay as-is: "active", "deactivated"
/>
```

---

## 📊 Migration Priority & Effort

| Entity      | Priority | Effort | Dependencies     |
| ----------- | -------- | ------ | ---------------- |
| Tasks       | HIGH     | Medium | Datasets (done)  |
| Flows       | HIGH     | Medium | None             |
| Runs        | MEDIUM   | High   | Tasks + Flows    |
| Collections | MEDIUM   | Medium | Datasets + Tasks |
| Benchmarks  | LOW      | Medium | Tasks + Runs     |
| Measures    | LOW      | Low    | None             |

**Recommended Order:**

1. Tasks (most similar to datasets)
2. Flows (independent)
3. Collections (simpler, good test of generic system)
4. Runs (complex, requires tasks + flows)
5. Benchmarks
6. Measures

---

## ✅ Quality Checklist

For each entity migration:

**Functionality:**

- [ ] Search page works with all filters
- [ ] Detail page loads correctly
- [ ] All stats display properly
- [ ] Icons and colors match design
- [ ] Links to related entities work
- [ ] SEO metadata is correct

**Backwards Compatibility:**

- [ ] Old URLs redirect to new URLs
- [ ] Old API endpoints still work
- [ ] Query parameters are migrated
- [ ] Bookmarks don't break

**Translations:**

- [ ] UI text is translated
- [ ] API values are NOT translated
- [ ] All locales tested (en, nl, de, fr)
- [ ] Missing keys are logged

**Performance:**

- [ ] Page loads under 3 seconds
- [ ] ISR caching is configured
- [ ] Images are optimized
- [ ] No console errors

---

## 🚀 Next Steps

### **Immediate (This Week):**

1. ✅ Create entity configuration system
2. ⏳ Review with team (discuss translations)
3. ⏳ Create generic entity-header component
4. ⏳ Test with tasks entity

### **Short Term (Next 2 Weeks):**

1. Migrate Tasks completely
2. Update search components to be entity-aware
3. Implement URL redirects
4. Test backwards compatibility

### **Medium Term (Next Month):**

1. Migrate Flows and Collections
2. Implement full translation system
3. Migrate Runs
4. Performance optimization

---

## 🤔 Discussion Points for Team

1. **Translation Scope:**
   - Which languages to prioritize?
   - Should filter values be translated? (Recommend: NO)
   - How to handle user-generated content? (Recommend: leave as-is)

2. **URL Structure:**
   - Keep `/search?type=data` or redirect to `/datasets`?
   - Short URLs (`/d/31`) or long (`/datasets/31`)?
   - How long to maintain redirects?

3. **Feature Parity:**
   - Do all entities need all features? (e.g., likes, downloads)
   - Should we simplify some entities?
   - Any entities we can deprecate?

4. **Performance:**
   - Which pages need ISR caching?
   - Should we pre-generate popular entities?
   - CDN strategy?

---

## 📚 Resources

- [Entity Config](/app-next/src/config/entities.ts)
- [Dataset Implementation](/app-next/src/components/dataset/) - Reference
- [Search Container](/app-next/src/components/search/search-container.tsx)
- [Old Search Panel](/server/src/client/app/src/pages/search/SearchPanel.js)
- [Next.js i18n Docs](https://next-intl-docs.vercel.app/)
- [Elastic Search UI Docs](https://docs.elastic.co/search-ui/overview)

---

**Last Updated:** December 10, 2025  
**Status:** Strategy Defined - Ready for Team Review
