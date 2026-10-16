import Link from "next/link";
import {
  User,
  CheckCircle2,
  XCircle,
  CloudDownload,
  MessageCircle,
  Eye,
  EyeOff,
  GitCompareArrows,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { entityColors } from "@/constants/entityColors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ENTITY_ICONS } from "@/constants/entityIcons";
import { LikeButton } from "@/components/ui/like-button";
import { EntityActionsMenu } from "@/components/ui/entity-actions-menu";

function truncateFlowName(name: string): string {
  const words = name.split(" ");
  if (words.length <= 8) return name;
  return `${words.slice(0, 4).join(" ")} ... ${words.slice(-4).join(" ")}`;
}

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
  const hasError = !!run.error_message;
  const isPublic = run.visibility === "public" || !run.visibility;
  const uploaderLabel =
    run.uploader || (run.uploader_id ? `user/${run.uploader_id}` : null);
  const uploaderHref = run.uploader
    ? `/users/${run.uploader}`
    : run.uploader_id
      ? `/users/${run.uploader_id}`
      : null;
  const flowLabel = run.flow_name
    ? truncateFlowName(run.flow_name)
    : run.flow_id
      ? `Flow #${run.flow_id}`
      : null;

  const likes = run.nr_of_likes || 0;

  return (
    <header className="space-y-3 border-b p-0">
      <div className="flex items-start gap-3">
        <FontAwesomeIcon
          icon={ENTITY_ICONS.run}
          className="mt-1 h-9 w-9 shrink-0"
          style={{
            color: entityColors.run,
            width: "32px",
            height: "32px",
          }}
        />

        <div className="flex-1 space-y-2">
          {/* Line 1: Run ID + status badges */}
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

          {/* Line 2: Uploader + engagement metrics */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {uploaderLabel && uploaderHref && (
              <Link
                href={uploaderHref}
                className="flex items-center gap-1 hover:underline"
              >
                <User className="h-4 w-4" />
                {uploaderLabel}
              </Link>
            )}
            <LikeButton
              entityType="run"
              entityId={run.run_id}
              initialLikes={likes}
              showCount={true}
              size="sm"
            />
            <span className="flex items-center gap-1" title="downloads">
              <CloudDownload className="h-4 w-4 text-gray-500" />
              {run.nr_of_downloads || 0} downloads
            </span>
            <span className="flex items-center gap-1" title="issues">
              <MessageCircle className="h-4 w-4 text-orange-500" />
              {run.nr_of_issues || 0} issues
            </span>
          </div>

          {/* Line 3: Task ID + truncated flow name */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {run.task_id && (
              <Link
                href={`/tasks/${run.task_id}`}
                className="flex items-center gap-1 hover:underline"
                style={{ color: entityColors.task }}
              >
                <FontAwesomeIcon icon={ENTITY_ICONS.task} className="h-4 w-4" />
                Task #{run.task_id}
              </Link>
            )}
            {run.flow_id && flowLabel && (
              <Link
                href={`/flows/${run.flow_id}`}
                className="flex items-center gap-1 hover:underline"
                style={{ color: entityColors.flow }}
              >
                <FontAwesomeIcon icon={ENTITY_ICONS.flow} className="h-4 w-4" />
                <span className="max-w-[480px] truncate" title={run.flow_name}>
                  {flowLabel}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pb-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/runs/compare?ids=${run.run_id}`}>
            <GitCompareArrows className="h-4 w-4" />
            Compare with…
          </Link>
        </Button>
        <EntityActionsMenu
          entityType="run"
          entityId={run.run_id}
          entityName={`Run #${run.run_id}`}
        />
      </div>
    </header>
  );
}
