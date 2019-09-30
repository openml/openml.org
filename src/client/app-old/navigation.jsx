import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {EntryDetails}  from './itemDetail.jsx';
import {Sidebar} from './sidebar.jsx';
import {DataListPanel, TaskListPanel, FlowListPanel, RunListPanel, StudyListPanel, PeopleListPanel} from './search.jsx';
import {LoginPanel} from './login.jsx';
import {RegisterPanel} from './register.jsx';
import {UserProfilePanel}  from './userProfile.jsx';
import {AuthProvider,SearchContext,searches} from './context.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

//import Header from './header.jsx';

//UI
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Icon from '@material-ui/core/Icon';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { loadCSS } from "fg-loadcss/src/loadCSS";

import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
import PublicIcon from '@material-ui/icons/Public';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import TimerIcon from '@material-ui/icons/Timer';
import SettingsIcon from '@material-ui/icons/Settings';
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';
import Avatar from '@material-ui/core/Avatar';

//REACT router
import {HashRouter, Route, Redirect, Switch, Link} from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom';

const categories = [
  {
    id: 'Explore',
    children: [
      { id: 'data', name: 'Data sets', icon: 'fa fa-fw fa-database', color: 'green', active: true },
      { id: 'task', name: 'Tasks', icon: 'fa fa-fw fa-flag', color: 'yellow'},
      { id: 'flow', name: 'Flows', icon: 'fa fa-fw fa-cogs', color: 'blue' },
      { id: 'run', name: 'Runs', icon: 'fa fa-fw fa-atom', color: 'red' },
      { id: 'study', name: 'Studies', icon: 'fa fa-fw fa-flask', color: 'purple' },
      { id: 'user', name: 'People', icon: 'fa fa-fw fa-smile-beam', color: 'lightblue' },
      { id: 'tasktype', name: 'Task types', icon: 'fa fa-fw fa-flag-checkered', color: 'orange'},
      { id: 'measure', name: 'Measures', icon: 'fa fa-fw fa-chart-line', color: 'orange'},
    ],
  },
  {
    id: 'Discover',
    children: [
      { id: 'docs', name: 'Help', icon: 'fa fa-fw fa-graduation-cap', color: 'green'  },
      { id: 'join', name: 'Get involved', icon: 'fa fa-fw fa-hand-holding-heart', color: 'yellow'  },
      { id: `foundation`, name: 'OpenML Foundation', icon: 'fa fa-fw fa-hands-helping', color: 'blue'  },
      { id: `cite`, name: 'Terms / Citation', icon: 'fa fa-fw fa-heart', color: 'red'  },
      { id: 'contact', name: 'Our team', icon: 'fa fa-fw fa-user-friends', color: 'purple'  },

    ],
  },
];
const drawerWidth = 256;
const styles = theme => ({
  categoryHeader: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 8,
    paddingBottom: 8,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: 16,
    paddingBottom: 16,
  },
  firebase: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.common.white,
  },
  itemActionable: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemActiveItem: {
    color: '#ffffff',
  },
  itemPrimary: {
    color: 'inherit',
    fontSize: theme.typography.fontSize,
    '&$textDense': {
      fontSize: theme.typography.fontSize,
    },
  },
  divider: {
    marginTop: theme.spacing(2),
  },
  drawerPaper: {
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('xs')]: {
      width: theme.spacing(9),
    },
    [theme.breakpoints.down('xs')]: {
      width: 0,
      display:'none',
    },
    iconButton: {

    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      color: '#ffffff',
      ...theme.mixins.toolbar,
    },
  },
});

class Navigation extends React.Component {
  state = {
    open: true,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    loadCSS(
      "style/fontawesome_5.0.13_all.css",
      document.querySelector("#insertion-point-jss")
    );
  }

  render () {
    const { classes, ...other } = this.props;
    return (
    <Drawer
        variant="permanent"
        classes={{
          paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
        }}
        {...other}>
      <List disablePadding>
        <ListItem className={classNames(classes.firebase, classes.item, classes.itemCategory)}>
        <Avatar alt="OpenML" src="../images/dots.png" className={classes.avatar} />
        OpenML
        </ListItem>
        <ListItem className={classNames(classes.item, classes.itemCategory)}>
          <ListItemIcon>
          <Icon className={classNames(classes.icon, 'fa fa-door-open')} />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            Sign in
          </ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, name, icon, color, active }) => (
              <ListItem
                button
                dense
                key={childId}
                className={classNames(
                  color,
                  classes.item,
                  classes.itemActionable,
                  active && classes.itemActiveItem,
                )}
              >
                <ListItemIcon>
                  <Icon className={classNames(classes.icon, icon, color)} />
                </ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                    textDense: classes.textDense,
                  }}
                >
                  {name}
                </ListItemText>
              </ListItem>
            ))}
            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      <ListItem className={classNames(classes.item, classes.toolbarIcon)}>
        <IconButton onClick={this.handleDrawerClose} className={classNames(classes.toolbarIcon)}>
        <ChevronLeftIcon />
        </IconButton>
      </ListItem>
      </List>
    </Drawer>
    )
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigation);
