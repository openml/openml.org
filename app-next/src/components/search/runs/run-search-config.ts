import OpenMLSearchConnector from "@/services/OpenMLSearchConnector";

const apiConnector = new OpenMLSearchConnector("run");

/**
 * Run Search Configuration
 */

const runConfig = {
  apiConnector: apiConnector,
  alwaysSearchOnInitialLoad: true,
  trackUrlState: false, // Next.js owns the URL via SearchBar
  searchQuery: {
    resultsPerPage: 20,
    search_fields: {
      uploader: { weight: 2 },
      flow_name: { weight: 3 },
    },
    result_fields: {
      run_id: { raw: {} },
      uploader: { raw: {} },
      uploader_id: { raw: {} },
      date: { raw: {} },
      error_message: { raw: {} },
      error: { raw: {} },

      // Use NESTED fields (these are what actually exist in ES)
      "run_flow.flow_id": { raw: {} },
      "run_flow.name": { raw: {} },
      "run_task.task_id": { raw: {} },
      "run_task.tasktype.name": { raw: {} },
      "run_task.source_data.data_id": { raw: {} },
      "run_task.source_data.name": { raw: {} },

      // Evaluation metrics
      evaluations: { raw: {} },

      // Engagement metrics
      nr_of_likes: { raw: {} },
      nr_of_downloads: { raw: {} },
      nr_of_issues: { raw: {} },
      nr_of_downvotes: { raw: {} },
    },
    disjunctiveFacets: ["uploader.keyword"],
    facets: {
      "uploader.keyword": { type: "value", size: 50 },
    },
  },
  initialState: {
    resultsPerPage: 20,
    sortList: [{ field: "date", direction: "desc" }], // Default: Most Recent
  },
};

export default runConfig;

// wip
