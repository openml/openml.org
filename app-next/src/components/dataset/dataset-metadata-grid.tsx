import {
  Calendar,
  User,
  FileType,
  Shield,
  Heart,
  Download,
  AlertCircle,
  Hash,
  GitBranch,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Dataset } from "@/types/dataset";
import { Link } from "@/config/routing";

interface DatasetMetadataGridProps {
  dataset: Dataset;
}

/**
 * DatasetMetadataGrid Component
 *
 * Displays dataset metadata in organized cards.
 * Server Component for optimal performance.
 */
export function DatasetMetadataGrid({ dataset }: DatasetMetadataGridProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString.split(" ")[0];
    }
  };

  // Get status icon and color
  const getStatusIcon = () => {
    switch (dataset.status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "deactivated":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "in_preparation":
        return <Clock className="h-4 w-4 text-orange-600" />;
    }
  };

  return (
    <div className="container mx-auto w-full flex-1 px-4 py-6 sm:px-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Identity Card */}
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Identity</CardTitle>
            <CardDescription>Dataset identification and format</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Hash className="text-muted-foreground mt-0.5 h-4 w-4" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Dataset ID</p>
                <p className="text-muted-foreground font-mono text-sm">
                  {dataset.data_id}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GitBranch className="text-muted-foreground mt-0.5 h-4 w-4" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Version</p>
                <p className="text-muted-foreground text-sm">
                  v{dataset.version}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileType className="text-muted-foreground mt-0.5 h-4 w-4" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Format</p>
                <p className="text-muted-foreground text-sm">
                  {dataset.format}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="text-muted-foreground mt-0.5 h-4 w-4" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">License</p>
                <p className="text-muted-foreground text-sm">
                  {dataset.licence}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-muted-foreground mt-0.5 h-4 w-4" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Upload Date</p>
                <p className="text-muted-foreground text-sm">
                  {formatDate(dataset.date)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provenance Card */}
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Provenance</CardTitle>
            <CardDescription>Uploader and status information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {dataset.uploader?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Uploader</p>
                <Link
                  href={`/users/${dataset.uploader_id}`}
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  {dataset.uploader}
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {getStatusIcon()}
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Status</p>
                <p className="text-muted-foreground text-sm capitalize">
                  {dataset.status === "active"
                    ? "Verified"
                    : dataset.status.replace("_", " ")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Heart className="text-muted-foreground mt-0.5 h-4 w-4" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Likes</p>
                <p className="text-muted-foreground text-sm">
                  {dataset.nr_of_likes.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Download className="text-muted-foreground mt-0.5 h-4 w-4" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Downloads</p>
                <p className="text-muted-foreground text-sm">
                  {dataset.nr_of_downloads.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertCircle className="text-muted-foreground mt-0.5 h-4 w-4" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Issues</p>
                <p className="text-muted-foreground text-sm">
                  {dataset.nr_of_issues.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Statistics</CardTitle>
            <CardDescription>Dataset characteristics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dataset.qualities?.NumberOfInstances !== undefined && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Instances</p>
                <p className="text-2xl font-bold">
                  {dataset.qualities.NumberOfInstances.toLocaleString()}
                </p>
              </div>
            )}

            {dataset.qualities?.NumberOfFeatures !== undefined && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Features</p>
                <p className="text-2xl font-bold">
                  {dataset.qualities.NumberOfFeatures.toLocaleString()}
                </p>
              </div>
            )}

            {dataset.qualities?.NumberOfclassNamees !== undefined && (
              <div className="space-y-1">
                <p className="text-sm font-medium">classNamees</p>
                <p className="text-2xl font-bold">
                  {dataset.qualities.NumberOfclassNamees.toLocaleString()}
                </p>
              </div>
            )}

            {dataset.qualities?.NumberOfMissingValues !== undefined && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Missing Values</p>
                <p className="text-2xl font-bold">
                  {dataset.qualities.NumberOfMissingValues.toLocaleString()}
                </p>
              </div>
            )}

            {dataset.qualities?.NumberOfNumericFeatures !== undefined && (
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Numeric Features
                </p>
                <p className="text-muted-foreground text-sm">
                  {dataset.qualities.NumberOfNumericFeatures.toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
