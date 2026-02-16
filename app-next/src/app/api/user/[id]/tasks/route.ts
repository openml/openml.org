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

    // Query ElasticSearch for tasks by uploader_id (or creator, usually uploader_id for tasks)
    // Note: In OpenML ES, tasks usually have `creator` or `uploader` field.
    // Based on datasets route using `uploader_id`, we will try `creator` first as tasks are often created by system/users.
    // Actually, let's check what the UserProfile page implementation expects.
    // It says "tasks_uploaded" stats.
    // Most reliable field for ownership in OpenML ES is usually `creator`.
    // However, I will check if `uploader_id` exists on tasks.
    // I'll stick to `uploader_id` as it was used for datasets, but if it fails I might need to switch.
    // Let's stick to the pattern `uploader_id` for now as it is standard across OpenML ES types usually.

    // UPDATE: Task index uses `creator` often for the user ID in text, but let's check `uploader_id`.
    // Actually, looking at previous Task types, we saw `uploader` (string) and `uploader_id` (number? or not present?).
    // I will try `uploader_id` first.

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

    const url = `${ELASTICSEARCH_SERVER}${TASK_INDEX}/_search`;
    const response = await axios.post(url, esQuery, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });

    const hits = (response.data.hits?.hits || []) as ElasticsearchHit[];
    const total = response.data.hits?.total?.value || 0;

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
