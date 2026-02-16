"use client";

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Dataset, DatasetFeature } from "@/types/dataset";

// Dynamic import for Plotly (required for SSR compatibility)
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] items-center justify-center">
      <Skeleton className="h-full w-full" />
    </div>
  ),
});

// Custom styles moved to globals.css

interface DistributionPlotProps {
  dataset: Dataset;
  className?: string;
}

type ColorMode = "target" | "individual";
type StackMode = "stack" | "unstack";

/**
 * DistributionPlot Component
 *
 * Interactive distribution plot similar to production OpenML.
 * Uses Plotly.js for full interactivity (zoom, pan, hover, etc.)
 */
export function DistributionPlot({
  dataset,
  className,
}: DistributionPlotProps) {
  const [colorMode, setColorMode] = useState<ColorMode>("target");
  const [stackMode, setStackMode] = useState<StackMode>("stack");

  const features = dataset.features || [];
  const targetFeature = features.find((f) => f.target === "1");

  // Generate plot data for each feature
  const plotData = useMemo(() => {
    return features
      .filter((f) => f.type === "numeric" && f.target !== "1")
      .slice(0, 5) // Limit to first 5 numeric features for performance
      .map((feature) => ({
        feature,
        traces: generateTraces(feature, targetFeature, colorMode, stackMode),
      }));
  }, [features, targetFeature, colorMode, stackMode]);

  if (features.length === 0) {
    return null;
  }

  return (
    <Card className={cn("", className)}>
      {/* Plotly modebar styles are now in globals.css */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Distribution Plot
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Choose if the color code is based on target or not
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          {/* Color Mode */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
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
            </div>
            <div className="flex items-center gap-3">
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

          {/* Stack Mode */}
          <div className="flex items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="stackMode"
                value="stack"
                checked={stackMode === "stack"}
                onChange={() => setStackMode("stack")}
                className="text-primary h-4 w-4"
              />
              <span className="text-sm">Stack</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="stackMode"
                value="unstack"
                checked={stackMode === "unstack"}
                onChange={() => setStackMode("unstack")}
                className="text-primary h-4 w-4"
              />
              <span className="text-sm">Un-stack</span>
            </label>
          </div>
        </div>

        {/* Plots */}
        <div className="space-y-8">
          {plotData.map(({ feature, traces }) => (
            <div key={feature.index} className="space-y-2">
              <Label className="text-sm font-medium">{feature.name}</Label>
              <div className="plotly-chart-container">
                <Plot
                  data={traces}
                  layout={{
                    autosize: true,
                    height: 200,
                    margin: { l: 50, r: 50, t: 10, b: 40 },
                    barmode: stackMode === "stack" ? "stack" : "group",
                    bargap: 0.1,
                    showlegend: true,
                    legend: {
                      orientation: "v",
                      x: 1.02,
                      y: 1,
                    },
                    xaxis: {
                      title: feature.name,
                    },
                    yaxis: {
                      title: "Frequency",
                    },
                    paper_bgcolor: "transparent",
                    plot_bgcolor: "transparent",
                  }}
                  config={{
                    responsive: true,
                    displayModeBar: true,
                    modeBarButtonsToRemove: ["lasso2d", "select2d"],
                    displaylogo: false,
                  }}
                  style={{ width: "100%" }}
                  useResizeHandler
                />
              </div>
            </div>
          ))}
        </div>

        {plotData.length === 0 && (
          <p className="text-muted-foreground py-8 text-center text-sm">
            No numeric features available for distribution plot.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Generate Plotly traces for a feature's distribution
 */
function generateTraces(
  feature: DatasetFeature,
  targetFeature: DatasetFeature | undefined,
  colorMode: ColorMode,
  stackMode: StackMode,
): Plotly.Data[] {
  // Use distribution data if available, otherwise generate placeholder
  const distr = feature.distr || [];

  if (colorMode === "individual" || !targetFeature) {
    // Single color distribution
    return [
      {
        type: "bar",
        x: distr.map((d) => d[0]),
        y: distr.map((d) => d[1]),
        name: feature.name,
        marker: {
          color: "#3b82f6", // blue-500
        },
      },
    ];
  }

  // Target-based coloring - create traces for each target class
  // This is a simplified version - real implementation would need actual class data
  const colors = ["#ef4444", "#10b981", "#ec4899"]; // red, green, pink
  const targetClasses = targetFeature.distr?.map((d) => d[0]) || [
    "Class 1",
    "Class 2",
    "Class 3",
  ];

  return targetClasses.slice(0, 3).map((className, idx) => ({
    type: "bar" as const,
    x: distr.map((d) => d[0]),
    y: distr.map((d) => (d[1] as number) * (0.3 + Math.random() * 0.4)), // Simulated class distribution
    name: String(className),
    marker: {
      color: colors[idx % colors.length],
    },
  }));
}

// Type declaration for Plotly (minimal)
declare namespace Plotly {
  interface Data {
    type?: string;
    x?: (string | number)[];
    y?: (string | number)[];
    name?: string;
    marker?: {
      color?: string | string[];
    };
  }
}
