import OpenMLSearchConnector from "@/services/OpenMLSearchConnector";

const apiConnector = new OpenMLSearchConnector("run");

/**
 * Run Search Configuration
 *
 * Runs are experiment executions that link flows and tasks
 */

const runConfig = {
  apiConnector: apiConnector,
  alwaysSearchOnInitialLoad: true,
  trackUrlState: false,
  searchQuery: {
    resultsPerPage: 20,
    search_fields: {
      "run_flow.name": { weight: 3 },
      "run_task.source_data.name": { weight: 2 },
      uploader: { weight: 1 },
    },
    result_fields: {
      run_id: { raw: {} },
      uploader: { raw: {} },
      uploader_id: { raw: {} },
      date: { raw: {} },
      error_message: { raw: {} },
      error: { raw: {} },
      "run_flow.flow_id": { raw: {} },
      "run_flow.name": { raw: {} },
      flow_id: { raw: {} },
      flow_name: { raw: {} },
      "run_task.task_id": { raw: {} },
      "run_task.tasktype.name": { raw: {} },
      task_id: { raw: {} },
      "run_task.source_data.data_id": { raw: {} },
      "run_task.source_data.name": { raw: {} },
      evaluations: { raw: {} },
      nr_of_likes: { raw: {} },
      nr_of_downloads: { raw: {} },
      nr_of_issues: { raw: {} },
      nr_of_downvotes: { raw: {} },
    },
    disjunctiveFacets: ["uploader.keyword"],
    facets: {
      "uploader.keyword": { type: "value", size: 30 },
    },
  },
  initialState: {
    resultsPerPage: 20,
    sortList: [{ field: "date", direction: "desc" }],
  },
};

export default runConfig;
