import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const connector = new ElasticsearchAPIConnector({
  host: "https://es.openml.org/",
  index: "data,flow,task,run,user",
  apiKey: "",
});

export default async function handler(req, res) {
  const { requestState, queryConfig } = req.body;
  const response = await connector.onAutocomplete(requestState, queryConfig);
  console.log(response);
  res.json(response);
}
