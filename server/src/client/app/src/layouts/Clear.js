import React from "react";
import styled, { css, keyframes, createGlobalStyle } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";

import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  CssBaseline
} from "@material-ui/core";

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    background: ${props => props.theme.body.background};
  }
`;

var gradientBG = keyframes`
  	0% { background-position: 0% 50%; }
  	50% {	background-position: 100% 50%; }
  	100% { background-position: 0% 50%;	}
  `;

const animation = props =>
  css`
    ${gradientBG} 15s ease infinite;
  `;

const Root = styled.div`
  animation: ${props => (props.bg === "Gradient" ? animation : "none")};
  animation-play-state: ${props => (props.bgrunning ? "running" : "paused")};
  -webkit-animation-timing-function: linear;
  display: flex;
  min-height: 100vh;
  background: ${props =>
    props.bg === "Gradient"
      ? "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)"
      : "none"};
  background-size: 300% 300%;
`;

const AppContent = styled.div`
  flex: 1;
  flex-direction: column;
`;

const MainContent = styled.div`
  display: flex;
  min-height: 100vh;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
`;

function Page({ children }) {
  const history = useHistory();
  return (
    <Root bg="Gradient" bgrunning={animation}>
      <CssBaseline />
      <GlobalStyle />
      <AppContent>
        <AppBar
          position="fixed"
          style={{ background: "transparent", boxShadow: "none", height: "50" }}
        >
          <Toolbar variant="dense">
            <IconButton
              style={{ backgroundColor: "transparent" }}
              color="inherit"
              onClick={() => {
                history.goBack();
              }}
            >
              <FontAwesomeIcon icon="chevron-left" />
              <Typography
                variant="h6"
                color="inherit"
                style={{ paddingLeft: 15 }}
              >
                Back
              </Typography>
            </IconButton>
          </Toolbar>
        </AppBar>
        <MainContent>{children}</MainContent>
      </AppContent>
    </Root>
  );
}

export default Page;
