import { NextResponse } from "next/server";
import axios from "axios";

const ELASTICSEARCH_SERVER =
  process.env.ELASTICSEARCH_SERVER ||
  process.env.NEXT_PUBLIC_ELASTICSEARCH_SERVER ||
  "https://www.openml.org/es";

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
  // Ensure URL ends with /
  const baseUrl = ELASTICSEARCH_SERVER.endsWith("/")
    ? ELASTICSEARCH_SERVER
    : `${ELASTICSEARCH_SERVER}/`;
  const elasticsearchEndpoint = `${baseUrl}_msearch`;
  const indices = ["data", "task", "flow", "run", "study", "measure"];

  console.log("🔍 [Count API] Elasticsearch URL:", elasticsearchEndpoint);
  // console.log("📦 [Count API] Indices:", indices);

  // Build NDJSON body for _msearch - correct format
  // For datasets (data index), only count active ones per team leader request
  let requestBody = "";
  indices.forEach((index) => {
    if (index === "data") {
      // Only count active datasets
      requestBody += `{ "index": "${index}" }\n{ "size": 0, "query": { "term": { "status.keyword": "active" } } }\n`;
    } else {
      requestBody += `{ "index": "${index}" }\n{ "size": 0 }\n`;
    }
  });

  const startTime = Date.now();

  try {
    // console.log("⏳ [Count API] Sending request...");

    const response = await axios.post(elasticsearchEndpoint, requestBody, {
      headers: { "Content-Type": "application/x-ndjson" },
      timeout: 30000, // 30 second timeout
    });

    const duration = Date.now() - startTime;
    // console.log(`✅ [Count API] Success in ${duration}ms`);

    // Extract counts safely
    const counts = response.data.responses.map(
      (r: ElasticsearchResponse, i: number) => ({
        index: indices[i],
        count:
          typeof r.hits.total === "number" ? r.hits.total : r.hits.total.value,
      }),
    );

    // console.log("📊 [Count API] Counts:", counts);
    return NextResponse.json(counts);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [Count API] Failed after ${duration}ms`);
    console.error("Error details:", error);

    if (axios.isAxiosError(error)) {
      console.error("Axios error code:", error.code);
      console.error("Axios error message:", error.message);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
