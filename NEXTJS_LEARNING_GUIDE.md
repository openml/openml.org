# 🎓 STEP-BY-STEP LEARNING GUIDE: Next.js Routing & Data Fetching

## 📋 What We Just Did

### **Summary of Changes**

1. ✅ Created new `/datasets` route (better SEO)
2. ✅ Added redirect from `/d/search` → `/datasets`
3. ✅ Fixed potential routing issues
4. ✅ Added comprehensive SEO meta tags

---

## 🔍 Understanding the 500 Error

### **What Causes a 500 Error?**

A 500 (Internal Server Error) happens when:

-   Server-side code crashes
-   API connection fails
-   Missing environment variables
-   Elasticsearch connection issues

### **How to Debug**

1. **Check Browser Console** (F12 → Console tab)

    ```
    Look for red error messages
    ```

2. **Check Terminal Where Next.js Runs**

    ```bash
    # Your terminal running: npm run dev
    # Look for error stack traces
    ```

3. **Check Network Tab** (F12 → Network tab)
    ```
    - Look for failed requests (red)
    - Click on the failed request
    - Check "Response" tab for error details
    ```

---

## 📚 LESSON: Next.js Routing Explained

### **File-Based Routing**

Next.js automatically creates routes based on file structure:

```
/pages
  ├── index.js           → /
  ├── about.js           → /about
  ├── datasets.js        → /datasets  ✅ NEW!
  ├── d/
  │   └── search.js      → /d/search  ⚠️ OLD (now redirects)
  └── d/
      └── [dataId].js    → /d/123 (dynamic route)
```

### **Dynamic Routes**

Files with `[brackets]` are dynamic:

-   `[dataId].js` → matches `/d/1`, `/d/42`, `/d/anything`
-   `[...slug].js` → catches all routes (e.g., `/docs/guide/intro`)

---

## 📚 LESSON: getStaticProps vs getServerSideProps

### **getStaticProps** (What we used)

```javascript
export async function getStaticProps(context) {
    // Runs at BUILD TIME (npm run build)
    // Creates static HTML pages

    return {
        props: {
            data: 'This is pre-rendered at build time',
        },
        revalidate: 60, // Optional: Re-generate page every 60 seconds
    };
}
```

**When to use:**

-   ✅ Content doesn't change often
-   ✅ Same content for all users
-   ✅ Best for SEO
-   ✅ Fastest page loads

**Example:** Blog posts, product pages, documentation

---

### **getServerSideProps** (Alternative)

```javascript
export async function getServerSideProps(context) {
    // Runs on EVERY REQUEST
    // Fresh data every time

    const res = await fetch('https://api.example.com/data');
    const data = await res.json();

    return {
        props: { data },
    };
}
```

**When to use:**

-   ✅ Content changes frequently
-   ✅ Personalized for each user
-   ✅ Need request headers (cookies, etc.)

**Example:** User dashboards, real-time data, authenticated pages

---

## 📚 LESSON: Client-Side Data Fetching

### **Using useEffect + fetch** (Traditional way)

```javascript
import { useState, useEffect } from 'react';

function MyComponent() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // This runs in the BROWSER after page loads
        fetch('/api/data')
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []); // Empty array = run once on mount

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <div>{data}</div>;
}
```

**When to use:**

-   ✅ Data changes based on user interaction
-   ✅ Search results, filters, pagination
-   ✅ Real-time updates

---

### **Using SWR** (Modern, recommended)

```javascript
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

function MyComponent() {
    const { data, error, isLoading } = useSWR('/api/data', fetcher);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error!</div>;

    return <div>{data}</div>;
}
```

**Benefits:**

