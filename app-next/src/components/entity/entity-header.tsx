/**
 * 🎯 Generic Entity Header Component
 *
 * Works with ANY entity type (dataset, task, flow, run, etc.)
 * Uses EntityConfig for dynamic rendering.
 *
 * PATTERN: Generic + Override
 * - This handles common layout and logic
 * - Entity-specific customizations via config
 * - Override with entity-specific components if needed
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Heart, Play, Calendar, User, Hash } from "lucide-react";
import type { EntityConfig } from "@/config/entities";

/**
 * Entity Icons - SVG paths for each entity type
 * These match the sidebar/card icons
 */
const entityIcons: Record<string, string> = {
  dataset:
    "M448 205.8c-14.8 9.8-31.8 17.7-49.5 24-47 16.8-108.7 26.2-174.5 26.2S96.4 246.5 49.5 229.8c-17.6-6.3-34.7-14.2-49.5-24L0 288c0 44.2 100.3 80 224 80s224-35.8 224-80l0-82.2zm0-77.8l0-48C448 35.8 347.7 0 224 0S0 35.8 0 80l0 48c0 44.2 100.3 80 224 80s224-35.8 224-80zM398.5 389.8C351.6 406.5 289.9 416 224 416S96.4 406.5 49.5 389.8c-17.6-6.3-34.7-14.2-49.5-24L0 432c0 44.2 100.3 80 224 80s224-35.8 224-80l0-66.2c-14.8 9.8-31.8 17.7-49.5 24z",
  task: "M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H352c17.7 0 32-14.3 32-32s-14.3-32-32-32H googletag-318.1c-20.9 0-37.9-17-37.9-37.9c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C524.5 245 558 180.6 558 88c0-13.3-10.7-24-24-24H430.3c.3-5.2 .5-10.4 .7-15.8C431.1 21.8 409.5 0 383 0H400zM288 400c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V288c0-8.8-7.2-16-16-16H304c-8.8 0-16 7.2-16 16v112z",
  flow: "M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z",
  run: "M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z",
  collection:
    "M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z",
  benchmark:
    "M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H352c17.7 0 32-14.3 32-32s-14.3-32-32-32H318.1c-20.9 0-37.9-17-37.9-37.9c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C524.5 245 558 180.6 558 88c0-13.3-10.7-24-24-24H430.3c.3-5.2 .5-10.4 .7-15.8C431.1 21.8 409.5 0 383 0H400z",
  measure:
    "M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm64 64V416H448V160H64zm64 96a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm128-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm96 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z",
};

// SVG viewBox sizes for each icon type
const iconViewBox: Record<string, string> = {
  dataset: "0 0 448 512",
  task: "0 0 576 512",
  flow: "0 0 512 512",
  run: "0 0 384 512",
  collection: "0 0 512 512",
  benchmark: "0 0 576 512",
  measure: "0 0 512 512",
};

