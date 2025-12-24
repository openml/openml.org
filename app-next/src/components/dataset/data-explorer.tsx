"use client";

import { useState, useRef, useCallback } from "react";
import {
  Table,
  List,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Database,
  Download,
  Maximize2,
  Minimize2,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { cn } from "@/lib/utils";
import type { Dataset, DatasetFeature } from "@/types/dataset";

interface DataExplorerProps {
  dataset: Dataset;
}

type ViewMode = "detail" | "compact" | "column";

/**
 * DataExplorer Component (kggl-style)
 *
 * A unified data exploration interface inspired by kggl's Data tab.
 * Features:
 * - File info header with size and actions
 * - Multiple view modes: Detail, Compact, Column
 * - Feature type indicators
 * - Summary statistics
 */
export function DataExplorer({ dataset }: DataExplorerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("detail");
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  const features = dataset.features || [];
  const qualities = dataset.qualities || {};

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
      // Fallback to OpenML API download URL
      window.open(
        `https://www.openml.org/data/download/${dataset.file_id}/${dataset.name}.arff`,
        "_blank",
      );
    }
  }, [dataset.url, dataset.file_id, dataset.name]);

  // Calculate file size estimate (rough estimate based on instances * features)
  const estimatedSize =
    qualities.NumberOfInstances && qualities.NumberOfFeatures
      ? (
          (qualities.NumberOfInstances * qualities.NumberOfFeatures * 8) /
          1024
        ).toFixed(2)
      : null;

  // Limit displayed features initially
  const displayedFeatures = showAllFeatures ? features : features.slice(0, 10);
  const hasMoreFeatures = features.length > 10;

  return (
    <section
      id="data-explorer"
      ref={containerRef}
      className={cn(
        "scroll-mt-20",
        isFullscreen && "bg-background overflow-auto p-4",
      )}
    >
      <Card>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          {/* File Header - kggl style */}
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

              {/* View mode tabs - kggl style */}
              <div className="flex items-center justify-between border-b pb-3">
                <Tabs
                  value={viewMode}
                  onValueChange={(v) => setViewMode(v as ViewMode)}
                >
                  <TabsList className="h-8">
                    <TabsTrigger value="detail" className="h-7 px-3 text-xs">
                      <Table className="mr-1 h-3 w-3" />
                      Detail
                    </TabsTrigger>
                    <TabsTrigger value="compact" className="h-7 px-3 text-xs">
                      <List className="mr-1 h-3 w-3" />
                      Compact
                    </TabsTrigger>
                    <TabsTrigger value="column" className="h-7 px-3 text-xs">
                      <LayoutGrid className="mr-1 h-3 w-3" />
                      Column
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <span className="text-muted-foreground text-sm">
                  {features.length > 10
                    ? `10 of ${features.length}`
                    : features.length}{" "}
                  columns
                </span>
              </div>
            </div>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="pt-0">
              {/* Detail View - Full feature information */}
              {viewMode === "detail" && (
                <div className="space-y-0 divide-y">
                  {displayedFeatures.map((feature, index) => (
                    <FeatureDetailRow
                      key={feature.index ?? index}
                      feature={feature}
                      index={index}
                    />
                  ))}
                </div>
              )}

              {/* Compact View - Condensed table */}
              {viewMode === "compact" && (
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
                          className="hover:bg-muted/50 border-b last:border-0"
                        >
                          <td className="text-muted-foreground px-3 py-2">
                            {index}
                          </td>
                          <td className="px-3 py-2 font-medium">
                            {feature.name}
                          </td>
                          <td className="px-3 py-2">
                            <FeatureTypeBadge type={feature.type} />
                          </td>
                          <td className="px-3 py-2">{feature.missing || 0}</td>
                          <td className="px-3 py-2">
                            {feature.distinct || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Column View - Grid of feature cards */}
              {viewMode === "column" && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {displayedFeatures.map((feature, index) => (
                    <FeatureColumnCard
                      key={feature.index ?? index}
                      feature={feature}
                      index={index}
                    />
                  ))}
                </div>
              )}

              {/* Show more button */}
              {hasMoreFeatures && (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllFeatures(!showAllFeatures)}
                  >
                    {showAllFeatures
                      ? `Show less`
                      : `Show all ${features.length} columns`}
                    {showAllFeatures ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Summary Card - kggl style */}
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
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// Feature Detail Row Component
function FeatureDetailRow({
  feature,
  index,
}: {
  feature: DatasetFeature;
  index: number;
}) {
  const isTarget = feature.target;
  const isRowId = feature.index;

  return (
    <div
      className={cn(
        "hover:bg-muted/30 px-1 py-3 transition-colors",
        isTarget && "bg-primary/5 border-l-primary border-l-2",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground w-6 text-xs">{index}</span>
            <span className="truncate font-medium">{feature.name}</span>
            <FeatureTypeBadge type={feature.type} />
            {isTarget && (
              <Badge variant="default" className="h-5 text-[10px]">
                Target
              </Badge>
            )}
            {isRowId && (
              <Badge variant="outline" className="h-5 text-[10px]">
                Row ID
              </Badge>
            )}
          </div>
          {/* Feature stats */}
          <div className="text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {feature.missing !== undefined && (
              <span>
                Missing:{" "}
                <span className="text-foreground">{feature.missing}</span>
              </span>
            )}
            {feature.distinct !== undefined && (
              <span>
                Distinct:{" "}
                <span className="text-foreground">{feature.distinct}</span>
              </span>
            )}
            {feature.distr && feature.distr.length > 0 && (
              <span className="max-w-[300px] truncate">
                Values:{" "}
                <span className="text-foreground">
                  {feature.distr.slice(0, 5).join(", ")}
                  {feature.distr.length > 5 ? "..." : ""}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Column Card Component
function FeatureColumnCard({
  feature,
  index,
}: {
  feature: DatasetFeature;
  index: number;
}) {
  return (
    <div className="hover:bg-muted/30 rounded-lg border p-3 transition-colors">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-muted-foreground text-xs">{index}</span>
        <span className="flex-1 truncate text-sm font-medium">
          {feature.name}
        </span>
      </div>
      <FeatureTypeBadge type={feature.type} />
      {feature.target && (
        <Badge variant="default" className="ml-2 h-5 text-[10px]">
          Target
        </Badge>
      )}
    </div>
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
