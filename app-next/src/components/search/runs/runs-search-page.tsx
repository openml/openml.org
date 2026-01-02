"use client";

import { SearchProvider } from "@elastic/react-search-ui";
import type { SearchDriverOptions } from "@elastic/search-ui";
import { useSearchParams } from "next/navigation";
import runConfig from "./run-search-config";
import { ActiveFiltersHeader } from "../shared/active-filters-header";
import { FlaskConical } from "lucide-react";

// Lazy load the container to avoid build issues
import dynamic from "next/dynamic";

const RunsSearchContainer = dynamic(
  () =>
    import("./runs-search-container").then((mod) => ({
      default: mod.RunsSearchContainer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="text-muted-foreground p-8 text-center">
        Loading runs search...
      </div>
    ),
  },
);

export function RunsSearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  // Facet labels for Active Filters
  const facetLabels: Record<string, string> = {
    "uploader.keyword": "Uploader",
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
                <FlaskConical
                  className="h-8 w-8 fill-red-500 text-red-500"
                  aria-hidden="true"
                />
                <div className="space-y-0">
                  <h1 className="text-3xl font-bold tracking-tight">Runs</h1>
                  <p className="text-muted-foreground">
                    Explore machine learning experiment results and metrics
                  </p>
                </div>
              </div>
              <ActiveFiltersHeader facetLabels={facetLabels} />
            </div>
          </div>
        </div>

        {/* Search Container */}
        <div className="mx-auto w-full flex-1 px-1.5 py-6">
          <RunsSearchContainer />
        </div>
      </div>
    </SearchProvider>
  );
}
