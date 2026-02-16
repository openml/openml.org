"use client";

import { useState } from "react";
import Link from "next/link";
import { WithSearch, Paging } from "@elastic/react-search-ui";
import { FilterBar } from "../shared/filter-bar";
import { ControlsBar } from "../shared/controls-bar";
import { Badge } from "@/components/ui/badge";
import { entityColors } from "@/constants/entityColors";
import { truncateName } from "@/lib/utils";
import {
  Layers,
  Calendar,
  User,
  Database,
  Flag,
  Cog,
  FlaskConical,
  Hash,
  Clock,
  ArrowRight,
} from "lucide-react";

interface StudyResult {
  study_id?: { raw: string | number };
  study_type?: { raw: string };
  name?: { raw: string; snippet?: string };
  description?: { snippet?: string; raw?: string };
  uploader?: { raw: string };
  uploader_id?: { raw: string | number };
  date?: { raw: string };
  datasets_included?: { raw: number };
  tasks_included?: { raw: number };
  flows_included?: { raw: number };
  runs_included?: { raw: number };
  [key: string]: unknown;
}

const searchFacets = [
  { label: "Uploader", field: "uploader.keyword" },
];

const sortOptions = [
  { name: "Relevance", value: [], id: "relevance" },
  {
    name: "Most Recent",
    value: [{ field: "date", direction: "desc" }],
    id: "recent",
  },
  {
    name: "Most Datasets",
    value: [{ field: "datasets_included", direction: "desc" }],
    id: "datasets",
  },
  {
    name: "Most Tasks",
    value: [{ field: "tasks_included", direction: "desc" }],
    id: "tasks",
  },
  {
    name: "Most Flows",
    value: [{ field: "flows_included", direction: "desc" }],
    id: "flows",
  },
  {
    name: "Most Runs",
    value: [{ field: "runs_included", direction: "desc" }],
    id: "runs",
  },
  {
    name: "Uploader (A-Z)",
    value: [{ field: "uploader.keyword", direction: "asc" }],
    id: "uploader-asc",
  },
];

interface CollectionsSearchContainerProps {
  basePath?: string;
  entityColor?: string;
}

