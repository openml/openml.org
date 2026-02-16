/**
 * 🎯 Generic Entity Metadata Grid Component
 *
 * Displays metadata in organized cards for any entity type.
 * Configurable metadata items through props.
 */

import {
  Calendar,
  User,
  FileType,
  Shield,
  Heart,
  Download,
  Hash,
  GitBranch,
  CheckCircle,
  XCircle,
  Clock,
  LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "@/config/routing";
import type { EntityConfig } from "@/config/entities";

/**
 * Metadata item configuration
 */
export interface MetadataItem {
  icon: LucideIcon;
  label: string;
  value: string | number | undefined | null;
  type?: "text" | "date" | "link" | "user" | "status";
  href?: string;
}

/**
 * Metadata card configuration
 */
export interface MetadataCard {
  title: string;
  description: string;
  items: MetadataItem[];
}

interface EntityMetadataGridProps {
  /** The entity data object */
  entity: Record<string, unknown>;
  /** Entity configuration from config/entities.ts */
  config: EntityConfig;
  /** Cards with metadata items to display */
  cards: MetadataCard[];
}

// Status configurations
const statusConfigs: Record<
  string,
  { icon: typeof CheckCircle; className: string; label: string }
> = {
  active: { icon: CheckCircle, className: "text-green-600", label: "Active" },
  deactivated: {
    icon: XCircle,
    className: "text-red-600",
    label: "Deactivated",
  },
  in_preparation: {
    icon: Clock,
    className: "text-orange-600",
    label: "In Preparation",
  },
};

/**
 * Format date for display
 */
function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Unknown";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString.split(" ")[0];
  }
}

/**
 * Generic Entity Metadata Grid
 *
 * Renders metadata in card format with configurable items.
 */
