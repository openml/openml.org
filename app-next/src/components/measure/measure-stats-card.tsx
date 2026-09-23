"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, TrendingUp, Calendar, Hash } from "lucide-react";
import { entityColors } from "@/constants/entityColors";

interface MeasureStatsCardProps {
  measureType: "evaluation_measure" | "estimation_procedure" | "data_quality";
}

interface Stats {
  total: number;
  dateRange: { first: string; last: string } | null;
  typeSpecific: Record<string, any>;
}

export function MeasureStatsCard({ measureType }: MeasureStatsCardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all measures of this type to compute stats
        const esQuery = {
          query: {
            bool: {
              filter: [{ term: { measure_type: measureType } }],
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
          const measures = data.hits?.hits?.map((hit: any) => hit._source) || [];

          // Compute stats
          const total = measures.length;
          const dates = measures
            .map((m: any) => m.date)
            .filter(Boolean)
            .sort();
          const dateRange =
            dates.length > 0
              ? { first: dates[0], last: dates[dates.length - 1] }
              : null;

          // Type-specific stats
          let typeSpecific: Record<string, any> = {};

          if (measureType === "evaluation_measure") {
            const higher = measures.filter(
              (m: any) => m.higherIsBetter === "1" || m.higherIsBetter === 1
            ).length;
            const lower = measures.filter(
              (m: any) => m.higherIsBetter === "0" || m.higherIsBetter === 0
            ).length;
            typeSpecific = {
              higherIsBetter: higher,
              lowerIsBetter: lower,
            };
          } else if (measureType === "estimation_procedure") {
            const stratified = measures.filter(
              (m: any) => m.stratified_sampling === "true"
            ).length;
            typeSpecific = {
              stratified,
              nonStratified: total - stratified,
            };
          }

          setStats({ total, dateRange, typeSpecific });
        }
      } catch (error) {
        console.error("[MeasureStatsCard] Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [measureType]);

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2
            className="h-6 w-6 animate-spin"
            style={{ color: entityColors.measures }}
          />
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card className="mb-6" style={{ borderColor: `${entityColors.measures}30` }}>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {/* Total Count */}
          <div className="flex items-center gap-3">
            <Hash
              className="h-5 w-5"
              style={{ color: entityColors.measures }}
            />
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-muted-foreground text-xs">Total Measures</p>
            </div>
          </div>

          {/* Date Range */}
          {stats.dateRange && (
            <div className="flex items-center gap-3">
              <Calendar
                className="h-5 w-5"
                style={{ color: entityColors.measures }}
              />
              <div>
                <p className="text-sm font-semibold">
                  {new Date(stats.dateRange.first).getFullYear()} -{" "}
                  {new Date(stats.dateRange.last).getFullYear()}
                </p>
                <p className="text-muted-foreground text-xs">Date Range</p>
              </div>
            </div>
          )}

          {/* Type-specific stats */}
          {measureType === "evaluation_measure" && (
            <>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {stats.typeSpecific.higherIsBetter}
                  </p>
                  <p className="text-muted-foreground text-xs">Higher is Better</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 rotate-180 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {stats.typeSpecific.lowerIsBetter}
                  </p>
                  <p className="text-muted-foreground text-xs">Lower is Better</p>
                </div>
              </div>
            </>
          )}

          {measureType === "estimation_procedure" && (
            <div className="flex items-center gap-3">
              <TrendingUp
                className="h-5 w-5"
                style={{ color: entityColors.measures }}
              />
              <div>
                <p className="text-2xl font-bold">
                  {stats.typeSpecific.stratified}
                </p>
                <p className="text-muted-foreground text-xs">Stratified</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
