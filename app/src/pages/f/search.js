/**
 * Flow Search Redirect Page
 *
 * This page redirects from the old /f/search URL to the new SEO-friendly /flows URL
 * Preserves all query parameters during redirect
 */

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function FlowSearchRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Get all query parameters from current URL
    const { query } = router;

    // Redirect to /flows with the same query parameters
    router.replace({
      pathname: "/flows",
      query: query,
    });
  }, [router]);

  // Show nothing while redirecting
  return null;
}

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
  {
    name: "search.most_runs",
    value: [{ field: "runs", direction: "desc" }],
  },
  {
    name: "search.most_likes",
    value: [{ field: "nr_of_likes", direction: "desc" }],
  },
  {
    name: "search.most_downloads",
    value: [{ field: "nr_of_downloads", direction: "desc" }],
  },
  {
    name: "search.most_recent",
    value: [{ field: "date", direction: "desc" }],
  },
];

const search_facets = [
  {
    label: "filters.dependencies",
    field: "dependencies.keyword",
  },
];

// Controls how columns are rendered and manipulated in the table view
// Define the required helper functions
const valueGetter = (field) => (params) => params.row[field];
const renderCell = (params) => params.value;
const renderDescription = (params) => params.value;
const renderDate = (params) => params.value;
const renderChips = (getChipProps) => (params) => params.value;
const renderTags = (params) => params.value;

const columns = [
  {
    field: "flow_id",
    headerName: "Flow_id",
    valueGetter: valueGetter("data_id"),
    renderCell: renderCell,
    width: 70,
  },
  {
    field: "name",
    headerName: "Name",
    valueGetter: valueGetter("name"),
    renderCell: renderCell,
    width: 230,
  },
  {
    field: "version",
    headerName: "Version",
    valueGetter: valueGetter("version"),
    renderCell: renderCell,
    width: 60,
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
    field: "licence",
    headerName: "Licence",
    valueGetter: valueGetter("licence"),
    renderCell: renderChips(getChipProps),
    width: 110,
  },
  {
    field: "creator",
    headerName: "Creator",
    valueGetter: valueGetter("creator"),
    renderCell: renderCell,
    width: 150,
  },
  {
    field: "tags",
    headerName: "Tags",
    valueGetter: valueGetter("tags"),
    renderCell: renderTags,
    width: 400,
  },
];

function FlowSearchContainer() {
  const combinedConfig = useNextRouting(flowConfig, "<baseUrl>");

  return (
    <SearchContainer
      config={combinedConfig}
      sort_options={sort_options}
      search_facets={search_facets}
      columns={columns}
    />
  );
}

FlowSearchContainer.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

FlowSearchContainer.displayName = "FlowSearchContainer";
