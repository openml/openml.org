"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import type { Evaluation } from "./metric-item";

// Format metric names — shared with metric-item.tsx
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

type SortField = "name" | "value" | "stdev" | "folds";
type SortDir = "asc" | "desc";

// Must be declared outside component — React 19 forbids creating components during render
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
    return <ArrowUpDown className="ml-1 inline h-3 w-3 opacity-40" />;
  return sortDir === "asc" ? (
    <ArrowUp className="ml-1 inline h-3 w-3" />
  ) : (
    <ArrowDown className="ml-1 inline h-3 w-3" />
  );
}

function parseNum(v: string | number | undefined): number {
  if (v === undefined || v === null) return NaN;
  return typeof v === "number" ? v : parseFloat(String(v));
}

interface RunMetricsTableProps {
  evaluations: Evaluation[];
  searchTerm: string;
}

export function RunMetricsTable({
  evaluations,
  searchTerm,
}: RunMetricsTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Filter
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return evaluations;
    const term = searchTerm.toLowerCase();
    return evaluations.filter((e) => e.name.toLowerCase().includes(term));
  }, [evaluations, searchTerm]);

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name":
          cmp = formatMetricName(a.name).localeCompare(
            formatMetricName(b.name),
          );
          break;
        case "value": {
          const va = parseNum(a.value);
          const vb = parseNum(b.value);
          cmp = (isNaN(va) ? -Infinity : va) - (isNaN(vb) ? -Infinity : vb);
          break;
        }
        case "stdev": {
          const sa = parseNum(a.stdev);
          const sb = parseNum(b.stdev);
          cmp = (isNaN(sa) ? -Infinity : sa) - (isNaN(sb) ? -Infinity : sb);
          break;
        }
        case "folds": {
          const fa = a.per_fold?.flat().length ?? 0;
          const fb = b.per_fold?.flat().length ?? 0;
          cmp = fa - fb;
          break;
        }
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "name" ? "asc" : "desc"); // numbers default desc
    }
  };

  const copyRow = useCallback(
    (e: React.MouseEvent, evaluation: Evaluation, idx: number) => {
      e.stopPropagation();
      const v = parseNum(evaluation.value);
      const s = parseNum(evaluation.stdev);
      const text = !isNaN(s)
        ? `${evaluation.name}: ${v.toFixed(4)} ± ${s.toFixed(4)}`
        : `${evaluation.name}: ${v.toFixed(4)}`;
      navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    },
    [],
  );

  if (sorted.length === 0) {
    return (
      <div className="text-muted-foreground py-6 text-center text-sm">
        No metrics matching &ldquo;{searchTerm}&rdquo;
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full text-sm"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        <thead className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-10 backdrop-blur">
          <tr className="border-b">
            <th className="w-8 px-2 py-2.5" />
            <th
              className="cursor-pointer px-3 py-2.5 text-left text-xs font-medium select-none"
              onClick={() => toggleSort("name")}
            >
              Metric
              <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
            </th>
            <th
              className="cursor-pointer px-3 py-2.5 text-right text-xs font-medium select-none"
              onClick={() => toggleSort("value")}
            >
              Value
              <SortIcon field="value" sortField={sortField} sortDir={sortDir} />
            </th>
            <th
              className="cursor-pointer px-3 py-2.5 text-right text-xs font-medium select-none"
              onClick={() => toggleSort("stdev")}
            >
              ± Stdev
              <SortIcon field="stdev" sortField={sortField} sortDir={sortDir} />
            </th>
            <th
              className="cursor-pointer px-3 py-2.5 text-right text-xs font-medium select-none"
              onClick={() => toggleSort("folds")}
            >
              Folds
              <SortIcon field="folds" sortField={sortField} sortDir={sortDir} />
            </th>
            <th className="w-8 px-2 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((evaluation, idx) => {
            const value = parseNum(evaluation.value);
            const stdev = parseNum(evaluation.stdev);
            const foldCount = evaluation.per_fold?.flat().length ?? 0;
            const hasDetail =
              (evaluation.array_data &&
                Object.keys(evaluation.array_data).length > 0) ||
              foldCount > 0;
            const isExpanded = expandedRow === evaluation.name;

            return (
              <RowWithDetail
                key={evaluation.name}
                evaluation={evaluation}
                idx={idx}
                value={value}
                stdev={stdev}
                foldCount={foldCount}
                hasDetail={hasDetail}
                isExpanded={isExpanded}
                copiedIdx={copiedIdx}
                onToggle={() =>
                  setExpandedRow(isExpanded ? null : evaluation.name)
                }
                onCopy={(e) => copyRow(e, evaluation, idx)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Table Row + Expandable Detail ─────────────────────────────────────
const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

function RowWithDetail({
  evaluation,
  idx,
  value,
  stdev,
  foldCount,
  hasDetail,
  isExpanded,
  copiedIdx,
  onToggle,
  onCopy,
}: {
  evaluation: Evaluation;
  idx: number;
  value: number;
  stdev: number;
  foldCount: number;
  hasDetail: boolean;
  isExpanded: boolean;
  copiedIdx: number | null;
  onToggle: () => void;
  onCopy: (e: React.MouseEvent) => void;
}) {
  return (
    <>
      <tr
        className={`group border-b transition-colors ${
          hasDetail ? "hover:bg-muted/50 cursor-pointer" : "hover:bg-muted/30"
        } ${isExpanded ? "bg-muted/40" : ""}`}
        onClick={hasDetail ? onToggle : undefined}
      >
        {/* Expand chevron */}
        <td className="px-2 py-2.5 text-center">
          {hasDetail ? (
            <ChevronRight
              className={`text-muted-foreground inline h-3.5 w-3.5 transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}
            />
          ) : null}
        </td>
        {/* Metric name */}
        <td className="px-3 py-2.5 font-medium">
          {formatMetricName(evaluation.name)}
        </td>
        {/* Value */}
        <td className="px-3 py-2.5 text-right font-mono font-semibold">
          {!isNaN(value) ? value.toFixed(4) : String(evaluation.value)}
        </td>
        {/* Stdev */}
        <td className="text-muted-foreground px-3 py-2.5 text-right font-mono">
          {!isNaN(stdev) ? `±${stdev.toFixed(4)}` : "—"}
        </td>
        {/* Folds */}
        <td className="text-muted-foreground px-3 py-2.5 text-right font-mono">
          {foldCount > 0 ? foldCount : "—"}
        </td>
        {/* Copy */}
        <td className="px-2 py-2.5 text-center">
          <button
            onClick={onCopy}
            className="text-muted-foreground hover:text-foreground rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
            title="Copy metric value"
            aria-label="Copy metric value"
          >
            {copiedIdx === idx ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </td>
      </tr>

      {/* Expanded detail row */}
      {isExpanded && (
        <tr className="bg-muted/20 border-b">
          <td />
          <td colSpan={5} className="px-3 py-3">
            <ExpandedDetail evaluation={evaluation} />
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Expanded row detail: per-class + per-fold ─────────────────────────
function ExpandedDetail({ evaluation }: { evaluation: Evaluation }) {
  const arrayData = evaluation.array_data;
  const perFold = evaluation.per_fold;
  const hasArray = arrayData && Object.keys(arrayData).length > 0;
  const flatFolds = perFold?.flat().filter((v) => !isNaN(v)) ?? [];
  const hasFolds = flatFolds.length > 0;

  if (!hasArray && !hasFolds) return null;

  return (
    <div
      className={`grid grid-cols-1 gap-6 ${hasArray && hasFolds ? "md:grid-cols-2" : ""}`}
    >
      {/* Per Class */}
      {hasArray && (
        <div>
          <h4 className="text-muted-foreground mb-1.5 text-xs font-medium">
            Per Class
          </h4>
          <div className="space-y-0.5">
            {Object.entries(arrayData!)
              .map(([key, val], i) => {
                const num =
                  typeof val === "number" ? val : parseFloat(String(val));
                return { key, num, fill: COLORS[i % COLORS.length] };
              })
              .filter((d) => !isNaN(d.num))
              .sort((a, b) => b.num - a.num)
              .map((d) => (
                <div key={d.key} className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground w-16 shrink-0 truncate text-right">
                    {d.key}
                  </span>
                  <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-sm bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${Math.max((d.num / Math.max(...Object.values(arrayData!).map((v) => (typeof v === "number" ? v : parseFloat(String(v)))))) * 100, 1)}%`,
                        backgroundColor: d.fill,
                      }}
                    />
                  </div>
                  <span className="w-14 shrink-0 text-right font-mono">
                    {d.num.toFixed(4)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Per Fold */}
      {hasFolds && (
        <div>
          <h4 className="text-muted-foreground mb-1.5 text-xs font-medium">
            Per Fold
          </h4>
          <div className="flex items-end gap-1" style={{ height: 64 }}>
            {flatFolds.map((val, i) => {
              const maxVal = Math.max(...flatFolds);
              const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
              return (
                <div
                  key={i}
                  className="group relative flex flex-1 flex-col items-center justify-end"
                  style={{ height: "100%" }}
                >
                  <div className="absolute -top-5 z-10 hidden rounded bg-slate-800 px-1 py-0.5 text-[9px] whitespace-nowrap text-white shadow group-hover:block">
                    {val.toFixed(4)}
                  </div>
                  <div
                    className="w-full max-w-[16px] rounded-t-sm bg-gray-500 transition-opacity hover:opacity-80"
                    style={{ height: `${Math.max(pct, 3)}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-0.5 flex gap-1">
            {flatFolds.map((_, i) => (
              <div
                key={i}
                className="text-muted-foreground flex-1 truncate text-center text-[8px]"
              >
                F{i + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
