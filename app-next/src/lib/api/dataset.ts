import { Dataset } from "@/types/dataset";
import { notFound } from "next/navigation";

const ES_URL = "https://www.openml.org/es";
const ES_INDEX = "data";

export async function fetchDataset(id: string): Promise<Dataset> {
  try {
    const response = await fetch(`${ES_URL}/${ES_INDEX}/_doc/${id}`, {
      next: {
        revalidate: 3600,
        tags: [`dataset-${id}`],
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      notFound();
    }

    // Handle other errors
    if (!response.ok) {
      console.error(`Failed to fetch dataset ${id}:`, response.statusText);
      throw new Error(`Failed to fetch dataset: ${response.statusText}`);
    }

    const data = await response.json();

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

    throw new Error("Failed to load dataset");
  }
}

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
        size: 0, // Count only
      }),
    });

    if (!response.ok) {
      console.error("Failed to fetch task count:", response.statusText);
      return 0;
    }

    const data = await response.json();
    return data.hits?.total?.value || 0;
  } catch (error) {
    console.error("Error fetching task count:", error);
    return 0;
  }
}

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
