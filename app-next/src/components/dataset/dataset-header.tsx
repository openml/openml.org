import { Database, Download, Heart, Play, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Dataset } from "@/types/dataset";

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
  // status badge styling
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

  return (
    <header className="space-y-6 border-b pb-8">
      {/* Title Section */}
      <div className="flex items-start gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="h-8 w-8 shrink-0"
          style={{ color: "#66BB6A" }}
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M448 205.8c-14.8 9.8-31.8 17.7-49.5 24-47 16.8-108.7 26.2-174.5 26.2S96.4 246.5 49.5 229.8c-17.6-6.3-34.7-14.2-49.5-24L0 288c0 44.2 100.3 80 224 80s224-35.8 224-80l0-82.2zm0-77.8l0-48C448 35.8 347.7 0 224 0S0 35.8 0 80l0 48c0 44.2 100.3 80 224 80s224-35.8 224-80zM398.5 389.8C351.6 406.5 289.9 416 224 416S96.4 406.5 49.5 389.8c-17.6-6.3-34.7-14.2-49.5-24L0 432c0 44.2 100.3 80 224 80s224-35.8 224-80l0-66.2c-14.8 9.8-31.8 17.7-49.5 24z"
          />
        </svg>

        <div className="flex-1 space-y-3">
          {/* Title and Badges */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {dataset.name}
            </h1>

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
            </div>
          </div>

          {/* Creator and Date */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
            {dataset.creator && (
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{dataset.creator}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Uploaded {uploadDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 flex flex-wrap items-center gap-6 rounded-lg p-4">
        {/* Instances */}
        {dataset.qualities?.NumberOfInstances !== undefined && (
          <Stat
            label="Instances"
            value={dataset.qualities.NumberOfInstances.toLocaleString()}
          />
        )}

        {/* Features */}
        {dataset.qualities?.NumberOfFeatures !== undefined && (
          <Stat
            label="Features"
            value={dataset.qualities.NumberOfFeatures.toLocaleString()}
          />
        )}

        {/* Classes */}
        {dataset.qualities?.NumberOfClasses !== undefined && (
          <Stat
            label="Classes"
            value={dataset.qualities.NumberOfClasses.toLocaleString()}
          />
        )}

        {/* Tasks */}
        {taskCount > 0 && <Stat label="Tasks" value={taskCount.toString()} />}

        {/* Runs */}
        {(runCount > 0 || dataset.runs) && (
          <Stat
            label="Runs"
            value={(runCount || dataset.runs || 0).toLocaleString()}
            icon={<Play className="h-4 w-4" />}
          />
        )}

        {/* Downloads */}
        {dataset.nr_of_downloads > 0 && (
          <Stat
            label="Downloads"
            value={dataset.nr_of_downloads.toLocaleString()}
            icon={<Download className="h-4 w-4" />}
          />
        )}

        {/* Likes */}
        {dataset.nr_of_likes > 0 && (
          <Stat
            label="Likes"
            value={dataset.nr_of_likes.toLocaleString()}
            icon={<Heart className="h-4 w-4" />}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button size="lg" asChild>
          <a href={dataset.url} download>
            <Download className="mr-2 h-4 w-4" />
            Download Dataset
          </a>
        </Button>

        {/* TODO: Implement these actions */}
        <Button variant="outline" size="lg" disabled>
          <Play className="mr-2 h-4 w-4" />
          Run Experiment
        </Button>

        <Button variant="outline" size="lg" disabled>
          <Heart className="mr-2 h-4 w-4" />
          Like ({dataset.nr_of_likes})
        </Button>
      </div>
    </header>
  );
}

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
