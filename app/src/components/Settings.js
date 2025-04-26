import React from "react";
import { styled } from "@mui/material/styles";

import { grey, indigo } from "@mui/material/colors";
import { Box, Drawer, Grid, ListItemButton, Typography } from "@mui/material";

import useTheme from "../hooks/useTheme";
import { useTranslation } from "next-i18next";

const DemoButton = styled("div")(({ theme, active }) => ({
  cursor: "pointer",
  background: theme.palette.background.paper,
  height: "80px",
  borderRadius: "0.3rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.825rem",
  position: "relative",
  border: `1px solid ${
    !active ? theme.palette.action.selected : theme.palette.action.active
  }`,
}));

const DemoButtonInner = styled("div")(({ theme, selectedTheme }) => ({
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  position: "relative",
  boxShadow: `0 0 0 1px ${theme.palette.action.selected}`,
  ...(selectedTheme === "DEFAULT" && {
    background: `linear-gradient(-45deg, #23303f 50%, ${grey[100]} 0)`,
  }),
  ...(selectedTheme === "DARK" && {
    background: "#23303f",
  }),
  ...(selectedTheme === "LIGHT" && {
    background: grey[100],
  }),
  ...(selectedTheme === "INDIGO" && {
    background: `linear-gradient(-45deg, ${indigo[500]} 50%, ${grey[100]} 0)`,
  }),
}));

const Wrapper = styled("div")({
  width: "258px",
  overflowX: "hidden",
});

const DemoTitle = styled(Typography)`
  text-align: center;
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
          <Demo title={t("settings.dark")} themeVariant="DARK" />
          <Demo title={t("settings.light")} themeVariant="LIGHT" />
          <Demo title={t("settings.default")} themeVariant="DEFAULT" />
          <Demo title={t("settings.indigo")} themeVariant="INDIGO" />
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
