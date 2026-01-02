"use client";

import { SearchProvider } from "@elastic/react-search-ui";
import type { SearchDriverOptions } from "@elastic/search-ui";
import collectionConfig from "./collection-search-config";
import { ActiveFiltersHeader } from "../shared/active-filters-header";
import { CollectionsSearchContainer } from "./collections-search-container";

export function CollectionsSearchPage() {
  // Facet labels for Active Filters
  const facetLabels: Record<string, string> = {
    // TODO: Add facet labels based on your collection facets
  };

  return (
    <SearchProvider config={collectionConfig as SearchDriverOptions}>
      <div className="flex min-h-screen flex-col">
        {/* Page Header */}
        <div className="bg-muted/40 border-b">
          <div className="container mx-auto px-4 py-8 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {/* Collection Icon - Indigo color (#5C6BC0) */}
                <svg
                  viewBox="0 0 576 512"
                  className="h-8 w-8"
                  style={{ color: "#5C6BC0" }}
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"
                  />
                </svg>
                <div className="space-y-0">
                  <h1 className="text-3xl font-bold tracking-tight">
                    Collections
                  </h1>
                  <p className="text-muted-foreground">
                    Curated sets of datasets, flows, and tasks
                  </p>
                </div>
              </div>
              <ActiveFiltersHeader facetLabels={facetLabels} />
            </div>
          </div>
        </div>

        {/* Search Container */}
        <div className="mx-auto w-full flex-1 px-1.5 py-6">
          <CollectionsSearchContainer />
        </div>
      </div>
    </SearchProvider>
  );
}
