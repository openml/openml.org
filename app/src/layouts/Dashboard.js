import React, { useState } from "react";
import { styled } from "@mui/material/styles";

import { Box, CssBaseline, Paper as MuiPaper, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { spacing } from "@mui/system";

import GlobalStyle from "../components/GlobalStyle";
import Navbar from "../components/navbar/Navbar";
import navItems from "../components/sidebar/navItems";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/Footer";

const drawerWidth = 258;

const Root = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
}));

const Drawer = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    width: `${drawerWidth}px`,
    flexShrink: 0,
  },
}));

const AppContent = styled(Box)`
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.palette.background.default};
  border-radius: 0;

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

const sections = {
  d: "Data",
  t: "Tasks",
  f: "Flows",
  r: "Runs",
  data: "Data",
  task: "Tasks",
  flow: "Flows",
  run: "Runs",
  collections: "Collections",
  benchmarks: "Benchmarks",
  tasktypes: "Task Types",
  measures: "Measures",
  apis: "APIs",
  contribute: "Contribute",
  meet: "Meet",
  about: "About",
  terms: "Terms",
  auth: "Profile",
};

const Dashboard = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const theme = useTheme();
  const router = useRouter();

  // Get the entity color from the router path
  // e.g. /datasets -> green
  // Can't be in the theme since it requires the router
  const path = router.pathname.split(/[./]+/)[1];
  const ecolor =
    theme.name === "LIGHT" ? theme.palette.entity[path] : undefined;
  const section = sections[path];

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
      <AppContent
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Navbar
          onDrawerToggle={handleDrawerToggle}
          ecolor={ecolor}
          section={section}
        />
        <MainContent className="flex active">{children}</MainContent>
        {/*<Footer />*/}
      </AppContent>
    </Root>
  );
};

export default Dashboard;
