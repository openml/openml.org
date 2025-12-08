import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
//import Footer from "../components/Footer";

import { MainContext } from "../App.js";
import { Redirect } from "react-router-dom";
import { spacing } from "@mui/system";

import {
  CssBaseline,
  Paper as MuiPaper,
  Snackbar,
  Alert
} from "@mui/material";

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
  background-size: 100vw ${props => (props.width <= 960 ? "900px" : "600px")};
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

function Main(props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSearch, setActiveSearch] = useState(false);
  const [mode, setMode] = useState("wide");

  const [bannerOpen, setBannerOpen] = React.useState(true);
  const handleBannerClose = () => {
    setBannerOpen(false);
  };

  const hidden = useMediaQuery(theme => theme.breakpoints.up('lg'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const listenToScroll = () => {
      const position = document.documentElement.clientHeight - window.pageYOffset;
      if (!activeSearch && position < 260) {
        setActiveSearch(true);
      } else if (activeSearch && position > 260) {
        setActiveSearch(false);
      }
    };
  
    const updateDimensions = () => {
      if (mode !== "wide" && window.innerWidth > 960) {
        setMode("wide");
      } else if (mode !== "small" && window.innerWidth < 960) {
        setMode("small");
      }
    };
    window.addEventListener('scroll', listenToScroll);
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('scroll', listenToScroll);
      window.removeEventListener('resize', updateDimensions);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { children, routes, background } = props;

  const theme = useTheme();
  const largeScreen = useMediaQuery(theme.breakpoints.up("lg"))

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
          {<Snackbar
            open={bannerOpen}        
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={10000}
            onClose={handleBannerClose}
            sx={{ width: '97%'}}
          >
            <Alert
              onClose={handleBannerClose}
              severity="warning"
              sx={{ width: '100%'}}
            >
                We're performing maintenance work on our servers in the week of 24-28 November. During this time, OpenML will be in read-only mode.{" "}
                <a href="https://github.com/orgs/openml/discussions/27"> 
                  Learn more.
                </a>
            </Alert>
          </Snackbar>}
          <Drawer drawerWidth={context.drawerWidth} open={false}>
            {hidden ? null : 
              <Sidebar
                routes={routes}
                PaperProps={{ style: { width: context.drawerWidth } }}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
              />
            }
            <Sidebar
              routes={routes}
              PaperProps={{ style: { width: context.drawerWidth } }}
              sx={{ display: { lg: 'block', xs: 'none' } }}
            />
          </Drawer>
          <AppContent>
            <Header
              onDrawerToggle={handleDrawerToggle}
              bg={activeSearch ? "none" : background}
              routes={routes}
              loggedIn={context.loggedIn}
            />
            <MainContent p={{largeScreen} ? 10 : 8} bg={background}>
              {children}
            </MainContent>
            {/*<Footer />*/}
          </AppContent>
        </Root>
      )}
    </MainContext.Consumer>
  );
}

export default Main;
