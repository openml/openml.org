"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Trophy,
  Medal,
  ArrowUpRight,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Zap,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

// Available evaluation measures with metadata
const EVALUATION_MEASURES = [
  { value: "predictive_accuracy", label: "Accuracy", lowerIsBetter: false },
  { value: "area_under_roc_curve", label: "AUC", lowerIsBetter: false },
  { value: "f_measure", label: "F-Measure", lowerIsBetter: false },
  { value: "precision", label: "Precision", lowerIsBetter: false },
  { value: "recall", label: "Recall", lowerIsBetter: false },
  { value: "kappa", label: "Kappa", lowerIsBetter: false },
  { value: "root_mean_squared_error", label: "RMSE", lowerIsBetter: true },
  { value: "mean_absolute_error", label: "MAE", lowerIsBetter: true },
] as const;

interface LeaderboardRun {
  run_id: number;
  flow_name: string;
  flow_id: number;
  uploader: string;
  uploader_id: number;
  date: string;
  evaluations: {
    predictive_accuracy?: number;
    area_under_roc_curve?: number;
    f_measure?: number;
    root_mean_squared_error?: number;
    mean_absolute_error?: number;
    [key: string]: number | undefined;
  };
}

interface TaskLeaderboardSectionProps {
  task: Task;
  runCount: number;
  className?: string;
}

// Helper to get medal color for top 3
function getMedalColor(rank: number): string {
  switch (rank) {
    case 1:
      return "text-yellow-500";
    case 2:
      return "text-gray-400";
    case 3:
      return "text-amber-600";
    default:
      return "text-muted-foreground";
  }
}

// Helper to format score
function formatScore(score: number | undefined): string {
  if (score === undefined || score === null) return "—";
  return (score * 100).toFixed(2) + "%";
}

// Helper to format RMSE/MAE (lower is better)
function formatError(error: number | undefined): string {
  if (error === undefined || error === null) return "—";
  return error.toFixed(4);
}

/**
 * TaskLeaderboardSection Component
 *
 * Displays the analysis/leaderboard for a task:
 * - Top performing models ranked by evaluation measure
 * - Performance visualization
 * - Links to detailed runs
 */
