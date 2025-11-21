/**
 * Run Search Page - SEO Optimized
 *
 * This page displays a searchable list of runs from OpenML
 * Route: /runs
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
  renderDescription,
  renderDate,
  renderTags,
} from "../components/search/ResultTable";

import runConfig from "../search_configs/runConfig";

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
 * getChipProps - Defines how chips look in table view
 *
 * @param {string} value - The chip value
 * @returns {object} Chip configuration (label, icon, color)
 */
const getChipProps = (value) => {
  switch (value) {
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
    name: "search.most_recent",
    value: [{ field: "date", direction: "desc" }],
  },
  {
    name: "search.relevance",
    value: [], // Default relevance sorting
  },
];

/**
 * search_facets - Defines filter options in the sidebar
 *
 * Facets allow users to filter results by:
 * - Dataset
 * - Task type
 * - Flow
 */
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

/**
 * columns - Defines the table columns for run search results
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

/**
 * RunsPage - Main component for the runs search page
 *
 * How it works:
 * 1. Uses useNextRouting hook to handle URL query parameters
 * 2. Passes configuration to SearchContainer
 * 3. SearchContainer handles all the search logic, filters, pagination, etc.
 *
 * @returns {JSX.Element} The runs search page
 */
function RunsPage() {
  // useNextRouting hook synchronizes URL params with search state
  // Example: /runs?tasktype=classification&sort=date
  const combinedConfig = useNextRouting(runConfig, "/runs");

  return (
    <>
      {/* SEO Meta Tags - These help Google and other search engines */}
      <Head>
        <title>OpenML Runs - Search Machine Learning Experiment Runs</title>
        <meta
          name="description"
          content="Search and explore machine learning experiment runs on OpenML. Filter by dataset, task type, and flow. Free and open source ML runs."
        />
        <meta
          name="keywords"
          content="machine learning, runs, experiments, ML, results, openml"
        />

        {/* Open Graph tags for social media sharing */}
        <meta property="og:title" content="OpenML Runs" />
        <meta
          property="og:description"
          content="Search machine learning experiment runs on OpenML"
        />
        <meta property="og:type" content="website" />

        {/* Canonical URL - tells search engines this is the main URL */}
        <link rel="canonical" href="https://www.openml.org/runs" />
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
RunsPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

// Helpful for debugging in React DevTools
RunsPage.displayName = "RunsPage";

export default RunsPage;
