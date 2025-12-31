import { Task } from "@/types/task";
import { notFound } from "next/navigation";

const ES_URL = "https://www.openml.org/es";
const ES_INDEX = "task";

export async function fetchTask(id: string): Promise<Task> {
  try {
    const response = await fetch(`${ES_URL}/${ES_INDEX}/_doc/${id}`, {
      next: {
        revalidate: 3600, // Cache for 1 hour
        tags: [`task-${id}`],
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      console.error(
        `[TaskAPI] 404 Not Found for ID: "${id}". URL: ${ES_URL}/${ES_INDEX}/_doc/${id}`,
      );
      notFound();
    }

    if (!response.ok) {
      console.error(`Failed to fetch task ${id}:`, response.statusText);
      throw new Error(`Failed to fetch task: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.found || !data._source) {
      notFound();
    }

    return data._source as Task;
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);

    if (error instanceof Error && error.message === "NEXT_NOT_FOUND") {
      throw error;
    }

    throw new Error("Failed to load task");
  }
}

export async function fetchTaskRunCount(taskId: string): Promise<number> {
  try {
    const response = await fetch(`${ES_URL}/run/_search`, {
      method: "POST",
      next: {
        revalidate: 1800, // Cache for 30 minutes
        tags: [`task-${taskId}-runs`],
      },
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          term: {
            "run_task.task_id": taskId,
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

export async function fetchTaskDatasetName(
  datasetId: number,
): Promise<string | null> {
  try {
    const response = await fetch(`${ES_URL}/data/_doc/${datasetId}`, {
      next: {
        revalidate: 3600,
        tags: [`dataset-${datasetId}`],
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data._source?.name || null;
  } catch (error) {
    console.error("Error fetching dataset name:", error);
    return null;
  }
}

interface ElasticsearchHit {
  _source: {
    task_id: number;
  };
}

export async function getPopularTaskIds(
  limit: number = 100,
): Promise<string[]> {
  try {
    const response = await fetch(`${ES_URL}/${ES_INDEX}/_search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sort: [{ runs: { order: "desc" } }],
        size: limit,
        _source: ["task_id"],
      }),
    });

    if (!response.ok) {
      console.error("Error fetching popular tasks:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.hits.hits.map((hit: ElasticsearchHit) =>
      hit._source.task_id.toString(),
    );
  } catch (error) {
    console.error("Error fetching popular tasks:", error);
    return [];
  }
}
