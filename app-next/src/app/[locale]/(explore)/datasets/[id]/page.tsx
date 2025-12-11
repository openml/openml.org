/**
 * 📚 LEARNING: Next.js 15 Server Component with SEO
 *
 * This is a Server Component - it runs ONLY on the server.
 * - No useState, useEffect, or browser APIs
 * - Can directly fetch data (async/await)
 * - HTML is generated on server (perfect for SEO)
 * - Cached and revalidated automatically
 *
 * BENEFITS FOR SEO:
 * - Search engines get fully rendered HTML
 * - Metadata is available immediately
 * - No JavaScript required for initial render
 * - Fast Time to First Byte (TTFB)
 */

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FlaskConical,
  Heart,
  CloudDownload,
  BarChart3,
  Info,
  Database,
  ArrowLeft,
  Grid3x3,
} from "lucide-react";
import {
  fetchDataset,
  fetchDatasetTaskCount,
  fetchDatasetRunCount,
} from "@/lib/api/dataset";
import { DatasetHeader } from "@/components/dataset/dataset-header";
import { DatasetDescription } from "@/components/dataset/dataset-description";
import { DatasetMetadataGrid } from "@/components/dataset/dataset-metadata-grid";
import { FeatureTable } from "@/components/dataset/feature-table";
import { QualityTable } from "@/components/dataset/quality-table";

/**
 * 🎯 Generate SEO Metadata (runs before page render)
 *
 * CONCEPTS:
 * - generateMetadata() is a special Next.js function
 * - Runs on server before rendering
 * - Can be async (fetch data for metadata)
 * - Generates <head> tags automatically
 *
 * SEO ELEMENTS:
 * - title: Browser tab + Google search results
 * - description: Google search snippet
 * - openGraph: Social media cards (Twitter, LinkedIn, etc.)
 * - other: Custom meta tags (Google Scholar, etc.)
 *
 * @param params - Route parameters
 * @returns Metadata object
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    // Fetch dataset for metadata (cached by Next.js)
    const dataset = await fetchDataset(id);

    // Truncate description for meta tags (Google shows ~160 chars)
    const description =
      dataset.description?.slice(0, 160) || `OpenML Dataset: ${dataset.name}`;

    // Extract keywords from tags and features
    const keywords = [
      "machine learning",
      "dataset",
      "OpenML",
      dataset.name,
      ...(dataset.tags?.map((t) => t.tag) || []),
      `${dataset.qualities?.NumberOfInstances || 0} instances`,
      `${dataset.qualities?.NumberOfFeatures || 0} features`,
    ];

    return {
      // Primary metadata
      title: `${dataset.name} - OpenML Dataset`,
      description,
      keywords: keywords.join(", "),

      // Open Graph (Facebook, LinkedIn)
      openGraph: {
        title: dataset.name,
        description,
        type: "article",
        url: `https://www.openml.org/datasets/${id}`,
        siteName: "OpenML",
        locale: "en_US",
        // dataset image if available and wanted
        // images: [{ url: dataset.image_url }],
      },

      // Twitter Card
      twitter: {
        card: "summary_large_image",
        title: dataset.name,
        description,
        site: "@open_ml",
        creator: dataset.creator || "@open_ml",
      },

      // Custom meta tags for academic/research platforms
      other: {
        // Google Scholar metadata
        citation_title: dataset.name,
        citation_author: dataset.creator || dataset.uploader,
        citation_publication_date: dataset.date,

        // Dublin Core metadata (library/academic systems)
        "DC.title": dataset.name,
        "DC.creator": dataset.creator || dataset.uploader,
        "DC.date": dataset.date,
        "DC.format": dataset.format,
        "DC.identifier": `openml:dataset:${id}`,
        "DC.rights": dataset.licence,

        // Dataset-specific
        "openml:data_id": id,
        "openml:version": dataset.version.toString(),
        "openml:instances": dataset.qualities?.NumberOfInstances?.toString(),
        "openml:features": dataset.qualities?.NumberOfFeatures?.toString(),
      },

      // Canonical URL (important for SEO if you have multiple URLs)
      alternates: {
        canonical: `https://www.openml.org/datasets/${id}`,
      },

      // Robots (control search engine indexing)
      robots: {
        index: dataset.status === "active", // Only index active datasets
        follow: true,
        googleBot: {
          index: dataset.status === "active",
          follow: true,
        },
      },
    };
  } catch (_error) {
    // If dataset doesn't exist, return minimal metadata
    return {
      title: "Dataset Not Found - OpenML",
      description: "The requested dataset could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

/**
 * 🎯 Main Dataset Page Component (Server Component)
 *
 * PERFORMANCE PATTERN:
 * - Parallel data fetching (Promise.all)
 * - Server-side rendering (no loading spinner)
 * - Automatic caching (revalidate strategy)
 *
 * ARCHITECTURE:
 * - Fetch all data on server
 * - Pass down to presentational components
 * - Keep components simple and reusable
 */
