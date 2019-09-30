//REACT
import React from 'react';

//REACT router
import {HashRouter, Route, Redirect, Switch, Link} from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom';

//self
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Navigation from './navigation.jsx';
import Cover from './cover.jsx';

import maTheme from "./theme";

//color scheme
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan,
  teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown,
  grey, blueGrey } from '@material-ui/core/colors';

const drawerWidth = 265;
let theme = {
  typography: {
    useNextVariants: true,
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  palette: {
    type: 'light',
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#006db3',
    },
  },
  shape: {
    borderRadius: 8,
  },
  material: {
    red: {color: red[500]},
    pink: pink[500],
    purple: purple[500],
    deepPurple: deepPurple[500],
    indigo: indigo[500],
    blue: blue[500],
    lightBlue: lightBlue[500],
    cyan: cyan[500],
    teal: teal[500],
    green: {color: green[500]},
    lightGreen: lightGreen[500],
    lime: lime[500],
    yellow: yellow[500],
    amber: amber[500],
    orange: orange[500],
    deepOrange: deepOrange[500],
    brown: brown[500],
    grey: grey[500],
    blueGrey: blueGrey[500],
  },
};

class OpenMLApp extends React.Component {

    state = {
      mobileOpen: false,
    };

    handleDrawerToggle = () => {
      this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };

    render () {
        return (
          //<ThemeProvider theme={theme}>
            <div>
              <nav>
                <Hidden smUp implementation="js">
                  <Navigation
                    PaperProps={{ style: { width: drawerWidth } }}
                    variant="temporary"
                    open={this.state.mobileOpen}
                    onClose={this.handleDrawerToggle}
                  />
                </Hidden>
                <Hidden xsDown implementation="css">
                  <Navigation PaperProps={{ style: { width: drawerWidth } }} />
                </Hidden>
              </nav>
              <div>
                <main>
                  <Cover />
                </main>
              </div>
            </div>
        //  </ThemeProvider>
        );
    }
}

export default OpenMLApp;
