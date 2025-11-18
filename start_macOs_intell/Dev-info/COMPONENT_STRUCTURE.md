# 📁 Component Structure Guide

## 🎯 Current Structure (After Changes)

```
app/src/
├── pages/
│   ├── datasets.js                    ← 🆕 NEW! SEO-friendly route
│   ├── d/
│   │   └── search.js                  ← Redirects to /datasets
│   └── api/
│       └── search.js                  ← API endpoint (enhanced logging)
│
├── components/
│   └── search/
│       ├── SearchContainer.js         ← Container component (state management)
│       ├── DatasetSearchResults.jsx   ← 🆕 NEW! Presentation component
│       ├── ResultCard.js              ← List view card
│       ├── ResultGridCard.js          ← Grid view card
│       ├── ResultTable.js             ← Table view
│       ├── Filter.js                  ← Filter UI
│       ├── TagFilter.js               ← Tag filter
│       └── Sort.js                    ← Sort dropdown
│
├── search_configs/
│   └── dataConfig.js                  ← Elasticsearch config
│
├── services/
│   └── SearchAPIConnector.js          ← API communication
│
└── utils/
    └── useNextRouting.js              ← URL state management
```

---

## 🔄 Component Hierarchy

```
┌─────────────────────────────────────────┐
│         pages/datasets.js               │  ← Entry point (page)
│  - getStaticProps (translations)        │
│  - Meta tags (SEO)                      │
│  - Column definitions                   │
│  - Sort options                         │
│  - Facet configuration                  │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│      SearchContainer.js                 │  ← Container (smart component)
│  - SearchProvider setup                 │
│  - View state (list/table/grid)         │
│  - Filter state (show/hide)             │
│  - Layout and controls                  │
└────────────────┬────────────────────────┘
                 │
                 ├──────────────────────────┐
                 │                          │
                 ▼                          ▼
┌────────────────────────┐   ┌────────────────────────┐
│  Filter Components     │   │ DatasetSearchResults   │ ← 🆕 NEW!
│  - Facets              │   │  - Error handling      │
│  - TagFilter           │   │  - Empty states        │
│  - Sort dropdown       │   │  - View switching      │
└────────────────────────┘   └───────┬────────────────┘
                                     │
                     ┌───────────────┼───────────────┐
                     │               │               │
                     ▼               ▼               ▼
           ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
           │ ResultCard  │  │ResultsTable │  │ResultGrid   │
           │ (List view) │  │(Table view) │  │ Card        │
           └─────────────┘  └─────────────┘  └─────────────┘
```

---

## 📦 Component Responsibilities

### **pages/datasets.js** (Page Component)

**What it does:**

-   Defines the route `/datasets`
-   Sets up SEO meta tags
-   Configures search options (sort, filters, columns)
-   Passes config to SearchContainer

**What it doesn't do:**

-   Doesn't fetch data directly
-   Doesn't manage search state
-   Doesn't render results

**Key code:**

```javascript
export async function getStaticProps(context) {
  // Runs at build time for SEO
}

function DatasetsPage() {
  const combinedConfig = useNextRouting(dataConfig, "/datasets");
  return <SearchContainer config={combinedConfig} ... />
}
```

---

### **SearchContainer.js** (Container Component)

**What it does:**

-   Wraps everything in `<SearchProvider>`
-   Manages view state (list/table/grid)
-   Manages filter visibility
-   Provides layout structure
-   Coordinates between filters and results

**What it doesn't do:**

-   Doesn't render individual results
-   Doesn't handle specific dataset logic

**Key code:**

```javascript
const [view, setView] = useState('list');
const [filter, setFilter] = useState('hide');

return (
    <SearchProvider config={config}>
        {/* Filters */}
        {/* Results */}
        {/* Pagination */}
    </SearchProvider>
);
```

---

### **DatasetSearchResults.jsx** (Presentation Component) 🆕

**What it does:**

-   Receives search results from context
-   Switches between view modes
-   Shows empty states
-   Shows error states
-   Logs debug information

**What it doesn't do:**

-   Doesn't fetch data
-   Doesn't manage global state
-   Doesn't define search configuration

**Key code:**

```javascript
<WithSearch mapContextToProps={({ results, error }) => ({ results, error })}>
    {({ results, error }) => {
        if (error) return <ErrorState />;
        if (!results.length) return <EmptyState />;

        switch (view) {
            case 'list':
                return <ListView results={results} />;
            case 'table':
                return <TableView results={results} />;
            case 'grid':
                return <GridView results={results} />;
        }
    }}
</WithSearch>
```

---

## 🎨 Design Patterns Used

### **1. Container/Presentation Pattern**

**Container Components** (Smart):

-   Manage state
-   Handle logic
-   Connect to data sources
-   Example: `SearchContainer.js`

**Presentation Components** (Dumb):

-   Receive props
-   Render UI
-   No side effects
-   Example: `DatasetSearchResults.jsx`

**Benefits:**

-   ✅ Easier to test
-   ✅ More reusable
-   ✅ Clearer separation of concerns

---

### **2. Compound Components Pattern**

Multiple components working together:

```javascript
<SearchProvider>
    <Filters />
    <Results />
    <Pagination />
</SearchProvider>
```

**Benefits:**

-   ✅ Flexible composition
-   ✅ Shared state via context
-   ✅ Independent updates

---

### **3. Render Props Pattern**

`WithSearch` uses render props:

