import React, { useEffect } from "react";
import { withSearch } from "@elastic/react-search-ui";

const TagFilter = ({ addFilter, removeFilter }) => {
  useEffect(() => {
    // List of core contributor IDs
    const names = ["Economics"];

    // Clear previous tag filters
    removeFilter("tags.tag");
    addFilter("tags.tag", names, "any");
  });

  return null;
};

export default withSearch(({ addFilter, removeFilter }) => ({
  addFilter,
  removeFilter,
}))(TagFilter);
