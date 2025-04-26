import React from "react";
import { styled } from "@mui/material/styles";

import { CssBaseline } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import createTheme from "../theme";

import GlobalStyle from "../components/GlobalStyle";

const Root = styled("div")({
  display: "flex",
  minHeight: "100vh",
});

const AppContent = styled("div")({
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

const Presentation = ({ children }) => {
  return (
    <MuiThemeProvider theme={createTheme("DEFAULT")}>
      <Root>
        <CssBaseline />
        <GlobalStyle />
        <AppContent>{children}</AppContent>
      </Root>
    </MuiThemeProvider>
  );
};

export default Presentation;
