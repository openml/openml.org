"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Table2,
  Download,
  ClipboardCopy,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MetricItemWithCharts } from "./metric-item";
import { RunMetricsTable } from "./run-metrics-table";

interface Evaluation {
  name: string;
  value: string | number;
  stdev?: string | number;
  array_data?: Record<string, string | number>;
  per_fold?: Array<number | number[]>;
}

interface Run {
  output_data?: {
    evaluation?: Evaluation[];
  };
}

interface RunMetricsSectionProps {
  run: Run;
}

type ViewMode = "cards" | "table";

const ITEMS_PER_PAGE = 20;

// ─── Export helpers ─────────────────────────────────────────────────────
function evaluationsToCSV(evaluations: Evaluation[]): string {
  const header = "metric,value,stdev,fold_count";
  const rows = evaluations.map((e) => {
    const v =
      typeof e.value === "number" ? e.value : parseFloat(String(e.value));
    const s = e.stdev
      ? typeof e.stdev === "number"
        ? e.stdev
        : parseFloat(String(e.stdev))
      : "";
    const folds = e.per_fold?.flat().length ?? 0;
    return `${e.name},${isNaN(v) ? e.value : v.toFixed(4)},${s === "" ? "" : (s as number).toFixed(4)},${folds || ""}`;
  });
  return [header, ...rows].join("\n");
}

