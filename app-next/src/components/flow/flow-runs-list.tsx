"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FlaskConical,
  Clock,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Flow } from "@/types/flow";
import { searchFlowRuns } from "@/app/actions/flows";

// Helper to get metric value from array
function getMetric(evaluations: any[] = [], name: string): number | undefined {
  const metric = evaluations.find((e) => e.evaluation_measure === name);
  return metric ? metric.value : undefined;
}

interface FlowRun {
  run_id: number;
  run_task: {
    task_id: number;
    source_data?: {
      name: string;
      data_id: number;
    };
  };
  uploader: string;
  uploader_id: number;
  date: string;
  evaluations?: Array<{
    evaluation_measure: string;
    value?: number;
  }>;
}

interface FlowRunsListProps {
  flow: Flow;
  runCount: number;
}

// Format relative time
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) {
    return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
  }
  if (diffDays >= 30) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
  if (diffDays >= 7) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }
  return "Today";
}

export function FlowRunsList({ flow, runCount }: FlowRunsListProps) {
  const [runs, setRuns] = useState<FlowRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const totalItems = flow.runs || runCount;
  const totalPages = Math.ceil(totalItems / pageSize);

  useEffect(() => {
    async function fetchRuns() {
      if (totalItems === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await searchFlowRuns(flow.flow_id, {
          query: {},
          sort: [{ date: { order: "desc" } }],
          from: page * pageSize,
          size: pageSize,
          _source: [
            "run_id",
            "run_task",
            "uploader",
            "uploader_id",
            "date",
            "evaluations",
          ],
        });

        const fetchedRuns: FlowRun[] = data.hits.hits.map(
          (hit: { _source: FlowRun }) => hit._source,
        );

        setRuns(fetchedRuns);
      } catch (err) {
        console.error("Error fetching runs:", err);
        setError("Failed to load runs");
      } finally {
        setLoading(false);
      }
    }

    fetchRuns();
  }, [flow.flow_id, totalItems, page]);

  if (totalItems === 0) {
    return (
      <div className="py-12 text-center">
        <FlaskConical className="text-muted-foreground mx-auto mb-4 h-12 w-12 opacity-50" />
        <h3 className="text-lg font-semibold">No Runs Yet</h3>
        <p className="text-muted-foreground mt-2">This flow has no runs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Runs List */}
          <div className="divide-y rounded-lg border">
            {runs.map((run, index) => (
              <RunListItem
                key={run.run_id}
                run={run}
                rank={page * pageSize + index + 1}
                flowName={flow.name}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-muted-foreground text-xs">
                Showing {page * pageSize + 1} to{" "}
                {Math.min((page + 1) * pageSize, totalItems)} of{" "}
                {totalItems.toLocaleString()} runs
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="h-8 text-xs"
                >
                  <ChevronLeft className="mr-1 h-3 w-3" />
                  Previous
                </Button>
                <span className="text-muted-foreground px-2 text-xs">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                  className="h-8 text-xs"
                >
                  Next
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Individual Run List Item
function RunListItem({
  run,
  rank,
  flowName,
}: {
  run: FlowRun;
  rank: number;
  flowName: string;
}) {
  const acc = getMetric(run.evaluations, "predictive_accuracy");
  const auc = getMetric(run.evaluations, "area_under_roc_curve");
  const rmse = getMetric(run.evaluations, "root_mean_squared_error");

  const datasetName = run.run_task?.source_data?.name || "Unknown Dataset";
  const taskId = run.run_task?.task_id;

  return (
    <Link
      href={`/runs/${run.run_id}`}
      className="block px-4 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
    >
      {/* Flow Name + Dataset */}
      <div className="flex items-start gap-2">
        <FlaskConical className="mt-1 h-4 w-4 shrink-0 text-[#3b82f6]" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-slate-900 dark:text-slate-100">
            {flowName} on {datasetName}
          </h3>
          <p className="text-muted-foreground truncate text-sm">
            {taskId && <>Task #{taskId} • </>}
            by {run.uploader || "Unknown"}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 pl-6 text-sm">
        <span className="text-muted-foreground">#{rank}</span>

        {acc !== undefined && (
          <span>
            <span className="font-medium">ACC</span>{" "}
            <span className="text-slate-700 dark:text-slate-300">
              {acc.toFixed(4)}
            </span>
          </span>
        )}

        {auc !== undefined && (
          <span>
            <span className="font-medium">AUC</span>{" "}
            <span className="text-slate-700 dark:text-slate-300">
              {auc.toFixed(4)}
            </span>
          </span>
        )}

        {rmse !== undefined && (
          <span>
            <span className="font-medium">RMSE</span>{" "}
            <span className="text-slate-700 dark:text-slate-300">
              {rmse.toFixed(4)}
            </span>
          </span>
        )}

        <span className="text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatRelativeTime(run.date)}
        </span>
      </div>
    </Link>
  );
}
