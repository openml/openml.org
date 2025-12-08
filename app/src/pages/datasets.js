/**
 * Dataset Search Page - SEO Optimized
 *
 * This page displays a searchable list of datasets from OpenML
 * Route: /datasets
 *
 * Key Concepts:
 * 1. getStaticProps - Pre-renders this page at build time (good for SEO)
 * 2. serverSideTranslations - Loads translations for internationalization
 * 3. SearchContainer - Reusable component that handles all search logic
 */

import React from "react";
import { useNextRouting } from "../utils/useNextRouting";
import Head from "next/head";

import DashboardLayout from "../layouts/Dashboard";
import SearchContainer from "../components/search/SearchContainer";
import {
  renderCell,
  valueGetter,
  copyCell,
  renderDescription,
  renderDate,
  renderTags,
  renderChips,
} from "../components/search/ResultTable";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTriangleExclamation,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";

import dataConfig from "../search_configs/dataConfig";
import {
  faCreativeCommonsBy,
  faCreativeCommonsPd,
  faCreativeCommonsZero,
} from "@fortawesome/free-brands-svg-icons";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

/**
 * getStaticProps - Next.js function that runs at build time
 *
 * What it does:
 * - Loads translation files for the current locale (language)
 * - Runs on the SERVER, not in the browser
 * - Makes the page load faster and better for SEO
 *
 * @param {object} context - Contains locale info (en, de, fr, etc.)
 * @returns {object} Props to pass to the page component
 */
export async function getStaticProps(context) {
  const { locale } = context; // Get current language (e.g., 'en', 'de')

  return {
    props: {
      // Pass translations to the page
      ...(await serverSideTranslations(locale)),
    },
  };
}

/**
 * getChipProps - Defines how status/license chips look
 *
 * This function maps dataset status and license types to visual chips
 * with icons and colors
 *
 * @param {string} value - The status or license type
 * @returns {object} Chip configuration (label, icon, color)
 */
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

/**
 * sort_options - Defines how users can sort search results
 *
 * Each option has:
 * - name: Translation key for the label
 * - value: Elasticsearch sort configuration
 */
const sort_options = [
  {
    name: "search.relevance",
    value: [], // Default relevance sorting
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
    value: [{ field: "qualities.NumberOfMissingValues", direction: "desc" }],
  },
  {
    name: "search.most_classes",
    value: [{ field: "qualities.NumberOfClasses", direction: "desc" }],
  },
];

/**
 * search_facets - Defines filter options in the sidebar
 *
 * Facets allow users to filter results by:
 * - Status (active, deactivated, etc.)
 * - License type
 * - Number of instances (size)
 * - Number of features
 * - Number of classes (target)
 * - File format
 */
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

/**
 * columns - Defines the table columns for dataset search results
 *
 * Each column has:
 * - field: The data field from Elasticsearch
 * - headerName: Display name in the table header
 * - valueGetter: Function to extract the value
 * - renderCell: Function to render the cell content
 * - width: Column width in pixels
 */
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

/**
 * DatasetsPage - Main component for the datasets search page
 *
 * How it works:
 * 1. Uses useNextRouting hook to handle URL query parameters
 * 2. Passes configuration to SearchContainer
 * 3. SearchContainer handles all the search logic, filters, pagination, etc.
 *
 * @returns {JSX.Element} The datasets search page
 */
function DatasetsPage() {
  // useNextRouting hook synchronizes URL params with search state
  // Example: /datasets?status=active&sort=date
  const combinedConfig = useNextRouting(dataConfig, "/datasets");

  return (
    <>
      {/* SEO Meta Tags - These help Google and other search engines */}
      <Head>
        <title>OpenML Datasets - Search Machine Learning Datasets</title>
        <meta
          name="description"
          content="Search and explore thousands of machine learning datasets on OpenML. Filter by size, features, format, and more. Free and open source datasets for your ML projects."
        />
        <meta
          name="keywords"
          content="machine learning, datasets, ML, data science, open source, openml"
        />

        {/* Open Graph tags for social media sharing */}
        <meta property="og:title" content="OpenML Datasets" />
        <meta
          property="og:description"
          content="Search machine learning datasets on OpenML"
        />
        <meta property="og:type" content="website" />

        {/* Canonical URL - tells search engines this is the main URL */}
        <link rel="canonical" href="https://www.openml.org/datasets" />
      </Head>

      {/* SearchContainer is a reusable component that handles:
          - Elasticsearch queries
          - Filters and facets
          - Sorting
          - Pagination
          - Results display (grid, list, table views)
      */}
      <SearchContainer
        config={combinedConfig}
        sort_options={sort_options}
        search_facets={search_facets}
        columns={columns}
      />
    </>
  );
}

/**
 * getLayout - Wraps the page with DashboardLayout
 *
 * This is a Next.js pattern for persistent layouts.
 * The DashboardLayout includes:
 * - Navigation sidebar
 * - Header
 * - Footer
 *
 * This layout persists when navigating between pages,
 * preventing unnecessary re-renders.
 */
DatasetsPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

// Helpful for debugging in React DevTools
DatasetsPage.displayName = "DatasetsPage";

export default DatasetsPage;
