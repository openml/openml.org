"use client";

import { useState } from "react";
import {
  BarChart2,
  PieChart,
  TrendingUp,
  Grid3X3,
  ImageIcon,
  ExternalLink,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollapsibleSection } from "./collapsible-section";
import type { Dataset } from "@/types/dataset";

interface DataVisualizationSectionProps {
  dataset: Dataset;
}

/**
 * DataVisualizationSection Component
 *
 * Displays data visualization options and embedded visualizations.
 * Features:
 * - Feature distribution charts (placeholder for future implementation)
 * - Class distribution (for classification datasets)
 * - Missing values heatmap
 * - Correlation matrix
 * - Links to external visualization tools (e.g., BOOST)
 */
export function DataVisualizationSection({
  dataset,
}: DataVisualizationSectionProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const hasClasses =
    dataset.qualities?.NumberOfClasses && dataset.qualities.NumberOfClasses > 1;
  const hasMissingValues =
    dataset.qualities?.NumberOfMissingValues &&
    dataset.qualities.NumberOfMissingValues > 0;

  // Calculate some quick stats for visualization
  const numericFeatures = dataset.qualities?.NumberOfNumericFeatures || 0;
  const nominalFeatures = dataset.qualities?.NumberOfSymbolicFeatures || 0;
  const totalFeatures = dataset.qualities?.NumberOfFeatures || 0;

  return (
    <CollapsibleSection
      id="visualizations"
      title="Data Visualization"
      description="Visual insights into dataset characteristics"
      icon={<BarChart2 className="h-4 w-4 text-purple-500" />}
      defaultOpen={true}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          {hasClasses && <TabsTrigger value="classes">Classes</TabsTrigger>}
          {hasMissingValues && (
            <TabsTrigger value="missing">Missing Values</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard
              label="Instances"
              value={
                dataset.qualities?.NumberOfInstances?.toLocaleString() || "N/A"
              }
              icon={Grid3X3}
            />
            <StatCard
              label="Features"
              value={totalFeatures.toLocaleString()}
              icon={BarChart2}
            />
            {hasClasses && (
              <StatCard
                label="Classes"
                value={
                  dataset.qualities?.NumberOfClasses?.toLocaleString() || "N/A"
                }
                icon={PieChart}
              />
            )}
            <StatCard
              label="Missing %"
              value={
                dataset.qualities?.NumberOfMissingValues !== undefined &&
                dataset.qualities?.NumberOfInstances !== undefined &&
                dataset.qualities?.NumberOfFeatures !== undefined
                  ? `${(
                      (dataset.qualities.NumberOfMissingValues /
                        (dataset.qualities.NumberOfInstances *
                          dataset.qualities.NumberOfFeatures)) *
                      100
                    ).toFixed(1)}%`
                  : "0%"
              }
              icon={TrendingUp}
            />
          </div>

          {/* Feature Type Distribution */}
          {totalFeatures > 0 && (
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-medium">Feature Types</h4>
              <div className="bg-muted flex h-6 items-center gap-2 overflow-hidden rounded-full">
                {numericFeatures > 0 && (
                  <div
                    className="flex h-full items-center justify-center bg-blue-500 text-xs font-medium text-white"
                    style={{
                      width: `${(numericFeatures / totalFeatures) * 100}%`,
                    }}
                  >
                    {numericFeatures > 2 && `${numericFeatures} numeric`}
                  </div>
                )}
                {nominalFeatures > 0 && (
                  <div
                    className="flex h-full items-center justify-center bg-green-500 text-xs font-medium text-white"
                    style={{
                      width: `${(nominalFeatures / totalFeatures) * 100}%`,
                    }}
                  >
                    {nominalFeatures > 2 && `${nominalFeatures} nominal`}
                  </div>
                )}
              </div>
              <div className="text-muted-foreground mt-2 flex gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-blue-500" />
                  Numeric ({numericFeatures})
                </span>
                <span className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-green-500" />
                  Nominal ({nominalFeatures})
                </span>
              </div>
            </div>
          )}

          {/* Placeholder for future visualization */}
          <div className="border-muted-foreground/25 mt-6 rounded-lg border-2 border-dashed p-8 text-center">
            <ImageIcon className="text-muted-foreground/50 mx-auto h-12 w-12" />
            <p className="text-muted-foreground mt-2">
              Interactive visualizations coming soon
            </p>
            <p className="text-muted-foreground/70 mt-1 text-sm">
              Feature distributions, correlation heatmaps, and more
            </p>
          </div>

          {/* External Links */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://www.openml.org/api/v1/data/features/${dataset.data_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Features API
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://www.openml.org/api/v1/data/qualities/${dataset.data_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Qualities API
              </a>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="text-muted-foreground bg-muted/50 flex items-center gap-2 rounded-lg p-4">
            <Info className="h-4 w-4" />
            <span className="text-sm">
              Detailed feature distributions and histograms will be displayed
              here. See the Features section below for the complete feature
              table.
            </span>
          </div>
        </TabsContent>

        {hasClasses && (
          <TabsContent value="classes" className="space-y-4">
            <div className="text-muted-foreground bg-muted/50 flex items-center gap-2 rounded-lg p-4">
              <Info className="h-4 w-4" />
              <span className="text-sm">
                Class distribution visualization will show the balance of target
                classes. This dataset has {dataset.qualities?.NumberOfClasses}{" "}
                classes.
              </span>
            </div>
          </TabsContent>
        )}

        {hasMissingValues && (
          <TabsContent value="missing" className="space-y-4">
            <div className="text-muted-foreground bg-muted/50 flex items-center gap-2 rounded-lg p-4">
              <Info className="h-4 w-4" />
              <span className="text-sm">
                Missing values heatmap will show the pattern of missing data.
                This dataset has{" "}
                {dataset.qualities?.NumberOfMissingValues?.toLocaleString()}{" "}
                missing values.
              </span>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </CollapsibleSection>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-muted/50 rounded-lg border p-4">
      <div className="text-muted-foreground mb-1 flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
