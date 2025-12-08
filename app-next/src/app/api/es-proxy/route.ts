import { NextRequest, NextResponse } from "next/server";

// Direct connection to Elasticsearch - works server-side without CORS issues
const ELASTICSEARCH_SERVER = "https://es.openml.org/";

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

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(esQuery),
    });

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
        },
        { status: 500 },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: unknown) {
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
