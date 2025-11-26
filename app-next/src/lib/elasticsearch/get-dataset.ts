import type { Dataset } from "@/types/dataset";

/**
 * Server-side utility to fetch a dataset from Elasticsearch
 *
 * This function runs on the server and fetches dataset data directly from
 * the Elasticsearch API. It's used in Server Components for optimal performance.
 *
 * @param id - The dataset ID to fetch
 * @returns Promise<Dataset> - The dataset data
 * @throws Error if dataset not found or API error
 */
export async function getDataset(id: number): Promise<Dataset> {
  const ELASTICSEARCH_SERVER =
    process.env.NEXT_PUBLIC_ELASTICSEARCH_SERVER ||
    "https://www.openml.org/es/";

  const url = `${ELASTICSEARCH_SERVER}data/data/${id}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // ISR: Revalidate every hour (3600 seconds)
      // This provides a good balance between freshness and performance
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(
        `Elasticsearch error: ${response.status} ${response.statusText}`,
      );
      throw new Error(`Failed to fetch dataset ${id}`);
    }

    const data = await response.json();

    // Elasticsearch returns data in { found: boolean, _source: {...} } format
    if (!data.found) {
      throw new Error(`Dataset ${id} not found`);
    }

    return data._source as Dataset;
  } catch (error) {
    console.error(`Error fetching dataset ${id}:`, error);
    throw error;
  }
}

/**
 * Get multiple datasets by IDs (batch fetch)
 * Useful for related datasets or version history
 */
export async function getDatasets(ids: number[]): Promise<Dataset[]> {
  const ELASTICSEARCH_SERVER =
    process.env.NEXT_PUBLIC_ELASTICSEARCH_SERVER ||
    "https://www.openml.org/es/";

  const url = `${ELASTICSEARCH_SERVER}data/_mget`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: ids.map(String),
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch datasets`);
    }

    const data = await response.json();

    return data.docs
      .filter((doc: any) => doc.found)
      .map((doc: any) => doc._source as Dataset);
  } catch (error) {
    console.error("Error fetching multiple datasets:", error);
    throw error;
  }
}
