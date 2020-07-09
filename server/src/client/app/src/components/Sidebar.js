import React from "react";
import styled from "styled-components";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import { blue, green, grey, indigo } from "@material-ui/core/colors";

import { NavLink as RouterNavLink, withRouter } from "react-router-dom";
import { darken } from "polished";

import PerfectScrollbar from "react-perfect-scrollbar";

import { spacing } from "@material-ui/system";

import { MainContext } from "../App.js";

import { errorCheck } from "../pages/search/api.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Box as MuiBox,
  Grid,
  Chip,
  Collapse,
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

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
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
  position: relative;
  height: 100%;

  .ps {
    overflow: hidden;
    touch-action: auto;
  }

  .ps__rail-x {
    display: none;
    opacity: 0;
    transition: background-color 0.2s linear, opacity 0.2s linear;
    height: 15px;
    bottom: 0px;
    position: absolute;
  }

  .ps__rail-y {
    display: none;
    opacity: 0;
    transition: background-color 0.2s linear, opacity 0.2s linear;
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
    transition: background-color 0.2s linear, height 0.2s ease-in-out;
    height: 6px;
    bottom: 2px;
    position: absolute;
  }

  .ps__thumb-y {
    background-color: #aaa;
    border-radius: 6px;
    transition: background-color 0.2s linear, width 0.2s ease-in-out;
    width: 6px;
    right: 2px;
    position: absolute;
  }
`;

const List = styled(MuiList)`
  background-color: ${props => props.theme.sidebar.background};
  margin-top: -18px;
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
  padding-right: ${props => props.theme.spacing(1)}px;
  font-weight: ${props => props.theme.typography.fontWeightRegular};
  border-left: ${props => (props.activecategory === "true" ? "3px" : "0px")}
    solid ${props => props.currentcolor};

  svg {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }

  &.${props => props.activeClassName} {
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
    padding: 0 ${props => props.theme.spacing(4)}px;
  }
`;

const CategoryIcon = styled(FontAwesomeIcon)`
  color: ${props => props.currentcolor};
  width: 25px !important;
`;

const CountBadge = styled(Chip)`
  font-size: 11px;
  height: 20px;
  float: right;
  color: ${props => props.theme.sidebar.color};
  background-color: unset;
  border: none;
  margin-right: 10px;
`;

const SidebarSection = styled(Typography)`
  color: ${props => props.theme.sidebar.color};
  padding: ${props => props.theme.spacing(0)}px
    ${props => props.theme.spacing(4)}px ${props => props.theme.spacing(0)}px;
  opacity: 0.9;
  display: block;
  margin-bottom: 10px;
  font-size: 1rem;
  margin-top: 20px;
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
  cursor: "pointer",
  color: grey[200],
  marginLeft: 10
});
const DarkIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: grey[800],
  marginLeft: 10
});
const GreenIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: green[400],
  marginLeft: 10
});
const BlueIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: blue[400],
  marginLeft: 10
});
const IndigoIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: indigo[400],
  marginLeft: 10
});
const SpacedIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  marginLeft: 10
});

function SidebarCategory({
  name,
  icon,
  classes,
  isOpen,
  isCollapsable,
  badge,
  activecategory,
  searchExpand,
  currentcolor,
  ...rest
}) {
  return (
    <Category
      activecategory={activecategory}
      currentcolor={currentcolor}
      {...rest}
    >
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
      {searchExpand !== undefined ? (
        <CategoryIcon
          icon="chevron-right"
          onClick={searchExpand}
          color={currentcolor}
        />
      ) : (
        ""
      )}
    </Category>
  );
}

function SidebarLink({ name, to, badge, icon }) {
  return (
    <SimpleLink href={to} target="_blank" rel="noreferrer">
      <Category>
        {icon}
        <CategoryText>
          {name}
          {(name === "Documentation" || name === "Blog") && (
            <FontAwesomeIcon
              icon="external-link-alt"
              style={{ paddingLeft: 6, paddingRight: 6 }}
            />
          )}
        </CategoryText>
      </Category>
    </SimpleLink>
  );
}

