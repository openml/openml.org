import React, { useEffect } from "react";
import { withSearch } from "@elastic/react-search-ui";

const CoreFilter = ({ addFilter, setFilter, removeFilter, setSearchTerm }) => {
  useEffect(() => {
    // An example list of user IDs
    const userIds = [1, 2];
    // Clear previous filters for user_id field
    removeFilter("id");
    removeFilter("ids");
    removeFilter("_id");
    removeFilter("user_id");
    removeFilter("user_id.keyword");
    // Apply the filter using the `terms` filter type
    //addFilter("user_id", userIds, "any");
    addFilter("user_id", userIds, "any");
  }, [addFilter, setFilter, removeFilter, setSearchTerm]);

  return <div></div>;
};

export default withSearch(
  ({ addFilter, setFilter, removeFilter, setSearchTerm }) => ({
    addFilter,
    setFilter,
    removeFilter,
    setSearchTerm,
  })
)(CoreFilter);
