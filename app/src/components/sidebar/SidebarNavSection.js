import React from "react";
import { styled } from "@mui/material/styles";

import { Typography } from "@mui/material";

import SidebarNavList from "./SidebarNavList";
import { useTranslation } from "next-i18next";

const Title = styled(Typography)`
  color: ${(props) => props.theme.palette.sidebar.color};
  font-size: ${(props) => props.theme.typography.caption.fontSize};
  padding: ${(props) => props.theme.spacing(4)}
    ${(props) => props.theme.spacing(7)} ${(props) => props.theme.spacing(1)};
  opacity: 0.4;
  text-transform: uppercase;
  display: block;
`;

const SidebarNavSection = (props) => {
  const {
    title,
    pages,
    className,
    count,
    component: Component = "nav",
    ...rest
  } = props;

  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  return (
    <Component {...rest}>
      {title && <Title variant="subtitle2">{t(title)}</Title>}
      <SidebarNavList pages={pages} depth={0} count={count} />
    </Component>
  );
};

export default SidebarNavSection;
