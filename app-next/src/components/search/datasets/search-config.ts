import OpenMLSearchConnector from "@/services/OpenMLSearchConnector";

const apiConnector = new OpenMLSearchConnector("data");

/**
 * Dataset Search Configuration
 *
 * URL FORMAT (Backward Compatible):
 * - Sort: /datasets?sort[0][field]=runs&sort[0][direction]=desc
 * - Filters: /datasets?status=active&license=Public
 *
 * Future SEO-friendly format (commented for future migration):
 * - Sort: /datasets?sortField=runs&sortDirection=desc
 * - Filters: Same as current
 */

const dataConfig = {
  apiConnector: apiConnector,
  alwaysSearchOnInitialLoad: true,
  trackUrlState: false, // Next.js owns the URL via SearchBar
  // urlPushDebounceLength: 500, // Not needed when trackUrlState is false
  searchQuery: {
    resultsPerPage: 20,
    search_fields: {
      name: { weight: 3 },
      exact_name: { weight: 3 },
      description: { weight: 3 },
      "tags.tag": { weight: 3 },
      uploader: { weight: 2 },
      format: { weight: 1 },
      licence: { weight: 1 },
      status: { weight: 1 },
    },
    result_fields: {
      contributor: { raw: {} },
      creator: { raw: {} },
      data_id: { raw: {} },
      date: { raw: {} },
      name: { snippet: { size: 100, fallback: true } },
      format: { raw: {} },
      description: { snippet: { size: 100, fallback: true } },
      "qualities.NumberOfInstances": { raw: {} },
      "qualities.NumberOfFeatures": { raw: {} },
      "qualities.NumberOfClasses": { raw: {} },
      licence: { raw: {} },
      nr_of_likes: { raw: {} },
      nr_of_downloads: { raw: {} },
      runs: { raw: {} },
      status: { raw: {} },
      version: { raw: {} },
    },
    disjunctiveFacets: [
      "status.keyword",
      "licence.keyword",
      "qualities.NumberOfInstances",
      "qualities.NumberOfFeatures",
      "qualities.NumberOfClasses",
      "format",
    ],
    facets: {
      "status.keyword": { type: "value", size: 30 },
      "licence.keyword": { type: "value", size: 30 },
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
      "qualities.NumberOfFeatures": {
        type: "range",
        ranges: [
          { from: 0, to: 10, name: "Less than 10" },
          { from: 10, to: 100, name: "10s" },
          { from: 100, to: 1000, name: "100s" },
          { from: 1000, to: 10000, name: "1000s" },
          { from: 10000, name: "10000s" },
        ],
      },
      "qualities.NumberOfClasses": {
        type: "range",
        ranges: [
          { from: 0, to: 2, name: "Regression" },
          { from: 2, to: 2, name: "Binary Classification" },
          { from: 2, name: "Multi-class" },
        ],
      },
      format: { type: "value", size: 30 },
    },
  },
  initialState: {
    resultsPerPage: 20,
    sortList: [{ field: "date", direction: "desc" }],
    // Default filter: only show active datasets
    filters: [
      {
        field: "status.keyword",
        values: ["active"],
        type: "any",
      },
    ],
  },
};

export default dataConfig;
