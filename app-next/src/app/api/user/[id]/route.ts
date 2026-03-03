import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const ELASTICSEARCH_SERVER = "https://es.openml.org/";
const USER_INDEX = "user";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Query ElasticSearch for user by ID
    const esQuery = {
      query: {
        term: {
          user_id: id,
        },
      },
      size: 1,
    };

    const url = `${ELASTICSEARCH_SERVER}${USER_INDEX}/_search`;
    const response = await axios.post(url, esQuery, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });

    const hits = response.data.hits?.hits || [];

    if (hits.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = hits[0]._source;

    return NextResponse.json(user);
  } catch (error) {
    console.error("❌ [User API] Error:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 },
    );
  }
}
