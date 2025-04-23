import React from "react";
import styled from "@emotion/styled";

import { CssBaseline } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import { THEMES } from "../constants";
import createTheme from "../theme";

import GlobalStyle from "../components/GlobalStyle";

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Presentation = ({ children }) => {
  return (
    <MuiThemeProvider theme={createTheme(THEMES.DEFAULT)}>
      <Root>
        <CssBaseline />
        <GlobalStyle />
        <AppContent>{children}</AppContent>
      </Root>
    </MuiThemeProvider>
  );
};

export default Presentation;
