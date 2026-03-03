"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  Download,
  ChevronRight,
} from "lucide-react";
import type { RunDetail } from "@/lib/api/run";

// ─── Types ──────────────────────────────────────────────────────────────
type SortField = "metric" | `run_${number}`;
type SortDir = "asc" | "desc";

interface MetricRow {
  name: string;
  displayName: string;
  values: (number | null)[];
  stdevs: (number | null)[];
  foldCounts: number[];
  /** Index of the best (highest) value */
  bestIdx: number | null;
}

interface ParamRow {
  name: string;
  values: (string | null)[];
  allSame: boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────────
const METRIC_NAMES: Record<string, string> = {
  predictive_accuracy: "Predictive Accuracy",
  area_under_roc_curve: "AUC",
  root_mean_squared_error: "RMSE",
  mean_absolute_error: "MAE",
  f_measure: "F-Measure",
  precision: "Precision",
  recall: "Recall",
  kappa: "Kappa",
  weighted_recall: "Weighted Recall",
};

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

function fmt(n: string | number): string {
  const v = typeof n === "number" ? n : parseFloat(String(n));
  return isNaN(v) ? String(n) : v.toFixed(4);
}

function parseNum(v: string | number | undefined): number {
  if (v == null) return NaN;
  return typeof v === "number" ? v : parseFloat(String(v));
}

function formatMetricName(name: string): string {
  return (
    METRIC_NAMES[name] ||
    name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
}

// ─── Sort icon (module-level for React 19) ──────────────────────────────
function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
}) {
  if (sortField !== field)
    return <ArrowUpDown className="ml-1 inline h-3 w-3 opacity-30" />;
  return sortDir === "asc" ? (
    <ArrowUp className="ml-1 inline h-3 w-3" />
  ) : (
    <ArrowDown className="ml-1 inline h-3 w-3" />
  );
}

// ─── Run colors ─────────────────────────────────────────────────────────
const RUN_COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
];

// ═══════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════
interface RunComparisonTableProps {
  runs: RunDetail[];
  showParams?: boolean;
}

