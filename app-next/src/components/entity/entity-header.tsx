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
import {
  Download,
  Heart,
  Play,
  Calendar,
  User,
  Hash,
} from "lucide-react";
import type { EntityConfig } from "@/config/entities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
 * - Entity icon (from FontAwesome config)
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
    // Handle special case for nested arrays like "inputs[0].name" or simple dot notation
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

  return (
    <header className="space-y-6 border-b pb-8">
      {/* Title Section */}
      <div className="flex items-start gap-4">
        <div
          className="bg-opacity-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
          style={{
            color: config.color,
            backgroundColor: `${config.color}1a`, // 10% opacity
          }}
        >
          <FontAwesomeIcon icon={config.icon} className="h-6 w-6" />
        </div>

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

interface StatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

function Stat({ label, value, icon }: StatProps) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-muted-foreground text-xs font-medium uppercase">
        {label}
      </dt>
      <dd className="flex items-center gap-2 text-lg font-semibold">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {value}
      </dd>
    </div>
  );
}
