import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const nextConfig: NextConfig = {
  // Built-in 301 redirects for backward compatibility
  // Academic papers and external links often cite OpenML entities using short URLs
  async redirects() {
    return [
      // ========================================
      // SIMPLE PATH-BASED REDIRECTS (✅ Works in next.config.ts)
      // ========================================

      // Legacy /apis route redirect to /api
      {
        source: "/apis",
        destination: "/api",
        permanent: true, // 301 redirect (preserves SEO and bookmarks)
      },

      // Entity detail pages: /d/123 → /datasets/123 (no locale prefix for English)
      {
        source: "/d/:id",
        destination: "/datasets/:id",
        permanent: true, // 301 redirect (preserves SEO)
      },
      {
        source: "/t/:id",
        destination: "/tasks/:id",
        permanent: true,
      },
      {
        source: "/f/:id",
        destination: "/flows/:id",
        permanent: true,
      },
      {
        source: "/r/:id",
        destination: "/runs/:id",
        permanent: true,
      },
      // Benchmark short URLs: /b/383 → /benchmarks/383
      {
        source: "/b/:id",
        destination: "/benchmarks/:id",
        permanent: true,
      },
      // Collection/Study short URLs: /s/123 → /collections/123
      {
        source: "/s/:id",
        destination: "/collections/:id",
        permanent: true,
      },

      // Search page redirects: /d/search → /datasets
      {
        source: "/d/search",
        destination: "/datasets",
        permanent: true,
      },
      {
        source: "/t/search",
        destination: "/tasks",
        permanent: true,
      },
      {
        source: "/f/search",
        destination: "/flows",
        permanent: true,
      },
      {
        source: "/r/search",
        destination: "/runs",
        permanent: true,
      },

      // ========================================
      // QUERY-BASED REDIRECTS (❌ Cannot be done here)
      // ========================================
      // These URLs require middleware because they have query parameters
      // that need to be parsed and transformed:
      //
      // /search?type=data&id=1464 → /datasets/1464 (English)
      // /search?type=task → /tasks
      // /search?type=flow → /flows
      // /search?type=run → /runs
      // /search?type=study&id=123 → /collections/123
      // /search?type=study&study_type=task → /collections/tasks
      // /search?type=study&study_type=run → /collections/runs
      // /search?type=benchmark&id=383 → /benchmarks/383
      // /search?type=benchmark&study_type=task → /benchmarks/tasks
      // /search?type=benchmark&study_type=run → /benchmarks/runs
      // /search?type=task_type → /task-types
      // /search?type=measure&measure_type=data_quality → /measures/data-qualities
      // /search?type=measure&measure_type=evaluation_measure → /measures/evaluation-measures
      // /search?type=measure&measure_type=estimation_procedure → /measures/estimation-procedures
      //
      // Solution: Create src/middleware.ts (see implementation)
    ];
  },
};

export default withNextIntl(nextConfig);