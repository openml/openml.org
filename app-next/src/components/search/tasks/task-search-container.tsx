"use client";

import { useState } from "react";
import Link from "next/link";
import { WithSearch, Paging } from "@elastic/react-search-ui";
import { FilterBar } from "../shared/filter-bar";
import { ControlsBar, taskSortOptions } from "../shared/controls-bar";
import { Badge } from "@/components/ui/badge";
import { entityColors } from "@/constants/entityColors";
import {
  FlaskConical,
  Heart,
  CloudDownload,
  Hash,
  Trophy,
  Database,
} from "lucide-react";

interface TaskSearchResult {
  id?: { raw: string | number };
  task_id?: { raw: string | number };
  "source_data.name"?: { raw: string };
  "source_data.data_id"?: { raw: number };
  "tasktype.name"?: { raw: string };
  "estimation_procedure.type"?: { raw: string };
  target_feature?: { raw: string };
  evaluation_measures?: { raw: string[] };
  runs?: { raw: number };
  nr_of_likes?: { raw: number };
  nr_of_downloads?: { raw: number };
  [key: string]: unknown;
}

// Facet configuration for tasks
const taskFacets = [
  { label: "Task Type", field: "tasktype.name.keyword" },
  { label: "Estimation", field: "estimation_procedure.type.keyword" },
  { label: "Target", field: "target_feature.keyword" },
];

