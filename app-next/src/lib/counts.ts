import axios from "axios";

const ELASTICSEARCH_SERVER =
  process.env.NEXT_PUBLIC_URL_ELASTICSEARCH || "https://openml.org/es/";

export async function fetchEntityCounts() {
  const indices = ["data", "task", "flow", "run", "study", "measure"];
  const elasticsearchEndpoint = `${ELASTICSEARCH_SERVER}/_msearch`;

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
