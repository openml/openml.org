import Connector from "../services/SearchAPIConnector";
const apiConnector = new Connector("run");

const searchConfig = {
  apiConnector: apiConnector,
  alwaysSearchOnInitialLoad: true,
  searchQuery: {
    resultsPerPage: 100,
    search_fields: {
      "run_task.tasktype.name": { weight: 3 },
      "run_task.source_data.name": { weight: 3 },
      "run_flow.name": { weight: 3 },
      "tags.tag": { weight: 3 },
      uploader: { weight: 2 },
    },
    result_fields: {
      uploader: { raw: {} },
      run_task: { raw: {} },
      run_flow: { raw: {} },
      evaluations: { raw: {} },
      date: { raw: {} },
    },
    disjunctiveFacets: [
      "run_task.source_data.name",
      "run_task.tasktype.name",
      "run_flow.name",
    ],
    facets: {
      "run_task.source_data.name.keyword": { type: "value" },
      "run_task.tasktype.name.keyword": { type: "value" },
      "run_flow.name": { type: "value" },
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
