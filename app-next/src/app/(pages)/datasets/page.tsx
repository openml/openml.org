import type { Metadata } from "next";
import { SearchContainer } from "@/components/search/search-container";
import { Database } from "lucide-react";

export const metadata: Metadata = {
  title: "OpenML Datasets - Search Machine Learning Datasets",
  description:
    "Search and explore thousands of machine learning datasets on OpenML. Filter by size, features, format, and more. Free and open source datasets for your ML projects.",
  keywords: [
    "machine learning",
    "datasets",
    "ML",
    "data science",
    "open source",
    "openml",
  ],
  openGraph: {
    title: "OpenML Datasets",
    description: "Search machine learning datasets on OpenML",
    type: "website",
    url: "https://www.openml.org/datasets",
  },
  alternates: {
    canonical: "https://www.openml.org/datasets",
  },
};

/**
 * Datasets Search Page
 *
 * This page provides a searchable, filterable interface for browsing
 * all datasets in the OpenML platform.
 *
 * Features:
 * - Full-text search across dataset names and descriptions
 * - Faceted filtering (status, license, size, features, etc.)
 * - Multiple sort options (relevance, popularity, date, etc.)
 * - Grid, list, and table view modes
 * - Pagination for large result sets
 */
export default function DatasetsPage() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-muted/40 border-b">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Datasets</h1>
              <p className="text-muted-foreground mt-1">
                Explore thousands of machine learning datasets
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Container */}
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <SearchContainer />
      </div>
    </div>
  );
}
