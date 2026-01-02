import OpenMLSearchConnector from "@/services/OpenMLSearchConnector";

const apiConnector = new OpenMLSearchConnector("flow");

/**
 * Flow Search Configuration
 */

const flowConfig = {
  apiConnector: apiConnector,
  alwaysSearchOnInitialLoad: true,
  trackUrlState: false, // Next.js owns the URL via SearchBar
  // urlPushDebounceLength: 500, // Not needed when trackUrlState is false
  searchQuery: {
    resultsPerPage: 20,
    search_fields: {
      name: { weight: 3 },
      description: { weight: 2 },
      uploader: { weight: 1 },
      // Add other flow-specific search fields
    },
    result_fields: {
      flow_id: { raw: {} },
      name: { raw: {} },
      description: { snippet: { size: 200, fallback: true } },
      uploader: { raw: {} },
      uploader_id: { raw: {} },
      version: { raw: {} },
      date: { raw: {} },
      runs: { raw: {} },
      nr_of_likes: { raw: {} },
      nr_of_downloads: { raw: {} },
      status: { raw: {} },
      // Add other fields you want to display
    },
    disjunctiveFacets: ["dependencies.keyword"],
    facets: {
      "dependencies.keyword": { type: "value", size: 50 },
    },
  },
  initialState: {
    resultsPerPage: 20,
    sortList: [{ field: "date", direction: "desc" }],
  },
};

export default flowConfig;
