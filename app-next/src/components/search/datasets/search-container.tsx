"use client";

import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { SearchContext } from "@elastic/react-search-ui";
import Link from "next/link";
import { WithSearch, Paging } from "@elastic/react-search-ui";
import { ResultsTable } from "../results-table";
import { FilterBar } from "../shared/filter-bar";
import { ControlsBar } from "../shared/controls-bar";
import { ResultCard } from "./result-card";
import { parseDescription } from "../teaser";
import { Badge } from "@/components/ui/badge";
import { entityColors } from "@/constants/entityColors";
import {
  FlaskConical,
  Heart,
  CloudDownload,
  BarChart3,
  Clock,
  Hash,
} from "lucide-react";

interface SearchResult {
  id?: { raw: string | number };
  data_id?: { raw: string | number };
  name?: { raw: string };
  version?: { raw: number };
  description?: { snippet?: string; raw?: string };
  runs?: { raw: number };
  nr_of_likes?: { raw: number };
  nr_of_downloads?: { raw: number };
  "qualities.NumberOfInstances"?: { raw: number };
  "qualities.NumberOfFeatures"?: { raw: number };
  date?: { raw: string };
  [key: string]: unknown;
}

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
  const [view, setView] = useState("list");
  const [selectedDataset, setSelectedDataset] = useState<SearchResult | null>(
    null,
  );
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

    // setSearchTerm from actions triggers search automatically
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
      {({
        isLoading,
        error,
        searchTerm,
        totalResults,
      }: {
        isLoading: boolean;
        error: unknown;
        searchTerm: string;
        totalResults: number;
      }) => (
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
                        results.map((result: SearchResult, index: number) => {
                          const did = result.data_id?.raw || result.id?.raw;
                          return (
                            <div
                              key={did || index}
                              className="hover:bg-accent relative flex items-start justify-between border-b p-4 transition-colors"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="mb-1 flex items-start gap-3">
                                  <svg
                                    viewBox="0 0 448 512"
                                    className="mt-1 h-5 w-5 shrink-0"
                                    style={{ color: "rgb(102, 187, 106)" }}
                                    aria-hidden="true"
                                  >
                                    <path
                                      fill="currentColor"
                                      d="M448 205.8c-14.8 9.8-31.8 17.7-49.5 24-47 16.8-108.7 26.2-174.5 26.2S96.4 246.5 49.5 229.8c-17.6-6.3-34.7-14.2-49.5-24L0 288c0 44.2 100.3 80 224 80s224-35.8 224-80l0-82.2zm0-77.8l0-48C448 35.8 347.7 0 224 0S0 35.8 0 80l0 48c0 44.2 100.3 80 224 80s224-35.8 224-80zM398.5 389.8C351.6 406.5 289.9 416 224 416S96.4 406.5 49.5 389.8c-17.6-6.3-34.7-14.2-49.5-24L0 432c0 44.2 100.3 80 224 80s224-35.8 224-80l0-66.2c-14.8 9.8-31.8 17.7-49.5 24z"
                                    />
                                  </svg>
                                  <div className="flex items-baseline gap-2">
                                    <h3 className="text-base font-semibold">
                                      {result.name?.raw || "Untitled"}
                                    </h3>
                                    <span className="text-primary text-xs">
                                      v.{result.version?.raw || 1} ✓
                                    </span>
                                  </div>
                                </div>
                                <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                                  {
                                    parseDescription(
                                      result.description?.snippet ||
                                        result.description?.raw,
                                      2,
                                    ).cleanDescription
                                  }
                                </p>
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
                                    <CloudDownload className="h-4 w-4 text-blue-500" />
                                    {result.nr_of_downloads?.raw || 0}
                                  </span>
                                  <span
                                    className="flex items-center gap-1.5"
                                    title="instances (rows)"
                                  >
                                    <BarChart3 className="h-4 w-4 text-gray-500" />
                                    {result[
                                      "qualities.NumberOfInstances"
                                    ]?.raw?.toLocaleString() || "N/A"}
                                  </span>
                                  <span
                                    className="flex items-center gap-1.5"
                                    title="features (columns)"
                                  >
                                    <BarChart3 className="h-4 w-4 rotate-90 text-gray-500" />
                                    {result["qualities.NumberOfFeatures"]
                                      ?.raw || "N/A"}
                                  </span>
                                  <span
                                    className="text-muted-foreground flex items-center gap-1.5"
                                    title="date"
                                  >
                                    <Clock className="h-4 w-4" />
                                    {result.date?.raw
                                      ? new Date(
                                          result.date.raw,
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                              <Badge
                                variant="openml"
                                className="relative z-10 flex items-center gap-0.75 bg-[rgb(102,187,106)] px-2 py-0.5 text-xs font-semibold text-white"
                                title="dataset ID"
                              >
                                <Hash className="h-3 w-3" />
                                {did}
                              </Badge>

                              {/* Invisible overlay link for entire row clickability */}
                              <Link
                                href={`/datasets/${did}`}
                                className="absolute inset-0"
                                aria-label={`View ${result.name?.raw || "dataset"}`}
                              >
                                <span className="sr-only">
                                  View {result.name?.raw || "dataset"}
                                </span>
                              </Link>
                            </div>
                          );
                        })
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
                        results.map((result: SearchResult, index: number) => (
                          <ResultCard
                            key={result.id?.raw || result.data_id?.raw || index}
                            result={result as never}
                          />
                        ))
                      ) : (
                        <div className="text-muted-foreground col-span-full p-8 text-center">
                          No results found
                        </div>
                      )}
                    </div>
                  )}
                  {view === "split" && (
                    <div className="flex gap-0">
                      <div className="w-[380px] space-y-0 overflow-y-auto border-r">
                        {results && results.length > 0 ? (
                          (() => {
                            // Auto-select first dataset if none selected or if selected dataset is not in current results
                            const currentIds = results.map(
                              (r: SearchResult) => r.data_id?.raw || r.id?.raw,
                            );
                            const selectedId =
                              selectedDataset?.data_id?.raw ||
                              selectedDataset?.id?.raw;
                            if (
                              !selectedDataset ||
                              !currentIds.includes(selectedId)
                            ) {
                              // Use setTimeout to avoid state update during render
                              setTimeout(() => {
                                setSelectedDataset(results[0] as SearchResult);
                              }, 0);
                            }
                            return results.map(
                              (result: SearchResult, index: number) => {
                                const isSelected =
                                  (selectedDataset?.data_id?.raw ||
                                    selectedDataset?.id?.raw) ===
                                  (result.data_id?.raw || result.id?.raw);
                                const did =
                                  result.data_id?.raw || result.id?.raw;
                                return (
                                  <Link
                                    key={did || index}
                                    href={`/datasets/${did}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedDataset(
                                        result as SearchResult,
                                      );
                                    }}
                                    className={`hover:bg-accent block cursor-pointer border-b p-3 transition-colors dark:hover:bg-slate-700 ${
                                      isSelected
                                        ? "bg-accent dark:bg-slate-700"
                                        : ""
                                    }`}
                                  >
                                    <div className="mb-1 flex items-start gap-2">
                                      <svg
                                        viewBox="0 0 448 512"
                                        className="mt-0.5 h-4 w-4 shrink-0"
                                        style={{ color: "rgb(102, 187, 106)" }}
                                        aria-hidden="true"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M448 205.8c-14.8 9.8-31.8 17.7-49.5 24-47 16.8-108.7 26.2-174.5 26.2S96.4 246.5 49.5 229.8c-17.6-6.3-34.7-14.2-49.5-24L0 288c0 44.2 100.3 80 224 80s224-35.8 224-80l0-82.2zm0-77.8l0-48C448 35.8 347.7 0 224 0S0 35.8 0 80l0 48c0 44.2 100.3 80 224 80s224-35.8 224-80zM398.5 389.8C351.6 406.5 289.9 416 224 416S96.4 406.5 49.5 389.8c-17.6-6.3-34.7-14.2-49.5-24L0 432c0 44.2 100.3 80 224 80s224-35.8 224-80l0-66.2c-14.8 9.8-31.8 17.7-49.5 24z"
                                        />
                                      </svg>
                                      <h4 className="line-clamp-1 text-sm font-semibold">
                                        {result.name?.raw || "Untitled"}
                                      </h4>
                                    </div>
                                    <p className="text-muted-foreground line-clamp-2 text-xs">
                                      {
                                        parseDescription(
                                          result.description?.snippet ||
                                            result.description?.raw,
                                          2,
                                        ).cleanDescription
                                      }
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                                      <span
                                        className="flex items-center gap-1"
                                        title="runs"
                                      >
                                        <FlaskConical className="h-3 w-3 fill-red-500 text-red-500" />
                                        {result.runs?.raw?.toLocaleString() ||
                                          0}
                                      </span>
                                      <span
                                        className="flex items-center gap-1"
                                        title="likes"
                                      >
                                        <Heart className="h-3 w-3 fill-purple-500 text-purple-500" />
                                        {result.nr_of_likes?.raw || 0}
                                      </span>
                                      <span
                                        className="flex items-center gap-1"
                                        title="downloads"
                                      >
                                        <CloudDownload className="h-3 w-3 text-blue-500" />
                                        {result.nr_of_downloads?.raw || 0}
                                      </span>
                                    </div>
                                  </Link>
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
                      <div className="flex-1 overflow-y-auto p-6">
                        {selectedDataset ? (
                          <div className="mx-auto max-w-4xl">
                            <div className="mb-4 flex items-start gap-3">
                              <svg
                                viewBox="0 0 448 512"
                                className="mt-1 h-6 w-6 shrink-0"
                                style={{ color: "rgb(102, 187, 106)" }}
                                aria-hidden="true"
                              >
                                <path
                                  fill="currentColor"
                                  d="M448 205.8c-14.8 9.8-31.8 17.7-49.5 24-47 16.8-108.7 26.2-174.5 26.2S96.4 246.5 49.5 229.8c-17.6-6.3-34.7-14.2-49.5-24L0 288c0 44.2 100.3 80 224 80s224-35.8 224-80l0-82.2zm0-77.8l0-48C448 35.8 347.7 0 224 0S0 35.8 0 80l0 48c0 44.2 100.3 80 224 80s224-35.8 224-80zM398.5 389.8C351.6 406.5 289.9 416 224 416S96.4 406.5 49.5 389.8c-17.6-6.3-34.7-14.2-49.5-24L0 432c0 44.2 100.3 80 224 80s224-35.8 224-80l0-66.2c-14.8 9.8-31.8 17.7-49.5 24z"
                                />
                              </svg>
                              <div className="flex-1">
                                <div className="mb-1 flex items-baseline gap-2">
                                  <h2 className="text-xl font-bold">
                                    {selectedDataset.name?.raw || "Untitled"}
                                  </h2>
                                  <span className="text-primary text-sm">
                                    v.{selectedDataset.version?.raw || 1} ✓
                                  </span>
                                </div>

                                <Badge
                                  variant="outline"
                                  className="border-[rgb(102,187,106)] bg-[rgb(102,187,106)]/5 text-[rgb(102,187,106)] hover:bg-[rgb(102,187,106)]/10"
                                >
                                  <Hash className="mr-1 h-3 w-3" />
                                  {selectedDataset.data_id?.raw ||
                                    selectedDataset.id?.raw}
                                </Badge>
                              </div>
                            </div>

                            {/* Full Description */}
                            <div className="text-muted-foreground mb-6 text-sm leading-relaxed">
                              {
                                parseDescription(
                                  selectedDataset.description?.snippet ||
                                    selectedDataset.description?.raw,
                                ).cleanDescription
                              }
                            </div>

                            {/* Stats Grid */}
                            <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <FlaskConical className="h-5 w-5 fill-red-500 text-red-500" />
                                <div>
                                  <div className="text-muted-foreground text-xs">
                                    Runs
                                  </div>
                                  <div className="font-semibold">
                                    {selectedDataset.runs?.raw?.toLocaleString() ||
                                      0}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Heart className="h-5 w-5 fill-purple-500 text-purple-500" />
                                <div>
                                  <div className="text-muted-foreground text-xs">
                                    Likes
                                  </div>
                                  <div className="font-semibold">
                                    {selectedDataset.nr_of_likes?.raw || 0}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <CloudDownload className="h-5 w-5 text-blue-500" />
                                <div>
                                  <div className="text-muted-foreground text-xs">
                                    Downloads
                                  </div>
                                  <div className="font-semibold">
                                    {selectedDataset.nr_of_downloads?.raw || 0}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-gray-500" />
                                <div>
                                  <div className="text-muted-foreground text-xs">
                                    Instances
                                  </div>
                                  <div className="font-semibold">
                                    {selectedDataset[
                                      "qualities.NumberOfInstances"
                                    ]?.raw?.toLocaleString() || "N/A"}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 rotate-90 text-gray-500" />
                                <div>
                                  <div className="text-muted-foreground text-xs">
                                    Features
                                  </div>
                                  <div className="font-semibold">
                                    {selectedDataset[
                                      "qualities.NumberOfFeatures"
                                    ]?.raw || "N/A"}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-gray-500" />
                                <div>
                                  <div className="text-muted-foreground text-xs">
                                    Date
                                  </div>
                                  <div className="font-semibold">
                                    {selectedDataset.date?.raw
                                      ? new Date(
                                          selectedDataset.date.raw,
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })
                                      : "N/A"}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* See Full Details Button */}
                            <div className="mt-6 flex justify-center">
                              <Link
                                href={`/datasets/${selectedDataset.data_id?.raw || selectedDataset.id?.raw}`}
                                className="inline-flex items-center gap-2 rounded-md bg-[rgb(102,187,106)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[rgb(92,177,96)]"
                              >
                                See Full Details
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground flex h-full items-center justify-center text-center">
                            Select a dataset to view details
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </WithSearch>
          </div>

          <WithSearch
            mapContextToProps={({ resultsPerPage }) => ({ resultsPerPage })}
          >
            {({ resultsPerPage }) => {
              const MAX_RESULT_WINDOW = 10000;
              const pageSize = resultsPerPage || 20;
              const MAX_ACCESSIBLE_PAGE = Math.floor(
                MAX_RESULT_WINDOW / pageSize,
              );
              const SHOW_WARNING_FROM = Math.max(1, MAX_ACCESSIBLE_PAGE - 1);

              return (
                <>
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
                                        ? { backgroundColor: entityColors.data }
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
                </>
              );
            }}
          </WithSearch>
        </div>
      )}
    </WithSearch>
  );
}
