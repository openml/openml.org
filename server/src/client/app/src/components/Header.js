import React, { Component } from "react";
import styled, { withTheme } from "styled-components";
import { darken } from "polished";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import axios from "axios";

import {
  Grid,
  Hidden,
  InputBase,
  Menu,
  Button,
  MenuItem,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar
} from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MainContext } from "../App.js";

const AppBar = styled(MuiAppBar)`
  background: ${props => props.theme.header.background};
  color: ${props => props.theme.header.color};
  box-shadow: ${props => props.theme.shadows[1]};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Search = styled.div`
  border-radius: 2px;
  background-color: ${props =>
    props.bg === "Gradient" ? "transparent" : props.theme.header.background};
  display: none;
  position: relative;
  width: 100%;

  &:hover {
    background-color: ${props =>
      props.bg === "Gradient"
        ? "transparent"
        : darken(0.05, props.theme.header.background)};
  }

  ${props => props.theme.breakpoints.up("xs")} {
    display: block;
  }
`;

const SearchIconWrapper = styled.div`
  width: 50px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;

  > input {
    color: ${props =>
      props.bg === "Gradient" ? "white" : props.theme.header.search.color};
    padding-top: ${props => props.theme.spacing(2.5)}px;
    padding-right: ${props => props.theme.spacing(2.5)}px;
    padding-bottom: ${props => props.theme.spacing(2.5)}px;
    padding-left: ${props => props.theme.spacing(12)}px;
    width: 80%;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
    color: black;
  }
`;

const WhiteIcon = styled(FontAwesomeIcon)`
  color: ${props => (props.bg === "Gradient" ? "white" : "inherit")};
`;

const UserButton = styled(Button)`
  color: ${props => (props.bg === "Gradient" ? "white" : "inherit")};
  border-color: ${props => (props.bg === "Gradient" ? "white" : "inherit")};
`;

class UserMenu extends Component {
  state = {
    anchorMenu: null
  };

  toggleMenu = event => {
    this.setState({ anchorMenu: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({ anchorMenu: null });
  };

  render() {
    const { anchorMenu } = this.state;
    const open = Boolean(anchorMenu);
    const loggedOut = !this.props.loggedIn;
    return (
      <MainContext.Consumer>
        {context => (
          <React.Fragment>
            {loggedOut ? (
              <React.Fragment>
                <StyledLink to="/auth/sign-in">
                  <UserButton bg={this.props.bg}>Sign In</UserButton>
                </StyledLink>
                <StyledLink to="/auth/sign-up">
                  <UserButton
                    bg={this.props.bg}
                    variant="outlined"
                    style={{ marginLeft: 10 }}
                  >
                    Sign Up
                  </UserButton>
                </StyledLink>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <IconButton
                  aria-owns={open ? "menu-appbar" : undefined}
                  aria-haspopup="true"
                  onClick={this.toggleMenu}
                  color="inherit"
                >
                  <WhiteIcon icon={["far", "user"]} bg={this.props.bg} />
                </IconButton>
              </React.Fragment>
            )}
            <Menu
              id="menu-appbar"
              anchorEl={anchorMenu}
              open={open}
              onClose={this.closeMenu}
            >
              <MenuItem
                onClick={() => {
                  this.closeMenu();
                }}
              >
                <StyledLink to="/auth/profile-page">Profile</StyledLink>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  const yourConfig = {
                    headers: {
                      Authorization: "Bearer " + localStorage.getItem("token")
                    }
                  };
                  axios
                    .post(
                      process.env.REACT_APP_SERVER_URL + "logout",
                      {
                        logout: "true"
                      },
                      yourConfig
                    )
                    .then(response => {
                      console.log(response.data);
                      context.logOut();
                      context.setOpaqueSearch(false);
                    })
                    .catch(error => {
                      console.log(error);
                    });
                  this.closeMenu();
                }}
              >
                <StyledLink to="/">Sign out</StyledLink>
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </MainContext.Consumer>
    );
  }
}

const FlexAppBar = styled(AppBar)`
  background: ${props => (props.bg === "Gradient" ? "transparent" : "")};
  box-shadow: ${props => (props.bg === "Gradient" ? "none" : "")};
`;

const Header = ({ onDrawerToggle, bg, routes }) => (
  <React.Fragment>
    <MainContext.Consumer>
      {context => (
        <FlexAppBar
          position="sticky"
          elevation={0}
          bg={context.opaqueSearch ? "" : bg}
          onClick={() => context.setOpaqueSearch(true)}
        >
          <Toolbar>
            <Grid container alignItems="center">
              <Hidden mdUp>
                <Grid item>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={onDrawerToggle}
                  >
                    <WhiteIcon
                      icon="bars"
                      bg={context.opaqueSearch ? "" : bg}
                    />
                  </IconButton>
                </Grid>
              </Hidden>
              <Grid item xs={6} md={8}>
                <Search bg={context.opaqueSearch ? "" : bg}>
                  <SearchIconWrapper>
                    <WhiteIcon
                      icon="search"
                      bg={context.opaqueSearch ? "" : bg}
                    />
                  </SearchIconWrapper>
                  <Input
                    placeholder="Search datasets…"
                    bg={context.opaqueSearch ? "" : bg}
                    onKeyPress={event => {
                      if (event.charCode === 13) {
                        event.preventDefault();
                        context.setQuery(event.target.value);
                      }
                    }}
                  />
                </Search>
              </Grid>
              <Grid item xs />
              <Grid item>
                <UserMenu
                  bg={context.opaqueSearch ? "" : bg}
                  loggedIn={context.loggedIn}
                />
              </Grid>
            </Grid>
          </Toolbar>
        </FlexAppBar>
      )}
    </MainContext.Consumer>
    <Loader />
  </React.Fragment>
);

export default withTheme(Header);
