import OpenMLSearchConnector from "@/services/OpenMLSearchConnector";

const apiConnector = new OpenMLSearchConnector("task");

/**
 * Task Search Configuration
 *
 * Tasks define ML problem setups on datasets:
 * - Task Type (classification, regression, etc.)
 * - Target feature
 * - Estimation procedure (cross-validation, holdout, etc.)
 * - Evaluation measures
 */

const taskConfig = {
  apiConnector: apiConnector,
  alwaysSearchOnInitialLoad: true,
  trackUrlState: false, // Next.js owns the URL via SearchBar
  // urlPushDebounceLength: 500, // Not needed when trackUrlState is false
  searchQuery: {
    resultsPerPage: 20,
    search_fields: {
      "source_data.name": { weight: 3 },
      "tasktype.name": { weight: 2 },
      "estimation_procedure.type": { weight: 1 },
    },
    result_fields: {
      task_id: { raw: {} },
      task_type_id: { raw: {} },
      task_type: { raw: {} },
      "source_data.data_id": { raw: {} },
      "source_data.name": { raw: {} },
      "tasktype.name": { raw: {} },
      "estimation_procedure.type": { raw: {} },
      target_feature: { raw: {} },
      evaluation_measures: { raw: {} },
      runs: { raw: {} },
      nr_of_likes: { raw: {} },
      nr_of_downloads: { raw: {} },
    },
    disjunctiveFacets: [
      "tasktype.name.keyword",
      "estimation_procedure.type.keyword",
      "target_feature.keyword",
    ],
    facets: {
      "tasktype.name.keyword": { type: "value", size: 30 },
      "estimation_procedure.type.keyword": { type: "value", size: 30 },
      "target_feature.keyword": { type: "value", size: 30 },
    },
  },
  initialState: {
    resultsPerPage: 20,
    sortList: [{ field: "date", direction: "desc" }],
  },
};

export default taskConfig;
