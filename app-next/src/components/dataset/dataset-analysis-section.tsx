"use client";

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Dataset, DatasetFeature } from "@/types/dataset";
import type { Layout } from "plotly.js";
import {
  useParquetData,
  computeDistribution,
  computeDistributionByTarget,
  type DistributionData,
} from "@/hooks/useParquetData";
import { Loader2, AlertCircle } from "lucide-react";

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

interface DatasetAnalysisSectionProps {
  dataset: Dataset;
  className?: string;
}

/**
 * Compute Pearson correlation coefficient between two arrays
 */
function computePearsonCorrelation(
  xValues: (string | number | null)[],
  yValues: (string | number | null)[],
): number {
  // Filter to pairs where both values are valid numbers
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
  return Math.round(correlation * 100) / 100; // Round to 2 decimal places
}

/**
 * DatasetAnalysisSection Component
 *
 * Comprehensive data analysis with interactive Plotly visualizations.
 * Similar to production OpenML's Analysis tab.
 * Now with real data from parquet files!
 */
export function DatasetAnalysisSection({
  dataset,
  className,
}: DatasetAnalysisSectionProps) {
  const [activeTab, setActiveTab] = useState("distribution");

  const features = dataset.features || [];
  const qualities = dataset.qualities || {};

  const numericFeatures = features.filter((f) => f.type === "numeric");
  const nominalFeatures = features.filter((f) => f.type === "nominal");

  // Load parquet data for real distributions, fall back to ARFF if needed
  const parquetState = useParquetData(dataset.data_id, dataset.url);

  return (
    <section id="analysis" className={cn("scroll-mt-20", className)}>
      {/* Plotly modebar styles are now in globals.css */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Analysis
                <Badge variant="secondary" className="text-xs">
                  Interactive
                </Badge>
                {parquetState.isLoading && (
                  <Badge variant="outline" className="text-xs">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Loading data...
                  </Badge>
                )}
                {parquetState.data && (
                  <Badge variant="default" className="bg-green-500 text-xs">
                    Real data
                  </Badge>
                )}
                {parquetState.isTooLarge && (
                  <Badge variant="outline" className="text-xs text-amber-600">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Large dataset
                  </Badge>
                )}
              </CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                {parquetState.data
                  ? `Analyzing ${parquetState.rowCount.toLocaleString()} rows`
                  : parquetState.isTooLarge
                    ? "Dataset too large for browser visualization (showing metadata only)"
                    : "Explore data distributions and relationships"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="correlation">Correlation</TabsTrigger>
              <TabsTrigger value="missing">Missing Values</TabsTrigger>
              <TabsTrigger value="summary">Summary Stats</TabsTrigger>
            </TabsList>

            {/* Distribution Tab */}
            <TabsContent value="distribution" className="space-y-6">
              <FeatureDistributionPlots
                numericFeatures={numericFeatures}
                nominalFeatures={nominalFeatures}
                parquetData={parquetState.data}
                isLoadingParquet={parquetState.isLoading}
              />
            </TabsContent>

            {/* Correlation Tab */}
            <TabsContent value="correlation">
              <CorrelationHeatmap
                numericFeatures={numericFeatures}
                nominalFeatures={nominalFeatures}
                parquetData={parquetState.data}
              />
            </TabsContent>

            {/* Missing Values Tab */}
            <TabsContent value="missing">
              <MissingValuesPlot features={features} qualities={qualities} />
            </TabsContent>

            {/* Summary Stats Tab */}
            <TabsContent value="summary">
              <SummaryStatsTable features={features} qualities={qualities} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}

/**
 * Feature Distribution Plots - Interactive like production OpenML
 * Now with real data from parquet files!
 */
function FeatureDistributionPlots({
  numericFeatures,
  nominalFeatures,
  parquetData,
  isLoadingParquet,
}: {
  numericFeatures: Dataset["features"];
  nominalFeatures: Dataset["features"];
  parquetData: Record<string, (string | number | null)[]> | null;
  isLoadingParquet: boolean;
}) {
  const allFeatures = [...(numericFeatures || []), ...(nominalFeatures || [])];

  // Limit features display for performance (show first 100)
  const MAX_DISPLAYED_FEATURES = 100;
  const displayedFeatures = allFeatures.slice(0, MAX_DISPLAYED_FEATURES);
  const hasMoreFeatures = allFeatures.length > MAX_DISPLAYED_FEATURES;

  // State for feature selection
  const [selectedFeatures, setSelectedFeatures] = useState<Set<number>>(() => {
    // Default: select first 10 numeric features (or up to 10)
    const initialSelection = new Set<number>();
    const featuresToSelect = displayedFeatures
      .filter((f) => f.type === "numeric" && f.target !== "1")
      .slice(0, 10);

    if (featuresToSelect.length === 0) {
      // If no numeric features, select first 10 features
      displayedFeatures
        .slice(0, 10)
        .forEach((f) => initialSelection.add(f.index));
    } else {
      featuresToSelect.forEach((f) => initialSelection.add(f.index));
    }

    return initialSelection;
  });

  // State for plot options
  const [colorMode, setColorMode] = useState<"target" | "individual">("target");
  const [stackMode, setStackMode] = useState<"stack" | "unstack">("stack");
  const [filterText, setFilterText] = useState("");

  // Find target feature
  const targetFeature = allFeatures.find((f) => f.target === "1");

  // Filter features based on search
  const filteredFeatures = useMemo(() => {
    if (!filterText) return displayedFeatures;
    return displayedFeatures.filter((f) =>
      f.name.toLowerCase().includes(filterText.toLowerCase()),
    );
  }, [displayedFeatures, filterText]);

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

  // Calculate entropy (simplified)
  const calculateEntropy = (feature: DatasetFeature): string => {
    const distr = feature.distr || [];
    if (distr.length === 0) return "—";
    const total = distr.reduce((sum, d) => sum + d[1], 0);
    if (total === 0) return "—";
    let entropy = 0;
    for (const [, count] of distr) {
      if (count > 0) {
        const p = count / total;
        entropy -= p * Math.log2(p);
      }
    }
    return entropy.toFixed(2);
  };

  if (allFeatures.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No features available for distribution analysis.
      </p>
    );
  }

  // Colors for target-based distribution
  const targetColors = [
    "#3b82f6",
    "#ef4444",
    "#22c55e",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#6366f1",
  ];

  return (
    <div className="space-y-6">
      {/* Feature Selection Table */}
      <div className="rounded-lg border">
        <div className="bg-muted/50 border-b px-4 py-3">
          <h4 className="text-sm font-medium">
            Choose one or more attributes for distribution plot
            {hasMoreFeatures && (
              <span className="text-muted-foreground ml-2 font-normal">
                (showing first {MAX_DISPLAYED_FEATURES} of {allFeatures.length}{" "}
                attributes)
              </span>
            )}
          </h4>
        </div>

        {/* Search filter */}
        <div className="border-b p-2">
          <Input
            placeholder="Filter attributes..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="h-8 text-sm"
          />
        </div>

        {/* Feature table - Mobile responsive with horizontal scroll */}
        <div className="max-h-[300px] overflow-auto">
          <div className="min-w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 sticky top-0">
                <tr className="border-b">
                  <th className="w-8 px-2 py-2"></th>
                  <th className="min-w-[120px] px-3 py-2 text-left font-medium">
                    Attribute
                  </th>
                  <th className="min-w-[100px] px-3 py-2 text-left font-medium">
                    DataType
                  </th>
                  <th className="min-w-[80px] px-3 py-2 text-right font-medium">
                    Missing
                  </th>
                  <th className="min-w-[100px] px-3 py-2 text-right font-medium">
                    # categories
                  </th>
                  <th className="min-w-[80px] px-3 py-2 text-center font-medium">
                    Target
                  </th>
                  <th className="min-w-[80px] px-3 py-2 text-right font-medium">
                    Entropy
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFeatures.map((feature) => (
                  <tr
                    key={feature.index}
                    className={cn(
                      "hover:bg-muted/50 cursor-pointer border-b transition-colors",
                      selectedFeatures.has(feature.index) && "bg-primary/5",
                    )}
                    onClick={() => toggleFeature(feature.index)}
                  >
                    <td className="px-2 py-2">
                      <Checkbox
                        checked={selectedFeatures.has(feature.index)}
                        onCheckedChange={() => toggleFeature(feature.index)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-3 py-2 font-medium">{feature.name}</td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className="text-xs">
                        {feature.type}
                      </Badge>
                    </td>
                    <td className="text-muted-foreground px-3 py-2 text-right">
                      {feature.missing || 0}
                    </td>
                    <td className="text-muted-foreground px-3 py-2 text-right">
                      {feature.distinct || "—"}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {feature.target === "1" && (
                        <Badge className="bg-green-500 text-xs">true</Badge>
                      )}
                    </td>
                    <td className="text-muted-foreground px-3 py-2 text-right">
                      {calculateEntropy(feature)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Distribution Plot Section */}
      {selectedFeatureObjects.length > 0 && (
        <div className="rounded-lg border p-4">
          <h4 className="mb-2 font-medium">Distribution Plot</h4>
          {!parquetData && !isLoadingParquet && (
            <p className="text-muted-foreground mb-3 text-xs italic">
              Note: Distribution plots for numeric features require loading the
              dataset file. Only nominal feature distributions are available
              from metadata.
            </p>
          )}

          {/* Plot Controls */}
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                Choose if the color code is based on target or not
              </p>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="colorMode"
                    value="target"
                    checked={colorMode === "target"}
                    onChange={() => setColorMode("target")}
                    className="text-primary h-4 w-4"
                  />
                  <span className="text-sm">Target based distribution</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="colorMode"
                    value="individual"
                    checked={colorMode === "individual"}
                    onChange={() => setColorMode("individual")}
                    className="text-primary h-4 w-4"
                  />
                  <span className="text-sm">Individual distribution</span>
                </label>
              </div>
            </div>

            {/* Stack/Unstack buttons - only show when target-based and target exists */}
            {colorMode === "target" && targetFeature && (
              <div className="flex gap-2">
                <Button
                  variant={stackMode === "stack" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStackMode("stack")}
                >
                  Stack
                </Button>
                <Button
                  variant={stackMode === "unstack" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStackMode("unstack")}
                >
                  Un-stack
                </Button>
              </div>
            )}
          </div>

          {/* Plot for each selected feature */}
          <div className="space-y-6">
            {selectedFeatureObjects.map((feature) => {
              // Check if we have real parquet data for this feature
              const hasParquetData = parquetData && parquetData[feature.name];
              const featureValues = hasParquetData
                ? parquetData[feature.name]
                : null;
              const targetName = targetFeature?.name;
              const targetValues =
                targetName && parquetData ? parquetData[targetName] : null;

              // Compute distribution from real data if available
              let distribution: DistributionData | null = null;
              let distributionByTarget: Record<
                string,
                DistributionData
              > | null = null;

              if (featureValues) {
                if (
                  colorMode === "target" &&
                  targetValues &&
                  targetFeature &&
                  feature.name !== targetName
                ) {
                  distributionByTarget = computeDistributionByTarget(
                    featureValues,
                    targetValues,
                    feature.type as "numeric" | "nominal",
                  );
                } else {
                  distribution = computeDistribution(
                    featureValues,
                    feature.type as "numeric" | "nominal",
                  );
                }
              }

              // Fall back to metadata distr if no parquet data
              const metaDistr = feature.distr || [];
              const hasMetaData = metaDistr.length > 0;
              const hasData = hasParquetData || hasMetaData;

              // Generate plot data
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              let plotData: any[] = [];

              if (
                distributionByTarget &&
                Object.keys(distributionByTarget).length > 0
              ) {
                // Target-based distribution from real data
                const targetVals = Object.keys(distributionByTarget);

                if (feature.type === "numeric") {
                  // Histogram per target class
                  plotData = targetVals.map((targetVal, idx) => {
                    const dist = distributionByTarget![targetVal];
                    const bins = dist.bins || [];
                    return {
                      type: "bar",
                      name: String(targetVal),
                      x: bins.map((b) => ((b.min + b.max) / 2).toFixed(2)),
                      y: bins.map((b) => b.count),
                      marker: {
                        color: targetColors[idx % targetColors.length],
                      },
                      opacity: 0.85,
                    };
                  });
                } else {
                  // Bar chart per target class for nominal
                  const allCategories = new Set<string>();
                  targetVals.forEach((tv) => {
                    distributionByTarget![tv].categories?.forEach((c) =>
                      allCategories.add(c.value),
                    );
                  });

                  plotData = targetVals.map((targetVal, idx) => {
                    const dist = distributionByTarget![targetVal];
                    const catMap = new Map(
                      dist.categories?.map((c) => [c.value, c.count]) || [],
                    );
                    return {
                      type: "bar",
                      name: String(targetVal),
                      x: Array.from(allCategories),
                      y: Array.from(allCategories).map(
                        (c) => catMap.get(c) || 0,
                      ),
                      marker: {
                        color: targetColors[idx % targetColors.length],
                      },
                      opacity: 0.85,
                    };
                  });
                }
              } else if (distribution) {
                // Individual distribution from real data
                if (feature.type === "numeric" && colorMode === "individual") {
                  // Violin plot for numeric individual distribution
                  if (distribution.values && distribution.values.length > 0) {
                    plotData = [
                      {
                        type: "violin",
                        y: distribution.values,
                        name: feature.name,
                        box: { visible: true },
                        meanline: { visible: true },
                        fillcolor: "steelblue",
                        line: { color: "black" },
                        opacity: 0.6,
                      },
                    ];
                  } else if (distribution.bins) {
                    // Fallback to histogram if no raw values
                    plotData = [
                      {
                        type: "bar",
                        name: feature.name,
                        x: distribution.bins.map((b) =>
                          ((b.min + b.max) / 2).toFixed(2),
                        ),
                        y: distribution.bins.map((b) => b.count),
                        marker: { color: "#3b82f6" },
                        opacity: 0.85,
                      },
                    ];
                  }
                } else if (feature.type === "numeric") {
                  // Histogram for numeric target-based (but no target)
                  const bins = distribution.bins || [];
                  plotData = [
                    {
                      type: "bar",
                      name: feature.name,
                      x: bins.map((b) => ((b.min + b.max) / 2).toFixed(2)),
                      y: bins.map((b) => b.count),
                      marker: { color: "#3b82f6" },
                      opacity: 0.85,
                    },
                  ];
                } else {
                  // Bar chart for nominal
                  const categories = distribution.categories || [];
                  plotData = [
                    {
                      type: "bar",
                      name: feature.name,
                      x: categories.map((c) => c.value),
                      y: categories.map((c) => c.count),
                      marker: { color: "#3b82f6" },
                      opacity: 0.85,
                    },
                  ];
                }
              } else if (hasMetaData) {
                // Fallback to metadata distribution
                if (
                  colorMode === "target" &&
                  targetFeature &&
                  targetFeature.index !== feature.index
                ) {
                  const targetDistr = targetFeature.distr || [];
                  const totalTargetCount = targetDistr.reduce(
                    (sum, d) => sum + d[1],
                    0,
                  );

                  plotData = targetDistr.map(
                    ([targetVal, targetCount], idx) => {
                      const proportion =
                        totalTargetCount > 0
                          ? targetCount / totalTargetCount
                          : 1 / targetDistr.length;

                      return {
                        type: "bar",
                        name: String(targetVal),
                        x: metaDistr.map((d) => d[0]),
                        y: metaDistr.map((d) => Math.round(d[1] * proportion)),
                        marker: {
                          color: targetColors[idx % targetColors.length],
                        },
                        opacity: 0.85,
                      };
                    },
                  );
                } else {
                  plotData = [
                    {
                      type: "bar",
                      name: feature.name,
                      x: metaDistr.map((d) => d[0]),
                      y: metaDistr.map((d) => d[1]),
                      marker: { color: "#3b82f6" },
                      opacity: 0.85,
                    },
                  ];
                }
              }

              // Determine if this is a violin plot
              const isViolin =
                plotData.length > 0 && plotData[0].type === "violin";

              return (
                <div key={feature.index}>
                  <h5 className="text-muted-foreground mb-2 text-sm font-medium">
                    {feature.name}
                    {hasParquetData && (
                      <Badge
                        variant="outline"
                        className="ml-2 text-xs text-green-600"
                      >
                        Real data
                      </Badge>
                    )}
                  </h5>
                  {isLoadingParquet ? (
                    <div className="bg-muted/50 flex h-[200px] items-center justify-center rounded">
                      <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                    </div>
                  ) : hasData && plotData.length > 0 ? (
                    <div className="plotly-chart-container">
                      <Plot
                        data={plotData}
                        layout={
                          {
                            autosize: true,
                            height: 350,
                            margin: { l: 50, r: 30, t: 30, b: 60 },
                            paper_bgcolor: "transparent",
                            plot_bgcolor: "transparent",
                            barmode: stackMode === "stack" ? "stack" : "group",
                            dragmode: "zoom",
                            xaxis: isViolin
                              ? {
                                  fixedrange: false,
                                  autorange: true,
                                }
                              : {
                                  title: feature.name,
                                  tickangle:
                                    feature.type === "nominal" ? -45 : 0,
                                  fixedrange: false,
                                  autorange: true,
                                },
                            yaxis: isViolin
                              ? {
                                  title: feature.name,
                                  fixedrange: false,
                                  autorange: true,
                                }
                              : {
                                  title: "Count",
                                  fixedrange: false,
                                  autorange: true,
                                },
                            legend: {
                              orientation: "h",
                              y: 1.1,
                            },
                            showlegend:
                              colorMode === "target" && !!targetFeature,
                          } as unknown as Layout
                        }
                        config={{
                          responsive: true,
                          displayModeBar: true,
                          scrollZoom: true,
                          modeBarButtonsToRemove: ["lasso2d", "select2d"],
                          displaylogo: false,
                        }}
                        style={{ width: "100%" }}
                        useResizeHandler
                      />
                    </div>
                  ) : (
                    <div className="bg-muted/50 flex h-[200px] flex-col items-center justify-center rounded p-4 text-center">
                      <p className="text-muted-foreground text-sm">
                        No distribution data available
                      </p>
                      {feature.type === "numeric" && !parquetData && (
                        <p className="text-muted-foreground mt-2 text-xs">
                          Note: Metadata only includes distributions for nominal
                          features. For numeric features, the dataset file needs
                          to be loaded.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedFeatureObjects.length === 0 && (
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            Select one or more attributes from the table above to view
            distribution plots.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Correlation Heatmap - Now with real correlation from parquet data!
 */
function CorrelationHeatmap({
  numericFeatures,
  nominalFeatures,
  parquetData,
}: {
  numericFeatures: Dataset["features"];
  nominalFeatures: Dataset["features"];
  parquetData: Record<string, (string | number | null)[]> | null;
}) {
  const numericCount = numericFeatures?.length || 0;
  const nominalCount = nominalFeatures?.length || 0;

  if (numericCount < 2) {
    return (
      <div className="space-y-4 py-8 text-center">
        <p className="text-muted-foreground">
          {numericCount === 0
            ? "This dataset contains only categorical features."
            : "Only 1 numeric feature available."}
        </p>
        <p className="text-muted-foreground text-sm">
          Correlation analysis requires at least 2 numeric features.
        </p>
        {nominalCount > 0 && (
          <div className="bg-muted/50 mx-auto mt-4 max-w-md rounded-lg p-4">
            <p className="text-sm font-medium">Dataset composition:</p>
            <p className="text-muted-foreground text-sm">
              {numericCount} numeric, {nominalCount} categorical features
            </p>
          </div>
        )}
      </div>
    );
  }

  // Use up to 8 numeric features
  const featureNames = numericFeatures.slice(0, 8).map((f) => f.name);
  const n = featureNames.length;

  // Compute correlation matrix
  const correlationMatrix = useMemo(() => {
    const matrix: number[][] = [];

    // If we have parquet data, compute real correlations
    if (parquetData) {
      for (let i = 0; i < n; i++) {
        matrix[i] = [];
        for (let j = 0; j < n; j++) {
          if (i === j) {
            matrix[i][j] = 1;
          } else {
            // Compute Pearson correlation
            const xValues = parquetData[featureNames[i]] || [];
            const yValues = parquetData[featureNames[j]] || [];
            matrix[i][j] = computePearsonCorrelation(xValues, yValues);
          }
        }
      }
    } else {
      // Generate placeholder matrix
      for (let i = 0; i < n; i++) {
        matrix[i] = [];
        for (let j = 0; j < n; j++) {
          if (i === j) {
            matrix[i][j] = 1;
          } else {
            matrix[i][j] = 0; // Unknown
          }
        }
      }
    }

    return matrix;
  }, [parquetData, featureNames, n]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-muted-foreground text-sm">
          Correlation matrix between numeric features
        </p>
        {parquetData && (
          <Badge variant="default" className="bg-green-500 text-xs">
            Real correlations
          </Badge>
        )}
      </div>
      <Plot
        data={[
          {
            type: "heatmap",
            z: correlationMatrix,
            x: featureNames,
            y: featureNames,
            colorscale: "RdBu",
            zmin: -1,
            zmax: 1,
            hovertemplate: "%{x} vs %{y}: %{z:.2f}<extra></extra>",
          },
        ]}
        layout={
          {
            autosize: true,
            height: 500,
            margin: { l: 100, r: 50, t: 80, b: 100 },
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
            dragmode: "zoom",
            xaxis: {
              tickangle: -45,
              fixedrange: false,
              autorange: true,
            },
            yaxis: {
              fixedrange: false,
              autorange: true,
            },
          } as unknown as Layout
        }
        config={{
          responsive: true,
          displayModeBar: true,
          scrollZoom: true,
          modeBarButtonsToRemove: ["lasso2d", "select2d"],
          displaylogo: false,
        }}
        style={{ width: "100%" }}
        useResizeHandler
      />
      <p className="text-muted-foreground text-center text-xs">
        Note: Actual correlation values require raw data computation
      </p>
    </div>
  );
}

/**
 * Missing Values Plot
 */
function MissingValuesPlot({
  features,
  qualities,
}: {
  features: Dataset["features"];
  qualities: Dataset["qualities"];
}) {
  if (!features || features.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No feature data available.
      </p>
    );
  }

  const totalInstances = qualities?.NumberOfInstances || 1;
  const featuresWithMissing = features
    .filter((f) => f.missing && f.missing > 0)
    .sort((a, b) => (b.missing || 0) - (a.missing || 0))
    .slice(0, 15);

  if (featuresWithMissing.length === 0) {
    return (
      <div className="rounded-lg bg-green-50 p-8 text-center dark:bg-green-900/20">
        <p className="font-medium text-green-700 dark:text-green-300">
          ✓ No missing values in this dataset
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Features with missing values (sorted by count)
      </p>
      <Plot
        data={[
          {
            type: "bar",
            y: featuresWithMissing.map((f) => f.name),
            x: featuresWithMissing.map((f) => f.missing || 0),
            orientation: "h",
            marker: {
              color: featuresWithMissing.map((f) => {
                const pct = ((f.missing || 0) / totalInstances) * 100;
                if (pct > 50) return "#ef4444"; // red
                if (pct > 20) return "#f59e0b"; // amber
                return "#3b82f6"; // blue
              }),
            },
            text: featuresWithMissing.map(
              (f) =>
                `${(((f.missing || 0) / totalInstances) * 100).toFixed(1)}%`,
            ),
            textposition: "outside",
          },
        ]}
        layout={
          {
            autosize: true,
            height: Math.max(300, featuresWithMissing.length * 30),
            margin: { l: 150, r: 80, t: 60, b: 40 },
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
            dragmode: "zoom",
            xaxis: {
              title: "Missing Count",
              fixedrange: false,
              autorange: true,
            },
            yaxis: {
              automargin: true,
              fixedrange: false,
              autorange: true,
            },
          } as unknown as Layout
        }
        config={{
          responsive: true,
          displayModeBar: true,
          scrollZoom: true,
          modeBarButtonsToRemove: ["lasso2d", "select2d"],
          displaylogo: false,
        }}
        style={{ width: "100%" }}
        useResizeHandler
      />
    </div>
  );
}

/**
 * Summary Statistics Table
 */
function SummaryStatsTable({
  features,
  qualities,
}: {
  features: Dataset["features"];
  qualities: Dataset["qualities"];
}) {
  if (!features || features.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No feature data available.
      </p>
    );
  }

  const numericFeatures = features
    .filter((f) => f.type === "numeric")
    .slice(0, 10);

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Statistical summary of numeric features
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left font-medium">Feature</th>
              <th className="px-4 py-2 text-right font-medium">Min</th>
              <th className="px-4 py-2 text-right font-medium">Max</th>
              <th className="px-4 py-2 text-right font-medium">Mean</th>
              <th className="px-4 py-2 text-right font-medium">Std Dev</th>
              <th className="px-4 py-2 text-right font-medium">Missing</th>
              <th className="px-4 py-2 text-right font-medium">Distinct</th>
            </tr>
          </thead>
          <tbody>
            {numericFeatures.map((f) => (
              <tr key={f.index} className="hover:bg-muted/50 border-b">
                <td className="px-4 py-2 font-medium">{f.name}</td>
                <td className="text-muted-foreground px-4 py-2 text-right">
                  {f.min || "—"}
                </td>
                <td className="text-muted-foreground px-4 py-2 text-right">
                  {f.max || "—"}
                </td>
                <td className="text-muted-foreground px-4 py-2 text-right">
                  {f.mean || "—"}
                </td>
                <td className="text-muted-foreground px-4 py-2 text-right">
                  {f.stdev || "—"}
                </td>
                <td className="text-muted-foreground px-4 py-2 text-right">
                  {f.missing || 0}
                </td>
                <td className="text-muted-foreground px-4 py-2 text-right">
                  {f.distinct || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
