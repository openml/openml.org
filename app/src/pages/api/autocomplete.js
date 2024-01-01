import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const connectorsCache = {};

export default async function handler(req, res) {
  const { requestState, queryConfig, indexName } = req.body;

  if (!connectorsCache[indexName]) {
    connectorsCache[indexName] = new ElasticsearchAPIConnector({
      host: "https://es.openml.org/",
      index: indexName,
      apiKey: "",
    });
  }

  //This runs server-side, so the output appears in the terminal
  console.log("OnAutoComplete", indexName, requestState, queryConfig);
  const response = await connectorsCache[indexName].onAutocomplete(
    requestState,
    queryConfig,
  );
  console.log(response);
  res.json(response);
}