-   ✅ Automatic caching
-   ✅ Automatic revalidation
-   ✅ Deduplication (won't fetch same data twice)
-   ✅ Error retry logic

---

## 📚 LESSON: SEO Best Practices

### **1. Meta Tags in Next.js**

```javascript
import Head from 'next/head';

function MyPage() {
    return (
        <>
            <Head>
                {/* Page title - appears in browser tab and search results */}
                <title>OpenML Datasets - Search ML Datasets</title>

                {/* Description - appears in search results */}
                <meta
                    name='description'
                    content='Search thousands of ML datasets'
                />

                {/* Keywords - less important now, but still useful */}
                <meta
                    name='keywords'
                    content='machine learning, datasets, ML'
                />

                {/* Open Graph - for social media sharing */}
                <meta property='og:title' content='OpenML Datasets' />
                <meta property='og:description' content='Search ML datasets' />
                <meta property='og:image' content='/og-image.jpg' />

                {/* Twitter Card - for Twitter sharing */}
                <meta name='twitter:card' content='summary_large_image' />

                {/* Canonical URL - tells Google which URL is the "real" one */}
                <link rel='canonical' href='https://www.openml.org/datasets' />
            </Head>

            {/* Your page content */}
        </>
    );
}
```

### **2. Semantic HTML**

```javascript
// ❌ Bad for SEO
<div className="heading">My Title</div>
<div className="paragraph">My content</div>

// ✅ Good for SEO
<h1>My Title</h1>
<p>My content</p>
<article>...</article>
<nav>...</nav>
```

### **3. URL Structure**

```
❌ Bad:
/d/search?type=data
/page?id=123

✅ Good:
/datasets
/datasets/iris
/blog/my-post-title
```

---

## 📚 LESSON: Understanding Our Search Implementation

### **How the Search Works**

```
┌─────────────┐
│   Browser   │ User types in search box
└──────┬──────┘
       │
       │ 1. User interaction triggers search
       ▼
┌─────────────────┐
│ SearchContainer │ React component that manages UI
└──────┬──────────┘
       │
       │ 2. Calls SearchAPIConnector
       ▼
┌──────────────────────┐
│ SearchAPIConnector   │ Sends request to /api/search
└──────┬───────────────┘
       │
       │ 3. POST request to Next.js API
       ▼
┌──────────────────┐
│ /api/search.js   │ Next.js API route (runs on server)
└──────┬───────────┘
       │
       │ 4. Queries Elasticsearch
       ▼
┌──────────────────┐
│  Elasticsearch   │ Returns search results
└──────┬───────────┘
       │
       │ 5. Results flow back up
       ▼
┌─────────────────┐
│   Browser UI    │ Displays results to user
└─────────────────┘
```

### **Key Files**

1. **`/pages/datasets.js`** - The page component (UI)
2. **`/components/search/SearchContainer.js`** - Search UI logic
3. **`/services/SearchAPIConnector.js`** - API communication
4. **`/pages/api/search.js`** - Server-side API endpoint
5. **`/search_configs/dataConfig.js`** - Search configuration

---

## 🐛 Troubleshooting Checklist

### **If you see 500 error:**

1. ✅ **Check Elasticsearch is running**

    ```bash
    # Check if Elasticsearch is accessible
    curl https://www.openml.org/es/
    ```

2. ✅ **Check environment variables**

    ```bash
    # In your app directory
    cat .env.local

    # Should have:
    # ELASTICSEARCH_URL=...
    ```

3. ✅ **Check browser console**

    - Press F12
    - Go to Console tab
    - Look for red errors

4. ✅ **Check Next.js terminal**

    - Look at the terminal running `npm run dev`
    - Check for error stack traces

5. ✅ **Check Network tab**
    - F12 → Network tab
    - Click on failed request
    - Check Response tab

---

## 🧪 Testing Your Changes

### **Step 1: Test New Route**

1. Open browser: `http://localhost:3001/datasets`
2. Should see search page
3. Try searching for "iris"
4. Check filters work
5. Check pagination works

### **Step 2: Test Redirect**

1. Open browser: `http://localhost:3001/d/search`
2. Should automatically redirect to `/datasets`
3. URL in browser should change

### **Step 3: Test with Query Parameters**

1. Open: `http://localhost:3001/d/search?status=active`
2. Should redirect to: `http://localhost:3001/datasets?status=active`
3. Status filter should be pre-applied

---

## 📊 URL Query Parameters Explained

### **What are query parameters?**

```
http://localhost:3001/datasets?status=active&sort=date&page=2
                                ↑
                                Query parameters start here

status=active    ← Filter by status
sort=date        ← Sort by date
page=2           ← Show page 2
```

### **How to read them in Next.js**

```javascript
import { useRouter } from 'next/router';

function MyComponent() {
    const router = useRouter();

    // Get query parameters
    const { status, sort, page } = router.query;

    console.log(status); // "active"
    console.log(sort); // "date"
    console.log(page); // "2"

    return <div>Status: {status}</div>;
}
```

### **How to set them**

```javascript
import { useRouter } from 'next/router';

function MyComponent() {
    const router = useRouter();

    const applyFilter = () => {
        // Update URL with new query parameters
        router.push({
            pathname: '/datasets',
            query: { status: 'active', sort: 'date' },
        });
        // URL becomes: /datasets?status=active&sort=date
    };

    return <button onClick={applyFilter}>Apply Filter</button>;
}
```

---

## 🚀 Next Steps

### **1. Update Links Throughout Your App**

Find and replace old links:

```javascript
// Old
<Link href="/d/search">Search Datasets</Link>

// New
<Link href="/datasets">Search Datasets</Link>
```

### **2. Add More SEO Pages**

You can apply the same pattern to:

-   `/flows` (instead of `/f/search`)
-   `/tasks` (instead of `/t/search`)
-   `/runs` (instead of `/r/search`)

### **3. Add Structured Data**

Improve SEO with structured data:

```javascript
<Head>
    <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
            __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Dataset',
                name: 'OpenML Datasets',
                description: 'Machine learning datasets',
            }),
        }}
    />
</Head>
```

---

## 📖 Additional Resources

### **Official Documentation**

-   Next.js Routing: https://nextjs.org/docs/routing/introduction
-   Next.js Data Fetching: https://nextjs.org/docs/basic-features/data-fetching
-   Next.js SEO: https://nextjs.org/learn/seo/introduction-to-seo

### **Learn More**

-   React Router vs Next.js Router
-   Client-side vs Server-side rendering
-   Static Generation vs Server-side Rendering

---

## ❓ Common Questions

**Q: When should I use getStaticProps vs getServerSideProps?**
A: Use getStaticProps for content that doesn't change often. Use getServerSideProps for user-specific or frequently changing content.

**Q: Do I need to restart Next.js after changes?**
A: No! Next.js has Hot Module Replacement. Changes appear automatically. But if you add new files in `/pages`, you might need to refresh the browser.

**Q: Why use redirects instead of just renaming the file?**
A: To maintain backward compatibility. Old bookmarks and external links still work.

**Q: How do I debug Elasticsearch issues?**
A: Check browser console, Network tab, and Next.js terminal. Make sure Elasticsearch is accessible.

---

## 🎯 Key Takeaways

1. ✅ Next.js uses file-based routing
2. ✅ getStaticProps is best for SEO (runs at build time)
3. ✅ Use client-side fetching for dynamic/interactive data
4. ✅ Good URLs improve SEO: `/datasets` > `/d/search`
5. ✅ Always add proper meta tags for SEO
6. ✅ Use redirects to maintain backward compatibility
7. ✅ Query parameters let you share filtered/sorted results

---

**🎓 You've learned:**

-   Next.js routing system
-   Data fetching strategies
-   SEO optimization
-   Debugging techniques
-   URL structure best practices

**Keep practicing and building! 🚀**
