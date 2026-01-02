"use client";

import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { WithSearch, Paging, SearchContext } from "@elastic/react-search-ui";
import { FilterBar } from "../shared/filter-bar";
import { ControlsBar } from "../shared/controls-bar";
import { Badge } from "@/components/ui/badge";
import { entityColors } from "@/constants/entityColors";
import {
  Cog,
  Heart,
  CloudDownload,
  FlaskConical,
  Calendar,
  User,
  Hash,
  List,
  LayoutGrid,
  Columns,
  Clock,
} from "lucide-react";
import { FlowResultCard } from "./result-card";
import { FlowsResultsTable } from "./flows-results-table";
import { parseDescription } from "../teaser";

interface FlowResult {
  flow_id?: { raw: string | number };
  name?: { raw: string };
  description?: { snippet?: string; raw?: string };
  uploader?: { raw: string };
  uploader_id?: { raw: string | number };
  version?: { raw: number };
  date?: { raw: string };
  runs?: { raw: number };
  nr_of_likes?: { raw: number };
  nr_of_downloads?: { raw: number };
  status?: { raw: string };
  [key: string]: unknown;
}

const searchFacets: { label: string; field: string }[] = [
  { label: "Libraries", field: "dependencies.keyword" },
  // TODO: Add flow-specific facets
  // Example:
  // { label: "Language", field: "language.keyword" },
  // { label: "Framework", field: "framework.keyword" },
];

const sortOptions = [
  {
    name: "Most Recent",
    value: [{ field: "date", direction: "desc" }],
    id: "recent",
  },
  {
    name: "Most Runs",
    value: [{ field: "runs", direction: "desc" }],
    id: "runs",
  },
  {
    name: "Most Likes",
    value: [{ field: "nr_of_likes", direction: "desc" }],
    id: "likes",
  },
  {
    name: "Most Downloads",
    value: [{ field: "nr_of_downloads", direction: "desc" }],
    id: "downloads",
  },
];

