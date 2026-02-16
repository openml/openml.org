import OpenMLSearchConnector from "@/services/OpenMLSearchConnector";

/**
 * Benchmark Search Configuration
 *
 * Benchmarks use the ES "study" index (same as collections).
 * In the legacy app, benchmarks are differentiated by name wildcards
 * (*benchmark*, *suite*). Here we use the same study_type filter
 * since all benchmark suites are typed as "task" or "run".
 */
export function createBenchmarkConfig(studyType: "task" | "run") {
  const apiConnector = new OpenMLSearchConnector("study");

  return {
    apiConnector,
    alwaysSearchOnInitialLoad: true,
    trackUrlState: false,
    searchQuery: {
      resultsPerPage: 20,
      search_fields: {
        name: { weight: 3 },
        description: { weight: 2 },
        uploader: { weight: 1 },
      },
      result_fields: {
        study_id: { raw: {} },
        study_type: { raw: {} },
        name: { snippet: { size: 200, fallback: true } },
        description: { snippet: { size: 200, fallback: true } },
        uploader: { raw: {} },
        uploader_id: { raw: {} },
        date: { raw: {} },
        datasets_included: { raw: {} },
        tasks_included: { raw: {} },
        flows_included: { raw: {} },
        runs_included: { raw: {} },
      },
      disjunctiveFacets: ["uploader.keyword"],
      facets: {
        "uploader.keyword": { type: "value", size: 20 },
      },
    },
    initialState: {
      resultsPerPage: 20,
      sortList: [
        {
          field: studyType === "task" ? "tasks_included" : "runs_included",
          direction: "desc" as const,
        },
      ],
      filters: [
        {
          field: "study_type",
          values: [studyType],
          type: "any" as const,
        },
      ],
    },
  };
}

const benchmarkConfig = createBenchmarkConfig("task");
export default benchmarkConfig;
