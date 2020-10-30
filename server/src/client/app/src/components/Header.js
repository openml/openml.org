import React, { Component } from "react";
import styled, { withTheme, css } from "styled-components";
import { darken } from "polished";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import axios from "axios";

import {
  Box,
  Grid,
  Hidden,
  InputBase,
  Menu,
  Button,
  MenuItem,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar,
  CardHeader,
  ListItemIcon,
  Avatar
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import {
  blue,
  yellow,
  orange,
  red,
  green,
  purple
} from "@material-ui/core/colors";

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
  ${props =>
    props.bg === "Gradient" &&
    css`
      background: transparent;
    `}
  ${props =>
    props.bg !== "Gradient" &&
    props.searchcolor &&
    props.currenttheme === 1 &&
    css`
      background-color: ${props => props.searchcolor};
    `}
  border-radius: 2px;
  display: none;
  position: relative;
  width: 100%;

  &:hover {
    background-color: ${props =>
      props.bg === "Gradient"
        ? "transparent"
        : darken(0.05, props.theme.header.background)};
    ${props =>
      props.bg !== "Gradient" &&
      props.searchcolor &&
      props.currenttheme === 1 &&
      css`
        background-color: ${props => darken(0.05, props.searchcolor)};
      `}
  }

  ${props => props.theme.breakpoints.up("md")} {
    display: inline-block;
    margin-left: 60px;
  }
  ${props => props.theme.breakpoints.up("lg")} {
    display: inline-block;
    margin-left: 0px;
  }
  ${props =>
    props.bg === "" &&
    css`
      display: block;
    `}
`;

const SearchIconWrapper = styled.div`
  width: 30px;
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
    padding-left: ${props => props.theme.spacing(8)}px;
    width: 80%;
  }

  > input::placeholder {
    color: ${props =>
      props.bg === "Gradient" ? "white" : props.theme.header.search.color};
    opacity: 0.8;
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
  color: ${props =>
    props.bg === "Gradient" ? "white" : props.theme.header.color};
`;

const UserButton = styled(Button)`
  display: ${props => (props.bg === "" ? "none" : "inline-block")};
  color: ${props =>
    props.bg === "Gradient" || props.currenttheme === 1 ? "white" : "inherit"};
  border-color: ${props => (props.bg === "Gradient" ? "white" : "inherit")};

  ${props => props.theme.breakpoints.up("md")} {
    display: inline-block;
  }
`;
const SearchButton = styled(Button)`
  color: ${props =>
    props.bg === "Gradient" || props.theme === 1 ? "white" : "inherit"};
`;
const SlimCardHeader = styled(CardHeader)({
  padding: 0,
  marginRight: 0
});

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5"
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    {...props}
  />
));

const StyledMenuItem = styled(MenuItem)`
  &:hover {
    background-color: ${props => props.theme.palette.primary.main};
  }
  ,
  .MuiListItemIcon-root {
    min-width: 36px;
  }
`;

class UserMenu extends Component {
  state = {
    anchorMenu: null,
    anchorNewMenu: null,
    avatarColor: blue
  };

  toggleMenu = event => {
    this.setState({ anchorMenu: event.currentTarget });
  };
  toggleNewMenu = event => {
    this.setState({ anchorNewMenu: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({ anchorMenu: null, anchorNewMenu: null });
  };

  randomColor = () => {
    let colors = [blue, orange, red, green, purple];
    return colors[Math.floor(Math.random() * colors.length)][
      Math.floor(Math.random() * 7 + 3) * 100
    ];
  };

  componentDidMount() {
    this.setState({ avatarColor: this.randomColor() });
  }

  render() {
    const { anchorMenu, anchorNewMenu, avatarColor } = this.state;
    const open = Boolean(anchorMenu);
    const newOpen = Boolean(anchorNewMenu);
    const loggedOut = !this.props.loggedIn;

    return (
      <MainContext.Consumer>
        {context => (
          <React.Fragment>
            {loggedOut ? (
              <React.Fragment>
                <StyledLink to="/auth/sign-in">
                  <UserButton
                    bg={this.props.bg}
                    currenttheme={context.currentTheme}
                  >
                    Sign In
                  </UserButton>
                </StyledLink>
                <StyledLink to="/auth/sign-up">
                  <Box display={{ xs: "none", sm: "none", md: "inline-block" }}>
                    <UserButton
                      bg={this.props.bg}
                      currenttheme={context.currentTheme}
                      variant="outlined"
                      style={{ marginLeft: 10 }}
                    >
                      Sign Up
                    </UserButton>
                  </Box>
                </StyledLink>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <IconButton
                  aria-owns={newOpen ? "menu-new" : undefined}
                  aria-haspopup="true"
                  onClick={this.toggleNewMenu}
                  color="inherit"
                >
                  <WhiteIcon
                    bg={this.props.bg}
                    icon="plus"
                    style={{
                      height: 20,
                      width: 20
                    }}
                  />
                </IconButton>
                <IconButton
                  aria-owns={open ? "menu-appbar" : undefined}
                  aria-haspopup="true"
                  onClick={this.toggleMenu}
                  color="inherit"
                >
                  <SlimCardHeader
                    avatar={
                      <Avatar
                        src={context.userImage}
                        style={{
                          height: 40,
                          width: 40,
                          marginRight: -16,
                          backgroundColor: avatarColor
                        }}
                      >
                        {context.userInitials}
                      </Avatar>
                    }
                  />
                </IconButton>
              </React.Fragment>
            )}
            <StyledMenu
              id="menu-new"
              anchorEl={anchorNewMenu}
              open={newOpen}
              keepMounted
              onClose={this.closeMenu}
            >
              <StyledMenuItem
                onClick={() => {
                  this.closeMenu();
                }}
              >
                <ListItemIcon>
                  <FontAwesomeIcon
                    icon={["fas", "database"]}
                    style={{ color: green[400] }}
                  />
                </ListItemIcon>
                <StyledLink to="/auth/upload-dataset">New dataset</StyledLink>
              </StyledMenuItem>
              <StyledMenuItem
                onClick={() => {
                  this.closeMenu();
                }}
              >
                <ListItemIcon>
                  <FontAwesomeIcon
                    icon={["fas", "flag"]}
                    style={{ color: yellow[700] }}
                  />
                </ListItemIcon>
                <StyledLink to="/auth/upload-task">New task</StyledLink>
              </StyledMenuItem>
              <StyledMenuItem
                onClick={() => {
                  this.closeMenu();
                }}
              >
                <ListItemIcon>
                  <FontAwesomeIcon
                    icon={["fas", "layer-group"]}
                    style={{ color: purple[400] }}
                  />
                </ListItemIcon>
                <StyledLink to="/auth/upload-collection-tasks">
                  New collection
                </StyledLink>
              </StyledMenuItem>
            </StyledMenu>
            <StyledMenu
              id="menu-appbar"
              anchorEl={anchorMenu}
              open={open}
              keepMounted
              onClose={this.closeMenu}
            >
              <StyledMenuItem
                onClick={() => {
                  this.closeMenu();
                }}
              >
                <ListItemIcon>
                  <FontAwesomeIcon icon={["far", "address-card"]} />
                </ListItemIcon>
                <StyledLink to="/auth/profile-page">Your profile</StyledLink>
              </StyledMenuItem>
              <StyledMenuItem
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
                      context.setSearchActive(false);
                    })
                    .catch(error => {
                      console.log(error);
                    });
                  this.closeMenu();
                }}
              >
                <ListItemIcon>
                  <FontAwesomeIcon icon="power-off" />
                </ListItemIcon>
                <StyledLink to="/">Sign out</StyledLink>
              </StyledMenuItem>
            </StyledMenu>
          </React.Fragment>
        )}
      </MainContext.Consumer>
    );
  }
}

const FlexAppBar = styled(AppBar)`
  ${props =>
    props.bg === "Gradient" &&
    css`
      background: transparent;
    `}
  ${props =>
    props.bg !== "Gradient" &&
    props.searchcolor &&
    props.currenttheme === 1 &&
    css`
      background-color: ${props => props.searchcolor};
    `}
  box-shadow: ${props =>
    props.bg === "Gradient" || props.searchcolor ? "none" : ""};
`;

const Header = ({ onDrawerToggle, bg, routes }) => (
  <React.Fragment>
    <MainContext.Consumer>
      {context => (
        <FlexAppBar
          position="sticky"
          elevation={0}
          bg={context.searchActive ? "" : bg}
          searchcolor={context.getColor()}
          currenttheme={context.currentTheme}
        >
          <Toolbar>
            <Grid container alignItems="center">
              <Hidden lgUp>
                <Grid item>
                  <IconButton aria-label="Open drawer" onClick={onDrawerToggle}>
                    <WhiteIcon
                      icon="bars"
                      bg={context.searchActive ? "" : bg}
                      color="inherit"
                    />
                  </IconButton>
                </Grid>
                <Grid item>
                  <StyledLink to="/">
                    <UserButton
                      bg={context.searchActive ? "" : bg}
                      currenttheme={context.currentTheme}
                      style={{
                        fontSize: 18,
                        width: 90
                      }}
                    >
                      Open ML
                    </UserButton>
                  </StyledLink>
                </Grid>
              </Hidden>
              <Grid
                item
                xs={context.searchActive ? 7 : 1}
                sm={context.searchActive ? 9 : 1}
                md={context.searchActive ? 7 : 5}
                lg={context.searchActive ? 10 : 5}
              >
                <Search
                  bg={context.searchActive ? "" : bg}
                  searchcolor={context.getColor()}
                  currenttheme={context.currentTheme}
                  onClick={() => context.setSearchActive(true)}
                >
                  <SearchIconWrapper>
                    <WhiteIcon
                      icon="search"
                      bg={context.searchActive ? "" : bg}
                    />
                  </SearchIconWrapper>
                  <Input
                    placeholder={"Search " + context.getSearchTopic()}
                    bg={context.searchActive ? "" : bg}
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
                <Box display={{ xs: "inline-block", md: "none" }}>
                  <SearchButton
                    bg={context.searchActive ? "" : bg}
                    theme={context.currentTheme}
                    onClick={context.toggleSearch}
                  >
                    {context.searchActive ? (
                      <FontAwesomeIcon icon="times" />
                    ) : (
                      "Search"
                    )}
                  </SearchButton>
                </Box>
              </Grid>
              <Grid item>
                <UserMenu
                  bg={context.searchActive ? "" : bg}
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
