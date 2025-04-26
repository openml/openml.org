import React from "react";
import { styled } from "@mui/material/styles";
import { Tooltip, Link as MuiLink, Chip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Server-side translation
import { useTranslation } from "next-i18next";

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
  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  return (
    <Tooltip
      title={t(`tips.${label}`)}
      arrow
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -14],
              },
            },
          ],
        },
      }}
    >
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
