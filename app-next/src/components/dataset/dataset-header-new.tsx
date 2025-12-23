"use client";

import Link from "next/link";
import {
  Heart,
  Play,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Grid3X3,
  Scale,
  GitBranch,
  Hash,
  CloudDownload,
  MessageCircle,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Dataset } from "@/types/dataset";
import { DatasetDownloadMenu } from "./dataset-download-menu";
import { DatasetCodeMenuKaggle } from "./dataset-code-menu-kaggle";
import { DatasetActionsMenu } from "./dataset-actions-menu";

interface DatasetHeaderProps {
  dataset: Dataset;
  taskCount?: number;
  runCount?: number;
}

export function DatasetHeader({
  dataset,
  taskCount = 0,
  runCount = 0,
}: DatasetHeaderProps) {
  // Date formatting
  const uploadDate = new Date(dataset.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format icon based on dataset format
  const getFormatIcon = (format: string) => {
    // Same gray color as in list view
    switch (format?.toLowerCase()) {
      case "arff":
        return <Grid3X3 className="h-4 w-4 text-gray-500" />;
      case "csv":
        return <Grid3X3 className="h-4 w-4 text-gray-500" />;
      case "sparse_arff":
        return <Grid3X3 className="h-4 w-4 text-gray-500" />;
      default:
        return <Grid3X3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const tags = dataset.tags ?? [];

  const visibleMd = tags.slice(0, 3);
  const visibleLg = tags.slice(0, 7);
  const visibleXl = tags.slice(0, 10);

  const moreMd = Math.max(tags.length - 3, 0);
  const moreLg = Math.max(tags.length - 7, 0);
  const moreXl = Math.max(tags.length - 10, 0);

  return (
    <header className="space-y-6 border-b p-0">
      {/* LINE 1: Dataset Icon + Title */}
      <div className="items- flex gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="h-9 w-9 shrink-0"
          style={{ color: "#66BB6A" }}
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M448 205.8c-14.8 9.8-31.8 17.7-49.5 24-47 16.8-108.7 26.2-174.5 26.2S96.4 246.5 49.5 229.8c-17.6-6.3-34.7-14.2-49.5-24L0 288c0 44.2 100.3 80 224 80s224-35.8 224-80l0-82.2zm0-77.8l0-48C448 35.8 347.7 0 224 0S0 35.8 0 80l0 48c0 44.2 100.3 80 224 80s224-35.8 224-80zM398.5 389.8C351.6 406.5 289.9 416 224 416S96.4 406.5 49.5 389.8c-17.6-6.3-34.7-14.2-49.5-24L0 432c0 44.2 100.3 80 224 80s224-35.8 224-80l0-66.2c-14.8 9.8-31.8 17.7-49.5 24z"
          />
        </svg>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {dataset.name}
          </h1>

          {/* LINE 2: Identity - ID, Status, Format, License, Date, Version */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {/* ID Badge - solid green like grid view */}
            <Badge
              variant="openml"
              className="flex items-center gap-0.5 bg-[rgb(102,187,106)] px-2 py-0.5 text-xs font-semibold text-white"
            >
              <Hash className="h-3 w-3" />
              {dataset.data_id}
            </Badge>

            {/* Status Badge - outline style like grid view */}
            {dataset.status === "active" ? (
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-green-500 px-2 py-0.5 text-xs font-medium text-green-600"
              >
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            ) : dataset.status === "deactivated" ? (
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-red-500 px-2 py-0.5 text-xs font-medium text-red-600"
              >
                <AlertTriangle className="h-3 w-3" />
                Deactivated
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-orange-500 px-2 py-0.5 text-xs font-medium text-orange-600"
              >
                <Clock className="h-3 w-3" />
                In Preparation
              </Badge>
            )}

            {/* Format */}
            <div className="text-muted-foreground flex items-center gap-1">
              {getFormatIcon(dataset.format)}
              <span>{dataset.format}</span>
            </div>

            {/* License */}
            {dataset.licence && (
              <div className="text-muted-foreground flex items-center gap-1">
                <Scale className="h-4 w-4" />
                <span>{dataset.licence}</span>
              </div>
            )}

            {/* Version */}
            <div className="text-muted-foreground flex items-center gap-1">
              <GitBranch className="h-4 w-4" />
              <span>v.{dataset.version}</span>
            </div>
          </div>

          {/* LINE 3: Uploader Info - Avatar, Name, Date, Creator, Likes, Issues, Downloads */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {/* Uploader with Avatar */}
            <Link
              href={`/users/${dataset.uploader_id}`}
              className="flex items-center gap-2 hover:underline"
            >
              <Avatar className="h-6 w-6 border border-green-500">
                <AvatarImage
                  src={`https://www.openml.org/img/${dataset.uploader_id}`}
                />
                <AvatarFallback className="bg-green-100 text-xs text-green-700">
                  {getInitials(dataset.uploader || "U")}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">
                {dataset.uploader || "Unknown"}
              </span>
            </Link>

            {/* Upload Date */}
            <div className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{uploadDate}</span>
            </div>

            {/* Creator - only show if different from uploader */}
            {dataset.creator &&
              dataset.uploader &&
              dataset.creator.trim().toLowerCase() !==
                dataset.uploader.trim().toLowerCase() && (
                <div className="text-muted-foreground flex items-center gap-1">
                  <span>Creator:</span>
                  <span>{dataset.creator}</span>
                </div>
              )}

            {/* Likes - purple filled like list view */}
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 fill-purple-500 text-purple-500" />
              <span>{dataset.nr_of_likes || 0} likes</span>
            </div>

            {/* Issues - using MessageCircle */}
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4 text-orange-500" />
              <span>{dataset.nr_of_issues || 0} issues</span>
            </div>

            {/* Downloads - CloudDownload like list view */}
            <div className="flex items-center gap-1">
              <CloudDownload className="h-4 w-4 text-gray-500" />
              <span>{dataset.nr_of_downloads || 0} downloads</span>
            </div>
          </div>
        </div>
      </div>
      {/* LINE 4: Tags Row + Stats + Actions */}
      <div className="-mt-2 mb-5 flex flex-col gap-4 pl-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Tags Row (if tags exist) */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Tag icon always visible */}
            <Tag className="text-muted-foreground h-4 w-4" />

            {/* < sm: just count */}
            <span className="text-muted-foreground text-xs sm:hidden">
              {tags.length} tags
            </span>

            {/* md only: 3 tags + more */}
            <div className="hidden flex-wrap gap-2 sm:flex md:hidden">
              {tags.slice(0, 3).map((tagObj, idx) => (
                <Badge
                  key={`${tagObj.tag}-${idx}`}
                  variant="secondary"
                  className="border-accent border text-xs"
                >
                  {tagObj.tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <span className="text-muted-foreground text-xs">
                  +{tags.length - 3} more
                </span>
              )}
            </div>

            {/* lg only: 7 tags + more */}
            <div className="hidden flex-wrap gap-2 md:flex lg:hidden">
              {tags.slice(0, 7).map((tagObj, idx) => (
                <Badge
                  key={`${tagObj.tag}-${idx}`}
                  variant="secondary"
                  className="border-accent border text-xs"
                >
                  {tagObj.tag}
                </Badge>
              ))}
              {tags.length > 7 && (
                <span className="text-muted-foreground text-xs">
                  +{tags.length - 7} more
                </span>
              )}
            </div>

            {/* xl and up: 10 tags + more */}
            <div className="hidden flex-wrap gap-2 lg:flex">
              {tags.slice(0, 10).map((tagObj, idx) => (
                <Badge
                  key={`${tagObj.tag}-${idx}`}
                  variant="secondary"
                  className="border-accent border text-xs"
                >
                  {tagObj.tag}
                </Badge>
              ))}
              {tags.length > 10 && (
                <span className="text-muted-foreground text-xs">
                  +{tags.length - 10} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Divider - only show if we have stats to display */}
      {(dataset.qualities?.NumberOfInstances != null ||
        dataset.qualities?.NumberOfFeatures != null ||
        (dataset.qualities?.NumberOfClasses != null &&
          dataset.qualities.NumberOfClasses > 0) ||
        dataset.qualities?.NumberOfMissingValues != null ||
        taskCount > 0 ||
        runCount > 0 ||
        dataset.runs) && (
        <>
          {/* <div className="border-t bg-gray-200 dark:border-gray-700" /> */}

          {/* LINE 5: Statistics - Dataset Characteristics */}
          <div className="bg-accent flex flex-wrap items-center justify-around gap-6 rounded-lg p-2 dark:bg-slate-700">
            {/* Instances */}
            {dataset.qualities?.NumberOfInstances != null && (
              <Stat
                value={(
                  dataset.qualities.NumberOfInstances || 0
                ).toLocaleString()}
                label="Instances"
              />
            )}

            {/* Features */}
            {dataset.qualities?.NumberOfFeatures != null && (
              <Stat
                value={(
                  dataset.qualities.NumberOfFeatures || 0
                ).toLocaleString()}
                label="Features"
              />
            )}

            {/* Classes */}
            {dataset.qualities?.NumberOfClasses != null &&
              dataset.qualities.NumberOfClasses > 0 && (
                <Stat
                  value={(
                    dataset.qualities.NumberOfClasses || 0
                  ).toLocaleString()}
                  label="Classes"
                />
              )}

            {/* Missing Values */}
            {dataset.qualities?.NumberOfMissingValues != null && (
              <Stat
                value={(
                  dataset.qualities.NumberOfMissingValues || 0
                ).toLocaleString()}
                label="Missing"
              />
            )}

            {/* Tasks */}
            {taskCount > 0 && (
              <Stat value={taskCount.toLocaleString()} label="Tasks" />
            )}

            {/* Runs */}
            {(runCount > 0 || dataset.runs) && (
              <Stat
                value={(runCount || dataset.runs || 0).toLocaleString()}
                label="Runs"
              />
            )}
          </div>
        </>
      )}
      {/* LINE 5: Action Buttons */}
      <div className="flex-wrap. mt-2 mb-4 flex items-center justify-end sm:gap-2 md:gap-3 lg:gap-5 xl:gap-7">
        {/* Download Dataset Dropdown */}
        <DatasetDownloadMenu
          datasetId={dataset.data_id}
          datasetName={dataset.name}
          datasetUrl={dataset.url}
        />

        {/* Code Button (Kaggle-style) */}
        <DatasetCodeMenuKaggle
          datasetId={dataset.data_id}
          datasetName={dataset.name}
        />

        {/* Run Experiment */}
        <Button variant="outline" disabled>
          <Play className="mr-2 h-4 w-4" />
          Run Experiment
        </Button>

        {/* Like Button */}
        <Button variant="outline" disabled>
          <Heart className="mr-2 h-4 w-4" />
          Like ({dataset.nr_of_likes || 0})
        </Button>

        {/* 3-dot Menu */}
        <DatasetActionsMenu
          datasetId={dataset.data_id}
          datasetName={dataset.name}
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
