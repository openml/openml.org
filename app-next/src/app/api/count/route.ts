import { NextResponse } from "next/server";

const ELASTICSEARCH_SERVER =
  process.env.ELASTICSEARCH_SERVER || "https://www.openml.org/es/";

interface ElasticsearchHits {
  total: number | { value: number; relation?: string };
}

interface ElasticsearchResponse {
  hits: ElasticsearchHits;
}

interface MultiSearchResponse {
  responses: ElasticsearchResponse[];
}

export async function GET() {
  const elasticsearchEndpoint = `${ELASTICSEARCH_SERVER}_msearch`;
  const indices = ["data", "task", "flow", "run", "study", "measure"];

  // Build NDJSON body for _msearch - correct format
  let requestBody = "";
  indices.forEach((index) => {
    requestBody += `{ "index": "${index}" }\n{ "size": 0 }\n`;
  });

  try {
    const response = await fetch(elasticsearchEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-ndjson" },
      body: requestBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Elasticsearch request failed:",
        response.status,
        errorText,
      );
      return NextResponse.json(
        { error: "Failed to query Elasticsearch", details: errorText },
        { status: 502 },
      );
    }

    // Only parse JSON if response is OK
    const data = (await response.json()) as MultiSearchResponse;

    // Extract counts safely
    const counts = data.responses.map((r, i) => ({
      index: indices[i],
      count:
        typeof r.hits.total === "number" ? r.hits.total : r.hits.total.value,
    }));

    return NextResponse.json(counts);
  } catch (error) {
    console.error("Error fetching counts from Elasticsearch:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
