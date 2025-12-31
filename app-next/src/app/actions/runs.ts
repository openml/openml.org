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
