import { Measure } from "@/types/measure";
import { notFound } from "next/navigation";
import { getElasticsearchUrl } from "@/lib/elasticsearch";

const ES_INDEX = "measure";

export async function fetchMeasure(id: string): Promise<Measure> {
  try {
    const response = await fetch(
      getElasticsearchUrl(`${ES_INDEX}/_doc/${id}`),
      {
        next: {
          revalidate: 3600,
          tags: [`measure-${id}`],
        },
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 404) {
      notFound();
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch measure: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.found || !data._source) {
      notFound();
    }

    return data._source as Measure;
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_NOT_FOUND") {
      throw error;
    }
    throw new Error("Failed to load measure");
  }
}

interface RelatedTask {
  task_id: number;
  task_type: string;
  task_type_id: number;
  source_data?: {
    data_id?: number;
    name?: string;
  };
  runs?: number;
}

export async function fetchRelatedTasks(
  measureName: string,
): Promise<RelatedTask[]> {
  try {
    const response = await fetch(getElasticsearchUrl("task/_search"), {
      method: "POST",
      next: {
        revalidate: 3600,
        tags: [`measure-tasks-${measureName}`],
      },
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          term: {
            "evaluation_measures.keyword": measureName,
          },
        },
        _source: [
          "task_id",
          "task_type",
          "task_type_id",
          "source_data",
          "runs",
        ],
        size: 50,
        sort: [{ runs: { order: "desc" } }],
      }),
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return (data.hits?.hits || []).map(
      (hit: { _source: RelatedTask }) => hit._source,
    );
  } catch (error) {
    console.error("Error fetching related tasks:", error);
    return [];
  }
}