export function TaskSearchContainer() {
  const [view, setView] = useState("list");
  const [selectedTask, setSelectedTask] = useState<TaskSearchResult | null>(
    null,
  );

  return (
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

          <FilterBar facets={taskFacets} />
          <ControlsBar
            view={view}
            onViewChange={setView}
            sortOptions={taskSortOptions}
          />

          <div className="p-4">
            <WithSearch mapContextToProps={({ results }) => ({ results })}>
              {({ results }) => {
                const taskResults = (results || []) as TaskSearchResult[];
                return (
                  <>
                    {view === "table" && (
                      <TaskResultsTable results={taskResults} />
                    )}
                    {view === "list" && <TaskListView results={taskResults} />}
                    {view === "grid" && <TaskGridView results={taskResults} />}
                    {view === "split" && (
                      <TaskSplitView
                        results={taskResults}
                        selectedTask={selectedTask}
                        onSelectTask={setSelectedTask}
                      />
                    )}
                  </>
                );
              }}
            </WithSearch>
          </div>

          {/* Pagination */}
          <WithSearch
            mapContextToProps={({ resultsPerPage }) => ({ resultsPerPage })}
          >
            {({ resultsPerPage }) => {
              // Elasticsearch default max result window is 10,000
              const MAX_RESULT_WINDOW = 10000;
              const pageSize = resultsPerPage || 20;
              const MAX_ACCESSIBLE_PAGE = Math.floor(
                MAX_RESULT_WINDOW / pageSize,
              );
              const SHOW_WARNING_FROM = Math.max(1, MAX_ACCESSIBLE_PAGE - 1);

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
                      const isCurrentBeyondLimit =
                        current > MAX_ACCESSIBLE_PAGE;

                      return (
                        <div className="flex flex-col items-center gap-3">
                          {current >= SHOW_WARNING_FROM && (
                            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                              ⚠️ Elasticsearch limit: Only{" "}
                              {MAX_ACCESSIBLE_PAGE.toLocaleString()} pages (
                              {MAX_RESULT_WINDOW.toLocaleString()} results) can
                              be accessed.{" "}
                              {isCurrentBeyondLimit
                                ? `Page ${current} is not accessible.`
                                : `Showing page ${current.toLocaleString()} of ${totalPages.toLocaleString()} total pages.`}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onChange(current - 1)}
                              disabled={current === 1}
                              className="hover:bg-muted rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
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
                                  onClick={() => isAccessible && onChange(page)}
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
                                      ? { backgroundColor: entityColors.task }
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
        </div>
      )}
    </WithSearch>
  );
}

// Task List View
function TaskListView({ results }: { results: TaskSearchResult[] }) {
  if (!results || results.length === 0) {
    return (
      <div className="text-muted-foreground p-8 text-center">
        No tasks found
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {results.map((result, index) => {
        const tid = result.task_id?.raw || result.id?.raw;
        const datasetName =
          result["source_data.name"]?.raw || "Unknown Dataset";
        const taskType = result["tasktype.name"]?.raw || "Unknown Task Type";
        const estimation = result["estimation_procedure.type"]?.raw;

        return (
          <div
            key={tid || index}
            className="hover:bg-accent relative flex items-start justify-between border-b p-4 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-start gap-3">
                <Trophy
                  className="mt-1 h-5 w-5 shrink-0"
                  style={{ color: "#FFA726" }}
                  aria-hidden="true"
                />
                <div className="flex items-baseline gap-2">
                  <h3 className="text-base font-semibold">{taskType}</h3>
                  <span className="text-muted-foreground text-xs">
                    on {datasetName}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground mb-2 text-sm">
                {estimation && <span>Estimation: {estimation}</span>}
                {result.target_feature?.raw && (
                  <span className="ml-3">
                    Target: {result.target_feature.raw}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span className="flex items-center gap-1.5" title="runs">
                  <FlaskConical className="h-4 w-4 fill-red-500 text-red-500" />
                  {result.runs?.raw?.toLocaleString() || 0}
                </span>
                <span className="flex items-center gap-1.5" title="likes">
                  <Heart className="h-4 w-4 fill-purple-500 text-purple-500" />
                  {result.nr_of_likes?.raw || 0}
                </span>
                <span className="flex items-center gap-1.5" title="downloads">
                  <CloudDownload className="h-4 w-4 text-blue-500" />
                  {result.nr_of_downloads?.raw || 0}
                </span>
                {result["source_data.data_id"]?.raw && (
                  <span
                    className="flex items-center gap-1.5"
                    title="source dataset"
                  >
                    <Database className="h-4 w-4 text-green-500" />
                    Dataset #{result["source_data.data_id"].raw}
                  </span>
                )}
              </div>
            </div>
            <Badge
              variant="openml"
              className="relative z-10 flex items-center gap-0.75 bg-[#FFA726] px-2 py-0.5 text-xs font-semibold text-white"
              title="task ID"
            >
              <Hash className="h-3 w-3" />
              {tid}
            </Badge>

            {/* Invisible overlay link for entire row clickability */}
            <Link
              href={`/tasks/${tid}`}
              className="absolute inset-0"
              aria-label={`View task ${tid}`}
            >
              <span className="sr-only">View task {tid}</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

// Task Grid View
function TaskGridView({ results }: { results: TaskSearchResult[] }) {
  if (!results || results.length === 0) {
    return (
      <div className="text-muted-foreground col-span-full p-8 text-center">
        No tasks found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {results.map((result, index) => {
        const tid = result.task_id?.raw || result.id?.raw;
        const datasetName =
          result["source_data.name"]?.raw || "Unknown Dataset";
        const taskType = result["tasktype.name"]?.raw || "Unknown Task Type";

        return (
          <Link
            key={tid || index}
            href={`/tasks/${tid}`}
            className="bg-card hover:bg-accent block rounded-lg border p-4 transition-colors"
          >
            <div className="mb-2 flex items-start justify-between">
              <Trophy className="h-8 w-8" style={{ color: "#FFA726" }} />
              <Badge
                variant="openml"
                className="bg-[#FFA726] text-xs text-white"
              >
                #{tid}
              </Badge>
            </div>
            <h3 className="mb-1 line-clamp-1 font-semibold">{taskType}</h3>
            <p className="text-muted-foreground mb-3 text-sm">
              on {datasetName}
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-1">
                <FlaskConical className="h-3 w-3 fill-red-500 text-red-500" />
                {result.runs?.raw?.toLocaleString() || 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3 fill-purple-500 text-purple-500" />
                {result.nr_of_likes?.raw?.toLocaleString() || 0}
              </span>
              <span className="flex items-center gap-1">
                <CloudDownload className="h-3 w-3 text-blue-500" />
                {result.nr_of_downloads?.raw?.toLocaleString() || 0}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// Task Results Table
function TaskResultsTable({ results }: { results: TaskSearchResult[] }) {
  if (!results || results.length === 0) {
    return (
      <div className="text-muted-foreground p-8 text-center">
        No tasks found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left text-sm font-medium">ID</th>
            <th className="p-3 text-left text-sm font-medium">Task Type</th>
            <th className="p-3 text-left text-sm font-medium">Dataset</th>
            <th className="p-3 text-left text-sm font-medium">Target</th>
            <th className="p-3 text-right text-sm font-medium">Runs</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => {
            const tid = result.task_id?.raw || result.id?.raw;
            return (
              <tr
                key={tid || index}
                className="hover:bg-accent border-b transition-colors"
              >
                <td className="p-3">
                  <Link
                    href={`/tasks/${tid}`}
                    className="text-primary font-medium hover:underline"
                  >
                    {tid}
                  </Link>
                </td>
                <td className="p-3">
                  {result["tasktype.name"]?.raw || "Unknown"}
                </td>
                <td className="p-3">
                  {result["source_data.name"]?.raw || "Unknown"}
                </td>
                <td className="p-3 text-sm">
                  {result.target_feature?.raw || "-"}
                </td>
                <td className="p-3 text-right">
                  {result.runs?.raw?.toLocaleString() || 0}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Task Split View
function TaskSplitView({
  results,
  selectedTask,
  onSelectTask,
}: {
  results: TaskSearchResult[];
  selectedTask: TaskSearchResult | null;
  onSelectTask: (task: TaskSearchResult) => void;
}) {
  if (!results || results.length === 0) {
    return (
      <div className="text-muted-foreground p-8 text-center">
        No tasks found
      </div>
    );
  }

  // Auto-select first task if none selected
  if (!selectedTask && results.length > 0) {
    setTimeout(() => onSelectTask(results[0]), 0);
  }

  const selected = selectedTask || results[0];
  const tid = selected?.task_id?.raw || selected?.id?.raw;

  return (
    <div className="flex gap-0">
      {/* Left: Task list */}
      <div className="w-[380px] space-y-0 overflow-y-auto border-r">
        {results.map((result, index) => {
          const taskId = result.task_id?.raw || result.id?.raw;
          const isSelected = taskId === tid;

          return (
            <button
              key={taskId || index}
              onClick={() => onSelectTask(result)}
              className={`hover:bg-accent block w-full cursor-pointer border-b p-3 text-left transition-colors ${
                isSelected ? "bg-accent" : ""
              }`}
            >
              <div className="mb-1 flex items-start gap-2">
                <Trophy
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: "#FFA726" }}
                />
                <h4 className="line-clamp-1 text-sm font-semibold">
                  {result["tasktype.name"]?.raw || "Unknown Task"}
                </h4>
              </div>
              <p className="text-muted-foreground line-clamp-1 text-xs">
                on {result["source_data.name"]?.raw || "Unknown Dataset"}
              </p>
              <div className="mt-2 flex gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <FlaskConical className="h-3 w-3 fill-red-500 text-red-500" />
                  {result.runs?.raw?.toLocaleString() || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3 fill-purple-500 text-purple-500" />
                  {result.nr_of_likes?.raw?.toLocaleString() || 0}
                </span>
                <span className="flex items-center gap-1">
                  <CloudDownload className="h-3 w-3 text-blue-500" />
                  {result.nr_of_downloads?.raw?.toLocaleString() || 0}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right: Task detail preview */}
      <div className="flex-1 p-6">
        {selected && (
          <div>
            <div className="mb-4 flex items-start gap-3">
              <Trophy className="h-8 w-8" style={{ color: "#FFA726" }} />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">
                    {selected["tasktype.name"]?.raw || "Unknown Task"}
                  </h2>
                  <Badge
                    variant="outline"
                    className="border-[#FFA726] bg-[#FFA726]/5 text-[#FFA726] hover:bg-[#FFA726]/10"
                  >
                    <Hash className="mr-1 h-3 w-3" />
                    {tid}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  on {selected["source_data.name"]?.raw || "Unknown Dataset"}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 fill-red-500 text-red-500" />
                <div>
                  <div className="text-muted-foreground text-xs">Runs</div>
                  <div className="font-semibold">
                    {selected.runs?.raw?.toLocaleString() || 0}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 fill-purple-500 text-purple-500" />
                <div>
                  <div className="text-muted-foreground text-xs">Likes</div>
                  <div className="font-semibold">
                    {selected.nr_of_likes?.raw?.toLocaleString() || 0}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CloudDownload className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-muted-foreground text-xs">Downloads</div>
                  <div className="font-semibold">
                    {selected.nr_of_downloads?.raw?.toLocaleString() || 0}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" style={{ color: "#66BB6A" }} />
                <div>
                  <div className="text-muted-foreground text-xs">Dataset</div>
                  <div className="font-semibold">
                    {selected["source_data.data_id"]?.raw || "-"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-gray-200 text-xs font-semibold text-gray-600">
                  T
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Target</div>
                  <div className="line-clamp-1 font-semibold">
                    {selected.target_feature?.raw || "-"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-gray-200 text-xs font-semibold text-gray-600">
                  E
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">
                    Estimation
                  </div>
                  <div className="line-clamp-1 font-semibold">
                    {selected["estimation_procedure.type"]?.raw || "-"}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={`/tasks/${tid}`}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
            >
              View Full Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
