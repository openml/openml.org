"use client";

import Link from "next/link";
import { parseDescription } from "../teaser";
import {
  Cog,
  Heart,
  CloudDownload,
  FlaskConical,
  Hash,
  Clock,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface FlowResult {
  flow_id?: { raw: string | number };
  name?: { raw: string };
  description?: { snippet?: string; raw?: string };
  uploader?: { raw: string };
  uploader_id?: { raw: string | number };
  version?: { raw: number };
  date?: { raw: string };
  runs?: { raw: number };
  nr_of_likes?: { raw: number };
  nr_of_downloads?: { raw: number };
  status?: { raw: string };
}

const abbreviateNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

interface FlowResultCardProps {
  result: FlowResult;
}

export function FlowResultCard({ result }: FlowResultCardProps) {
  const flowId = result.flow_id?.raw;
  const name = result.name?.raw || "Untitled Flow";
  const version = result.version?.raw || "1";

  // Parse description to get clean text
  const { cleanDescription } = parseDescription(
    result.description?.snippet || result.description?.raw,
  );

  const truncatedDescription =
    cleanDescription.length > 200
      ? cleanDescription.substring(0, 200) + "..."
      : cleanDescription;

  return (
    <Card className="bg-card group hover:bg-muted/40 relative overflow-hidden rounded-md border shadow-none transition-all hover:shadow-md">
      {/* Status Badge - Top Right */}
      {result.status?.raw && (
        <Badge
          variant="outline"
          className={`absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${
            result.status.raw === "active"
              ? "border-green-500 bg-green-50/50 text-green-600"
              : "border-amber-500 bg-amber-50/50 text-amber-600"
          }`}
        >
          {result.status.raw}
        </Badge>
      )}

      {/* Flow Icon - Top Left */}
      <div className="absolute top-2 right-2 z-20">
        <Cog className="h-5 w-5 text-[#3b82f6]" strokeWidth={1.5} />
      </div>

      <CardContent className="py-0.55 px-4">
        {/* Title Row */}
        <div className="mb-1 flex items-start">
          <div className="w-full min-w-0">
            <div className="mb-2 flex flex-wrap items-baseline">
              <Link href={`/flows/${flowId}`}>
                <h3 className="inline text-lg/snug font-semibold wrap-break-word hyphens-auto hover:underline">
                  {name}
                </h3>
              </Link>
            </div>
          </div>
        </div>

        {/* Description */}
        {truncatedDescription && (
          <Link href={`/flows/${flowId}`} className="block">
            <p className="text-muted-foreground mb-1.5 line-clamp-3 text-[14px] leading-relaxed">
              {truncatedDescription}
            </p>
          </Link>
        )}

        {/* Info Row: Uploader and Date */}
        <div className="text-muted-foreground mb-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          {result.uploader?.raw && (
            <Link
              href={`/users/${result.uploader_id?.raw}`}
              className="hover:text-foreground flex items-center gap-1.5 transition-colors"
            >
              <User className="h-3 w-3" />
              {result.uploader.raw}
            </Link>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {result.date?.raw ? timeAgo(result.date.raw) : "Unknown"}
          </span>
        </div>

        {/* Stats and ID Row */}
        <div className="mt-auto flex items-center justify-between border-t pt-1">
          <div className="flex items-center gap-3">
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <span className="flex items-center gap-1.5" title="runs">
                <FlaskConical className="h-4 w-4 fill-red-500 text-red-500" />
                {abbreviateNumber(Number(result.runs?.raw || 0))}
              </span>
              <span className="flex items-center gap-1.5" title="likes">
                <Heart className="h-4 w-4 fill-purple-500 text-purple-500" />
                {abbreviateNumber(Number(result.nr_of_likes?.raw || 0))}
              </span>
              <span className="flex items-center gap-1.5" title="downloads">
                <CloudDownload className="h-4 w-4 text-[#3b82f6]" />
                {abbreviateNumber(Number(result.nr_of_downloads?.raw || 0))}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-[10px] font-bold whitespace-nowrap uppercase">
              v.{version}
            </span>
            <Badge
              variant="openml"
              className="flex items-center gap-1 bg-[#3b82f6] px-2 py-0.5 text-xs font-semibold text-white"
              title="flow ID"
            >
              <Hash className="h-3 w-3" />
              {flowId}
            </Badge>
          </div>
        </div>

        {/* Invisible overlay link for entire card clickability */}
        <Link
          href={`/flows/${flowId}`}
          className="absolute inset-0"
          aria-label={`View flow ${name}`}
        >
          <span className="sr-only">View {name}</span>
        </Link>
      </CardContent>
    </Card>
  );
}