```javascript
<WithSearch mapContextToProps={...}>
  {(props) => <YourComponent {...props} />}
</WithSearch>
```

**Benefits:**

-   ✅ Dynamic rendering
-   ✅ Access to context
-   ✅ Flexible component composition

---

## 🔌 Data Flow

### **1. Initial Load**

```
User visits /datasets
       ↓
getStaticProps loads translations
       ↓
Page renders with SearchContainer
       ↓
SearchProvider initializes
       ↓
alwaysSearchOnInitialLoad: true
       ↓
Triggers search automatically
       ↓
SearchAPIConnector.onSearch()
       ↓
POST to /api/search
       ↓
Elasticsearch query
       ↓
Results returned
       ↓
DatasetSearchResults renders
```

### **2. User Searches**

```
User types "iris" in search box
       ↓
SearchProvider updates state
       ↓
Triggers new search
       ↓
SearchAPIConnector.onSearch()
       ↓
POST to /api/search with searchTerm
       ↓
Results updated
       ↓
DatasetSearchResults re-renders
```

### **3. User Applies Filter**

```
User selects "status: active"
       ↓
SearchProvider updates filters
       ↓
Triggers new search
       ↓
SearchAPIConnector.onSearch()
       ↓
POST to /api/search with filters
       ↓
Results filtered
       ↓
DatasetSearchResults re-renders
```

---

## 🆕 What You Can Customize

### **Easy Customizations**

1. **Add new view mode:**

```javascript
// In DatasetSearchResults.jsx
case "compact":
  return <CompactView results={results} />;
```

2. **Change empty state message:**

```javascript
// In DatasetSearchResults.jsx
const EmptyState = ({ searchTerm }) => (
    <Box>
        <Typography>Your custom message here</Typography>
    </Box>
);
```

3. **Add dataset-specific info:**

```javascript
// In ResultCard.js or create new component
<Box>
    <Typography>{result.name.raw}</Typography>
    <Typography>
        Instances: {result['qualities.NumberOfInstances'].raw}
    </Typography>
    <Typography>
        Features: {result['qualities.NumberOfFeatures'].raw}
    </Typography>
</Box>
```

### **Advanced Customizations**

1. **Add saved searches:**

```javascript
// Create new component: SavedSearches.jsx
// Store searches in localStorage or backend
// Display as tabs or dropdown
```

2. **Add export functionality:**

```javascript
// In DatasetSearchResults.jsx
const exportResults = (results, format) => {
    if (format === 'csv') {
        // Convert to CSV
    }
    if (format === 'json') {
        // Convert to JSON
    }
};
```

3. **Add comparison mode:**

```javascript
// Allow users to select multiple datasets
// Show side-by-side comparison
const [selectedDatasets, setSelectedDatasets] = useState([]);
```

---

## 📝 Adding New Components

### **Example: Add a "Quick Stats" Component**

**Step 1: Create the component**

```javascript
// components/search/QuickStats.jsx
import { Box, Typography, Grid } from '@mui/material';
import { WithSearch } from '@elastic/react-search-ui';

const QuickStats = () => {
    return (
        <WithSearch
            mapContextToProps={({ totalResults, facets }) => ({
                totalResults,
                facets,
            })}
        >
            {({ totalResults, facets }) => (
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Box>
                            <Typography variant='h4'>{totalResults}</Typography>
                            <Typography variant='body2'>
                                Total Datasets
                            </Typography>
                        </Box>
                    </Grid>
                    {/* Add more stats */}
                </Grid>
            )}
        </WithSearch>
    );
};

export default QuickStats;
```

**Step 2: Add to SearchContainer**

```javascript
// In SearchContainer.js
import QuickStats from "./QuickStats";

// Add before filters
<QuickStats />
<TabContext value={filter}>
  {/* existing filter code */}
</TabContext>
```

---

## 🎯 Best Practices

### **1. Keep Components Focused**

-   ✅ One component = one responsibility
-   ✅ Small, reusable components
-   ❌ Avoid giant multi-purpose components

### **2. Use Proper Naming**

-   Container components: `XxxContainer`
-   Presentation components: `Xxx` or `XxxView`
-   Utility components: `use Xxx` (hooks)

### **3. Prop Types**

```javascript
// Add PropTypes for better debugging
import PropTypes from 'prop-types';

DatasetSearchResults.propTypes = {
    view: PropTypes.oneOf(['list', 'table', 'grid']).isRequired,
    columns: PropTypes.array.isRequired,
};
```

### **4. Performance**

-   Use `memo()` for expensive components
-   Use `useMemo()` for expensive calculations
-   Use `useCallback()` for callbacks passed as props

---

## 📚 Next Steps

### **Beginner:**

1. Customize the empty state message
2. Change colors/styling
3. Add a new column to table view

### **Intermediate:**

1. Create a new view mode (e.g., "compact")
2. Add dataset comparison feature
3. Add export to CSV/JSON

### **Advanced:**

1. Implement saved searches
2. Add advanced filtering (date ranges, custom queries)
3. Create a dataset recommendation system
4. Add real-time collaboration features

---

## 💡 Key Takeaways

1. **Separation of Concerns**: Pages route, containers manage state, presentations render UI
2. **Composition**: Build complex UIs from simple, focused components
3. **Context Pattern**: Share state without prop drilling
4. **Debugging**: Add logging early, remove later
5. **Iteration**: Start simple, add features incrementally

---

**Remember:** Good component structure makes your code easier to understand, test, and maintain! 🎯
