import { APP_CONFIG } from "@/lib/config";

/** Ensure a value that may be a single item or undefined becomes an array. */
function normalizeArray<T>(value: T[] | T | undefined | null): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Run data as returned by the OpenML REST API (/api/v1/json/run/{id}).
 * This differs from the Elasticsearch-indexed shape in src/types/run.ts.
 */
export interface RunDetail {
  run_id: number;
  uploader?: string;
  uploader_id?: number;
  upload_time?: string;
  flow_id?: number;
  flow_name?: string;
  task_id?: number;
  task?: {
    task_id?: number;
    task_type?: string;
    source_data?: {
      data_id?: number;
      name?: string;
    };
  };
  visibility?: string;
  error_message?: string | null;
  tag?: string[];
  parameter_setting?: Array<{
    name: string;
    value: string | number | boolean | null;
  }>;
  output_data?: {
    evaluation?: Array<{
      name: string;
      value: string | number;
      stdev?: string | number;
      array_data?: Record<string, string | number>;
      per_fold?: Array<number | number[]>;
    }>;
  };
  nr_of_likes?: number;
  nr_of_downloads?: number;
  nr_of_issues?: number;
  nr_of_downvotes?: number;
  setup_string?: string;
}

interface RunApiResponse {
  run?: RunDetail;
  error?: { code: string; message: string };
}

/**
 * Fetch a single run by ID from the OpenML REST API.
 * Returns `{ run, error }` — never throws.
 */
export async function getRun(
  runId: number,
): Promise<{ run: RunDetail | null; error: string | null }> {
  try {
    const apiUrl = APP_CONFIG.urlApi || "https://www.openml.org/api/v1";
    const response = await fetch(`${apiUrl}/json/run/${runId}`, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { run: null, error: `Run #${runId} not found` };
      }
      return {
        run: null,
        error: `Failed to fetch run: HTTP ${response.status}`,
      };
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return { run: null, error: "Invalid response format from API" };
    }

    const data: RunApiResponse = await response.json();

    if (data.error) {
      return { run: null, error: data.error.message || "Unknown API error" };
    }

    // The OpenML XML→JSON API collapses single-element arrays to plain
    // values.  Normalize array fields so callers can rely on .length.
    if (data.run) {
      data.run.tag = normalizeArray(data.run.tag);
      data.run.parameter_setting = normalizeArray(data.run.parameter_setting);
      if (data.run.output_data) {
        data.run.output_data.evaluation = normalizeArray(
          data.run.output_data.evaluation,
        );

        // The API returns both summary rows (no repeat/fold) and per-fold
        // rows (with repeat + fold) under the same name. Merge per-fold
        // values into each summary entry's `per_fold` array and discard
        // the individual fold rows so every name is unique.
        const rawEvals = data.run.output_data.evaluation as Array<
          Record<string, unknown>
        >;
        const summaryMap = new Map<
          string,
          (typeof data.run.output_data.evaluation)[number]
        >();
        const foldValues = new Map<string, number[]>();

        for (const ev of rawEvals) {
          const name = ev.name as string;
          if (ev.repeat != null || ev.fold != null) {
            // Per-fold row — collect the value
            const arr = foldValues.get(name) ?? [];
            arr.push(
              typeof ev.value === "number"
                ? ev.value
                : parseFloat(String(ev.value)),
            );
            foldValues.set(name, arr);
          } else {
            // Summary row — keep as the canonical entry
            summaryMap.set(
              name,
              ev as (typeof data.run.output_data.evaluation)[number],
            );
          }
        }

        // Attach per-fold arrays to their summary entries
        for (const [name, folds] of foldValues) {
          const summary = summaryMap.get(name);
          if (summary) {
            summary.per_fold = folds;
          }
        }

        // Parse array_data JSON strings into objects
        for (const ev of summaryMap.values()) {
          if (typeof ev.array_data === "string") {
            try {
              const parsed = JSON.parse(ev.array_data as string);
              if (Array.isArray(parsed)) {
                // Convert array [0.5, 0.8] into { "class_0": 0.5, "class_1": 0.8 }
                const obj: Record<string, number> = {};
                parsed.forEach((v: number, i: number) => {
                  obj[`class_${i}`] = v;
                });
                ev.array_data = obj;
              } else if (typeof parsed === "object" && parsed !== null) {
                ev.array_data = parsed;
              }
            } catch {
              // Leave as-is if not valid JSON
            }
          }
        }

        data.run.output_data.evaluation = Array.from(summaryMap.values());
      }
    }

    return { run: data.run || null, error: null };
  } catch (error) {
    console.error("Failed to fetch run:", error);
    return { run: null, error: "Failed to connect to OpenML API" };
  }
}
