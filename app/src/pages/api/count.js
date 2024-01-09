import axios from "axios";
const ELASTICSEARCH_SERVER = "https://www.openml.org/es/";

export default async function handler(req, res) {
  const elasticsearchEndpoint = `${ELASTICSEARCH_SERVER}/_msearch`;
  const indices = ["data", "task", "flow", "run", "study", "measure"];

  // Prepare the multi-search body
  let requestBody = "";
  indices.forEach((index) => {
    requestBody += `{ "index": "${index}" }\n{ "size": 0 }\n`;
  });

  try {
    const response = await axios.post(elasticsearchEndpoint, requestBody, {
      headers: { "Content-Type": "application/x-ndjson" },
    });

    // Extract counts for each index
    const counts = response.data.responses.map((r, i) => ({
      index: indices[i],
      count: r.hits.total.value || r.hits.total, // Adjust based on Elasticsearch version
    }));

    console.log(counts);
    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching counts from Elasticsearch" });
  }
}
