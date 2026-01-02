"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Info, AlertCircle, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Task } from "@/types/task";
import { searchRuns, fetchTopRuns } from "@/app/actions/runs";

// Dynamic import for Plotly (required for SSR compatibility)
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center">
      <Skeleton className="h-full w-full" />
    </div>
  ),
});

// Available evaluation measures
const EVALUATION_MEASURES = [
  { value: "area_under_roc_curve", label: "Area Under ROC Curve" },
  { value: "predictive_accuracy", label: "Predictive Accuracy" },
  { value: "average_cost", label: "Average Cost" },
  { value: "binominal_test", label: "Binominal Test" },
  { value: "build_cpu_time", label: "Build CPU Time" },
  { value: "build_memory", label: "Build Memory" },
  { value: "c_index", label: "C Index" },
  { value: "f_measure", label: "F Measure" },
  { value: "kappa", label: "Kappa" },
  { value: "kb_relative_information_score", label: "KB Relative Info Score" },
  { value: "mean_absolute_error", label: "Mean Absolute Error" },
  { value: "mean_prior_absolute_error", label: "Mean Prior Absolute Error" },
  { value: "number_of_instances", label: "Number of Instances" },
  { value: "os_information", label: "OS Information" },
  { value: "precision", label: "Precision" },
  { value: "prior_entropy", label: "Prior Entropy" },
  { value: "recall", label: "Recall" },
  { value: "relative_absolute_error", label: "Relative Absolute Error" },
  { value: "root_mean_squared_error", label: "Root Mean Squared Error" },
  {
    value: "root_mean_prior_squared_error",
    label: "Root Mean Prior Squared Error",
  },
  {
    value: "root_relative_squared_error",
    label: "Root Relative Squared Error",
  },
  { value: "run_cpu_time", label: "Run CPU Time" },
  { value: "run_memory", label: "Run Memory" },
  { value: "run_virtual_memory", label: "Run Virtual Memory" },
  { value: "scimark_benchmark", label: "SciMark Benchmark" },
  { value: "usercpu_time_millis", label: "User CPU Time (ms)" },
  { value: "usercpu_time_millis_testing", label: "User CPU Time Testing (ms)" },
  {
    value: "usercpu_time_millis_training",
    label: "User CPU Time Training (ms)",
  },
  { value: "weighted_area_under_roc_curve", label: "Weighted AUC ROC" },
];

/**
 * Metrics where a lower value is better
 */
const LOWER_IS_BETTER = [
  "root_mean_squared_error",
  "mean_absolute_error",
  "relative_absolute_error",
  "root_relative_squared_error",
  "average_cost",
  "run_cpu_time",
  "run_memory",
  "build_cpu_time",
  "build_memory",
  "usercpu_time_millis",
];

// Helper to get metric value from array
function getMetric(evaluations: any[] = [], name: string): number | undefined {
  const metric = evaluations.find((e) => e.evaluation_measure === name);
  return metric ? metric.value : undefined;
}

interface EvaluationRun {
  run_id: number;
  flow_name: string;
  flow_id: number;
  uploader: string;
  value: number;
  date: string;
}

interface LeaderboardEntry {
  uploader: string;
  topScore: number;
  entries: number;
}

interface TaskAnalysisSectionProps {
  task: Task;
  runCount: number;
}

/**
 * TaskAnalysisSection Component
 *
 * Kaggle-style Analysis tab content with:
 * - Metric dropdown selector
 * - Evaluations by Flow (Scatter plot)
 * - Evaluations over Time (Scatter plot)
 * - Leaderboard (Table)
 */
