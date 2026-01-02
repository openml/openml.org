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
  FlaskConical,
  Calendar,
  User,
  Hash,
  Database,
  Cog,
  Trophy,
  CheckCircle2,
  XCircle,
  Heart,
  CloudDownload,
  MessageCircle,
  ThumbsDown,
} from "lucide-react";

interface Evaluation {
  evaluation_measure: string;
  value: number;
  [key: string]: unknown;
}

interface RunResult {
  run_id?: { raw: string | number };
  uploader?: { raw: string };
  uploader_id?: { raw: string | number };
  date?: { raw: string };
  error_message?: { raw: string };
  error?: { raw: string };
  flow_id?: { raw: string | number };
  flow_name?: { raw: string };
  task_id?: { raw: string | number };
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

const searchFacets: { label: string; field: string }[] = [
  { label: "Uploader", field: "uploader.keyword" },
];

const sortOptions = [
  {
    name: "Most Recent",
    value: [{ field: "date", direction: "desc" }],
    id: "recent",
  },
  {
    name: "Oldest First",
    value: [{ field: "date", direction: "asc" }],
    id: "oldest",
  },
  {
    name: "Most Popular Dataset",
    value: [{ field: "data_id", direction: "desc" }],
    id: "dataset-popular",
  },
  {
    name: "Most Popular Task",
    value: [{ field: "task_id", direction: "desc" }],
    id: "task-popular",
  },
  {
    name: "Most Popular Flow",
    value: [{ field: "flow_id", direction: "desc" }],
    id: "flow-popular",
  },
  {
    name: "Uploader (A-Z)",
    value: [{ field: "uploader.keyword", direction: "asc" }],
    id: "uploader-asc",
  },
  {
    name: "Uploader (Z-A)",
    value: [{ field: "uploader.keyword", direction: "desc" }],
    id: "uploader-desc",
  },
];

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

export function RunsSearchContainer() {
  const [view, setView] = useState("list");
  const [selectedRun, setSelectedRun] = useState<RunResult | null>(null);
  const searchParams = useSearchParams();
  const context = useContext(SearchContext);
  const driver = context?.driver;
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (!driver) return;
    // Use the correct type for driver from @elastic/react-search-ui
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
            sortOptions={sortOptions}
          />
          <div className="p-4">
            <WithSearch mapContextToProps={({ results }) => ({ results })}>
              {({ results }) => (
                <>
                  {view === "list" && (
                    <RunListView results={results as RunResult[]} />
                  )}
                  {view === "grid" && (
                    <RunGridView results={results as RunResult[]} />
                  )}
                  {view === "table" && (
                    <RunTableView results={results as RunResult[]} />
                  )}
                  {view === "split" && (
                    <RunSplitView
                      results={results as RunResult[]}
                      selectedRun={selectedRun}
                      onSelectRun={setSelectedRun}
                    />
                  )}
                </>
              )}
            </WithSearch>
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
                return (
                  <div className="mt-6 flex flex-col items-center gap-3">
                    <Paging
                      view={({ current, totalPages, onChange }) => {
                        if (!current || totalPages <= 1) return null;
                        return (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onChange(current - 1)}
                              disabled={current === 1}
                              className="hover:bg-muted rounded border px-3 py-1 disabled:opacity-50"
                            >
                              Previous
                            </button>
                            {Array.from(
                              { length: Math.min(totalPages, 7) },
                              (_, i) => i + 1,
                            ).map((page) => (
                              <button
                                key={page}
                                onClick={() => onChange(page)}
                                disabled={page > MAX_ACCESSIBLE_PAGE}
                                className={`rounded border px-3 py-1 ${page === current ? "text-white" : "hover:bg-muted"}`}
                                style={
                                  page === current
                                    ? { backgroundColor: entityColors.run }
                                    : undefined
                                }
                              >
                                {page}
                              </button>
                            ))}
                            <button
                              onClick={() => onChange(current + 1)}
                              disabled={current >= totalPages}
                              className="hover:bg-muted rounded border px-3 py-1 disabled:opacity-50"
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

function RunListView({ results }: { results: RunResult[] }) {
  if (!results || results.length === 0)
    return (
      <div className="text-muted-foreground p-8 text-center">No runs found</div>
    );
  return (
    <div className="space-y-0">
      {results.map((result, index) => {
        const runId = result.run_id?.raw;
        const hasError = !!(result.error_message?.raw || result.error?.raw);

        // Extract nested fields
        const flowName = result["run_flow.name"]?.raw;
        const flowId = result["run_flow.flow_id"]?.raw;
        const datasetName = result["run_task.source_data.name"]?.raw;
        const dataId = result["run_task.source_data.data_id"]?.raw;
        const taskId = result["run_task.task_id"]?.raw;
        const taskType = result["run_task.tasktype.name"]?.raw;

        const metrics = extractMetrics(result.evaluations?.raw);

        // Debug logging for troubleshooting
        if (!flowName || !datasetName) {
          console.log("🔍 DEBUG - Missing data for run:", runId);
          console.log("Available keys:", Object.keys(result));
          console.log("Flow name (nested):", result["run_flow.name"]?.raw);
          console.log("Flow name (direct):", result.flow_name?.raw);
          console.log(
            "Dataset name (nested):",
            result["run_task.source_data.name"]?.raw,
          );
          console.log("Full run_flow object:", result["run_flow"]);
          console.log("Full run_task object:", result["run_task"]);
          console.log("Full result object:", result);
        }

        // Build display text
        const displayParts = [];
        if (flowName) {
          displayParts.push(`Flow: ${flowName}`);
        } else {
          displayParts.push("Flow: Unknown");
        }

        if (taskId) {
          displayParts.push(`Task: #${taskId}`);
        }

        if (datasetName) {
          displayParts.push(`Dataset: ${datasetName}`);
        } else {
          displayParts.push("Dataset: Unknown");
        }

        const displayText = displayParts.join(" • ");

        return (
          <div
            key={runId || index}
            className="hover:bg-muted/40 relative flex items-start justify-between border-b px-4 py-1.5 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <FlaskConical className="mt-1 h-5 w-5 shrink-0 fill-red-500 text-red-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold">
                        {flowName || "Unknown Flow"}
                      </h3>
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
              {metrics.length > 0 && (
                <div className="mb-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  {metrics.map((metric, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 font-mono"
                    >
                      <span className="text-muted-foreground">
                        {metric.label}:
                      </span>
                      <span className="font-semibold">{metric.value}</span>
                    </span>
                  ))}
                </div>
              )}
              <div className="text-muted-foreground flex flex-wrap gap-x-4 text-xs">
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
              </div>

              <div className="mt-1 flex flex-wrap gap-x-4 text-xs">
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

function RunGridView({ results }: { results: RunResult[] }) {
  if (!results || results.length === 0)
    return (
      <div className="text-muted-foreground p-8 text-center">No runs found</div>
    );
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {results.map((result, index) => {
        const runId = result.run_id?.raw;
        const hasError = !!(result.error_message?.raw || result.error?.raw);
        const flowName = result["run_flow.name"]?.raw;
        const datasetName = result["run_task.source_data.name"]?.raw;
        const taskId = result["run_task.task_id"]?.raw;
        const metrics = extractMetrics(result.evaluations?.raw);

        // Debug logging
        if (!flowName || !datasetName) {
          console.log("🔍 GRID DEBUG - Missing data for run:", runId);
          console.log("Flow:", flowName, "Dataset:", datasetName);
        }

        const displayText = [
          flowName ? `Flow: ${flowName}` : "Flow: Unknown",
          taskId ? `Task: #${taskId}` : null,
          datasetName ? `Dataset: ${datasetName}` : "Dataset: Unknown",
        ]
          .filter(Boolean)
          .join(" • ");

        return (
          <Link
            key={runId || index}
            href={`/runs/${runId}`}
            className="bg-card hover:bg-accent block rounded-lg border p-4 transition-colors"
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

function RunTableView({ results }: { results: RunResult[] }) {
  if (!results || results.length === 0)
    return (
      <div className="text-muted-foreground p-8 text-center">No runs found</div>
    );
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left text-sm font-medium">ID</th>
            <th className="p-3 text-left text-sm font-medium">Flow</th>
            <th className="p-3 text-left text-sm font-medium">Task</th>
            <th className="p-3 text-left text-sm font-medium">Dataset</th>
            <th className="p-3 text-left text-sm font-medium">Metrics</th>
            <th className="p-3 text-center text-sm font-medium">Likes</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => {
            const runId = result.run_id?.raw;
            const hasError = !!(result.error_message?.raw || result.error?.raw);
            const flowName = result["run_flow.name"]?.raw || "Unknown";
            const datasetName =
              result["run_task.source_data.name"]?.raw || "Unknown";
            const taskId = result["run_task.task_id"]?.raw;
            const metrics = extractMetrics(result.evaluations?.raw);

            // Debug logging
            if (flowName === "Unknown" || datasetName === "Unknown") {
              console.log(
                "🔍 TABLE DEBUG - Run:",
                runId,
                "Flow:",
                flowName,
                "Dataset:",
                datasetName,
              );
            }

            return (
              <tr key={runId || index} className="hover:bg-accent border-b">
                <td className="p-3">
                  <Link
                    href={`/runs/${runId}`}
                    className="text-primary flex items-center gap-1 hover:underline"
                  >
                    {runId}
                    {hasError && <XCircle className="h-3 w-3 text-red-500" />}
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
}

function RunSplitView({
  results,
  selectedRun,
  onSelectRun,
}: {
  results: RunResult[];
  selectedRun: RunResult | null;
  onSelectRun: (run: RunResult) => void;
}) {
  if (!results || results.length === 0)
    return (
      <div className="text-muted-foreground p-8 text-center">No runs found</div>
    );
  if (!selectedRun && results.length > 0)
    setTimeout(() => onSelectRun(results[0]), 0);
  const selected = selectedRun || results[0];
  const runId = selected?.run_id?.raw;
  const flowName = selected?.["run_flow.name"]?.raw;
  const datasetName = selected?.["run_task.source_data.name"]?.raw;
  const taskId = selected?.["run_task.task_id"]?.raw;
  const metrics = extractMetrics(selected?.evaluations?.raw);

  // Debug logging
  if (!flowName || !datasetName) {
    console.log("🔍 SPLIT DEBUG - Selected run:", runId);
    console.log("Flow:", flowName, "Dataset:", datasetName, "Task:", taskId);
    console.log("Selected result:", selected);
  }

  return (
    <div className="flex min-h-[600px] gap-0 overflow-hidden rounded-md border">
      <div className="w-[380px] space-y-0 overflow-y-auto border-r">
        {results.map((result, index) => {
          const isSelected = result.run_id?.raw === runId;
          const resultFlowName = result["run_flow.name"]?.raw || "Unknown";
          const resultDatasetName =
            result["run_task.source_data.name"]?.raw || "Unknown";
          const resultTaskId = result["run_task.task_id"]?.raw;
          const resultMetrics = extractMetrics(result.evaluations?.raw);

          const displayText = [
            resultFlowName !== "Unknown"
              ? `Flow: ${resultFlowName}`
              : "Flow: Unknown",
            resultTaskId ? `Task: #${resultTaskId}` : null,
            resultDatasetName !== "Unknown"
              ? `Dataset: ${resultDatasetName}`
              : "Dataset: Unknown",
          ]
            .filter(Boolean)
            .join(" • ");

          return (
            <button
              key={result.run_id?.raw || index}
              onClick={() => onSelectRun(result)}
              className={`block w-full border-b p-3 text-left transition-colors ${
                isSelected ? "bg-accent" : "hover:bg-accent"
              }`}
            >
              <h4 className="line-clamp-1 text-sm font-semibold">
                {resultFlowName}
              </h4>
              <p className="text-muted-foreground line-clamp-2 text-xs">
                {displayText}
              </p>
              {resultMetrics.length > 0 && (
                <div className="mt-1 flex gap-2 font-mono text-xs">
                  {resultMetrics.slice(0, 2).map((m, i) => (
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
