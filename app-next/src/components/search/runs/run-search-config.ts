import OpenMLSearchConnector from "@/services/OpenMLSearchConnector";

const apiConnector = new OpenMLSearchConnector("run");

/**
 * Run Search Configuration
 *
 * Runs are experiment executions that link flows, tasks, and datasets.
 * Each run represents a single ML experiment with:
 * - A flow (algorithm/pipeline)
 * - A task (problem definition on a dataset)
 * - Evaluation metrics and parameters
 *
 * Facets match the old app: Dataset, Task Type, Flow, Uploader
 */

const runConfig = {
  apiConnector: apiConnector,
  alwaysSearchOnInitialLoad: true,
  trackUrlState: false, // Next.js owns the URL via SearchBar
  searchQuery: {
    resultsPerPage: 20,
    search_fields: {
      "run_flow.name": { weight: 3 },
      "run_task.source_data.name": { weight: 3 },
      "run_task.tasktype.name": { weight: 2 },
      uploader: { weight: 2 },
      "tags.tag": { weight: 1 },
    },
    result_fields: {
      run_id: { raw: {} },
      uploader: { raw: {} },
      uploader_id: { raw: {} },
      date: { raw: {} },
      visibility: { raw: {} },
      error_message: { raw: {} },
      error: { raw: {} },
      // Flow fields - ES returns nested object run_flow
      run_flow: { raw: {} },
      "run_flow.flow_id": { raw: {} },
      "run_flow.name": { raw: {} },
      flow_id: { raw: {} },
      flow_name: { raw: {} },
      // Task fields - ES returns nested object run_task
      run_task: { raw: {} },
      "run_task.task_id": { raw: {} },
      "run_task.tasktype.name": { raw: {} },
      "run_task.source_data.data_id": { raw: {} },
      "run_task.source_data.name": { raw: {} },
      task_id: { raw: {} },
      // Evaluations and metadata
      evaluations: { raw: {} },
      tags: { raw: {} },
      nr_of_likes: { raw: {} },
      nr_of_downloads: { raw: {} },
      nr_of_issues: { raw: {} },
      nr_of_downvotes: { raw: {} },
    },
    disjunctiveFacets: [
      "run_task.source_data.name.keyword",
      "run_task.tasktype.name.keyword",
      "run_flow.name.keyword",
      "uploader.keyword",
    ],
    facets: {
      "run_task.source_data.name.keyword": { type: "value", size: 30 },
      "run_task.tasktype.name.keyword": { type: "value", size: 30 },
      "run_flow.name.keyword": { type: "value", size: 30 },
      "uploader.keyword": { type: "value", size: 30 },
    },
  },
  initialState: {
    resultsPerPage: 20,
    sortList: [{ field: "date", direction: "desc" }],
  },
};

export default runConfig;
