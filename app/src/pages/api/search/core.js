import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const connector = new ElasticsearchAPIConnector({
  host: "https://k8ses.openml.org/",
  index: "user",
  apiKey: "",
});

export default async function handler(req, res) {
  const { requestState, queryConfig } = req.body;
  const response = await connector.onSearch(requestState, queryConfig);
  res.json(response);
}

const tc_ids = [1, 2, 27, 86, 348, 970];
const core_ids = [1, 2, 27, 86, 348, 970, 1140, 869, 8111, 9186, 3744];
const active_ids = [10700, 5348, 2902, 8309, 3744];
const contributor_ids = [1478, 5341];

const coreConfig = {
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true,
  searchQuery: {
    search_fields: {
      name: {
        weight: 3,
      },
      description: {},
    },
    result_fields: {
      user_id: { raw: {} },
      first_name: { raw: {} },
      last_name: { raw: {} },
      bio: { raw: {} },
      image: { raw: {} },
    },
    query: {
      terms: { user_id: core_ids.concat(active_ids).concat(contributor_ids) },
    },
  },
};
