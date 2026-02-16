"use client";

import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { WithSearch, Paging, SearchContext } from "@elastic/react-search-ui";
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
  Target,
  Gauge,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface TaskSearchResult {
  id?: { raw: string | number };
  task_id?: { raw: string | number };
  // Nested objects from ES - connector wraps whole object in { raw: ... }
  source_data?: { raw?: { name?: string; data_id?: number } };
  tasktype?: { raw?: { name?: string } };
  estimation_procedure?: { raw?: { type?: string; name?: string } };
  // Direct fields
  task_type?: { raw: string };
  target_feature?: { raw: string };
  evaluation_measures?: { raw: string[] };
  runs?: { raw: number };
  nr_of_likes?: { raw: number };
  nr_of_downloads?: { raw: number };
  date?: { raw: string };
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
      {({ isLoading, error, searchTerm, totalResults }) => (
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
                <span className="font-semibold">
                  &ldquo;{searchTerm}&rdquo;
                </span>
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
        const datasetName = result.source_data?.raw?.name || "Unknown Dataset";
        const datasetId = result.source_data?.raw?.data_id;
        const taskType =
          result.tasktype?.raw?.name ||
          result.task_type?.raw ||
          "Unknown Task Type";
        const estimation = result.estimation_procedure?.raw?.type;
        const targetFeature = result.target_feature?.raw;
        const runs = result.runs?.raw || 0;
        const likes = result.nr_of_likes?.raw || 0;
        const downloads = result.nr_of_downloads?.raw || 0;

        return (
          <div
            key={tid || index}
            className="group relative flex items-start justify-between border-b p-4 transition-colors hover:bg-orange-50/50 dark:hover:bg-orange-900/20"
          >
            <div className="min-w-0 flex-1">
              {/* Title row */}
              <div className="mb-2 flex items-start gap-3">
                <Trophy
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: "#FFA726" }}
                  aria-hidden="true"
                />
                <div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-base font-semibold">{taskType}</h3>
                    <span className="text-muted-foreground text-sm">on</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {datasetName}
                    </span>
                  </div>
                  {/* Task details row */}
                  <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    {targetFeature && (
                      <span
                        className="flex items-center gap-1.5"
                        title="Target feature"
                      >
                        <Target className="h-3.5 w-3.5 text-orange-500" />
                        <span className="font-mono text-xs">
                          {targetFeature}
                        </span>
                      </span>
                    )}
                    {estimation && (
                      <span
                        className="flex items-center gap-1.5"
                        title="Estimation procedure"
                      >
                        <Gauge className="h-3.5 w-3.5 text-blue-500" />
                        {estimation}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="ml-8 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span className="flex items-center gap-1.5" title="Runs">
                  <FlaskConical className="h-4 w-4 fill-red-500 text-red-500" />
                  <span className="font-medium">{runs.toLocaleString()}</span>
                  <span className="text-muted-foreground text-xs">runs</span>
                </span>
                <span className="flex items-center gap-1.5" title="Likes">
                  <Heart className="h-4 w-4 fill-purple-500 text-purple-500" />
                  {likes.toLocaleString()}
                </span>
                <span className="flex items-center gap-1.5" title="Downloads">
                  <CloudDownload className="h-4 w-4 text-blue-500" />
                  {downloads.toLocaleString()}
                </span>
                {datasetId && (
                  <span
                    className="flex items-center gap-1.5"
                    title="Source dataset"
                  >
                    <Database className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Dataset</span>
                    <span className="font-medium">#{datasetId}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Right side: ID badge and arrow */}
            <div className="flex items-center gap-2">
              <Badge
                variant="openml"
                className="relative z-10 flex items-center gap-0.75 bg-[#FFA726] px-2 py-0.5 text-xs font-semibold text-white"
                title="Task ID"
              >
                <Hash className="h-3 w-3" />
                {tid}
              </Badge>
              <ChevronRight className="text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

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
        const datasetName = result.source_data?.raw?.name || "Unknown Dataset";
        const taskType =
          result.tasktype?.raw?.name ||
          result.task_type?.raw ||
          "Unknown Task Type";
        const estimation = result.estimation_procedure?.raw?.type;
        const targetFeature = result.target_feature?.raw;
        const runs = result.runs?.raw || 0;
        const likes = result.nr_of_likes?.raw || 0;
        const downloads = result.nr_of_downloads?.raw || 0;

        return (
          <Link
            key={tid || index}
            href={`/tasks/${tid}`}
            className="bg-card group block rounded-lg border p-4 transition-colors hover:border-orange-200 hover:bg-orange-50/50 dark:hover:border-orange-800 dark:hover:bg-orange-900/10"
          >
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
              <Trophy className="h-7 w-7" style={{ color: "#FFA726" }} />
              <Badge
                variant="openml"
                className="bg-[#FFA726] text-xs text-white"
              >
                #{tid}
              </Badge>
            </div>

            {/* Task Type */}
            <h3 className="mb-1 line-clamp-1 font-semibold">{taskType}</h3>

            {/* Dataset */}
            <p className="text-muted-foreground mb-2 flex items-center gap-1.5 text-sm">
              <Database className="h-3.5 w-3.5 text-green-500" />
              <span className="line-clamp-1">{datasetName}</span>
            </p>

            {/* Target & Estimation */}
            <div className="mb-3 space-y-1 text-xs">
              {targetFeature && (
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <Target className="h-3 w-3 text-orange-500" />
                  <span className="line-clamp-1 font-mono">
                    {targetFeature}
                  </span>
                </div>
              )}
              {estimation && (
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <Gauge className="h-3 w-3 text-blue-500" />
                  <span className="line-clamp-1">{estimation}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 border-t pt-3 text-xs">
              <span className="flex items-center gap-1" title="Runs">
                <FlaskConical className="h-3 w-3 fill-red-500 text-red-500" />
                <span className="font-medium">{runs.toLocaleString()}</span>
              </span>
              <span className="flex items-center gap-1" title="Likes">
                <Heart className="h-3 w-3 fill-purple-500 text-purple-500" />
                {likes.toLocaleString()}
              </span>
              <span className="flex items-center gap-1" title="Downloads">
                <CloudDownload className="h-3 w-3 text-blue-500" />
                {downloads.toLocaleString()}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// Task table columns configuration
const taskTableColumns = [
  { field: "task_id", label: "ID", width: "w-20", sortable: true },
  {
    field: "tasktype.name",
    label: "Task Type",
    width: "w-40",
    sortable: false,
  },
  {
    field: "source_data.name",
    label: "Dataset",
    width: "w-40",
    sortable: false,
  },
  { field: "target_feature", label: "Target", width: "w-32", sortable: false },
  {
    field: "estimation_procedure.type",
    label: "Estimation",
    width: "w-40",
    sortable: false,
  },
  {
    field: "runs",
    label: "Runs",
    width: "w-24",
    sortable: true,
    align: "right",
  },
  {
    field: "nr_of_likes",
    label: "Likes",
    width: "w-24",
    sortable: true,
    align: "right",
  },
  {
    field: "nr_of_downloads",
    label: "Downloads",
    width: "w-28",
    sortable: true,
    align: "right",
  },
];

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
    <WithSearch
      mapContextToProps={({ sortList, setSort }) => ({ sortList, setSort })}
    >
      {(props) => {
        const sortList = props.sortList as
          | Array<{ field: string; direction: string }>
          | undefined;
        const setSort = props.setSort as
          | ((
              sort: Array<{ field: string; direction: string }>,
              dir: string,
            ) => void)
          | undefined;

        const currentSort =
          sortList && sortList.length > 0 ? sortList[0] : null;

        const handleSort = (field: string, sortable: boolean) => {
          if (!sortable || !setSort) return;
          if (currentSort?.field === field) {
            const newDirection =
              currentSort.direction === "asc" ? "desc" : "asc";
            setSort([{ field, direction: newDirection }], newDirection);
          } else {
            setSort([{ field, direction: "desc" }], "desc");
          }
        };

        const getSortIcon = (field: string, sortable: boolean) => {
          if (!sortable) return null;
          if (currentSort?.field !== field) {
            return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
          }
          return currentSort.direction === "asc" ? (
            <ArrowUp className="ml-1 h-3 w-3" />
          ) : (
            <ArrowDown className="ml-1 h-3 w-3" />
          );
        };

        return (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b">
                  {taskTableColumns.map((column) => (
                    <th
                      key={column.field}
                      className={`p-3 ${column.align === "right" ? "text-right" : "text-left"} text-sm font-medium ${column.sortable ? "hover:bg-muted/70 cursor-pointer" : ""} select-none`}
                      onClick={() => handleSort(column.field, column.sortable)}
                    >
                      <div
                        className={`flex items-center ${column.align === "right" ? "justify-end" : ""}`}
                      >
                        {column.label}
                        {getSortIcon(column.field, column.sortable)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => {
                  const tid = result.task_id?.raw || result.id?.raw;
                  const datasetId = result.source_data?.raw?.data_id;
                  const datasetName =
                    result.source_data?.raw?.name || "Unknown";
                  const taskType =
                    result.tasktype?.raw?.name ||
                    result.task_type?.raw ||
                    "Unknown";
                  const estimation =
                    result.estimation_procedure?.raw?.type || "-";
                  return (
                    <tr
                      key={tid || index}
                      className="border-b transition-colors hover:bg-orange-50/50 dark:hover:bg-orange-900/10"
                    >
                      <td className="p-3">
                        <Link
                          href={`/tasks/${tid}`}
                          className="inline-flex items-center gap-1.5 font-medium text-[#FFA726] hover:text-[#a8690a]"
                        >
                          <Trophy
                            className="h-4 w-4"
                            style={{ color: "#FFA726" }}
                          />
                          {tid}
                        </Link>
                      </td>
                      <td className="p-3 font-medium">{taskType}</td>
                      <td className="p-3">
                        <Link
                          href={`/datasets/${datasetId}`}
                          className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Database className="h-3.5 w-3.5" />
                          {datasetName}
                        </Link>
                      </td>
                      <td className="p-3">
                        <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                          {result.target_feature?.raw || "-"}
                        </code>
                      </td>
                      <td className="text-muted-foreground p-3 text-sm">
                        {estimation}
                      </td>
                      <td className="p-3 text-right">
                        <span className="inline-flex items-center gap-1">
                          <FlaskConical className="h-3 w-3 fill-red-500 text-red-500" />
                          {result.runs?.raw?.toLocaleString() || 0}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="inline-flex items-center gap-1">
                          <Heart className="h-3 w-3 fill-purple-500 text-purple-500" />
                          {result.nr_of_likes?.raw?.toLocaleString() || 0}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="inline-flex items-center gap-1">
                          <CloudDownload className="h-3 w-3 text-blue-500" />
                          {result.nr_of_downloads?.raw?.toLocaleString() || 0}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }}
    </WithSearch>
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
                  {result.tasktype?.raw?.name ||
                    result.task_type?.raw ||
                    "Unknown Task"}
                </h4>
              </div>
              <p className="text-muted-foreground line-clamp-1 text-xs">
                on {result.source_data?.raw?.name || "Unknown Dataset"}
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
                    {selected.tasktype?.raw?.name ||
                      selected.task_type?.raw ||
                      "Unknown Task"}
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
                  on {selected.source_data?.raw?.name || "Unknown Dataset"}
                </p>
              </div>
            </div>

            {/* Task Definition */}
            <div className="bg-muted/30 mb-6 rounded-lg border p-4">
              <h3 className="mb-3 text-sm font-medium">Task Definition</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Target className="mt-0.5 h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-muted-foreground text-xs">
                      Target Feature
                    </div>
                    <div className="font-mono text-sm font-medium">
                      {selected.target_feature?.raw || "-"}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Gauge className="mt-0.5 h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-muted-foreground text-xs">
                      Estimation Procedure
                    </div>
                    <div className="font-medium">
                      {selected.estimation_procedure?.raw?.type || "-"}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Database className="mt-0.5 h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-muted-foreground text-xs">
                      Source Dataset
                    </div>
                    <Link
                      href={`/datasets/${selected.source_data?.raw?.data_id}`}
                      className="font-medium text-green-600 hover:underline"
                    >
                      {selected.source_data?.raw?.name} (#
                      {selected.source_data?.raw?.data_id})
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg border p-3 text-center">
                <FlaskConical className="mx-auto mb-1 h-5 w-5 fill-red-500 text-red-500" />
                <div className="text-lg font-bold">
                  {selected.runs?.raw?.toLocaleString() || 0}
                </div>
                <div className="text-muted-foreground text-xs">Runs</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <Heart className="mx-auto mb-1 h-5 w-5 fill-purple-500 text-purple-500" />
                <div className="text-lg font-bold">
                  {selected.nr_of_likes?.raw?.toLocaleString() || 0}
                </div>
                <div className="text-muted-foreground text-xs">Likes</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <CloudDownload className="mx-auto mb-1 h-5 w-5 text-blue-500" />
                <div className="text-lg font-bold">
                  {selected.nr_of_downloads?.raw?.toLocaleString() || 0}
                </div>
                <div className="text-muted-foreground text-xs">Downloads</div>
              </div>
            </div>

            <Link
              href={`/tasks/${tid}`}
              className="inline-flex items-center gap-2 rounded-md bg-[#FFA726] px-4 py-2 text-sm font-medium text-white transition-colors hover:border hover:border-[#FFA726] hover:bg-white hover:text-[#FFA726]"
            >
              View Full Details
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
