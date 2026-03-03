"use client";

import { useMemo, useState } from "react";
import type { RunDetail } from "@/lib/api/run";

// ─── Colors (same as comparison table) ──────────────────────────────────
const RUN_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

/** Metrics where lower is better */
const LOWER_IS_BETTER = new Set([
  "root_mean_squared_error",
  "mean_absolute_error",
  "mean_prior_absolute_error",
  "root_mean_prior_squared_error",
  "relative_absolute_error",
  "root_relative_squared_error",
  "average_cost",
  "total_cost",
]);

const METRIC_NAMES: Record<string, string> = {
  predictive_accuracy: "Predictive Accuracy",
  area_under_roc_curve: "AUC",
  root_mean_squared_error: "RMSE",
  mean_absolute_error: "MAE",
  f_measure: "F-Measure",
  precision: "Precision",
  recall: "Recall",
  kappa: "Kappa",
};

function formatMetricName(name: string): string {
  return (
    METRIC_NAMES[name] ||
    name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════
interface RunComparisonChartProps {
  runs: RunDetail[];
}

export function RunComparisonChart({ runs }: RunComparisonChartProps) {
  // Collect all metric names with summary values
  const metrics = useMemo(() => {
    const nameSet = new Set<string>();
    for (const run of runs) {
      for (const ev of run.output_data?.evaluation ?? []) {
        if (ev.value != null) nameSet.add(ev.name);
      }
    }
    // Sort: common first, alphabetical
    return Array.from(nameSet).sort((a, b) =>
      formatMetricName(a).localeCompare(formatMetricName(b)),
    );
  }, [runs]);

  const [selectedMetric, setSelectedMetric] = useState<string>(
    () => metrics.find((m) => m === "predictive_accuracy") ?? metrics[0] ?? "",
  );

  const chartData = useMemo(() => {
    if (!selectedMetric) return [];
    return runs.map((run, idx) => {
      const ev = run.output_data?.evaluation?.find(
        (e) => e.name === selectedMetric,
      );
      const val =
        ev?.value != null
          ? typeof ev.value === "number"
            ? ev.value
            : parseFloat(String(ev.value))
          : null;
      const stdev =
        ev?.stdev != null
          ? typeof ev.stdev === "number"
            ? ev.stdev
            : parseFloat(String(ev.stdev))
          : null;
      return {
        runId: run.run_id,
        flowName: run.flow_name ?? `Flow #${run.flow_id}`,
        value: val != null && !isNaN(val) ? val : null,
        stdev: stdev != null && !isNaN(stdev) ? stdev : null,
        color: RUN_COLORS[idx % RUN_COLORS.length],
      };
    });
  }, [runs, selectedMetric]);

  const lowerBetter = LOWER_IS_BETTER.has(selectedMetric);
  const validValues = chartData
    .map((d) => d.value)
    .filter((v): v is number => v !== null);
  const maxVal = validValues.length > 0 ? Math.max(...validValues) : 1;
  const minVal = validValues.length > 0 ? Math.min(...validValues) : 0;

  // For bar scaling — use 0 as baseline unless all values very high
  const baseline = minVal > maxVal * 0.5 ? minVal * 0.9 : 0;
  const range = maxVal - baseline || 1;

  // Determine best
  const bestVal = lowerBetter
    ? Math.min(...validValues)
    : Math.max(...validValues);
  const unique = new Set(validValues.map((v) => v.toFixed(6)));
  const hasBest = unique.size > 1;

  if (metrics.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        No evaluation metrics to chart.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Metric picker */}
      <div className="flex flex-wrap items-center gap-2">
        {metrics.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMetric(m)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              selectedMetric === m
                ? "bg-primary text-primary-foreground border-transparent"
                : "border-input hover:bg-muted"
            }`}
          >
            {formatMetricName(m)}
          </button>
        ))}
      </div>

      {/* Lower-is-better indicator */}
      {lowerBetter && (
        <p className="text-muted-foreground text-xs italic">
          ↓ Lower is better for this metric
        </p>
      )}

      {/* Bar chart */}
      <div className="space-y-3 py-2">
        {chartData.map((d) => {
          const pct =
            d.value !== null ? ((d.value - baseline) / range) * 100 : 0;
          const isBest = hasBest && d.value !== null && d.value === bestVal;
          return (
            <div key={d.runId} className="group flex items-center gap-3">
              {/* Label */}
              <div className="w-32 shrink-0 text-right">
                <p className="truncate text-xs font-medium">Run #{d.runId}</p>
                <p className="text-muted-foreground truncate text-[10px]">
                  {d.flowName}
                </p>
              </div>
              {/* Bar */}
              <div className="bg-muted relative h-8 flex-1 overflow-hidden rounded">
                {d.value !== null && (
                  <div
                    className="flex h-full items-center rounded-r px-2 transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.max(pct, 3)}%`,
                      backgroundColor: d.color,
                      opacity: isBest ? 1 : 0.7,
                    }}
                  >
                    <span
                      className={`font-mono text-xs whitespace-nowrap text-white drop-shadow ${
                        isBest ? "font-bold" : ""
                      }`}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {d.value.toFixed(4)}
                      {d.stdev !== null && (
                        <span className="ml-1 text-[10px] opacity-75">
                          ±{d.stdev.toFixed(4)}
                        </span>
                      )}
                    </span>
                  </div>
                )}
                {d.value === null && (
                  <span className="text-muted-foreground absolute top-1/2 left-2 -translate-y-1/2 text-xs">
                    No data
                  </span>
                )}
              </div>
              {isBest && (
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                  Best
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
