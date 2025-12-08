import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Direct connection to Elasticsearch - works server-side without CORS issues
const ELASTICSEARCH_SERVER = "https://es.openml.org/";

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { indexName, esQuery } = body;

    console.log("🔍 [ES Proxy] Request for index:", indexName);

    if (!indexName || !esQuery) {
      return NextResponse.json(
        { error: "Missing indexName or esQuery" },
        { status: 400 },
      );
    }

    const url = `${ELASTICSEARCH_SERVER}${indexName}/_search`;
    console.log("⏳ [ES Proxy] Sending to:", url);

    const response = await axios.post(url, esQuery, {
      headers: { "Content-Type": "application/json" },
      timeout: 30000, // 30 second timeout
    });

    const duration = Date.now() - startTime;
    console.log(
      `✅ [ES Proxy] Success in ${duration}ms - ${response.data.hits?.total?.value || 0} results`,
    );

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
