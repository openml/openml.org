"use client";

import { useState } from "react";
import Link from "next/link";
import { WithSearch, Paging } from "@elastic/react-search-ui";
import { FilterBar } from "../shared/filter-bar";
import { ControlsBar } from "../shared/controls-bar";
import { Badge } from "@/components/ui/badge";
import {
  Cog,
  Heart,
  CloudDownload,
  FlaskConical,
  Calendar,
  User,
} from "lucide-react";

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
  [key: string]: unknown;
}

const searchFacets: { label: string; field: string }[] = [
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
                              className="hover:bg-accent relative flex items-start justify-between border-b p-4 transition-colors"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="mb-2 flex items-start gap-3">
                                  <Cog className="mt-1 h-5 w-5 shrink-0 text-orange-600" />
                                  <div className="min-w-0 flex-1">
                                    <h3 className="mb-1 text-lg font-semibold">
                                      {name}
                                    </h3>
                                    {result.version?.raw && (
                                      <Badge
                                        variant="outline"
                                        className="mb-2 text-xs"
                                      >
                                        v{result.version.raw}
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {description && (
                                  <p
                                    className="text-muted-foreground mb-2 line-clamp-2 text-sm"
                                    dangerouslySetInnerHTML={{
                                      __html: description,
                                    }}
                                  />
                                )}

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
                                      })}
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                                  {result.runs?.raw !== undefined && (
                                    <span className="flex items-center gap-1.5">
                                      <FlaskConical className="h-3 w-3 text-red-600" />
                                      <span className="font-medium">
                                        {result.runs.raw.toLocaleString()}
                                      </span>
                                      <span className="text-muted-foreground">
                                        runs
                                      </span>
                                    </span>
                                  )}
                                  {result.nr_of_likes?.raw !== undefined && (
                                    <span className="flex items-center gap-1.5">
                                      <Heart className="h-3 w-3 text-pink-600" />
                                      <span className="font-medium">
                                        {result.nr_of_likes.raw.toLocaleString()}
                                      </span>
                                      <span className="text-muted-foreground">
                                        likes
                                      </span>
                                    </span>
                                  )}
                                  {result.nr_of_downloads?.raw !==
                                    undefined && (
                                    <span className="flex items-center gap-1.5">
                                      <CloudDownload className="h-3 w-3 text-blue-600" />
                                      <span className="font-medium">
                                        {result.nr_of_downloads.raw.toLocaleString()}
                                      </span>
                                      <span className="text-muted-foreground">
                                        downloads
                                      </span>
                                    </span>
                                  )}
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

                  {/* TODO: Add table and grid views if needed */}
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
