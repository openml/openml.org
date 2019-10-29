import React from "react";
import styled, { css, keyframes, createGlobalStyle } from "styled-components";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
//import Footer from "../components/Footer";

import { MainContext } from "../App.js";

import { spacing } from "@material-ui/system";
import {
  Hidden,
  CssBaseline,
  Paper as MuiPaper,
  withWidth
} from "@material-ui/core";

import { isWidthUp } from "@material-ui/core/withWidth";

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
  display: flex;
  flex-direction: column;
  width: 75%;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${props =>
    props.bg === "Gradient" ? "transparent" : props.theme.body.background};
  box-shadow ${props =>
    props.bg === "Gradient" ? "none" : props.theme.body.background};
  padding: ${props => (props.bg === "Gradient" ? "10px" : "0")};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

const Drawer = styled.div`
  ${props => props.theme.breakpoints.up("md")} {
    width: ${props => props.drawerWidth}px;
    flex-shrink: 0;
  }
`;

class Main extends React.Component {
  state = {
    mobileOpen: false,
    miniDrawer: false
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { children, routes, width, background } = this.props;

    return (
      <MainContext.Consumer>
        {context => (
          <Root bg={background} bgrunning={context.animation}>
            <CssBaseline />
            <GlobalStyle />
            <Drawer drawerWidth={context.drawerWidth}>
              <Hidden mdUp implementation="js">
                <Sidebar
                  routes={routes}
                  PaperProps={{ style: { width: context.drawerWidth } }}
                  variant="temporary"
                  open={this.state.mobileOpen}
                  onClose={this.handleDrawerToggle}
                />
              </Hidden>
              <Hidden smDown implementation="css">
                <Sidebar
                  routes={routes}
                  PaperProps={{ style: { width: context.drawerWidth } }}
                />
              </Hidden>
            </Drawer>
            <AppContent>
              <Header
                onDrawerToggle={this.handleDrawerToggle}
                bg={background}
              />
              <MainContent p={isWidthUp("lg", width) ? 10 : 8} bg={background}>
                {children}
              </MainContent>
              {/*<Footer />*/}
            </AppContent>
          </Root>
        )}
      </MainContext.Consumer>
    );
  }
}

export default withWidth()(Main);
