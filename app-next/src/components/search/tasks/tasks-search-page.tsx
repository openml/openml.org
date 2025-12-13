"use client";

import { SearchProvider } from "@elastic/react-search-ui";
import type { SearchDriverOptions } from "@elastic/search-ui";
import taskConfig from "./task-search-config";
import { ActiveFiltersHeader } from "../shared/active-filters-header";
import { TaskSearchContainer } from "@/components/search/tasks/task-search-container";
import { Trophy } from "lucide-react";

export function TasksSearchPage() {
  // Facet labels for Active Filters
  const facetLabels: Record<string, string> = {
    "tasktype.name.keyword": "Task Type",
    "estimation_procedure.type.keyword": "Estimation Procedure",
    "target_feature.keyword": "Target Feature",
  };

  return (
    <SearchProvider config={taskConfig as SearchDriverOptions}>
      <div className="flex min-h-screen flex-col">
        {/* Page Header */}
        <div className="bg-muted/40 border-b">
          <div className="container mx-auto px-4 py-8 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Trophy
                  className="h-8 w-8"
                  style={{ color: "#FFA726" }}
                  aria-hidden="true"
                />
                <div className="space-y-0">
                  <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                  <p className="text-muted-foreground">
                    Machine learning tasks define problem setups on datasets
                  </p>
                </div>
              </div>
              <ActiveFiltersHeader facetLabels={facetLabels} />
            </div>
          </div>
        </div>

        {/* Search Container */}
        <div className="container mx-auto flex-1 px-4 py-6 sm:px-6">
          <TaskSearchContainer />
        </div>
      </div>
    </SearchProvider>
  );
}
