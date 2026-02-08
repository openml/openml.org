"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Clock,
  Zap,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  SortDesc,
  FlaskConical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

interface TaskRun {
  run_id: number;
  flow_name: string;
  flow_id: number;
  uploader: string;
  uploader_id: number;
  setup_string?: string;
  date: string;
  evaluations?: {
    predictive_accuracy?: number;
    area_under_roc_curve?: number;
    f_measure?: number;
    root_mean_squared_error?: number;
    mean_absolute_error?: number;
    [key: string]: number | undefined;
  };
}

interface TaskRunsSectionProps {
  task: Task;
  runCount: number;
  className?: string;
}

// Format relative time
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * TaskRunsSection Component
 *
 * Displays recent runs for a task:
 * - Paginated list of runs
 * - Sort by date or performance
 * - Links to individual run details
 */
export function TaskRunsSection({
  task,
  runCount,
  className,
}: TaskRunsSectionProps) {
  const [runs, setRuns] = useState<TaskRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "performance">("date");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // Determine the primary evaluation measure based on task type
  const primaryMeasure =
    task.task_type_id === 1 || task.task_type_id === 2
      ? "predictive_accuracy"
      : "root_mean_squared_error";

  const isLowerBetter = primaryMeasure === "root_mean_squared_error";

  useEffect(() => {
    async function fetchRuns() {
      if (runCount === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Build sort configuration
        let sortConfig;
        if (sortBy === "date") {
          sortConfig = [{ date: { order: "desc" } }];
        } else {
          const sortOrder = isLowerBetter ? "asc" : "desc";
          sortConfig = [
            {
              [`evaluations.${primaryMeasure}`]: {
                order: sortOrder,
                unmapped_type: "double",
              },
            },
          ];
        }

        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            indexName: "run",
            esQuery: {
              query: {
                term: { task_id: task.task_id },
              },
              sort: sortConfig,
              from: page * pageSize,
              size: pageSize,
              _source: [
                "run_id",
                "flow_name",
                "flow_id",
                "uploader",
                "uploader_id",
                "setup_string",
                "evaluations",
                "date",
              ],
            },
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
  }, [task.task_id, runCount, sortBy, page, primaryMeasure, isLowerBetter]);

  // Reset page when sort changes
  useEffect(() => {
    setPage(0);
  }, [sortBy]);

  const totalPages = Math.ceil(runCount / pageSize);

  // Loading state
  if (loading) {
    return (
      <section id="runs" className={cn("scroll-mt-20", className)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-red-500" />
              Recent Runs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // No runs state
  if (runCount === 0) {
    return (
      <section id="runs" className={cn("scroll-mt-20", className)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-red-500" />
              Recent Runs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Play className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="text-lg font-medium">No runs yet</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                No experiments have been run on this task yet.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="runs" className={cn("scroll-mt-20", className)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-red-500" />
              Recent Runs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="text-destructive mb-4 h-12 w-12" />
              <p className="text-destructive">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setPage(0)}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section id="runs" className={cn("scroll-mt-20", className)}>
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <FlaskConical className="h-5 w-5 text-red-500" />
              Runs
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={sortBy}
                onValueChange={(value: "date" | "performance") =>
                  setSortBy(value)
                }
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Most Recent
                    </div>
                  </SelectItem>
                  <SelectItem value="performance">
                    <div className="flex items-center gap-2">
                      <SortDesc className="h-4 w-4" />
                      Best Performance
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Runs Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Run ID</TableHead>
                  <TableHead>Model / Flow</TableHead>
                  <TableHead>Uploader</TableHead>
                  <TableHead className="text-right">
                    {primaryMeasure === "predictive_accuracy"
                      ? "Accuracy"
                      : "RMSE"}
                  </TableHead>
                  <TableHead className="text-right">Date</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map((run) => {
                  const score = run.evaluations?.[primaryMeasure];
                  return (
                    <TableRow key={run.run_id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          #{run.run_id}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 shrink-0 text-purple-500" />
                          <div className="min-w-0">
                            <p
                              className="truncate text-sm font-medium"
                              title={run.flow_name}
                            >
                              {run.flow_name?.split(".").pop() ||
                                "Unknown Flow"}
                            </p>
                            <p className="text-muted-foreground truncate text-xs">
                              Flow #{run.flow_id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={`https://www.openml.org/img/${run.uploader_id}`}
                              alt={run.uploader}
                            />
                            <AvatarFallback className="text-xs">
                              {run.uploader?.charAt(0).toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{run.uploader}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {score !== undefined
                          ? isLowerBetter
                            ? score.toFixed(4)
                            : (score * 100).toFixed(2) + "%"
                          : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-right text-sm">
                        {run.date ? formatRelativeTime(run.date) : "—"}
                      </TableCell>
                      <TableCell>
                        <Link href={`/runs/${run.run_id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Showing {page * pageSize + 1} -{" "}
                {Math.min((page + 1) * pageSize, runCount)} of{" "}
                {runCount.toLocaleString()} runs
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* View All Link */}
          <div className="mt-4 text-center">
            <Button variant="link" asChild>
              <Link
                href={`https://www.openml.org/search?type=run&task_id=${task.task_id}`}
                target="_blank"
              >
                View All Runs on OpenML
                <ExternalLink className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
