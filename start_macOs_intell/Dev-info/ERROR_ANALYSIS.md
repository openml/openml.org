# 🐛 Error Analysis: 500 Internal Server Error

## 📊 **Error Breakdown**

### **What You're Seeing:**

```
Browser Console:
❌ POST http://localhost:3001/api/search 500 (Internal Server Error)
❌ Unexpected token '<', "<!doctype "... is not valid JSON

Browser UI:
❌ Showing 1 - 20 out of 0 results
❌ Error loading datasets
```

---

## 🔍 **What This Means (Terminology Explained)**

### **1. HTTP Status Code: 500**

-   **What it is:** Server crashed while processing your request
-   **Where:** In `/api/search.js` (Next.js API route)
-   **Why:** Could be Elasticsearch connection, invalid query, or code error

### **2. "Unexpected token '<', '<!doctype'..."**

-   **What it is:** JSON parsing error
-   **Why:** Next.js returned an HTML error page instead of JSON
-   **Breakdown:**
    ```
    Browser expects:  { "results": [...] }    ← JSON
    Server returned:  <!doctype html>...      ← HTML error page
    ```

### **3. POST Request**

-   **What it is:** HTTP method for sending data
-   **Why:** Search query is sent in request body
-   **Alternative:** GET (but only for simple queries)

---

## 🧪 **Step-by-Step Debugging**

### **Step 1: Test Elasticsearch Connection**

Open this URL in your browser:

```
http://localhost:3001/api/test-es
```

**What you should see:**

```json
{
  "success": true,
  "elasticsearch": {
    "reachable": true,
    "clusterName": "...",
    "version": "..."
  },
  "search": {
    "totalHits": 1234,
    "sampleResults": [...]
  }
}
```

**If you see an error:**

-   Elasticsearch is not accessible
-   Possible firewall/network issue
-   Try from terminal: `curl https://www.openml.org/es/`

---

### **Step 2: Check Next.js Terminal Output**

Look at the terminal running `npm run dev` for these messages:

**Good signs:**

```bash
🔍 /api/search called: {...}
📦 Creating new Elasticsearch connector for index: data
✅ Connector created successfully
🔎 Executing search...
✅ Search successful: { resultsCount: X, totalResults: Y }
```

