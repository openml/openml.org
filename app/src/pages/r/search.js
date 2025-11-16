/**
 * Run Search Redirect Page
 *
 * This page redirects from the old /r/search URL to the new SEO-friendly /runs URL
 * Preserves all query parameters during redirect
 */

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function RunSearchRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Get all query parameters from current URL
    const { pathname, query } = router;

    // Redirect to /runs with the same query parameters
    router.replace({
      pathname: "/runs",
      query: query,
    });
  }, [router]);

  // Show nothing while redirecting
  return null;
}
