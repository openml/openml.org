"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

const ITEMS_PER_PAGE = 20;

export function RunMetricsSection({ run }: RunMetricsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Pagination
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
  };

  if (evaluations.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm">
        No evaluation metrics available
      </div>
    );
  }

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

  // Convert array_data to chart format
  const getPerClassChartData = (arrayData: Record<string, string | number>) => {
    return Object.entries(arrayData).map(([key, val]) => ({
      name: key,
      value: typeof val === "number" ? val : parseFloat(val),
    }));
  };

  // Convert per_fold to chart format
  const getPerFoldChartData = (perFold: Array<number | number[]>) => {
    const flatValues = perFold.flat();
    return flatValues.map((val, idx) => ({
      name: `Fold ${idx + 1}`,
      value: val,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Search and pagination controls */}
      {evaluations.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search metrics..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              Showing {startIndex + 1}-
              {Math.min(
                startIndex + ITEMS_PER_PAGE,
                filteredEvaluations.length,
              )}{" "}
              of {filteredEvaluations.length}
              {searchTerm && ` (filtered from ${evaluations.length})`}
            </span>
            {totalPages > 1 && (
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
      )}

      {/* Metrics list */}
      {paginatedEvaluations.map((evaluation: Evaluation, index: number) => {
        const value = parseFloat(evaluation.value as string);
        const stdev = evaluation.stdev
          ? parseFloat(evaluation.stdev as string)
          : null;
        const arrayData = evaluation.array_data;
        const perFold = evaluation.per_fold;

        const perClassData = arrayData ? getPerClassChartData(arrayData) : null;
        const perFoldData = perFold ? getPerFoldChartData(perFold) : null;

        return (
          <div key={index} className="rounded-lg border p-4">
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="text-muted-foreground text-sm font-medium">
                {formatMetricName(evaluation.name)}
              </h3>
              <div className="text-right">
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

            {/* Charts row */}
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Per-class chart */}
              {perClassData && perClassData.length > 0 && (
                <div>
                  <h4 className="text-muted-foreground mb-2 text-xs font-medium">
                    Per Class
                  </h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={perClassData} layout="vertical">
                        <XAxis
                          type="number"
                          domain={[0, 1]}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          tick={{ fontSize: 10 }}
                          width={80}
                        />
                        <Tooltip
                          formatter={(val: number) => val.toFixed(4)}
                          contentStyle={{ fontSize: 12 }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {perClassData.map((_, idx) => (
                            <Cell
                              key={`cell-${idx}`}
                              fill={COLORS[idx % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Per-fold chart */}
              {perFoldData && perFoldData.length > 0 && (
                <div>
                  <h4 className="text-muted-foreground mb-2 text-xs font-medium">
                    Per Fold
                  </h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={perFoldData}>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} domain={[0, "auto"]} />
                        <Tooltip
                          formatter={(val: number) => val.toFixed(4)}
                          contentStyle={{ fontSize: 12 }}
                        />
                        <Bar
                          dataKey="value"
                          fill="#6b7280"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
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
                          : parseFloat(val).toFixed(4)}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
