/**
 * Task Search Redirect Page
 *
 * This page redirects from the old /t/search URL to the new SEO-friendly /tasks URL
 * Preserves all query parameters during redirect
 */

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function TaskSearchRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Get all query parameters from current URL
    const { pathname, query } = router;

    // Redirect to /tasks with the same query parameters
    router.replace({
      pathname: "/tasks",
      query: query,
    });
  }, [router]);

  // Show nothing while redirecting
  return null;
}
