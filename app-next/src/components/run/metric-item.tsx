"use client";

import { useState, useMemo, useCallback } from "react";
import { ChevronRight, Copy, Check } from "lucide-react";

export interface Evaluation {
  name: string;
  value: string | number;
  stdev?: string | number;
  array_data?: Record<string, string | number>;
  per_fold?: Array<number | number[]>;
}

// Colors for bar charts
const COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
];

// Format metric names
const formatMetricName = (name: string) => {
  const mapping: Record<string, string> = {
    predictive_accuracy: "Predictive Accuracy",
    area_under_roc_curve: "Area Under ROC Curve (AUC)",
    root_mean_squared_error: "Root Mean Squared Error (RMSE)",
    mean_absolute_error: "Mean Absolute Error (MAE)",
    f_measure: "F-Measure",
    precision: "Precision",
    recall: "Recall",
    kappa: "Kappa",
    kb_relative_information_score: "KB Relative Information Score",
    weighted_recall: "Weighted Recall",
  };
  return (
    mapping[name] ||
    name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

// ─── Pure-CSS horizontal bar (for Per Class) ───────────────────────────
function HorizontalBarChart({
  data,
}: {
  data: { name: string; value: number; fill: string; pct: number }[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="space-y-1">
      {data.map((entry, idx) => (
        <div
          key={entry.name}
          className="group relative flex items-center gap-2"
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
        >
          <span className="text-muted-foreground w-16 shrink-0 truncate text-right text-[10px]">
            {entry.name}
          </span>
          <div className="relative h-3 min-w-0 flex-1 overflow-hidden rounded-sm bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-sm transition-all duration-300"
              style={{
                width: `${Math.max(entry.pct, 1)}%`,
                backgroundColor: entry.fill,
                opacity: hovered === null || hovered === idx ? 1 : 0.4,
              }}
            />
          </div>
          <span
            className="w-14 shrink-0 text-right font-mono text-[10px]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {entry.value.toFixed(4)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Pure-CSS vertical bar (for Per Fold) ──────────────────────────────
function VerticalBarChart({
  data,
}: {
  data: { name: string; value: number; pct: number }[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div>
      {/* Bars */}
      <div className="flex items-end gap-1" style={{ height: 80 }}>
        {data.map((entry, idx) => (
          <div
            key={entry.name}
            className="group relative flex flex-1 flex-col items-center justify-end"
            style={{ height: "100%" }}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Tooltip on hover */}
            {hovered === idx && (
              <div className="absolute -top-6 z-10 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] whitespace-nowrap text-white shadow">
                {entry.value.toFixed(4)}
              </div>
            )}
            <div
              className="w-full max-w-[20px] rounded-t-sm transition-all duration-300"
              style={{
                height: `${Math.max(entry.pct, 2)}%`,
                backgroundColor: "#6b7280",
                opacity: hovered === null || hovered === idx ? 1 : 0.4,
              }}
            />
          </div>
        ))}
      </div>
      {/* Labels */}
      <div className="mt-1 flex gap-1">
        {data.map((entry) => (
          <div
            key={entry.name}
            className="text-muted-foreground flex-1 truncate text-center text-[9px]"
          >
            {entry.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Data processing ───────────────────────────────────────────────────
const getPerClassChartData = (arrayData: Record<string, string | number>) => {
  const entries = Object.entries(arrayData)
    .map(([key, val], idx) => {
      const numeric = typeof val === "number" ? val : parseFloat(String(val));
      return { name: key, value: numeric, fill: COLORS[idx % COLORS.length] };
    })
    .filter((d) => !isNaN(d.value));
  if (entries.length === 0) return [];
  const sorted = [...entries].sort((a, b) => b.value - a.value);
  const maxVal = sorted[0]?.value || 1;
  return sorted.map((entry) => ({
    ...entry,
    pct: maxVal > 0 ? (entry.value / maxVal) * 100 : 0,
  }));
};

const getPerFoldChartData = (perFold: Array<number | number[]>) => {
  const flatValues = perFold.flat().filter((v) => !isNaN(v));
  if (flatValues.length === 0) return [];
  const maxVal = Math.max(...flatValues);
  return flatValues.map((val, idx) => ({
    name: `Fold ${idx + 1}`,
    value: val,
    pct: maxVal > 0 ? (val / maxVal) * 100 : 0,
  }));
};

// ─── MetricItem ────────────────────────────────────────────────────────
export function MetricItemWithCharts({
  evaluation,
  isCollapsed,
  onToggle,
}: {
  evaluation: Evaluation;
  isCollapsed: boolean;
  onToggle: (name: string) => void;
}) {
  return (
    <MetricItem
      evaluation={evaluation}
      isCollapsed={isCollapsed}
      onToggle={onToggle}
    />
  );
}

export default function MetricItem({
  evaluation,
  isCollapsed,
  onToggle,
}: {
  evaluation: Evaluation;
  isCollapsed: boolean;
  onToggle: (name: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyValue = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const v =
        typeof evaluation.value === "string"
          ? parseFloat(evaluation.value)
          : evaluation.value;
      const s = evaluation.stdev
        ? typeof evaluation.stdev === "string"
          ? parseFloat(evaluation.stdev)
          : evaluation.stdev
        : null;
      const text =
        s !== null && !isNaN(s)
          ? `${evaluation.name}: ${v.toFixed(4)} ± ${s.toFixed(4)}`
          : `${evaluation.name}: ${v.toFixed(4)}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    },
    [evaluation.name, evaluation.value, evaluation.stdev],
  );

  const chartData = useMemo(() => {
    const arrayData = evaluation.array_data;
    const perFold = evaluation.per_fold;
    const perClassData = arrayData ? getPerClassChartData(arrayData) : null;
    const perFoldData = perFold ? getPerFoldChartData(perFold) : null;
    return { perClassData, perFoldData, arrayData };
  }, [evaluation.array_data, evaluation.per_fold]);

  const { perClassData, perFoldData, arrayData } = chartData;
  const value =
    typeof evaluation.value === "string"
      ? parseFloat(evaluation.value)
      : evaluation.value;
  const stdev = evaluation.stdev
    ? typeof evaluation.stdev === "string"
      ? parseFloat(evaluation.stdev)
      : evaluation.stdev
    : null;

  const hasCharts =
    (perClassData && perClassData.length > 0) ||
    (perFoldData && perFoldData.length > 0);
  const bothCharts =
    perClassData &&
    perClassData.length > 0 &&
    perFoldData &&
    perFoldData.length > 0;

  return (
    <div
      className={`group/card rounded-lg border px-4 pt-3 pb-2 transition-all duration-150 ${
        hasCharts
          ? "hover:border-slate-400 hover:bg-slate-100/35 hover:shadow-sm"
          : ""
      }`}
    >
      {/* Header row */}
      <div
        className={`flex items-center justify-between gap-3 ${hasCharts ? "cursor-pointer select-none" : ""}`}
        onClick={hasCharts ? () => onToggle(evaluation.name) : undefined}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          {hasCharts ? (
            <ChevronRight
              className={`text-muted-foreground h-3.5 w-3.5 shrink-0 transition-transform duration-150 ${!isCollapsed ? "rotate-90" : ""}`}
            />
          ) : (
            <span className="w-3.5 shrink-0" />
          )}
          <h3 className="text-muted-foreground truncate text-sm font-medium">
            {formatMetricName(evaluation.name)}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={copyValue}
            className="text-muted-foreground hover:text-foreground rounded p-1 opacity-0 transition-opacity group-hover/card:opacity-100 focus:opacity-100"
            title="Copy metric value"
            aria-label="Copy metric value"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
          <div
            className="text-right"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            <span className="text-2xl font-bold">
              {!isNaN(value) ? value.toFixed(4) : evaluation.value}
            </span>
            {stdev !== null && !isNaN(stdev) && (
              <span className="text-muted-foreground ml-1 text-sm">
                ±{stdev.toFixed(4)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Charts — hidden when collapsed */}
      {!isCollapsed && (
        <>
          <div
            className={`mt-2 grid grid-cols-1 gap-4 ${bothCharts ? "md:grid-cols-2" : ""}`}
          >
            {perClassData && perClassData.length > 0 && (
              <div>
                <h4 className="text-muted-foreground mb-1 text-xs font-medium">
                  Per Class
                </h4>
                <HorizontalBarChart data={perClassData} />
              </div>
            )}

            {perFoldData && perFoldData.length > 0 && (
              <div>
                <h4 className="text-muted-foreground mb-1 text-xs font-medium">
                  Per Fold
                </h4>
                <VerticalBarChart data={perFoldData} />
              </div>
            )}
          </div>

          {/* Fallback text display if no charts */}
          {!perClassData && !perFoldData && arrayData && (
            <div className="mt-2 space-y-1 border-t pt-2 text-xs">
              {Object.entries(arrayData).map(
                ([key, val]: [string, string | number]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-mono">
                      {typeof val === "number"
                        ? val.toFixed(4)
                        : parseFloat(val as string).toFixed(4)}
                    </span>
                  </div>
                ),
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
