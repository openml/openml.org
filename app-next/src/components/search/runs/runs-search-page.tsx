"use client";

import { SearchProvider } from "@elastic/react-search-ui";
import type { SearchDriverOptions } from "@elastic/search-ui";
import { useSearchParams } from "next/navigation";
import runConfig from "./run-search-config";
import { ActiveFiltersHeader } from "../shared/active-filters-header";
import { FlaskConical, Database, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { entityColors } from "@/constants/entityColors";

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
  const dataIdFilter = searchParams.get("data_id");

  // Build initial filters based on query params
  const initialFilters = dataIdFilter
    ? [
        {
          field: "run_task.source_data.data_id",
          values: [dataIdFilter],
          type: "any" as const,
        },
      ]
    : [];

  // Facet labels for Active Filters - matching the new facet configuration
  const facetLabels: Record<string, string> = {
    "run_task.source_data.name.keyword": "Dataset",
    "run_task.tasktype.name.keyword": "Task Type",
    "run_flow.name.keyword": "Flow",
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
            filters: initialFilters,
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
                  className="h-8 w-8"
                  style={{ color: entityColors.run, fill: entityColors.run }}
                  aria-hidden="true"
                />
                <div className="space-y-0">
                  <h1 className="text-3xl font-bold tracking-tight">Runs</h1>
                  <p className="text-muted-foreground">
                    Explore machine learning experiment results and metrics
                  </p>
                  {dataIdFilter && (
                    <div className="mt-2 flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1.5 px-3 py-1"
                      >
                        <Database className="h-3 w-3" />
                        <span>Filtering by Dataset #{dataIdFilter}</span>
                        <Link
                          href="/runs"
                          className="hover:bg-muted ml-1 rounded-full p-0.5"
                          title="Clear filter"
                        >
                          <X className="h-3 w-3" />
                        </Link>
                      </Badge>
                    </div>
                  )}
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
