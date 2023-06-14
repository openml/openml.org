import React from "react";
import { useNextRouting } from "../../utils/useNextRouting";

import DashboardLayout from "../../layouts/Dashboard";
import SearchContainer from "../../components/search/SearchContainer";
import searchConfig from "./searchConfig";

const sort_options = [
  {
    name: "Relevance",
    value: [],
  },
  {
    name: "Most runs",
    value: [{ field: "runs", direction: "desc" }],
  },
  {
    name: "Most likes",
    value: [{ field: "nr_of_likes", direction: "desc" }],
  },
  {
    name: "Most downloads",
    value: [{ field: "nr_of_downloads", direction: "desc" }],
  },
  {
    name: "Most recent",
    value: [{ field: "date", direction: "desc" }],
  },
  {
    name: "Most instances",
    value: [{ field: "qualities.NumberOfInstances", direction: "desc" }],
  },
  {
    name: "Most features",
    value: [{ field: "qualities.NumberOfFeatures", direction: "desc" }],
  },
  {
    name: "Most numeric features",
    value: [{ field: "qualities.NumberOfNumericFeatures", direction: "desc" }],
  },
  {
    name: "Most missing value",
    value: [{ field: "qualities.NumberOfMissing values", direction: "desc" }],
  },
  {
    name: "Most classes",
    value: [{ field: "qualities.NumberOfClasses", direction: "desc" }],
  },
];

const search_facets = [
  {
    label: "Status",
    field: "status.keyword",
  },
  {
    label: "Licence",
    field: "licence.keyword",
    show: "10",
  },
  {
    label: "Size",
    field: "qualities.NumberOfInstances",
  },
];

function DataSearchContainer() {
  // useNextRouting is a custom hook that will integrate with Next Router with Search UI config
  // config is search-ui configuration.
  // baseUrl is the path to the search page
  const combinedConfig = useNextRouting(searchConfig, "<baseUrl>");
  return (
    <SearchContainer
      config={combinedConfig}
      sort_options={sort_options}
      search_facets={search_facets}
      title="Datasets"
      type="Dataset"
    />
  );
}

DataSearchContainer.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

DataSearchContainer.displayName = "DataSearchContainer";

export default DataSearchContainer;
