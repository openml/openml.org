import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const connectorsCache = {};
const use_dev_proxy = false;

export default async function handler(req, res) {
  try {
    const { requestState, queryConfig, indexName } = req.body;

    // Enhanced logging
    console.log("🔍 /api/search called:", {
      indexName,
      hasRequestState: !!requestState,
      hasQueryConfig: !!queryConfig,
      searchTerm: requestState?.searchTerm,
      filters: requestState?.filters,
    });

    if (!indexName || !requestState) {
      console.error("❌ Missing required fields:", {
        indexName,
        hasRequestState: !!requestState,
      });
      return res.status(400).json({
        error: "Missing required fields",
        details: {
          indexName: !!indexName,
          requestState: !!requestState,
        },
      });
    }

    if (!connectorsCache[indexName]) {
      console.log(
        "📦 Creating new Elasticsearch connector for index:",
        indexName,
      );
      try {
        connectorsCache[indexName] = new ElasticsearchAPIConnector({
          host: use_dev_proxy
            ? "http://localhost:3001/proxy"
            : "https://www.openml.org/es/",
          index: indexName,
          apiKey: "",
        });
        console.log("✅ Connector created successfully");
      } catch (connectorError) {
        console.error("❌ Failed to create connector:", connectorError);
        throw new Error(
          `Failed to create Elasticsearch connector: ${connectorError.message}`,
        );
      }
    }

    // Add timeout
    console.log("🔎 Executing search...");
    const searchPromise = connectorsCache[indexName].onSearch(
      requestState,
      queryConfig,
    );

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Search request timeout after 10s")),
        10000,
      ),
    );

    const response = await Promise.race([searchPromise, timeoutPromise]);

    // Log successful response
    console.log("✅ Search successful:", {
      resultsCount: response?.results?.length || 0,
      totalResults: response?.totalResults || 0,
      hasResults: !!response?.results,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error in /api/search:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({
      error: error.message,
      type: error.name,
      details: "Check server logs for more information",
    });
  }
}
