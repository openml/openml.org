import React from "react";
import { useNextRouting } from "../../utils/useNextRouting";

import DashboardLayout from "../../layouts/Dashboard";
import SearchContainer from "../../components/search/SearchContainer";
import { renderCell, valueGetter } from "../../components/search/ResultTable";

import Chip from "@mui/material/Chip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTriangleExclamation,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";

import searchConfig from "./searchConfig";
import TimeAgo from "react-timeago";
import {
  faCreativeCommonsBy,
  faCreativeCommonsPd,
  faCreativeCommonsZero,
} from "@fortawesome/free-brands-svg-icons";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Teaser from "../../components/search/Teaser";
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

const getChipProps = (value) => {
  switch (value) {
    // Dataset status
    case "active":
      return {
        label: "Verified",
        icon: <FontAwesomeIcon icon={faCheck} />,
        color: "success",
      };
    case "deactivated":
      return {
        label: "Deprecated",
        icon: <FontAwesomeIcon icon={faTriangleExclamation} />,
        color: "error",
      };
    case "in_preparation":
      return {
        label: "In preparation",
        icon: <FontAwesomeIcon icon={faRotate} />,
        color: "warning",
      };
    // Dataset licence
    case "public":
    case "Public":
      return {
        label: "Public",
        icon: <FontAwesomeIcon icon={faCreativeCommonsPd} />,
        color: "success",
      };
    case "CC0":
    case "CCZero":
    case "CC0: Public Domain":
    case "Public Domain (CC0)":
      return {
        label: "CC0",
        icon: <FontAwesomeIcon icon={faCreativeCommonsZero} />,
        color: "success",
      };
    case "CC BY 4.0":
    case "CC BY-NC-ND":
    case "CC BY-NC 4.0":
    case "CC BY-SA":
    case "CC BY":
    case "Creative Commons Attribution":
      return {
        label: value,
        icon: <FontAwesomeIcon icon={faCreativeCommonsBy} />,
        color: "primary",
      };
    case "Open Database License (ODbL)":
      return {
        label: "ODbL",
        icon: <FontAwesomeIcon icon={faCreativeCommonsPd} />,
        color: "success",
      };
    default:
      return {
        label: value,
      };
  }
};

const renderChips = (params) => {
  const { label, icon, color, customColor } = getChipProps(params.value);
  return (
    <Chip
      icon={icon}
      label={label}
      color={color}
      size="small"
      variant="outlined"
    />
  );
};

const renderDate = (params) => {
  return <TimeAgo date={new Date(params.value)} minPeriod={60} />;
};

const renderDescription = (params) => {
  return (
    <div title={params.value}>
      <Teaser description={params.value} lines={3} />
    </div>
  );
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
  {
    name: "search.most_instances",
    value: [{ field: "qualities.NumberOfInstances", direction: "desc" }],
  },
  {
    name: "search.most_features",
    value: [{ field: "qualities.NumberOfFeatures", direction: "desc" }],
  },
  {
    name: "search.most_numeric_features",
    value: [{ field: "qualities.NumberOfNumericFeatures", direction: "desc" }],
  },
  {
    name: "search.most_missing_values",
    value: [{ field: "qualities.NumberOfMissing values", direction: "desc" }],
  },
  {
    name: "search.most_classes",
    value: [{ field: "qualities.NumberOfClasses", direction: "desc" }],
  },
];

const search_facets = [
  {
    label: "filters.status",
    field: "status.keyword",
  },
  {
    label: "filters.licence",
    field: "licence.keyword",
    show: "10",
  },
  {
    label: "filters.size",
    field: "qualities.NumberOfInstances",
  },
];

// Controls how columns are rendered and manipulated in the table view
const columns = [
  {
    field: "data_id",
    headerName: "Data_id",
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
    field: "status",
    headerName: "Status",
    valueGetter: valueGetter("status"),
    renderCell: renderChips,
    type: "singleSelect",
    valueOptions: ["active", "deactivated", "in_preparation"],
    width: 136,
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
    renderCell: renderChips,
    width: 110,
  },
  {
    field: "creator",
    headerName: "Creator",
    valueGetter: valueGetter("creator"),
    renderCell: renderCell,
  },
  {
    field: "url",
    headerName: "Url",
    valueGetter: valueGetter("url"),
    renderCell: renderCell,
  },
  {
    field: "tags",
    headerName: "Tags",
    valueGetter: valueGetter("tags"),
    renderCell: renderCell,
  },
];

function DataSearchContainer() {
  const combinedConfig = useNextRouting(searchConfig, "<baseUrl>");
  console.log("columns", JSON.stringify(columns));

  return (
    <SearchContainer
      config={combinedConfig}
      sort_options={sort_options}
      search_facets={search_facets}
      columns={columns}
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
