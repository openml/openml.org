import type { Flow } from "@/types/flow";

/**
 * Fetch a single flow by ID from Elasticsearch
 */
export async function getFlow(id: number): Promise<Flow | null> {
  try {
    const response = await fetch(`https://www.openml.org/es/flow/_doc/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch flow: ${response.statusText}`);
    }

    const data = await response.json();
    return data._source as Flow;
  } catch (error) {
    console.error(`Error fetching flow ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch run count for a flow
 */
export async function fetchFlowRunCount(flowId: number): Promise<number> {
  try {
    const response = await fetch(`https://www.openml.org/es/run/_count`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          term: { "run_flow.flow_id": flowId },
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch run count");
    }

    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error("Error fetching flow run count:", error);
    return 0;
  }
}

/**
 * Fetch other versions of a flow by name
 */
export async function fetchFlowVersions(name: string): Promise<Flow[]> {
  try {
    const response = await fetch(`https://www.openml.org/es/flow/_search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          term: { "name.keyword": name },
        },
        sort: [{ version: { order: "desc" } }],
        size: 50,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch flow versions");
    }

    const data = await response.json();
    return data.hits.hits.map((hit: any) => hit._source as Flow);
  } catch (error) {
    console.error("Error fetching flow versions:", error);
    return [];
  }
}
