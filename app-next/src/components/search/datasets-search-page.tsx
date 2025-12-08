"use client";

import { SearchProvider } from "@elastic/react-search-ui";
import type { SearchDriverOptions } from "@elastic/search-ui";
import dataConfig from "./search-config";
import { Database } from "lucide-react";
import { ActiveFiltersHeader } from "./active-filters-header";
import { SearchContainer } from "./search-container";

export function DatasetsSearchPage() {
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
    <SearchProvider config={dataConfig as SearchDriverOptions}>
      <div className="flex min-h-screen flex-col">
        {/* Page Header */}
        <div className="bg-muted/40 border-b">
          <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Datasets
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Explore thousands of machine learning datasets
                  </p>
                </div>
              </div>
              <ActiveFiltersHeader facetLabels={facetLabels} />
            </div>
          </div>
        </div>

        {/* Search Container */}
        <div className="container mx-auto max-w-7xl flex-1 px-4 py-6 sm:px-6">
          <SearchContainer />
        </div>
      </div>
    </SearchProvider>
  );
}
