import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const connector = new ElasticsearchAPIConnector({
  host: "https://es.openml.org/",
  index: "user",
  apiKey: "",
});

export default async function handler(req, res) {
  const { requestState, queryConfig } = req.body;
  //console.log("Received queryConfig:", queryConfig);

  const response = await connector.onSearch(requestState, queryConfig);
  //console.log("Elasticsearch response:", response);

  res.json(response);
}
