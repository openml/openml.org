/**
 * 📚 LEARNING: Server-Side Data Fetching in Next.js 15
 *
 * WHY SERVER-SIDE:
 * - SEO: Search engines get fully rendered HTML with data
 * - Performance: No loading spinners, instant content
 * - Security: API keys stay on server
 * - Caching: Can leverage Next.js caching strategies
 *
 * PATTERN: async/await functions that can be called from Server Components
 */

import { Dataset } from "@/types/dataset";
import { notFound } from "next/navigation";

const ES_URL = "https://www.openml.org/es";
const ES_INDEX = "data";

/**
 * 🎯 Fetch a single dataset by ID (Server-Side)
 *
 * CONCEPTS:
 * - Uses Next.js fetch with caching
 * - Throws notFound() for 404s (Next.js will show 404 page)
 * - Validates response structure
 *
 * CACHING STRATEGY:
 * - revalidate: 3600 = Cache for 1 hour, then revalidate in background
 * - tags: Allows on-demand revalidation (e.g., when dataset is updated)
 *
 * @param id - Dataset ID
 * @returns Dataset object
 * @throws notFound() if dataset doesn't exist
 */
export async function fetchDataset(id: string): Promise<Dataset> {
  try {
    // 📚 LEARNING: Next.js extended fetch()
    // Next.js enhances fetch() with caching and revalidation
    const response = await fetch(`${ES_URL}/${ES_INDEX}/_doc/${id}`, {
      next: {
        revalidate: 3600, // Cache for 1 hour
        tags: [`dataset-${id}`], // Tag for on-demand revalidation
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Handle 404 - dataset doesn't exist
    if (response.status === 404) {
      notFound(); // Next.js will show 404 page
    }

    // Handle other errors
    if (!response.ok) {
      console.error(`Failed to fetch dataset ${id}:`, response.statusText);
      throw new Error(`Failed to fetch dataset: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.found || !data._source) {
      notFound();
    }

    return data._source as Dataset;
  } catch (error) {
    // Log error for debugging (server-side only)
    console.error(`Error fetching dataset ${id}:`, error);

    // Re-throw notFound() errors
    if (error instanceof Error && error.message === "NEXT_NOT_FOUND") {
      throw error;
    }

    // For other errors, throw generic error
    // You could create custom error pages for different error types
    throw new Error("Failed to load dataset");
  }
}

/**
 * 🎯 Fetch related tasks for a dataset (Parallel fetching example)
 *
 * CONCEPTS:
 * - Can be called in parallel with fetchDataset()
 * - Uses Elasticsearch aggregation to get task counts
 *
 * @param datasetId - Dataset ID
 * @returns Number of tasks using this dataset
 */
export async function fetchDatasetTaskCount(
  datasetId: string,
): Promise<number> {
  try {
    const response = await fetch(`${ES_URL}/task/_search`, {
      method: "POST",
      next: {
        revalidate: 1800, // Cache for 30 minutes
        tags: [`dataset-${datasetId}-tasks`],
      },
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          term: {
            "source_data.data_id": datasetId,
          },
        },
        size: 0, // We only want the count
      }),
    });

    if (!response.ok) {
      console.error("Failed to fetch task count:", response.statusText);
      return 0; // Return 0 on error (non-critical data)
    }

    const data = await response.json();
    return data.hits?.total?.value || 0;
  } catch (error) {
    console.error("Error fetching task count:", error);
    return 0; // Fail gracefully
  }
}

/**
 * 🎯 Fetch runs count for a dataset
 *
 * @param datasetId - Dataset ID
 * @returns Number of runs on this dataset
 */
export async function fetchDatasetRunCount(datasetId: string): Promise<number> {
  try {
    const response = await fetch(`${ES_URL}/run/_search`, {
      method: "POST",
      next: {
        revalidate: 1800,
        tags: [`dataset-${datasetId}-runs`],
      },
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          nested: {
            path: "input_data",
            query: {
              term: {
                "input_data.data.data_id": datasetId,
              },
            },
          },
        },
        size: 0,
      }),
    });

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    return data.hits?.total?.value || 0;
  } catch (error) {
    console.error("Error fetching run count:", error);
    return 0;
  }
}

/**
 * 📚 LEARNING: Parallel Data Fetching Pattern
 *
 * WHY: Fetch multiple things at once instead of waterfall
 * - Faster total load time
 * - Better user experience
 *
 * USAGE:
 * ```typescript
 * const [dataset, taskCount, runCount] = await Promise.all([
 *   fetchDataset(id),
 *   fetchDatasetTaskCount(id),
 *   fetchDatasetRunCount(id)
 * ]);
 * ```
 */

/**
 * 🎯 Generate static parameters for ISR
 *
 * CONCEPTS:
 * - ISR (Incremental Static Regeneration)
 * - Pre-generate top N datasets at build time
 * - Generate others on-demand (first request)
 *
 * BENEFITS:
 * - Popular datasets load instantly (pre-rendered)
 * - Long-tail datasets still work (on-demand)
 * - Automatic revalidation keeps data fresh
 *
 * @returns Array of dataset IDs to pre-generate
 */
interface ElasticsearchHit {
  _source: {
    data_id: number;
  };
}

export async function getPopularDatasetIds(
  limit: number = 100,
): Promise<string[]> {
  try {
    const response = await fetch(`${ES_URL}/${ES_INDEX}/_search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          term: {
            status: "active",
          },
        },
        sort: [{ runs: { order: "desc" } }],
        size: limit,
        _source: ["data_id"],
      }),
    });

    if (!response.ok) {
      console.error("Error fetching popular datasets:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.hits.hits.map((hit: ElasticsearchHit) =>
      hit._source.data_id.toString(),
    );
  } catch (error) {
    console.error("Error fetching popular datasets:", error);
    return [];
  }
}
