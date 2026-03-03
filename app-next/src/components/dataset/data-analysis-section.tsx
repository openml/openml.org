"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useCallback, useMemo } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Database,
  Download,
  Hash,
  Maximize2,
  Minimize2,
  FileText,
  Target,
  Loader2,
  Triangle,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { usePlotlyTheme } from "@/hooks/usePlotlyTheme";
import type { Dataset, DatasetFeature } from "@/types/dataset";
import { useParquetData, computeDistribution } from "@/hooks/useParquetData";
import { useDatasetStats } from "@/hooks/useDatasetStats";
import type { DatasetPreview } from "@/hooks/useDatasetStats";

import { PaginationControls } from "@/components/ui/pagination-controls"; // Import new component
import { DimensionalityReductionPlot } from "@/components/dataset/analysis/dimensionality-reduction-plot"; // Import new component
import { useOpSpeed } from "@/hooks/use-op-speed";

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("detail");
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [openColPopover, setOpenColPopover] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    col: string;
    dir: "asc" | "desc";
  } | null>(null);
  const [hiddenCols] = useState<Set<string>>(new Set());
  const [rowsPage, setRowsPage] = useState(1);
  const [detailPage, setDetailPage] = useState(1);
  const ROWS_PER_PAGE = 20;
  const ITEMS_PER_PAGE = 20;
  const containerRef = useRef<HTMLElement>(null);

  // Measure render time of this component
  const { measure } = useOpSpeed("DataAnalysisSection");

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

  // Try stats API first (faster, works for all sizes)
  // Fetch up to current page * pageSize, but at least 20
  const statsState = useDatasetStats(
    dataset.data_id,
    Math.max(20, rowsPage * ROWS_PER_PAGE),
    true,
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
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 h-auto flex-wrap gap-4">
                  <TabsTrigger
                    className="dark:data-[state=active]:border-[0.5px] dark:data-[state=active]:border-slate-400"
                    value="detail"
                  >
                    Detail
                  </TabsTrigger>
                  <TabsTrigger
                    className="dark:data-[state=active]:border-[0.5px] dark:data-[state=active]:border-slate-400"
                    value="compact"
                  >
                    Compact
                  </TabsTrigger>
                  <TabsTrigger
                    className="dark:data-[state=active]:border-[0.5px] dark:data-[state=active]:border-slate-400"
                    value="column"
                  >
                    Column
                  </TabsTrigger>
                  <TabsTrigger
                    className="dark:data-[state=active]:border-[0.5px] dark:data-[state=active]:border-slate-400"
                    value="features"
                  >
                    <Database className="mr-1 h-4 w-4" />
                    Features ({features.length})
                  </TabsTrigger>
                  <TabsTrigger
                    className="dark:data-[state=active]:border-[0.5px] dark:data-[state=active]:border-slate-400"
                    value="distribution"
                  >
                    Distribution
                  </TabsTrigger>
                  <TabsTrigger
                    className="dark:data-[state=active]:border-[0.5px] dark:data-[state=active]:border-slate-400"
                    value="correlation"
                  >
                    Correlation
                  </TabsTrigger>
                  <TabsTrigger
                    className="dark:data-[state=active]:border-[0.5px] dark:data-[state=active]:border-slate-400"
                    value="structure"
                  >
                    Structure (2D)
                  </TabsTrigger>
                </TabsList>

                {/* ── Detail tab ── column stat cards ────────────────── */}
                <TabsContent value="detail">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      {(detailPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                      {Math.min(
                        detailPage * ITEMS_PER_PAGE,
                        features.length - hiddenCols.size,
                      )}{" "}
                      of {features.length - hiddenCols.size} columns
                    </span>
                    {statsState.isLoading && (
                      <span className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Loading stats…
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {statsState.isLoading
                      ? Array.from({
                          length: Math.min(features.length || 10, 15),
                        }).map((_, i) => (
                          <div
                            key={i}
                            className="space-y-2 rounded-lg border p-3"
                          >
                            <Skeleton className="h-3 w-3/4" />
                            <Skeleton className="h-9 w-full" />
                            <Skeleton className="h-2 w-1/2" />
                            <Skeleton className="h-2 w-1/3" />
                          </div>
                        ))
                      : features
                          .filter((f) => !hiddenCols.has(f.name))
                          .slice(
                            (detailPage - 1) * ITEMS_PER_PAGE,
                            detailPage * ITEMS_PER_PAGE,
                          )
                          .map((feature) => (
                            <button
                              key={feature.index}
                              className={cn(
                                "hover:bg-muted/40 rounded-lg border p-3 text-left transition-colors focus:outline-none",
                                feature.target &&
                                  "border-amber-300 dark:border-amber-700",
                                selectedColumn === feature.name &&
                                  "ring-primary ring-2",
                              )}
                              onClick={() => {
                                setSelectedColumn(feature.name);
                                setActiveTab("column");
                              }}
                            >
                              <div className="mb-1.5 flex min-w-0 items-center gap-1.5">
                                <ColumnTypeIcon type={feature.type} />
                                <span className="flex-1 truncate text-xs font-medium">
                                  {feature.name}
                                </span>
                                {feature.target && (
                                  <Target className="h-3 w-3 shrink-0 text-amber-500" />
                                )}
                              </div>
                              <MiniSparkline
                                feature={feature}
                                statsData={
                                  statsState.stats?.distribution as
                                    | Record<string, unknown>
                                    | undefined
                                }
                                isLoading={false}
                              />
                              <div className="text-muted-foreground mt-1.5 text-[11px] leading-tight">
                                {feature.distinct != null && (
                                  <div>
                                    <span className="text-foreground font-medium">
                                      {Number(
                                        feature.distinct,
                                      ).toLocaleString()}
                                    </span>{" "}
                                    unique
                                  </div>
                                )}
                                {feature.type === "numeric" &&
                                  feature.min != null &&
                                  feature.max != null && (
                                    <div className="truncate">
                                      {parseFloat(
                                        String(feature.min),
                                      ).toLocaleString(undefined, {
                                        maximumFractionDigits: 3,
                                      })}{" "}
                                      –{" "}
                                      {parseFloat(
                                        String(feature.max),
                                      ).toLocaleString(undefined, {
                                        maximumFractionDigits: 3,
                                      })}
                                    </div>
                                  )}
                              </div>
                            </button>
                          ))}
                  </div>

                  <PaginationControls
                    page={detailPage}
                    total={
                      features.filter((f) => !hiddenCols.has(f.name)).length
                    }
                    pageSize={ITEMS_PER_PAGE}
                    onPageChange={setDetailPage}
                  />
                </TabsContent>

                {/* ── Compact tab ── data preview table ──────────────── */}
                <TabsContent value="compact">
                  <CompactPreviewTable
                    features={features.filter((f) => !hiddenCols.has(f.name))}
                    preview={
                      statsState.stats?.preview
                        ? {
                            ...statsState.stats.preview,
                            rows: statsState.stats.preview.rows.slice(
                              (rowsPage - 1) * ROWS_PER_PAGE,
                              rowsPage * ROWS_PER_PAGE,
                            ),
                          }
                        : null
                    }
                    isLoading={statsState.isLoading}
                    sortConfig={sortConfig}
                    onColumnClick={(name) => {
                      setOpenColPopover(name);
                    }}
                  />

                  {statsState.stats?.preview && (
                    <PaginationControls
                      page={rowsPage}
                      total={statsState.stats.preview.total_rows}
                      pageSize={ROWS_PER_PAGE}
                      loading={statsState.isLoading}
                      onPageChange={setRowsPage}
                    />
                  )}

                  <ColumnPopupDialog
                    featureName={openColPopover}
                    features={features}
                    statsData={
                      statsState.stats?.distribution as
                        | Record<string, unknown>
                        | undefined
                    }
                    preview={statsState.stats?.preview ?? null}
                    sortConfig={sortConfig}
                    onApply={(newSort) => {
                      setSortConfig(newSort);
                      setOpenColPopover(null);
                    }}
                    onClear={() => {
                      setSortConfig(null);
                      setOpenColPopover(null);
                    }}
                    onViewColumn={(name) => {
                      setSelectedColumn(name);
                      setOpenColPopover(null);
                      setActiveTab("column");
                    }}
                    onClose={() => setOpenColPopover(null)}
                  />
                </TabsContent>

                {/* ── Column tab ── single column deep-dive ──────────── */}
                <TabsContent value="column" className="space-y-4">
                  {/* Column selector */}
                  <div className="flex items-center gap-2">
                    <label className="text-muted-foreground text-xs font-medium">
                      Column:
                    </label>
                    <select
                      value={selectedColumn ?? ""}
                      onChange={(e) =>
                        setSelectedColumn(e.target.value || null)
                      }
                      className="border-input bg-background rounded-md border px-2 py-1 text-sm focus:outline-none"
                    >
                      <option value="">— select a column —</option>
                      {features.map((f) => (
                        <option key={f.index} value={f.name}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {!selectedColumn ? (
                    <div className="text-muted-foreground flex flex-col items-center gap-2 py-16 text-sm">
                      <Database className="h-8 w-8 opacity-30" />
                      Click a column card in{" "}
                      <strong className="text-foreground">Detail</strong> or
                      select one above to explore it.
                    </div>
                  ) : statsState.isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-80 w-full" />
                    </div>
                  ) : (
                    (() => {
                      const feat = features.find(
                        (f) => f.name === selectedColumn,
                      );
                      return feat ? (
                        <DistributionPlot
                          feature={feat}
                          parquetData={parquetState.data}
                          dataUnavailable={
                            parquetState.isTooLarge || isHugeDataset
                          }
                          statsData={statsState.stats?.distribution}
                        />
                      ) : null;
                    })()
                  )}
                </TabsContent>

                {/* ── Features tab ── stats table ─────────────────── */}
                <TabsContent value="features">
                  <FeaturesTable
                    features={features}
                    statsData={
                      statsState.stats?.distribution as
                        | Record<string, unknown>
                        | undefined
                    }
                    isLoadingStats={statsState.isLoading}
                    onColumnClick={(name) => {
                      setSelectedColumn(name);
                      setActiveTab("column");
                    }}
                  />
                </TabsContent>

                {/* ── Distribution tab ────────────────────────────────── */}
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
                    statsData={statsState.stats?.distribution}
                    isLoadingStats={statsState.isLoading}
                  />
                </TabsContent>

                {/* ── Correlation tab ──────────────────────────────────── */}
                <TabsContent value="correlation">
                  <Tabs defaultValue="scatter">
                    <TabsList className="mb-4">
                      <TabsTrigger value="scatter">Scatter</TabsTrigger>
                      <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
                    </TabsList>
                    <TabsContent value="scatter">
                      <ScatterCorrelationPlot
                        features={features}
                        preview={statsState.stats?.preview ?? null}
                        isLoading={statsState.isLoading}
                      />
                    </TabsContent>
                    <TabsContent value="heatmap">
                      <CorrelationHeatmap
                        numericFeatures={numericFeatures}
                        parquetData={parquetState.data}
                        isLoadingParquet={parquetState.isLoading}
                        datasetId={dataset.data_id}
                        statsData={statsState.stats?.correlation}
                        isLoadingStats={statsState.isLoading}
                      />
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                {/* ── Structure tab ────────────────────────────────────── */}
                <TabsContent value="structure">
                  <DimensionalityReductionPlot
                    features={features}
                    preview={statsState.stats?.preview ?? null}
                    isLoading={statsState.isLoading}
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
  statsData,
  isLoadingStats,
}: {
  numericFeatures?: DatasetFeature[];
  nominalFeatures?: DatasetFeature[];
  allFeatures: DatasetFeature[];
  parquetData: Record<string, (string | number | null)[]> | null;
  isLoadingParquet: boolean;
  isTooLarge?: boolean;
  isHugeDataset?: boolean;
  datasetId?: number;
  statsData?: Record<string, unknown>;
  isLoadingStats?: boolean;
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
              onChange={(e) => {
                setFilterText(e.target.value);
                setFeaturePage(1);
              }}
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
      {isLoadingStats || (isLoadingParquet && !dataUnavailable) ? (
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
              statsData={statsData}
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
  statsData,
}: {
  feature: DatasetFeature;
  parquetData: Record<string, (string | number | null)[]> | null;
  targetFeature?: DatasetFeature;
  targetColors?: string[];
  dataUnavailable?: boolean;
  statsData?: Record<string, unknown>;
}) {
  const plotTheme = usePlotlyTheme();
  const isNumeric = feature.type === "numeric";

  // Compute distribution from stats API first, then fall back to parquet data or feature.distr
  const distribution = useMemo(() => {
    // Priority 1: Use stats API datanpm if available
    if (statsData && statsData[feature.name]) {
      const featureStats = statsData[feature.name] as {
        type: string;
        bins?: number[];
        counts?: number[];
        categories?: string[];
        frequencies?: number[];
        min?: number;
        max?: number;
        mean?: number;
        median?: number;
        std?: number;
      };
      if (featureStats.type === "numeric") {
        // Convert bins/counts from stats API to plot format
        return {
          bins: featureStats.bins
            ?.map((binEdge: number, i: number, arr: number[]) => ({
              min: binEdge,
              max: arr[i + 1] || binEdge,
              count: featureStats.counts?.[i] || 0,
            }))
            .slice(0, -1), // Remove last incomplete bin
          stats: {
            min: featureStats.min,
            max: featureStats.max,
            mean: featureStats.mean,
            median: ((featureStats.min ?? 0) + (featureStats.max ?? 0)) / 2, // Approximate
            q1: featureStats.min,
            q3: featureStats.max,
            std: featureStats.std,
          },
        };
      } else {
        // Nominal feature from stats API
        return {
          categories: featureStats.categories?.map(
            (cat: string, i: number) => ({
              value: cat,
              count:
                featureStats.counts?.[i] || featureStats.frequencies?.[i] || 0,
            }),
          ),
        };
      }
    }

    // Priority 2: Compute from parquet data
    if (parquetData && parquetData[feature.name]) {
      const dataType = feature.type === "numeric" ? "numeric" : "nominal";
      return computeDistribution(parquetData[feature.name], dataType);
    }

    // Priority 3: Fallback to feature.distr if available (works for nominal without parquet)
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
  }, [statsData, parquetData, feature, isNumeric]);

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

  // Filter out null values for Plotly (only if using parquet data with raw values)
  const cleanData =
    parquetData?.[feature.name]?.filter(
      (v): v is string | number => v !== null,
    ) || [];

  // Prepare data based on distribution type
  const dist = distribution as
    | {
        bins?: { min: number; max: number; count: number }[];
        categories?: { value: string; count: number }[];
        values?: unknown[];
      }
    | undefined;
  const hasRawData = cleanData.length > 0 && !statsData?.[feature.name];
  const hasBinnedData = dist?.bins && dist.bins.length > 0;

  // For numeric: use histogram with raw data OR bar chart with binned data
  // For nominal: use bar chart with category counts
  const barLabels =
    dist?.categories?.map((c: { value: string }) => c.value) || [];
  const barValues =
    dist?.categories?.map((c: { count: number }) => c.count) || [];

  // For binned numeric data, create bar chart labels from bin ranges
  const binnedLabels = hasBinnedData
    ? dist?.bins?.map(
        (bin: { min: number; max: number }) =>
          `${bin.min.toFixed(1)}-${bin.max.toFixed(1)}`,
      ) || []
    : [];
  const binnedValues = hasBinnedData
    ? dist?.bins?.map((bin: { count: number }) => bin.count) || []
    : [];

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
              ? hasRawData
                ? {
                    // Raw data histogram
                    type: "histogram" as const,
                    x: cleanData,
                    marker: { color: "#22c55e" },
                    opacity: 0.75,
                  }
                : {
                    // Binned data bar chart
                    type: "bar" as const,
                    x: binnedLabels,
                    y: binnedValues,
                    marker: { color: "#22c55e" },
                  }
              : {
                  // Nominal bar chart
                  type: "bar" as const,
                  x: barLabels,
                  y: barValues,
                  marker: { color: "#22c55e" },
                },
          ]}
          layout={{
            height: 200,
            margin: { l: 40, r: 20, t: 10, b: 40 },
            font: plotTheme.font,
            xaxis: {
              tickangle: isNumeric ? 0 : -45,
              automargin: true,
              gridcolor: plotTheme.gridcolor,
            },
            yaxis: {
              title: "Count",
              gridcolor: plotTheme.gridcolor,
            },
            bargap: 0.1,
            paper_bgcolor: plotTheme.paper_bgcolor,
            plot_bgcolor: plotTheme.plot_bgcolor,
            hoverlabel: plotTheme.hoverlabel,
          } as object}
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
  isLoadingParquet,
  statsData,
  isLoadingStats,
}: {
  numericFeatures: DatasetFeature[];
  parquetData: Record<string, (string | number | null)[]> | null;
  isLoadingParquet?: boolean;
  datasetId?: number;
  statsData?: { features: string[]; matrix: number[][] } | null;
  isLoadingStats?: boolean;
}) {
  const plotTheme = usePlotlyTheme();

  // Limit to first 20 numeric features for heatmap
  const MAX_FEATURES = 20;
  const limitedFeatures = numericFeatures.slice(0, MAX_FEATURES);

  // Use stats API data first, then fall back to computing from parquet data
  const correlationData = useMemo(() => {
    // Priority 1: Use stats API data if available
    if (statsData && statsData.features && statsData.matrix) {
      return {
        features: statsData.features,
        matrix: statsData.matrix,
      };
    }

    // Priority 2: Compute from parquet data
    if (parquetData && limitedFeatures.length > 0) {
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

      return {
        features: limitedFeatures.map((f) => f.name),
        matrix,
      };
    }

    return null;
  }, [statsData, parquetData, limitedFeatures]);

  if (numericFeatures.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No numeric features available for correlation analysis.
      </p>
    );
  }

  if (!correlationData) {
    if (isLoadingStats || isLoadingParquet) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          <span className="text-muted-foreground ml-2">Loading data...</span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <Database className="h-8 w-8 text-green-500" />
        <p className="text-muted-foreground text-sm">
          Correlation data will be available soon.
        </p>
      </div>
    );
  }

  const featureNames = correlationData.features;
  const correlationMatrix = correlationData.matrix;

  return (
    <div className="space-y-4">
      {numericFeatures.length > MAX_FEATURES && (
        <p className="text-shadow-muted-foreground text-sm">
          Showing correlation for first {featureNames.length} of{" "}
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
          height: Math.max(400, featureNames.length * 25),
          margin: { l: 120, r: 20, t: 20, b: 120 },
          font: plotTheme.font,
          xaxis: {
            tickangle: -45,
            automargin: true,
            gridcolor: plotTheme.gridcolor,
          },
          yaxis: {
            automargin: true,
            gridcolor: plotTheme.gridcolor,
          },
          paper_bgcolor: plotTheme.paper_bgcolor,
          plot_bgcolor: plotTheme.plot_bgcolor,
          hoverlabel: plotTheme.hoverlabel,
        } as object}
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

// ─── Helper: column type icon ────────────────────────────────────────────────

function ColumnTypeIcon({ type }: { type?: string }) {
  const t = (type ?? "").toLowerCase();
  if (t === "numeric") {
    return <Hash className="h-3.5 w-3.5 shrink-0 text-blue-500" />;
  }
  if (t === "date") {
    return <Calendar className="h-3.5 w-3.5 shrink-0 text-orange-500" />;
  }
  // nominal / string
  return <Triangle className="h-3.5 w-3.5 shrink-0 text-green-500" />;
}

// ─── Helper: mini SVG sparkline ──────────────────────────────────────────────

function MiniSparkline({
  feature,
  statsData,
  isLoading,
}: {
  feature: import("@/types/dataset").DatasetFeature;
  statsData: Record<string, unknown> | undefined;
  isLoading: boolean;
}) {
  const H = 36;

  if (isLoading) {
    return <Skeleton className="h-9 w-full rounded" />;
  }

  const raw = statsData?.[feature.name];

  if (
    feature.type === "numeric" &&
    raw &&
    typeof raw === "object" &&
    "counts" in raw
  ) {
    const dist = raw as { counts: number[] };
    const counts = dist.counts ?? [];
    if (counts.length === 0)
      return <div className="bg-muted/30 h-9 w-full rounded" />;
    const maxC = Math.max(...counts, 1);
    const bw = 100 / counts.length;
    return (
      <svg
        viewBox={`0 0 100 ${H}`}
        className="w-full"
        style={{ height: H }}
        preserveAspectRatio="none"
      >
        {counts.map((c, i) => {
          const bh = (c / maxC) * H;
          return (
            <rect
              key={i}
              x={i * bw + 0.5}
              y={H - bh}
              width={Math.max(bw - 1, 0.5)}
              height={bh}
              fill="#3b82f6"
              opacity={0.7}
            />
          );
        })}
      </svg>
    );
  }

  if (
    (feature.type === "nominal" || feature.type === "string") &&
    raw &&
    typeof raw === "object" &&
    "counts" in raw
  ) {
    const dist = raw as { counts: number[] };
    const counts = (dist.counts ?? []).slice(0, 5);
    if (counts.length === 0)
      return <div className="bg-muted/30 h-9 w-full rounded" />;
    const maxC = Math.max(...counts, 1);
    const rh = H / counts.length;
    return (
      <svg
        viewBox={`0 0 100 ${H}`}
        className="w-full"
        style={{ height: H }}
        preserveAspectRatio="none"
      >
        {counts.map((c, i) => (
          <rect
            key={i}
            x={0}
            y={i * rh + 1}
            width={(c / maxC) * 90}
            height={Math.max(rh - 2, 1)}
            fill="#22c55e"
            opacity={0.7}
          />
        ))}
      </svg>
    );
  }

  return <div className="bg-muted/30 h-9 w-full rounded" />;
}

// ─── Helper: compact data-preview table ──────────────────────────────────────

function CompactPreviewTable({
  features,
  preview,
  isLoading,
  sortConfig,
  onColumnClick,
}: {
  features: import("@/types/dataset").DatasetFeature[];
  preview: DatasetPreview | null;
  isLoading: boolean;
  sortConfig: { col: string; dir: "asc" | "desc" } | null;
  onColumnClick: (name: string) => void;
}) {
  const featureMap = useMemo(
    () => Object.fromEntries(features.map((f) => [f.name, f])),
    [features],
  );

  const displayRows = useMemo(() => {
    if (!preview?.rows) return [];
    if (!sortConfig) return preview.rows;
    const colIdx = preview.columns.indexOf(sortConfig.col);
    if (colIdx === -1) return preview.rows;
    return [...preview.rows].sort((a, b) => {
      const av = a[colIdx];
      const bv = b[colIdx];
      const cmp =
        av === null ? -1 : bv === null ? 1 : av < bv ? -1 : av > bv ? 1 : 0;
      return sortConfig.dir === "asc" ? cmp : -cmp;
    });
  }, [preview, sortConfig]);

  if (isLoading) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  // Fallback: feature metadata table when no preview data yet
  if (!preview) {
    return (
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
              <th className="text-muted-foreground px-3 py-2 text-right font-medium">
                Missing
              </th>
              <th className="text-muted-foreground px-3 py-2 text-right font-medium">
                Distinct
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => (
              <tr
                key={f.index ?? i}
                className={cn(
                  "hover:bg-muted/50 cursor-pointer border-b last:border-0",
                  f.target && "bg-amber-50 dark:bg-amber-950/20",
                )}
                onClick={() => onColumnClick(f.name)}
              >
                <td className="text-muted-foreground px-3 py-2">{i}</td>
                <td className="px-3 py-2 font-medium">
                  <span className="flex items-center gap-1.5">
                    <ColumnTypeIcon type={f.type} />
                    {f.target && (
                      <Target className="h-3 w-3 shrink-0 text-amber-500" />
                    )}
                    {f.name}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <FeatureTypeBadge type={f.type} />
                </td>
                <td className="px-3 py-2 text-right">{f.missing ?? 0}</td>
                <td className="px-3 py-2 text-right">{f.distinct ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Real data preview table
  const visibleCols = preview.columns.filter((c) => featureMap[c]);

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 sticky top-0">
          <tr>
            {visibleCols.map((col) => {
              const feat = featureMap[col];
              const isSorted = sortConfig?.col === col;
              return (
                <th
                  key={col}
                  className="hover:bg-muted cursor-pointer border-b px-3 py-2 text-left font-medium whitespace-nowrap"
                  onClick={() => onColumnClick(col)}
                >
                  <span className="flex items-center gap-1">
                    {feat && <ColumnTypeIcon type={feat.type} />}
                    <span className="max-w-40 truncate">{col}</span>
                    {isSorted ? (
                      sortConfig!.dir === "asc" ? (
                        <ArrowUp className="h-3 w-3 shrink-0 text-blue-500" />
                      ) : (
                        <ArrowDown className="h-3 w-3 shrink-0 text-blue-500" />
                      )
                    ) : (
                      <ArrowUpDown className="text-muted-foreground h-3 w-3 shrink-0 opacity-40" />
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row, ri) => (
            <tr key={ri} className="hover:bg-muted/30 border-b last:border-0">
              {visibleCols.map((col) => {
                const ci = preview.columns.indexOf(col);
                const val = row[ci];
                return (
                  <td key={col} className="px-3 py-1.5 text-xs">
                    {val === null || val === undefined ? (
                      <span className="text-muted-foreground italic">null</span>
                    ) : (
                      String(val)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-muted-foreground border-t px-3 py-2 text-xs">
        Showing {displayRows.length} of {preview.total_rows.toLocaleString()}{" "}
        rows
      </div>
    </div>
  );
}

// ─── Helper: column detail popup ─────────────────────────────────────────────

function ColumnPopupDialog({
  featureName,
  features,
  statsData,
  preview,
  sortConfig,
  onApply,
  onClear,
  onViewColumn,
  onClose,
}: {
  featureName: string | null;
  features: import("@/types/dataset").DatasetFeature[];
  statsData: Record<string, unknown> | undefined;
  preview: DatasetPreview | null;
  sortConfig: { col: string; dir: "asc" | "desc" } | null;
  onApply: (sort: { col: string; dir: "asc" | "desc" }) => void;
  onClear: () => void;
  onViewColumn: (name: string) => void;
  onClose: () => void;
}) {
  const feature = featureName
    ? features.find((f) => f.name === featureName)
    : null;

  const [pendingDir, setPendingDir] = useState<"asc" | "desc">(
    sortConfig?.col === featureName ? (sortConfig.dir ?? "asc") : "asc",
  );

  // Reset direction when a different column is opened
  // State from props pattern: update state during render
  const [prevName, setPrevName] = useState<string | null>(featureName);
  if (featureName !== prevName) {
    setPrevName(featureName);
    setPendingDir(
      sortConfig?.col === featureName ? (sortConfig.dir ?? "asc") : "asc",
    );
  }

  const sampleValues = useMemo(() => {
    if (!featureName) return [];
    const raw = statsData?.[featureName];
    if (raw && typeof raw === "object" && "categories" in raw) {
      const dist = raw as { categories: string[] };
      return (dist.categories ?? []).slice(0, 10);
    }
    if (preview) {
      const ci = preview.columns.indexOf(featureName);
      if (ci >= 0) {
        const seen = new Set<string>();
        const vals: string[] = [];
        for (const row of preview.rows) {
          const s = row[ci] === null ? "null" : String(row[ci]);
          if (!seen.has(s)) {
            seen.add(s);
            vals.push(s);
            if (vals.length >= 10) break;
          }
        }
        return vals;
      }
    }
    return [];
  }, [featureName, statsData, preview]);

  if (!feature || !featureName) return null;

  return (
    <Dialog open={!!featureName} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <ColumnTypeIcon type={feature.type} />
            {featureName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {/* Sort options */}
          <div className="space-y-1">
            <button
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                pendingDir === "asc"
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/50",
              )}
              onClick={() => setPendingDir("asc")}
            >
              <ArrowUp className="h-4 w-4" />
              Sort ascending
            </button>
            <button
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                pendingDir === "desc"
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/50",
              )}
              onClick={() => setPendingDir("desc")}
            >
              <ArrowDown className="h-4 w-4" />
              Sort descending
            </button>
          </div>

          {/* Sample values */}
          {sampleValues.length > 0 && (
            <>
              <div className="border-t" />
              <div className="max-h-48 space-y-0.5 overflow-y-auto">
                {sampleValues.map((val) => (
                  <div
                    key={val}
                    className="text-muted-foreground px-3 py-0.5 text-sm"
                  >
                    {val}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-2 border-t pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onClear}
            >
              Clear
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onApply({ col: featureName, dir: pendingDir })}
            >
              Apply
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => onViewColumn(featureName)}
          >
            View column →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Helper: interactive scatter plot (Plotly Express style) ─────────────────

// Plotly Express colour palette
const PX_COLORS = [
  "#636EFA",
  "#EF553B",
  "#00CC96",
  "#AB63FA",
  "#FFA15A",
  "#19D3F3",
  "#FF6692",
  "#B6E880",
  "#FF97FF",
  "#FECB52",
];

function ScatterCorrelationPlot({
  features,
  preview,
  isLoading,
}: {
  features: import("@/types/dataset").DatasetFeature[];
  preview: DatasetPreview | null;
  isLoading: boolean;
}) {
  const plotTheme = usePlotlyTheme();

  const numericFeatures = useMemo(
    () => features.filter((f) => f.type === "numeric"),
    [features],
  );
  const categoricalFeatures = useMemo(
    () => features.filter((f) => f.type === "nominal" || f.type === "string"),
    [features],
  );

  const [xFeature, setXFeature] = useState<string>(
    () => numericFeatures[0]?.name ?? "",
  );
  const [yFeature, setYFeature] = useState<string>(
    () => numericFeatures[1]?.name ?? numericFeatures[0]?.name ?? "",
  );
  const [colorFeature, setColorFeature] = useState<string>(() => {
    const target = categoricalFeatures.find((f) => f.target);
    return target?.name ?? categoricalFeatures[0]?.name ?? "";
  });

  const plotData = useMemo(() => {
    if (!preview || !xFeature || !yFeature) return [];

    const xIdx = preview.columns.indexOf(xFeature);
    const yIdx = preview.columns.indexOf(yFeature);
    const colorIdx = colorFeature ? preview.columns.indexOf(colorFeature) : -1;

    if (xIdx === -1 || yIdx === -1) return [];

    if (colorIdx === -1) {
      return [
        {
          type: "scatter" as const,
          mode: "markers" as const,
          x: preview.rows.map((r) => r[xIdx]),
          y: preview.rows.map((r) => r[yIdx]),
          marker: { color: PX_COLORS[0], size: 6, opacity: 0.7 },
          hovertemplate: "%{x}, %{y}<extra></extra>",
          showlegend: false,
        },
      ];
    }

    // Group rows by category value
    const groups = new Map<
      string,
      { x: (string | number | null)[]; y: (string | number | null)[] }
    >();
    for (const row of preview.rows) {
      const cat = row[colorIdx] === null ? "(null)" : String(row[colorIdx]);
      if (!groups.has(cat)) groups.set(cat, { x: [], y: [] });
      groups.get(cat)!.x.push(row[xIdx]);
      groups.get(cat)!.y.push(row[yIdx]);
    }

    return Array.from(groups.entries()).map(([cat, pts], i) => ({
      type: "scatter" as const,
      mode: "markers" as const,
      name: cat,
      x: pts.x,
      y: pts.y,
      // Category name is already shown in the legend — keep tooltip to coords only
      hovertemplate: "%{x}, %{y}<extra></extra>",
      marker: {
        color: PX_COLORS[i % PX_COLORS.length],
        size: 6,
        opacity: 0.75,
      },
    }));
  }, [preview, xFeature, yFeature, colorFeature]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-40" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (numericFeatures.length < 2) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        Need at least 2 numeric features for a scatter plot.
      </p>
    );
  }

  if (!preview) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <Database className="h-8 w-8 text-green-500" />
        <p className="text-muted-foreground text-sm">
          Scatter plot data will be available soon.
        </p>
      </div>
    );
  }

  const selectClass =
    "border-input bg-background rounded-md border px-2 py-1 text-sm focus:outline-none";

  return (
    <div className="space-y-4">
      {/* Axis + Color controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground text-xs font-medium">X</span>
          <select
            value={xFeature}
            onChange={(e) => setXFeature(e.target.value)}
            className={selectClass}
          >
            {numericFeatures.map((f) => (
              <option key={f.index} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground text-xs font-medium">Y</span>
          <select
            value={yFeature}
            onChange={(e) => setYFeature(e.target.value)}
            className={selectClass}
          >
            {numericFeatures.map((f) => (
              <option key={f.index} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        {categoricalFeatures.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-xs font-medium">
              Color
            </span>
            <select
              value={colorFeature}
              onChange={(e) => setColorFeature(e.target.value)}
              className={selectClass}
            >
              <option value="">None</option>
              {categoricalFeatures.map((f) => (
                <option key={f.index} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <span className="text-muted-foreground ml-auto text-xs">
          {preview.rows.length} of {preview.total_rows.toLocaleString()} rows
        </span>
      </div>

      {/* Scatter plot */}
      <div className="plotly-chart-container">
        <Plot
          data={plotData as object[]}
          layout={
            {
              height: 420,
              margin: { l: 60, r: 180, t: 20, b: 60 },
              font: plotTheme.font,
              xaxis: {
                title: { text: xFeature },
                automargin: true,
                gridcolor: plotTheme.gridcolor,
                zerolinecolor: plotTheme.zerolinecolor,
              },
              yaxis: {
                title: { text: yFeature },
                automargin: true,
                gridcolor: plotTheme.gridcolor,
                zerolinecolor: plotTheme.zerolinecolor,
              },
              legend: {
                title: { text: colorFeature || "" },
                x: 1.02,
                xanchor: "left" as const,
                bgcolor: "transparent",
              },
              showlegend: !!colorFeature,
              hoverlabel: plotTheme.hoverlabel,
              paper_bgcolor: plotTheme.paper_bgcolor,
              plot_bgcolor: plotTheme.plot_bgcolor,
            } as object
          }
          config={{
            displayModeBar: true,
            responsive: true,
            displaylogo: false,
            modeBarButtonsToRemove: ["select2d", "lasso2d"],
          }}
          style={{ width: "100%", height: "420px" }}
        />
      </div>
    </div>
  );
}

// ─── Helper: features stats table ────────────────────────────────────────────

function FeaturesTable({
  features,
  statsData,
  isLoadingStats,
  onColumnClick,
}: {
  features: DatasetFeature[];
  statsData: Record<string, unknown> | undefined;
  isLoadingStats: boolean;
  onColumnClick: (name: string) => void;
}) {
  const [filterText, setFilterText] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "numeric" | "nominal">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const isNumericType = (t?: string) =>
    t === "numeric" || t === "real" || t === "integer";
  const isNominalType = (t?: string) => t === "nominal" || t === "string";

  const filtered = useMemo(() => {
    // Reset page when filter changes
    setCurrentPage(1);

    return features.filter((f) => {
      const matchesText =
        !filterText || f.name.toLowerCase().includes(filterText.toLowerCase());
      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "numeric" && isNumericType(f.type)) ||
        (typeFilter === "nominal" && isNominalType(f.type));
      return matchesText && matchesType;
    });
  }, [features, filterText, typeFilter]);

  const displayedFeatures = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const numericCount = features.filter((f) => isNumericType(f.type)).length;
  const nominalCount = features.filter((f) => isNominalType(f.type)).length;

  const filterButtons: { key: "all" | "numeric" | "nominal"; label: string }[] =
    [
      { key: "all", label: `All (${features.length})` },
      { key: "numeric", label: `Numeric (${numericCount})` },
      { key: "nominal", label: `Nominal (${nominalCount})` },
    ];

  return (
    <div className="space-y-3">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search features..."
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
          }}
          className="h-8 max-w-xs"
        />
        <div className="flex overflow-hidden rounded-md border text-xs">
          {filterButtons.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={cn(
                "px-3 py-1.5 transition-colors",
                typeFilter === key
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted/50",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 sticky top-0">
            <tr>
              <th className="text-muted-foreground w-8 px-3 py-2 text-left font-medium">
                #
              </th>
              <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                Name
              </th>
              <th className="text-muted-foreground px-3 py-2 text-left font-medium">
                Type
              </th>
              <th className="text-muted-foreground px-3 py-2 text-right font-medium">
                Missing
              </th>
              <th className="text-muted-foreground px-3 py-2 text-right font-medium">
                Unique
              </th>
              <th className="text-muted-foreground min-w-40 px-3 py-2 text-left font-medium">
                Stats
              </th>
              <th className="text-muted-foreground w-24 px-3 py-2 text-left font-medium">
                Distribution
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedFeatures.map((f, i) => {
              const raw = statsData?.[f.name];
              const numeric = isNumericType(f.type);

              // Top categories for nominal features
              let topCategories: string[] = [];
              if (
                !numeric &&
                raw &&
                typeof raw === "object" &&
                "categories" in raw
              ) {
                topCategories = (
                  (raw as { categories: string[] }).categories ?? []
                ).slice(0, 3);
              }

              return (
                <tr
                  key={f.index ?? i}
                  className={cn(
                    "hover:bg-muted/40 cursor-pointer border-b transition-colors last:border-0",
                    f.target && "bg-amber-50/50 dark:bg-amber-950/10",
                  )}
                  onClick={() => onColumnClick(f.name)}
                >
                  {/* # */}
                  <td className="text-muted-foreground px-3 py-2 text-xs tabular-nums">
                    {f.index ?? i}
                  </td>

                  {/* Name */}
                  <td className="px-3 py-2 font-medium">
                    <span className="flex items-center gap-1.5">
                      <ColumnTypeIcon type={f.type} />
                      {f.target && (
                        <Target className="h-3 w-3 shrink-0 text-amber-500" />
                      )}
                      <span className="max-w-[160px] truncate">{f.name}</span>
                    </span>
                  </td>

                  {/* Type */}
                  <td className="px-3 py-2">
                    <FeatureTypeBadge type={f.type} />
                  </td>

                  {/* Missing */}
                  <td className="px-3 py-2 text-right text-xs tabular-nums">
                    {f.missing != null ? f.missing.toLocaleString() : "0"}
                  </td>

                  {/* Unique */}
                  <td className="px-3 py-2 text-right text-xs tabular-nums">
                    {f.distinct != null
                      ? Number(f.distinct).toLocaleString()
                      : "—"}
                  </td>

                  {/* Stats */}
                  <td className="text-muted-foreground px-3 py-2 text-xs">
                    {numeric && f.min != null && f.max != null ? (
                      <div className="space-y-0.5">
                        <div className="text-foreground">
                          {parseFloat(String(f.min)).toLocaleString(undefined, {
                            maximumFractionDigits: 3,
                          })}
                          {" – "}
                          {parseFloat(String(f.max)).toLocaleString(undefined, {
                            maximumFractionDigits: 3,
                          })}
                        </div>
                        {f.mean != null && (
                          <div>
                            μ{" "}
                            {parseFloat(String(f.mean)).toLocaleString(
                              undefined,
                              { maximumFractionDigits: 3 },
                            )}
                          </div>
                        )}
                      </div>
                    ) : topCategories.length > 0 ? (
                      <div className="space-y-0.5">
                        {topCategories.map((cat) => (
                          <div key={cat} className="max-w-40 truncate">
                            {cat}
                          </div>
                        ))}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Distribution sparkline */}
                  <td className="w-24 px-3 py-2">
                    {isLoadingStats ? (
                      <Skeleton className="h-7 w-full" />
                    ) : (
                      <MiniSparkline
                        feature={f}
                        statsData={statsData}
                        isLoading={false}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-muted-foreground py-8 text-center text-sm">
            No features match your filter.
          </p>
        )}
      </div>

      <PaginationControls
        page={currentPage}
        total={filtered.length}
        pageSize={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
