import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import SearchContainer from "./NavbarSearch";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import {
  Grid,
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
import Brand from "./NavBrand";

import { useTheme } from "@mui/system";

const AppBar = styled(MuiAppBar)`
  background: ${(props) =>
    props.ecolor ? props.ecolor : props.theme.palette.header.background};
  color: ${(props) => props.theme.palette.header.color};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
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
            <Grid sx={{ display: { xs: "block", md: "none" } }}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={onDrawerToggle}
                size="large"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid>
              <Brand ecolor={ecolor} section={section} />
            </Grid>
            <Grid sx={{ display: { xs: "block", sm: "none" } }} size="grow" />
            <Grid sx={{ display: { xs: "none", md: "block" } }}>
              <SearchContainer ecolor={ecolor} />
            </Grid>
            <Grid size="grow" />
            <Grid>
              <Grid container>
                <Grid sx={{ display: { xs: "block", md: "none" } }} size="grow">
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
                <Grid>
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
