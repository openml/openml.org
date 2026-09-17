import Link from "next/link";
import {
  Calendar,
  Hash,
  CloudDownload,
  ThumbsDown,
  AlertCircle,
  GitBranch,
  Tag as TagIcon,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ENTITY_ICONS, entityColors } from "@/constants";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ClickableTagList } from "@/components/ui/clickable-tag-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikeButton } from "@/components/ui/like-button";
import { EntityActionsMenu } from "@/components/ui/entity-actions-menu";
import type { Flow } from "@/types/flow";

interface FlowHeaderProps {
  flow: Flow;
  runCount: number;
}

export function FlowHeader({ flow, runCount }: FlowHeaderProps) {
  // Use flow.runs if available, otherwise fallback to computed runCount
  const displayRunCount = flow.runs || runCount;

  // Date formatting
  const rawDate = flow.upload_date || flow.date;
  const uploadDate = rawDate
    ? new Date(rawDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  // Tags - extract from either tag string array or tags object array
  const tags =
    flow.tags?.map((t) => t.tag) ??
    (Array.isArray(flow.tag) ? flow.tag : []) ??
    [];

  // Stats
  const likes = flow.nr_of_likes ?? 0;
  const downvotes = flow.nr_of_downvotes ?? 0;
  const issues = flow.nr_of_issues ?? 0;
  const downloads = flow.nr_of_downloads ?? 0;

  // Avatar Initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="space-y-6 border-b p-0">
      <div className="mb-1 flex flex-col lg:flex-row lg:items-start lg:justify-between">
        {/* Left: Icon + Title + Metadata */}
        <div className="flex min-w-0 items-start gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center p-0"
            aria-hidden="true"
          >
            <FontAwesomeIcon
              icon={ENTITY_ICONS.flow}
              className="h-8 w-8"
              style={{
                color: entityColors.flow,
                height: "2rem",
                width: "2rem",
              }}
            />
          </div>

          <div className="mr-6 min-w-0 flex-1 space-y-1">
            <h1 className="line-clamp-2 text-3xl font-bold tracking-tight break-all sm:text-4xl lg:line-clamp-1">
              {flow.name}
            </h1>

            {/* LINE 2: Identity & Base Metadata */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              {/* Flow ID Badge - using Flow color (blue) */}
              <Badge
                variant="openml"
                className="flex items-center gap-0.5 bg-[#2f65cb] px-2 py-0.5 text-xs font-semibold text-white hover:bg-blue-800"
              >
                <Hash className="h-3 w-3" />
                {flow.flow_id}
              </Badge>

              {/* Version Info */}
              {flow.version && (
                <Link
                  href={`/flows?search=${encodeURIComponent(flow.name)}`}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                  title="View all versions"
                >
                  <GitBranch className="h-4 w-4" />
                  <span className="font-medium">v.{flow.version} ✓</span>
                </Link>
              )}

              {/* Uploader with Avatar */}
              <Link
                href={`/users/${flow.uploader_id}`}
                className="flex items-center gap-2 hover:underline"
              >
                <Avatar className="h-6 w-6 border border-blue-500">
                  <AvatarImage
                    src={`https://www.openml.org/img/${flow.uploader_id}`}
                  />
                  <AvatarFallback className="bg-blue-100 text-[10px] font-bold text-blue-700">
                    {getInitials(flow.uploader || "U")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">
                  {flow.uploader || "Unknown"}
                </span>
              </Link>

              {/* Upload Date */}
              {uploadDate && (
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>uploaded {uploadDate}</span>
                </div>
              )}
            </div>

            {/* LINE 3: Stats row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              {/* Likes — interactive, synced */}
              <LikeButton
                entityType="flow"
                entityId={flow.flow_id}
                initialLikes={likes}
                showCount={true}
                size="sm"
              />

              {/* Downvotes */}
              <div className="text-muted-foreground flex items-center gap-1">
                <ThumbsDown className="h-4 w-4" />
                <span>{downvotes} downvotes</span>
              </div>

              {/* Issues */}
              <div className="text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-orange-400" />
                <span>{issues} issues</span>
              </div>

              {/* Downloads */}
              <div className="text-muted-foreground flex items-center gap-1">
                <CloudDownload className="h-4 w-4 text-gray-500" />
                <span>{downloads.toLocaleString()} downloads</span>
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

            {/* LINE 4: Tags Section */}
            {tags.length > 0 && (
              <div className="flex items-start gap-2">
                <TagIcon className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <ClickableTagList
                    tags={tags.slice(0, 10)}
                    getHref={(tag) => `/flows?tag=${encodeURIComponent(tag)}`}
                  />
                  {tags.length > 10 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="text-muted-foreground hover:text-foreground mt-2 cursor-pointer text-xs font-medium transition-colors">
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
                          getHref={(tag) =>
                            `/flows?tag=${encodeURIComponent(tag)}`
                          }
                          className="gap-1.5"
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            )}
            {/* {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <TagIcon className="text-muted-foreground h-4 w-4" />
                <ClickableTagList
                  tags={tags.slice(0, 10)}
                  getHref={(tag) => `/flows?tag=${encodeURIComponent(tag)}`}
                />
                {tags.length > 10 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground cursor-pointer text-xs font-medium transition-colors">
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
                        getHref={(tag) =>
                          `/flows?tag=${encodeURIComponent(tag)}`
                        }
                        className="gap-1.5"
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pb-4">
        <EntityActionsMenu
          entityType="flow"
          entityId={flow.flow_id}
          entityName={flow.name}
        />
      </div>
    </header>
  );
}
