import { Chip } from "@mui/material";
import styled from "@emotion/styled";
import { i18n } from "next-i18next";
import React from "react";

const FilterChip = styled(Chip)`
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 50px;
`;

// Handles special cases in the filter options
const processOption = (option, translate = true) => {
  // Homogenize notation for library reporting and versioning
  const libraries = [
    "sklearn",
    "torch",
    "Weka",
    "tensorflow",
    "keras",
    "mlr",
    "Moa",
  ];
  if (libraries.some((library) => option.includes(library))) {
    const segments = option.split(/,|\n/);
    let lib = segments.find((segment) =>
      libraries.some((library) => segment.includes(library)),
    );
    if (lib.startsWith(" ")) {
      lib = lib.replace(" ", "");
    }
    if (
      lib.startsWith("Weka_") ||
      lib.startsWith("R_") ||
      lib.startsWith("Moa_") ||
      lib.startsWith("mlr_")
    ) {
      lib = lib.replace("_", "==");
    }
    // If the option has versioning, return it separately
    const values = lib.split("==");
    if (values.length > 1) {
      return [`filters.${values[0]}`, { version: values[1] }];
    } else {
      return [`filters.${lib}`];
    }
  } else if (translate) {
    // If comma or newline separated, return the first
    const segments = option.split(/,|\n/);
    return [`filters.${segments[0]}`];
  } else {
    return option;
  }
};

const Filter = ({ label, options, values, onRemove, onSelect }) => {
  // Don't invoke translation for flows or datasets
  const translate = !["flow", "dataset"].includes(label.split(".").pop());
  return (
    <React.Fragment>
      {options.map((option) => (
        <FilterChip
          label={
            (translate
              ? i18n.t(...processOption(option.value, translate))
              : option.value) +
            "  (" +
            option.count +
            ")"
          }
          key={option.value}
          clickable
          onClick={() =>
            option.selected ? onRemove(option.value) : onSelect(option.value)
          }
          color={option.selected ? "primary" : "default"}
          variant={option.selected ? "default" : "outlined"}
        />
      ))}
    </React.Fragment>
  );
};

export default Filter;
