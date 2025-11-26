import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const ELASTICSEARCH_SERVER =
  process.env.NEXT_PUBLIC_URL_ELASTICSEARCH || "https://openml.org/es/";

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

    const response = await axios.post(url, esQuery, {
      headers: { "Content-Type": "application/json" },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("ES Proxy Error:", error.message);
    return NextResponse.json(
      {
        error: "Error fetching from Elasticsearch",
        details: error.message,
        esError: error.response?.data,
      },
      { status: 500 },
    );
  }
}
