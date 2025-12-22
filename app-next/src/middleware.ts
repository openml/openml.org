import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./config/routing";

// next-intl middleware with routing config
const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Handle legacy /search redirects BEFORE locale processing
  if (pathname === "/search") {
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    // If no type parameter, let next-intl handle it
    if (!type) {
      return intlMiddleware(request);
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
        // Unknown type, let next-intl handle it
        return intlMiddleware(request);
    }

    // Build the redirect URL (no locale prefix needed for English)
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

  // For all other routes, use next-intl middleware for locale handling
  return intlMiddleware(request);
}

/**
 * Configure which routes this middleware should run on
 * Match /search, short URLs, and all routes for locale detection
 */
export const config = {
  matcher: [
    // Match all routes except static files and API routes (but allow /apis page)
    "/((?!api/|_next|_vercel|.*\\..*).*)",
    // Legacy redirect patterns
    "/search",
    "/b/:path*",
    "/s/:path*",
  ],
};
