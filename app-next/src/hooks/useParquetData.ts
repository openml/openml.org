"use client";

import { useState, useEffect } from "react";
import { tableFromIPC, Table } from "apache-arrow";

// Maximum file size to load in browser (5MB)
const MAX_PARQUET_SIZE = 5 * 1024 * 1024;

// Maximum rows to process for visualizations
const MAX_ROWS = 10000;

// Cache for parquet-wasm module to avoid re-initialization
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let parquetWasmModule: any = null;
let wasmInitPromise: Promise<void> | null = null;

/**
 * Initialize parquet-wasm module (singleton)
 * This ensures WASM is only loaded once across all hook instances
 */
async function initParquetWasm() {
  if (parquetWasmModule) return parquetWasmModule;

  if (!wasmInitPromise) {
    wasmInitPromise = (async () => {
      // Use the ESM bundle which works better with Next.js
      const parquetMod = await import("parquet-wasm/esm");

      // Initialize WASM - the default export is the init function
      if (typeof parquetMod.default === "function") {
        await parquetMod.default();
      }

      parquetWasmModule = parquetMod;
    })();
  }

  await wasmInitPromise;
  return parquetWasmModule!;
}

/**
 * Parse ARFF file content into column-oriented data
 */
function parseArff(arffText: string): {
  data: Record<string, (string | number | null)[]>;
  columns: string[];
  rowCount: number;
} {
  const lines = arffText.split("\n").map((l) => l.trim());
  const columns: string[] = [];
  const data: Record<string, (string | number | null)[]> = {};

  let inDataSection = false;
  let rowCount = 0;

  for (const line of lines) {
    // Skip comments and empty lines
    if (line.startsWith("%") || line === "") continue;

    // Parse @ATTRIBUTE lines
    if (line.toUpperCase().startsWith("@ATTRIBUTE")) {
      const match = line.match(/@ATTRIBUTE\s+(\S+)\s+/i);
      if (match) {
        const colName = match[1];
        columns.push(colName);
        data[colName] = [];
      }
    }
    // Start of data section
    else if (line.toUpperCase().startsWith("@DATA")) {
      inDataSection = true;
    }
    // Parse data rows
    else if (inDataSection && line) {
      const values = line.split(",").map((v) => v.trim());
      columns.forEach((col, idx) => {
        if (idx < values.length) {
          const val = values[idx];
          // Try to parse as number, otherwise keep as string
          const numVal = parseFloat(val);
          data[col].push(
            val === "?" || val === "" ? null : isNaN(numVal) ? val : numVal,
          );
        }
      });
      rowCount++;
    }
  }

  return { data, columns, rowCount };
}

/**
 * Generate the parquet URL from a dataset ID
 * Format: https://data.openml.org/datasets/0000/0061/dataset_61.pq
 */
export function getParquetUrl(datasetId: number | string): string {
  const id = Number(datasetId);
  // Calculate the folder path (datasets are organized in groups of 10000)
  const folder = String(Math.floor(id / 10000)).padStart(4, "0");
  const subFolder = String(id).padStart(4, "0");
  return `https://data.openml.org/datasets/${folder}/${subFolder}/dataset_${id}.pq`;
}

/**
 * Get ARFF download URL from dataset URL in metadata
 */
export function getArffUrl(datasetUrl: string | undefined): string | null {
  if (!datasetUrl) return null;
  // Dataset URL format: https://api.openml.org/data/download/{file_id}/dataset
  return datasetUrl;
}

export interface ParquetDataState {
  data: Record<string, (string | number | null)[]> | null;
  columns: string[];
  rowCount: number;
  isLoading: boolean;
  error: string | null;
  isTooLarge: boolean;
}

export interface DistributionData {
  // For numeric features: histogram bins
  bins?: { min: number; max: number; count: number }[];
  // For nominal features: category counts
  categories?: { value: string; count: number }[];
  // For violin plots
  values?: number[];
  stats?: {
    min: number;
    max: number;
    mean: number;
    median: number;
    q1: number;
    q3: number;
    std: number;
  };
}

/**
 * Hook to fetch and parse dataset data from OpenML
 * Tries parquet first, falls back to ARFF for small datasets
 * Only loads data for datasets under MAX_PARQUET_SIZE
 */
