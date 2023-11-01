import React, { useEffect } from "react";
import { withSearch } from "@elastic/react-search-ui";

const CoreFilter = ({ addFilter, removeFilter, setSort }) => {
  useEffect(() => {
    // List of core contributor IDs
    const core_ids = [
      1, 2, 27, 86, 348, 970, 1140, 869, 8111, 9186, 3744, 34097,
    ];

    // Clear previous filters for user_id field
    removeFilter("user_id.keyword");
    addFilter("user_id.keyword", core_ids, "any");
    setSort([{ field: "last_name.keyword", direction: "asc" }]); // Has to be an array or it won't work
  });

  return <div></div>;
};

export default withSearch(({ addFilter, removeFilter, setSort }) => ({
  addFilter,
  removeFilter,
  setSort,
}))(CoreFilter);
