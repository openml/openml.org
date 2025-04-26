import React from "react";
import { styled } from "@mui/material/styles";
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

const Root = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  [theme.breakpoints.up("sm")]: {
    animation: `${animation}`,
    animationPlayState: "running",
    WebkitAnimationTimingFunction: "linear",
    background: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
    backgroundSize: "300% 300%",
  },
}));

const RootContent = styled("div")(({ theme }) => ({
  maxWidth: "520px",
  margin: "0 auto",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  minHeight: "100%",
  flexDirection: "column",
}));

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