function evaluationsToJSON(evaluations: Evaluation[]): string {
  const data = evaluations.map((e) => {
    const v =
      typeof e.value === "number" ? e.value : parseFloat(String(e.value));
    const s = e.stdev
      ? typeof e.stdev === "number"
        ? e.stdev
        : parseFloat(String(e.stdev))
      : null;
    return {
      metric: e.name,
      value: isNaN(v) ? e.value : Number(v.toFixed(4)),
      stdev: s !== null && !isNaN(s) ? Number(s.toFixed(4)) : null,
      fold_count: e.per_fold?.flat().length ?? 0,
      ...(e.array_data ? { per_class: e.array_data } : {}),
      ...(e.per_fold ? { per_fold: e.per_fold } : {}),
    };
  });
  return JSON.stringify(data, null, 2);
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function RunMetricsSection({ run }: RunMetricsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [collapsedMetrics, setCollapsedMetrics] = useState<Set<string>>(
    new Set(),
  );
  const [focusIdx, setFocusIdx] = useState(-1);
  const [exportCopied, setExportCopied] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const toggleMetric = useCallback((name: string) => {
    setCollapsedMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  // Memoize evaluations to prevent unnecessary re-renders
  const evaluations = useMemo(
    () => run.output_data?.evaluation || [],
    [run.output_data?.evaluation],
  );

  // Filter evaluations based on search term
  const filteredEvaluations = useMemo(() => {
    if (!searchTerm.trim()) return evaluations;
    const term = searchTerm.toLowerCase();
    return evaluations.filter((e) => e.name.toLowerCase().includes(term));
  }, [evaluations, searchTerm]);

  // Pagination (cards only)
  const totalPages = Math.ceil(filteredEvaluations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvaluations = filteredEvaluations.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    setFocusIdx(-1);
  };

  // ─── Export actions ────────────────────────────────────────────────────
  const handleExportCSV = useCallback(() => {
    const csv = evaluationsToCSV(filteredEvaluations);
    downloadBlob(csv, "metrics.csv", "text/csv");
    setExportOpen(false);
  }, [filteredEvaluations]);

  const handleExportJSON = useCallback(() => {
    const json = evaluationsToJSON(filteredEvaluations);
    downloadBlob(json, "metrics.json", "application/json");
    setExportOpen(false);
  }, [filteredEvaluations]);

  const handleCopyTable = useCallback(() => {
    const lines = filteredEvaluations.map((e) => {
      const v =
        typeof e.value === "number" ? e.value : parseFloat(String(e.value));
      const s = e.stdev
        ? typeof e.stdev === "number"
          ? e.stdev
          : parseFloat(String(e.stdev))
        : null;
      const folds = e.per_fold?.flat().length ?? 0;
      return `${e.name}\t${isNaN(v) ? e.value : v.toFixed(4)}\t${s !== null && !isNaN(s) ? `±${s.toFixed(4)}` : ""}\t${folds || ""}`;
    });
    const header = "Metric\tValue\tStdev\tFolds";
    navigator.clipboard.writeText([header, ...lines].join("\n"));
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 1500);
    setExportOpen(false);
  }, [filteredEvaluations]);

  // Close export dropdown on outside click
  useEffect(() => {
    if (!exportOpen) return;
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [exportOpen]);

  // ─── Keyboard navigation ──────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        if (e.key === "Escape") {
          (e.target as HTMLElement).blur();
          setSearchTerm("");
          setCurrentPage(1);
          setFocusIdx(-1);
          e.preventDefault();
        }
        return;
      }

      const total =
        viewMode === "cards"
          ? paginatedEvaluations.length
          : filteredEvaluations.length;

      switch (e.key) {
        case "j":
        case "ArrowDown":
          e.preventDefault();
          setFocusIdx((prev) => Math.min(prev + 1, total - 1));
          break;
        case "k":
        case "ArrowUp":
          e.preventDefault();
          setFocusIdx((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          if (focusIdx >= 0) {
            e.preventDefault();
            const evalName =
              viewMode === "cards"
                ? paginatedEvaluations[focusIdx]?.name
                : filteredEvaluations[focusIdx]?.name;
            if (evalName) toggleMetric(evalName);
          }
          break;
        case "/":
          e.preventDefault();
          searchRef.current?.focus();
          break;
        case "Escape":
          setFocusIdx(-1);
          break;
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [
    viewMode,
    paginatedEvaluations,
    filteredEvaluations,
    focusIdx,
    toggleMetric,
  ]);

  // Scroll focused card into view
  useEffect(() => {
    if (viewMode !== "cards" || focusIdx < 0) return;
    const el = listRef.current?.children[focusIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [focusIdx, viewMode]);

  if (evaluations.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm">
        No evaluation metrics available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls bar */}
      <div className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-10 flex flex-col gap-3 border-b pb-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        {/* Left: search */}
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            ref={searchRef}
            type="text"
            placeholder="Search metrics… (press /)"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Right: view toggle + export + pagination */}
        <div className="flex items-center gap-2 text-sm">
          {/* View toggle */}
          <div className="border-input flex rounded-md border">
            <button
              onClick={() => setViewMode("cards")}
              className={`rounded-l-md px-2 py-1.5 transition-colors ${
                viewMode === "cards"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              title="Card view"
              aria-label="Card view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`rounded-r-md px-2 py-1.5 transition-colors ${
                viewMode === "table"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              title="Table view"
              aria-label="Table view"
            >
              <Table2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Export dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setExportOpen((p) => !p)}
              className="border-input hover:bg-muted flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs transition-colors"
              title="Export metrics"
              aria-label="Export metrics"
            >
              {exportCopied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">Export</span>
            </button>
            {exportOpen && (
              <div className="bg-popover text-popover-foreground absolute top-full right-0 z-20 mt-1 w-44 rounded-md border p-1 shadow-md">
                <button
                  onClick={handleExportCSV}
                  className="hover:bg-muted flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs"
                >
                  <Download className="h-3 w-3" />
                  Download CSV
                </button>
                <button
                  onClick={handleExportJSON}
                  className="hover:bg-muted flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs"
                >
                  <Download className="h-3 w-3" />
                  Download JSON
                </button>
                <button
                  onClick={handleCopyTable}
                  className="hover:bg-muted flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs"
                >
                  <ClipboardCopy className="h-3 w-3" />
                  Copy to Clipboard
                </button>
              </div>
            )}
          </div>

          {/* Count + pagination (cards only) */}
          <span className="text-muted-foreground hidden sm:inline">
            {viewMode === "cards" ? (
              <>
                {startIndex + 1}–
                {Math.min(
                  startIndex + ITEMS_PER_PAGE,
                  filteredEvaluations.length,
                )}{" "}
                of {filteredEvaluations.length}
              </>
            ) : (
              <>{filteredEvaluations.length} metrics</>
            )}
            {searchTerm && ` (filtered from ${evaluations.length})`}
          </span>

          {viewMode === "cards" && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-2 text-sm">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* View body */}
      {viewMode === "table" ? (
        <RunMetricsTable evaluations={evaluations} searchTerm={searchTerm} />
      ) : (
        <div className="space-y-4" ref={listRef}>
          {paginatedEvaluations.map((evaluation, idx) => (
            <div
              key={evaluation.name}
              className={
                focusIdx === idx ? "ring-primary/50 rounded-lg ring-2" : ""
              }
            >
              <MetricItemWithCharts
                evaluation={evaluation}
                isCollapsed={collapsedMetrics.has(evaluation.name)}
                onToggle={toggleMetric}
              />
            </div>
          ))}
        </div>
      )}

      {/* Keyboard hint */}
      <div className="text-muted-foreground flex items-center justify-center gap-3 border-t pt-3 text-[10px]">
        <span>
          <kbd className="bg-muted rounded px-1 py-0.5 font-mono">j</kbd>
          <kbd className="bg-muted ml-0.5 rounded px-1 py-0.5 font-mono">
            k
          </kbd>{" "}
          navigate
        </span>
        <span>
          <kbd className="bg-muted rounded px-1 py-0.5 font-mono">Enter</kbd>{" "}
          expand
        </span>
        <span>
          <kbd className="bg-muted rounded px-1 py-0.5 font-mono">/</kbd> search
        </span>
        <span>
          <kbd className="bg-muted rounded px-1 py-0.5 font-mono">Esc</kbd>{" "}
          clear
        </span>
      </div>
    </div>
  );
}
