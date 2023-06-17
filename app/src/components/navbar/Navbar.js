import React, { memo } from "react";
import styled from "@emotion/styled";
import { darken } from "polished";
import { useTranslation } from "react-i18next";
import searchConfig from "../../pages/d/searchConfig";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import {
  Box,
  Grid,
  ListItemButton,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar,
  InputBase,
} from "@mui/material";

import { SearchProvider, SearchBox } from "@elastic/react-search-ui";

import { Menu as MenuIcon } from "@mui/icons-material";

import NavbarNotificationsDropdown from "./NavbarNotificationsDropdown";
import NavbarCreationDropdown from "./NavbarCreationDropdown";
import NavbarLanguagesDropdown from "./NavbarLanguagesDropdown";
import NavbarUserDropdown from "./NavbarUserDropdown";

import Logo from "../../vendor/logo.svg";

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

const SearchWrapper = styled(Box)`
  border-radius: 2px;
  background-color: ${(props) =>
    props.ecolor ? props.ecolor : props.theme.header.background};
  position: relative;
  width: 100%;
  color: ${(props) => props.theme.sidebar.header.brand.color};

  &:hover {
    background-color: ${(props) =>
      darken(
        0.05,
        props.ecolor ? props.ecolor : props.theme.header.background
      )};
  }

  ${(props) => props.theme.breakpoints.down("md")} {
    margin-left: ${(props) => props.theme.spacing(8)};
  }

  ${(props) => props.theme.breakpoints.down("sm")} {
    margin: 0 auto;
    display: flex;
  }

  svg {
    width: 19px;
    height: 19px;
    padding-top: ${(props) => props.theme.spacing(2.5)};
    padding-bottom: ${(props) => props.theme.spacing(2.5)};
    padding-left: ${(props) => props.theme.spacing(2.5)};
  }
`;

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;

  > input {
    color: ${(props) => props.theme.header.search.color};
    padding-top: ${(props) => props.theme.spacing(2.5)};
    padding-right: ${(props) => props.theme.spacing(2.5)};
    padding-bottom: ${(props) => props.theme.spacing(2.5)};
    padding-left: ${(props) => props.theme.spacing(2.5)};
    min-width: 260px;
    max-width: 100%;
  }

  & > input::placeholder {
    opacity: 0.8;
  }

  ${(props) => props.theme.breakpoints.down("sm")} {
    & > input::placeholder {
      width: 47px;
    }
    & > input {
      min-width: 200px;
    }
  }
  ${(props) => props.theme.breakpoints.up("md")} {
    & > input {
      min-width: 400px;
    }
  }
  ${(props) => props.theme.breakpoints.up("lg")} {
    & > input {
      min-width: 600px;
    }
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
  display: block; // Hide for now.

  ${(props) => props.theme.breakpoints.up("md")} {
    display: none;
  }
`;

const SearchBar = memo(({ config }) => {
  const { t } = useTranslation();

  return (
    <SearchProvider config={config}>
      <SearchBox
        searchAsYouType={true}
        debounceLength={300}
        autocompleteMinimumCharacters={3}
        autocompleteResults={{
          linkTarget: "_blank",
          sectionTitle: "Results",
          titleField: "name",
          urlField: "url",
          shouldTrackClickThrough: true,
          clickThroughTags: ["test"],
        }}
        autocompleteSuggestions={true}
        onSubmit={(searchTerm) => {
          window.location.href = `d/search?q=${searchTerm}`;
        }}
        inputView={({ getAutocomplete, getInputProps, getButtonProps }) => (
          <>
            <Input
              {...getInputProps({
                placeholder: t("Search"),
              })}
            />
            {getAutocomplete()}
          </>
        )}
      />
    </SearchProvider>
  );
});

SearchBar.displayName = "Search";

const Navbar = ({ onDrawerToggle, ecolor }) => {
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
                <Box ml={1} mr={3}>
                  OpenML
                </Box>
              </Brand>
            </Grid>
            <Grid item xs sx={{ display: { xs: "block", sm: "none" } }} />
            <Grid item>
              <SearchWrapper
                ecolor={ecolor}
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <FontAwesomeIcon icon={faSearch} />
                <SearchBar config={searchConfig} />
              </SearchWrapper>
            </Grid>
            <Grid item xs />
            <Grid item>
              {/*
              <NavbarNotificationsDropdown />
              <NavbarLanguagesDropdown />
              */}
              <NavbarCreationDropdown />
              <NavbarUserDropdown />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Navbar;

//<Search ecolor={ecolor}>
//  <AsyncSelect
//    defaultOptions
//    instanceId="navsearch"
//    isClearable={true}
//    placeholder={t("Search")}
//    onChange={async () => {}}
//    loadOptions={async () => {}}
//    styles={searchStyle(ecolor, theme)}
//    components={{
//      IndicatorSeparator: () => null,
//      DropdownIndicator: () => (
//        <FontAwesomeIcon icon={faSearch} />
//      ),
//   }}
//  />
//</Search>

const searchStyle = (ecolor, theme) => {
  return {
    control: (baseStyles, state) => ({
      ...baseStyles,
      background: "transparent",
      borderColor: "transparent",
      color: theme.header.search.color,
      boxShadow: "none",
      border: 0,
      minWidth: 250,
      paddingTop: theme.spacing(2.5),
      paddingBottom: theme.spacing(2.5),
      flexDirection: "row-reverse",
      paddingLeft: 10,
    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
      borderRadius: 0,
      marginTop: 0,
      paddingTop: theme.spacing(2.5),
      paddingBottom: theme.spacing(2.5),
    }),
    menuList: (baseStyles, state) => ({
      ...baseStyles,
      padding: 0,
    }),
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: theme.header.search.color,
      };
    },
    input: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: theme.header.search.color,
      };
    },
    dropdownIndicator: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: theme.header.search.color,
      };
    },
  };
};
