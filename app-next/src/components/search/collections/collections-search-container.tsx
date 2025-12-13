"use client";

import { useState } from "react";
import Link from "next/link";
import { WithSearch, Paging } from "@elastic/react-search-ui";
import { FilterBar } from "../shared/filter-bar";
import { ControlsBar } from "../shared/controls-bar";
import { Badge } from "@/components/ui/badge";
import { Layers, Calendar, User, Package } from "lucide-react";

interface CollectionResult {
  collection_id?: { raw: string | number };
  name?: { raw: string };
  description?: { snippet?: string; raw?: string };
  uploader?: { raw: string };
  uploader_id?: { raw: string | number };
  date?: { raw: string };
  nr_of_items?: { raw: number };
  [key: string]: unknown;
}

const searchFacets = [
  // TODO: Add collection-specific facets
];

const sortOptions = [
  {
    name: "Most Recent",
    value: [{ field: "date", direction: "desc" }],
    id: "recent",
  },
  {
    name: "Most Items",
    value: [{ field: "nr_of_items", direction: "desc" }],
    id: "items",
  },
];

export function CollectionsSearchContainer() {
  const [view, setView] = useState("list");

  return (
    <WithSearch
      mapContextToProps={({ isLoading, error }) => ({
        isLoading,
        error,
      })}
    >
      {({ isLoading, error }) => (
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
                        results.map(
                          (result: CollectionResult, index: number) => {
                            const collectionId = result.collection_id?.raw;
                            const name =
                              result.name?.raw || "Untitled Collection";
                            const description =
                              result.description?.snippet ||
                              result.description?.raw ||
                              "";

                            return (
                              <div
                                key={collectionId || index}
                                className="hover:bg-accent relative flex items-start justify-between border-b p-4 transition-colors"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="mb-2 flex items-start gap-3">
                                    <Layers className="mt-1 h-5 w-5 shrink-0 text-indigo-600" />
                                    <div className="min-w-0 flex-1">
                                      <h3 className="mb-1 text-lg font-semibold">
                                        {name}
                                      </h3>
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
                                    {result.nr_of_items?.raw !== undefined && (
                                      <span className="flex items-center gap-1.5">
                                        <Package className="h-3 w-3 text-indigo-600" />
                                        <span className="font-medium">
                                          {result.nr_of_items.raw.toLocaleString()}
                                        </span>
                                        <span className="text-muted-foreground">
                                          items
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Invisible overlay link for entire row clickability */}
                                <Link
                                  href={`/collections/${collectionId}`}
                                  className="absolute inset-0"
                                  aria-label={`View collection ${name}`}
                                >
                                  <span className="sr-only">
                                    View collection {name}
                                  </span>
                                </Link>
                              </div>
                            );
                          },
                        )
                      ) : (
                        <div className="py-12 text-center">
                          <p className="text-muted-foreground">
                            No collections found. Try adjusting your search or
                            filters.
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

                const maxResults = 10000;
                const effectiveTotal = Math.min(totalResults, maxResults);
                const totalPages = Math.ceil(effectiveTotal / resultsPerPage);

                return (
                  <div className="mt-6">
                    <Paging
                      current={current}
                      resultsPerPage={resultsPerPage}
                      totalPages={totalPages}
                      onChange={(page) => setCurrent?.(page)}
                      view={({ currentPage, totalPages }) => (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setCurrent?.(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="rounded border px-4 py-2 disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <span className="text-muted-foreground text-sm">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            onClick={() => setCurrent?.(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="rounded border px-4 py-2 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      )}
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
