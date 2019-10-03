import React from "react";
import styled from "styled-components";
import { rgba } from "polished";
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import { blue, green, grey, indigo} from "@material-ui/core/colors";

import { NavLink as RouterNavLink, withRouter } from "react-router-dom";
import { darken } from "polished";

import PerfectScrollbar from "react-perfect-scrollbar";

import { spacing } from "@material-ui/system";

import { ThemeContext } from "../App.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Box as MuiBox,
  Grid,
  Chip,
  Link as MuiLink,
  ListItem,
  ListItemText,
  Drawer as MuiDrawer,
  List as MuiList,
  Typography
} from "@material-ui/core";

import routes from "../routes/index";

const NavLink = React.forwardRef((props, ref) => (
  <RouterNavLink innerRef={ref} {...props} />
));

const SimpleLink = styled(MuiLink)`
  text-decoration: none;

  &:focus, &:hover, &:visited, &:link, &:active {
      text-decoration: none;
  }
`;


const Box = styled(MuiBox)(spacing);

const Drawer = styled(MuiDrawer)`
  border-right: 0;

  > div {
    border-right: 0;
  }
`;

const Scrollbar = styled(PerfectScrollbar)`
  background-color: ${props => props.theme.sidebar.background};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  width: 260px;
  overflow-x: hidden;

  .scrollbar-container {
  position: relative;
  height: 100%;
  }

  .ps {
    overflow: hidden;
    touch-action: auto;
  }

  .ps__rail-x {
    display: none;
    opacity: 0;
    transition: background-color .2s linear, opacity .2s linear;
    height: 15px;
    bottom: 0px;
    position: absolute;
  }

  .ps__rail-y {
    display: none;
    opacity: 0;
    transition: background-color .2s linear, opacity .2s linear;
    width: 15px;
    right: 0;
    position: absolute;
  }

  .ps--active-x > .ps__rail-x,
  .ps--active-y > .ps__rail-y {
    display: block;
    background-color: transparent;
  }

  .ps:hover > .ps__rail-x,
  .ps:hover > .ps__rail-y,
  .ps--focus > .ps__rail-x,
  .ps--focus > .ps__rail-y,
  .ps--scrolling-x > .ps__rail-x,
  .ps--scrolling-y > .ps__rail-y {
    opacity: 0.6;
  }

  .ps__thumb-x {
    background-color: #aaa;
    border-radius: 6px;
    transition: background-color .2s linear, height .2s ease-in-out;
    height: 6px;
    bottom: 2px;
    position: absolute;
  }

  .ps__thumb-y {
    background-color: #aaa;
    border-radius: 6px;
    transition: background-color .2s linear, width .2s ease-in-out;
    width: 6px;
    right: 2px;
    position: absolute;
  }
`;

const List = styled(MuiList)`
  background-color: ${props => props.theme.sidebar.background};
`;

const Items = styled.div`
  padding-top: ${props => props.theme.spacing(2.5)}px;
  padding-bottom: ${props => props.theme.spacing(2.5)}px;
`;

const Brand = styled(ListItem)`
  font-size: ${props => props.theme.typography.h5.fontSize};
  font-weight: ${props => props.theme.typography.fontWeightMedium};
  color: ${props => props.theme.sidebar.header.color};
  background-color: ${props => props.theme.sidebar.header.background};
  font-family: ${props => props.theme.typography.fontFamily};
  min-height: 56px;
  padding-left: ${props => props.theme.spacing(3)}px;
  padding-right: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }
`;

const Category = styled(ListItem)`
  padding-top: ${props => props.theme.spacing(3)}px;
  padding-bottom: ${props => props.theme.spacing(3)}px;
  padding-left: ${props => props.theme.spacing(4)}px;
  padding-right: ${props => props.theme.spacing(6)}px;
  font-weight: ${props => props.theme.typography.fontWeightRegular};

  svg {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }

  &.${props => props.activeClassName} {
    background-color: ${props => darken(0.05, props.theme.sidebar.background)};

    span {
      color: ${props => props.theme.sidebar.color};
    }
  }
`;

const CategoryText = styled(ListItemText)`
  margin: 0;
  span {
    color: ${props => props.theme.sidebar.color};
    font-size: ${props => props.theme.typography.body1.fontSize}px;
    font-weight: ${props => props.theme.typography.fontWeightRegular};
    padding: 0 ${props => props.theme.spacing(5)}px;
  }
`;

const CategoryIcon = styled(FontAwesomeIcon)`
  color: ${props => rgba(props.theme.sidebar.color, 0.5)};
`;

const CountBadge = styled(Chip)`
  margin-top: 5px;
  font-size: 11px;
  height: 20px;
  position: absolute;
  right: 12px;
  top: 8px;
  color: ${props => props.theme.sidebar.color};
  background-color: unset;
  border: 1px solid ${props => props.theme.sidebar.color};
`;

const SidebarSection = styled(Typography)`
  color: ${props => props.theme.sidebar.color};
  padding: ${props => props.theme.spacing(2)}px
    ${props => props.theme.spacing(6)}px ${props => props.theme.spacing(1)}px;
  opacity: 0.9;
  display: block;
`;

const SidebarFooter = styled.div`
  padding: ${props => props.theme.spacing(4)}px
    ${props => props.theme.spacing(4)}px;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  color: ${props => props.theme.sidebar.color};
  background-color: ${props => props.theme.sidebar.background};
  width: 260px;
  overflow-x: hidden;
`;

const LightIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: grey[200],
    marginLeft: 10,
});
const DarkIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: grey[800],
    marginLeft: 10,
});
const GreenIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: green[400],
    marginLeft: 10,
});
const BlueIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: blue[400],
    marginLeft: 10,
});
const IndigoIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: indigo[400],
    marginLeft: 10,
});
const SpacedIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    marginLeft: 10,
});

function SidebarCategory({
  name,
  icon,
  classes,
  isOpen,
  isCollapsable,
  badge,
  ...rest
}) {
  return (
    <Category {...rest}>
      {icon}
      <CategoryText>{name}</CategoryText>
      {isCollapsable ? (
        isOpen ? (
          <CategoryIcon icon="chevron-up" />
        ) : (
          <CategoryIcon icon="chevron-down" />
        )
      ) : null}
      {badge ? <CountBadge label={badge} /> : ""}
    </Category>
  );
}

function SidebarLink({ name, to, badge, icon }) {
  return (
    <SimpleLink
      href={to}
      target="_blank"
      rel="noreferrer"
    >
      <Category>
        {icon}
        <CategoryText>{name}</CategoryText>
      </Category>
    </SimpleLink>
  );
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  toggle = index => {
    // Collapse all elements
    Object.keys(this.state).forEach(
      item =>
        this.state[index] ||
        this.setState(() => ({
          [item]: false
        }))
    );

    // Toggle selected element
    this.setState(state => ({
      [index]: !state[index]
    }));
  };

  componentDidMount() {
    /* Open collapse element that matches current url */
    const pathName = this.props.location.pathname;

    routes.forEach((route, index) => {
      const isActive = pathName.indexOf(route.path) === 0;
      const isOpen = route.open;
      const isHome = route.containsHome && pathName === "/" ? true : false;

      this.setState(() => ({
        [index]: isActive || isOpen || isHome
      }));
    });
  }

  render() {
    const { classes, staticContext, ...other } = this.props;

    return (
      <Drawer variant="permanent" {...other}>
        <SimpleLink href="/">
          <Brand>
            <Icon style={{ fontSize: 39, overflow: 'visible', textAlign: 'center', marginRight: 5 }}>
              <img alt='' height='100%' src="openml.svg" style={{ paddingBottom: 5 }}/>
            </Icon>
            <Box ml={1}>OpenML</Box>
          </Brand>
        </SimpleLink>
        <Scrollbar>
        <ThemeContext.Consumer>
          {(context) => (
            <List disablePadding>
              <Items>
                {routes.map((category, index) => (
                  <React.Fragment key={index}>
                    {category.header && !context.state.miniDrawer ? (
                      <SidebarSection variant="caption">
                        {category.header}
                      </SidebarSection>
                    ) : null}
                    {category.header && category.header !== 'Discover' &&
                     context.state.miniDrawer ? (
                    <hr />
                    ) : null}
                    {category.component ? (
                      <React.Fragment key={index}>
                      <SidebarCategory
                        isCollapsable={false}
                        name={category.id}
                        to={category.path}
                        activeClassName="active"
                        component={NavLink}
                        icon={category.icon}
                        exact
                        badge={category.badge}
                      />
                      </React.Fragment>
                    ) : (
                      <SidebarLink
                        isCollapsable={false}
                        name={category.id}
                        to={category.path}
                        activeClassName="active"
                        component={SimpleLink}
                        icon={category.icon}
                        badge={category.badge}
                      />
                    )}
                  </React.Fragment>
                ))}
              </Items>
            </List>
          )}
          </ThemeContext.Consumer>
        </Scrollbar>
        <SidebarFooter>
          <ThemeContext.Consumer>
          {(context) => (
          <Grid container spacing={4}>
                <Grid item>
                  {context.state.miniDrawer
                    ? <SpacedIcon icon="chevron-right" size="lg" onClick={() => context.miniDrawerToggle()} />
                    : <SpacedIcon icon="chevron-left" size="lg" onClick={() => context.miniDrawerToggle()} />
                  }
                </Grid>
                <Grid item>
                  <Tooltip title="Switch to Light theme" placement="top-start">
                    <div style={{display:'inline-block'}}><LightIcon icon="splotch" size="lg" onClick={() => context.setTheme(1)} /></div>
                  </Tooltip>
                  <Tooltip title="Switch to Dark theme" placement="top-start">
                    <div style={{display:'inline-block'}}><DarkIcon icon="splotch" size="lg" onClick={() => context.setTheme(0)} /></div>
                  </Tooltip>
                  <Tooltip title="Switch to Green theme" placement="top-start">
                    <div style={{display:'inline-block'}}><GreenIcon icon="splotch" size="lg" onClick={() => context.setTheme(3)} /></div>
                  </Tooltip>
                  <Tooltip title="Switch to Blue theme" placement="top-start">
                    <div style={{display:'inline-block'}}><BlueIcon icon="splotch" size="lg" onClick={() => context.setTheme(2)} /></div>
                  </Tooltip>
                  <Tooltip title="Switch to Indigo theme" placement="top-start">
                    <div style={{display:'inline-block'}}><IndigoIcon icon="splotch" size="lg" onClick={() => context.setTheme(4)} /></div>
                  </Tooltip>
                </Grid>
          </Grid>
          )}
        </ThemeContext.Consumer>
        </SidebarFooter>
      </Drawer>
    );
  }
}

export default withRouter(Sidebar);
