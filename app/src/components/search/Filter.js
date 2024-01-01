import React from "react";

import styled from "@emotion/styled";
import { Chip as MuiChip } from "@mui/material";

const FilterChip = styled(MuiChip)`
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const FilterPanel = styled.div`
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;

const Filter = ({ label, options, values, onRemove, onSelect }) => {
  return (
    <FilterPanel>
      {options.map((option) => (
        <FilterChip
          label={option.value + "  (" + option.count + ")"}
          key={option.value}
          clickable
          onClick={() =>
            option.selected ? onRemove(option.value) : onSelect(option.value)
          }
          color={option.selected ? "primary" : "default"}
          variant={option.selected ? "default" : "outlined"}
        />
      ))}
    </FilterPanel>
  );
};

export default Filter;
