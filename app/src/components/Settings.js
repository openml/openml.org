import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

import { grey, indigo } from "@mui/material/colors";
import { Box, Drawer, Grid, ListItemButton, Typography } from "@mui/material";

import { THEMES } from "../constants";
import useTheme from "../hooks/useTheme";
import { useTranslation } from "next-i18next";

const DemoButton = styled.div`
  cursor: pointer;
  background: ${(props) => props.theme.palette.background.paper};
  height: 80px;
  border-radius: 0.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.825rem;
  position: relative;
  border: 1px solid
    ${(props) =>
      !props.active
        ? props.theme.palette.action.selected
        : props.theme.palette.action.active};
`;

const DemoButtonInner = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px ${(props) => props.theme.palette.action.selected};
  position: relative;

  ${(props) =>
    props.selectedTheme === THEMES.DEFAULT &&
    css`
      background: linear-gradient(-45deg, #23303f 50%, ${grey[100]} 0);
    `}
  ${(props) =>
    props.selectedTheme === THEMES.DARK &&
    css`
      background: #23303f;
    `}
  ${(props) =>
    props.selectedTheme === THEMES.LIGHT &&
    css`
      background: ${grey[100]};
    `}
  ${(props) =>
    props.selectedTheme === THEMES.INDIGO &&
    css`
      background: linear-gradient(-45deg, ${indigo[500]} 50%, ${grey[100]} 0);
    `}
`;

const DemoTitle = styled(Typography)`
  text-align: center;
`;

const Wrapper = styled.div`
  width: 258px;
  overflow-x: hidden;
`;

const Heading = styled(ListItemButton)`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;

  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }
`;

function Demo({ title, themeVariant }) {
  const { theme, setTheme } = useTheme();

  return (
    <Grid size={6}>
      <DemoButton
        active={themeVariant === theme}
        onClick={() => setTheme(themeVariant)}
      >
        <DemoButtonInner selectedTheme={themeVariant} />
      </DemoButton>
      <DemoTitle variant="subtitle2" gutterBottom>
        {title}
      </DemoTitle>
    </Grid>
  );
}

function Demos() {
  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  return (
    <Wrapper>
      <Heading>{t("settings.select_theme")}</Heading>

      <Box px={4} my={3}>
        <Grid container spacing={3}>
          <Demo title={t("settings.dark")} themeVariant={THEMES.DARK} />
          <Demo title={t("settings.light")} themeVariant={THEMES.LIGHT} />
          <Demo title={t("settings.default")} themeVariant={THEMES.DEFAULT} />
          <Demo title={t("settings.indigo")} themeVariant={THEMES.INDIGO} />
        </Grid>
      </Box>
    </Wrapper>
  );
}

const Settings = ({ ...rest }) => {
  return (
    <React.Fragment>
      <Drawer anchor="right" {...rest}>
        <Demos />
      </Drawer>
    </React.Fragment>
  );
};

export default Settings;
