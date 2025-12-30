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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Task } from "@/types/task";

// Dynamic import for Plotly (required for SSR compatibility)
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center">
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

interface EvaluationRun {
  run_id: number;
  flow_name: string;
  flow_id: number;
  uploader: string;
  value: number;
}

interface TaskAnalysisSectionProps {
  task: Task;
  runCount: number;
}

/**
 * TaskAnalysisSection Component
 *
 * Analysis tab content with:
 * - Metric dropdown selector
 * - Scatter plot showing flows vs their performance scores
 * - Clickable points linking to run details
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch evaluation data when metric changes
  useEffect(() => {
    async function fetchEvaluations() {
      if (runCount === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`https://www.openml.org/es/run/_search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: {
              bool: {
                must: [
                  { term: { task_id: task.task_id } },
                  { exists: { field: `evaluations.${selectedMetric}` } },
                ],
              },
            },
            sort: [
              {
                [`evaluations.${selectedMetric}`]: {
                  order: "desc",
                  unmapped_type: "double",
                },
              },
            ],
            size: 1000, // Top 1000 runs shown
            _source: [
              "run_id",
              "flow_name",
              "flow_id",
              "uploader",
              `evaluations.${selectedMetric}`,
            ],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch evaluations");
        }

        const data = await response.json();
        const fetchedRuns: EvaluationRun[] = data.hits.hits.map(
          (hit: { _source: Record<string, unknown> }) => ({
            run_id: hit._source.run_id,
            flow_name: hit._source.flow_name || "Unknown Flow",
            flow_id: hit._source.flow_id,
            uploader: hit._source.uploader || "Unknown",
            value: (hit._source.evaluations as Record<string, number>)?.[
              selectedMetric
            ],
          }),
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
  }, [task.task_id, selectedMetric, runCount]);

  // Group runs by flow for the scatter plot
  const chartData = useMemo(() => {
    // Group by flow_name
    const flowGroups = new Map<
      string,
      { flowId: number; runs: EvaluationRun[] }
    >();

    runs.forEach((run) => {
      const existing = flowGroups.get(run.flow_name);
      if (existing) {
        existing.runs.push(run);
      } else {
        flowGroups.set(run.flow_name, {
          flowId: run.flow_id,
          runs: [run],
        });
      }
    });

    // Convert to array and sort by best score
    const sortedFlows = Array.from(flowGroups.entries())
      .map(([name, data]) => ({
        name,
        flowId: data.flowId,
        runs: data.runs,
        bestScore: Math.max(...data.runs.map((r) => r.value)),
      }))
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, 25); // Top 25 flows

    return sortedFlows;
  }, [runs]);

  // Generate colors for different flows
  const colors = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
    "#aec7e8",
    "#ffbb78",
    "#98df8a",
    "#ff9896",
    "#c5b0d5",
  ];

  if (runCount === 0) {
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
    <div className="space-y-6">
      {/* Metric Selector */}
      <div className="flex items-center gap-4">
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {EVALUATION_MEASURES.map((measure) => (
              <SelectItem key={measure.value} value={measure.value}>
                {measure.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Evaluations Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Evaluations:</h2>

        {/* Instructions */}
        <div className="text-muted-foreground mb-4 text-sm">
          <p>Every point is a run, click for details</p>
          <p>Every y label is a flow, click for details</p>
          <p>Top 1000 runs shown</p>
        </div>

        {loading ? (
          <div className="flex h-[500px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
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
          <div className="rounded-lg border bg-white p-4 dark:bg-slate-900">
            <Plot
              data={chartData.map((flow, idx) => ({
                type: "scatter",
                mode: "markers",
                name: flow.name,
                y: Array(flow.runs.length).fill(flow.name),
                x: flow.runs.map((r) => r.value),
                text: flow.runs.map(
                  (r) =>
                    `Run ${r.run_id}<br>Score: ${r.value.toFixed(4)}<br>Uploader: ${r.uploader}`,
                ),
                hoverinfo: "text",
                marker: {
                  color: colors[idx % colors.length],
                  size: 8,
                  opacity: 0.7,
                },
                customdata: flow.runs.map((r) => r.run_id),
              }))}
              layout={{
                height: Math.max(400, chartData.length * 30),
                margin: { l: 350, r: 50, t: 20, b: 50 },
                showlegend: false,
                xaxis: {
                  title: selectedMetric.replace(/_/g, " "),
                  gridcolor: "#e5e7eb",
                },
                yaxis: {
                  automargin: true,
                },
                hovermode: "closest",
                paper_bgcolor: "transparent",
                plot_bgcolor: "transparent",
              }}
              config={{
                displayModeBar: true,
                responsive: true,
                modeBarButtonsToRemove: ["lasso2d", "select2d"],
              }}
              style={{ width: "100%" }}
              onClick={(event) => {
                if (
                  event.points &&
                  event.points[0] &&
                  (event.points[0] as unknown as { customdata: number })
                    .customdata
                ) {
                  const runId = (
                    event.points[0] as unknown as { customdata: number }
                  ).customdata;
                  window.open(`/runs/${runId}`, "_blank");
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
