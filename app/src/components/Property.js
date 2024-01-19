import React from "react";
import styled from "@emotion/styled";
import { Tooltip, Link as MuiLink } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Icon = styled(FontAwesomeIcon)`
  padding-right: 0.5em;
`;

const SimpleLink = styled(MuiLink)`
  text-decoration: none;
  padding-right: 1px;
  font-weight: 800;
  color: ${(props) => props.color};
`;

const Property = ({ label, value, color, icon, url }) => {
  return (
    <Tooltip title={label} placement="top-start">
      <span
        style={{
          paddingRight: 15,
          paddingBottom: 5,
          display: "inline-block",
        }}
      >
        {url ? (
          <SimpleLink href={url} color={color}>
            {icon && <Icon icon={icon} color={color} />}
            {value}
          </SimpleLink>
        ) : (
          <>
            {icon && <Icon icon={icon} color={color} />}
            {value}
          </>
        )}
      </span>
    </Tooltip>
  );
};

export default Property;
