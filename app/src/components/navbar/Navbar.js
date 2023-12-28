import React, { useState } from "react";
import styled from "@emotion/styled";
import SearchContainer from "./NavbarSearch";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import {
  Box,
  Grid,
  ListItemButton,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar,
  Tooltip,
  useMediaQuery,
  Divider,
} from "@mui/material";

import { Menu as MenuIcon } from "@mui/icons-material";

import NavbarNotificationsDropdown from "./NavbarNotificationsDropdown";
import NavbarCreationDropdown from "./NavbarCreationDropdown";
import NavbarLanguagesDropdown from "./NavbarLanguagesDropdown";
import NavbarUserDropdown from "./NavbarUserDropdown";

import Logo from "@/public/static/svg/logo.svg";
import { useTheme } from "@mui/system";

const AppBar = styled(MuiAppBar)`
  background: ${(props) =>
    props.ecolor ? props.ecolor : props.theme.header.background};
  color: ${(props) => props.theme.header.color};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const BrandIcon = styled(Logo)`
  color: ${(props) => props.theme.sidebar.header.brand.color};
  fill: ${(props) => props.theme.sidebar.header.brand.color};
  width: 36px;
  height: 36px;
  display: none; // Hide for now.

  ${(props) => props.theme.breakpoints.up("md")} {
    display: none;
  }
`;

const Brand = styled(ListItemButton)`
  font-size: ${(props) => props.theme.typography.h4.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;
  padding-top: ${(props) => props.theme.spacing(3.5)};
  padding-left: ${(props) => props.theme.spacing(0)};
  padding-right: ${(props) => props.theme.spacing(0)};
  cursor: pointer;
  flex-grow: 0;
  display: block;

  ${(props) => props.theme.breakpoints.up("md")} {
    display: none;
  }
`;

function NavbarSearch({ toggleSearch }) {
  return (
    <React.Fragment>
      <Tooltip title="Search">
        <IconButton color="inherit" onClick={toggleSearch} size="large">
          <FontAwesomeIcon icon={faSearch} />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
}

const SubToolbar = styled(Toolbar)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
`;

const SearchMiniBar = ({ ecolor }) => {
  return (
    <SubToolbar>
      <SearchContainer ecolor={ecolor} />
    </SubToolbar>
  );
};

const Navbar = ({ onDrawerToggle, ecolor, section }) => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const theme = useTheme();
  const smallerThanMid = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <React.Fragment>
      <AppBar position="sticky" elevation={0} ecolor={ecolor}>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item sx={{ display: { xs: "block", md: "none" } }}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={onDrawerToggle}
                size="large"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <BrandIcon />
              <Brand ecolor={ecolor}>
                <Box ml={1} mr={2}>
                  OpenML
                </Box>
              </Brand>
            </Grid>
            <Grid item>
              {section && <Brand ecolor={ecolor}>|&nbsp;&nbsp;{section}</Brand>}
            </Grid>
            <Grid item xs sx={{ display: { xs: "block", sm: "none" } }} />
            <Grid item sx={{ display: { xs: "none", md: "block" } }}>
              <SearchContainer ecolor={ecolor} />
            </Grid>
            <Grid item xs />
            <Grid item>
              <Grid container>
                <Grid item xs sx={{ display: { xs: "block", md: "none" } }}>
                  <NavbarSearch
                    toggleSearch={() => setShowSearchBar((prev) => !prev)}
                  />
                </Grid>
                <Divider
                  orientation="vertical"
                  flexItem
                  variant="middle"
                  sx={{ display: { xs: "block", md: "none" }, m: 2 }}
                />
                <Grid item>
                  <NavbarLanguagesDropdown />
                  {!smallerThanMid && <NavbarCreationDropdown />}
                  <NavbarNotificationsDropdown />
                  <NavbarUserDropdown />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
        {showSearchBar && smallerThanMid && <SearchMiniBar ecolor={ecolor} />}
      </AppBar>
    </React.Fragment>
  );
};

export default Navbar;
