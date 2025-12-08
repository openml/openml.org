/**
 * Elasticsearch Connection Test API
 *
 * Tests if we can reach Elasticsearch
 * Navigate to: http://localhost:3001/api/test-es
 */

export default async function handler(req, res) {
  try {
    console.log("🧪 Testing Elasticsearch connection...");

    const esUrl = "https://www.openml.org/es/";

    // Test 1: Can we reach ES?
    const response = await fetch(esUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log("✅ Elasticsearch reachable:", {
      status: response.status,
      clusterName: data.cluster_name,
      version: data.version?.number,
    });

    // Test 2: Can we query the data index?
    const searchUrl = `${esUrl}data/_search`;
    const searchResponse = await fetch(searchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        size: 5,
        query: {
          match_all: {},
        },
      }),
    });

    const searchData = await searchResponse.json();

    console.log("✅ Search test results:", {
      status: searchResponse.status,
      totalHits: searchData.hits?.total?.value || searchData.hits?.total || 0,
      firstResult: searchData.hits?.hits?.[0]?._source?.name || "No results",
    });

    return res.status(200).json({
      success: true,
      elasticsearch: {
        reachable: true,
        url: esUrl,
        clusterName: data.cluster_name,
        version: data.version?.number,
      },
      search: {
        indexName: "data",
        totalHits: searchData.hits?.total?.value || searchData.hits?.total || 0,
        sampleResults:
          searchData.hits?.hits?.slice(0, 3).map((hit) => ({
            id: hit._source.data_id,
            name: hit._source.name,
          })) || [],
      },
    });
  } catch (error) {
    console.error("❌ Elasticsearch test failed:", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      suggestion: "Check if Elasticsearch is accessible from your server",
    });
  }
}
