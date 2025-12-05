import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const connectorsCache = {};

// Set to true if you want to use the dev proxy
// This requires starting server-proxy app with `node server.js`
const use_dev_proxy = true;

export default async function handler(req, res) {
  try {
    const { requestState, queryConfig, indexName } = req.body;

    if (!indexName) {
      return res.status(400).json({ error: "Index name is required" });
    }

    const esHost = use_dev_proxy
      ? "http://localhost:3001/proxy"
      : "https://www.openml.org/es/";

    console.log("Connecting to:", esHost, "Index:", indexName);

    if (!connectorsCache[indexName]) {
      connectorsCache[indexName] = new ElasticsearchAPIConnector({
        host: esHost,
        index: indexName,
        apiKey: "",
      });
    }

    //This runs server-side, so the output appears in the terminal
    console.log("OnSearch", indexName, requestState, queryConfig);
    const response = await connectorsCache[indexName].onSearch(
      requestState,
      queryConfig,
    );
    console.log("Search response:", response);
    res.json(response);
  } catch (error) {
    console.error("Search API error:", error);
    res.status(500).json({
      error: "Search failed",
      message: error.message,
      details: error.toString(),
      hint: use_dev_proxy
        ? "Dev proxy is enabled. Make sure server-proxy is running on port 3001 (npm run dev from server-proxy directory)"
        : "Direct ES connection failed. The endpoint may be returning HTML. Try enabling dev proxy.",
    });
  }
}
