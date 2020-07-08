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
    const { theme, ...other } = this.props;

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
                      context.setOpaqueSearch(false);
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
                <Search
                  bg={context.opaqueSearch ? "" : bg}
                  onClick={() => context.setOpaqueSearch(true)}
                >
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
