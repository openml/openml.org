"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Database,
  Download,
  Grid3X3,
  LayoutList,
  Maximize2,
  Minimize2,
  FileText,
  Target,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import type { Dataset, DatasetFeature } from "@/types/dataset";
import { useParquetData, computeDistribution } from "@/hooks/useParquetData";

// Dynamic import for Plotly (required for SSR compatibility)
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center">
      <Skeleton className="h-full w-full" />
    </div>
  ),
});

// Custom styles moved to globals.css

interface DataAnalysisSectionProps {
  dataset: Dataset;
  className?: string;
}

/**
 * DataAnalysisSection Component - MERGED PROTOTYPE
 *
 * Combines Data Explorer + Analysis into a single unified section.
 * Based on Pieter's feedback:
 * - Only Compact table view (removed Detail and Column views)
 * - Target column marked with 🎯 icon instead of separate column
 * - Distribution and Correlation as sub-tabs
 */
export function DataAnalysisSection({
  dataset,
  className,
}: DataAnalysisSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const FEATURES_TABLE_PAGE_SIZE = 50;
  const [featuresTablePage, setFeaturesTablePage] = useState(1);
  const [featuresView, setFeaturesView] = useState<"list" | "grid">("grid");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("features");
  const containerRef = useRef<HTMLElement>(null);

  const features = dataset.features || [];
  const qualities = dataset.qualities || {};
  const numericFeatures = features.filter((f) => f.type === "numeric");
  const nominalFeatures = features.filter((f) => f.type === "nominal");

  // Estimate raw data size to determine visualization strategy
  const estimatedRawBytes =
    (qualities.NumberOfInstances || 0) * (qualities.NumberOfFeatures || 0) * 8;
  const isHugeDataset = estimatedRawBytes > 5 * 1024 * 1024 * 1024; // > 5GB raw estimate

  // Load parquet data for real distributions (skip for huge datasets)
  const parquetState = useParquetData(
    isHugeDataset ? undefined : dataset.data_id,
    isHugeDataset ? undefined : dataset.url,
  );

  // Fullscreen toggle handler
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }, []);

  // Download handler
  const handleDownload = useCallback(() => {
    if (dataset.url) {
      window.open(dataset.url, "_blank");
    } else {
      window.open(
        `https://www.openml.org/data/download/${dataset.file_id}/${dataset.name}.arff`,
        "_blank",
      );
    }
  }, [dataset.url, dataset.file_id, dataset.name]);

  // Calculate file size estimate
  const estimatedSize =
    qualities.NumberOfInstances && qualities.NumberOfFeatures
      ? (
          (qualities.NumberOfInstances * qualities.NumberOfFeatures * 8) /
          1024
        ).toFixed(2)
      : null;

  // Limit displayed features initially
  const totalFeaturesTablePages = Math.ceil(
    features.length / FEATURES_TABLE_PAGE_SIZE,
  );
  const displayedFeatures = features.slice(
    (featuresTablePage - 1) * FEATURES_TABLE_PAGE_SIZE,
    featuresTablePage * FEATURES_TABLE_PAGE_SIZE,
  );

  return (
    <section
      id="data-analysis"
      ref={containerRef}
      className={cn(
        "scroll-mt-20",
        isFullscreen && "bg-background overflow-auto p-4",
        className,
      )}
    >
      {/* Plotly modebar styles are now in globals.css */}

      <Card>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          {/* File Header */}
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3">
              {/* File info row */}
              <div className="flex items-center justify-between">
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-3 text-left transition-opacity hover:opacity-80">
                    <div className="flex items-center gap-2">
                      <FileText className="text-muted-foreground h-5 w-5" />
                      <div>
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                          {dataset.name}.arff
                          <span className="text-muted-foreground text-sm font-normal">
                            {estimatedSize ? `(~${estimatedSize} KB)` : ""}
                          </span>
                          {parquetState.data && (
                            <Badge
                              variant="default"
                              className="ml-2 bg-green-500 text-xs"
                            >
                              Real data
                            </Badge>
                          )}
                          {parquetState.isLoading && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                              Loading...
                            </Badge>
                          )}
                        </CardTitle>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <ChevronDown className="text-muted-foreground h-4 w-4" />
                    )}
                  </button>
                </CollapsibleTrigger>

                {/* Action buttons */}
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleDownload}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={toggleFullscreen}
                        >
                          {isFullscreen ? (
                            <Minimize2 className="h-4 w-4" />
                          ) : (
                            <Maximize2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="pt-0">
              {/* Main tabs for Features / Distribution / Correlation */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="features">
                    <Database className="mr-1 h-4 w-4" />
                    Features ({features.length})
                  </TabsTrigger>
                  <TabsTrigger value="distribution">Distribution</TabsTrigger>
                  <TabsTrigger value="correlation">Correlation</TabsTrigger>
                </TabsList>

                {/* Features Tab */}
                <TabsContent value="features" className="space-y-4">
                  {/* View toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      {features.length} features
                    </span>
                    <div className="flex items-center gap-1 rounded-md border p-0.5">
                      <Button
                        variant={
                          featuresView === "grid" ? "secondary" : "ghost"
                        }
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setFeaturesView("grid")}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={
                          featuresView === "list" ? "secondary" : "ghost"
                        }
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setFeaturesView("list")}
                      >
                        <LayoutList className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Grid view */}
                  {featuresView === "grid" ? (
                    <div className="rounded-lg border p-2">
                      <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
                        {displayedFeatures.map((feature) => (
                          <div
                            key={feature.index}
                            className={cn(
                              "flex items-center gap-2 rounded px-2 py-1.5 text-sm",
                              feature.target &&
                                "bg-amber-50 dark:bg-amber-950/20",
                            )}
                          >
                            <span className="flex items-center gap-1 truncate">
                              {feature.target && (
                                <Target className="h-3 w-3 shrink-0 text-amber-500" />
                              )}
                              <span className="truncate">{feature.name}</span>
                            </span>
                            <FeatureTypeBadge type={feature.type} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* List view */
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                              #
                            </th>
                            <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                              Name
                            </th>
                            <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                              Type
                            </th>
                            <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                              Missing
                            </th>
                            <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                              Distinct
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedFeatures.map((feature, index) => (
                            <tr
                              key={feature.index ?? index}
                              className={cn(
                                "hover:bg-muted/50 border-b last:border-0",
                                feature.target &&
                                  "bg-amber-50 dark:bg-amber-950/20",
                              )}
                            >
                              <td className="text-muted-foreground px-3 py-2">
                                {(featuresTablePage - 1) *
                                  FEATURES_TABLE_PAGE_SIZE +
                                  index}
                              </td>
                              <td className="px-3 py-2 font-medium">
                                <span className="flex items-center gap-1.5">
                                  {feature.target && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Target className="h-4 w-4 shrink-0 text-amber-500" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          Target attribute
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                  {feature.name}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                <FeatureTypeBadge type={feature.type} />
                              </td>
                              <td className="px-3 py-2">
                                {feature.missing || 0}
                              </td>
                              <td className="px-3 py-2">
                                {feature.distinct || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalFeaturesTablePages > 1 && (
                    <div className="flex items-center justify-between px-3">
                      <span className="text-muted-foreground text-xs">
                        Showing{" "}
                        {(featuresTablePage - 1) * FEATURES_TABLE_PAGE_SIZE + 1}
                        -
                        {Math.min(
                          featuresTablePage * FEATURES_TABLE_PAGE_SIZE,
                          features.length,
                        )}{" "}
                        of {features.length}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setFeaturesTablePage((p) => Math.max(1, p - 1))
                          }
                          disabled={featuresTablePage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-muted-foreground px-2 text-xs">
                          {featuresTablePage} / {totalFeaturesTablePages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setFeaturesTablePage((p) =>
                              Math.min(totalFeaturesTablePages, p + 1),
                            )
                          }
                          disabled={
                            featuresTablePage === totalFeaturesTablePages
                          }
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Distribution Tab */}
                <TabsContent value="distribution" className="space-y-6">
                  <FeatureDistributionPlots
                    numericFeatures={numericFeatures}
                    nominalFeatures={nominalFeatures}
                    allFeatures={features}
                    parquetData={parquetState.data}
                    isLoadingParquet={parquetState.isLoading}
                    isTooLarge={parquetState.isTooLarge}
                    isHugeDataset={isHugeDataset}
                    datasetId={dataset.data_id}
                  />
                </TabsContent>

                {/* Correlation Tab */}
                <TabsContent value="correlation">
                  <CorrelationHeatmap
                    numericFeatures={numericFeatures}
                    parquetData={parquetState.data}
                    datasetId={dataset.data_id}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Summary Card */}
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Database className="h-4 w-4" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">1 file</span>
            </div>
            <div>
              <span className="font-medium">{features.length}</span>
              <span className="text-muted-foreground ml-1">columns</span>
            </div>
            <div>
              <span className="font-medium">
                {qualities.NumberOfInstances?.toLocaleString() || "—"}
              </span>
              <span className="text-muted-foreground ml-1">rows</span>
            </div>
            {qualities.NumberOfClasses && qualities.NumberOfClasses > 1 && (
              <div>
                <span className="font-medium">{qualities.NumberOfClasses}</span>
                <span className="text-muted-foreground ml-1">classes</span>
              </div>
            )}
            {parquetState.data && (
              <div>
                <span className="text-green-600 dark:text-green-400">
                  ✓ Real data loaded
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// Feature Type Badge Component
function FeatureTypeBadge({ type }: { type?: string }) {
  const normalizedType = type?.toLowerCase() || "unknown";

  const typeConfig: Record<string, { label: string; color: string }> = {
    numeric: {
      label: "Numeric",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    real: {
      label: "Real",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    integer: {
      label: "Integer",
      color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    },
    nominal: {
      label: "Nominal",
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    },
    string: {
      label: "String",
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    },
    date: {
      label: "Date",
      color:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    },
  };

  const config = typeConfig[normalizedType] || {
    label: type || "Unknown",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-medium",
        config.color,
      )}
    >
      {config.label}
    </span>
  );
}

/**
 * Compute Pearson correlation coefficient between two arrays
 */
function computePearsonCorrelation(
  xValues: (string | number | null)[],
  yValues: (string | number | null)[],
): number {
  const pairs: [number, number][] = [];
  for (let i = 0; i < Math.min(xValues.length, yValues.length); i++) {
    const x = xValues[i];
    const y = yValues[i];
    if (
      x !== null &&
      y !== null &&
      typeof x === "number" &&
      typeof y === "number" &&
      !isNaN(x) &&
      !isNaN(y)
    ) {
      pairs.push([x, y]);
    }
  }

  if (pairs.length < 2) return 0;

  const n = pairs.length;
  const sumX = pairs.reduce((sum, p) => sum + p[0], 0);
  const sumY = pairs.reduce((sum, p) => sum + p[1], 0);
  const sumXY = pairs.reduce((sum, p) => sum + p[0] * p[1], 0);
  const sumX2 = pairs.reduce((sum, p) => sum + p[0] * p[0], 0);
  const sumY2 = pairs.reduce((sum, p) => sum + p[1] * p[1], 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY),
  );

  if (denominator === 0) return 0;

  const correlation = numerator / denominator;
  return Math.round(correlation * 100) / 100;
}

/**
 * Feature Distribution Plots - Simplified version
 */
function FeatureDistributionPlots({
  allFeatures,
  parquetData,
  isLoadingParquet,
  isTooLarge,
  isHugeDataset,
  datasetId,
}: {
  numericFeatures?: DatasetFeature[];
  nominalFeatures?: DatasetFeature[];
  allFeatures: DatasetFeature[];
  parquetData: Record<string, (string | number | null)[]> | null;
  isLoadingParquet: boolean;
  isTooLarge?: boolean;
  isHugeDataset?: boolean;
  datasetId?: number;
}) {
  // Whether parquet data is unavailable (too large to load in browser)
  const dataUnavailable = isTooLarge || isHugeDataset;

  const FEATURES_PER_PAGE = 50;
  const [featurePage, setFeaturePage] = useState(1);
  const [filterText, setFilterText] = useState("");

  // Filter all features based on search
  const filteredFeatures = useMemo(() => {
    if (!filterText) return allFeatures;
    return allFeatures.filter((f) =>
      f.name.toLowerCase().includes(filterText.toLowerCase()),
    );
  }, [allFeatures, filterText]);

  // Paginate filtered features
  const totalFeaturePages = Math.ceil(
    filteredFeatures.length / FEATURES_PER_PAGE,
  );
  const displayedFeatures = filteredFeatures.slice(
    (featurePage - 1) * FEATURES_PER_PAGE,
    featurePage * FEATURES_PER_PAGE,
  );

  // Reset to page 1 when filter changes
  useEffect(() => {
    setFeaturePage(1);
  }, [filterText]);

  // State for feature selection
  const [selectedFeatures, setSelectedFeatures] = useState<Set<number>>(() => {
    const initialSelection = new Set<number>();
    // Pick up to 5 numeric + the target (if nominal) for class distribution
    const targetNominal = allFeatures.find(
      (f) => f.target && f.type === "nominal",
    );
    const numericNonTarget = allFeatures
      .filter((f) => f.type === "numeric" && !f.target)
      .slice(0, 5);
    const featuresToSelect = targetNominal
      ? [targetNominal, ...numericNonTarget]
      : numericNonTarget;

    if (featuresToSelect.length === 0) {
      allFeatures.slice(0, 6).forEach((f) => initialSelection.add(f.index));
    } else {
      featuresToSelect.forEach((f) => initialSelection.add(f.index));
    }

    return initialSelection;
  });

  // Get selected feature objects
  const selectedFeatureObjects = allFeatures.filter((f) =>
    selectedFeatures.has(f.index),
  );

  // Toggle feature selection
  const toggleFeature = (index: number) => {
    setSelectedFeatures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (allFeatures.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No features available for distribution analysis.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Feature Selection Table */}
      <div className="rounded-lg border">
        <div className="bg-muted/50 border-b px-4 py-3">
          <h4 className="text-sm font-medium">
            Choose features for distribution plot
            <span className="text-muted-foreground ml-2 font-normal">
              ({filteredFeatures.length} features)
            </span>
          </h4>
          <div className="mt-2 flex items-center gap-2">
            <Input
              placeholder="Filter features..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="h-8 max-w-xs"
            />
            <span className="text-muted-foreground text-xs">
              {selectedFeatures.size} selected
            </span>
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2">
          <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
            {displayedFeatures.map((feature) => (
              <div
                key={feature.index}
                className={cn(
                  "flex items-center gap-2 rounded px-2 py-1.5 text-sm",
                  "hover:bg-muted/50 cursor-pointer",
                  selectedFeatures.has(feature.index) && "bg-primary/10",
                )}
                onClick={() => toggleFeature(feature.index)}
              >
                <Checkbox
                  checked={selectedFeatures.has(feature.index)}
                  onCheckedChange={() => toggleFeature(feature.index)}
                  className="h-3.5 w-3.5"
                />
                <span className="flex items-center gap-1 truncate">
                  {feature.target && (
                    <Target className="h-3 w-3 shrink-0 text-amber-500" />
                  )}
                  <span className="truncate">{feature.name}</span>
                </span>
                <FeatureTypeBadge type={feature.type} />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalFeaturePages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-2">
            <span className="text-muted-foreground text-xs">
              Showing {(featurePage - 1) * FEATURES_PER_PAGE + 1}-
              {Math.min(
                featurePage * FEATURES_PER_PAGE,
                filteredFeatures.length,
              )}{" "}
              of {filteredFeatures.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFeaturePage((p) => Math.max(1, p - 1))}
                disabled={featurePage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-muted-foreground px-2 text-xs">
                {featurePage} / {totalFeaturePages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFeaturePage((p) => Math.min(totalFeaturePages, p + 1))
                }
                disabled={featurePage === totalFeaturePages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Distribution Plots */}
      {isLoadingParquet && !dataUnavailable ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          <span className="text-muted-foreground ml-2">Loading data...</span>
        </div>
      ) : selectedFeatureObjects.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          Select features above to view distribution plots.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {selectedFeatureObjects.map((feature) => (
            <DistributionPlot
              key={feature.index}
              feature={feature}
              parquetData={parquetData}
              dataUnavailable={dataUnavailable}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Single Distribution Plot for a feature
 */
function DistributionPlot({
  feature,
  parquetData,
  dataUnavailable,
}: {
  feature: DatasetFeature;
  parquetData: Record<string, (string | number | null)[]> | null;
  targetFeature?: DatasetFeature;
  targetColors?: string[];
  dataUnavailable?: boolean;
}) {
  const isNumeric = feature.type === "numeric";

  // Compute distribution from parquet data or use feature.distr
  const distribution = useMemo(() => {
    if (parquetData && parquetData[feature.name]) {
      const dataType = feature.type === "numeric" ? "numeric" : "nominal";
      return computeDistribution(parquetData[feature.name], dataType);
    }
    // Fallback to feature.distr if available (works for nominal without parquet)
    if (feature.distr && feature.distr.length > 0) {
      if (isNumeric) {
        return {
          values: feature.distr.map((d: [string, number]) => d[1]),
        };
      }
      return {
        categories: feature.distr.map((d: [string, number]) => ({
          value: String(d[0]),
          count: d[1],
        })),
      };
    }
    return null;
  }, [parquetData, feature, isNumeric]);

  // Numeric features in too-large datasets: show "coming soon"
  if (dataUnavailable && isNumeric) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-lg border">
        <Database className="h-6 w-6 text-green-500" />
        <p className="text-muted-foreground text-xs">
          Distribution will be available soon.
        </p>
      </div>
    );
  }

  if (!distribution) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border">
        <p className="mx-2 rounded-sm bg-green-600 px-2 py-1 text-center text-sm text-gray-200">
          Distribution will be available soon
        </p>
      </div>
    );
  }

  // Filter out null values for Plotly
  const cleanData =
    parquetData?.[feature.name]?.filter(
      (v): v is string | number => v !== null,
    ) || [];

  // Prepare bar chart data for nominal features
  const barLabels = distribution.categories?.map((c) => c.value) || [];
  const barValues = distribution.categories?.map((c) => c.count) || [];

  return (
    <div className="rounded-lg border p-2">
      <h5 className="mb-1 flex items-center gap-1 truncate px-2 text-sm font-medium">
        {feature.target && (
          <Target className="h-3.5 w-3.5 shrink-0 text-amber-500" />
        )}
        {feature.name}
      </h5>
      <div className="plotly-chart-container">
        <Plot
          data={[
            isNumeric
              ? {
                  type: "histogram" as const,
                  x: cleanData,
                  marker: { color: "#22c55e" },
                  opacity: 0.75,
                }
              : {
                  type: "bar" as const,
                  x: barLabels,
                  y: barValues,
                  marker: { color: "#22c55e" },
                },
          ]}
          layout={{
            height: 200,
            margin: { l: 40, r: 20, t: 10, b: 40 },
            xaxis: {
              tickangle: isNumeric ? 0 : -45,
              automargin: true,
            },
            yaxis: { title: "Count" },
            bargap: 0.1,
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
          }}
          config={{
            displayModeBar: true,
            responsive: true,
            displaylogo: false,
          }}
          style={{ width: "100%", height: "200px" }}
        />
      </div>
    </div>
  );
}

/**
 * Correlation Heatmap - Simplified version
 */
function CorrelationHeatmap({
  numericFeatures,
  parquetData,
  datasetId,
}: {
  numericFeatures: DatasetFeature[];
  parquetData: Record<string, (string | number | null)[]> | null;
  datasetId?: number;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Limit to first 20 numeric features for heatmap
  const MAX_FEATURES = 20;
  const limitedFeatures = numericFeatures.slice(0, MAX_FEATURES);

  // Compute correlation matrix
  const correlationMatrix = useMemo(() => {
    if (!parquetData || limitedFeatures.length === 0) return null;

    const n = limitedFeatures.length;
    const matrix: number[][] = [];

    for (let i = 0; i < n; i++) {
      const row: number[] = [];
      for (let j = 0; j < n; j++) {
        if (i === j) {
          row.push(1);
        } else if (j < i) {
          // Use symmetric value
          row.push(matrix[j][i]);
        } else {
          const xData = parquetData[limitedFeatures[i].name] || [];
          const yData = parquetData[limitedFeatures[j].name] || [];
          row.push(computePearsonCorrelation(xData, yData));
        }
      }
      matrix.push(row);
    }

    return matrix;
  }, [parquetData, limitedFeatures]);

  if (numericFeatures.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No numeric features available for correlation analysis.
      </p>
    );
  }

  if (!parquetData) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <AlertCircle className="h-8 w-8 text-amber-500" />
        <p className="text-muted-foreground text-sm">
          Correlation requires real data. Load the parquet file to view.
        </p>
      </div>
    );
  }

  if (!correlationMatrix) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  const featureNames = limitedFeatures.map((f) => f.name);

  return (
    <div className="space-y-4">
      {numericFeatures.length > MAX_FEATURES && (
        <p className="text-shadow-muted-foreground text-sm">
          Showing correlation for first {MAX_FEATURES} of{" "}
          {numericFeatures.length} numeric features.
        </p>
      )}

      <Plot
        data={[
          {
            type: "heatmap" as const,
            z: correlationMatrix,
            x: featureNames,
            y: featureNames,
            colorscale: [
              [0, "#ef4444"],
              [0.5, "rgba(0,0,0,0)"],
              [1, "#22c55e"],
            ],
            zmin: -1,
            zmax: 1,
            hovertemplate:
              "%{x}<br>%{y}<br>Correlation: %{z:.2f}<extra></extra>",
          },
        ]}
        layout={{
          height: Math.max(400, limitedFeatures.length * 25),
          margin: { l: 120, r: 20, t: 20, b: 120 },
          font: {
            color: isDark ? "rgba(250,250,250,0.6)" : "rgba(0,0,0,0.6)",
          },
          xaxis: {
            tickangle: -45,
            automargin: true,
            gridcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          },
          yaxis: {
            automargin: true,
            gridcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
        }}
        config={{
          displayModeBar: true,
          modeBarButtonsToRemove: ["select2d", "lasso2d"],
          responsive: true,
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
