"use client";

import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { WithSearch, Paging, SearchContext } from "@elastic/react-search-ui";
import { FilterBar } from "../shared/filter-bar";
import { ControlsBar, runSortOptions } from "../shared/controls-bar";
import { Badge } from "@/components/ui/badge";
import { entityColors } from "@/constants/entityColors";
import { truncateName } from "@/lib/utils";
import {
  FlaskConical,
  Calendar,
  User,
  Hash,
  Database,
  Cog,
  Trophy,
  XCircle,
  Heart,
  CloudDownload,
  MessageCircle,
  ThumbsDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface Evaluation {
  evaluation_measure: string;
  value: number;
  [key: string]: unknown;
}

// Nested object types from ES
interface RunFlow {
  flow_id?: string | number;
  name?: string;
}

interface RunTaskSourceData {
  data_id?: string | number;
  name?: string;
}

interface RunTaskType {
  name?: string;
}

interface RunTask {
  task_id?: string | number;
  tasktype?: RunTaskType;
  source_data?: RunTaskSourceData;
}

interface RunResult {
  run_id?: { raw: string | number };
  uploader?: { raw: string };
  uploader_id?: { raw: string | number };
  date?: { raw: string };
  error_message?: { raw: string };
  error?: { raw: string };
  // Flat fields (some ES responses)
  flow_id?: { raw: string | number };
  flow_name?: { raw: string };
  task_id?: { raw: string | number };
  // Nested objects from ES (wrapped in raw)
  run_flow?: { raw: RunFlow };
  run_task?: { raw: RunTask };
  // Dot-notation fields (Search UI sometimes flattens)
  "run_flow.flow_id"?: { raw: string | number };
  "run_flow.name"?: { raw: string };
  "run_task.task_id"?: { raw: string | number };
  "run_task.tasktype.name"?: { raw: string };
  "run_task.source_data.data_id"?: { raw: string | number };
  "run_task.source_data.name"?: { raw: string };
  evaluations?: { raw: Evaluation[] };
  nr_of_likes?: { raw: number };
  nr_of_downloads?: { raw: number };
  nr_of_issues?: { raw: number };
  nr_of_downvotes?: { raw: number };
  [key: string]: unknown;
}

// Facets matching the old app - Dataset, Task Type, Flow, Uploader
const searchFacets: { label: string; field: string }[] = [
  { label: "Dataset", field: "run_task.source_data.name.keyword" },
  { label: "Task Type", field: "run_task.tasktype.name.keyword" },
  { label: "Flow", field: "run_flow.name.keyword" },
  { label: "Uploader", field: "uploader.keyword" },
];

// Cache for flow and dataset names to avoid repeated API calls
const flowNameCache = new Map<number, string>();
const datasetNameCache = new Map<number, string>();

// Helper function to fetch flow name from API (like detail page does)
async function fetchFlowName(flowId: number): Promise<string> {
  if (flowNameCache.has(flowId)) {
    return flowNameCache.get(flowId)!;
  }

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_URL_API || "https://www.openml.org/api/v1";
    const response = await fetch(`${apiUrl}/json/flow/${flowId}`, {
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      const name = data?.flow?.name || `Flow #${flowId}`;
      flowNameCache.set(flowId, name);
      return name;
    }
  } catch (error) {
    console.error(`Failed to fetch flow ${flowId}:`, error);
  }

  return `Flow #${flowId}`;
}

// Helper function to fetch dataset name from API
async function fetchDatasetName(dataId: number): Promise<string> {
  if (datasetNameCache.has(dataId)) {
    return datasetNameCache.get(dataId)!;
  }

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_URL_API || "https://www.openml.org/api/v1";
    const response = await fetch(`${apiUrl}/json/data/${dataId}`, {
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      const name = data?.data_set_description?.name || `Dataset #${dataId}`;
      datasetNameCache.set(dataId, name);
      return name;
    }
  } catch (error) {
    console.error(`Failed to fetch dataset ${dataId}:`, error);
  }

  return `Dataset #${dataId}`;
}

// Enhanced result type with fetched names
interface EnhancedRunResult extends RunResult {
  _flowName?: string;
  _datasetName?: string;
  _loading?: boolean;
}

// Helper functions to safely extract values with fallbacks
// Handles both nested ES objects and flattened dot-notation fields
function getFlowName(result: RunResult): string {
  // Try nested object first
  const nestedName = result.run_flow?.raw?.name;
  if (nestedName) return nestedName;

  // Try dot-notation flattened field
  const flatName = result["run_flow.name"]?.raw;
  if (flatName) return flatName;

  // Try direct field
  if (result.flow_name?.raw) return result.flow_name.raw;

  // Fall back to flow ID
  const flowId = getFlowId(result);
  return flowId ? `Flow #${flowId}` : "Unknown Flow";
}

function getFlowId(result: RunResult): string | number | undefined {
  // Try nested object first
  const nestedId = result.run_flow?.raw?.flow_id;
  if (nestedId) return nestedId;

  // Try dot-notation flattened field
  const flatId = result["run_flow.flow_id"]?.raw;
  if (flatId) return flatId;

  // Try direct field
  return result.flow_id?.raw;
}

function getDatasetName(result: RunResult): string {
  // Try nested object first
  const nestedName = result.run_task?.raw?.source_data?.name;
  if (nestedName) return nestedName;

  // Try dot-notation flattened field
  const flatName = result["run_task.source_data.name"]?.raw;
  if (flatName) return flatName;

  // Fall back to dataset ID
  const dataId = getDatasetId(result);
  return dataId ? `Dataset #${dataId}` : "Unknown Dataset";
}

function getDatasetId(result: RunResult): string | number | undefined {
  // Try nested object first
  const nestedId = result.run_task?.raw?.source_data?.data_id;
  if (nestedId) return nestedId;

  // Try dot-notation flattened field
  return result["run_task.source_data.data_id"]?.raw;
}

function getTaskId(result: RunResult): string | number | undefined {
  // Try nested object first
  const nestedId = result.run_task?.raw?.task_id;
  if (nestedId) return nestedId;

  // Try dot-notation flattened field
  const flatId = result["run_task.task_id"]?.raw;
  if (flatId) return flatId;

  // Try direct field
  return result.task_id?.raw;
}

function getTaskTypeName(result: RunResult): string | undefined {
  // Try nested object first
  const nestedName = result.run_task?.raw?.tasktype?.name;
  if (nestedName) return nestedName;

  // Try dot-notation flattened field
  return result["run_task.tasktype.name"]?.raw;
}

function extractMetrics(
  evaluations: Evaluation[] | undefined,
): { label: string; value: string }[] {
  const metrics: { label: string; value: string }[] = [];
  if (!evaluations || !Array.isArray(evaluations)) return metrics;

  const shortLabels: Record<string, string> = {
    predictive_accuracy: "ACC",
    area_under_roc_curve: "AUC",
    root_mean_squared_error: "RMSE",
    mean_absolute_error: "MAE",
    f_measure: "F1",
    precision: "Precision",
    recall: "Recall",
    kappa: "Kappa",
  };

  evaluations.slice(0, 3).forEach((evalItem) => {
    const measure = evalItem.evaluation_measure;
    const value = evalItem.value;
    if (measure && value !== undefined) {
      const label = shortLabels[measure] || measure;
      metrics.push({ label, value: value.toFixed(4) });
    }
  });

  return metrics;
}

// Separate component to handle enrichment without infinite loops
function EnrichedRunsView({
  view,
  results,
  selectedRun,
  onSelectRun,
}: {
  view: string;
  results: RunResult[];
  selectedRun: EnhancedRunResult | null;
  onSelectRun: (run: EnhancedRunResult) => void;
}) {
  const [enrichedResults, setEnrichedResults] = useState<EnhancedRunResult[]>(
    [],
  );
  const [lastResultsKey, setLastResultsKey] = useState<string>("");

  useEffect(() => {
    if (!results || results.length === 0) {
      setEnrichedResults([]);
      setLastResultsKey("");
      return;
    }

    // Create a unique key for this result set
    const resultsKey = results.map((r) => r.run_id?.raw).join(",");

    // Don't re-fetch if we already have these results
    if (resultsKey === lastResultsKey) {
      return;
    }

    setLastResultsKey(resultsKey);

    // Set initial results immediately (with IDs as fallback)
    const initialEnriched: EnhancedRunResult[] = results.map((r) => ({ ...r }));
    setEnrichedResults(initialEnriched);

    // Fetch names in background
    Promise.all(
      results.map(async (result) => {
        const flowId = result["run_flow.flow_id"]?.raw || result.flow_id?.raw;
        const dataId = result["run_task.source_data.data_id"]?.raw;

        // Check cache first before fetching
        const [flowName, datasetName] = await Promise.all([
          flowId ? fetchFlowName(Number(flowId)) : Promise.resolve(undefined),
          dataId
            ? fetchDatasetName(Number(dataId))
            : Promise.resolve(undefined),
        ]);

        return { flowName, datasetName };
      }),
    )
      .then((enrichments) => {
        setEnrichedResults(
          results.map((run, index) => ({
            ...run,
            _flowName: enrichments[index].flowName,
            _datasetName: enrichments[index].datasetName,
          })),
        );
      })
      .catch((error) => {
        console.error("Failed to enrich runs:", error);
      });
  }, [results, lastResultsKey]); // Depend on results and lastResultsKey

  return (
    <>
      {view === "list" && <RunListView results={enrichedResults} />}
      {view === "grid" && <RunGridView results={enrichedResults} />}
      {view === "table" && <RunTableView results={enrichedResults} />}
      {view === "split" && (
        <RunSplitView
          results={enrichedResults}
          selectedRun={selectedRun}
          onSelectRun={onSelectRun}
        />
      )}
    </>
  );
}

export function RunsSearchContainer() {
  const [view, setView] = useState("list");
  const [selectedRun, setSelectedRun] = useState<EnhancedRunResult | null>(
    null,
  );
  const searchParams = useSearchParams();
  const context = useContext(SearchContext);
  const driver = context?.driver;
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (!driver) return;
    const currentTerm = driver.getState().searchTerm || "";
    if (currentTerm === query) return;
    driver.getActions().setSearchTerm(query, { shouldClearFilters: false });
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
          <ControlsBar
            view={view}
            onViewChange={setView}
            sortOptions={runSortOptions}
          />

          <div className="p-4">
            <WithSearch mapContextToProps={({ results }) => ({ results })}>
              {({ results }) => (
                <EnrichedRunsView
                  view={view}
                  results={(results || []) as RunResult[]}
                  selectedRun={selectedRun}
                  onSelectRun={setSelectedRun}
                />
              )}
            </WithSearch>
          </div>

          <WithSearch
            mapContextToProps={({ resultsPerPage, totalResults }) => ({
              resultsPerPage,
              totalResults,
            })}
          >
            {({ resultsPerPage, totalResults }) => {
              if (!totalResults || totalResults === 0) return null;
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
                                        ? { backgroundColor: entityColors.run }
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

function RunListView({ results }: { results: EnhancedRunResult[] }) {
  if (!results || results.length === 0)
    return (
      <div className="text-muted-foreground p-8 text-center">No runs found</div>
    );

  return (
    <div className="space-y-0">
      {results.map((result, index) => {
        const runId = result.run_id?.raw;
        const hasError = !!(result.error_message?.raw || result.error?.raw);

        // Use helper functions to extract data from ES response
        const flowId = getFlowId(result);
        const flowName = truncateName(result._flowName || getFlowName(result));
        const dataId = getDatasetId(result);
        const datasetName = result._datasetName || getDatasetName(result);
        const taskId = getTaskId(result);
        const taskTypeName = getTaskTypeName(result);

        const metrics = extractMetrics(result.evaluations?.raw);

        // Build display text with task type if available
        const displayText = [
          taskTypeName ? `${taskTypeName}` : null,
          taskId ? `Task #${taskId}` : null,
          datasetName ? `on ${datasetName}` : null,
        ]
          .filter(Boolean)
          .join(" • ");

        return (
          <div
            key={runId || index}
            className="relative flex items-start justify-between border-b p-4 transition-colors hover:bg-red-50 dark:hover:bg-red-900/15"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <FlaskConical className="mt-1 h-5 w-5 shrink-0 fill-red-500 text-red-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold">{flowName}</h3>
                      {hasError && <XCircle className="h-4 w-4 text-red-500" />}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {displayText}
                    </p>
                  </div>
                </div>
                <Badge variant="openml" className="bg-red-500 text-white">
                  <Hash className="h-3 w-3" />
                  {runId}
                </Badge>
              </div>
              {/* Line 3: User, Date, Links, Metrics, Engagement - all in one line */}
              <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 text-xs">
                {result.uploader?.raw && (
                  <Link
                    href={`/users/${result.uploader_id?.raw}`}
                    className="flex items-center gap-1 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <User className="h-3 w-3" />
                    {result.uploader.raw}
                  </Link>
                )}
                {result.date?.raw && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(result.date.raw).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
                {flowId && (
                  <Link
                    href={`/flows/${flowId}`}
                    className="flex items-center gap-1 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Cog className="h-3 w-3 text-[#3b82f6]" />
                    Flow #{flowId}
                  </Link>
                )}
                {dataId && (
                  <Link
                    href={`/datasets/${dataId}`}
                    className="flex items-center gap-1 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Database className="h-3 w-3 text-green-600" />
                    Dataset #{dataId}
                  </Link>
                )}
                {taskId && (
                  <Link
                    href={`/tasks/${taskId}`}
                    className="flex items-center gap-1 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trophy className="h-3 w-3 text-[#FFA726]" />
                    Task #{taskId}
                  </Link>
                )}
                {/* Metrics inline */}
                {metrics.map((metric, idx) => (
                  <span key={idx} className="flex items-center gap-1 font-mono">
                    <span>{metric.label}:</span>
                    <span className="font-semibold">{metric.value}</span>
                  </span>
                ))}
                {/* Engagement inline */}
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3 fill-purple-500 text-purple-500" />
                  {result.nr_of_likes?.raw || 0}
                </span>
                <span className="flex items-center gap-1">
                  <CloudDownload className="h-3 w-3 text-gray-500" />
                  {result.nr_of_downloads?.raw || 0}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3 text-orange-500" />
                  {result.nr_of_issues?.raw || 0}
                </span>
                {result.nr_of_downvotes?.raw &&
                  result.nr_of_downvotes.raw > 0 && (
                    <span className="flex items-center gap-1">
                      <ThumbsDown className="h-3 w-3 text-red-500" />
                      {result.nr_of_downvotes.raw}
                    </span>
                  )}
              </div>
            </div>
            <Link
              href={`/runs/${runId}`}
              className="absolute inset-0"
              aria-label={`View run ${runId}`}
            >
              <span className="sr-only">View run {runId}</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

function RunGridView({ results }: { results: EnhancedRunResult[] }) {
  if (!results || results.length === 0)
    return (
      <div className="text-muted-foreground p-8 text-center">No runs found</div>
    );
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {results.map((result, index) => {
        const runId = result.run_id?.raw;
        const hasError = !!(result.error_message?.raw || result.error?.raw);

        // Use helper functions to extract data from ES response
        const flowId = getFlowId(result);
        const flowName = truncateName(result._flowName || getFlowName(result));
        const dataId = getDatasetId(result);
        const datasetName = result._datasetName || getDatasetName(result);
        const taskId = getTaskId(result);
        const taskTypeName = getTaskTypeName(result);
        const metrics = extractMetrics(result.evaluations?.raw);

        const displayText = [
          taskTypeName ? `${taskTypeName}` : null,
          taskId ? `Task #${taskId}` : null,
          datasetName ? `on ${datasetName}` : null,
        ]
          .filter(Boolean)
          .join(" • ");

        return (
          <Link
            key={runId || index}
            href={`/runs/${runId}`}
            className="bg-card block rounded-lg border p-4 transition-colors hover:bg-red-50 dark:hover:bg-red-900/15"
          >
            <div className="mb-2 flex items-start justify-between">
              <FlaskConical className="h-8 w-8 fill-red-500 text-red-500" />
              <Badge variant="openml" className="bg-red-500 text-white">
                #{runId}
              </Badge>
            </div>
            <h3 className="mb-1 line-clamp-1 font-semibold">
              {flowName || "Unknown Flow"}
            </h3>
            <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
              {displayText}
            </p>
            {metrics.length > 0 && (
              <div className="mb-2 space-y-1">
                {metrics.map((metric, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {metric.label}:
                    </span>
                    <span className="font-mono font-semibold">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {hasError && (
              <div className="mb-2">
                <Badge variant="destructive" className="text-xs">
                  <XCircle className="mr-1 h-3 w-3" />
                  Failed
                </Badge>
              </div>
            )}
            <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-3 text-xs">
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3 fill-purple-500 text-purple-500" />
                {result.nr_of_likes?.raw || 0}
              </span>
              <span className="flex items-center gap-1">
                <CloudDownload className="h-3 w-3" />
                {result.nr_of_downloads?.raw || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {result.nr_of_issues?.raw || 0}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// Run table columns configuration
const runTableColumns = [
  { field: "run_id", label: "ID", width: "w-24", sortable: true },
  { field: "run_flow.name", label: "Flow", width: "w-48", sortable: false },
  { field: "run_task.task_id", label: "Task", width: "w-24", sortable: false },
  {
    field: "run_task.source_data.name",
    label: "Dataset",
    width: "w-40",
    sortable: false,
  },
  { field: "evaluations", label: "Metrics", width: "w-48", sortable: false },
  {
    field: "nr_of_likes",
    label: "Likes",
    width: "w-24",
    sortable: true,
    align: "center",
  },
];

function RunTableView({ results }: { results: EnhancedRunResult[] }) {
  if (!results || results.length === 0)
    return (
      <div className="text-muted-foreground p-8 text-center">No runs found</div>
    );

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
                  {runTableColumns.map((column) => (
                    <th
                      key={column.field}
                      className={`p-3 ${column.align === "center" ? "text-center" : "text-left"} text-sm font-medium ${column.sortable ? "hover:bg-muted/70 cursor-pointer" : ""} select-none`}
                      onClick={() => handleSort(column.field, column.sortable)}
                    >
                      <div
                        className={`flex items-center ${column.align === "center" ? "justify-center" : ""}`}
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
                  const runId = result.run_id?.raw;
                  const hasError = !!(
                    result.error_message?.raw || result.error?.raw
                  );
                  const flowName = truncateName(result._flowName || getFlowName(result));
                  const datasetName =
                    result._datasetName || getDatasetName(result);
                  const taskId = getTaskId(result);
                  const metrics = extractMetrics(result.evaluations?.raw);

                  return (
                    <tr
                      key={runId || index}
                      className="border-b transition-colors hover:bg-red-50 dark:hover:bg-red-900/15"
                    >
                      <td className="p-3">
                        <Link
                          href={`/runs/${runId}`}
                          className="flex items-center gap-1 font-medium text-red-600 hover:text-red-700 hover:underline dark:text-red-500"
                        >
                          {runId}
                          {hasError && (
                            <XCircle className="h-3 w-3 text-red-500" />
                          )}
                        </Link>
                      </td>
                      <td className="p-3">{flowName}</td>
                      <td className="p-3">{taskId ? `#${taskId}` : "-"}</td>
                      <td className="p-3">{datasetName}</td>
                      <td className="p-3">
                        <div className="flex gap-3 font-mono text-xs">
                          {metrics.map((m, idx) => (
                            <span key={idx}>
                              {m.label}: {m.value}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="flex items-center justify-center gap-1">
                          <Heart className="h-3 w-3 fill-purple-500 text-purple-500" />
                          {result.nr_of_likes?.raw || 0}
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

function RunSplitView({
  results,
  selectedRun,
  onSelectRun,
}: {
  results: EnhancedRunResult[];
  selectedRun: EnhancedRunResult | null;
  onSelectRun: (run: EnhancedRunResult) => void;
}) {
  if (!results || results.length === 0)
    return (
      <div className="text-muted-foreground p-8 text-center">No runs found</div>
    );
  if (!selectedRun && results.length > 0)
    setTimeout(() => onSelectRun(results[0]), 0);

  const selected = selectedRun || results[0];
  const runId = selected?.run_id?.raw;

  // Use helper functions for selected run details
  const flowId = selected ? getFlowId(selected) : undefined;
  const flowName = selected
    ? truncateName(selected._flowName || getFlowName(selected))
    : "Unknown Flow";
  const dataId = selected ? getDatasetId(selected) : undefined;
  const datasetName = selected
    ? selected._datasetName || getDatasetName(selected)
    : "Unknown Dataset";
  const taskId = selected ? getTaskId(selected) : undefined;
  const taskTypeName = selected ? getTaskTypeName(selected) : undefined;
  const metrics = extractMetrics(selected?.evaluations?.raw);

  return (
    <div className="flex min-h-[600px] gap-0 overflow-hidden rounded-md border">
      <div className="w-[380px] space-y-0 overflow-y-auto border-r">
        {results.map((result, index) => {
          const isSelected = result.run_id?.raw === runId;

          // Use helper functions for list item
          const resultFlowName = truncateName(result._flowName || getFlowName(result));
          const resultDatasetName =
            result._datasetName || getDatasetName(result);
          const resultTaskId = getTaskId(result);
          const resultTaskTypeName = getTaskTypeName(result);

          const displayText = [
            resultTaskTypeName ? `${resultTaskTypeName}` : null,
            resultTaskId ? `Task #${resultTaskId}` : null,
            resultDatasetName ? `on ${resultDatasetName}` : null,
          ]
            .filter(Boolean)
            .join(" • ");

          return (
            <button
              key={result.run_id?.raw || index}
              onClick={() => onSelectRun(result)}
              className={`block w-full border-b p-3 text-left transition-colors ${
                isSelected
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "hover:bg-red-50 dark:hover:bg-red-900/15"
              }`}
            >
              <h4 className="line-clamp-1 text-sm font-semibold">
                {resultFlowName}
              </h4>
              <p className="text-muted-foreground line-clamp-2 text-xs">
                {displayText}
              </p>
              {result.evaluations?.raw && (
                <div className="mt-1 flex gap-2 font-mono text-xs">
                  {extractMetrics(result.evaluations.raw)
                    .slice(0, 2)
                    .map((m, i) => (
                      <span key={i}>
                        {m.label}: {m.value}
                      </span>
                    ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex-1 p-6">
        {selected && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h2 className="text-xl font-bold">
                {flowName || "Unknown Flow"}
              </h2>
              {(selected.error_message?.raw || selected.error?.raw) && (
                <Badge variant="destructive" className="text-xs">
                  <XCircle className="mr-1 h-3 w-3" />
                  Failed
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mb-4">
              {flowName ? `Flow: ${flowName}` : "Flow: Unknown"} •{" "}
              {taskId ? `Task: #${taskId}` : ""} •{" "}
              {datasetName ? `Dataset: ${datasetName}` : "Dataset: Unknown"}
            </p>
            {metrics.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-3">
                {metrics.map((metric, idx) => (
                  <div key={idx} className="rounded-lg border p-3">
                    <div className="text-muted-foreground text-xs font-medium">
                      {metric.label}
                    </div>
                    <div className="font-mono text-xl font-bold">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mb-4 flex gap-4">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4 fill-purple-500 text-purple-500" />
                {selected.nr_of_likes?.raw || 0}
              </span>
              <span className="flex items-center gap-1">
                <CloudDownload className="h-4 w-4" />
                {selected.nr_of_downloads?.raw || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {selected.nr_of_issues?.raw || 0}
              </span>
            </div>
            <Link
              href={`/runs/${runId}`}
              className="inline-flex items-center gap-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
