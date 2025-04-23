import React, { useState } from "react";
import styled from "@emotion/styled";
import { rgba, darken } from "polished";

import { Grid, ListItemButton, ListItemText } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import Settings from "../Settings";
import { useTranslation } from "next-i18next";

const Footer = styled.div`
  background-color: ${(props) =>
    props.theme.sidebar.footer.background} !important;
  padding: 0 0;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const Item = styled(ListItemButton)`
  margin-top: ${(props) => props.theme.spacing(2)};
  padding-top: ${(props) => props.theme.spacing(4.75)};
  padding-bottom: ${(props) => props.theme.spacing(5.75)};
  padding-left: ${(props) => props.theme.spacing(10)};
  padding-right: ${(props) => props.theme.spacing(11)};
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  svg {
    color: ${(props) => props.theme.sidebar.color};
    font-size: 20px;
    width: 20px;
    height: 20px;
    opacity: 0.5;
  }
  &:hover {
    background-color: ${(props) =>
      darken(0.03, props.theme.sidebar.footer.background)};
  }
`;

const Title = styled(ListItemText)`
  margin: 0;
  span {
    color: ${(props) => rgba(props.theme.sidebar.color, 1)};
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
    padding: 0 ${(props) => props.theme.spacing(4)};
  }
`;

function SidebarFooter() {
  const [state, setState] = useState({
    isOpen: false,
  });

  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  const toggleDrawer = (open) => () => {
    setState({ ...state, isOpen: open });
  };

  return (
    <Footer>
      <Settings open={state.isOpen} onClose={toggleDrawer(false)} />
      <Grid container spacing={2}>
        <Item onClick={toggleDrawer(true)}>
          <SettingsIcon />
          <Title>{t("sidebar.settings")}</Title>
        </Item>
      </Grid>
    </Footer>
  );
}

export default SidebarFooter;
