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
import type { Task } from "@/types/task";

interface TaskRun {
  run_id: number;
  flow_name: string;
  flow_id: number;
  task_id: number;
  uploader: string;
  uploader_id: number;
  date: string;
  evaluations?: {
    predictive_accuracy?: number;
    area_under_roc_curve?: number;
    root_mean_squared_error?: number;
    [key: string]: number | undefined;
  };
  input_data?: {
    dataset?: {
      name: string;
    };
  };
}

interface TaskRunsListProps {
  task: Task;
  runCount: number;
}

// Format relative time like "12 years ago"
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

/**
 * TaskRunsList Component
 *
 * Runs tab content matching the original OpenML design:
 * - List of runs with flow name, dataset, uploader, metrics, date
 * - Pagination
 * - Clickable links to run details
 */
export function TaskRunsList({ task, runCount }: TaskRunsListProps) {
  const [runs, setRuns] = useState<TaskRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const totalPages = Math.ceil(runCount / pageSize);

  useEffect(() => {
    async function fetchRuns() {
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
              term: { task_id: task.task_id },
            },
            sort: [{ date: { order: "desc" } }],
            from: page * pageSize,
            size: pageSize,
            _source: [
              "run_id",
              "flow_name",
              "flow_id",
              "task_id",
              "uploader",
              "uploader_id",
              "date",
              "evaluations",
              "input_data",
            ],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch runs");
        }

        const data = await response.json();
        const fetchedRuns: TaskRun[] = data.hits.hits.map(
          (hit: { _source: TaskRun }) => hit._source,
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
  }, [task.task_id, runCount, page]);

  if (runCount === 0) {
    return (
      <div className="py-12 text-center">
        <FlaskConical className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <h3 className="text-lg font-semibold">No Runs Yet</h3>
        <p className="text-muted-foreground mt-2">
          This task has no runs.{" "}
          <Link href="#" className="text-primary hover:underline">
            Learn more
          </Link>{" "}
          about creating runs.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Runs</h2>
        <p className="text-muted-foreground mt-2">
          Runs are evaluations of machine learning models (flows) trained on
          this task. They can be created and shared automatically from supported
          machine learning libraries. They contain the exact hyperparameters
          used, all detailed results, and potentially the trained models.{" "}
          <Link href="#" className="text-primary hover:underline">
            Learn more.
          </Link>
        </p>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
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
                datasetName={task.source_data?.name || "Unknown"}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Showing {page * pageSize + 1} to{" "}
                {Math.min((page + 1) * pageSize, runCount)} of{" "}
                {runCount.toLocaleString()} runs
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <span className="text-muted-foreground px-2 text-sm">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
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
  datasetName,
}: {
  run: TaskRun;
  rank: number;
  datasetName: string;
}) {
  const acc = run.evaluations?.predictive_accuracy;
  const auc = run.evaluations?.area_under_roc_curve;
  const rmse = run.evaluations?.root_mean_squared_error;

  return (
    <Link
      href={`/runs/${run.run_id}`}
      className="block px-4 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
    >
      {/* Flow Name + Dataset */}
      <div className="flex items-start gap-2">
        <FlaskConical className="mt-1 h-4 w-4 shrink-0 text-red-500" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-slate-900 dark:text-slate-100">
            {run.flow_name} on {datasetName}
          </h3>
          <p className="text-muted-foreground truncate text-sm">
            {run.flow_name} on {datasetName} by {run.uploader}
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
