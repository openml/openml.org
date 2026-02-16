"use server";

/**
 * Server action to search runs by flow ID
 */
export async function searchFlowRuns(flowId: number, body: any) {
  try {
    const response = await fetch("https://www.openml.org/es/run/_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        query: {
          ...body.query,
          bool: {
            must: [
              ...(body.query?.bool?.must || []),
              { term: { "run_flow.flow_id": flowId } },
            ],
          },
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`ES Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Server Action searchFlowRuns error:", error);
    throw new Error("Failed to search flow runs");
  }
}
