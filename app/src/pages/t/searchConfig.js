import Connector from "../../services/SearchAPIConnector";
const apiConnector = new Connector("task");

const searchConfig = {
  apiConnector: apiConnector,
  alwaysSearchOnInitialLoad: true,
  searchQuery: {
    resultsPerPage: 100,
    search_fields: {
      description: {},
    },
    result_fields: {
      creator: { raw: {} },
      task_id: { raw: {} },
      date: { raw: {} },
      tasktype: { raw: {} },
      source_data: { raw: {} },
      target_feature: { raw: {} },
      target_values: { raw: {} },
      estimation_procedure: { raw: {} },
      evaluation_measures: { raw: {} },
    },
    disjunctiveFacets: ["tasktype"],
    facets: {
      "tasktype.name.keyword": { type: "value" },
    },
    group: {
      //This doesn't work yet. TODO: figure out how to group.
      field: { name: { raw: {} } },
    },
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 100,
      result_fields: {
        // specify the fields you want from the index to display the results
        name: { snippet: { size: 100, fallback: true } },
        url: { raw: {} },
      },
      search_fields: {
        // specify the fields you want to search on
        name: {},
      },
    },
  },
};

export default searchConfig;
