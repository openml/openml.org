import { NextRequest, NextResponse } from "next/server";

// Use environment variable to toggle between dev proxy and production ES
const USE_DEV_PROXY = process.env.USE_DEV_PROXY === "true" || true; // Default to true for development

const ELASTICSEARCH_SERVER = USE_DEV_PROXY
  ? "http://localhost:3001/proxy/"
  : process.env.NEXT_PUBLIC_URL_ELASTICSEARCH || "https://www.openml.org/es/";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { indexName, esQuery } = body;

    if (!indexName || !esQuery) {
      return NextResponse.json(
        { error: "Missing indexName or esQuery" },
        { status: 400 },
      );
    }

    const url = `${ELASTICSEARCH_SERVER}${indexName}/_search`;

    console.log("🔍 [ES Proxy] Search request for index:", indexName);
    console.log("📡 [ES Proxy] Endpoint:", url);
    console.log("🔧 [ES Proxy] Using dev proxy:", USE_DEV_PROXY);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(esQuery),
    });

    console.log("📡 [ES Proxy] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "❌ [ES Proxy] Elasticsearch request failed:",
        response.status,
        errorText,
      );

      return NextResponse.json(
        {
          error: "Elasticsearch request failed",
          status: response.status,
          message: errorText,
          hint: USE_DEV_PROXY
            ? "Dev proxy is enabled. Make sure server-proxy is running on port 3001 (cd server-proxy && node server.js)"
            : "Direct ES connection failed. Try enabling dev proxy by setting USE_DEV_PROXY=true in .env.local",
        },
        { status: 500 },
      );
    }

    const data = await response.json();
    console.log(
      "✅ [ES Proxy] Search completed. Total hits:",
      data.hits?.total?.value || data.hits?.total || 0,
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ [ES Proxy] Error:", error.message);
    return NextResponse.json(
      {
        error: "Error fetching from Elasticsearch",
        details: error.message,
        hint: USE_DEV_PROXY
          ? "Dev proxy is enabled. Make sure server-proxy is running on port 3001"
          : "Check your Elasticsearch connection",
      },
      { status: 500 },
    );
  }
}
