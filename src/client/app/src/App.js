import React from "react";

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

import maTheme from "./theme";
import Routes from "./routes/Routes";

export const ThemeContext = React.createContext();

//TODO: only import necessary icons
library.add(fas, far)

class App extends React.Component {

  state = {
    currentTheme: 0,
    miniDrawer: false,
    opaqueSearch: false,
    drawerWidth: 260
  };

  render () {
    return (
      <StylesProvider injectFirst>
        <ThemeContext.Provider value={
            {   state: this.state,
                setTheme: (value) => this.setState({ currentTheme: value }),
                setOpaqueSearch: (value) => this.setState({ opaqueSearch: value }),
                miniDrawerToggle: () => this.setState({
                  miniDrawer: !this.state.miniDrawer,
                  drawerWidth: this.state.miniDrawer ? 260 : 60  })
            }
          }>
          <MuiThemeProvider theme={maTheme[this.state.currentTheme]}>
            <ThemeProvider theme={maTheme[this.state.currentTheme]}>
              <Routes />
            </ThemeProvider>
          </MuiThemeProvider>
        </ThemeContext.Provider>
      </StylesProvider>
    );
  }
}

export default App;
