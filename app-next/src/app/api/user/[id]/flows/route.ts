import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getElasticsearchUrl } from "@/lib/elasticsearch";

interface ElasticsearchHit {
  _source: Record<string, unknown>;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const size = parseInt(searchParams.get("size") || "10");

    // console.log(
    //   `🔍 [User Flows API] Fetching flows for user ${id}, page ${page}`,
    // );

    // Query ElasticSearch for flows by uploader_id
    const esQuery = {
      query: {
        term: {
          uploader_id: id,
        },
      },
      sort: [{ date: { order: "desc" } }],
      from: (page - 1) * size,
      size: size,
    };

    const url = getElasticsearchUrl("flow/_search");
    const response = await axios.post(url, esQuery, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });

    const hits = (response.data.hits?.hits || []) as ElasticsearchHit[];
    const total = response.data.hits?.total?.value || 0;

    const flows = hits.map((hit) => hit._source);

    // console.log(
    //   `✅ [User Flows API] Found ${flows.length} flows (${total} total)`,
    // );

    return NextResponse.json({
      flows,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    });
  } catch (error) {
    console.error("❌ [User Flows API] Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch user flows" },
      { status: 500 },
    );
  }
}