export function EntityMetadataGrid({
  entity,
  config,
  cards,
}: EntityMetadataGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, cardIndex) => (
        <Card key={cardIndex} className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {card.items.map((item, itemIndex) => (
              <MetadataItemRow key={itemIndex} item={item} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Individual metadata item row
 */
function MetadataItemRow({ item }: { item: MetadataItem }) {
  const Icon = item.icon;
  const value = item.value;

  if (value === undefined || value === null) {
    return null;
  }

  // Render based on type
  switch (item.type) {
    case "date":
      return (
        <div className="flex items-start gap-3">
          <Icon className="text-muted-foreground mt-0.5 h-4 w-4" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-muted-foreground text-sm">
              {formatDate(value as string)}
            </p>
          </div>
        </div>
      );

    case "link":
      return (
        <div className="flex items-start gap-3">
          <Icon className="text-muted-foreground mt-0.5 h-4 w-4" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{item.label}</p>
            <a
              href={item.href || "#"}
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              {value}
            </a>
          </div>
        </div>
      );

    case "user":
      return (
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {String(value).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{item.label}</p>
            {item.href ? (
              <a
                href={item.href}
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                {value}
              </a>
            ) : (
              <p className="text-muted-foreground text-sm">{value}</p>
            )}
          </div>
        </div>
      );

    case "status":
      const statusKey = String(value).toLowerCase();
      const statusConfig = statusConfigs[statusKey] || statusConfigs.active;
      const StatusIcon = statusConfig.icon;
      return (
        <div className="flex items-start gap-3">
          <StatusIcon className={`mt-0.5 h-4 w-4 ${statusConfig.className}`} />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-muted-foreground text-sm capitalize">
              {statusConfig.label}
            </p>
          </div>
        </div>
      );

    default:
      return (
        <div className="flex items-start gap-3">
          <Icon className="text-muted-foreground mt-0.5 h-4 w-4" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-muted-foreground text-sm">{value}</p>
          </div>
        </div>
      );
  }
}

/**
 * 🔧 Helper: Create dataset metadata cards
 *
 * Use this to create the cards for a dataset entity.
 * Each entity type can have its own helper function.
 */
export function createDatasetMetadataCards(
  dataset: Record<string, unknown>,
): MetadataCard[] {
  return [
    {
      title: "Identity",
      description: "Dataset identification and format",
      items: [
        {
          icon: Hash,
          label: "Dataset ID",
          value: dataset.data_id as number,
          type: "text",
        },
        {
          icon: GitBranch,
          label: "Version",
          value: `v${dataset.version}`,
          type: "text",
        },
        {
          icon: FileType,
          label: "Format",
          value: dataset.format as string,
          type: "text",
        },
        {
          icon: Shield,
          label: "License",
          value: dataset.licence as string,
          type: "text",
        },
        {
          icon: Calendar,
          label: "Upload Date",
          value: dataset.date as string,
          type: "date",
        },
      ],
    },
    {
      title: "Provenance",
      description: "Uploader and status information",
      items: [
        {
          icon: User,
          label: "Uploader",
          value: dataset.uploader as string,
          type: "user",
          href: `/users/${dataset.uploader_id}`,
        },
        {
          icon: CheckCircle,
          label: "Status",
          value: dataset.status as string,
          type: "status",
        },
      ],
    },
    {
      title: "Statistics",
      description: "Usage and popularity metrics",
      items: [
        {
          icon: Download,
          label: "Downloads",
          value: dataset.nr_of_downloads as number,
          type: "text",
        },
        {
          icon: Heart,
          label: "Likes",
          value: dataset.nr_of_likes as number,
          type: "text",
        },
      ],
    },
  ];
}

/**
 * 🔧 Helper: Create task metadata cards
 */
export function createTaskMetadataCards(
  task: Record<string, unknown>,
): MetadataCard[] {
  const sourceData = task.source_data as Record<string, unknown> | undefined;
  const taskType = task.tasktype as Record<string, unknown> | undefined;
  const estimationProcedure = task.estimation_procedure as
    | Record<string, unknown>
    | undefined;

  return [
    {
      title: "Task Details",
      description: "Task type and configuration",
      items: [
        {
          icon: Hash,
          label: "Task ID",
          value: task.task_id as number,
          type: "text",
        },
        {
          icon: FileType,
          label: "Task Type",
          value: taskType?.name as string,
          type: "text",
        },
        {
          icon: Calendar,
          label: "Created",
          value: task.date as string,
          type: "date",
        },
      ],
    },
    {
      title: "Source Data",
      description: "Dataset used for this task",
      items: [
        {
          icon: Hash,
          label: "Dataset",
          value: sourceData?.name as string,
          type: "link",
          href: `/datasets/${sourceData?.data_id}`,
        },
        {
          icon: FileType,
          label: "Target Feature",
          value: task.target_feature as string,
          type: "text",
        },
      ],
    },
    {
      title: "Evaluation",
      description: "How models are evaluated",
      items: [
        {
          icon: FileType,
          label: "Estimation Procedure",
          value: estimationProcedure?.name as string,
          type: "text",
        },
        {
          icon: FileType,
          label: "Evaluation Measures",
          value: (task.evaluation_measures as string[])?.join(", "),
          type: "text",
        },
      ],
    },
  ];
}

/**
 * 🔧 Helper: Create flow metadata cards
 */
export function createFlowMetadataCards(
  flow: Record<string, unknown>,
): MetadataCard[] {
  return [
    {
      title: "Identity",
      description: "Flow identification",
      items: [
        {
          icon: Hash,
          label: "Flow ID",
          value: flow.flow_id as number,
          type: "text",
        },
        {
          icon: GitBranch,
          label: "Version",
          value: `v${flow.version}`,
          type: "text",
        },
        {
          icon: Shield,
          label: "License",
          value: flow.licence as string,
          type: "text",
        },
        {
          icon: Calendar,
          label: "Created",
          value: flow.date as string,
          type: "date",
        },
      ],
    },
    {
      title: "Provenance",
      description: "Creator information",
      items: [
        {
          icon: User,
          label: "Uploader",
          value: flow.uploader as string,
          type: "user",
          href: `/users/${flow.uploader_id}`,
        },
      ],
    },
    {
      title: "Statistics",
      description: "Usage metrics",
      items: [
        {
          icon: Download,
          label: "Downloads",
          value: flow.nr_of_downloads as number,
          type: "text",
        },
        {
          icon: Heart,
          label: "Likes",
          value: flow.nr_of_likes as number,
          type: "text",
        },
      ],
    },
  ];
}
