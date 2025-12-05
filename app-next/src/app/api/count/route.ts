import { NextResponse } from "next/server";

// Use environment variable for Elasticsearch server, fallback to production URL
const ELASTICSEARCH_SERVER =
  process.env.ELASTICSEARCH_SERVER || "https://www.openml.org/es/";

export async function GET() {
  const elasticsearchEndpoint = `${ELASTICSEARCH_SERVER}_msearch`;
  const indices = ["data", "task", "flow", "run", "study", "measure"];

  // Multi-search body to count all indices at once
  let requestBody = "";
  indices.forEach((index) => {
    requestBody += `{ "index": "${index}" }\n{ "size": 0 }\n`;
  });

  console.log("🔍 /api/count: Fetching counts from Elasticsearch");
  console.log("📡 Endpoint:", elasticsearchEndpoint);

  try {
    const response = await fetch(elasticsearchEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-ndjson" },
      body: requestBody,
    });

    console.log("📡 Elasticsearch response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "❌ Elasticsearch request failed:",
        response.status,
        errorText,
      );
      throw new Error(`Elasticsearch request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📊 Elasticsearch response received");

    // Extract counts for each index
    const counts = data.responses.map((r: any, i: number) => ({
      index: indices[i],
      count: r.hits.total.value || r.hits.total,
    }));

    console.log("✅ Counts calculated:", counts);
    return NextResponse.json(counts);
  } catch (error) {
    console.error("❌ Error fetching counts from Elasticsearch:", error);
    console.error(
      "❌ Error details:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Error fetching counts from Elasticsearch",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
