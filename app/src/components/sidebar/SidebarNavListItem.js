import React from "react";
import styled from "@emotion/styled";
import { rgba, darken } from "polished";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";

import { Chip, Collapse, ListItemButton, ListItemText } from "@mui/material";
import { ExpandLess, ExpandMore, OpenInNew } from "@mui/icons-material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "next-i18next";

const Item = styled(ListItemButton)`
  padding-top: ${(props) =>
    props.theme.spacing(props.depth && props.depth > 0 ? 2 : 3)};
  padding-bottom: ${(props) =>
    props.theme.spacing(props.depth && props.depth > 0 ? 2 : 3)};
  padding-left: ${(props) =>
    props.theme.spacing(props.depth && props.depth > 0 ? 14 : 8)};
  padding-right: ${(props) =>
    props.theme.spacing(props.depth && props.depth > 0 ? 4 : 7)};
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  svg {
    color: ${(props) => props.theme.sidebar.color};
    font-size: 20px;
    width: 20px;
    height: 20px;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.08);
    color: ${(props) => props.theme.sidebar.color};
  }
  &.${(props) => props.activeclassname} {
    background-color: ${(props) =>
      darken(0.03, props.theme.sidebar.background)};
    span {
      color: ${(props) => props.theme.sidebar.color};
    }
  }
`;

const Title = styled(ListItemText)`
  margin: 0;
  span {
    color: ${(props) =>
      rgba(
        props.theme.sidebar.color,
        props.depth && props.depth > 0 ? 0.7 : 1,
      )};
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
    padding: 0 ${(props) => props.theme.spacing(4)};
  }
`;

const Badge = styled(Chip)`
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  height: 20px;
  position: absolute;
  right: 26px;
  top: ${(props) =>
    props.theme.spacing(props.depth && props.depth > 0 ? "8px" : "12px")};
  background: ${(props) => props.theme.sidebar.badge.background};
  z-index: 1;
  span.MuiChip-label,
  span.MuiChip-label:hover {
    font-size: 11px;
    cursor: pointer;
    color: ${(props) => props.theme.sidebar.badge.color};
    padding-left: ${(props) => props.theme.spacing(2)};
    padding-right: ${(props) => props.theme.spacing(2)};
  }
`;

const ExpandLessIcon = styled(ExpandLess)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

const ExpandMoreIcon = styled(ExpandMore)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

const OpenInNewIcon = styled(OpenInNew)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
  width: 14px !important;
  padding-left: ${(props) => props.theme.spacing(1)};
`;

const SidebarIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props?.color} !important;
`;

const SidebarNavListItem = (props) => {
  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  const {
    title,
    href,
    depth = 0,
    children,
    badge,
    open: openProp = false,
  } = props;

  const theme = useTheme();

  const { pathname } = useRouter();

  const color = theme.palette.entity[href.split(/[./]+/)[1]];
  const icon = theme.palette.icon[href.split(/[./]+/)[1]];
  const isExternal = href[0] != "/" ? true : false;

  const [open, setOpen] = React.useState(openProp);

  const handleToggle = () => {
    setOpen((state) => !state);
  };

  if (children) {
    return (
      <React.Fragment>
        <Item depth={depth} onClick={handleToggle}>
          {icon && <SidebarIcon color={color} icon={icon} />}
          <Title depth={depth}>
            {t(title)}
            {badge && <Badge label={badge} depth={depth} />}
          </Title>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Item>
        <Collapse in={open}>{children}</Collapse>
      </React.Fragment>
    );
  }

  return (
    <Link
      href={href}
      passHref
      target={isExternal ? "_blank" : undefined}
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
    >
      <Item
        depth={depth}
        className={pathname == href ? "active" : ""}
        activeclassname="active"
      >
        {icon && depth == 0 && <SidebarIcon color={color} icon={icon} />}
        <Title depth={depth}>
          {t(title)}
          {isExternal && <OpenInNewIcon />}
          {badge && <Badge label={badge} depth={depth} />}
        </Title>
      </Item>
    </Link>
  );
};

export default SidebarNavListItem;
