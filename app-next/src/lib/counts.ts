import axios from "axios";
import { getElasticsearchUrl, ELASTICSEARCH_INDICES } from "./elasticsearch";

export async function fetchEntityCounts() {
  const indices = ELASTICSEARCH_INDICES.filter(
    (i) => i !== "user" && i !== "benchmark",
  );
  const elasticsearchEndpoint = getElasticsearchUrl("_msearch");

  let requestBody = "";
  indices.forEach((index) => {
    requestBody += `{ "index": "${index}" }\n{ "size": 0 }\n`;
  });

  try {
    const response = await axios.post(elasticsearchEndpoint, requestBody, {
      headers: { "Content-Type": "application/x-ndjson" },
    });

    const counts: Record<string, number> = {};
    response.data.responses.forEach((r: any, i: number) => {
      counts[indices[i]] = r.hits.total.value || r.hits.total;
    });

    return counts;
  } catch (error) {
    console.error("Error fetching counts:", error);
    return null;
  }
}
