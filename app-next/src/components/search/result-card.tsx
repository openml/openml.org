"use client";

import Link from "next/link";
import { parseDescription } from "./teaser";
import {
  Database,
  Heart,
  CloudDownload,
  FlaskConical,
  Hash,
  Clock,
  Check,
  X,
  Wrench,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Result {
  id?: { raw: string };
  data_id?: { raw: string };
  name?: { raw: string; snippet?: string };
  status?: { raw: string };
  version?: { raw: string };
  description?: { raw: string };
  date?: { raw: string };
  runs?: { raw: number };
  nr_of_likes?: { raw: number };
  nr_of_downloads?: { raw: number };
  qualities?: {
    raw?: {
      NumberOfInstances?: number;
      NumberOfFeatures?: number;
      NumberOfNumericFeatures?: number;
      NumberOfMissingValues?: number;
    };
  };
}

const statusConfig = {
  active: {
    label: "Verified",
    icon: Check,
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  deactivated: {
    label: "Deprecated",
    icon: X,
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
  in_preparation: {
    label: "Unverified",
    icon: Wrench,
    className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
};

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

interface ResultCardProps {
  result: Result;
}

export function ResultCard({ result }: ResultCardProps) {
  const dataId = result.data_id?.raw || result.id?.raw;
  const name = result.name?.snippet || result.name?.raw || "Untitled";
  const version = result.version?.raw || "1";
  const status = result.status?.raw || "active";
  const statusInfo =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
  const StatusIcon = statusInfo.icon;

  // Parse description to get clean text and metadata
  const { cleanDescription } = parseDescription(result.description?.raw);

  const truncatedDescription =
    cleanDescription.length > 200
      ? cleanDescription.substring(0, 200) + "..."
      : cleanDescription;

  return (
    <Card className="hover:bg-accent/50 cursor-pointer rounded-none border-0 border-b shadow-none transition-colors">
      <CardContent className="p-2">
        <Link href={`/datasets/${dataId}`} className="block">
          {/* Title Row */}
          <div className="mb-2 flex items-start gap-1">
            <Database className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-500" />
            <div className="min-w-0 grow">
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="inline text-lg font-semibold hover:underline">
                  {name}
                </h3>
                <span className="text-muted-foreground text-sm whitespace-nowrap">
                  v.{version}
                </span>
                <Badge
                  variant="outline"
                  className={`${statusInfo.className} px-2 py-0.5 text-xs`}
                >
                  <StatusIcon className="mr-1 h-3.5 w-3.5" />
                  {statusInfo.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          {truncatedDescription && (
            <p className="text-muted-foreground mb-2 line-clamp-3 text-[15px] leading-relaxed">
              {truncatedDescription}
            </p>
          )}

          {/* Stats Row */}
          <div className="text-muted-foreground flex flex-wrap gap-3 text-sm">
            {result.runs && result.runs.raw > 0 && (
              <span className="flex items-center gap-1.5" title="runs">
                <FlaskConical className="h-4 w-4 fill-red-500 text-red-500" />
                {abbreviateNumber(result.runs.raw)}
              </span>
            )}
            {result.nr_of_likes && result.nr_of_likes.raw > 0 && (
              <span className="flex items-center gap-1.5" title="likes">
                <Heart className="h-4 w-4 fill-purple-500 text-purple-500" />
                {abbreviateNumber(result.nr_of_likes.raw)}
              </span>
            )}
            {result.nr_of_downloads && result.nr_of_downloads.raw > 0 && (
              <span className="flex items-center gap-1.5" title="downloads">
                <CloudDownload className="h-4 w-4 text-blue-500" />
                {abbreviateNumber(result.nr_of_downloads.raw)}
              </span>
            )}
            {result.qualities?.raw?.NumberOfInstances && (
              <span
                className="flex items-center gap-1.5"
                title="instances (rows)"
              >
                <BarChart3 className="h-4 w-4 text-gray-500" />
                {abbreviateNumber(result.qualities.raw.NumberOfInstances)}
              </span>
            )}
            {result.qualities?.raw?.NumberOfFeatures && (
              <span
                className="flex items-center gap-1.5"
                title="features (columns)"
              >
                <BarChart3 className="h-4 w-4 rotate-90 text-gray-500" />
                {abbreviateNumber(result.qualities.raw.NumberOfFeatures)}
              </span>
            )}
            <span className="ml-auto flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {result.date?.raw ? timeAgo(result.date.raw) : "Unknown"}
            </span>
            <Badge
              variant="openml"
              className="flex items-center gap-0.75 bg-[rgb(102,187,106)] px-2 py-0.5 text-xs font-semibold text-white"
              title="dataset ID"
            >
              <Hash className="h-3.5 w-3.5" />
              {dataId}
            </Badge>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
