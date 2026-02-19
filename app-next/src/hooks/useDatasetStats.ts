"use client";

import { useState, useEffect } from "react";

export interface NumericDistribution {
  type: "numeric";
  bins: number[];
  counts: number[];
  mean: number | null;
  std: number | null;
  min: number | null;
  max: number | null;
  missing: number;
}

export interface NominalDistribution {
  type: "nominal";
  categories: string[];
  counts: number[];
  missing: number;
}

export type FeatureDistribution = NumericDistribution | NominalDistribution;

export interface CorrelationMatrix {
  features: string[];
  matrix: number[][];
}

export interface DatasetPreview {
  columns: string[];
  rows: (string | number | null)[][];
  total_rows: number;
}

export interface DatasetStatistics {
  distribution: Record<string, FeatureDistribution>;
  correlation: CorrelationMatrix | null;
  preview: DatasetPreview;
}

export interface DatasetStatsResponse {
  dataset_id: number;
  computed_at: string;
  cached: boolean;
  statistics: DatasetStatistics;
}

export interface DatasetStatsState {
  stats: DatasetStatistics | null;
  isLoading: boolean;
  error: string | null;
  cached: boolean;
}

/**
 * Hook to fetch precomputed dataset statistics from Flask API via Next.js proxy
 * This replaces client-side parquet parsing for distribution/correlation charts
 *
 * @param datasetId - OpenML dataset ID
 * @param maxPreviewRows - Maximum rows to include in preview (default: 100)
 * @param enabled - Whether to fetch data (default: true)
 */
export function useDatasetStats(
  datasetId: number | string | undefined,
  maxPreviewRows: number = 100,
  enabled: boolean = true,
) {
  const [state, setState] = useState<DatasetStatsState>({
    stats: null,
    isLoading: false,
    error: null,
    cached: false,
  });

  useEffect(() => {
    if (!datasetId || !enabled) {
      return;
    }

    let cancelled = false;

    async function fetchStats() {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Use Next.js API route proxy to avoid CORS issues
        const url = `/api/datasets/${datasetId}/stats?max_preview_rows=${maxPreviewRows}`;
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Failed to fetch stats: ${response.statusText}`,
          );
        }

        const data: DatasetStatsResponse = await response.json();

        if (cancelled) return;

        setState({
          stats: data.statistics,
          isLoading: false,
          error: null,
          cached: data.cached,
        });
      } catch (err) {
        console.error("Failed to fetch dataset stats:", err);
        if (cancelled) return;

        setState({
          stats: null,
          isLoading: false,
          error: err instanceof Error ? err.message : "Failed to load statistics",
          cached: false,
        });
      }
    }

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, [datasetId, maxPreviewRows, enabled]);

  return state;
}
