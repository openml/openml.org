/**
 * DatasetSearchResults Component
 *
 * Displays the search results for datasets in different views:
 * - List view (cards)
 * - Table view (data grid)
 * - Grid view (compact cards)
 *
 * This component is specifically for datasets and can be customized
 * independently from other search types (flows, tasks, runs)
 */

import React from "react";
import { Grid, Box, Typography, Alert } from "@mui/material";
import { WithSearch } from "@elastic/react-search-ui";
import ResultCard from "./ResultCard";
import ResultGridCard from "./ResultGridCard";
import ResultsTable from "./ResultTable";

/**
 * EmptyState - Shown when there are no results
 */
const EmptyState = ({ searchTerm, hasFilters }) => (
  <Box
    sx={{
      textAlign: "center",
      py: 8,
      px: 2,
    }}
  >
    <Typography variant="h5" gutterBottom color="text.secondary">
      No datasets found
    </Typography>
    {searchTerm ? (
      <Typography variant="body1" color="text.secondary">
        No results for "<strong>{searchTerm}</strong>"
      </Typography>
    ) : (
      <Typography variant="body1" color="text.secondary">
        Try adjusting your filters or search terms
      </Typography>
    )}
    {hasFilters && (
      <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
        Try removing some filters to see more results
      </Typography>
    )}
  </Box>
);

/**
 * ErrorState - Shown when there's an error loading results
 */
const ErrorState = ({ error }) => (
  <Box sx={{ py: 4 }}>
    <Alert severity="error">
      <Typography variant="h6" gutterBottom>
        Error loading datasets
      </Typography>
      <Typography variant="body2">
        {error?.message || "Failed to load search results. Please try again."}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        If the problem persists, check that Elasticsearch is accessible.
      </Typography>
    </Alert>
  </Box>
);

/**
 * ListView - Displays results as cards (one per row)
 */
const ListView = ({ results, searchTerm }) => {
  console.log("📋 ListView: Rendering", results?.length, "results");

  if (!results || results.length === 0) {
    return <EmptyState searchTerm={searchTerm} />;
  }

  return (
    <Box>
      {results.map((result) => (
        <Box key={result.id.raw || result.data_id?.raw} mb={3}>
          <ResultCard result={result} />
        </Box>
      ))}
    </Box>
  );
};

/**
 * TableView - Displays results in a data grid table
 */
const TableView = ({ results, columns, searchTerm }) => {
  console.log("📊 TableView: Rendering", results?.length, "results");

  if (!results || results.length === 0) {
    return <EmptyState searchTerm={searchTerm} />;
  }

  return <ResultsTable results={results} columns={columns} />;
};

/**
 * GridView - Displays results as a grid of compact cards
 */
const GridView = ({ results, searchTerm }) => {
  console.log("🎨 GridView: Rendering", results?.length, "results");

  if (!results || results.length === 0) {
    return <EmptyState searchTerm={searchTerm} />;
  }

  return (
    <Grid container spacing={3} alignItems="stretch">
      {results.map((result) => (
        <ResultGridCard
          result={result}
          key={result.id.raw || result.data_id?.raw}
        />
      ))}
    </Grid>
  );
};

/**
 * DatasetSearchResults - Main component that switches between views
 *
 * Props:
 * - view: "list" | "table" | "grid"
 * - columns: Array of column definitions for table view
 */
const DatasetSearchResults = ({ view, columns }) => {
  return (
    <WithSearch
      mapContextToProps={({
        results,
        searchTerm,
        filters,
        wasSearched,
        error,
      }) => ({
        results,
        searchTerm,
        filters,
        wasSearched,
        error,
      })}
    >
      {({ results, searchTerm, filters, wasSearched, error }) => {
        // Debug logging - check browser console
        console.log("🔍 DatasetSearchResults Debug:", {
          view,
          resultsCount: results?.length || 0,
          searchTerm,
          filtersCount: Object.keys(filters || {}).length,
          wasSearched,
          error,
          firstResult: results?.[0],
        });

        // Show error state
        if (error) {
          console.error("❌ Search Error:", error);
          return <ErrorState error={error} />;
        }

        // Show empty state if search was performed but no results
        if (wasSearched && (!results || results.length === 0)) {
          return (
            <EmptyState
              searchTerm={searchTerm}
              hasFilters={Object.keys(filters || {}).length > 0}
            />
          );
        }

        // Show message before first search
        if (!wasSearched) {
          return (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="body1" color="text.secondary">
                Enter a search term or browse all datasets
              </Typography>
            </Box>
          );
        }

        // Render appropriate view
        switch (view) {
          case "table":
            return (
              <TableView
                results={results}
                columns={columns}
                searchTerm={searchTerm}
              />
            );
          case "grid":
            return <GridView results={results} searchTerm={searchTerm} />;
          case "list":
          default:
            return <ListView results={results} searchTerm={searchTerm} />;
        }
      }}
    </WithSearch>
  );
};

DatasetSearchResults.displayName = "DatasetSearchResults";

export default DatasetSearchResults;
