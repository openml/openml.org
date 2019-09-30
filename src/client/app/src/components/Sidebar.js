import React from "react";
import styled from "styled-components";
import { rgba } from "polished";
import Icon from '@material-ui/core/Icon';
import { blue, green, grey, indigo} from "@material-ui/core/colors";

import { NavLink as RouterNavLink, withRouter } from "react-router-dom";
import { darken } from "polished";

import PerfectScrollbar from "react-perfect-scrollbar";
import "../vendor/perfect-scrollbar.css";

import { spacing } from "@material-ui/system";

import { ThemeContext } from "../App.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Box as MuiBox,
  Collapse,
  Grid,
  Chip,
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

const Link = styled(ListItem)`
  padding-left: ${props => props.theme.spacing(15)}px;
  padding-top: ${props => props.theme.spacing(2)}px;
  padding-bottom: ${props => props.theme.spacing(2)}px;

  span {
    color: ${props => rgba(props.theme.sidebar.color, 0.7)};
  }

  &:hover span {
    color: ${props => rgba(props.theme.sidebar.color, 0.9)};
  }

  &.${props => props.activeClassName} {
    background-color: ${props => darken(0.06, props.theme.sidebar.background)};

    span {
      color: ${props => props.theme.sidebar.color};
    }
  }
`;

const LinkText = styled(ListItemText)`
  color: ${props => props.theme.sidebar.color};
  span {
    font-size: ${props => props.theme.typography.body1.fontSize}px;
  }
  margin-top: 0;
  margin-bottom: 0;
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
    marginLeft: 9,
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

function SidebarLink({ name, to, badge }) {
  return (
    <Link
      button
      dense
      component={NavLink}
      exact
      to={to}
      activeClassName="active"
    >
      <LinkText>{name}</LinkText>
      {badge ? <CountBadge label={badge} /> : ""}
    </Link>
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
        <Brand>
          <Icon style={{ fontSize: 39, overflow: 'visible', textAlign: 'center', marginRight: 5 }}>
            <img alt='' height='100%' src="openml.svg" style={{ paddingBottom: 5 }}/>
          </Icon>
          <Box ml={1}>OpenML</Box>
        </Brand>
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
                    {category.children ? (
                      <React.Fragment key={index}>
                        <SidebarCategory
                          isOpen={!this.state[index]}
                          isCollapsable={true}
                          name={category.id}
                          icon={category.icon}
                          button={true}
                          onClick={() => this.toggle(index)}
                        />

                        <Collapse
                          in={this.state[index]}
                          timeout="auto"
                          unmountOnExit
                        >
                          {category.children.map((route, index) => (
                            <SidebarLink
                              key={index}
                              name={route.name}
                              to={route.path}
                              icon={route.icon}
                              badge={route.badge}
                            />
                          ))}
                        </Collapse>
                      </React.Fragment>
                    ) : (
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
                  <LightIcon icon="splotch" size="lg" onClick={() => context.setTheme(1)} />
                  <DarkIcon icon="splotch" size="lg" onClick={() => context.setTheme(0)} />
                  <GreenIcon icon="splotch" size="lg" onClick={() => context.setTheme(3)} />
                  <BlueIcon icon="splotch" size="lg" onClick={() => context.setTheme(2)} />
                  <IndigoIcon icon="splotch" size="lg" onClick={() => context.setTheme(4)} />
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
