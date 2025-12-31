"use server";

export async function searchRuns(body: any) {
  try {
    const response = await fetch("https://www.openml.org/es/run/_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`ES Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Server Action searchRuns error:", error);
    throw new Error("Failed to search runs");
  }
}
export async function fetchTopRuns(
  taskId: string,
  metric: string,
  limit: number = 20,
  order: "asc" | "desc" = "desc",
) {
  try {
    // OpenML REST API supports sorting by metric (function) efficiently
    const url = `https://www.openml.org/api/v1/json/evaluation/list/task/${taskId}/function/${metric}/limit/${limit}/sort_order/${order}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) return { evaluations: { evaluation: [] } };
      throw new Error(`REST API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchTopRuns error:", error);
    return { evaluations: { evaluation: [] } };
  }
}