class Sidebar extends React.Component {
  intervalID = 0;

  state = {
    counts: {}
  };

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

    this.countUpdate();
    this.intervalID = setInterval(() => {
      this.countUpdate();
    }, 20000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  // Abbreviate counts
  abbreviateNumber = value => {
    let newValue = value;
    if (value > 1000) {
      const suffixes = ["", "k", "M", "B", "T"];
      let suffixNum = 0;
      while (newValue >= 1000) {
        newValue /= 1000;
        suffixNum++;
      }
      newValue = newValue.toPrecision(3);
      newValue += suffixes[suffixNum];
    }
    return newValue;
  };

  // Fetch the document counts for all OpenML entity types
  countUpdate = () => {
    const ELASTICSEARCH_SERVER = "https://www.openml.org/es/";
    fetch(ELASTICSEARCH_SERVER + "_all/_search", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        size: 0,
        aggs: { count_by_type: { terms: { field: "_type", size: 100 } } }
      })
    })
      .then(errorCheck)
      .then(request => request.json())
      .then(response => {
        let res = response.aggregations.count_by_type.buckets;
        let counts = {};
        res.forEach(r => {
          counts[r.key] = this.abbreviateNumber(r.doc_count);
        });
        this.setState({ counts: counts });
      });
  };

  render() {
    const { classes, staticContext, ...other } = this.props;

    return (
      <Drawer variant="permanent" {...other}>
        <SimpleLink href="/">
          <Brand>
            <Icon
              style={{
                fontSize: 39,
                overflow: "visible",
                textAlign: "center",
                marginRight: 5
              }}
            >
              <img
                alt=""
                height="100%"
                src="openml.svg"
                style={{ paddingBottom: 5 }}
              />
            </Icon>
            <Box ml={1}>OpenML</Box>
          </Brand>
        </SimpleLink>
        <Scrollbar>
          <MainContext.Consumer>
            {context => (
              <List disablePadding>
                <Items>
                  {routes.map((category, index) => (
                    <React.Fragment key={index}>
                      {category.header && !context.miniDrawer ? (
                        <SidebarSection variant="caption">
                          {category.header}
                        </SidebarSection>
                      ) : null}
                      {category.header && context.miniDrawer ? <hr /> : null}
                      {category.component ? (
                        category.children ? (
                          <React.Fragment key={index}>
                            <SidebarCategory
                              isCollapsable={false}
                              name={category.id}
                              component={NavLink}
                              to={
                                category.path +
                                (category.entity_type === undefined
                                  ? ""
                                  : "?type=" + category.entity_type)
                              }
                              exact
                              activeClassName="active"
                              icon={category.icon}
                              activecategory={
                                category.entity_type === context.type
                                  ? "true"
                                  : "false"
                              }
                              currentcolor={context.getColor()}
                              badge={
                                context.type === undefined &&
                                this.state.counts[category.entity_type]
                                  ? this.state.counts[category.entity_type]
                                  : 0
                              }
                            />
                            <Collapse
                              in={
                                context.type === category.entity_type &&
                                !context.miniDrawer
                              }
                              timeout="auto"
                              unmountOnExit
                            >
                              {category.children.map((route, index) => (
                                <SidebarCategory
                                  key={index}
                                  name={route.name}
                                  activeClassName="active"
                                  to={
                                    category.path +
                                    "?type=" +
                                    category.entity_type +
                                    "&" +
                                    category.subtype_filter +
                                    "=" +
                                    route.subtype
                                  }
                                  exact
                                  icon={route.icon}
                                  activecategory={
                                    category.entity_type === context.type
                                      ? "true"
                                      : "false"
                                  }
                                  currentcolor={context.getColor()}
                                  component={NavLink}
                                  searchExpand={
                                    category.entity_type === context.type &&
                                    context.searchCollapsed
                                      ? () => context.collapseSearch(false)
                                      : undefined
                                  }
                                  badge={
                                    category.entity_type === context.type
                                      ? (context.filters.measure_type &&
                                          route.subtype ===
                                            context.filters.measure_type
                                              .value) ||
                                        (context.filters.study_type &&
                                          route.subtype ===
                                            context.filters.study_type.value)
                                        ? context.counts
                                        : 0
                                      : this.state.counts[category.entity_type]
                                      ? this.state.counts[category.entity_type]
                                      : 0
                                  }
                                />
                              ))}
                            </Collapse>
                          </React.Fragment>
                        ) : (
                          <React.Fragment key={index}>
                            <SidebarCategory
                              isCollapsable={false}
                              name={category.id}
                              to={
                                category.path +
                                (category.entity_type === undefined
                                  ? ""
                                  : "?type=" + category.entity_type)
                              }
                              activeClassName="active"
                              component={NavLink}
                              icon={category.icon}
                              exact
                              badge={
                                category.entity_type === context.type
                                  ? context.counts
                                    ? this.abbreviateNumber(context.counts)
                                    : this.state.counts[category.entity_type]
                                  : context.type === undefined &&
                                    this.state.counts[category.entity_type]
                                  ? this.state.counts[category.entity_type]
                                  : 0
                              }
                              activecategory={
                                category.entity_type === context.type &&
                                context.type !== undefined
                                  ? "true"
                                  : "false"
                              }
                              searchExpand={
                                category.entity_type === context.type &&
                                context.searchCollapsed
                                  ? () => context.collapseSearch(false)
                                  : undefined
                              }
                              currentcolor={context.getColor()}
                            />
                          </React.Fragment>
                        )
                      ) : (
                        <SidebarLink
                          isCollapsable={false}
                          name={category.id}
                          to={category.path}
                          activeClassName="active"
                          component={SimpleLink}
                          icon={category.icon}
                          badge={
                            category.entity_type === context.type
                              ? context.counts
                              : 0
                          }
                          activecategory={
                            category.entity_type === context.type ? true : false
                          }
                          searchExpand={
                            category.entity_type === context.type &&
                            context.searchCollapsed
                              ? context.collapseSearch
                              : undefined
                          }
                          currentcolor={context.getColor()}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </Items>
              </List>
            )}
          </MainContext.Consumer>
        </Scrollbar>
        <SidebarFooter>
          <MainContext.Consumer>
            {context => (
              <Grid container spacing={4}>
                <Grid item>
                  {context.miniDrawer ? (
                    <SpacedIcon
                      icon="chevron-right"
                      size="lg"
                      onClick={() => context.miniDrawerToggle()}
                    />
                  ) : (
                    <SpacedIcon
                      icon="chevron-left"
                      size="lg"
                      onClick={() => context.miniDrawerToggle()}
                    />
                  )}
                </Grid>
                <Grid item>
                  <Tooltip title="Switch to Light theme" placement="top-start">
                    <div style={{ display: "inline-block" }}>
                      <LightIcon
                        icon="splotch"
                        size="lg"
                        onClick={() => context.setTheme(1)}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Switch to Dark theme" placement="top-start">
                    <div style={{ display: "inline-block" }}>
                      <DarkIcon
                        icon="splotch"
                        size="lg"
                        onClick={() => context.setTheme(0)}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Switch to Green theme" placement="top-start">
                    <div style={{ display: "inline-block" }}>
                      <GreenIcon
                        icon="splotch"
                        size="lg"
                        onClick={() => context.setTheme(3)}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Switch to Blue theme" placement="top-start">
                    <div style={{ display: "inline-block" }}>
                      <BlueIcon
                        icon="splotch"
                        size="lg"
                        onClick={() => context.setTheme(2)}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Switch to Indigo theme" placement="top-start">
                    <div style={{ display: "inline-block" }}>
                      <IndigoIcon
                        icon="splotch"
                        size="lg"
                        onClick={() => context.setTheme(4)}
                      />
                    </div>
                  </Tooltip>
                </Grid>
              </Grid>
            )}
          </MainContext.Consumer>
        </SidebarFooter>
      </Drawer>
    );
  }
}

export default withRouter(Sidebar);