export function useParquetData(
  datasetId: number | string | undefined,
  arffUrl?: string,
) {
  const [state, setState] = useState<ParquetDataState>({
    data: null,
    columns: [],
    rowCount: 0,
    isLoading: false,
    error: null,
    isTooLarge: false,
  });

  useEffect(() => {
    if (datasetId === undefined) {
      return;
    }

    let cancelled = false;

    async function fetchData() {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Helper function to try loading ARFF
      async function tryArff(url: string) {
        let arffResponse;
        try {
          arffResponse = await fetch(url);
        } catch (fetchError) {
          // Network error (CORS, offline, etc.) - fail gracefully
          console.warn("ARFF fetch failed (network/CORS):", fetchError);
          setState({
            data: null,
            columns: [],
            rowCount: 0,
            isLoading: false,
            error: null, // Don't show error, just no data preview
            isTooLarge: false,
          });
          return;
        }
        if (!arffResponse.ok) {
          throw new Error(`Failed to fetch ARFF: ${arffResponse.statusText}`);
        }

        const arffText = await arffResponse.text();

        // Check size (approximate - 1 char ≈ 1 byte)
        if (arffText.length > MAX_PARQUET_SIZE) {
          setState({
            data: null,
            columns: [],
            rowCount: 0,
            isLoading: false,
            error: null,
            isTooLarge: true,
          });
          return;
        }

        if (cancelled) return;

        // Parse ARFF
        const parsed = parseArff(arffText);

        // Limit rows
        const limitedData: Record<string, (string | number | null)[]> = {};
        const actualRows = Math.min(parsed.rowCount, MAX_ROWS);

        for (const col of parsed.columns) {
          limitedData[col] = parsed.data[col].slice(0, actualRows);
        }

        setState({
          data: limitedData,
          columns: parsed.columns,
          rowCount: parsed.rowCount,
          isLoading: false,
          error: null,
          isTooLarge: false,
        });
      }

      // Try parquet first
      const parquetUrl = getParquetUrl(datasetId!);

      try {
        // First, check if parquet exists with HEAD request
        let headResponse;
        try {
          headResponse = await fetch(parquetUrl, { method: "HEAD" });
        } catch (fetchError) {
          // Network error - try ARFF fallback or fail gracefully
          console.warn("Parquet HEAD fetch failed (network/CORS):", fetchError);
          if (arffUrl) {
            await tryArff(arffUrl);
          } else {
            setState({
              data: null,
              columns: [],
              rowCount: 0,
              isLoading: false,
              error: null,
              isTooLarge: false,
            });
          }
          return;
        }

        if (headResponse.ok) {
          const contentLength = headResponse.headers.get("content-length");

          if (contentLength && parseInt(contentLength) > MAX_PARQUET_SIZE) {
            // Parquet too large, try ARFF
            if (arffUrl) {
              await tryArff(arffUrl);
            } else {
              setState({
                data: null,
                columns: [],
                rowCount: 0,
                isLoading: false,
                error: null,
                isTooLarge: true,
              });
            }
            return;
          }

          // Fetch the parquet file
          const response = await fetch(parquetUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch parquet: ${response.statusText}`);
          }

          const arrayBuffer = await response.arrayBuffer();

          // Check size again after download
          if (arrayBuffer.byteLength > MAX_PARQUET_SIZE) {
            if (arffUrl) {
              await tryArff(arffUrl);
            } else {
              setState({
                data: null,
                columns: [],
                rowCount: 0,
                isLoading: false,
                error: null,
                isTooLarge: true,
              });
            }
            return;
          }

          if (cancelled) return;

          // Initialize parquet-wasm (uses cached module if already loaded)
          const parquetModule = await initParquetWasm();

          // Read parquet using parquet-wasm
          const parquetBytes = new Uint8Array(arrayBuffer);

          // readParquet returns Arrow IPC bytes (Uint8Array)
          // We need to convert it to an Arrow Table using tableFromIPC
          const ipcBytes = parquetModule.readParquet(parquetBytes);

          // Parse the Arrow IPC bytes into a Table
          const table: Table = tableFromIPC(ipcBytes);

          // Extract column names
          const columns = table.schema.fields.map((f) => f.name);

          // Convert to column-oriented data (limited to MAX_ROWS)
          const rowCount = Math.min(table.numRows, MAX_ROWS);
          const data: Record<string, (string | number | null)[]> = {};

          for (const col of columns) {
            const column = table.getChild(col);
            if (column) {
              data[col] = [];
              for (let i = 0; i < rowCount; i++) {
                const value = column.get(i);
                data[col].push(value);
              }
            }
          }

          if (cancelled) return;

          setState({
            data,
            columns,
            rowCount: table.numRows,
            isLoading: false,
            error: null,
            isTooLarge: false,
          });
        } else {
          // Parquet not found (404), try ARFF
          if (arffUrl) {
            await tryArff(arffUrl);
          } else {
            setState({
              data: null,
              columns: [],
              rowCount: 0,
              isLoading: false,
              error: "No data file available",
              isTooLarge: false,
            });
          }
        }
      } catch (err) {
        if (cancelled) return;

        // Try ARFF as fallback
        if (arffUrl) {
          try {
            await tryArff(arffUrl);
          } catch (arffErr) {
            console.error("ARFF fallback also failed:", arffErr);
            setState({
              data: null,
              columns: [],
              rowCount: 0,
              isLoading: false,
              error: err instanceof Error ? err.message : "Failed to load data",
              isTooLarge: false,
            });
          }
        } else {
          setState({
            data: null,
            columns: [],
            rowCount: 0,
            isLoading: false,
            error: err instanceof Error ? err.message : "Failed to load data",
            isTooLarge: false,
          });
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [datasetId, arffUrl]);

  return state;
}

/**
 * Compute distribution data for a feature from raw values
 */
export function computeDistribution(
  values: (string | number | null)[],
  featureType: "numeric" | "nominal" | "string",
  numBins: number = 20,
): DistributionData {
  // Filter out null/undefined values
  const validValues = values.filter((v) => v !== null && v !== undefined);

  if (validValues.length === 0) {
    return {};
  }

  if (featureType === "numeric") {
    // Numeric feature: compute histogram and stats
    const numericValues = validValues
      .map((v) => (typeof v === "number" ? v : parseFloat(String(v))))
      .filter((v) => !isNaN(v));

    if (numericValues.length === 0) {
      return {};
    }

    // Sort for percentile calculations
    const sorted = [...numericValues].sort((a, b) => a - b);
    const n = sorted.length;

    // Stats
    const min = sorted[0];
    const max = sorted[n - 1];
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const median =
      n % 2 === 0
        ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
        : sorted[Math.floor(n / 2)];
    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];
    const variance =
      sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
    const std = Math.sqrt(variance);

    // Histogram bins
    const binWidth = (max - min) / numBins || 1;
    const bins: { min: number; max: number; count: number }[] = [];

    for (let i = 0; i < numBins; i++) {
      bins.push({
        min: min + i * binWidth,
        max: min + (i + 1) * binWidth,
        count: 0,
      });
    }

    for (const v of numericValues) {
      const binIndex = Math.min(Math.floor((v - min) / binWidth), numBins - 1);
      if (binIndex >= 0 && binIndex < bins.length) {
        bins[binIndex].count++;
      }
    }

    return {
      bins,
      values: numericValues.slice(0, 1000), // Limit values for violin plot
      stats: { min, max, mean, median, q1, q3, std },
    };
  } else {
    // Nominal/string feature: count categories
    const counts: Record<string, number> = {};
    for (const v of validValues) {
      const key = String(v);
      counts[key] = (counts[key] || 0) + 1;
    }

    const categories = Object.entries(counts)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count);

    return { categories };
  }
}

/**
 * Compute distribution data grouped by target feature
 */
export function computeDistributionByTarget(
  values: (string | number | null)[],
  targetValues: (string | number | null)[],
  featureType: "numeric" | "nominal" | "string",
  numBins: number = 20,
): Record<string, DistributionData> {
  // Group values by target
  const groups: Record<string, (string | number | null)[]> = {};

  for (let i = 0; i < values.length; i++) {
    const targetVal = String(targetValues[i] ?? "unknown");
    if (!groups[targetVal]) {
      groups[targetVal] = [];
    }
    groups[targetVal].push(values[i]);
  }

  // Compute distribution for each group
  const result: Record<string, DistributionData> = {};
  for (const [targetVal, groupValues] of Object.entries(groups)) {
    result[targetVal] = computeDistribution(groupValues, featureType, numBins);
  }

  return result;
}
