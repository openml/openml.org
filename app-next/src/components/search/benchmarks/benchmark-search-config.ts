import OpenMLSearchConnector from "@/services/OpenMLSearchConnector";

const apiConnector = new OpenMLSearchConnector("benchmark");

/**
 * Benchmark Search Configuration
 */

const benchmarkConfig = {
  apiConnector: apiConnector,
  alwaysSearchOnInitialLoad: true,
  trackUrlState: true,
  urlPushDebounceLength: 500,
  searchQuery: {
    resultsPerPage: 20,
    search_fields: {
      name: { weight: 3 },
      description: { weight: 2 },
      // Add other benchmark-specific search fields
    },
    result_fields: {
      benchmark_id: { raw: {} },
      name: { raw: {} },
      description: { snippet: { size: 200, fallback: true } },
      uploader: { raw: {} },
      uploader_id: { raw: {} },
      date: { raw: {} },
      nr_of_tasks: { raw: {} },
      // Add other fields you want to display
    },
    disjunctiveFacets: [
      // TODO: Add benchmark-specific facets
    ],
    facets: {
      // TODO: Define facets based on your benchmark index structure
    },
  },
  initialState: {
    resultsPerPage: 20,
    sortList: [{ field: "date", direction: "desc" }],
  },
};

export default benchmarkConfig;
