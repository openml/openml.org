"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useMemo } from "react";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "next-themes";
import { entityColors } from "@/constants/entityColors";
import type { Measure } from "@/types/measure";

// Dynamic import for Plotly (required for SSR compatibility)
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center">
      <Skeleton className="h-full w-full" />
    </div>
  ),
});

interface MeasureAnalysisSectionProps {
  measure: Measure;
}

export function MeasureAnalysisSection({
  measure,
}: MeasureAnalysisSectionProps) {
  const [relatedMeasures, setRelatedMeasures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchRelatedMeasures = async () => {
      try {
        // Fetch all measures of the same type for comparison
        const esQuery = {
          query: {
            bool: {
              filter: [{ term: { measure_type: measure.measure_type } }],
            },
          },
          size: 500,
          sort: [{ date: { order: "asc" } }],
        };

        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            indexName: "measure",
            esQuery,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const measures =
            data.hits?.hits?.map((hit: any) => hit._source) || [];
          setRelatedMeasures(measures);
        }
      } catch (error) {
        console.error("[MeasureAnalysisSection] Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedMeasures();
  }, [measure.measure_type]);

  // Compute timeline data
  const timelineData = useMemo(() => {
    if (relatedMeasures.length === 0) return null;

    // Group by year
    const yearCounts: Record<string, number> = {};
    relatedMeasures.forEach((m) => {
      if (m.date) {
        const year = new Date(m.date).getFullYear().toString();
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      }
    });

    const years = Object.keys(yearCounts).sort();
    const counts = years.map((y) => yearCounts[y]);

    return { years, counts };
  }, [relatedMeasures]);

  // Compute stats
  const stats = useMemo(() => {
    if (measure.measure_type === "evaluation_measure") {
      const higher = relatedMeasures.filter(
        (m) => m.higherIsBetter === "1" || m.higherIsBetter === 1,
      ).length;
      const lower = relatedMeasures.filter(
        (m) => m.higherIsBetter === "0" || m.higherIsBetter === 0,
      ).length;

      return {
        current: measure.higherIsBetter
          ? "Higher is better"
          : "Lower is better",
        higherCount: higher,
        lowerCount: lower,
      };
    }

    if (measure.measure_type === "estimation_procedure") {
      const stratifiedCount = relatedMeasures.filter(
        (m) => m.stratified_sampling === "true",
      ).length;

      return {
        current:
          measure.stratified_sampling === "true"
            ? "Stratified"
            : "Non-stratified",
        stratifiedCount,
        nonStratifiedCount: relatedMeasures.length - stratifiedCount,
      };
    }

    return null;
  }, [measure, relatedMeasures]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: entityColors.measures }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2">
          {measure.measure_type === "evaluation_measure" && (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.higherCount}</p>
                      <p className="text-muted-foreground text-sm">
                        Higher is Better
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.lowerCount}</p>
                      <p className="text-muted-foreground text-sm">
                        Lower is Better
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {measure.measure_type === "estimation_procedure" && (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-2xl font-bold">
                      {stats.stratifiedCount}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Stratified Procedures
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-2xl font-bold">
                      {stats.nonStratifiedCount}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Non-Stratified Procedures
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Timeline Chart */}
      {timelineData && timelineData.years.length > 1 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-semibold">
              Measures Added Over Time
            </h3>
            <Plot
              data={[
                {
                  x: timelineData.years,
                  y: timelineData.counts,
                  type: "bar",
                  marker: { color: entityColors.measures },
                  hovertemplate:
                    "<b>%{x}</b><br>Measures Added: %{y}<extra></extra>",
                },
              ]}
              layout={
                {
                  xaxis: {
                    title: {
                      text: "Year",
                      font: {
                        color:
                          theme === "dark"
                            ? "rgba(255,255,255,0.5)"
                            : "rgba(0,0,0,0.5)",
                      },
                    },
                    tickfont: {
                      color:
                        theme === "dark"
                          ? "rgba(255,255,255,0.5)"
                          : "rgba(0,0,0,0.5)",
                    },
                    gridcolor:
                      theme === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    linecolor:
                      theme === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                  },
                  yaxis: {
                    title: {
                      text: "Count",
                      font: {
                        color:
                          theme === "dark"
                            ? "rgba(255,255,255,0.5)"
                            : "rgba(0,0,0,0.5)",
                      },
                    },
                    tickfont: {
                      color:
                        theme === "dark"
                          ? "rgba(255,255,255,0.5)"
                          : "rgba(0,0,0,0.5)",
                    },
                    gridcolor:
                      theme === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    linecolor:
                      theme === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                  },
                  hovermode: "closest",
                  height: 300,
                  margin: { l: 50, r: 20, t: 20, b: 50 },
                  plot_bgcolor: "transparent",
                  paper_bgcolor: "transparent",
                } as any
              }
              config={{
                responsive: true,
                displayModeBar: false,
              }}
              style={{ width: "100%", height: "300px" }}
            />
          </CardContent>
        </Card>
      )}

      {/* Current Measure Properties */}
      {(measure.min !== undefined || measure.max !== undefined) && (
        <Alert>
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Range:</span>
              <span>
                {measure.min ?? "−∞"} to {measure.max ?? "+∞"}
                {measure.unit && ` ${measure.unit}`}
              </span>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
