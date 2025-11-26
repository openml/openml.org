/**
 * Dataset Search Configuration
 *
 * Ported from /app/src/search_configs/dataConfig.js
 * Defines search behavior, fields, weights, facets, and aggregations
 */

import { OpenMLSearchConnector } from "../openml-search-connector";

const apiConnector = new OpenMLSearchConnector("data");

const datasetSearchConfig = {
  apiConnector,
  alwaysSearchOnInitialLoad: true,
  searchQuery: {
    resultsPerPage: 100,
    search_fields: {
      name: { weight: 3 },
      exact_name: { weight: 3 },
      description: { weight: 3 },
      "tags.tag": { weight: 3 },
      uploader: { weight: 2 },
      format: { weight: 1 },
      licence: { weight: 1 },
      status: { weight: 1 },
      error_message: { weight: 1 },
      default_className_attribute: { weight: 1 },
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
      "qualities.NumberOfclassNamees": { raw: {} },
      "qualities.NumberOfMissingValues": { raw: {} },
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
    disjunctiveFacets: [
      "status",
      "licence",
      "qualities.NumberOfInstances",
      "qualities.NumberOfFeatures",
      "qualities.NumberOfclassNamees",
      "format",
    ],
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
      "qualities.NumberOfclassNamees": {
        type: "range",
        ranges: [
          { from: 0, to: 2, name: "Regression" },
          { from: 2, to: 2, name: "Binary classNameification" },
          { from: 2, name: "Multi-className" },
        ],
      },
      format: { type: "value" },
    },
  },
  initialState: {
    sortList: [{ field: "runs", direction: "desc" }],
  },
  autocompleteQuery: {
    search_fields: {
      name: {},
    },
    result_fields: {
      name: { snippet: { size: 100, fallback: true } },
      url: { raw: {} },
    },
  },
};

export default datasetSearchConfig;
