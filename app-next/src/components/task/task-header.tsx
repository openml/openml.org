import Link from "next/link";
import {
  Calendar,
  Hash,
  Target,
  Trophy,
  Tag,
  Heart,
  CloudDownload,
  Play,
  Settings,
  ThumbsDown,
  AlertCircle,
  FlaskConical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/ui/like-button";
import type { Task } from "@/types/task";

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

  // Tags
  const tags = task.tag ?? [];

  // Stats
  const likes = task.nr_of_likes ?? 0;
  const downvotes = task.nr_of_downvotes ?? 0;
  const issues = task.nr_of_issues ?? 0;
  const downloads = task.nr_of_downloads ?? 0;

  return (
    <header className="space-y-6 border-b p-0">
      {/* LINE 1: Task Icon + Title */}
      <div className="flex items-start gap-3">
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

          {/* LINE 3: Stats (Likes, Downvotes, Issues, Downloads, Runs) */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-sm">
            {/* Likes */}
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 fill-purple-500 text-purple-500" />
              <span>{likes} likes</span>
            </div>

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
              <FlaskConical className="h-4 w-4 text-black dark:text-white" />
              <span className="font-semibold">
                {displayRunCount.toLocaleString()} runs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LINE 4: Tags Row */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pl-6">
          <Tag className="text-muted-foreground h-4 w-4" />
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 10).map((tag, idx) => (
              <Link
                key={`${tag}-${idx}`}
                href={`/search?type=task&tag=${encodeURIComponent(tag)}`}
              >
                <Badge
                  variant="secondary"
                  className="border-accent hover:bg-primary/10 hover:text-primary cursor-pointer border text-xs transition-colors"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
            {tags.length > 10 && (
              <span className="text-muted-foreground text-xs">
                +{tags.length - 10} more
              </span>
            )}
          </div>
        </div>
      )}

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
