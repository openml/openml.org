/**
 * Task Search Page - SEO Optimized
 *
 * This page displays a searchable list of tasks from OpenML
 * Route: /tasks
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
import { renderCell, valueGetter } from "../components/search/ResultTable";

import taskConfig from "../search_configs/taskConfig";

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
];

/**
 * search_facets - Defines filter options in the sidebar
 *
 * Facets allow users to filter results by:
 * - Task type (classification, regression, etc.)
 * - Estimation procedure (cross-validation, holdout, etc.)
 * - Evaluation measures (accuracy, AUC, etc.)
 */
const search_facets = [
  {
    label: "filters.tasktype",
    field: "tasktype.name.keyword",
  },
  {
    label: "filters.estimation_procedure",
    field: "estimation_procedure.name.keyword",
  },
  {
    label: "filters.evaluation_measures",
    field: "evaluation_measures.keyword",
  },
];

/**
 * columns - Defines the table columns for task search results
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
    field: "task_id",
    headerName: "Task_id",
    valueGetter: valueGetter("task_id"),
    renderCell: renderCell,
    width: 70,
  },
];

/**
 * TasksPage - Main component for the tasks search page
 *
 * How it works:
 * 1. Uses useNextRouting hook to handle URL query parameters
 * 2. Passes configuration to SearchContainer
 * 3. SearchContainer handles all the search logic, filters, pagination, etc.
 *
 * @returns {JSX.Element} The tasks search page
 */
function TasksPage() {
  // useNextRouting hook synchronizes URL params with search state
  // Example: /tasks?tasktype=classification&sort=runs
  const combinedConfig = useNextRouting(taskConfig, "/tasks");

  return (
    <>
      {/* SEO Meta Tags - These help Google and other search engines */}
      <Head>
        <title>OpenML Tasks - Search Machine Learning Tasks</title>
        <meta
          name="description"
          content="Search and explore machine learning tasks on OpenML. Filter by task type, estimation procedure, and evaluation measures. Free and open source ML tasks."
        />
        <meta
          name="keywords"
          content="machine learning, tasks, ML, classification, regression, openml"
        />

        {/* Open Graph tags for social media sharing */}
        <meta property="og:title" content="OpenML Tasks" />
        <meta
          property="og:description"
          content="Search machine learning tasks on OpenML"
        />
        <meta property="og:type" content="website" />

        {/* Canonical URL - tells search engines this is the main URL */}
        <link rel="canonical" href="https://www.openml.org/tasks" />
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
TasksPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

// Helpful for debugging in React DevTools
TasksPage.displayName = "TasksPage";

export default TasksPage;
