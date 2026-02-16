"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Info, AlertCircle, Loader2, Target, BarChart3 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Flow } from "@/types/flow";
import { searchRuns } from "@/app/actions/runs";

// ──────────────────────────────────────────────────────────────
// Types for Elasticsearch response
// ──────────────────────────────────────────────────────────────
interface Evaluation {
  evaluation_measure: string;
  value: number;
}

interface RunSource {
  run_id: number;
  uploader?: string;
  run_task?: {
    task_id?: number;
    name?: string;
    task_type_id?: number;
  };
  evaluations?: Evaluation[];
}

interface SearchHit {
  _source: RunSource;
}

interface SearchResponse {
  hits: {
    hits: SearchHit[];
  };
}

interface RunSearchQuery {
  bool: {
    must: Array<Record<string, unknown>>;
  };
}

interface RunCustomData {
  runId: number;
  taskId?: number;
}

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
  { value: "f_measure", label: "F Measure" },
  { value: "precision", label: "Precision" },
  { value: "recall", label: "Recall" },
  { value: "root_mean_squared_error", label: "Root Mean Squared Error" },
  { value: "mean_absolute_error", label: "Mean Absolute Error" },
  { value: "kappa", label: "Kappa" },
];

const TASK_TYPES = [
  { value: "all", label: "All Task Types" },
  { value: "1", label: "Supervised Classification" },
  { value: "2", label: "Supervised Regression" },
  { value: "3", label: "Learning Curve" },
  { value: "4", label: "Supervised Data Stream Classification" },
  { value: "5", label: "Clustering" },
  { value: "6", label: "Machine Learning Challenge" },
];

interface EvaluationRun {
  run_id: number;
  task_id?: number;
  task_name: string;
  uploader: string;
  value: number;
}

interface FlowAnalysisSectionProps {
  flow: Flow;
  runCount: number;
}

export function FlowAnalysisSection({
  flow,
  runCount,
}: FlowAnalysisSectionProps) {
  const [selectedMetric, setSelectedMetric] = useState("area_under_roc_curve");
  const [selectedTaskType, setSelectedTaskType] = useState("all");
  const [selectedComponent, setSelectedComponent] = useState(flow.name);
  const [runs, setRuns] = useState<EvaluationRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFlowEvaluations() {
      if (runCount === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const query: RunSearchQuery = {
          bool: {
            must: [{ term: { "run_flow.flow_id": flow.flow_id } }],
          },
        };

        if (selectedTaskType !== "all") {
          query.bool.must.push({
            term: { "run_task.task_type_id": parseInt(selectedTaskType) },
          });
        }

        const data: SearchResponse = await searchRuns({
          query,
          size: 1000,
          _source: ["run_id", "run_task", "uploader", "evaluations"],
        });

        const fetchedRuns: EvaluationRun[] = [];

        data.hits.hits.forEach((hit: SearchHit) => {
          const source = hit._source;
          const metricData = source.evaluations?.find(
            (e) => e.evaluation_measure === selectedMetric,
          );

          if (metricData && metricData.value !== undefined) {
            fetchedRuns.push({
              run_id: source.run_id,
              task_id: source.run_task?.task_id,
              task_name:
                source.run_task?.name ||
                `Task ${source.run_task?.task_id ?? ""}`,
              uploader: source.uploader || "Unknown",
              value: metricData.value,
            });
          }
        });

        setRuns(fetchedRuns);
      } catch (err) {
        console.error("Error fetching flow evaluations:", err);
        setError("Failed to load evaluation data");
      } finally {
        setLoading(false);
      }
    }

    fetchFlowEvaluations();
  }, [flow.flow_id, selectedMetric, selectedTaskType, runCount]);

  // Group runs by Task for the chart
  const chartData = useMemo(() => {
    const taskGroups = new Map<string, EvaluationRun[]>();

    runs.forEach((run) => {
      const existing = taskGroups.get(run.task_name);
      if (existing) {
        existing.push(run);
      } else {
        taskGroups.set(run.task_name, [run]);
      }
    });

    return Array.from(taskGroups.entries())
      .map(([name, taskRuns]) => ({
        name,
        runs: taskRuns,
        bestScore: Math.max(...taskRuns.map((r) => r.value)),
        taskId: taskRuns[0].task_id,
      }))
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, 30); // Top 30 tasks
  }, [runs]);

  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#f97316",
    "#14b8a6",
    "#6366f1",
  ];

  if (runCount === 0) {
    return (
      <div className="py-12 text-center">
        <Info className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <h3 className="text-lg font-semibold">No Runs to Analyse</h3>
        <p className="text-muted-foreground mt-2">
          This flow hasn't been used in any runs yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuration Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium uppercase">
            Evaluation Measure
          </label>
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

        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium uppercase">
            Task Type
          </label>
          <Select value={selectedTaskType} onValueChange={setSelectedTaskType}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select task type" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {TASK_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium uppercase">
            Flow/Component
          </label>
          <Select
            value={selectedComponent}
            onValueChange={setSelectedComponent}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select component" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value={flow.name}>{flow.name}</SelectItem>
              {/* Future: Add flow components/sub-flows here if available */}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Analysis UI */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <BarChart3 className="h-5 w-5 text-[#3b82f6]" />
            Performance across Tasks
          </h3>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[#3b82f6]" />
              Each dot is a run
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex h-[500px] items-center justify-center rounded-lg border">
            <Loader2 className="h-8 w-8 animate-spin text-[#3b82f6]" />
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
              No runs found with {selectedMetric} evaluation for this flow.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="rounded-lg border bg-white p-4 dark:bg-slate-900">
            <div className="plotly-chart-container">
              <Plot
                data={chartData.map((task, idx) => ({
                  type: "scatter",
                  mode: "markers",
                  name: task.name,
                  y: Array(task.runs.length).fill(task.name),
                  x: task.runs.map((r) => r.value),
                  text: task.runs.map(
                    (r) =>
                      `Run ${r.run_id}<br>Task: ${task.name}<br>Score: ${r.value.toFixed(4)}<br>Uploader: ${r.uploader}`,
                  ),
                  hoverinfo: "text",
                  marker: {
                    color: colors[idx % colors.length],
                    size: 10,
                    opacity: 0.6,
                    line: { width: 1, color: "white" },
                  },
                  customdata: task.runs.map((r) => ({
                    runId: r.run_id,
                    taskId: r.task_id,
                  })),
                }))}
                layout={{
                  height: Math.max(500, chartData.length * 35),
                  margin: { l: 250, r: 50, t: 30, b: 50 },
                  showlegend: false,
                  xaxis: {
                    title: selectedMetric.replace(/_/g, " ").toUpperCase(),
                    gridcolor: "#f3f4f6",
                    zeroline: false,
                  },
                  yaxis: {
                    automargin: true,
                    gridcolor: "#f3f4f6",
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
                  if (event.points?.length) {
                    const point = event.points[0] as {
                      customdata?: RunCustomData;
                    };
                    const data = point.customdata;
                    if (data?.runId) {
                      window.open(`/runs/${data.runId}`, "_blank");
                    }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Decision Tree Placeholder / Search */}
      <div className="mt-8 rounded-lg border border-dashed p-12 text-center">
        <Target className="text-muted-foreground/40 mx-auto mb-4 h-12 w-12" />
        <h3 className="text-lg font-semibold">Decision Tree Visualization</h3>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md">
          Decision tree models generated by this flow can be visualized here.
          Currently searching for compatible run outputs...
        </p>
      </div>
    </div>
  );
}
