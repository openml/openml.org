"use client";

import Link from "next/link";
import {
  FlaskConical,
  Calendar,
  Hash,
  Target,
  Trophy,
  Tag,
  Heart,
  CloudDownload,
  Play,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/ui/like-button";
import { TaskConfigSection } from "./task-config-section";
import { TaskDatasetSection } from "./task-dataset-section";
import { TaskInfoSection } from "./task-info-section";
import type { Task } from "@/types/task";

interface TaskHeaderProps {
  task: Task;
  runCount: number;
}

export function TaskHeader({ task, runCount }: TaskHeaderProps) {
  const datasetName = task.source_data?.name || "Unknown Dataset";
  const datasetId = task.source_data?.data_id;
  const taskType = task.tasktype?.name || task.task_type || "Unknown Task Type";
  const targetFeature =
    task.target_feature || task.input?.source_data?.data_set?.target_feature;
  const estimation =
    task.estimation_procedure?.type || task.input?.estimation_procedure?.type;

  // Date formatting
  const uploadDate = task.upload_date
    ? new Date(task.upload_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  // Tags
  const tags = task.tag ?? [];

  // Stats - use runs as proxy since likes/downloads not in Task type
  const likes = 0; // TODO: Add to Task type when API supports it
  const downloads = 0; // TODO: Add to Task type when API supports it

  return (
    <header className="space-y-6 border-b p-0">
      {/* LINE 1: Task Icon + Title */}
      <div className="flex items-start gap-3">
        <Trophy
          className="h-9 w-9 shrink-0"
          style={{ color: "#FFA726" }}
          aria-hidden="true"
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {taskType}
          </h1>
        </div>
      </div>

      {/* LINE 2: Task Configuration, Dataset, Info (deduplicated) */}
      <div className="grid gap-4 md:grid-cols-3">
        <TaskConfigSection task={task} />
        <TaskDatasetSection task={task} />
        <TaskInfoSection task={task} />
      </div>

      {/* LINE 4: Tags Row */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pl-6">
          <Tag className="text-muted-foreground h-4 w-4" />
          {/* Show tags responsively */}
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 7).map((tag, idx) => (
              <a
                key={`${tag}-${idx}`}
                href={`/search?type=task&tag=${encodeURIComponent(tag)}`}
              >
                <Badge
                  variant="secondary"
                  className="border-accent hover:bg-primary/10 hover:text-primary cursor-pointer border text-xs transition-colors"
                >
                  {tag}
                </Badge>
              </a>
            ))}
            {tags.length > 7 && (
              <span className="text-muted-foreground text-xs">
                +{tags.length - 7} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* LINE 5: Statistics Bar - Kaggle style */}
      <div className="bg-accent flex flex-wrap items-center justify-around gap-6 rounded-lg p-2 dark:bg-slate-700">
        <Stat value={runCount.toLocaleString()} label="Runs" />
        <Stat value={likes.toString()} label="Likes" />
        <Stat value={downloads.toString()} label="Downloads" />
        {task.task_type_id && (
          <Stat value={`Type ${task.task_type_id}`} label="Task Type" />
        )}
      </div>

      {/* LINE 6: Action Buttons */}
      <div className="mt-2 mb-4 flex flex-wrap items-center justify-end gap-2 sm:gap-3 md:gap-5">
        {/* Run Experiment */}
        <Button variant="outline" className="dark:border-slate-400" disabled>
          <Play className="mr-2 h-4 w-4" />
          Run Experiment
        </Button>

        {/* Like Button */}
        <LikeButton
          entityType="task"
          entityId={task.task_id}
          initialLikes={likes}
          showCount={true}
          size="md"
        />
      </div>
    </header>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-foreground font-bold sm:text-[16px] md:text-[14px] lg:text-lg xl:text-xl">
        {value}
      </span>
      <span className="text-muted-foreground text-[12px] lg:text-sm">
        {label}
      </span>
    </div>
  );
}
