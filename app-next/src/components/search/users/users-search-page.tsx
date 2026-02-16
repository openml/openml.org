"use client";

import { useState, useMemo } from "react";
import { SearchProvider } from "@elastic/react-search-ui";
import type { SearchDriverOptions } from "@elastic/search-ui";
import userConfig, { searchFieldConfigs } from "./user-search-config";
import { ActiveFiltersHeader } from "../shared/active-filters-header";
import { UsersSearchContainer } from "./users-search-container";

export function UsersSearchPage() {
  const [searchScope, setSearchScope] = useState<"all" | "names" | "tags">(
    "all",
  );

  // Create dynamic config based on search scope
  const config = useMemo(() => {
    return {
      ...userConfig,
      searchQuery: {
        ...userConfig.searchQuery,
        search_fields: searchFieldConfigs[searchScope],
      },
    };
  }, [searchScope]);

  // Facet labels for Active Filters
  const facetLabels: Record<string, string> = {
    "country.keyword": "Country",
    "affiliation.keyword": "Affiliation",
  };

  return (
    <SearchProvider config={config as SearchDriverOptions}>
      <div className="flex min-h-screen flex-col">
        {/* Page Header */}
        <div className="bg-muted/40 border-b">
          <div className="container mx-auto px-4 py-8 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <svg
                  viewBox="0 0 640 512"
                  className="h-8 w-8"
                  style={{ color: "#42A5F5" }}
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"
                  />
                </svg>
                <div className="space-y-0">
                  <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                  <p className="text-muted-foreground">
                    Discover OpenML community members
                  </p>
                </div>
              </div>
              <ActiveFiltersHeader facetLabels={facetLabels} />
            </div>
          </div>
        </div>

        {/* Search Container */}
        <div className="mx-auto w-full flex-1 px-1.5 py-6">
          <UsersSearchContainer
            searchScope={searchScope}
            onSearchScopeChange={setSearchScope}
          />
        </div>
      </div>
    </SearchProvider>
  );
}
