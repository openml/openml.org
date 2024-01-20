import React from "react";
import styled from "@emotion/styled";
import { Tooltip, Link as MuiLink, Chip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Icon = styled(FontAwesomeIcon)`
  padding-right: 0.5em;
`;

const UserChip = styled(Chip)`
  margin-bottom: 5px;
`;

const SimpleLink = styled(MuiLink)`
  text-decoration: none;
  padding-right: 1px;
  font-weight: 800;
  color: ${(props) => props.color};
`;

const Property = ({ label, value, color, icon, url, avatar }) => {
  return (
    <Tooltip title={label} placement="top-start">
      <span
        style={{
          paddingRight: 15,
          paddingBottom: 5,
          display: "inline-block",
        }}
      >
        {avatar ? (
          <UserChip
            size="small"
            variant="outlined"
            color="primary"
            avatar={avatar}
            label={value}
            href={url}
            component="a"
            clickable
          />
        ) : url ? (
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
