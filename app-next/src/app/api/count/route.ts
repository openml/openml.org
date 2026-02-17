import { NextResponse } from "next/server";
import axios from "axios";
import {
  getElasticsearchUrl,
  ELASTICSEARCH_INDICES,
} from "@/lib/elasticsearch";

export async function GET() {
  const elasticsearchEndpoint = getElasticsearchUrl("_msearch");
  const indices = ELASTICSEARCH_INDICES.filter(
    (i) => i !== "user" && i !== "benchmark",
  );

  // console.log("🔍 [Count API] Elasticsearch URL:", elasticsearchEndpoint);
  // console.log("📦 [Count API] Indices:", indices);

  // Build NDJSON body for _msearch - correct format
  // For datasets (data index), only count active ones per team leader request
  let requestBody = "";
  indices.forEach((index) => {
    if (index === "data") {
      // Only count active datasets
      requestBody += `{ "index": "${index}" }\n{ "size": 0, "query": { "term": { "status.keyword": "active" } } }\n`;
    } else {
      requestBody += `{ "index": "${index}" }\n{ "size": 0 }\n`;
    }
  });

  // Add study_type breakdown queries for collections/benchmarks sidebar counts
  const extraLabels: string[] = [];
  requestBody += `{ "index": "study" }\n{ "size": 0, "query": { "term": { "study_type": "task" } } }\n`;
  extraLabels.push("study_task");
  requestBody += `{ "index": "study" }\n{ "size": 0, "query": { "term": { "study_type": "run" } } }\n`;
  extraLabels.push("study_run");

  // Add measure_type breakdown queries for measures sidebar counts
  requestBody += `{ "index": "measure" }\n{ "size": 0, "query": { "term": { "measure_type": "data_quality" } } }\n`;
  extraLabels.push("measure_data_quality");
  requestBody += `{ "index": "measure" }\n{ "size": 0, "query": { "term": { "measure_type": "evaluation_measure" } } }\n`;
  extraLabels.push("measure_evaluation");
  requestBody += `{ "index": "measure" }\n{ "size": 0, "query": { "term": { "measure_type": "estimation_procedure" } } }\n`;
  extraLabels.push("measure_procedure");

  const startTime = Date.now();

  try {
    // console.log("⏳ [Count API] Sending request...");

    const response = await axios.post(elasticsearchEndpoint, requestBody, {
      headers: { "Content-Type": "application/x-ndjson" },
      timeout: 30000, // 30 second timeout
    });

    const duration = Date.now() - startTime;
    // console.log(`✅ [Count API] Success in ${duration}ms`);

    // Extract counts safely
    const allLabels = [...indices, ...extraLabels];
    const counts = response.data.responses.map((r: any, i: number) => ({
      index: allLabels[i],
      count:
        typeof r.hits.total === "number" ? r.hits.total : r.hits.total.value,
    }));

    // console.log("📊 [Count API] Counts:", counts);
    return NextResponse.json(counts);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [Count API] Failed after ${duration}ms`);
    console.error("Error details:", error);

    if (axios.isAxiosError(error)) {
      console.error("Axios error code:", error.code);
      console.error("Axios error message:", error.message);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