export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  // 📚 LEARNING: Parallel Data Fetching
  // Fetch multiple things at once (not sequential waterfall!)
  // This is MUCH faster than await-ing one at a time
  const [dataset, taskCount, runCount] = await Promise.all([
    fetchDataset(id),
    fetchDatasetTaskCount(id),
    fetchDatasetRunCount(id),
  ]);

  // If dataset is deactivated, show notice
  if (dataset.status === "deactivated") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="border-destructive bg-destructive/10 rounded-lg border p-6">
          <h1 className="text-destructive text-2xl font-bold">
            Dataset Deactivated
          </h1>
          <p className="text-muted-foreground mt-2">
            This dataset has been deactivated and is no longer available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Content */}
      <div className="container mx-auto py-8 pl-12">
        <div className="flex gap-8">
          {/* Left: Main Content (70%) */}
          <div className="min-w-0 flex-1">
            {/* 
                📚 LAYOUT PHILOSOPHY: Inspired by HuggingFace & Kaggle
                - Clean, linear flow (no tabs!)
                - Important info first
                - Progressive disclosure
                - Generous whitespace
              */}

            {/* Header: Name, stats, actions */}
            <DatasetHeader
              dataset={dataset}
              taskCount={taskCount}
              runCount={runCount}
            />

            {/* Description: Primary content */}
            <section id="description" className="mt-8 scroll-mt-20">
              <DatasetDescription dataset={dataset} />
            </section>

            {/* Metadata Grid: Key facts */}
            <section id="information" className="mt-8 scroll-mt-20">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <Info className="h-5 w-5 text-green-600 dark:text-green-500" />
                Dataset Information
              </h2>
              <DatasetMetadataGrid dataset={dataset} />
            </section>

            {/* Features: Technical details */}
            {dataset.features && dataset.features.length > 0 && (
              <section id="features" className="mt-8 scroll-mt-20">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                  <BarChart3 className="h-5 w-5 rotate-90 text-gray-500" />
                  Features ({dataset.features.length})
                </h2>
                <FeatureTable features={dataset.features} />
              </section>
            )}

            {/* Qualities: Meta-features */}
            {dataset.qualities && Object.keys(dataset.qualities).length > 0 && (
              <section id="qualities" className="mt-8 scroll-mt-20">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                  <BarChart3 className="h-5 w-5 text-gray-500" />
                  Dataset Qualities
                </h2>
                <QualityTable qualities={dataset.qualities} />
              </section>
            )}

            {/* TODO: Related Tasks section */}
            {/* TODO: Recent Runs section */}
            {/* TODO: Visualizations section */}
          </div>

          {/* Right: Table of Contents (30%) - Sticky */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-32 space-y-4">
              {/* Table of Contents */}
              <div className="rounded-sm border-l-2 border-green-500/40 bg-green-50/70 p-4 dark:bg-green-950/20">
                <h3 className="mb-3 text-sm font-semibold text-green-700 dark:text-green-400">
                  On This Page
                </h3>
                <nav className="space-y-1">
                  <a
                    href="#description"
                    className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-green-700 transition-colors hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30"
                  >
                    <Database className="h-4 w-4" />
                    Description
                  </a>
                  <a
                    href="#information"
                    className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-green-700 transition-colors hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30"
                  >
                    <Info className="h-4 w-4" />
                    Information
                  </a>
                  {dataset.features && dataset.features.length > 0 && (
                    <a
                      href="#features"
                      className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-green-700 transition-colors hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30"
                    >
                      <BarChart3 className="h-4 w-4 rotate-90" />
                      Features ({dataset.features.length})
                    </a>
                  )}
                  {dataset.qualities &&
                    Object.keys(dataset.qualities).length > 0 && (
                      <a
                        href="#qualities"
                        className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-green-700 transition-colors hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30"
                      >
                        <BarChart3 className="h-4 w-4" />
                        Qualities
                      </a>
                    )}
                </nav>
              </div>

              {/* Navigation Links */}
              <div className="bg-background/40 rounded-sm border-l-2 p-4">
                <h3 className="text-foreground mb-3 text-sm font-semibold">
                  Navigation
                </h3>
                <nav className="space-y-1">
                  <Link
                    href="/datasets"
                    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Search
                  </Link>
                  <Link
                    href="/datasets"
                    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors"
                  >
                    <Grid3x3 className="h-4 w-4" />
                    All Datasets
                  </Link>
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/**
 * 📚 LEARNING: Static Generation Strategy
 *
 * Next.js 15 supports multiple rendering strategies:
 *
 * 1. STATIC (Fastest): Pre-render at build time
 *    - Use for: Top 100 datasets
 *    - Speed: Instant (served from CDN)
 *
 * 2. ISR (Incremental Static Regeneration): Hybrid
 *    - Pre-render popular pages
 *    - Generate others on-demand
 *    - Revalidate in background
 *
 * 3. DYNAMIC (Server-Side Rendering): Fresh every time
 *    - Use for: Private datasets, real-time data
 *    - Speed: Fast but not instant
 *
 * We use ISR for best of both worlds!
 *
 * Uncomment below to enable ISR:
 */

// Tell Next.js: Revalidate cached page every hour
export const revalidate = 3600; // 1 hour

// Optional: Pre-generate top 100 datasets at build time
// export async function generateStaticParams() {
//   const ids = await getPopularDatasetIds(100);
//   return ids.map(id => ({ id: id.toString() }));
// }
