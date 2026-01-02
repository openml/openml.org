"use client";

import { SearchProvider } from "@elastic/react-search-ui";
import type { SearchDriverOptions } from "@elastic/search-ui";
import benchmarkConfig from "./benchmark-search-config";
import { ActiveFiltersHeader } from "../shared/active-filters-header";
import { BenchmarksSearchContainer } from "./benchmarks-search-container";

export function BenchmarksSearchPage() {
  // Facet labels for Active Filters
  const facetLabels: Record<string, string> = {
    // TODO: Add facet labels based on your benchmark facets
  };

  return (
    <SearchProvider config={benchmarkConfig as SearchDriverOptions}>
      <div className="flex min-h-screen flex-col">
        {/* Page Header */}
        <div className="bg-muted/40 border-b">
          <div className="container mx-auto px-4 py-8 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {/* Benchmark Icon - Teal color (#26A69A) */}
                <svg
                  viewBox="0 0 512 512"
                  className="h-8 w-8"
                  style={{ color: "#26A69A" }}
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64L0 400c0 44.2 35.8 80 80 80l400 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 416c-8.8 0-16-7.2-16-16L64 64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"
                  />
                </svg>
                <div className="space-y-0">
                  <h1 className="text-3xl font-bold tracking-tight">
                    Benchmarks
                  </h1>
                  <p className="text-muted-foreground">
                    Compare algorithm performance across multiple tasks
                  </p>
                </div>
              </div>
              <ActiveFiltersHeader facetLabels={facetLabels} />
            </div>
          </div>
        </div>

        {/* Search Container */}
        <div className="mx-auto w-full flex-1 px-1.5 py-6">
          <BenchmarksSearchContainer />
        </div>
      </div>
    </SearchProvider>
  );
}
