import { NextRequest, NextResponse } from "next/server";
import { getElasticsearchUrl } from "@/lib/elasticsearch";

/**
 * GET /api/study/:id/datasets?page=1&limit=20&q=search
 *
 * Fetches the dataset IDs from the OpenML REST API for this study,
 * then returns a paginated slice from Elasticsearch with full details.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const query = searchParams.get("q") || "";
  const sortField = searchParams.get("sort") || "runs";
  const sortDir = searchParams.get("dir") || "desc";

  // 1. Fetch study member IDs from REST API (cached)
  const studyRes = await fetch(
    `https://www.openml.org/api/v1/json/study/${id}`,
    { next: { revalidate: 3600 } },
  );

  if (!studyRes.ok) {
    return NextResponse.json(
      { error: "Study not found" },
      { status: 404 },
    );
  }

  const studyJson = await studyRes.json();
  const allIds: string[] = studyJson.study?.data?.data_id || [];

  if (allIds.length === 0) {
    return NextResponse.json({ results: [], total: 0, page, limit });
  }

  // 2. Build ES query — filter by IDs + optional text search
  const must: Record<string, unknown>[] = [
    { ids: { values: allIds } },
  ];
  if (query) {
    must.push({
      multi_match: {
        query,
        fields: ["name^3", "description"],
        type: "best_fields",
      },
    });
  }

  const esUrl = getElasticsearchUrl("data/_search");
  const esRes = await fetch(esUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: { bool: { must } },
      _source: [
        "data_id", "name", "version", "description", "format", "status", "date",
        "qualities.NumberOfInstances", "qualities.NumberOfFeatures",
        "qualities.NumberOfClasses",
        "runs", "nr_of_likes", "nr_of_downloads", "uploader",
      ],
      from: (page - 1) * limit,
      size: limit,
      sort: query
        ? [{ _score: { order: "desc" } }]
        : [{ [sortField]: { order: sortDir } }],
    }),
    next: { revalidate: 300 },
  });

  if (!esRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch datasets" },
      { status: 500 },
    );
  }

  const esData = await esRes.json();
  const results = (esData.hits?.hits || []).map(
    (hit: { _source: Record<string, unknown> }) => hit._source,
  );
  const total = esData.hits?.total?.value ?? esData.hits?.total ?? 0;

  return NextResponse.json({ results, total, page, limit });
}
