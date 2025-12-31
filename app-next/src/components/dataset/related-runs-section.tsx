"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FlaskConical,
  Play,
  Clock,
  Trophy,
  ExternalLink,
  ChevronRight,
  Loader2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import type { Dataset } from "@/types/dataset";

interface Run {
  run_id: number;
  flow_name: string;
  flow_id: number;
  task_id: number;
  uploader: string;
  uploader_id: number;
  date: string;
  evaluations?: {
    accuracy?: number;
    predictive_accuracy?: number;
    area_under_roc_curve?: number;
    f_measure?: number;
    [key: string]: number | undefined;
  };
}

interface RelatedRunsSectionProps {
  dataset: Dataset;
  runCount: number;
  taskCount: number;
}

/**
 * RelatedRunsSection Component
 *
 * Displays experiment runs and tasks related to this dataset.
 * Features:
 * - Summary of tasks and runs
 * - Top performing runs (leaderboard preview)
 * - Recent runs list
 * - Links to full task/run search
 */
export function RelatedRunsSection({
  dataset,
  runCount,
  taskCount,
}: RelatedRunsSectionProps) {
  const [recentRuns] = useState<Run[]>([]);
  const [loading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // Placeholder: In the future, fetch recent runs from API
  // useEffect(() => {
  //   async function fetchRecentRuns() {
  //     try {
  //       setLoading(true);
  //       const response = await fetch(`/api/datasets/${dataset.data_id}/runs?limit=5`);
  //       const data = await response.json();
  //       setRecentRuns(data.runs || []);
  //     } catch (err) {
  //       setError("Failed to load recent runs");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   if (runCount > 0) {
  //     fetchRecentRuns();
  //   }
  // }, [dataset.data_id, runCount]);

  const hasExperiments = runCount > 0 || taskCount > 0;

  // Don't render the section if there are no experiments
  if (!hasExperiments) {
    return null;
  }

  return (
    <CollapsibleSection
      id="experiments"
      title="Experiments & Runs"
      description="Machine learning experiments performed on this dataset"
      icon={<FlaskConical className="h-4 w-4 text-red-500" />}
      badge={runCount > 0 ? runCount : undefined}
      defaultOpen={true}
      headerExtra={
        hasExperiments && (
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {taskCount} Tasks
            </Badge>
            <Badge variant="outline" className="text-xs">
              {runCount} Runs
            </Badge>
          </div>
        )
      }
    >
      {hasExperiments ? (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard
              label="Total Tasks"
              value={taskCount.toLocaleString()}
              icon={Play}
              color="text-blue-500"
            />
            <StatCard
              label="Total Runs"
              value={runCount.toLocaleString()}
              icon={FlaskConical}
              color="text-red-500"
            />
            <StatCard
              label="Unique Flows"
              value="—"
              icon={Zap}
              color="text-purple-500"
              placeholder
            />
            <StatCard
              label="Best Accuracy"
              value="—"
              icon={Trophy}
              color="text-yellow-500"
              placeholder
            />
          </div>

          {/* Leaderboard Preview */}
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-sm font-medium">
                <Trophy className="h-4 w-4 text-yellow-500" />
                Top Performing Models
              </h4>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href={`/search?type=run&data_id=${dataset.data_id}&sort=predictive_accuracy&order=desc`}
                >
                  View Leaderboard
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Placeholder for leaderboard */}
            <div className="divide-y rounded-lg border">
              {[1, 2, 3].map((rank) => (
                <LeaderboardRow key={rank} rank={rank} placeholder />
              ))}
            </div>
          </div>

          {/* Recent Runs */}
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-gray-500" />
                Recent Runs
              </h4>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href={`/search?type=run&data_id=${dataset.data_id}&sort=date&order=desc`}
                >
                  View All Runs
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
              </div>
            ) : recentRuns.length > 0 ? (
              <div className="divide-y rounded-lg border">
                {recentRuns.map((run) => (
                  <RunRow key={run.run_id} run={run} />
                ))}
              </div>
            ) : (
              <div className="divide-y rounded-lg border">
                {[1, 2, 3].map((i) => (
                  <RunRowPlaceholder key={i} />
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/tasks?data_id=${dataset.data_id}`}>
                <Play className="mr-2 h-4 w-4" />
                Browse Tasks
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/runs?data_id=${dataset.data_id}`}>
                <FlaskConical className="mr-2 h-4 w-4" />
                Browse Runs
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://www.openml.org/api/v1/task/list/data_id/${dataset.data_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Tasks API
              </a>
            </Button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <FlaskConical className="text-muted-foreground/50 mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-medium">No experiments yet</h3>
          <p className="text-muted-foreground mt-1">
            Be the first to run machine learning experiments on this dataset!
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button size="sm" asChild>
              <Link href={`/tasks/new?data_id=${dataset.data_id}`}>
                <Play className="mr-2 h-4 w-4" />
                Create Task
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://docs.openml.org/Python-start/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn How
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      )}
    </CollapsibleSection>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-gray-500",
  placeholder = false,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color?: string;
  placeholder?: boolean;
}) {
  return (
    <div
      className={`bg-muted/50 rounded-lg border p-4 ${placeholder ? "opacity-50" : ""}`}
    >
      <div className="text-muted-foreground mb-1 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function LeaderboardRow({
  rank,
  run,
  placeholder = false,
}: {
  rank: number;
  run?: Run;
  placeholder?: boolean;
}) {
  if (placeholder) {
    return (
      <div className="text-muted-foreground/50 flex items-center gap-4 p-3">
        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
          <span className="text-sm font-bold">#{rank}</span>
        </div>
        <div className="flex-1">
          <div className="bg-muted h-4 w-32 animate-pulse rounded" />
          <div className="bg-muted mt-1 h-3 w-24 animate-pulse rounded" />
        </div>
        <div className="text-right">
          <div className="bg-muted h-4 w-16 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/runs/${run?.run_id}`}
      className="hover:bg-muted/50 flex items-center gap-4 p-3 transition-colors"
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${
          rank === 1
            ? "bg-yellow-100 text-yellow-700"
            : rank === 2
              ? "bg-gray-100 text-gray-700"
              : rank === 3
                ? "bg-orange-100 text-orange-700"
                : "bg-muted"
        }`}
      >
        <span className="text-sm font-bold">#{rank}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{run?.flow_name}</p>
        <p className="text-muted-foreground text-xs">by {run?.uploader}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-green-600">
          {run?.evaluations?.predictive_accuracy
            ? `${(run.evaluations.predictive_accuracy * 100).toFixed(2)}%`
            : "—"}
        </p>
        <p className="text-muted-foreground text-xs">accuracy</p>
      </div>
    </Link>
  );
}

function RunRow({ run }: { run: Run }) {
  return (
    <Link
      href={`/runs/${run.run_id}`}
      className="hover:bg-muted/50 flex items-center gap-4 p-3 transition-colors"
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={`https://www.openml.org/img/${run.uploader_id}`} />
        <AvatarFallback className="text-xs">
          {run.uploader?.charAt(0)?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{run.flow_name}</p>
        <p className="text-muted-foreground text-xs">
          {new Date(run.date).toLocaleDateString()}
        </p>
      </div>
      <Badge variant="secondary" className="text-xs">
        Run #{run.run_id}
      </Badge>
    </Link>
  );
}

function RunRowPlaceholder() {
  return (
    <div className="text-muted-foreground/50 flex items-center gap-4 p-3">
      <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
      <div className="flex-1">
        <div className="bg-muted h-4 w-40 animate-pulse rounded" />
        <div className="bg-muted mt-1 h-3 w-24 animate-pulse rounded" />
      </div>
      <div className="bg-muted h-5 w-16 animate-pulse rounded" />
    </div>
  );
}
