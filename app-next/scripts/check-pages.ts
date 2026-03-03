/**
 * Page Health Check Script
 *
 * Crawls pages and checks for errors.
 * Fetches real IDs from OpenML API to test dynamic pages.
 * Saves errors to logs/check-pages-errors.log
 *
 * Usage:
 *   npm run check-pages              # Check localhost:3050
 *   npm run check-pages:vercel       # Check Vercel deployment
 *   SAMPLE_SIZE=50 npm run check-pages  # Check more pages per entity
 */

import * as fs from "fs";
import * as path from "path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3050";
const API_URL = "https://www.openml.org";
const SAMPLE_SIZE = parseInt(process.env.SAMPLE_SIZE || "10", 10);

// Error log file
const LOG_DIR = path.join(__dirname, "../logs");
const LOG_FILE = path.join(LOG_DIR, "check-pages-errors.log");

// Static pages to always check
const STATIC_PAGES = [
  "/",
  "/about",
  "/documentation",
  "/apis",
  "/terms",
  "/auth/signin",
  "/datasets",
  "/tasks",
  "/flows",
  "/runs",
  "/collections",
  "/benchmarks",
  "/measures",
  "/users",
];

interface CheckResult {
  url: string;
  status: number | "error";
  ok: boolean;
  error?: string;
  responseTime: number;
}

interface EntityConfig {
  name: string;
  path: string;
  apiEndpoint: string;
  idField: string;
}

interface EntityItem {
  [key: string]: string | number;
}

// Entity configurations for fetching real IDs
const ENTITIES: EntityConfig[] = [
  {
    name: "datasets",
    path: "/datasets",
    apiEndpoint: "/api/v1/json/data/list",
    idField: "did",
  },
  {
    name: "tasks",
    path: "/tasks",
    apiEndpoint: "/api/v1/json/task/list",
    idField: "task_id",
  },
  {
    name: "flows",
    path: "/flows",
    apiEndpoint: "/api/v1/json/flow/list",
    idField: "id",
  },
  {
    name: "users",
    path: "/users",
    apiEndpoint: "/api/v1/json/user/list",
    idField: "id",
  },
];

/**
 * Fetch sample IDs from OpenML API
 */
async function fetchEntityIds(entity: EntityConfig): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}${entity.apiEndpoint}`);
    if (!response.ok) {
      console.warn(`⚠️  Could not fetch ${entity.name} list from API`);
      return [];
    }

    const data = await response.json();

    // Navigate the nested response structure
    let items: EntityItem[] = [];

    if (entity.name === "datasets" && data.data?.dataset) {
      items = data.data.dataset;
    } else if (entity.name === "tasks" && data.tasks?.task) {
      items = data.tasks.task;
    } else if (entity.name === "flows" && data.flows?.flow) {
      items = data.flows.flow;
    } else if (entity.name === "users" && data.users?.user) {
      items = data.users.user;
    }

    if (!Array.isArray(items)) {
      console.warn(`⚠️  Unexpected API response for ${entity.name}`);
      return [];
    }

    // Get random sample of IDs
    const allIds = items.map((item) => String(item[entity.idField]));
    const shuffled = allIds.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, SAMPLE_SIZE);
  } catch (error) {
    console.warn(`⚠️  Error fetching ${entity.name}: ${error}`);
    return [];
  }
}

/**
 * Check a single page
 */
async function checkPage(path: string): Promise<CheckResult> {
  const url = `${BASE_URL}${path}`;
  const start = Date.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "OpenML-PageChecker/1.0",
      },
    });

    const responseTime = Date.now() - start;

    // Check if response contains error indicators
    const text = await response.text();
    const hasRuntimeError =
      text.includes("Runtime Error") ||
      text.includes("Application error") ||
      text.includes("Internal Server Error") ||
      text.includes("is not configured under images") ||
      text.includes("Unhandled Runtime Error");

    return {
      url,
      status: response.status,
      ok: response.ok && !hasRuntimeError,
      error: hasRuntimeError ? "Page contains runtime error" : undefined,
      responseTime,
    };
  } catch (error) {
    return {
      url,
      status: "error",
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
      responseTime: Date.now() - start,
    };
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(`\n🔍 OpenML Page Health Check`);
  console.log(`   Target: ${BASE_URL}`);
  console.log(`   Sample size per entity: ${SAMPLE_SIZE}`);
  console.log("=".repeat(60));

  const results: CheckResult[] = [];

  // Check static pages
  console.log("\n📄 Static Pages:\n");
  for (const path of STATIC_PAGES) {
    const result = await checkPage(path);
    results.push(result);
    printResult(path, result);
  }

  // Check dynamic pages with real IDs from API
  for (const entity of ENTITIES) {
    console.log(`\n📦 ${entity.name} (fetching ${SAMPLE_SIZE} samples):\n`);

    const ids = await fetchEntityIds(entity);
    if (ids.length === 0) {
      console.log(`   Skipping - no IDs fetched`);
      continue;
    }

    for (const id of ids) {
      const path = `${entity.path}/${id}`;
      const result = await checkPage(path);
      results.push(result);
      printResult(path, result);
    }
  }

  // Summary
  printSummary(results);
}

function printResult(path: string, result: CheckResult) {
  const icon = result.ok ? "✅" : "❌";
  const status = typeof result.status === "number" ? result.status : "ERR";
  const time = `${result.responseTime}ms`;

  console.log(`${icon} [${status}] ${path} (${time})`);
  if (result.error) {
    console.log(`   └─ ${result.error}`);
  }
}

function printSummary(results: CheckResult[]) {
  console.log("\n" + "=".repeat(60));
  const passed = results.filter((r: CheckResult) => r.ok).length;
  const failed = results.filter((r: CheckResult) => !r.ok).length;

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  console.log(`   Total pages checked: ${results.length}`);

  if (failed > 0) {
    console.log("\n❌ Failed pages:");
    const failedResults = results.filter((r) => !r.ok) as CheckResult[];
    failedResults.forEach((r) => {
      console.log(`   - ${r.url}`);
      if (r.error) console.log(`     ${r.error}`);
    });

    // Save errors to log file
    saveErrorLog(failedResults);

    process.exit(1);
  } else {
    console.log("\n✅ All pages OK!");
  }
}

/**
 * Save errors to log file
 */
function saveErrorLog(failedResults: CheckResult[]) {
  try {
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const logContent = [
      `=== OpenML Page Check Errors ===`,
      `Timestamp: ${timestamp}`,
      `Target: ${BASE_URL}`,
      `Failed: ${failedResults.length} pages`,
      ``,
      `--- Failed Pages ---`,
      ...failedResults.map((r) => {
        const status = typeof r.status === "number" ? r.status : "ERR";
        return `[${status}] ${r.url}${r.error ? `\n    Error: ${r.error}` : ""}`;
      }),
      ``,
      `=====================================`,
      ``,
    ].join("\n");

    // Append to log file
    fs.appendFileSync(LOG_FILE, logContent);
    console.log(`\n📝 Errors saved to: ${LOG_FILE}`);
  } catch (err) {
    console.warn(`⚠️  Could not save error log: ${err}`);
  }
}

main();
