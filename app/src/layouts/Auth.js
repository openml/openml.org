import React from "react";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";

import { CssBaseline } from "@mui/material";

import GlobalStyle from "../components/GlobalStyle";

var gradientBG = keyframes`
  	0% { background-position: 0% 50%; }
  	50% {	background-position: 100% 50%; }
  	100% { background-position: 0% 50%;	}
  `;

const animation = (props) => css`
  ${gradientBG} 15s ease 10;
`;

const Root = styled.div`
  display: flex;
  min-height: 100vh;

  ${(props) => props.theme.breakpoints.up("sm")} {
    animation: ${animation};
    animation-play-state: running;
    -webkit-animation-timing-function: linear;
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 300% 300%;
  }
`;

const RootContent = styled.div`
  max-width: 520px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: 100%;
  flex-direction: column;
`;

const Auth = ({ children }) => {
  return (
    <Root>
      <RootContent>
        <CssBaseline />
        <GlobalStyle />
        {children}
      </RootContent>
    </Root>
  );
};

export default Auth;