export function CollectionsSearchContainer({
  basePath = "/collections",
  entityColor = entityColors.collections,
}: CollectionsSearchContainerProps) {
  const [view, setView] = useState("list");
  const [selectedStudy, setSelectedStudy] = useState<StudyResult | null>(null);

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
        isLoading?: boolean;
        error?: unknown;
        searchTerm?: string;
        totalResults?: number;
      }) => (
        <div className="space-y-0">
          {isLoading && (
            <div className="bg-primary/20 h-1 w-full overflow-hidden">
              <div className="bg-primary h-full w-1/3 animate-pulse" />
            </div>
          )}

          {!!error && (
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
                <span className="text-muted-foreground">&mdash;</span>
                <span className="font-semibold" style={{ color: entityColor }}>
                  {totalResults?.toLocaleString() || 0}
                </span>
                <span className="text-muted-foreground">
                  {totalResults === 1 ? "result" : "results"} found
                </span>
              </div>
            </div>
          )}

          <FilterBar facets={searchFacets} />
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
                          (result: StudyResult, index: number) => {
                            const studyId = result.study_id?.raw;
                            const name = truncateName(
                              result.name?.raw || "Untitled Collection",
                            );
                            const description =
                              result.description?.snippet ||
                              result.description?.raw ||
                              "";
                            const datasetsCount = Number(
                              result.datasets_included?.raw || 0,
                            );
                            const tasksCount = Number(
                              result.tasks_included?.raw || 0,
                            );
                            const flowsCount = Number(
                              result.flows_included?.raw || 0,
                            );
                            const runsCount = Number(
                              result.runs_included?.raw || 0,
                            );

                            return (
                              <div
                                key={studyId || index}
                                className="hover:bg-accent relative flex items-start justify-between border-b p-4 transition-colors"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="mb-1 flex items-start gap-3">
                                    <Layers
                                      className="mt-1 h-5 w-5 shrink-0"
                                      style={{ color: entityColor }}
                                    />
                                    <div className="flex items-baseline gap-2">
                                      <h3 className="text-base font-semibold">
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

                                  {/* Entity counts with correct colors */}
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                                    {datasetsCount > 0 && (
                                      <span
                                        className="flex items-center gap-1.5"
                                        title="datasets"
                                      >
                                        <Database
                                          className="h-4 w-4"
                                          style={{ color: entityColors.data }}
                                        />
                                        {datasetsCount.toLocaleString()}
                                      </span>
                                    )}
                                    {tasksCount > 0 && (
                                      <span
                                        className="flex items-center gap-1.5"
                                        title="tasks"
                                      >
                                        <Flag
                                          className="h-4 w-4"
                                          style={{ color: entityColors.task }}
                                        />
                                        {tasksCount.toLocaleString()}
                                      </span>
                                    )}
                                    {flowsCount > 0 && (
                                      <span
                                        className="flex items-center gap-1.5"
                                        title="flows"
                                      >
                                        <Cog
                                          className="h-4 w-4"
                                          style={{ color: entityColors.flow }}
                                        />
                                        {flowsCount.toLocaleString()}
                                      </span>
                                    )}
                                    {runsCount > 0 && (
                                      <span
                                        className="flex items-center gap-1.5"
                                        title="runs"
                                      >
                                        <FlaskConical
                                          className="h-4 w-4"
                                          style={{ color: entityColors.run }}
                                        />
                                        {runsCount.toLocaleString()}
                                      </span>
                                    )}
                                    {result.date?.raw && (
                                      <span
                                        className="text-muted-foreground flex items-center gap-1.5"
                                        title="date"
                                      >
                                        <Clock className="h-4 w-4" />
                                        {new Date(
                                          result.date.raw,
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                        })}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <Badge
                                  variant="openml"
                                  className="relative z-10 flex items-center gap-0.75 px-2 py-0.5 text-xs font-semibold text-white"
                                  style={{ backgroundColor: entityColor }}
                                  title="study ID"
                                >
                                  <Hash className="h-3 w-3" />
                                  {studyId}
                                </Badge>

                                <Link
                                  href={`${basePath}/${studyId}`}
                                  className="absolute inset-0"
                                  aria-label={`View ${name}`}
                                >
                                  <span className="sr-only">
                                    View {name}
                                  </span>
                                </Link>
                              </div>
                            );
                          },
                        )
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
                        results.map(
                          (result: StudyResult, index: number) => {
                            const studyId = result.study_id?.raw;
                            const name = truncateName(
                              result.name?.raw || "Untitled Collection",
                            );
                            const description =
                              result.description?.snippet ||
                              result.description?.raw ||
                              "";
                            const datasetsCount = Number(
                              result.datasets_included?.raw || 0,
                            );
                            const tasksCount = Number(
                              result.tasks_included?.raw || 0,
                            );
                            const flowsCount = Number(
                              result.flows_included?.raw || 0,
                            );
                            const runsCount = Number(
                              result.runs_included?.raw || 0,
                            );

                            return (
                              <Link
                                key={studyId || index}
                                href={`${basePath}/${studyId}`}
                                className="hover:bg-accent group relative flex flex-col rounded-lg border p-4 transition-colors"
                              >
                                <div className="mb-2 flex items-center justify-between">
                                  <Layers
                                    className="h-5 w-5"
                                    style={{ color: entityColor }}
                                  />
                                  <Badge
                                    variant="openml"
                                    className="flex items-center gap-0.5 px-1.5 py-0 text-[10px] font-semibold text-white"
                                    style={{ backgroundColor: entityColor }}
                                  >
                                    <Hash className="h-2.5 w-2.5" />
                                    {studyId}
                                  </Badge>
                                </div>
                                <h4 className="mb-1 line-clamp-1 text-sm font-semibold">
                                  {name}
                                </h4>
                                {description && (
                                  <p
                                    className="text-muted-foreground mb-3 line-clamp-2 text-xs"
                                    dangerouslySetInnerHTML={{
                                      __html: description,
                                    }}
                                  />
                                )}
                                <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 text-xs">
                                  {datasetsCount > 0 && (
                                    <span className="flex items-center gap-1" title="datasets">
                                      <Database className="h-3 w-3" style={{ color: entityColors.data }} />
                                      {datasetsCount.toLocaleString()}
                                    </span>
                                  )}
                                  {tasksCount > 0 && (
                                    <span className="flex items-center gap-1" title="tasks">
                                      <Flag className="h-3 w-3" style={{ color: entityColors.task }} />
                                      {tasksCount.toLocaleString()}
                                    </span>
                                  )}
                                  {flowsCount > 0 && (
                                    <span className="flex items-center gap-1" title="flows">
                                      <Cog className="h-3 w-3" style={{ color: entityColors.flow }} />
                                      {flowsCount.toLocaleString()}
                                    </span>
                                  )}
                                  {runsCount > 0 && (
                                    <span className="flex items-center gap-1" title="runs">
                                      <FlaskConical className="h-3 w-3" style={{ color: entityColors.run }} />
                                      {runsCount.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                {result.uploader?.raw && (
                                  <p className="text-muted-foreground mt-2 truncate text-xs">
                                    {result.uploader.raw}
                                  </p>
                                )}
                              </Link>
                            );
                          },
                        )
                      ) : (
                        <div className="text-muted-foreground col-span-full p-8 text-center">
                          No results found
                        </div>
                      )}
                    </div>
                  )}

                  {view === "table" && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left font-medium">ID</th>
                            <th className="px-4 py-3 text-left font-medium">Name</th>
                            <th className="px-4 py-3 text-left font-medium">Uploader</th>
                            <th className="px-4 py-3 text-right font-medium">Datasets</th>
                            <th className="px-4 py-3 text-right font-medium">Tasks</th>
                            <th className="px-4 py-3 text-right font-medium">Flows</th>
                            <th className="px-4 py-3 text-right font-medium">Runs</th>
                            <th className="px-4 py-3 text-left font-medium">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results && results.length > 0 ? (
                            results.map(
                              (result: StudyResult, index: number) => {
                                const studyId = result.study_id?.raw;
                                return (
                                  <tr
                                    key={studyId || index}
                                    className="hover:bg-accent relative border-b transition-colors"
                                  >
                                    <td className="px-4 py-3">
                                      <Badge
                                        variant="openml"
                                        className="flex w-fit items-center gap-0.5 px-1.5 py-0 text-[10px] font-semibold text-white"
                                        style={{ backgroundColor: entityColor }}
                                      >
                                        {studyId}
                                      </Badge>
                                    </td>
                                    <td className="max-w-[300px] truncate px-4 py-3 font-medium">
                                      <Link
                                        href={`${basePath}/${studyId}`}
                                        className="hover:underline"
                                      >
                                        {truncateName(result.name?.raw || "Untitled")}
                                      </Link>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                      {result.uploader?.raw || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      {Number(result.datasets_included?.raw || 0).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      {Number(result.tasks_included?.raw || 0).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      {Number(result.flows_included?.raw || 0).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      {Number(result.runs_included?.raw || 0).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                      {result.date?.raw
                                        ? new Date(result.date.raw).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                          })
                                        : "-"}
                                    </td>
                                  </tr>
                                );
                              },
                            )
                          ) : (
                            <tr>
                              <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                                No results found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {view === "split" && (
                    <div className="flex gap-0">
                      <div className="w-[380px] space-y-0 overflow-y-auto border-r">
                        {results && results.length > 0 ? (
                          (() => {
                            const currentIds = results.map(
                              (r: StudyResult) => r.study_id?.raw,
                            );
                            const selectedId = selectedStudy?.study_id?.raw;
                            if (
                              !selectedStudy ||
                              !currentIds.includes(selectedId)
                            ) {
                              setTimeout(() => {
                                setSelectedStudy(results[0] as StudyResult);
                              }, 0);
                            }
                            return results.map(
                              (result: StudyResult, index: number) => {
                                const isSelected =
                                  selectedStudy?.study_id?.raw ===
                                  result.study_id?.raw;
                                const studyId = result.study_id?.raw;
                                return (
                                  <Link
                                    key={studyId || index}
                                    href={`${basePath}/${studyId}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedStudy(
                                        result as StudyResult,
                                      );
                                    }}
                                    className={`hover:bg-accent block cursor-pointer border-b p-3 transition-colors dark:hover:bg-slate-700 ${
                                      isSelected
                                        ? "bg-accent dark:bg-slate-700"
                                        : ""
                                    }`}
                                  >
                                    <div className="mb-1 flex items-start gap-2">
                                      <Layers
                                        className="mt-0.5 h-4 w-4 shrink-0"
                                        style={{ color: entityColor }}
                                      />
                                      <h4 className="line-clamp-1 text-sm font-semibold">
                                        {truncateName(result.name?.raw || "Untitled")}
                                      </h4>
                                    </div>
                                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                                      {Number(result.datasets_included?.raw || 0) > 0 && (
                                        <span className="flex items-center gap-1" title="datasets">
                                          <Database className="h-3 w-3" style={{ color: entityColors.data }} />
                                          {Number(result.datasets_included?.raw || 0).toLocaleString()}
                                        </span>
                                      )}
                                      {Number(result.tasks_included?.raw || 0) > 0 && (
                                        <span className="flex items-center gap-1" title="tasks">
                                          <Flag className="h-3 w-3" style={{ color: entityColors.task }} />
                                          {Number(result.tasks_included?.raw || 0).toLocaleString()}
                                        </span>
                                      )}
                                      {Number(result.runs_included?.raw || 0) > 0 && (
                                        <span className="flex items-center gap-1" title="runs">
                                          <FlaskConical className="h-3 w-3" style={{ color: entityColors.run }} />
                                          {Number(result.runs_included?.raw || 0).toLocaleString()}
                                        </span>
                                      )}
                                    </div>
                                  </Link>
                                );
                              },
                            );
                          })()
                        ) : (
                          <div className="text-muted-foreground p-8 text-center">
                            No results found
                          </div>
                        )}
                      </div>
                      {/* Detail panel */}
                      <div className="flex-1 overflow-y-auto p-6">
                        {selectedStudy ? (
                          <div>
                            <div className="mb-4 flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <Layers
                                  className="h-6 w-6"
                                  style={{ color: entityColor }}
                                />
                                <h2 className="text-xl font-bold">
                                  {truncateName(selectedStudy.name?.raw || "Untitled")}
                                </h2>
                              </div>
                              <Badge
                                variant="openml"
                                className="flex items-center gap-0.5 px-2 py-0.5 text-xs font-semibold text-white"
                                style={{ backgroundColor: entityColor }}
                              >
                                <Hash className="h-3 w-3" />
                                {selectedStudy.study_id?.raw}
                              </Badge>
                            </div>
                            {selectedStudy.description?.raw && (
                              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                                {selectedStudy.description.raw}
                              </p>
                            )}
                            <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                              {Number(selectedStudy.datasets_included?.raw || 0) > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <Database className="h-4 w-4" style={{ color: entityColors.data }} />
                                  {Number(selectedStudy.datasets_included?.raw || 0).toLocaleString()} datasets
                                </span>
                              )}
                              {Number(selectedStudy.tasks_included?.raw || 0) > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <Flag className="h-4 w-4" style={{ color: entityColors.task }} />
                                  {Number(selectedStudy.tasks_included?.raw || 0).toLocaleString()} tasks
                                </span>
                              )}
                              {Number(selectedStudy.flows_included?.raw || 0) > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <Cog className="h-4 w-4" style={{ color: entityColors.flow }} />
                                  {Number(selectedStudy.flows_included?.raw || 0).toLocaleString()} flows
                                </span>
                              )}
                              {Number(selectedStudy.runs_included?.raw || 0) > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <FlaskConical className="h-4 w-4" style={{ color: entityColors.run }} />
                                  {Number(selectedStudy.runs_included?.raw || 0).toLocaleString()} runs
                                </span>
                              )}
                            </div>
                            {selectedStudy.uploader?.raw && (
                              <p className="text-muted-foreground mb-2 text-sm">
                                <User className="mr-1 inline h-4 w-4" />
                                {selectedStudy.uploader.raw}
                              </p>
                            )}
                            {selectedStudy.date?.raw && (
                              <p className="text-muted-foreground mb-4 text-sm">
                                <Calendar className="mr-1 inline h-4 w-4" />
                                {new Date(selectedStudy.date.raw).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            )}
                            <Link
                              href={`${basePath}/${selectedStudy.study_id?.raw}`}
                              className="text-primary mt-2 inline-flex items-center gap-1 text-sm hover:underline"
                            >
                              View full details
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        ) : (
                          <div className="text-muted-foreground flex h-full items-center justify-center">
                            Select an item to view details
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </WithSearch>
          </div>

          {/* Pagination matching datasets pattern */}
          <WithSearch
            mapContextToProps={({ resultsPerPage }) => ({ resultsPerPage })}
          >
            {({ resultsPerPage }) => {
              const MAX_RESULT_WINDOW = 10000;
              const pageSize = resultsPerPage || 20;
              const MAX_ACCESSIBLE_PAGE = Math.floor(
                MAX_RESULT_WINDOW / pageSize,
              );

              return (
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
                                    ? { backgroundColor: entityColor }
                                    : undefined
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
                      );
                    }}
                  />
                </div>
              );
            }}
          </WithSearch>
        </div>
      )}
    </WithSearch>
  );
}
