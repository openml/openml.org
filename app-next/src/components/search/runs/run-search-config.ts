import OpenMLSearchConnector from "@/services/OpenMLSearchConnector";

const apiConnector = new OpenMLSearchConnector("run");

/**
 * Run Search Configuration
 */

const runConfig = {
  apiConnector: apiConnector,
  alwaysSearchOnInitialLoad: true,
  trackUrlState: true,
  urlPushDebounceLength: 500,
  searchQuery: {
    resultsPerPage: 20,
    search_fields: {
      // TODO: Add run-specific search fields based on your index
      // Example:
      // uploader: { weight: 2 },
      // flow_name: { weight: 1 },
    },
    result_fields: {
      run_id: { raw: {} },
      uploader: { raw: {} },
      uploader_id: { raw: {} },
      flow_id: { raw: {} },
      flow_name: { raw: {} },
      data_id: { raw: {} },
      data_name: { raw: {} },
      task_id: { raw: {} },
      date: { raw: {} },
      // Add other fields you want to display
    },
    disjunctiveFacets: [
      // TODO: Add run-specific facets
    ],
    facets: {
      // TODO: Define facets based on your run index structure
    },
  },
  initialState: {
    resultsPerPage: 20,
    sortList: [{ field: "date", direction: "desc" }],
  },
};

export default runConfig;
