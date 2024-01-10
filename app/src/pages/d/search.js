import React from "react";
import { useNextRouting } from "../../utils/useNextRouting";

import DashboardLayout from "../../layouts/Dashboard";
import SearchContainer from "../../components/search/SearchContainer";
import {
  renderCell,
  valueGetter,
  copyCell,
  renderDescription,
  renderDate,
  renderTags,
  renderChips,
} from "../../components/search/ResultTable";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTriangleExclamation,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";

import dataConfig from "../../search_configs/dataConfig";
import {
  faCreativeCommonsBy,
  faCreativeCommonsPd,
  faCreativeCommonsZero,
} from "@fortawesome/free-brands-svg-icons";

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
  },
  {
    label: "filters.size",
    field: "qualities.NumberOfInstances",
  },
  {
    label: "filters.features",
    field: "qualities.NumberOfFeatures",
  },
  {
    label: "filters.target",
    field: "qualities.NumberOfClasses",
  },
  {
    label: "filters.format",
    field: "format",
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
    renderCell: renderChips(getChipProps),
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
    field: "url",
    headerName: "Url",
    valueGetter: valueGetter("url"),
    renderCell: copyCell,
    copyMessage: true,
    width: 50,
  },
  {
    field: "tags",
    headerName: "Tags",
    valueGetter: valueGetter("tags"),
    renderCell: renderTags,
    width: 400,
  },
];

function DataSearchContainer() {
  const combinedConfig = useNextRouting(dataConfig, "<baseUrl>");

  return (
    <SearchContainer
      config={combinedConfig}
      sort_options={sort_options}
      search_facets={search_facets}
      columns={columns}
    />
  );
}

DataSearchContainer.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

DataSearchContainer.displayName = "DataSearchContainer";

export default DataSearchContainer;
