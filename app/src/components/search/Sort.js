import React, { useState } from "react";

import { Sorting, withSearch } from "@elastic/react-search-ui";
import {
  Box,
  FormControl,
  InputLabel,
  NativeSelect,
  ToggleButton,
} from "@mui/material";
import { i18n } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownShortWide,
  faArrowDownWideShort,
} from "@fortawesome/free-solid-svg-icons";

const SortView = ({ options, value, onChange }) => {
  if (value === "|||") {
    value = "[]";
  } else {
    // The Select component matches against the default setting
    value = value.replace('"direction":"asc"', '"direction":"desc"');
  }
  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          {i18n.t("search.sort_by")}
        </InputLabel>
        <NativeSelect
          value={value}
          onChange={(o) => onChange(o.nativeEvent.target.value)}
          inputProps={{
            name: "sort",
            id: "uncontrolled-native",
          }}
        >
          {options.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    </Box>
  );
};

function Sort({ sortOptions, setSort, sortList }) {
  // Handle sort direction toggle
  const [sortDirection, setSortDirection] = useState("desc");
  const toggleSortDirection = () => {
    const newDirection =
      sortList.length > 0 && sortList[0]["direction"] === "asc"
        ? "desc"
        : "asc";

    let newSortList = [];
    if (sortList.length > 0) {
      newSortList = [{ field: sortList[0]["field"], direction: newDirection }];
    }

    setSort(newSortList); // Update the Search UI state
    setSortDirection(newDirection); // Update the local state (for button)
  };

  //Translate sort options
  const translatedSortOptions = sortOptions.map((option) => ({
    ...option,
    name: i18n.t(option.name),
  }));

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {" "}
      <Sorting
        label="Sort by"
        sortOptions={translatedSortOptions}
        view={SortView}
      />
      <ToggleButton value="asc" onClick={toggleSortDirection}>
        <FontAwesomeIcon
          icon={
            sortDirection === "asc"
              ? faArrowDownShortWide
              : faArrowDownWideShort
          }
        />
      </ToggleButton>
    </Box>
  );
}

// Connect the component to the Search UI state
export default withSearch(({ setSort, sortList }) => ({
  setSort,
  sortList,
}))(Sort);
