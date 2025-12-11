import OpenMLSearchConnector from "@/services/OpenMLSearchConnector";

const apiConnector = new OpenMLSearchConnector("user");

/**
 * User Search Configuration
 */

const userConfig = {
  apiConnector: apiConnector,
  alwaysSearchOnInitialLoad: true,
  trackUrlState: true,
  urlPushDebounceLength: 500,
  searchQuery: {
    resultsPerPage: 20,
    search_fields: {
      username: { weight: 3 },
      first_name: { weight: 3 },
      last_name: { weight: 3 },
      bio: { weight: 2 },
      affiliation: { weight: 2 },
      country: { weight: 1 },
    },
    result_fields: {
      user_id: { raw: {} },
      username: { raw: {} },
      first_name: { raw: {} },
      last_name: { raw: {} },
      bio: { snippet: { size: 150, fallback: true } },
      image: { raw: {} },
      affiliation: { raw: {} },
      country: { raw: {} },
      date: { raw: {} },
      datasets_uploaded: { raw: {} },
      flows_uploaded: { raw: {} },
      tasks_uploaded: { raw: {} },
      runs_uploaded: { raw: {} },
      downloads_received_data: { raw: {} },
      downloads_received_flow: { raw: {} },
      likes_received_data: { raw: {} },
      likes_received_flow: { raw: {} },
    },
    disjunctiveFacets: ["country.keyword", "affiliation.keyword"],
    facets: {
      "country.keyword": { type: "value", size: 50 },
      "affiliation.keyword": { type: "value", size: 50 },
    },
  },
  initialState: {
    resultsPerPage: 20,
    sortList: [{ field: "date", direction: "desc" }],
  },
};

export default userConfig;