export function TaskAnalysisSection({
  task,
  runCount,
}: TaskAnalysisSectionProps) {
  // Default metric based on task type
  const defaultMetric =
    task.task_type_id === 1 || task.task_type_id === 2
      ? "area_under_roc_curve"
      : "root_mean_squared_error";

  const [selectedMetric, setSelectedMetric] = useState(defaultMetric);
  const [runs, setRuns] = useState<EvaluationRun[]>([]);
  const [leaderboardRuns, setLeaderboardRuns] = useState<EvaluationRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 1000;

  const isLowerBetter = LOWER_IS_BETTER.includes(selectedMetric);

  // Reset page when metric changes
  useEffect(() => {
    setPage(0);
  }, [selectedMetric]);

  // Fetch evaluation data
  useEffect(() => {
    async function fetchEvaluations() {
      // Use task.runs metadata if available
      const totalItems = task.runs || runCount;
      if (totalItems === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch discrete page of 1000 runs
        const data = await searchRuns({
          query: {
            bool: {
              must: [{ term: { "run_task.task_id": task.task_id } }],
            },
          },
          from: page * pageSize,
          size: pageSize,
          _source: ["run_id", "run_flow", "uploader", "evaluations", "date"],
        });

        const fetchedRuns: EvaluationRun[] = [];

        data.hits.hits.forEach((hit: any) => {
          const source = hit._source;
          const val = getMetric(source.evaluations, selectedMetric);

          if (val !== undefined) {
            fetchedRuns.push({
              run_id: source.run_id,
              flow_name: source.run_flow?.name || "Unknown Flow",
              flow_id: source.run_flow?.flow_id,
              uploader: source.uploader || "Unknown",
              value: val,
              date: source.date || "",
            });
          }
        });

        // Client-side sort the current page
        fetchedRuns.sort((a, b) =>
          isLowerBetter ? a.value - b.value : b.value - a.value,
        );

        setRuns(fetchedRuns);
      } catch (err) {
        console.error("Error fetching evaluations:", err);
        setError("Failed to load evaluation data");
      } finally {
        setLoading(false);
      }
    }

    fetchEvaluations();
  }, [task.task_id, selectedMetric, task.runs, runCount, isLowerBetter, page]);

  // Fetch Leaderboard data (All-time Top performers)
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoadingLeaderboard(true);
        const topData = await fetchTopRuns(
          task.task_id.toString(),
          selectedMetric,
          100,
          isLowerBetter ? "asc" : "desc",
        );

        const evaluationList = topData?.evaluations?.evaluation || [];
        if (evaluationList.length === 0) {
          setLeaderboardRuns([]);
          return;
        }

        const runIds = evaluationList.map((e: any) => e.run_id);

        // Fetch uploader details for these top runs from ES
        const details = await searchRuns({
          query: {
            ids: { values: runIds.map(String) },
          },
          size: 100,
          _source: ["run_id", "run_flow", "uploader", "evaluations", "date"],
        });

        const fetchedTopRuns: EvaluationRun[] = [];
        details.hits.hits.forEach((hit: any) => {
          const source = hit._source;
          const val = getMetric(source.evaluations, selectedMetric);
          if (val !== undefined) {
            fetchedTopRuns.push({
              run_id: source.run_id,
              flow_name: source.run_flow?.name || "Unknown Flow",
              flow_id: source.run_flow?.flow_id,
              uploader: source.uploader || "Unknown",
              value: val,
              date: source.date || "",
            });
          }
        });

        // Sort by value
        fetchedTopRuns.sort((a, b) =>
          isLowerBetter ? a.value - b.value : b.value - a.value,
        );

        setLeaderboardRuns(fetchedTopRuns);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoadingLeaderboard(false);
      }
    }

    fetchLeaderboard();
  }, [task.task_id, selectedMetric, isLowerBetter]);

  // Stable Uploader-to-Color Map using name hashing
  const uploaderColors = useMemo(() => {
    const palette = [
      "#3b82f6", // blue-500
      "#ef4444", // red-500
      "#10b981", // emerald-500
      "#f59e0b", // amber-500
      "#8b5cf6", // violet-500
      "#ec4899", // pink-500
      "#06b6d4", // cyan-500
      "#f97316", // orange-500
      "#6366f1", // indigo-500
      "#84cc16", // lime-500
      "#14b8a6", // teal-500
      "#a855f7", // purple-500
      "#eab308", // yellow-500
      "#64748b", // slate-500
      "#d946ef", // fuchsia-500
    ];

    const map = new Map<string, string>();

    // Hash function for stable colors
    const hashString = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash);
    };

    // Combine both sets of runs to ensure consistent colors
    const allUniqueUploaders = new Set([
      ...runs.map((r) => r.uploader),
      ...leaderboardRuns.map((r) => r.uploader),
    ]);

    allUniqueUploaders.forEach((uploader) => {
      const colorIndex = hashString(uploader) % palette.length;
      map.set(uploader, palette[colorIndex]);
    });

    return map;
  }, [runs, leaderboardRuns]);

  // 1. Group by Flow for the first chart
  const flowsData = useMemo(() => {
    const flowGroups = new Map<string, EvaluationRun[]>();

    runs.forEach((run) => {
      const cleanName = run.flow_name.split("(")[0];
      const existing = flowGroups.get(cleanName);
      if (existing) existing.push(run);
      else flowGroups.set(cleanName, [run]);
    });

    return Array.from(flowGroups.entries())
      .map(([name, r]) => ({
        name,
        runs: r,
        bestScore: isLowerBetter
          ? Math.min(...r.map((x) => x.value))
          : Math.max(...r.map((x) => x.value)),
      }))
      .sort((a, b) =>
        isLowerBetter ? a.bestScore - b.bestScore : b.bestScore - a.bestScore,
      )
      .slice(0, 30); // Top 30 flows
  }, [runs, isLowerBetter]);

  // 2. Leaderboard calculation (Using leaderboardRuns)
  const leaderboard = useMemo(() => {
    const uploaderMap = new Map<string, { top: number; count: number }>();

    leaderboardRuns.forEach((run) => {
      const existing = uploaderMap.get(run.uploader);
      if (existing) {
        existing.count++;
        existing.top = isLowerBetter
          ? Math.min(existing.top, run.value)
          : Math.max(existing.top, run.value);
      } else {
        uploaderMap.set(run.uploader, { top: run.value, count: 1 });
      }
    });

    return Array.from(uploaderMap.entries())
      .map(([name, data]) => ({
        uploader: name,
        topScore: data.top,
        entries: data.count,
      }))
      .sort((a, b) =>
        isLowerBetter ? a.topScore - b.topScore : b.topScore - a.topScore,
      );
  }, [leaderboardRuns, isLowerBetter]);

  const totalRuns = task.runs || runCount;

  if (totalRuns === 0) {
    return (
      <div className="py-12 text-center">
        <Info className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <h3 className="text-lg font-semibold">No Runs Yet</h3>
        <p className="text-muted-foreground mt-2">
          This task has no runs to analyze.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header with Metric Selector */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-[300px] bg-white dark:bg-slate-950">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent className="max-h-[400px]">
            {EVALUATION_MEASURES.map((measure) => (
              <SelectItem key={measure.value} value={measure.value}>
                {measure.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-muted-foreground flex items-center gap-2 text-sm italic">
          <Info className="h-4 w-4" />
          <span>Showing the top {runs.length.toLocaleString()} runs</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-8">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : runs.length === 0 ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            No runs found with {selectedMetric} evaluations.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Section 1: Leaderboard (All-time Top performers) */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Leaderboard</h2>
            {loadingLeaderboard && leaderboard.length === 0 ? (
              <Skeleton className="h-[200px] w-full rounded-xl" />
            ) : leaderboard.length === 0 ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  No leaderboard data available for this metric.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-slate-950">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 text-xs">
                      <TableHead className="w-20 font-bold">Rank</TableHead>
                      <TableHead className="font-bold">Uploader</TableHead>
                      <TableHead className="text-right font-bold">
                        Top Score
                      </TableHead>
                      <TableHead className="text-right font-bold">
                        Entries
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.slice(0, 50).map((entry, index) => (
                      <TableRow
                        key={entry.uploader}
                        className="hover:bg-muted/30"
                      >
                        <TableCell className="font-semibold">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor: uploaderColors.get(
                                  entry.uploader,
                                ),
                              }}
                            />
                            <span className="cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-400">
                              {entry.uploader}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          {entry.topScore.toFixed(6)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-right font-mono text-xs">
                          {/* Note: entries here is relative to the top sample */}
                          {entry.entries}+
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>

          {/* Section 2: Evaluations by Flow */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Evaluations:</h2>
            </div>
            <div className="text-muted-foreground space-y-1 text-sm">
              <p>Every dot is a run, click for details</p>
              <p>Every y-axis label is a flow, click for details</p>
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900">
              <div className="plotly-chart-container">
                <Plot
                  data={
                    flowsData.map((group) => {
                      return {
                        type: "scatter",
                        mode: "markers",
                        name: group.name,
                        y: group.runs.map(() => group.name),
                        x: group.runs.map((r) => r.value),
                        text: group.runs.map(
                          (r) =>
                            `Run ${r.run_id}<br>Uploader: ${r.uploader}<br>Score: ${r.value.toFixed(6)}`,
                        ),
                        hoverinfo: "text",
                        marker: {
                          color: group.runs.map(
                            (r) => uploaderColors.get(r.uploader) || "#000",
                          ),
                          size: 9,
                          opacity: 0.7,
                          line: { width: 0.5, color: "white" },
                        },
                        customdata: group.runs.map((r) => r.run_id),
                      };
                    }) as any
                  }
                  layout={{
                    height: Math.max(400, flowsData.length * 35),
                    margin: { l: 280, r: 40, t: 40, b: 60 },
                    showlegend: false,
                    xaxis: {
                      title: selectedMetric.replace(/_/g, " ").toUpperCase(),
                      gridcolor: "#f1f5f9",
                      zeroline: false,
                      side: "top",
                    } as any,
                    yaxis: {
                      automargin: true,
                      gridcolor: "#f1f5f9",
                    },
                    hovermode: "closest",
                    paper_bgcolor: "transparent",
                    plot_bgcolor: "transparent",
                  }}
                  config={{
                    displayModeBar: true,
                    responsive: true,
                    modeBarButtonsToRemove: ["lasso2d", "select2d"],
                    displaylogo: false,
                  }}
                  style={{ width: "100%" }}
                  onClick={(event) => {
                    if (event.points && event.points[0]) {
                      const runId = (event.points[0] as any).customdata;
                      if (runId) window.open(`/runs/${runId}`, "_blank");
                    }
                  }}
                />
              </div>
            </div>
          </section>

          {/* Section 3: People / Evaluations Over Time */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">People:</h2>
            <div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900">
              <div className="plotly-chart-container">
                <Plot
                  data={Array.from(uploaderColors.keys()).map((uploader) => {
                    const uploaderRuns = runs.filter(
                      (r) => r.uploader === uploader,
                    );
                    return {
                      type: "scatter" as const,
                      mode: "markers" as const,
                      name: uploader,
                      x: uploaderRuns.map((r) => r.date),
                      y: uploaderRuns.map((r) => r.value),
                      text: uploaderRuns.map(
                        (r) =>
                          `Run ${r.run_id}<br>Flow: ${r.flow_name}<br>Score: ${r.value.toFixed(6)}<br>Date: ${new Date(r.date).toLocaleDateString()}`,
                      ),
                      hoverinfo: "text",
                      marker: {
                        color: (uploaderColors.get(uploader) || "#000") as any,
                        size: 7,
                        opacity: 0.6,
                      },
                      customdata: uploaderRuns.map((r) => r.run_id),
                    };
                  })}
                  layout={{
                    height: 450,
                    margin: { l: 80, r: 40, t: 40, b: 60 },
                    showlegend: false,
                    xaxis: {
                      title: "upload_time",
                      gridcolor: "#f1f5f9",
                      type: "date" as any,
                    },
                    yaxis: {
                      title: selectedMetric,
                      gridcolor: "#f1f5f9",
                      autorange: (isLowerBetter ? "reversed" : true) as any,
                    },
                    hovermode: "closest",
                    paper_bgcolor: "transparent",
                    plot_bgcolor: "transparent",
                  }}
                  config={{
                    displayModeBar: true,
                    responsive: true,
                    displaylogo: false,
                  }}
                  style={{ width: "100%" }}
                  onClick={(event) => {
                    if (event.points && event.points[0]) {
                      const runId = (event.points[0] as any).customdata;
                      if (runId) window.open(`/runs/${runId}`, "_blank");
                    }
                  }}
                />
              </div>
            </div>
          </section>

          {/* Pagination Controls */}
          <div className="flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row">
            <div className="text-muted-foreground text-sm italic">
              Showing runs {(page * pageSize + 1).toLocaleString()} to{" "}
              {Math.min((page + 1) * pageSize, totalRuns).toLocaleString()} of{" "}
              {totalRuns.toLocaleString()} total
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPage((p) => Math.max(0, p - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={page === 0 || loading}
                className="dark:border-slate-700"
              >
                Previous 1000
              </Button>
              <div className="px-4 text-sm font-medium">
                Page {page + 1} of {Math.ceil(totalRuns / pageSize)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPage((p) => p + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={(page + 1) * pageSize >= totalRuns || loading}
                className="dark:border-slate-700"
              >
                Next 1000
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// wip