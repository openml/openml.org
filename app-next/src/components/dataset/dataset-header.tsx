import { Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Dataset } from "@/types/dataset";

interface DatasetHeaderProps {
  dataset: Dataset;
}

/**
 * DatasetHeader Component
 *
 * Displays the dataset name, status, and key identifiers.
 * This is a Server Component for optimal performance.
 */
export function DatasetHeader({ dataset }: DatasetHeaderProps) {
  // Determine status badge variant and label
  const getStatusConfig = (status: Dataset["status"]) => {
    switch (status) {
      case "active":
        return {
          variant: "default" as const,
          label: "Verified",
          className:
            "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
        };
      case "deactivated":
        return {
          variant: "destructive" as const,
          label: "Deprecated",
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

  return (
    <div className="mb-8 space-y-4">
      {/* Title and Status */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {dataset.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={statusConfig.variant}
              className={statusConfig.className}
            >
              {statusConfig.label}
            </Badge>

            <Badge variant="outline" className="font-mono">
              v{dataset.version}
            </Badge>

            <Badge variant="outline" className="font-mono">
              ID: {dataset.data_id}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="text-muted-foreground flex flex-wrap gap-6 text-sm">
        {dataset.qualities?.NumberOfInstances !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-foreground font-medium">
              {dataset.qualities.NumberOfInstances.toLocaleString()}
            </span>
            <span>instances</span>
          </div>
        )}

        {dataset.qualities?.NumberOfFeatures !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-foreground font-medium">
              {dataset.qualities.NumberOfFeatures.toLocaleString()}
            </span>
            <span>features</span>
          </div>
        )}

        {dataset.qualities?.NumberOfclassNamees !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-foreground font-medium">
              {dataset.qualities.NumberOfclassNamees.toLocaleString()}
            </span>
            <span>classNamees</span>
          </div>
        )}

        {dataset.qualities?.NumberOfMissingValues !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-foreground font-medium">
              {dataset.qualities.NumberOfMissingValues.toLocaleString()}
            </span>
            <span>missing values</span>
          </div>
        )}
      </div>
    </div>
  );
}
