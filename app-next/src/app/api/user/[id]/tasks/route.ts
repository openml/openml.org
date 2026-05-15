import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const ELASTICSEARCH_SERVER = "https://es.openml.org/";
const TASK_INDEX = "task";

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
    const sort = searchParams.get("sort") || "date_desc";

    const sortMap: Record<string, object[]> = {
      date_desc: [{ date: { order: "desc" } }],
      runs_desc: [{ runs: { order: "desc" } }],
      name_asc: [{ "name.keyword": { order: "asc" } }],
    };

    const esQuery = {
      query: {
        term: {
          uploader_id: id,
        },
      },
      sort: sortMap[sort] ?? sortMap["date_desc"],
      from: (page - 1) * size,
      size: size,
    };

    const url = `${ELASTICSEARCH_SERVER}${TASK_INDEX}/_search`;
    const response = await axios.post(url, esQuery, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });

    const hits = (response.data.hits?.hits || []) as ElasticsearchHit[];
    const totalHits = response.data.hits?.total;
    const total =
      typeof totalHits === "object" ? totalHits.value : totalHits || 0;

    const tasks = hits.map((hit) => hit._source);

    return NextResponse.json({
      tasks,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    });
  } catch (error) {
    console.error("❌ [User Tasks API] Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch user tasks" },
      { status: 500 },
    );
  }
}
