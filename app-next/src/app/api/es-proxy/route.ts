import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getElasticsearchUrl } from "@/lib/elasticsearch";

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { indexName, esQuery } = body;

    if (!indexName || !esQuery) {
      return NextResponse.json(
        { error: "Missing indexName or esQuery" },
        { status: 400 },
      );
    }

    const url = getElasticsearchUrl(`${indexName}/_search`);

    const response = await axios.post(url, esQuery, {
      headers: { "Content-Type": "application/json" },
      timeout: 30000, // 30 second timeout
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    console.error(`❌ [ES Proxy] Failed after ${duration}ms`);

    if (axios.isAxiosError(error)) {
      console.error("Axios error code:", error.code);
      console.error("Axios error message:", error.message);
      console.error("Response status:", error.response?.status);
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ [ES Proxy] Error:", errorMessage);
    return NextResponse.json(
      {
        error: "Error fetching from Elasticsearch",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
