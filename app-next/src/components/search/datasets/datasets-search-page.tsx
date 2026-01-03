"use client";

import { SearchProvider } from "@elastic/react-search-ui";
import type { SearchDriverOptions } from "@elastic/search-ui";
import { useSearchParams } from "next/navigation";
import dataConfig from "./search-config";
import { ActiveFiltersHeader } from "../shared/active-filters-header";
import { SearchContainer } from "./search-container";

export function DatasetsSearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  // Facet labels for Active Filters
  const facetLabels: Record<string, string> = {
    "status.keyword": "Status",
    "licence.keyword": "License",
    "qualities.NumberOfInstances": "Size",
    "qualities.NumberOfFeatures": "Features",
    "qualities.NumberOfClasses": "Task Type",
    format: "Format",
  };

  return (
    <SearchProvider
      config={
        {
          ...dataConfig,
          initialState: {
            ...dataConfig.initialState,
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
                <svg
                  viewBox="0 0 448 512"
                  className="h-8 w-8"
                  style={{ color: "#66BB6A" }}
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M448 205.8c-14.8 9.8-31.8 17.7-49.5 24-47 16.8-108.7 26.2-174.5 26.2S96.4 246.5 49.5 229.8c-17.6-6.3-34.7-14.2-49.5-24L0 288c0 44.2 100.3 80 224 80s224-35.8 224-80l0-82.2zm0-77.8l0-48C448 35.8 347.7 0 224 0S0 35.8 0 80l0 48c0 44.2 100.3 80 224 80s224-35.8 224-80zM398.5 389.8C351.6 406.5 289.9 416 224 416S96.4 406.5 49.5 389.8c-17.6-6.3-34.7-14.2-49.5-24L0 432c0 44.2 100.3 80 224 80s224-35.8 224-80l0-66.2c-14.8 9.8-31.8 17.7-49.5 24z"
                  />
                </svg>
                <div className="space-y-0">
                  <h1 className="text-3xl font-bold tracking-tight">
                    Datasets
                  </h1>
                  <p className="text-muted-foreground">
                    Explore thousands of machine learning datasets
                  </p>
                </div>
              </div>
              <ActiveFiltersHeader facetLabels={facetLabels} />
            </div>
          </div>
        </div>

        {/* Search Container */}
        <div className="mx-auto w-full flex-1 px-1.5 py-6">
          <SearchContainer />
        </div>
      </div>
    </SearchProvider>
  );
}
