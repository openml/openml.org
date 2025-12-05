import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const connectorsCache = {};
const use_dev_proxy = true;

export default async function handler(req, res) {
  try {
    const { requestState, queryConfig, indexName } = req.body;

    if (!indexName) {
      return res.status(400).json({ error: "Index name is required" });
    }

    const proxyHost = "https://es.openml.org";
    const directHost = "https://www.openml.org/es/";
    const esHost = use_dev_proxy ? proxyHost : directHost;

    console.log("🔍 /api/search called:", {
      indexName,
      host: esHost,
      hasRequestState: !!requestState,
      hasQueryConfig: !!queryConfig,
    });

    if (!connectorsCache[indexName]) {
      console.log("📦 Creating connector for:", indexName);
      connectorsCache[indexName] = new ElasticsearchAPIConnector({
        host: esHost,
        index: indexName,
        apiKey: "",
      });
      console.log("✅ Connector created successfully");
    }

    console.log("🔎 Executing search...");
    const response = await connectorsCache[indexName].onSearch(
      requestState,
      queryConfig,
    );
    console.log("✅ Search successful:", {
      resultsCount: response?.results?.length || 0,
      totalResults: response?.totalResults || 0,
    });
    res.json(response);
  } catch (error) {
    console.error("❌ Error in /api/search:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      error: error.message,
      type: error.name,
      details: "Check server logs for more information",
    });
  }
}
