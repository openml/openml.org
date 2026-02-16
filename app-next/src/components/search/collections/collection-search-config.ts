import OpenMLSearchConnector from "@/services/OpenMLSearchConnector";

const apiConnector = new OpenMLSearchConnector("collection");

/**
 * Collection Search Configuration
 */

const collectionConfig = {
  apiConnector: apiConnector,
  alwaysSearchOnInitialLoad: true,
  trackUrlState: true,
  urlPushDebounceLength: 500,
  searchQuery: {
    resultsPerPage: 20,
    search_fields: {
      name: { weight: 3 },
      description: { weight: 2 },
      // Add other collection-specific search fields
    },
    result_fields: {
      collection_id: { raw: {} },
      name: { raw: {} },
      description: { snippet: { size: 200, fallback: true } },
      uploader: { raw: {} },
      uploader_id: { raw: {} },
      date: { raw: {} },
      nr_of_items: { raw: {} },
      // Add other fields you want to display
    },
    disjunctiveFacets: [
      // TODO: Add collection-specific facets
    ],
    facets: {
      // TODO: Define facets based on your collection index structure
    },
  },
  initialState: {
    resultsPerPage: 20,
    sortList: [{ field: "date", direction: "desc" }],
  },
};

export default collectionConfig;
