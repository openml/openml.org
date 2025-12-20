"use client";

import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { WithSearch, Paging, SearchContext } from "@elastic/react-search-ui";
import { FilterBar } from "../shared/filter-bar";
import { ControlsBar } from "../shared/controls-bar";
import { Badge } from "@/components/ui/badge";
import {
  FlaskConical,
  Database,
  Cog,
  Calendar,
  User,
  Target,
} from "lucide-react";

interface RunResult {
  run_id?: { raw: string | number };
  uploader?: { raw: string };
  uploader_id?: { raw: string | number };
  flow_id?: { raw: string | number };
  flow_name?: { raw: string };
  data_id?: { raw: string | number };
  data_name?: { raw: string };
  task_id?: { raw: string | number };
  date?: { raw: string };
  [key: string]: unknown;
}

const searchFacets: { label: string; field: string }[] = [
  // TODO: Add run-specific facets
];

const sortOptions = [
  {
    name: "Most Recent",
    value: [{ field: "date", direction: "desc" }],
    id: "recent",
  },
];

export function RunsSearchContainer() {
  const [view, setView] = useState("list");
  const searchParams = useSearchParams();
  const context = useContext(SearchContext);
  const driver = context?.driver;
  const query = searchParams.get("q") || "";

  // 👇 Sync URL query → Search UI driver (Next.js is source of truth for URL)
  useEffect(() => {
    if (!driver) return;

    // Type assertion - these methods exist at runtime but types are incomplete
    const driverAny = driver as unknown as {
      getState: () => { searchTerm?: string };
      setSearchTerm: (
        term: string,
      };
      getActions: () => {
        setSearchTerm: (
          term: string,
          options?: { shouldClearFilters?: boolean },
        ) => void;
      };
    };

    const currentTerm = driverAny.getState().searchTerm || "";

    // Only update if the term actually changed (prevents loops)
    if (currentTerm === query) return;

    // Handle both search and clearing - setSearchTerm triggers search automatically
    driverAny.getActions().setSearchTerm(query, { shouldClearFilters: false });
  }, [query, driver]);

  return (
    <WithSearch
      mapContextToProps={({ isLoading, error, searchTerm, totalResults }) => ({
        isLoading,
        error,
        searchTerm,
        totalResults,
      })}
    >
      {({ isLoading, error, searchTerm, totalResults }) => (
        <div className="w-full space-y-0">
          {isLoading && (
            <div className="bg-primary/20 h-1 w-full overflow-hidden">
              <div className="bg-primary h-full w-1/3 animate-pulse" />
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border-destructive/20 m-4 rounded-md border p-4">
              <p className="text-destructive text-sm">
                Error:{" "}
                {typeof error === "string"
                  ? error
                  : (error as Error).message || "Unknown error"}
              </p>
            </div>
          )}

          {/* Search Results Header */}
          {searchTerm && (
            <div className="bg-muted/30 border-b px-4 py-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  Search results for
                </span>
                <span className="font-semibold">"{searchTerm}"</span>
                <span className="text-muted-foreground">—</span>
                <span className="text-primary font-semibold">
                  {totalResults?.toLocaleString() || 0}
                </span>
                <span className="text-muted-foreground">
                  {totalResults === 1 ? "result" : "results"} found
                </span>
              </div>
            </div>
          )}

          <FilterBar facets={searchFacets} showSearch={true} />
          <ControlsBar
            view={view}
            onViewChange={setView}
            sortOptions={sortOptions}
          />

          <div className="p-4">
            <WithSearch mapContextToProps={({ results }) => ({ results })}>
              {({ results }) => (
                <>
                  {view === "list" && (
                    <div className="space-y-0">
                      {results && results.length > 0 ? (
                        results.map((result: RunResult, index: number) => {
                          const runId = result.run_id?.raw;

                          return (
                            <div
                              key={runId || index}
                              className="hover:bg-accent relative flex items-start justify-between border-b p-4 transition-colors"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="mb-2 flex items-start gap-3">
                                  <FlaskConical className="mt-1 h-5 w-5 shrink-0 text-red-600" />
                                  <div className="min-w-0 flex-1">
                                    <h3 className="mb-1 text-lg font-semibold">
                                      Run #{runId}
                                    </h3>
                                  </div>
                                </div>

                                <div className="text-muted-foreground mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                                  {result.uploader?.raw && (
                                    <Link
                                      href={`/users/${result.uploader_id?.raw}`}
                                      className="hover:text-foreground flex items-center gap-1.5 transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <User className="h-3 w-3" />
                                      {result.uploader.raw}
                                    </Link>
                                  )}
                                  {result.date?.raw && (
                                    <span className="flex items-center gap-1.5">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(
                                        result.date.raw,
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                                  {result.flow_name?.raw && (
                                    <Link
                                      href={`/flows/${result.flow_id?.raw}`}
                                      className="hover:text-foreground flex items-center gap-1.5 transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Cog className="h-3 w-3 text-orange-600" />
                                      <span className="font-medium">
                                        {result.flow_name.raw}
                                      </span>
                                    </Link>
                                  )}
                                  {result.data_name?.raw && (
                                    <Link
                                      href={`/datasets/${result.data_id?.raw}`}
                                      className="hover:text-foreground flex items-center gap-1.5 transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Database className="h-3 w-3 text-green-600" />
                                      <span className="font-medium">
                                        {result.data_name.raw}
                                      </span>
                                    </Link>
                                  )}
                                  {result.task_id?.raw && (
                                    <Link
                                      href={`/tasks/${result.task_id.raw}`}
                                      className="hover:text-foreground flex items-center gap-1.5 transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Target className="h-3 w-3 text-purple-600" />
                                      <span className="font-medium">
                                        Task #{result.task_id.raw}
                                      </span>
                                    </Link>
                                  )}
                                </div>
                              </div>

                              {/* Invisible overlay link for entire row clickability */}
                              <Link
                                href={`/runs/${runId}`}
                                className="absolute inset-0"
                                aria-label={`View run ${runId}`}
                              >
                                <span className="sr-only">
                                  View run {runId}
                                </span>
                              </Link>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-12 text-center">
                          <p className="text-muted-foreground">
                            No runs found. Try adjusting your search or filters.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </WithSearch>

            {/* Pagination */}
            <WithSearch
              mapContextToProps={({
                pagingStart,
                pagingEnd,
                resultSearchTerm,
                totalResults,
                current,
                resultsPerPage,
                setCurrent,
              }) => ({
                pagingStart,
                pagingEnd,
                resultSearchTerm,
                totalResults,
                current,
                resultsPerPage,
                setCurrent,
              })}
            >
              {({
                pagingStart,
                pagingEnd,
                resultSearchTerm,
                totalResults,
                current,
                resultsPerPage,
                setCurrent,
              }) => {
                if (!totalResults || totalResults === 0) return null;

                return (
                  <div className="mt-6">
                    <Paging
                      view={({ current, totalPages, onChange }) => {
                        if (!current || totalPages <= 1) return null;

                        return (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => onChange?.(current - 1)}
                              disabled={current === 1}
                              className="rounded border px-4 py-2 disabled:opacity-50"
                            >
                              Previous
                            </button>
                            <span className="text-muted-foreground text-sm">
                              Page {current} of {totalPages}
                            </span>
                            <button
                              onClick={() => onChange?.(current + 1)}
                              disabled={current >= totalPages}
                              className="rounded border px-4 py-2 disabled:opacity-50"
                            >
                              Next
                            </button>
                          </div>
                        );
                      }}
                    />
                  </div>
                );
              }}
            </WithSearch>
          </div>
        </div>
      )}
    </WithSearch>
  );
}
