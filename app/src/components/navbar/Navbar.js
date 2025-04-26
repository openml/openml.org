import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/system";
import {
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar,
  Tooltip,
  Box,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Menu as MenuIcon } from "@mui/icons-material";

import NavbarNotificationsDropdown from "./NavbarNotificationsDropdown";
import NavbarCreationDropdown from "./NavbarCreationDropdown";
import NavbarLanguagesDropdown from "./NavbarLanguagesDropdown";
import NavbarUserDropdown from "./NavbarUserDropdown";
import SearchContainer from "./NavbarSearch";
import Brand from "./NavBrand";

const AppBar = styled(MuiAppBar)(({ theme, ecolor }) => ({
  background: ecolor || theme.palette.header.background,
  color: theme.palette.header.color,
}));

const IconButtonStyled = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const SubToolbar = styled(Toolbar)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
`;

function NavbarSearch({ toggleSearch }) {
  return (
    <Tooltip title="Search">
      <IconButtonStyled color="inherit" onClick={toggleSearch} size="large">
        <FontAwesomeIcon icon={faSearch} />
      </IconButtonStyled>
    </Tooltip>
  );
}

const SearchMiniBar = ({ ecolor }) => (
  <SubToolbar>
    <SearchContainer ecolor={ecolor} />
  </SubToolbar>
);

const Navbar = ({ onDrawerToggle, ecolor, section }) => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <AppBar position="sticky" elevation={0} ecolor={ecolor}>
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: 2,
            }}
          >
            {/* Drawer Toggle (mobile only) */}
            <IconButtonStyled
              color="inherit"
              aria-label="Open drawer"
              onClick={onDrawerToggle}
              size="large"
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButtonStyled>

            {/* Brand */}
            <Brand ecolor={ecolor} section={section} />

            {/* Spacer */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Search on desktop */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <SearchContainer ecolor={ecolor} />
            </Box>

            {/* Spacer */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Right-side Icons */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {/* Search IconButton on mobile */}
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <NavbarSearch toggleSearch={() => setShowSearchBar((prev) => !prev)} />
              </Box>

              {/* Divider on mobile */}
              <Divider
                orientation="vertical"
                flexItem
                sx={{ display: { xs: "flex", md: "none" }, mx: 1 }}
              />

              <NavbarLanguagesDropdown />
              {!isMobile && <NavbarCreationDropdown />}
              <NavbarNotificationsDropdown />
              <NavbarUserDropdown />
            </Box>
          </Box>
        </Toolbar>

        {/* Search bar (mobile only) */}
        {showSearchBar && isMobile && <SearchMiniBar ecolor={ecolor} />}
      </AppBar>
    </>
  );
};

export default Navbar;