**Bad signs (these tell you what's wrong):**

```bash
❌ Missing required fields: {...}
❌ Failed to create connector: Error message here
❌ Error in /api/search: { message: "...", stack: "..." }
```

---

### **Step 3: Check Browser Network Tab**

1. **Open Developer Tools:** Press `F12`
2. **Go to Network tab**
3. **Refresh the page**
4. **Find the `/api/search` request** (should be red)
5. **Click on it**

**Check these tabs:**

#### **Headers Tab:**

```
Status Code: 500 Internal Server Error
Request URL: http://localhost:3001/api/search
Request Method: POST
```

#### **Payload Tab (what was sent):**

```json
{
  "indexName": "data",
  "requestState": {
    "searchTerm": "",
    "filters": [],
    "resultsPerPage": 20
  },
  "queryConfig": {...}
}
```

#### **Response Tab (what came back):**

If you see HTML starting with `<!doctype html>`:

-   This is Next.js error page
-   The API crashed
-   Check Next.js terminal for actual error

If you see JSON with `"error"` field:

-   API handled error gracefully
-   Error message tells you what went wrong

---

## 🔧 **Common Issues & Solutions**

### **Issue 1: Cannot reach Elasticsearch**

**Symptoms:**

```
❌ Error: fetch failed
❌ Error: ENOTFOUND www.openml.org
❌ Error: connect ETIMEDOUT
```

**Test from terminal:**

```bash
# Test if ES is reachable
curl https://www.openml.org/es/

# Should return:
{
  "name" : "...",
  "cluster_name" : "...",
  "version" : {...}
}
```

**Solutions:**

1. Check internet connection
2. Check if VPN is blocking
3. Try from React app (port 3000) to verify ES works
4. Check firewall settings

---

### **Issue 2: CORS (Cross-Origin) Error**

**Symptoms:**

```
❌ Access to fetch blocked by CORS policy
❌ No 'Access-Control-Allow-Origin' header
```

**Solution:**
Enable proxy in `/api/search.js`:

```javascript
const use_dev_proxy = true; // Change from false to true
```

Then add to `next.config.js`:

```javascript
async rewrites() {
  return [
    {
      source: '/proxy/:path*',
      destination: 'https://www.openml.org/es/:path*',
    },
  ];
}
```

---

### **Issue 3: Invalid Index Name**

**Symptoms:**

```
❌ index_not_found_exception
❌ no such index [data]
```

**Solution:**
Check available indices:

```bash
curl https://www.openml.org/es/_cat/indices?v
```

Look for indices like:

-   `data`
-   `datasets`
-   `openml_data`

Update in `SearchAPIConnector.js`:

```javascript
constructor(indexName = "THE_CORRECT_INDEX_NAME") {
  this.indexName = indexName;
}
```

---

### **Issue 4: Module/Package Error**

**Symptoms:**

```
❌ Cannot find module '@elastic/search-ui-elasticsearch-connector'
❌ Module not found: Can't resolve '...'
```

**Solution:**

```bash
cd app
npm install @elastic/search-ui-elasticsearch-connector @elastic/react-search-ui
npm run dev
```

---

### **Issue 5: Query Configuration Error**

**Symptoms:**

```
❌ parsing_exception
❌ illegal_argument_exception
```

**Check `dataConfig.js`:**

```javascript
// Make sure field names match what's in Elasticsearch
search_fields: {
  name: { weight: 3 },        // ✅ Field must exist
  nonexistent: { weight: 1 }  // ❌ Will cause error
}
```

---

## 📋 **Debugging Checklist**

Copy and check each item:

```
□ Next.js is running (npm run dev)
□ Can access http://localhost:3001
□ Can access http://localhost:3001/api/test-es
□ test-es returns success: true
□ Browser console shows no red errors before clicking
□ Network tab is open and recording
□ Next.js terminal is visible and showing logs
□ Cleared browser cache (Ctrl+Shift+Delete)
□ Tried in incognito/private mode
```

---

## 💡 **Reading the Next.js Terminal**

### **How to Read Error Stack Traces:**

```bash
❌ Error in /api/search: {
  message: "fetch failed",           ← What went wrong
  name: "TypeError",                 ← Type of error
  stack: "TypeError: fetch failed    ← Where it happened
    at Object.fetch (node:internal/deps/undici/undici:11730:11)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async handler (/app/src/pages/api/search.js:45:20)"
                                                    ↑↑↑↑
                                          Line number where error occurred
}
```

### **Common Error Types:**

| Error Type       | Meaning                | Likely Cause                         |
| ---------------- | ---------------------- | ------------------------------------ |
| `TypeError`      | Wrong data type        | Accessing property of null/undefined |
| `ReferenceError` | Variable not found     | Typo or undeclared variable          |
| `SyntaxError`    | Code syntax wrong      | Missing bracket, comma, etc.         |
| `FetchError`     | Network request failed | Cannot reach URL                     |
| `TimeoutError`   | Request took too long  | Elasticsearch slow/unreachable       |

---

## 🎯 **Most Likely Issues (Ranked)**

Based on your error, here's what's most likely wrong:

### **1. Elasticsearch Connection (90% likely)**

-   Cannot reach `https://www.openml.org/es/`
-   Network/firewall blocking request
-   **Test:** Run `http://localhost:3001/api/test-es`

### **2. Module Import Error (5% likely)**

-   Package not installed correctly
-   **Test:** Check Next.js terminal for import errors

### **3. Query Configuration Error (3% likely)**

-   Invalid field names in dataConfig.js
-   **Test:** Compare with React app's working config

### **4. CORS Issue (2% likely)**

-   Browser blocking cross-origin request
-   **Test:** Check console for CORS message

---

## 📞 **What to Share When Asking for Help**

Please provide:

1. **Next.js Terminal Output:**

    ```bash
    # Copy everything from when you loaded the page
    # Should start with: 🔍 /api/search called: {...}
    ```

2. **Test ES Result:**

    ```
    # Visit: http://localhost:3001/api/test-es
    # Copy the JSON response
    ```

3. **Browser Network Tab:**

    - Screenshot of `/api/search` request
    - Show Headers, Payload, and Response tabs

4. **Browser Console:**
    ```javascript
    // Copy all error messages
    ```

---

## 🚀 **Quick Fix Actions**

Try these in order:

### **Action 1: Test ES Connection**

```bash
curl https://www.openml.org/es/
```

### **Action 2: Visit Test Endpoint**

```
http://localhost:3001/api/test-es
```

### **Action 3: Check Package Installation**

```bash
cd app
npm list @elastic/search-ui-elasticsearch-connector
```

### **Action 4: Clear and Restart**

```bash
# Kill Next.js (Ctrl+C)
rm -rf .next
npm run dev
```

### **Action 5: Check if React App Works**

```
http://localhost:3000/search?type=data&status=active
```

If this works, ES is fine - issue is in Next.js config.

---

## 📚 **Understanding Key Concepts**

### **API Route (/api/search.js)**

-   Runs on the **server** (not browser)
-   Can make external API calls safely
-   Returns JSON to browser
-   Catches errors and returns 500 if something fails

### **Elasticsearch Connector**

-   Library that talks to Elasticsearch
-   Converts search UI state to ES queries
-   Handles pagination, sorting, filtering
-   Returns formatted results

### **Request Flow:**

```
Browser
  → SearchProvider (React)
    → SearchAPIConnector.onSearch()
      → POST /api/search
        → ElasticsearchAPIConnector
          → https://www.openml.org/es/
            → Returns results
          ← Data flows back
```

---

**Next Step:** Please run `http://localhost:3001/api/test-es` and share what you see! 🎯
