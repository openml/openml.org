import Link from "next/link";
import {
  Calendar,
  User,
  Database,
  Cog,
  Trophy,
  FlaskConical,
  CheckCircle2,
  XCircle,
  Heart,
  CloudDownload,
  MessageCircle,
  ThumbsDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { entityColors } from "@/constants/entityColors";

interface RunTaskSourceData {
  data_id?: number;
  name?: string;
}

interface RunTask {
  source_data?: RunTaskSourceData;
  task_type?: string;
}

interface Run {
  run_id: number;
  flow_id?: number;
  flow_name?: string;
  task_id?: number;
  task?: RunTask;
  uploader?: string;
  uploader_id?: number;
  uploader_date?: string;
  upload_time?: string;
  visibility?: string;
  error_message?: string | null;
  nr_of_likes?: number;
  nr_of_downloads?: number;
  nr_of_issues?: number;
  nr_of_downvotes?: number;
}

interface RunHeaderProps {
  run: Run;
}

export function RunHeader({ run }: RunHeaderProps) {
  const uploadDate =
    run.uploader_date || run.upload_time
      ? new Date(run.uploader_date || run.upload_time || "").toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          },
        )
      : null;

  const hasError = !!run.error_message;
  const isPublic = run.visibility === "public" || !run.visibility;

  return (
    <header className="space-y-6 border-b pb-6">
      <div className="flex items-start gap-3">
        <FlaskConical
          className="mt-1 h-9 w-9 shrink-0"
          style={{ color: entityColors.run, fill: entityColors.run }}
        />

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Run #{run.run_id}
            </h1>
            {hasError ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Failed
              </Badge>
            ) : (
              <Badge
                variant="default"
                className="flex items-center gap-1 bg-green-500 text-white"
              >
                <CheckCircle2 className="h-3 w-3" />
                Success
              </Badge>
            )}
            {/* Visibility indicator */}
            <Badge
              variant="outline"
              className={`flex items-center gap-1 ${isPublic ? "border-green-500 text-green-600" : "border-orange-500 text-orange-600"}`}
            >
              {isPublic ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
              {isPublic ? "Public" : "Private"}
            </Badge>
          </div>

          {/* Links to related entities */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {/* Flow */}
            {run.flow_id && (
              <Link
                href={`/flows/${run.flow_id}`}
                className="flex items-center gap-1 text-[#3b82f6] hover:underline"
              >
                <Cog className="h-4 w-4" />
                {run.flow_name || `Flow #${run.flow_id}`}
              </Link>
            )}

            {/* Dataset */}
            {run.task?.source_data?.data_id && (
              <Link
                href={`/datasets/${run.task.source_data.data_id}`}
                className="flex items-center gap-1 text-green-600 hover:underline"
              >
                <Database className="h-4 w-4" />
                {run.task.source_data.name ||
                  `Dataset #${run.task.source_data.data_id}`}
              </Link>
            )}

            {/* Task */}
            {run.task_id && (
              <Link
                href={`/tasks/${run.task_id}`}
                className="flex items-center gap-1 text-[#FFA726] hover:underline"
              >
                <Trophy className="h-4 w-4" />
                Task #{run.task_id}
              </Link>
            )}
          </div>

          {/* Uploader and Date */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {run.uploader && (
              <Link
                href={`/users/${run.uploader}`}
                className="flex items-center gap-1 hover:underline"
              >
                <User className="h-4 w-4" />
                {run.uploader}
              </Link>
            )}

            {uploadDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{uploadDate}</span>
              </div>
            )}

            {/* Engagement Metrics (NEW) */}
            <span className="flex items-center gap-1" title="likes">
              <Heart className="h-4 w-4 fill-purple-500 text-purple-500" />
              {run.nr_of_likes || 0} likes
            </span>

            <span className="flex items-center gap-1" title="downloads">
              <CloudDownload className="h-4 w-4 text-gray-500" />
              {run.nr_of_downloads || 0} downloads
            </span>

            <span className="flex items-center gap-1" title="issues">
              <MessageCircle className="h-4 w-4 text-orange-500" />
              {run.nr_of_issues || 0} issues
            </span>

            {(run.nr_of_downvotes ?? 0) > 0 && (
              <span className="flex items-center gap-1" title="downvotes">
                <ThumbsDown className="h-4 w-4 text-red-500" />
                {run.nr_of_downvotes} downvotes
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
