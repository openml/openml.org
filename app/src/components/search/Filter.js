import React from "react";
import { useTheme } from "@mui/material/styles";

import styled from "@emotion/styled";
import {
  Card,
  Tooltip,
  CardHeader,
  Badge,
  Link as MuiLink,
  Chip as MuiChip,
  Box,
  TabPanel,
  Tab,
  Tabs,
} from "@mui/material";

import TimeAgo from "react-timeago";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { blue, orange, red, green, grey, purple } from "@mui/material/colors";
import { SubscriptionsOutlined } from "@mui/icons-material";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const FilterChip = styled(MuiChip)`
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const FilterPanel = styled.div`
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;
const FilterIcon = styled(FontAwesomeIcon)`
  cursor: "pointer";
  padding-left: 5px;
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