export function TaskLeaderboardSection({
  task,
  runCount,
  className,
}: TaskLeaderboardSectionProps) {
  // Track leaderboards for each measure
  const [leaderboards, setLeaderboards] = useState<
    Record<string, LeaderboardRun[]>
  >({});
  const [loadingMeasures, setLoadingMeasures] = useState<Set<string>>(
    new Set(),
  );
  const [errorMeasures, setErrorMeasures] = useState<Set<string>>(new Set());
  const [availableMeasures, setAvailableMeasures] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // Determine the default measure based on task type
  const defaultMeasure =
    task.task_type_id === 1 || task.task_type_id === 2
      ? "predictive_accuracy"
      : "root_mean_squared_error";

  const [activeMeasure, setActiveMeasure] = useState<string>(defaultMeasure);

  // Fetch leaderboard for a specific measure
  const fetchLeaderboard = useCallback(
    async (measure: string) => {
      if (runCount === 0) return;

      const measureConfig = EVALUATION_MEASURES.find(
        (m) => m.value === measure,
      );
      const isLowerBetter = measureConfig?.lowerIsBetter ?? false;

      try {
        setLoadingMeasures((prev) => new Set(prev).add(measure));
        setErrorMeasures((prev) => {
          const next = new Set(prev);
          next.delete(measure);
          return next;
        });

        const sortOrder = isLowerBetter ? "asc" : "desc";
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            indexName: "run",
            esQuery: {
              query: {
                bool: {
                  must: [
                    { term: { task_id: task.task_id } },
                    { exists: { field: `evaluations.${measure}` } },
                  ],
                },
              },
              sort: [
                {
                  [`evaluations.${measure}`]: {
                    order: sortOrder,
                    unmapped_type: "double",
                  },
                },
              ],
              size: 10,
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
          throw new Error("Failed to fetch leaderboard");
        }

        const data = await response.json();
        const runs: LeaderboardRun[] = data.hits.hits.map(
          (hit: { _source: LeaderboardRun }) => hit._source,
        );

        setLeaderboards((prev) => ({ ...prev, [measure]: runs }));
      } catch (err) {
        console.error(`Error fetching leaderboard for ${measure}:`, err);
        setErrorMeasures((prev) => new Set(prev).add(measure));
      } finally {
        setLoadingMeasures((prev) => {
          const next = new Set(prev);
          next.delete(measure);
          return next;
        });
      }
    },
    [task.task_id, runCount],
  );

  // Discover which measures have data for this task
  useEffect(() => {
    async function discoverMeasures() {
      if (runCount === 0) {
        setInitialLoading(false);
        return;
      }

      try {
        // Query to find which evaluation measures exist for this task
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
              size: 0,
              aggs: {
                available_measures: {
                  nested: {
                    path: "evaluations_array",
                  },
                  aggs: {
                    measures: {
                      terms: {
                        field: "evaluations_array.evaluation_measure",
                        size: 50,
                      },
                    },
                  },
                },
              },
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const buckets =
            data.aggregations?.available_measures?.measures?.buckets || [];
          const measures = buckets
            .map((b: { key: string }) => b.key)
            .filter((m: string) =>
              EVALUATION_MEASURES.some((em) => em.value === m),
            );

          if (measures.length > 0) {
            setAvailableMeasures(measures);
            // Set active measure to first available or default
            const initialMeasure = measures.includes(defaultMeasure)
              ? defaultMeasure
              : measures[0];
            setActiveMeasure(initialMeasure);
          } else {
            // Fallback: try all known measures
            setAvailableMeasures(
              EVALUATION_MEASURES.map((m) => m.value) as unknown as string[],
            );
          }
        }
      } catch (err) {
        console.error("Error discovering measures:", err);
        // Fallback to common measures
        setAvailableMeasures(
          EVALUATION_MEASURES.map((m) => m.value) as unknown as string[],
        );
      } finally {
        setInitialLoading(false);
      }
    }

    discoverMeasures();
  }, [task.task_id, runCount, defaultMeasure]);

  // Fetch leaderboard when active measure changes
  useEffect(() => {
    if (activeMeasure && !leaderboards[activeMeasure] && runCount > 0) {
      fetchLeaderboard(activeMeasure);
    }
  }, [activeMeasure, leaderboards, fetchLeaderboard, runCount]);

  const currentLeaderboard = leaderboards[activeMeasure] || [];
  const isCurrentLoading = loadingMeasures.has(activeMeasure);
  const hasCurrentError = errorMeasures.has(activeMeasure);
  const currentMeasureConfig = EVALUATION_MEASURES.find(
    (m) => m.value === activeMeasure,
  );
  const measureLabel = currentMeasureConfig?.label || activeMeasure;
  const isLowerBetter = currentMeasureConfig?.lowerIsBetter ?? false;

  // Get tabs for available measures
  const measureTabs = availableMeasures
    .map((m) => EVALUATION_MEASURES.find((em) => em.value === m))
    .filter(Boolean) as (typeof EVALUATION_MEASURES)[number][];

  // Loading state
  if (initialLoading) {
    return (
      <section id="analysis" className={cn("scroll-mt-20", className)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
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
      <section id="analysis" className={cn("scroll-mt-20", className)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TrendingUp className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="text-lg font-medium">No runs yet</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Be the first to run this task and appear on the leaderboard!
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link
                  href={`https://www.openml.org/t/${task.task_id}/get-started`}
                  target="_blank"
                >
                  Get Started
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Render leaderboard content for a measure
  const renderLeaderboardContent = () => {
    if (isCurrentLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      );
    }

    if (hasCurrentError) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="text-destructive mb-4 h-12 w-12" />
          <p className="text-destructive">Failed to load leaderboard data</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => fetchLeaderboard(activeMeasure)}
          >
            Retry
          </Button>
        </div>
      );
    }

    if (currentLeaderboard.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <TrendingUp className="text-muted-foreground mb-4 h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            No runs with {measureLabel} evaluation for this task
          </p>
        </div>
      );
    }

    return (
      <>
        {/* Top 3 Podium */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {currentLeaderboard.slice(0, 3).map((run, index) => {
            const rank = index + 1;
            const score = run.evaluations?.[activeMeasure];
            return (
              <Link
                key={run.run_id}
                href={`/runs/${run.run_id}`}
                className="block"
              >
                <Card
                  className={cn(
                    "relative cursor-pointer overflow-hidden transition-all hover:shadow-md",
                    rank === 1
                      ? "border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/20"
                      : "",
                  )}
                >
                  <div className="absolute top-2 right-2">
                    <Medal
                      className={cn("h-6 w-6", getMedalColor(rank))}
                      fill={
                        rank <= 3
                          ? getMedalColor(rank).replace("text-", "")
                          : "none"
                      }
                    />
                  </div>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-muted-foreground mb-2 text-sm font-medium">
                        #{rank}
                      </div>
                      <Avatar className="mx-auto mb-3 h-12 w-12">
                        <AvatarImage
                          src={`https://www.openml.org/img/${run.uploader_id}`}
                          alt={run.uploader}
                        />
                        <AvatarFallback>
                          {run.uploader?.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <p
                        className="truncate text-sm font-medium"
                        title={run.flow_name}
                      >
                        {run.flow_name?.split(".").pop() || "Unknown Flow"}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        by {run.uploader}
                      </p>
                      <div className="mt-3">
                        <span
                          className={cn(
                            "text-lg font-bold",
                            rank === 1
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "",
                          )}
                        >
                          {isLowerBetter
                            ? formatError(score)
                            : formatScore(score)}
                        </span>
                        <span className="text-muted-foreground ml-1 text-xs">
                          {measureLabel}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Full Leaderboard Table */}
        {currentLeaderboard.length > 3 && (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Uploader</TableHead>
                  <TableHead className="text-right">{measureLabel}</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLeaderboard.slice(3).map((run, index) => {
                  const rank = index + 4;
                  const score = run.evaluations?.[activeMeasure];
                  return (
                    <TableRow key={run.run_id}>
                      <TableCell className="font-medium">#{rank}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-purple-500" />
                          <span
                            className="max-w-[200px] truncate"
                            title={run.flow_name}
                          >
                            {run.flow_name?.split(".").pop() || "Unknown"}
                          </span>
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
                      <TableCell className="text-right font-mono">
                        {isLowerBetter
                          ? formatError(score)
                          : formatScore(score)}
                      </TableCell>
                      <TableCell>
                        <Link href={`/runs/${run.run_id}`}>
                          <Button variant="ghost" size="icon">
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
        )}
      </>
    );
  };

  return (
    <section id="analysis" className={cn("scroll-mt-20", className)}>
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Leaderboards
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {runCount.toLocaleString()} runs
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {measureTabs.length > 1 ? (
            <Tabs
              value={activeMeasure}
              onValueChange={(value) => setActiveMeasure(value)}
            >
              <TabsList className="mb-6 flex h-auto flex-wrap gap-1">
                {measureTabs.map((measure) => (
                  <TabsTrigger
                    key={measure.value}
                    value={measure.value}
                    className="text-xs"
                  >
                    {measure.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {measureTabs.map((measure) => (
                <TabsContent key={measure.value} value={measure.value}>
                  {renderLeaderboardContent()}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            renderLeaderboardContent()
          )}

          {/* View All Button */}
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link href={`/runs?task_id=${task.task_id}`}>
                View All {runCount.toLocaleString()} Runs
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
