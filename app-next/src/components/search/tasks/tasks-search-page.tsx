"use client";

import { SearchProvider } from "@elastic/react-search-ui";
import type { SearchDriverOptions } from "@elastic/search-ui";
import { useSearchParams } from "next/navigation";
import taskConfig from "./task-search-config";
import { ActiveFiltersHeader } from "../shared/active-filters-header";
import { TaskSearchContainer } from "@/components/search/tasks/task-search-container";
import { Database, Tag, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ENTITY_ICONS, entityColors } from "@/constants";
export function TasksSearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const dataIdFilter = searchParams.get("data_id");
  const tagFilter = searchParams.get("tag") || "";

  // Facet labels for Active Filters
  const facetLabels: Record<string, string> = {
    "tasktype.name.keyword": "Task Type",
    "estimation_procedure.type.keyword": "Estimation Procedure",
    "target_feature.keyword": "Target Feature",
    "tags.tag": "Tag",
  };

  // Build initial filters based on query params
  const initialFilters = [
    ...(dataIdFilter
      ? [
          {
            field: "source_data.data_id",
            values: [dataIdFilter],
            type: "any" as const,
          },
        ]
      : []),
    ...(tagFilter
      ? [{ field: "tags.tag", values: [tagFilter], type: "any" as const }]
      : []),
  ];

  return (
    <SearchProvider
      config={
        {
          ...taskConfig,
          initialState: {
            ...taskConfig.initialState,
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
                <FontAwesomeIcon
                  icon={ENTITY_ICONS.task}
                  className="mt-1"
                  style={{
                    color: entityColors.task,
                    width: "32px",
                    height: "32px",
                  }}
                  aria-hidden="true"
                />
                <div className="space-y-0">
                  <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                  <p className="text-muted-foreground">
                    Machine learning tasks define problem setups on datasets
                  </p>
                  {(dataIdFilter || tagFilter) && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {dataIdFilter && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1.5 px-3 py-1"
                        >
                          <Database className="h-3 w-3" />
                          <span>Dataset #{dataIdFilter}</span>
                          <Link
                            href={tagFilter ? `/tasks?tag=${encodeURIComponent(tagFilter)}` : "/tasks"}
                            className="hover:bg-muted ml-1 rounded-full p-0.5"
                            title="Clear dataset filter"
                          >
                            <X className="h-3 w-3" />
                          </Link>
                        </Badge>
                      )}
                      {tagFilter && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1.5 px-3 py-1"
                        >
                          <Tag className="h-3 w-3" />
                          <span>Tag: {tagFilter}</span>
                          <Link
                            href={dataIdFilter ? `/tasks?data_id=${encodeURIComponent(dataIdFilter)}` : "/tasks"}
                            className="hover:bg-muted ml-1 rounded-full p-0.5"
                            title="Clear tag filter"
                          >
                            <X className="h-3 w-3" />
                          </Link>
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <ActiveFiltersHeader facetLabels={facetLabels} />
            </div>
          </div>
        </div>

        {/* Search Container */}
        <div className="mx-auto w-full flex-1 px-1.5 pb-6">
          <TaskSearchContainer />
        </div>
      </div>
    </SearchProvider>
  );
}
