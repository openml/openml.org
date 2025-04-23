import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const connectorsCache = {};

// Set to true if you want to use the dev proxy
// This requires starting server-proxy app with `node server.js`
const use_dev_proxy = false;

export default async function handler(req, res) {
  const { requestState, queryConfig, indexName } = req.body;

  if (!connectorsCache[indexName]) {
    connectorsCache[indexName] = new ElasticsearchAPIConnector({
      host: use_dev_proxy
        ? "http://localhost:3001/proxy"
        : "https://www.openml.org/es/",
      index: indexName,
      apiKey: "",
    });
  }

  //This runs server-side, so the output appears in the terminal
  //console.log("OnSearch", indexName, requestState, queryConfig);
  const response = await connectorsCache[indexName].onSearch(
    requestState,
    queryConfig,
  );
  //console.log(response);
  res.json(response);
}