export function FlowsSearchContainer() {
  const [view, setView] = useState("list");
  const [selectedFlow, setSelectedFlow] = useState<FlowResult | null>(null);
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
                <span className="font-semibold">&quot;{searchTerm}&quot;</span>
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
                  {view === "table" && (
                    <FlowsResultsTable results={results as FlowResult[]} />
                  )}
                  {view === "list" && (
                    <div className="space-y-0">
                      {results && results.length > 0 ? (
                        results.map((result: FlowResult, index: number) => {
                          const flowId = result.flow_id?.raw;
                          const name = result.name?.raw || "Untitled Flow";
                          const description =
                            result.description?.snippet ||
                            result.description?.raw ||
                            "";

                          return (
                            <div
                              key={flowId || index}
                              className="hover:bg-muted/40 relative flex items-start justify-between border-b px-4 py-1.5 transition-colors"
                            >
                              <div className="min-w-0 flex-1">
                                {/* Line 1: Icon, Name, Version, ID Badge */}
                                <div className="mb-1 flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3">
                                    <Cog className="mt-1 h-5 w-5 shrink-0 text-[#3b82f6]" />
                                    <div className="flex items-baseline gap-2">
                                      <h3 className="text-base font-semibold">
                                        {name}
                                      </h3>
                                      {result.version?.raw && (
                                        <span className="text-primary text-xs">
                                          v.{result.version.raw}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <Badge
                                    variant="openml"
                                    className="relative z-10 flex items-center gap-0.75 bg-[#3b82f6] px-2 py-0.5 text-xs font-semibold text-white"
                                    title="flow ID"
                                  >
                                    <Hash className="h-3 w-3" />
                                    {flowId}
                                  </Badge>
                                </div>

                                {/* Line 2: Author, Date, Status */}
                                <div className="text-muted-foreground mb-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
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
                                      })}
                                    </span>
                                  )}
                                  {result.status?.raw && (
                                    <Badge
                                      variant="outline"
                                      className={`h-4 px-1.5 text-[10px] font-medium tracking-wider uppercase ${
                                        result.status.raw === "active"
                                          ? "border-green-500 bg-green-50/50 text-green-600"
                                          : "border-amber-500 bg-amber-50/50 text-amber-600"
                                      }`}
                                    >
                                      {result.status.raw}
                                    </Badge>
                                  )}
                                </div>

                                {/* Line 3: Description */}
                                {description && (
                                  <p
                                    className="text-muted-foreground mb-1.5 line-clamp-2 text-sm"
                                    dangerouslySetInnerHTML={{
                                      __html: description,
                                    }}
                                  />
                                )}

                                {/* Line 4: Stats */}
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                                  <span
                                    className="flex items-center gap-1.5"
                                    title="runs"
                                  >
                                    <FlaskConical className="h-4 w-4 fill-red-500 text-red-500" />
                                    {result.runs?.raw?.toLocaleString() || 0}
                                  </span>
                                  <span
                                    className="flex items-center gap-1.5"
                                    title="likes"
                                  >
                                    <Heart className="h-4 w-4 fill-purple-500 text-purple-500" />
                                    {result.nr_of_likes?.raw || 0}
                                  </span>
                                  <span
                                    className="flex items-center gap-1.5"
                                    title="downloads"
                                  >
                                    <CloudDownload className="h-4 w-4 text-[#3b82f6]" />
                                    {result.nr_of_downloads?.raw || 0}
                                  </span>
                                </div>
                              </div>

                              {/* Invisible overlay link for entire row clickability */}
                              <Link
                                href={`/flows/${flowId}`}
                                className="absolute inset-0"
                                aria-label={`View flow ${name}`}
                              >
                                <span className="sr-only">
                                  View flow {name}
                                </span>
                              </Link>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-12 text-center">
                          <p className="text-muted-foreground">
                            No flows found. Try adjusting your search or
                            filters.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {view === "grid" && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {results && results.length > 0 ? (
                        results.map((result: FlowResult, index: number) => (
                          <FlowResultCard
                            key={result.flow_id?.raw || index}
                            result={result}
                          />
                        ))
                      ) : (
                        <div className="text-muted-foreground col-span-full py-12 text-center">
                          No flows found.
                        </div>
                      )}
                    </div>
                  )}

                  {view === "compact" && (
                    <div className="divide-y rounded-md border text-sm">
                      {results && results.length > 0 ? (
                        results.map((result: FlowResult, index: number) => (
                          <Link
                            key={result.flow_id?.raw || index}
                            href={`/flows/${result.flow_id?.raw}`}
                            className="hover:bg-muted/50 flex items-center justify-between p-3"
                          >
                            <div className="flex items-center gap-3">
                              <Cog className="h-4 w-4 text-[#3b82f6]" />
                              <span className="font-medium whitespace-nowrap">
                                {result.name?.raw}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-muted-foreground">
                                v.{result.version?.raw}
                              </span>
                              <Badge className="bg-[#3b82f6] text-white">
                                #{result.flow_id?.raw}
                              </Badge>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="text-muted-foreground py-8 text-center">
                          No flows found.
                        </div>
                      )}
                    </div>
                  )}

                  {view === "split" && (
                    <div className="flex min-h-[600px] gap-0 overflow-hidden rounded-md border">
                      <div className="bg-muted/10 w-[380px] shrink-0 space-y-0 overflow-y-auto border-r">
                        {results && results.length > 0 ? (
                          (() => {
                            // Auto-select first flow if none selected
                            const selectedId = selectedFlow?.flow_id?.raw;
                            const isSelectedInResults = results.some(
                              (r: FlowResult) => r.flow_id?.raw === selectedId,
                            );

                            if (!selectedFlow || !isSelectedInResults) {
                              setTimeout(() => setSelectedFlow(results[0]), 0);
                            }

                            return results.map(
                              (result: FlowResult, index: number) => {
                                const isSelected =
                                  result.flow_id?.raw === selectedId;
                                return (
                                  <div
                                    key={result.flow_id?.raw || index}
                                    onClick={() => setSelectedFlow(result)}
                                    className={`cursor-pointer border-b px-4 py-1.5 transition-colors ${
                                      isSelected
                                        ? "bg-muted/50 ring-muted-foreground/20 ring-1 ring-inset dark:bg-slate-800"
                                        : "hover:bg-muted/30"
                                    }`}
                                  >
                                    <div className="mb-1 flex items-start gap-2">
                                      <Cog className="mt-0.5 h-4 w-4 shrink-0 text-[#3b82f6]" />
                                      <h3 className="line-clamp-1 leading-tight font-semibold">
                                        {result.name?.raw}
                                      </h3>
                                    </div>
                                    <p className="text-muted-foreground line-clamp-2 text-xs">
                                      {
                                        parseDescription(
                                          result.description?.snippet ||
                                            result.description?.raw,
                                        ).cleanDescription
                                      }
                                    </p>
                                    <div className="mt-2 flex items-center gap-3 text-[10px] font-medium uppercase">
                                      <span className="text-[#3b82f6]">
                                        #{result.flow_id?.raw}
                                      </span>
                                      <span className="text-muted-foreground">
                                        v.{result.version?.raw}
                                      </span>
                                    </div>
                                  </div>
                                );
                              },
                            );
                          })()
                        ) : (
                          <div className="text-muted-foreground p-8 text-center text-sm">
                            No results found
                          </div>
                        )}
                      </div>
                      <div className="bg-card flex-1 overflow-y-auto p-6">
                        {selectedFlow ? (
                          <div className="mx-auto max-w-4xl">
                            <div className="mb-6 flex items-start gap-4">
                              <Cog
                                className="mt-1 h-10 w-10 shrink-0 text-[#3b82f6]"
                                strokeWidth={1.5}
                              />
                              <div className="flex-1">
                                <div className="mb-1 flex items-baseline gap-2">
                                  <h2 className="text-2xl font-bold">
                                    {selectedFlow.name?.raw || "Untitled"}
                                  </h2>
                                  <span className="text-primary text-sm">
                                    v.{selectedFlow.version?.raw || 1}
                                  </span>
                                </div>

                                <Badge
                                  variant="outline"
                                  className="border-[#3b82f6] bg-[#3b82f6]/5 text-[#3b82f6]"
                                >
                                  <Hash className="mr-1 h-3 w-3" />
                                  {selectedFlow.flow_id?.raw}
                                </Badge>
                              </div>
                              <Link
                                href={`/flows/${selectedFlow.flow_id?.raw}`}
                                className="rounded bg-[#3b82f6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3b82f6]/90"
                              >
                                View Details
                              </Link>
                            </div>

                            {/* Full Description */}
                            <div className="text-muted-foreground mb-8 text-sm leading-relaxed">
                              {
                                parseDescription(
                                  selectedFlow.description?.snippet ||
                                    selectedFlow.description?.raw,
                                ).cleanDescription
                              }
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-6">
                              <div className="rounded-lg border p-4">
                                <FlaskConical className="mb-2 h-5 w-5 fill-red-500 text-red-500" />
                                <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                                  Runs
                                </div>
                                <div className="text-xl font-bold">
                                  {selectedFlow.runs?.raw?.toLocaleString() ||
                                    0}
                                </div>
                              </div>
                              <div className="rounded-lg border p-4">
                                <Heart className="mb-2 h-5 w-5 fill-purple-500 text-purple-500" />
                                <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                                  Likes
                                </div>
                                <div className="text-xl font-bold">
                                  {selectedFlow.nr_of_likes?.raw || 0}
                                </div>
                              </div>
                              <div className="rounded-lg border p-4">
                                <CloudDownload className="mb-2 h-5 w-5 text-[#3b82f6]" />
                                <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                                  Downloads
                                </div>
                                <div className="text-xl font-bold">
                                  {selectedFlow.nr_of_downloads?.raw || 0}
                                </div>
                              </div>
                            </div>

                            {/* Metadata */}
                            <div className="mt-8 space-y-4 border-t pt-8">
                              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                                <Clock className="h-4 w-4" />
                                <span>
                                  Uploaded on{" "}
                                  {selectedFlow.date?.raw
                                    ? new Date(
                                        selectedFlow.date.raw,
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </span>
                              </div>
                              {selectedFlow.uploader?.raw && (
                                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                                  <User className="h-4 w-4" />
                                  <span>
                                    Uploaded by{" "}
                                    <Link
                                      href={`/users/${selectedFlow.uploader_id?.raw}`}
                                      className="font-medium text-[#3b82f6] hover:underline"
                                    >
                                      {selectedFlow.uploader.raw}
                                    </Link>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground flex h-full items-center justify-center">
                            Select a flow to view details
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </WithSearch>
            ;{/* Pagination */}
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
                  <div className="mt-6 flex flex-col items-center gap-3">
                    <Paging
                      view={({ current, totalPages, onChange }) => {
                        if (!current || totalPages <= 1) return null;

                        const MAX_RESULT_WINDOW = 10000;
                        const pageSize = resultsPerPage || 20;
                        const MAX_ACCESSIBLE_PAGE = Math.floor(
                          MAX_RESULT_WINDOW / pageSize,
                        );
                        const SHOW_WARNING_FROM = Math.max(
                          1,
                          MAX_ACCESSIBLE_PAGE - 1,
                        );

                        const pages = [];
                        const maxVisible = 7;
                        let startPage = Math.max(
                          1,
                          current - Math.floor(maxVisible / 2),
                        );
                        const endPage = Math.min(
                          totalPages,
                          startPage + maxVisible - 1,
                        );

                        if (endPage - startPage < maxVisible - 1) {
                          startPage = Math.max(1, endPage - maxVisible + 1);
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(i);
                        }

                        const isPageAccessible = (page: number) =>
                          page <= MAX_ACCESSIBLE_PAGE;
                        const isCurrentBeyondLimit =
                          current > MAX_ACCESSIBLE_PAGE;

                        return (
                          <div className="flex flex-col items-center gap-3">
                            {current >= SHOW_WARNING_FROM && (
                              <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                                ⚠️ Elasticsearch limit: Only{" "}
                                {MAX_ACCESSIBLE_PAGE.toLocaleString()} pages (
                                {MAX_RESULT_WINDOW.toLocaleString()} results)
                                can be accessed.{" "}
                                {isCurrentBeyondLimit
                                  ? `Page ${current} is not accessible.`
                                  : `Showing page ${current.toLocaleString()} of ${totalPages.toLocaleString()} total pages.`}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onChange(current - 1)}
                                disabled={current === 1}
                                className="hover:bg-muted rounded border px-3 py-1 disabled:opacity-50"
                              >
                                Previous
                              </button>
                              {startPage > 1 && (
                                <>
                                  <button
                                    onClick={() => onChange(1)}
                                    className="hover:bg-muted rounded border px-3 py-1"
                                  >
                                    1
                                  </button>
                                  {startPage > 2 && (
                                    <span className="px-2">...</span>
                                  )}
                                </>
                              )}
                              {pages.map((page) => {
                                const isAccessible = isPageAccessible(page);
                                const isCurrent = page === current;
                                return (
                                  <button
                                    key={page}
                                    onClick={() =>
                                      isAccessible && onChange(page)
                                    }
                                    disabled={!isAccessible}
                                    className={`rounded border px-3 py-1 ${
                                      isCurrent
                                        ? "text-white"
                                        : isAccessible
                                          ? "hover:bg-muted dark:hover:bg-slate-700"
                                          : "cursor-not-allowed line-through opacity-30"
                                    }`}
                                    style={
                                      isCurrent
                                        ? { backgroundColor: entityColors.flow }
                                        : undefined
                                    }
                                    title={
                                      !isAccessible
                                        ? `Page ${page} exceeds ES limit (max: ${MAX_ACCESSIBLE_PAGE})`
                                        : ""
                                    }
                                  >
                                    {page}
                                  </button>
                                );
                              })}
                              {endPage < totalPages && (
                                <>
                                  {endPage < totalPages - 1 && (
                                    <span className="px-2">...</span>
                                  )}
                                  <button
                                    onClick={() =>
                                      isPageAccessible(totalPages) &&
                                      onChange(totalPages)
                                    }
                                    disabled={!isPageAccessible(totalPages)}
                                    className={`rounded border px-3 py-1 ${
                                      isPageAccessible(totalPages)
                                        ? "hover:bg-muted"
                                        : "cursor-not-allowed line-through opacity-30"
                                    }`}
                                    title={
                                      !isPageAccessible(totalPages)
                                        ? `Page ${totalPages} exceeds ES limit (max: ${MAX_ACCESSIBLE_PAGE})`
                                        : ""
                                    }
                                  >
                                    {totalPages}
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => onChange(current + 1)}
                                disabled={
                                  current >= totalPages ||
                                  !isPageAccessible(current + 1)
                                }
                                className="hover:bg-muted rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        );
                      }}
                    />
                  </div>
                );
              }}
            </WithSearch>
            ;{/* Pagination */}
          </div>
        </div>
      )}
    </WithSearch>
  );
}
