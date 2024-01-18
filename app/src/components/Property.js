import React from "react";
import styled from "@emotion/styled";
import { Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Icon = styled(FontAwesomeIcon)`
  padding-right: 0.5em;
`;

const Property = ({ label, value, color, icon }) => {
  return (
    <Tooltip title={label} placement="top-start">
      <span
        style={{
          paddingRight: 15,
          paddingBottom: 5,
          display: "inline-block",
        }}
      >
        {icon && <Icon icon={icon} color={color} />}
        {value}
      </span>
    </Tooltip>
  );
};

export default Property;
