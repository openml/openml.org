import React, { useState } from "react";
import styled from "@emotion/styled";

import { Box, CssBaseline, Paper as MuiPaper, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import useMediaQuery from "@mui/material/useMediaQuery";
import { spacing } from "@mui/system";

import GlobalStyle from "../components/GlobalStyle";
import Navbar from "../components/navbar/Navbar";
import navItems from "../components/sidebar/navItems";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/Footer";

const drawerWidth = 258;

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Drawer = styled.div`
  ${(props) => props.theme.breakpoints.up("md")} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.palette.background.default};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

const Dashboard = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const theme = useTheme();
  const router = useRouter();

  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  // Get the entity color from the router path
  // e.g. /datasets -> green
  // Can't be in the theme since it requires the router
  const ecolor =
    theme.name === "LIGHT"
      ? theme.palette.entity[router.pathname.split(/[./]+/)[1]]
      : undefined;

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <Drawer>
        <Box sx={{ display: { xs: "block", lg: "none" } }}>
          <Sidebar
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            items={navItems}
            ecolor={ecolor}
          />
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Sidebar
            PaperProps={{ style: { width: drawerWidth } }}
            items={navItems}
            ecolor={ecolor}
          />
        </Box>
      </Drawer>
      <AppContent>
        <Navbar onDrawerToggle={handleDrawerToggle} ecolor={ecolor} />
        <MainContent p={isLgUp ? 12 : isSmUp ? 5 : 0}>{children}</MainContent>
        {/*<Footer />*/}
      </AppContent>
    </Root>
  );
};

export default Dashboard;