// Status configuration
const statusConfigs = {
  active: {
    variant: "default" as const,
    label: "Active",
    className:
      "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  },
  deactivated: {
    variant: "destructive" as const,
    label: "Deactivated",
    className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  },
  in_preparation: {
    variant: "secondary" as const,
    label: "In Preparation",
    className:
      "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  },
};

interface EntityHeaderProps {
  /** The entity data object */
  entity: Record<string, unknown>;
  /** Entity configuration from config/entities.ts */
  config: EntityConfig;
  /** Optional extra stats (e.g., taskCount, runCount) */
  extraStats?: Array<{
    label: string;
    value: number | string;
    icon?: React.ReactNode;
  }>;
  /** Optional action buttons */
  actions?: {
    download?: { url: string; label: string };
    run?: { enabled: boolean; onClick?: () => void };
    like?: { count: number; onClick?: () => void };
  };
}

/**
 * Generic Entity Header
 *
 * Renders a header for any entity type with:
 * - Entity icon (from SVG paths)
 * - Title (uses config.nameField)
 * - Status badge
 * - Version and ID badges
 * - Creator and date
 * - Stats row
 * - Action buttons
 */
export function EntityHeader({
  entity,
  config,
  extraStats = [],
  actions,
}: EntityHeaderProps) {
  // Get nested field value (e.g., "source_data.name")
  const getNestedValue = (
    obj: Record<string, unknown>,
    path: string,
  ): unknown => {
    return path.split(".").reduce((current, key) => {
      return current && typeof current === "object"
        ? (current as Record<string, unknown>)[key]
        : undefined;
    }, obj as unknown);
  };

  // Entity identification
  const name =
    (getNestedValue(entity, config.nameField) as string) || "Untitled";
  const entityId = entity[config.idField] as string | number;
  const version = entity.version as number | undefined;
  const status = (entity.status as string) || "active";
  const statusConfig =
    statusConfigs[status as keyof typeof statusConfigs] || statusConfigs.active;

  // Metadata
  const creator = (entity.creator as string) || (entity.uploader as string);
  const date = entity.date as string;
  const uploadDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : undefined;

  // Licence
  const licence = entity.licence as string;

  // Stats from qualities or direct fields
  const qualities = entity.qualities as Record<string, number> | undefined;

  // Icon path
  const iconPath = entityIcons[config.type] || entityIcons.dataset;
  const viewBox = iconViewBox[config.type] || "0 0 448 512";

  return (
    <header className="space-y-6 border-b pb-8">
      {/* Title Section */}
      <div className="flex items-start gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={viewBox}
          className="h-8 w-8 shrink-0"
          style={{ color: config.color }}
          aria-hidden="true"
        >
          <path fill="currentColor" d={iconPath} />
        </svg>

        <div className="flex-1 space-y-3">
          {/* Title and Badges */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {name}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={statusConfig.variant}
                className={statusConfig.className}
              >
                {statusConfig.label}
              </Badge>

              {version !== undefined && (
                <Badge variant="outline" className="font-mono text-xs">
                  v{version}
                </Badge>
              )}

              <Badge variant="outline" className="font-mono text-xs">
                <Hash className="mr-0.5 h-3 w-3" />
                {entityId}
              </Badge>

              {licence && (
                <Badge variant="secondary" className="text-xs">
                  {licence}
                </Badge>
              )}
            </div>
          </div>

          {/* Creator and Date */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
            {creator && (
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{creator}</span>
              </div>
            )}

            {uploadDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Uploaded {uploadDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="bg-muted/30 flex flex-wrap items-center gap-6 rounded-lg p-4">
        {/* Stats from qualities */}
        {qualities?.NumberOfInstances !== undefined && (
          <Stat
            label="Instances"
            value={qualities.NumberOfInstances.toLocaleString()}
          />
        )}
        {qualities?.NumberOfFeatures !== undefined && (
          <Stat
            label="Features"
            value={qualities.NumberOfFeatures.toLocaleString()}
          />
        )}
        {qualities?.NumberOfClasses !== undefined && (
          <Stat
            label="Classes"
            value={qualities.NumberOfClasses.toLocaleString()}
          />
        )}

        {/* Extra stats passed as props */}
        {extraStats.map((stat, index) => (
          <Stat
            key={index}
            label={stat.label}
            value={
              typeof stat.value === "number"
                ? stat.value.toLocaleString()
                : stat.value
            }
            icon={stat.icon}
          />
        ))}

        {/* Common stats from entity */}
        {(entity.runs as number) > 0 && (
          <Stat
            label="Runs"
            value={(entity.runs as number).toLocaleString()}
            icon={<Play className="h-4 w-4" />}
          />
        )}
        {(entity.nr_of_downloads as number) > 0 && (
          <Stat
            label="Downloads"
            value={(entity.nr_of_downloads as number).toLocaleString()}
            icon={<Download className="h-4 w-4" />}
          />
        )}
        {(entity.nr_of_likes as number) > 0 && (
          <Stat
            label="Likes"
            value={(entity.nr_of_likes as number).toLocaleString()}
            icon={<Heart className="h-4 w-4" />}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {actions?.download && (
          <Button size="lg" asChild>
            <a href={actions.download.url} download>
              <Download className="mr-2 h-4 w-4" />
              {actions.download.label}
            </a>
          </Button>
        )}

        {actions?.run !== undefined && (
          <Button
            variant="outline"
            size="lg"
            disabled={!actions.run.enabled}
            onClick={actions.run.onClick}
          >
            <Play className="mr-2 h-4 w-4" />
            Run Experiment
          </Button>
        )}

        {actions?.like !== undefined && (
          <Button variant="outline" size="lg" onClick={actions.like.onClick}>
            <Heart className="mr-2 h-4 w-4" />
            Like ({actions.like.count})
          </Button>
        )}
      </div>
    </header>
  );
}

/**
 * Stat Component - Displays a single statistic
 */
function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <div className="flex items-baseline gap-1.5">
        <span className="text-foreground text-lg font-semibold">{value}</span>
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
    </div>
  );
}
