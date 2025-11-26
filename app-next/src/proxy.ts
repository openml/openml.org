import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy for backward-compatible URL redirects
 *
 * Academic papers and external links often cite OpenML entities using short URLs:
 * - /d/:id (datasets)
 * - /t/:id (tasks)
 * - /f/:id (flows)
 * - /r/:id (runs)
 *
 * This proxy ensures these legacy URLs redirect to the new SEO-friendly URLs:
 * - /d/:id → /datasets/:id (301 permanent redirect)
 * - /t/:id → /tasks/:id (301 permanent redirect)
 * - /f/:id → /flows/:id (301 permanent redirect)
 * - /r/:id → /runs/:id (301 permanent redirect)
 *
 * This preserves:
 * ✅ Academic citations
 * ✅ Bookmarks
 * ✅ Stack Overflow answers
 * ✅ External blog posts
 * ✅ Google PageRank (301 redirects pass link equity)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Map of legacy URL patterns to new SEO-friendly URLs
  const redirects: Record<string, string> = {
    // Entity detail pages
    "^/d/(\\d+)": "/datasets/$1",
    "^/t/(\\d+)": "/tasks/$1",
    "^/f/(\\d+)": "/flows/$1",
    "^/r/(\\d+)": "/runs/$1",

    // Search pages (backward compatibility)
    "^/d/search": "/datasets",
    "^/t/search": "/tasks",
    "^/f/search": "/flows",
    "^/r/search": "/runs",
  };

  // Check each redirect pattern
  for (const [pattern, replacement] of Object.entries(redirects)) {
    const regex = new RegExp(pattern);
    const match = pathname.match(regex);

    if (match) {
      // Construct the new URL with the entity ID (if present)
      const newPath = pathname.replace(regex, replacement);
      const url = request.nextUrl.clone();
      url.pathname = newPath;

      // Preserve query parameters (important for search filters/sorting)
      // e.g., /d/search?status=active → /datasets?status=active

      // Return 301 (Permanent Redirect) to preserve SEO
      return NextResponse.redirect(url, { status: 301 });
    }
  }

  // No redirect needed, continue to the requested page
  return NextResponse.next();
}

/**
 * Configure which routes this proxy should run on
 * We only want to check legacy short URL patterns
 */
export const config = {
  matcher: ["/d/:path*", "/t/:path*", "/f/:path*", "/r/:path*"],
};
