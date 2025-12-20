"use client";

import { SearchProvider } from "@elastic/react-search-ui";
import type { SearchDriverOptions } from "@elastic/search-ui";
import { useSearchParams } from "next/navigation";
import runConfig from "./run-search-config";
import { ActiveFiltersHeader } from "../shared/active-filters-header";
import { RunsSearchContainer } from "./runs-search-container";

export function RunsSearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  // Facet labels for Active Filters
  const facetLabels: Record<string, string> = {
    // TODO: Add facet labels based on your run facets
  };

  return (
    <SearchProvider
      config={
        {
          ...runConfig,
          initialState: {
            ...runConfig.initialState,
            searchTerm: initialQuery,
          },
        } as SearchDriverOptions
      }
    >
      <div className="flex min-h-screen flex-col">
        {/* Page Header */}
        <div className="bg-muted/40 border-b">
          <div className="container mx-auto px-4 py-8 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {/* Run Icon - Red color (#EF5350) */}
                <svg
                  viewBox="0 0 640 512"
                  className="h-8 w-8"
                  style={{ color: "#EF5350" }}
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M320 0c17.7 0 32 14.3 32 32l0 64 120 0c39.8 0 72 32.2 72 72l0 272c0 39.8-32.2 72-72 72l-304 0c-39.8 0-72-32.2-72-72l0-272c0-39.8 32.2-72 72-72l120 0 0-64c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224l16 0 0 192-16 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-16 0 0-192 16 0z"
                  />
                </svg>
                <div className="space-y-0">
                  <h1 className="text-3xl font-bold tracking-tight">Runs</h1>
                  <p className="text-muted-foreground">
                    Explore algorithm execution results and experiments
                  </p>
                </div>
              </div>
              <ActiveFiltersHeader facetLabels={facetLabels} />
            </div>
          </div>
        </div>

        {/* Search Container */}
        <div className="container mx-auto flex-1 px-4 py-6 sm:px-6">
          <RunsSearchContainer />
        </div>
      </div>
    </SearchProvider>
  );
}
