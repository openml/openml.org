"use client";

import { useState } from "react";
import {
  Calendar,
  User,
  Heart,
  Play,
  Eye,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Tag as TagIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Dataset } from "@/types/dataset";
import { DatasetCodeMenukggl } from "./dataset-code-menu-kggl";
import { DatasetDownloadMenu } from "./dataset-download-menu";
import { DatasetActionsMenu } from "./dataset-actions-menu";
import { LikeButton } from "@/components/ui/like-button";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

interface DatasetHeroHeaderProps {
  dataset: Dataset;
  taskCount?: number;
  runCount?: number;
}

/**
 * DatasetHeroHeader - Redesigned header with prominent description
 *
 * Features:
 * - Large title with badges
 * - Prominent description with light background (collapsible)
 * - Stats bar
 * - kggl-style download menu
 * - 3-dot actions menu
 * - Tags section
 */
export function DatasetHeroHeader({
  dataset,
  taskCount = 0,
  runCount = 0,
}: DatasetHeroHeaderProps) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(true);

  // Status badge styling
  const getStatusConfig = (status: Dataset["status"]) => {
    switch (status) {
      case "active":
        return {
          variant: "default" as const,
          label: "Active",
          className:
            "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
        };
      case "deactivated":
        return {
          variant: "destructive" as const,
          label: "Deactivated",
          className:
            "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
        };
      case "in_preparation":
        return {
          variant: "secondary" as const,
          label: "In Preparation",
          className:
            "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
        };
    }
  };

  const statusConfig = getStatusConfig(dataset.status);

  // Date formatting
  const uploadDate = new Date(dataset.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Truncate description for preview (first 300 characters or first paragraph)
  const fullDescription = dataset.description || "";
  const descriptionPreview =
    fullDescription.length > 300
      ? fullDescription.slice(0, 300) + "..."
      : fullDescription;
  const hasMoreDescription = fullDescription.length > 300;

  return (
    <header className="space-y-6">
      {/* Top Section: Title, badges, and actions */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Left: Icon + Title */}
        <div className="flex items-start gap-4">
          {/* Dataset Icon */}
          <div className="bg-primary/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="h-8 w-8"
              style={{ color: "#66BB6A" }}
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M448 205.8c-14.8 9.8-31.8 17.7-49.5 24-47 16.8-108.7 26.2-174.5 26.2S96.4 246.5 49.5 229.8c-17.6-6.3-34.7-14.2-49.5-24L0 288c0 44.2 100.3 80 224 80s224-35.8 224-80l0-82.2zm0-77.8l0-48C448 35.8 347.7 0 224 0S0 35.8 0 80l0 48c0 44.2 100.3 80 224 80s224-35.8 224-80zM398.5 389.8C351.6 406.5 289.9 416 224 416S96.4 406.5 49.5 389.8c-17.6-6.3-34.7-14.2-49.5-24L0 432c0 44.2 100.3 80 224 80s224-35.8 224-80l0-66.2c-14.8 9.8-31.8 17.7-49.5 24z"
              />
            </svg>
          </div>

          {/* Title and Metadata */}
          <div className="space-y-3">
            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {dataset.name}
            </h1>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={statusConfig.variant}
                className={statusConfig.className}
              >
                {statusConfig.label}
              </Badge>

              <Badge variant="outline" className="font-mono text-xs">
                v{dataset.version}
              </Badge>

              <Badge variant="outline" className="font-mono text-xs">
                #{dataset.data_id}
              </Badge>

              {dataset.licence && (
                <Badge variant="secondary" className="text-xs">
                  {dataset.licence}
                </Badge>
              )}

              {dataset.format && (
                <Badge variant="outline" className="text-xs uppercase">
                  {dataset.format}
                </Badge>
              )}
            </div>

            {/* Creator and Date */}
            <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
              {dataset.uploader && (
                <Link
                  href={`/users/${dataset.uploader_id}`}
                  className="hover:text-foreground flex items-center gap-1.5 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{dataset.uploader}</span>
                </Link>
              )}

              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Uploaded {uploadDate}</span>
              </div>

              {dataset.creator && dataset.creator !== dataset.uploader && (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground/60">by</span>
                  <span>{dataset.creator}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex shrink-0 items-center gap-3">
          {/* kggl-style Code Menu */}
          <DatasetCodeMenukggl
            datasetId={dataset.data_id}
            datasetName={dataset.name}
          />

          {/* kggl-style Download Menu */}
          <DatasetDownloadMenu
            datasetId={dataset.data_id}
            datasetName={dataset.name}
            datasetUrl={dataset.url}
          />

          {/* Like Button */}
          <LikeButton
            entityType="dataset"
            entityId={dataset.data_id}
            initialLikes={dataset.nr_of_likes || 0}
            showCount={true}
            size="lg"
          />

          {/* 3-dot Actions Menu */}
          <DatasetActionsMenu
            datasetId={dataset.data_id}
            datasetName={dataset.name}
          />
        </div>
      </div>

      {/* Description Card - Prominent with light background */}
      <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Description Text */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {descriptionExpanded ? (
                <ReactMarkdown>{fullDescription}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground">{descriptionPreview}</p>
              )}
            </div>

            {/* Expand/Collapse toggle */}
            {hasMoreDescription && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
                onClick={() => setDescriptionExpanded(!descriptionExpanded)}
              >
                {descriptionExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show More
                  </>
                )}
              </Button>
            )}

            {/* Source Links */}
            {(dataset.original_data_url || dataset.paper_url) && (
              <div className="border-border/50 flex flex-wrap gap-4 border-t pt-4">
                {dataset.original_data_url && (
                  <a
                    href={dataset.original_data_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary flex items-center gap-1.5 text-sm transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Original Source
                  </a>
                )}
                {dataset.paper_url && (
                  <a
                    href={dataset.paper_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary flex items-center gap-1.5 text-sm transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Related Paper
                  </a>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tags Section - Prominent display */}
      {dataset.tags && dataset.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <TagIcon className="text-muted-foreground h-4 w-4" />
          {dataset.tags.slice(0, 10).map((tagObj, index) => (
            <Link
              key={`${tagObj.tag}-${index}`}
              href={`/search?type=data&tags.tag=${encodeURIComponent(tagObj.tag)}`}
            >
              <Badge
                variant="secondary"
                className="hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
              >
                {tagObj.tag}
              </Badge>
            </Link>
          ))}
          {dataset.tags.length > 10 && (
            <Badge variant="outline" className="text-muted-foreground">
              +{dataset.tags.length - 10} more
            </Badge>
          )}
        </div>
      )}

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {/* Instances */}
        {dataset.qualities?.NumberOfInstances != null && (
          <StatItem
            label="Instances"
            value={(dataset.qualities.NumberOfInstances || 0).toLocaleString()}
          />
        )}

        {/* Features */}
        {dataset.qualities?.NumberOfFeatures != null && (
          <StatItem
            label="Features"
            value={(dataset.qualities.NumberOfFeatures || 0).toLocaleString()}
          />
        )}

        {/* Classes */}
        {dataset.qualities?.NumberOfClasses != null &&
          dataset.qualities.NumberOfClasses > 0 && (
            <StatItem
              label="Classes"
              value={(dataset.qualities.NumberOfClasses || 0).toLocaleString()}
            />
          )}

        {/* Missing Values */}
        {dataset.qualities?.NumberOfMissingValues != null &&
          dataset.qualities.NumberOfMissingValues > 0 && (
            <StatItem
              label="Missing"
              value={(
                dataset.qualities.NumberOfMissingValues || 0
              ).toLocaleString()}
            />
          )}

        <div className="bg-border hidden h-8 w-px sm:block" />

        {/* Tasks */}
        {taskCount > 0 && (
          <StatItem
            label="Tasks"
            value={taskCount.toString()}
            icon={<Eye className="h-4 w-4" />}
            href={`#tasks`}
          />
        )}

        {/* Runs */}
        {(runCount > 0 || dataset.runs) && (
          <StatItem
            label="Runs"
            value={(runCount || dataset.runs || 0).toLocaleString()}
            icon={<Play className="h-4 w-4" />}
            href="#runs"
          />
        )}

        {/* Downloads */}
        {dataset.nr_of_downloads > 0 && (
          <StatItem
            label="Downloads"
            value={dataset.nr_of_downloads.toLocaleString()}
          />
        )}

        {/* Likes */}
        {dataset.nr_of_likes > 0 && (
          <StatItem
            label="Likes"
            value={dataset.nr_of_likes.toLocaleString()}
            icon={<Heart className="h-4 w-4" />}
          />
        )}
      </div>
    </header>
  );
}

function StatItem({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-2">
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <div className="flex items-baseline gap-1.5">
        <span className="text-foreground text-lg font-semibold tabular-nums">
          {value}
        </span>
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="hover:text-primary transition-colors">
        {content}
      </a>
    );
  }

  return content;
}
