import Connector from "../services/SearchAPIConnector";
const apiConnector = new Connector("flow");

const searchConfig = {
  apiConnector: apiConnector,
  alwaysSearchOnInitialLoad: true,
  searchQuery: {
    resultsPerPage: 100,
    search_fields: {
      name: { weight: 3 },
      exact_name: { weight: 3 },
      description: { weight: 3 },
      full_description: { weight: 3 },
      "tags.tag": { weight: 3 },
      "parameters.full_name": { weight: 3 },
      "parameters.description": { weight: 3 },
      uploader: { weight: 2 },
      installation_notes: { weight: 1 },
      dependencies: { weight: 1 },
      licence: { weight: 1 },
    },
    result_fields: {
      contributor: { raw: {} },
      creator: { raw: {} },
      flow_id: { raw: {} },
      date: { raw: {} },
      name: {
        snippet: {
          size: 100,
          fallback: true,
        },
      },
      description: {
        snippet: {
          size: 100,
          fallback: true,
        },
      },
      full_description: {
        snippet: {
          size: 100,
          fallback: true,
        },
      },
      installation_notes: {
        snippet: {
          size: 100,
          fallback: true,
        },
      },
      licence: { raw: {} },
      nr_of_likes: { raw: {} },
      nr_of_downloads: { raw: {} },
      runs: { raw: {} },
      status: { raw: {} },
      tags: { raw: {} },
      total_downloads: { raw: {} },
      uploader: { raw: {} },
      uploader_id: { raw: {} },
      url: { raw: {} },
      visibility: { raw: {} },
      dependencies: { raw: {} },
      version: { raw: {} },
      suggest: { raw: {} },
    },
    disjunctiveFacets: ["dependencies"],
    facets: {
      "dependencies.keyword": { type: "value", size: 50 },
    },
    group: {
      //This doesn't work yet. TODO: figure out how to group.
      field: { name: { raw: {} } },
    },
  },
  initialState: {
    sortList: [{ field: "runs", direction: "desc" }],
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 100,
      result_fields: {
        // specify the fields you want from the index to display the results
        name: { snippet: { size: 100, fallback: true } },
        url: { raw: {} },
      },
      search_fields: {
        // specify the fields you want to search on
        name: {},
      },
    },
  },
};

export default searchConfig;
