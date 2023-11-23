import React from "react";
import { useNextRouting } from "../../utils/useNextRouting";

import DashboardLayout from "../../layouts/Dashboard";
import SearchContainer from "../../components/search/SearchContainer";
import { renderCell, valueGetter } from "../../components/search/ResultTable";

import searchConfig from "./searchConfig";

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

const sort_options = [
  {
    name: "search.relevance",
    value: [],
  },
  {
    name: "search.most_recent",
    value: [{ field: "date", direction: "desc" }],
  },
];

const search_facets = [
  {
    label: "filters.status",
    field: "status.keyword",
  },
];

// Controls how columns are rendered and manipulated in the table view
const columns = [
  {
    field: "task_id",
    headerName: "Task_id",
    valueGetter: valueGetter("task_id"),
    renderCell: renderCell,
    width: 70,
  },
];

function TaskSearchContainer() {
  const combinedConfig = useNextRouting(searchConfig, "<baseUrl>");

  return (
    <SearchContainer
      config={combinedConfig}
      sort_options={sort_options}
      search_facets={search_facets}
      columns={columns}
      title="Tasks"
      type="Task"
    />
  );
}

TaskSearchContainer.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

TaskSearchContainer.displayName = "TaskSearchContainer";

export default TaskSearchContainer;
