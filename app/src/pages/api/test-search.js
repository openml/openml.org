/**
 * Simple Search Test API
 *
 * Tests search without using the Elasticsearch connector library
 * Navigate to: http://localhost:3001/api/test-search
 */

export default async function handler(req, res) {
  try {
    console.log("🧪 Testing simple search...");

    const esUrl = "https://www.openml.org/es/data/_search";

    const searchBody = {
      from: 0,
      size: 20,
      query: {
        match_all: {},
      },
      sort: [{ runs: { order: "desc" } }],
    };

    console.log("📤 Sending query:", JSON.stringify(searchBody, null, 2));

    const response = await fetch(esUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchBody),
    });

    if (!response.ok) {
      throw new Error(`ES returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("✅ Search successful:", {
      totalHits: data.hits?.total?.value || data.hits?.total || 0,
      returnedHits: data.hits?.hits?.length || 0,
    });

    // Format results to match Search UI format
    const results = data.hits.hits.map((hit) => ({
      id: { raw: hit._source.data_id },
      data_id: { raw: hit._source.data_id },
      name: { raw: hit._source.name },
      description: { raw: hit._source.description },
      status: { raw: hit._source.status },
      // Add more fields as needed
    }));

    return res.status(200).json({
      success: true,
      rawQuery: searchBody,
      totalResults: data.hits?.total?.value || data.hits?.total || 0,
      resultsCount: results.length,
      results: results.slice(0, 5), // Just first 5 for testing
      sampleResult: results[0],
    });
  } catch (error) {
    console.error("❌ Simple search failed:", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}
