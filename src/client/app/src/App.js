import React from "react";

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { blue, orange, red, green, grey, purple} from "@material-ui/core/colors";

import maTheme from "./theme";
import Routes from "./routes/Routes";

export const MainContext = React.createContext();

//TODO: only import necessary icons
library.add(fas, far)

class App extends React.Component {

  state = {
    // Theme context
    currentTheme: 0,
    miniDrawer: false,
    opaqueSearch: false,
    animation: true,
    drawerWidth: 260,
    setTheme: (value) => this.setState({ currentTheme: value }),
    toggleAnimation: (value) => this.setState({ animation: value }),
    setOpaqueSearch: (value) => this.setState({ opaqueSearch: value }),
    miniDrawerToggle: () => this.setState({
      miniDrawer: !this.state.miniDrawer,
      drawerWidth: this.state.miniDrawer ? 260 : 60  }),

    // Search context
    displaySearch: true, // hide search on small screens
    searchCollapsed: false, // hide search entirely
    query: undefined,
    counts: 0, //counts of hits
    type: "data", //the entity type
    id: undefined, //the entity ID
    tag : undefined, //tag filter
    results : [], //the search result list (hits)
    error : null, //search error message
    sort : null, // current sort
    order : "desc", // current sort order
    filter :  [], // current filter
    fields :  ["data_id","name"], // current fields
    getColor: () => {return this.getColor();},
    collapseSearch: (value) => {this.setState({ searchCollapsed: value });},
    toggleSearchList: (value) => {if(value!==this.state.displaySearch){console.log(value); this.setState({ displaySearch: value })}},
    setQuery: (value) => {this.setState({ query: value });},
    setFields: (value) => {this.setState({ fields: value });},
    setSort: (value) => {this.setState({ sort: value });},
    setOrder: (value) => {this.setState({ order: value });},
    setID: (value) => {this.setState({ id: value });},
    setResults: (counts, results) => {
      this.setState({ counts: counts, results: results });},
    hasChanged: (qp) => { // has the state changed?
      let changed = false;
      let filters = [];
      Object.entries(qp).forEach(([key, value]) => {
        if(key.startsWith("qualities")){
          let vals = value.split("_");
          filters.push({
            name:key,
            type:vals[0],
            value:vals[1]
          })
        }
        else if (this.state[key] !== value && key !== 'id') {
          changed = true;
        }
      });
      if(filters.length > 0 && this.state[filters] !== filters)
        changed = true;
      return changed;
    },
    setSearch: (qp, fields) => {
      // set defaults
      let update = {fields: (fields === undefined ? this.state.fields : fields),
                    id: undefined,
                    type: undefined};
      let filters = [];
      // Set all passed key-values
      Object.entries(qp).forEach(([key, value]) => {
        if(key.startsWith("qualities")){
          let vals = value.split("_");
          filters.push({
            name:key,
            type:vals[0],
            value:vals[1]
          })
        }
        else{
          update[key] = value;
        }
      });
      // search visibility
      if (window.innerWidth < 600){
          if (update.id !== undefined){
            update["displaySearch"] = false;
          } else {
            update["displaySearch"] = true;
          }
      }
      update.filter = filters;
      this.setState(update);
    },
    updateSearch: (sort, order, filter) => {
      let update = {}
      update.sort = sort;
      update.order = order;
      if (filter) {update.filter = filter;}
      this.setState(update);
    }

  };

  getColor = () => {
    switch (this.state.type){
                case "data":
                 return green[500]
                case "task":
                 return orange[400]
                case "flow":
                 return blue[800]
                case "run":
                 return red[400]
                case "study":
                 return purple[600]
                case "task_type":
                 return orange[400]
                case "measure":
                 return grey[700]
                case "user":
                 return blue[300]
                default:
                 return grey[700]
     }
  }

  render () {
    return (
      <StylesProvider injectFirst>
        <MainContext.Provider value={this.state}>
          <MuiThemeProvider theme={maTheme[this.state.currentTheme]}>
            <ThemeProvider theme={maTheme[this.state.currentTheme]}>
              <Routes />
            </ThemeProvider>
          </MuiThemeProvider>
        </MainContext.Provider>
      </StylesProvider>
    );
  }
}

export default App;
