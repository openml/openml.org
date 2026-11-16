import Link from "next/link";
import { ENTITY_ICONS, entityColors } from "@/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Calendar,
  Hash,
  Target,
  Tag,
  CloudDownload,
  Settings,
  ThumbsDown,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ClickableTagList } from "@/components/ui/clickable-tag-list";
import type { Task } from "@/types/task";
import { ExperimentMenu } from "@/components/ui/experiment-menu";
import { LikeButton } from "@/components/ui/like-button";
import { EntityActionsMenu } from "@/components/ui/entity-actions-menu";

interface TaskHeaderProps {
  task: Task;
  runCount: number;
}

export function TaskHeader({ task, runCount }: TaskHeaderProps) {
  // Use task.runs (from metadata) if available, otherwise fallback to computed runCount
  const displayRunCount = task.runs || runCount;
  const datasetName = task.source_data?.name || "Unknown Dataset";
  const datasetId = task.source_data?.data_id;
  const taskType = task.tasktype?.name || task.task_type || "Unknown Task Type";
  const targetFeature =
    task.target_feature || task.input?.source_data?.data_set?.target_feature;
  const estimation =
    task.estimation_procedure?.name ||
    task.estimation_procedure?.type ||
    task.input?.estimation_procedure?.type;

  // Date formatting
  // Date formatting
  const rawDate = task.upload_date || task.date;
  const uploadDate = rawDate
    ? new Date(rawDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  // Tags — API may return a single string instead of string[]
  const rawTags = task.tag;
  const tags = Array.isArray(rawTags)
    ? rawTags
    : typeof rawTags === "string"
      ? [rawTags]
      : [];

  // Stats
  const likes = task.nr_of_likes ?? 0;
  const downvotes = task.nr_of_downvotes ?? 0;
  const issues = task.nr_of_issues ?? 0;
  const downloads = task.nr_of_downloads ?? 0;

  return (
    <header className="space-y-6 border-b p-0">
      {/* LINE 1: Task Icon + Title */}
      <div className="mb-0 flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center p-0"
          aria-hidden="true"
        >
          {/* Using Flag icon for Tasks (OpenML standard) - Orange #f97316 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="h-9 w-9"
            fill="#ffa726"
          >
            {/* FontAwesome Flag Data */}
            <path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {taskType}
          </h1>

          {/* LINE 2: Identity, Config & Date */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {/* Task ID Badge - solid orange */}
            <Badge
              variant="default"
              className="flex items-center gap-0.5 border-0 bg-[#ffa726] px-2 py-0.5 text-xs font-semibold text-white hover:bg-[#fb8c00]"
            >
              <Hash className="h-3 w-3" />
              {task.task_id}
            </Badge>

            {/* Dataset Link - Green Icon + Text */}
            {datasetId && (
              <Link
                href={`/datasets/${datasetId}`}
                className="text-muted-foreground flex items-center gap-1 transition-colors hover:text-green-600 hover:underline"
                title="Source Dataset"
              >
                {/* Database Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="h-4 w-4 fill-green-600"
                >
                  <path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z" />
                </svg>
                <span className="text-green-600">{datasetName}</span>
              </Link>
            )}

            {/* Upload Date (Joined Line 2) */}
            {uploadDate && (
              <div className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>created {uploadDate}</span>
              </div>
            )}

            {/* Target Feature - Gray Icon + Text */}
            {targetFeature && (
              <div
                className="text-muted-foreground flex items-center gap-1"
                title="Target Feature"
              >
                <Target className="h-4 w-4 text-gray-500" />
                <span>Target: {targetFeature}</span>
              </div>
            )}

            {/* Estimation Procedure - Gray Icon + Text */}
            {estimation && (
              <div
                className="text-muted-foreground flex items-center gap-1"
                title="Estimation Procedure"
              >
                <Settings className="h-4 w-4 text-gray-500" />
                <span>{estimation}</span>
              </div>
            )}
          </div>

          {/* LINE 3: Stats */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-sm">
            {/* Likes — interactive, synced */}
            <LikeButton
              entityType="task"
              entityId={task.task_id}
              initialLikes={likes}
              showCount={true}
              size="sm"
            />

            {/* Downvotes */}
            <div className="text-muted-foreground flex items-center gap-1">
              <ThumbsDown className="h-4 w-4" />
              <span>{downvotes} downvotes</span>
            </div>

            {/* Issues (Warning/Error count) */}
            <div className="text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-orange-400" />
              <span>{issues} issues</span>
            </div>

            {/* Downloads */}
            <div className="text-muted-foreground flex items-center gap-1">
              <CloudDownload className="h-4 w-4 text-gray-500" />
              <span>{downloads} downloads</span>
            </div>

            {/* Runs */}
            <div className="text-muted-foreground flex items-center gap-1">
              <FontAwesomeIcon
                icon={ENTITY_ICONS.run}
                className="h-4 w-4"
                style={{ color: entityColors.run }}
              />
              <span className="font-semibold">
                {displayRunCount.toLocaleString()} runs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LINE 4: Tags Row */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pl-12">
          <Tag className="text-muted-foreground h-4 w-4" />
          <ClickableTagList
            tags={tags.slice(0, 10)}
            getHref={(tag) => `/tasks?tag=${encodeURIComponent(tag)}`}
          />
          {tags.length > 10 && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground cursor-pointer text-xs transition-colors">
                  +{tags.length - 10} more
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="max-h-64 w-72 overflow-y-auto p-3"
                align="start"
              >
                <p className="text-muted-foreground mb-2 text-xs font-medium">
                  All tags ({tags.length})
                </p>
                <ClickableTagList
                  tags={tags}
                  getHref={(tag) => `/tasks?tag=${encodeURIComponent(tag)}`}
                  className="gap-1.5"
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}

      {/* LINE 5: Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2 pb-4">
        <EntityActionsMenu
          entityType="task"
          entityId={task.task_id}
          entityName={`${taskType} on ${datasetName}`}
        />
        <ExperimentMenu
          entityType="task"
          entityId={task.task_id}
          entityName={`${taskType} on ${datasetName}`}
          taskId={task.task_id}
        />
      </div>
    </header>
  );
}
