import Connector from "../../utils/SearchAPIConnector";
const apiConnector = new Connector("data");

const searchConfig = {
  apiConnector: apiConnector,
  alwaysSearchOnInitialLoad: true,
  searchQuery: {
    search_fields: {
      name: {
        weight: 3,
      },
      description: {},
    },
    result_fields: {
      contributor: { raw: {} },
      creator: { raw: {} },
      data_id: { raw: {} },
      date: { raw: {} },
      name: {
        snippet: {
          size: 100,
          fallback: true,
        },
      },
      format: { raw: {} },
      description: {
        snippet: {
          size: 100,
          fallback: true,
        },
      },
      "qualities.NumberOfInstances": { raw: {} },
      "qualities.NumberOfFeatures": { raw: {} },
      "qualities.NumberOfClasses": { raw: {} },
      "qualities.NumberOfMissingValues": { raw: {} },
      "qualities.NumberOfClasses": { raw: {} },
      last_update: { raw: {} },
      licence: { raw: {} },
      nr_of_likes: { raw: {} },
      nr_of_downloads: { raw: {} },
      row_id_attribute: { raw: {} },
      runs: { raw: {} },
      status: { raw: {} },
      tags: { raw: {} },
      total_downloads: { raw: {} },
      update_comment: { raw: {} },
      uploader: { raw: {} },
      uploader_id: { raw: {} },
      url: { raw: {} },
      version: { raw: {} },
      version_label: { raw: {} },
      visibility: { raw: {} },
      suggest: { raw: {} },
    },
    disjunctiveFacets: ["status", "licence", "qualities.NumberOfInstances"],
    facets: {
      "status.keyword": { type: "value" },
      "name.keyword": { type: "value" },
      "licence.keyword": { type: "value" },
      "qualities.NumberOfInstances": {
        type: "range",
        ranges: [
          { from: 0, to: 999, name: "100s" },
          { from: 1000, to: 9999, name: "1000s" },
          { from: 10000, to: 99999, name: "10000s" },
          { from: 100000, to: 999999, name: "100000s" },
          { from: 1000000, name: "Millions" },
        ],
      },
    },
    group: {
      //This doesn't work yet. TODO: figure out how to group.
      field: { name: { raw: {} } },
    },
  },
  //This doesn't work yet.
  initialState: { searchTerm: "", sort: { field: "date" } },
};

export default searchConfig;
