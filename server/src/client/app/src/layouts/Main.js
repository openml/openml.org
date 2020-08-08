import React from "react";
import styled, { createGlobalStyle } from "styled-components";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
//import Footer from "../components/Footer";

import { MainContext } from "../App.js";
import { Redirect } from "react-router-dom";

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
    background: ${props =>
      window.location.pathname === "/" ? "#fff" : props.theme.body.background};
  }
`;

const Root = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props =>
    props.bg === "Gradient"
      ? "linear-gradient(217deg, rgba(255,0,0,1), rgba(255,0,0,0) 70.71%), linear-gradient(336deg, rgba(0,200,0,1), rgba(0,200,0,0) 70.71%), linear-gradient(127deg, rgba(0,0,255,1), rgba(0,0,255,0) 70.71%)"
      : "none"};
  background-size: 100vw ${props => (props.width <= 960 ? "880px" : "600px")};
  background-repeat: no-repeat;
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
`;

const Drawer = styled.div`
  ${props => props.theme.breakpoints.up("lg")} {
    width: ${props => props.drawerWidth}px;
    flex-shrink: 0;
  }
`;

class Main extends React.Component {
  state = {
    mobileOpen: false,
    miniDrawer: false,
    activeSearch: false,
    mode: "wide"
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  listenToScroll = () => {
    const position = document.documentElement.clientHeight - window.pageYOffset;
    if (!this.state.activeSearch && position < 260) {
      this.setState(state => ({ activeSearch: true }));
    } else if (this.state.activeSearch && position > 260) {
      this.setState(state => ({ activeSearch: false }));
    }
  };

  updateDimensions = () => {
    if (this.state.mode !== "wide" && window.innerWidth > 960) {
      this.setState({ mode: "wide" });
    } else if (this.state.mode !== "small" && window.innerWidth < 960) {
      this.setState({ mode: "small" });
    }
  };

  componentDidMount() {
    window.addEventListener("scroll", this.listenToScroll);
    window.addEventListener("resize", this.updateDimensions);
  }

  render() {
    const { children, routes, width, background } = this.props;
    return (
      <MainContext.Consumer>
        {context => (
          <Root bg={background} width={window.innerWidth}>
            {context.query !== undefined && context.type === undefined && (
              <Redirect to="/search?type=data" />
            )}
            {context.query !== undefined && context.type !== undefined && (
              <Redirect to={"/search?type=" + context.type} />
            )}
            <CssBaseline />
            <GlobalStyle />
            <Drawer drawerWidth={context.drawerWidth} open={false}>
              <Hidden lgUp implementation="js">
                <Sidebar
                  routes={routes}
                  PaperProps={{ style: { width: context.drawerWidth } }}
                  variant="temporary"
                  open={this.state.mobileOpen}
                  onClose={this.handleDrawerToggle}
                />
              </Hidden>
              <Hidden mdDown implementation="css">
                <Sidebar
                  routes={routes}
                  PaperProps={{ style: { width: context.drawerWidth } }}
                />
              </Hidden>
            </Drawer>
            <AppContent>
              <Header
                onDrawerToggle={this.handleDrawerToggle}
                bg={this.state.activeSearch ? "none" : background}
                routes={routes}
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