export function RunComparisonTable({
  runs,
  showParams = true,
}: RunComparisonTableProps) {
  const [sortField, setSortField] = useState<SortField>("metric");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [copiedCell, setCopiedCell] = useState<string | null>(null);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  // ── Build metric rows ─────────────────────────────────────────────────
  const metricRows = useMemo(() => {
    // Collect all metric names across runs
    const allNames = new Set<string>();
    for (const run of runs) {
      for (const ev of run.output_data?.evaluation ?? []) {
        allNames.add(ev.name);
      }
    }

    const rows: MetricRow[] = [];
    for (const name of allNames) {
      const values: (number | null)[] = [];
      const stdevs: (number | null)[] = [];
      const foldCounts: number[] = [];

      for (const run of runs) {
        const ev = run.output_data?.evaluation?.find((e) => e.name === name);
        if (ev) {
          const v = parseNum(ev.value);
          values.push(isNaN(v) ? null : v);
          const s = parseNum(ev.stdev);
          stdevs.push(isNaN(s) ? null : s);
          foldCounts.push(ev.per_fold?.flat().length ?? 0);
        } else {
          values.push(null);
          stdevs.push(null);
          foldCounts.push(0);
        }
      }

      // Determine best value
      const lowerBetter = LOWER_IS_BETTER.has(name);
      let bestIdx: number | null = null;
      let bestVal = lowerBetter ? Infinity : -Infinity;
      for (let i = 0; i < values.length; i++) {
        const v = values[i];
        if (v === null) continue;
        if (lowerBetter ? v < bestVal : v > bestVal) {
          bestVal = v;
          bestIdx = i;
        }
      }
      // Only highlight if there's a real difference
      const unique = new Set(
        values.filter((v) => v !== null).map((v) => v!.toFixed(6)),
      );
      if (unique.size <= 1) bestIdx = null;

      rows.push({
        name,
        displayName: formatMetricName(name),
        values,
        stdevs,
        foldCounts,
        bestIdx,
      });
    }
    return rows;
  }, [runs]);

  // ── Build parameter rows ──────────────────────────────────────────────
  const paramRows = useMemo(() => {
    if (!showParams) return [];
    const allNames = new Set<string>();
    for (const run of runs) {
      for (const p of run.parameter_setting ?? []) {
        allNames.add(p.name);
      }
    }

    const rows: ParamRow[] = [];
    for (const name of allNames) {
      const values: (string | null)[] = [];
      for (const run of runs) {
        const p = run.parameter_setting?.find((x) => x.name === name);
        values.push(p ? String(p.value) : null);
      }
      const nonNull = values.filter((v) => v !== null);
      const allSame = nonNull.length > 0 && new Set(nonNull).size === 1;
      rows.push({ name, values, allSame });
    }
    // Sort: different values first
    rows.sort((a, b) => {
      if (a.allSame !== b.allSame) return a.allSame ? 1 : -1;
      return a.name.localeCompare(b.name);
    });
    return rows;
  }, [runs, showParams]);

  // ── Sort metric rows ──────────────────────────────────────────────────
  const sortedMetrics = useMemo(() => {
    const arr = [...metricRows];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortField === "metric") {
        cmp = a.displayName.localeCompare(b.displayName);
      } else {
        const runIdx = parseInt(sortField.replace("run_", ""), 10);
        const va = a.values[runIdx] ?? -Infinity;
        const vb = b.values[runIdx] ?? -Infinity;
        cmp = va - vb;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [metricRows, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "metric" ? "asc" : "desc");
    }
  };

  const copyCell = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCell(key);
    setTimeout(() => setCopiedCell(null), 1200);
  }, []);

  // ── Export ────────────────────────────────────────────────────────────
  const exportCSV = useCallback(() => {
    const header = ["Metric", ...runs.map((r) => `Run #${r.run_id}`)].join(",");
    const rows = sortedMetrics.map((row) =>
      [
        row.name,
        ...row.values.map((v) => (v !== null ? v.toFixed(4) : "")),
      ].join(","),
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comparison_${runs.map((r) => r.run_id).join("_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [runs, sortedMetrics]);

  // ── Diff params: only show rows where values differ ───────────────────
  const [showAllParams, setShowAllParams] = useState(false);
  const visibleParams = showAllParams
    ? paramRows
    : paramRows.filter((r) => !r.allSame);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-medium"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {sortedMetrics.length} metrics × {runs.length} runs
        </h3>
        <button
          onClick={exportCSV}
          className="border-input hover:bg-muted flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      {/* ── Metric Comparison Table ────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-lg border">
        <table
          className="w-full text-sm"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="w-8 px-2 py-2.5" />
              <th
                className="cursor-pointer px-3 py-2.5 text-left text-xs font-medium select-none"
                onClick={() => toggleSort("metric")}
              >
                Metric
                <SortIcon
                  field="metric"
                  sortField={sortField}
                  sortDir={sortDir}
                />
              </th>
              {runs.map((run, i) => (
                <th
                  key={run.run_id}
                  className="cursor-pointer px-3 py-2.5 text-right text-xs font-medium select-none"
                  onClick={() => toggleSort(`run_${i}`)}
                >
                  <span
                    className="mr-1 inline-block h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: RUN_COLORS[i % RUN_COLORS.length],
                    }}
                  />
                  Run #{run.run_id}
                  <SortIcon
                    field={`run_${i}`}
                    sortField={sortField}
                    sortDir={sortDir}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedMetrics.map((row) => {
              const isExpanded = expandedMetric === row.name;
              const hasDetail = row.foldCounts.some((c) => c > 0);
              return (
                <MetricCompareRow
                  key={row.name}
                  row={row}
                  runs={runs}
                  isExpanded={isExpanded}
                  hasDetail={hasDetail}
                  copiedCell={copiedCell}
                  onToggle={() =>
                    setExpandedMetric(isExpanded ? null : row.name)
                  }
                  onCopy={copyCell}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Parameter Diff Table ───────────────────────────────────────── */}
      {showParams && paramRows.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Parameters
              {!showAllParams && visibleParams.length < paramRows.length && (
                <span className="text-muted-foreground ml-1.5 text-xs font-normal">
                  ({visibleParams.length} differing of {paramRows.length})
                </span>
              )}
            </h3>
            {paramRows.some((r) => r.allSame) && (
              <button
                onClick={() => setShowAllParams((v) => !v)}
                className="text-muted-foreground hover:text-foreground text-xs underline transition-colors"
              >
                {showAllParams ? "Show only differences" : "Show all"}
              </button>
            )}
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table
              className="w-full text-sm"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="px-3 py-2 text-left text-xs font-medium">
                    Parameter
                  </th>
                  {runs.map((run, i) => (
                    <th
                      key={run.run_id}
                      className="px-3 py-2 text-right text-xs font-medium"
                    >
                      <span
                        className="mr-1 inline-block h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: RUN_COLORS[i % RUN_COLORS.length],
                        }}
                      />
                      Run #{run.run_id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleParams.map((row) => (
                  <tr
                    key={row.name}
                    className={`border-b ${row.allSame ? "opacity-50" : ""}`}
                  >
                    <td className="px-3 py-2 font-mono text-xs">{row.name}</td>
                    {row.values.map((val, i) => (
                      <td
                        key={i}
                        className={`px-3 py-2 text-right font-mono text-xs ${
                          !row.allSame && val !== null
                            ? "font-semibold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {val ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Metric Row ─────────────────────────────────────────────────────────
function MetricCompareRow({
  row,
  runs,
  isExpanded,
  hasDetail,
  copiedCell,
  onToggle,
  onCopy,
}: {
  row: MetricRow;
  runs: RunDetail[];
  isExpanded: boolean;
  hasDetail: boolean;
  copiedCell: string | null;
  onToggle: () => void;
  onCopy: (text: string, key: string) => void;
}) {
  return (
    <>
      <tr
        className={`group border-b transition-colors ${
          hasDetail ? "hover:bg-muted/50 cursor-pointer" : "hover:bg-muted/30"
        } ${isExpanded ? "bg-muted/40" : ""}`}
        onClick={hasDetail ? onToggle : undefined}
      >
        <td className="px-2 py-2.5 text-center">
          {hasDetail && (
            <ChevronRight
              className={`text-muted-foreground inline h-3.5 w-3.5 transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}
            />
          )}
        </td>
        <td className="px-3 py-2.5 font-medium">{row.displayName}</td>
        {row.values.map((v, i) => {
          const key = `${row.name}_${i}`;
          const isBest = row.bestIdx === i;
          return (
            <td key={i} className="group/cell relative px-3 py-2.5 text-right">
              {v !== null ? (
                <span
                  className={`font-mono ${isBest ? "font-bold text-green-600 dark:text-green-400" : ""}`}
                >
                  {v.toFixed(4)}
                  {row.stdevs[i] !== null && (
                    <span className="text-muted-foreground ml-1 text-[10px]">
                      ±{row.stdevs[i]!.toFixed(4)}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
              {v !== null && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy(v.toFixed(4), key);
                  }}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 -translate-y-1/2 rounded p-0.5 opacity-0 transition-opacity group-hover/cell:opacity-100"
                  title="Copy"
                >
                  {copiedCell === key ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              )}
            </td>
          );
        })}
      </tr>

      {/* Expanded per-fold detail */}
      {isExpanded && (
        <tr className="bg-muted/20 border-b">
          <td />
          <td colSpan={runs.length + 1} className="px-3 py-3">
            <PerFoldCompare metricName={row.name} runs={runs} />
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Per-fold side-by-side bars ─────────────────────────────────────────
function PerFoldCompare({
  metricName,
  runs,
}: {
  metricName: string;
  runs: RunDetail[];
}) {
  const foldData = useMemo(() => {
    return runs.map((run, idx) => {
      const ev = run.output_data?.evaluation?.find(
        (e) => e.name === metricName,
      );
      const folds = ev?.per_fold?.flat().filter((v) => !isNaN(v)) ?? [];
      return {
        runId: run.run_id,
        color: RUN_COLORS[idx % RUN_COLORS.length],
        folds,
      };
    });
  }, [runs, metricName]);

  const maxFolds = Math.max(...foldData.map((d) => d.folds.length));
  const allValues = foldData.flatMap((d) => d.folds);
  const maxVal = allValues.length > 0 ? Math.max(...allValues) : 1;

  if (maxFolds === 0) {
    return (
      <p className="text-muted-foreground text-xs">
        No per-fold data available for this metric.
      </p>
    );
  }

  return (
    <div>
      <h4 className="text-muted-foreground mb-2 text-xs font-medium">
        Per Fold Comparison
      </h4>
      <div className="flex items-end gap-2" style={{ height: 80 }}>
        {Array.from({ length: maxFolds }, (_, foldIdx) => (
          <div
            key={foldIdx}
            className="flex flex-1 items-end justify-center gap-0.5"
          >
            {foldData.map((rd) => {
              const val = rd.folds[foldIdx];
              const pct = val != null ? (val / maxVal) * 100 : 0;
              return (
                <div
                  key={rd.runId}
                  className="group relative w-full max-w-[10px]"
                  style={{ height: "80px" }}
                >
                  <div
                    className="absolute bottom-0 hidden rounded bg-slate-800 px-1 py-0.5 text-[9px] whitespace-nowrap text-white shadow group-hover:block"
                    style={{ bottom: `${Math.max(pct, 3) + 5}%` }}
                  >
                    {val?.toFixed(4) ?? "—"}
                  </div>
                  <div
                    className="absolute bottom-0 w-full rounded-t-sm transition-opacity hover:opacity-80"
                    style={{
                      height: `${Math.max(pct, 2)}%`,
                      backgroundColor: rd.color,
                    }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* Fold labels */}
      <div className="mt-1 flex gap-2">
        {Array.from({ length: maxFolds }, (_, i) => (
          <div
            key={i}
            className="text-muted-foreground flex-1 text-center text-[8px]"
          >
            F{i + 1}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-3">
        {foldData.map((rd) => (
          <span key={rd.runId} className="flex items-center gap-1 text-[10px]">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: rd.color }}
            />
            Run #{rd.runId}
          </span>
        ))}
      </div>
    </div>
  );
}
