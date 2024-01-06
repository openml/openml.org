import React from "react";
import { useNextRouting } from "../../utils/useNextRouting";

import DashboardLayout from "../../layouts/Dashboard";
import SearchContainer from "../../components/search/SearchContainer";
import {
  renderCell,
  valueGetter,
  renderDescription,
  renderDate,
  renderTags,
  renderChips,
} from "../../components/search/ResultTable";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import searchConfig from "../f/searchConfig";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
export async function getStaticProps(context) {
  // extract the locale identifier from the URL
  const { locale } = context;
  return {
    props: {
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

// Defines chips in table view
const getChipProps = (value) => {
  switch (value) {
    default:
      return {
        label: value,
      };
  }
};

const sort_options = [
  {
    name: "search.relevance",
    value: [],
  },
];

const search_facets = [
  {
    label: "filters.dataset",
    field: "run_task.source_data.name.keyword",
  },
  {
    label: "filters.tasktype",
    field: "run_task.tasktype.name.keyword",
  },
  {
    label: "filters.flow",
    field: "run_flow.name",
  },
];

// Controls how columns are rendered and manipulated in the table view
const columns = [
  {
    field: "row_id",
    headerName: "Row_id",
    valueGetter: valueGetter("row_id"),
    renderCell: renderCell,
    width: 70,
  },
  {
    field: "description",
    headerName: "Description",
    valueGetter: valueGetter("description"),
    renderCell: renderDescription,
    width: 360,
  },
  {
    field: "date",
    headerName: "Date",
    valueGetter: valueGetter("date"),
    renderCell: renderDate,
  },
  {
    field: "tags",
    headerName: "Tags",
    valueGetter: valueGetter("tags"),
    renderCell: renderTags,
    width: 400,
  },
];

function RunSearchContainer() {
  const combinedConfig = useNextRouting(searchConfig, "<baseUrl>");

  return (
    <SearchContainer
      config={combinedConfig}
      sort_options={sort_options}
      search_facets={search_facets}
      columns={columns}
    />
  );
}

RunSearchContainer.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

RunSearchContainer.displayName = "RunSearchContainer";

export default RunSearchContainer;
