import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for backward-compatible query-based URL redirects
 *
 * Handles complex legacy URLs that cannot be redirected in next.config.ts
 * because they use query parameters that need to be transformed into paths.
 *
 * Examples:
 * - /search?type=data&id=1464 → /datasets/1464
 * - /search?type=task → /tasks
 * - /search?type=study&study_type=task → /collections/tasks
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Only process /search URLs
  if (pathname !== "/search") {
    return NextResponse.next();
  }
  s;

  const type = searchParams.get("type");
  const id = searchParams.get("id");

  // If no type parameter, let the page handle it
  if (!type) {
    return NextResponse.next();
  }

  let newPath = "";

  // Map query-based URLs to new SEO-friendly paths
  switch (type) {
    // Datasets: /search?type=data → /datasets
    case "data":
      newPath = id ? `/datasets/${id}` : "/datasets";
      break;

    // Tasks: /search?type=task → /tasks
    case "task":
      newPath = id ? `/tasks/${id}` : "/tasks";
      break;

    // Flows: /search?type=flow → /flows
    case "flow":
      newPath = id ? `/flows/${id}` : "/flows";
      break;

    // Runs: /search?type=run → /runs
    case "run":
      newPath = id ? `/runs/${id}` : "/runs";
      break;

    // Collections (Studies)
    case "study": {
      // If ID is provided, redirect to specific collection
      if (id) {
        newPath = `/collections/${id}`;
      } else {
        const studyType = searchParams.get("study_type");
        if (studyType === "task") {
          newPath = "/collections/tasks";
        } else if (studyType === "run") {
          newPath = "/collections/runs";
        } else {
          newPath = "/collections/tasks"; // Default
        }
      }
      break;
    }

    // Benchmarks
    case "benchmark": {
      // If ID is provided, redirect to specific benchmark
      if (id) {
        newPath = `/benchmarks/${id}`;
      } else {
        const studyType = searchParams.get("study_type");
        if (studyType === "task") {
          newPath = "/benchmarks/tasks";
        } else if (studyType === "run") {
          newPath = "/benchmarks/runs";
        } else {
          newPath = "/benchmarks/tasks"; // Default
        }
      }
      break;
    }

    // Task Types: /search?type=task_type → /task-types
    case "task_type":
      newPath = "/task-types";
      break;

    // Measures
    case "measure": {
      const measureType = searchParams.get("measure_type");
      if (measureType === "data_quality") {
        newPath = "/measures/data-qualities";
      } else if (measureType === "evaluation_measure") {
        newPath = "/measures/evaluation-measures";
      } else if (measureType === "estimation_procedure") {
        newPath = "/measures/estimation-procedures";
      } else {
        newPath = "/measures"; // Default to all measures
      }
      break;
    }

    default:
      // Unknown type, let the page handle it
      return NextResponse.next();
  }

  // Build the redirect URL
  const url = request.nextUrl.clone();
  url.pathname = newPath;

  // Remove the legacy query parameters that we've already processed
  url.searchParams.delete("type");
  url.searchParams.delete("id");
  url.searchParams.delete("study_type");
  url.searchParams.delete("measure_type");

  // Preserve other query parameters (sort, status, filters, etc.)
  // e.g., /search?type=data&sort=runs&status=active → /datasets?sort=runs&status=active

  // Return 301 (Permanent Redirect) to preserve SEO
  return NextResponse.redirect(url, { status: 301 });
}

/**
 * Configure which routes this middleware should run on
 * Match /search and short URLs without type prefix
 */
export const config = {
  matcher: ["/search", "/b/:path*", "/s/:path*"],
};
