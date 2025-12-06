"use client";

import { useState } from "react";
import { SearchProvider, WithSearch, Paging } from "@elastic/react-search-ui";
import type { SearchDriverOptions } from "@elastic/search-ui";
import dataConfig from "./search-config";
import { ResultsTable } from "./results-table";
import { FilterBar } from "./filter-bar";
import { ControlsBar } from "./controls-bar";
import { ResultCard } from "./result-card";

// Facet configuration matching old app
const searchFacets = [
  { label: "Status", field: "status.keyword" },
  { label: "License", field: "licence.keyword" },
  { label: "Size", field: "qualities.NumberOfInstances" },
  { label: "Features", field: "qualities.NumberOfFeatures" },
  { label: "Task Type", field: "qualities.NumberOfclassNamees" },
  { label: "Format", field: "format" },
];

export function SearchContainer() {
  const [view, setView] = useState("table");
  return (
    <SearchProvider config={dataConfig as SearchDriverOptions}>
      <WithSearch
        mapContextToProps={({ isLoading, error }) => ({
          isLoading,
          error,
        })}
      >
        {({ isLoading, error }) => (
          <div className="space-y-0">
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

            <FilterBar facets={searchFacets} />
            <ControlsBar view={view} onViewChange={setView} />

            <div className="p-4">
              <WithSearch mapContextToProps={({ results }) => ({ results })}>
                {({ results }) => (
                  <>
                    {view === "table" && <ResultsTable results={results} />}
                    {view === "list" && (
                      <div className="space-y-0">
                        {results && results.length > 0 ? (
                          results.map((result: any, index: number) => (
                            <ResultCard
                              key={
                                result.id?.raw || result.data_id?.raw || index
                              }
                              result={result}
                            />
                          ))
                        ) : (
                          <div className="text-muted-foreground p-8 text-center">
                            No results found
                          </div>
                        )}
                      </div>
                    )}
                    {view === "grid" && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {results && results.length > 0 ? (
                          results.map((result: any, index: number) => (
                            <ResultCard
                              key={
                                result.id?.raw || result.data_id?.raw || index
                              }
                              result={result}
                            />
                          ))
                        ) : (
                          <div className="text-muted-foreground col-span-full p-8 text-center">
                            No results found
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </WithSearch>
            </div>

            <div className="flex justify-center border-t p-4">
              <Paging
                view={({ current, totalPages, onChange }) => {
                  if (!current || totalPages <= 1) return null;

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

                  return (
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
                          {startPage > 2 && <span className="px-2">...</span>}
                        </>
                      )}
                      {pages.map((page) => (
                        <button
                          key={page}
                          onClick={() => onChange(page)}
                          className={`rounded border px-3 py-1 ${
                            page === current
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      {endPage < totalPages && (
                        <>
                          {endPage < totalPages - 1 && (
                            <span className="px-2">...</span>
                          )}
                          <button
                            onClick={() => onChange(totalPages)}
                            className="hover:bg-muted rounded border px-3 py-1"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => onChange(current + 1)}
                        disabled={current === totalPages}
                        className="hover:bg-muted rounded border px-3 py-1 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        )}
      </WithSearch>
    </SearchProvider>
  );
}
