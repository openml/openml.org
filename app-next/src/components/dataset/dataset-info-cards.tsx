"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  User,
  Calendar,
  Hash,
  Scale,
  BarChart2,
  Layers,
  AlertCircle,
} from "lucide-react";
import type { Dataset } from "@/types/dataset";
import Link from "next/link";

interface DatasetInfoCardsProps {
  dataset: Dataset;
}

/**
 * DatasetInfoCards - Identity, Provenance, and Statistics cards
 * Displayed before the description section
 */
export function DatasetInfoCards({ dataset }: DatasetInfoCardsProps) {
  // Get initials from uploader name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status: Dataset["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "deactivated":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "in_preparation":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20";
    }
  };

  const statusLabels: Record<Dataset["status"], string> = {
    active: "Active",
    deactivated: "Deactivated",
    in_preparation: "In Preparation",
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Identity Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Database className="h-4 w-4 text-blue-500" />
            Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">ID</span>
            <span className="font-mono text-sm font-medium">
              #{dataset.data_id}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Version</span>
            <Badge variant="outline" className="font-mono text-xs">
              v{dataset.version}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Format</span>
            <Badge variant="secondary" className="text-xs uppercase">
              {dataset.format || "ARFF"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Status</span>
            <Badge variant="outline" className={getStatusColor(dataset.status)}>
              {statusLabels[dataset.status]}
            </Badge>
          </div>
          {dataset.licence && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">License</span>
              <span className="text-sm">{dataset.licence}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Provenance Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4 text-purple-500" />
            Provenance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Uploader with Avatar */}
          <div className="flex items-center gap-3">
            <Link href={`/users/${dataset.uploader_id}`}>
              <Avatar className="h-10 w-10 border">
                <AvatarFallback className="bg-linear-to-br from-purple-500 to-pink-500 text-sm font-medium text-white">
                  {getInitials(dataset.uploader || "U")}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1">
              <Link
                href={`/users/${dataset.uploader_id}`}
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                {dataset.uploader}
              </Link>
              <p className="text-muted-foreground text-xs">Uploader</p>
            </div>
          </div>

          {/* Creator (if different) */}
          {dataset.creator && dataset.creator !== dataset.uploader && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Creator</span>
              <span className="text-sm">{dataset.creator}</span>
            </div>
          )}

          {/* Upload Date */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Calendar className="h-3.5 w-3.5" />
              Uploaded
            </span>
            <span className="text-sm">{formatDate(dataset.date)}</span>
          </div>

          {/* Collection Date */}
          {dataset.collection_date && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Collected</span>
              <span className="text-sm">{dataset.collection_date}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <BarChart2 className="h-4 w-4 text-green-500" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Instances */}
          {dataset.qualities?.NumberOfInstances != null && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <Layers className="h-3.5 w-3.5" />
                Instances
              </span>
              <span className="font-mono text-sm font-medium">
                {dataset.qualities.NumberOfInstances.toLocaleString()}
              </span>
            </div>
          )}

          {/* Features */}
          {dataset.qualities?.NumberOfFeatures != null && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <Hash className="h-3.5 w-3.5" />
                Features
              </span>
              <span className="font-mono text-sm font-medium">
                {dataset.qualities.NumberOfFeatures.toLocaleString()}
              </span>
            </div>
          )}

          {/* Classes */}
          {dataset.qualities?.NumberOfClasses != null &&
            dataset.qualities.NumberOfClasses > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                  <Scale className="h-3.5 w-3.5" />
                  Classes
                </span>
                <span className="font-mono text-sm font-medium">
                  {dataset.qualities.NumberOfClasses.toLocaleString()}
                </span>
              </div>
            )}

          {/* Missing Values */}
          {dataset.qualities?.NumberOfMissingValues != null && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <AlertCircle className="h-3.5 w-3.5" />
                Missing
              </span>
              <span className="font-mono text-sm font-medium">
                {dataset.qualities.NumberOfMissingValues.toLocaleString()}
              </span>
            </div>
          )}

          {/* Numeric/Nominal ratio */}
          {dataset.qualities?.NumberOfNumericFeatures != null &&
            dataset.qualities?.NumberOfSymbolicFeatures != null && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Numeric / Nominal
                </span>
                <span className="text-sm">
                  {dataset.qualities.NumberOfNumericFeatures} /{" "}
                  {dataset.qualities.NumberOfSymbolicFeatures}
                </span>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
