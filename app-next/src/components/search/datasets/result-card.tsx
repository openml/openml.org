"use client";

import Link from "next/link";
import { parseDescription } from "../teaser";
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
    <Card className="group hover:bg-accent/70 relative overflow-hidden rounded-none border-0 border-b shadow-none transition-all hover:shadow-md">
      <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      {/* Status Badge - Top Right */}
      <Badge
        variant="outline"
        className={`${statusInfo.className} absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-0.5 text-xs font-semibold`}
      >
        <StatusIcon className="h-3.5 w-3.5" />
        {statusInfo.label}
      </Badge>

      <CardContent className="p-2">
        {/* Title Row */}
        <div className="mb-2 flex items-start gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ color: "#66BB6A" }}
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M448 205.8c-14.8 9.8-31.8 17.7-49.5 24-47 16.8-108.7 26.2-174.5 26.2S96.4 246.5 49.5 229.8c-17.6-6.3-34.7-14.2-49.5-24L0 288c0 44.2 100.3 80 224 80s224-35.8 224-80l0-82.2zm0-77.8l0-48C448 35.8 347.7 0 224 0S0 35.8 0 80l0 48c0 44.2 100.3 80 224 80s224-35.8 224-80zM398.5 389.8C351.6 406.5 289.9 416 224 416S96.4 406.5 49.5 389.8c-17.6-6.3-34.7-14.2-49.5-24L0 432c0 44.2 100.3 80 224 80s224-35.8 224-80l0-66.2c-14.8 9.8-31.8 17.7-49.5 24z"
            />
          </svg>
          <div className="w-full min-w-0">
            <div className="flex flex-wrap items-baseline gap-2">
              <Link href={`/datasets/${dataId}`}>
                <h3 className="inline text-lg font-semibold hover:underline">
                  {name}
                </h3>
              </Link>
              <span className="text-muted-foreground text-sm whitespace-nowrap">
                v.{version}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {truncatedDescription && (
          <Link href={`/datasets/${dataId}`} className="block">
            <p className="text-muted-foreground mb-2 line-clamp-3 text-[15px] leading-relaxed">
              {truncatedDescription}
            </p>
          </Link>
        )}

        {/* Stats Row */}
        <div className="space-y-2">
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
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Clock className="h-4 w-4" />
              {result.date?.raw ? timeAgo(result.date.raw) : "Unknown"}
            </span>
            <Badge
              variant="openml"
              className="flex items-center gap-1 bg-[rgb(102,187,106)] px-2 py-0.5 text-xs font-semibold text-white"
              title="dataset ID"
            >
              <Hash className="h-3.5 w-3.5" />
              {dataId}
            </Badge>
          </div>
        </div>

        {/* Invisible overlay link for entire card clickability */}
        <Link
          href={`/datasets/${dataId}`}
          className="absolute inset-0"
          aria-label={`View ${name}`}
        >
          <span className="sr-only">View {name}</span>
        </Link>
      </CardContent>
    </Card>
  );
}
