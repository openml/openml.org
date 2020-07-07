import React from "react";

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";
import axios from "axios";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import {
  blue,
  orange,
  red,
  green,
  grey,
  purple
} from "@material-ui/core/colors";

import maTheme from "./theme";
import Routes from "./routes/Routes";

export const MainContext = React.createContext();

//TODO: only import necessary icons
library.add(fas, far, fab);

class App extends React.Component {
  state = {
    // Theme context
    currentTheme: 0,
    miniDrawer: false,
    opaqueSearch: false,
    animation: true,
    drawerWidth: 260,
    setTheme: value => this.setState({ currentTheme: value }),
    toggleAnimation: value => this.setState({ animation: value }),
    setOpaqueSearch: value => this.setState({ opaqueSearch: value }),
    miniDrawerToggle: () =>
      this.setState({
        miniDrawer: !this.state.miniDrawer,
        drawerWidth: this.state.miniDrawer ? 260 : 60
      }),

    // Auth context
    loggedIn: false,
    checkLogIn: () => {
      const yourConfig = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      };
      axios
        .get(process.env.REACT_APP_SERVER_URL + "verifytoken", yourConfig)
        .then(response => {
          if (
            response.statusText !== undefined &&
            response.statusText === "OK" &&
            !this.state.loggedIn
          ) {
            this.setState({ loggedIn: true });
          } else if (this.state.loggedIn) {
            this.setState({ loggedIn: false });
          }
        })
        .catch(error => {
          console.log("Error");
          this.setState({ loggedIn: false });
        });
    },
    logIn: () => {
      this.setState({ loggedIn: true });
    },
    logOut: () => {
      this.setState({ loggedIn: false });
    },

    // Search context
    displaySearch: true, // hide search on small screens
    searchCollapsed: false, // hide search entirely
    query: undefined,
    counts: 0, //counts of hits
    type: undefined, //the entity type
    id: undefined, //the entity ID
    tag: undefined, //tag filter
    results: [], //the search result list (hits)
    updateType: undefined, //query, results, id
    error: null, //search error message
    sort: null, // current sort
    order: "desc", // current sort order
    filters: {}, // current filters
    fields: ["data_id", "name"], // current fields
    getColor: () => {
      return this.getColor();
    },
    collapseSearch: value => {
      this.setState({ searchCollapsed: value });
    },
    toggleSearchList: value => {
      if (value !== this.state.displaySearch) {
        this.setState({ displaySearch: value });
      }
    },
    setLoading: value => {
      this.setState({ loading: value });
    },
    setQuery: value => {
      this.setState({ query: value, updateType: "query" });
    },
    setFields: value => {
      this.setState({ fields: value });
    },
    setSort: value => {
      this.setState({ sort: value });
    },
    setOrder: value => {
      this.setState({ order: value });
    },
    setID: value => {
      this.setState({ id: value });
    },
    setResults: (counts, results) => {
      this.setState({
        counts: counts,
        results: results,
        updateType: "results"
      });
    },
    setSearch: (qp, fields) => {
      if (JSON.stringify(qp) === this.state.qjson) return;
      let qchanged = false;
      let idChanged = false;
      // set defaults
      let update = {
        fields: fields === undefined ? this.state.fields : fields,
        id: undefined,
        counts: "id" in qp ? this.state.counts : 0,
        displaySearch: true,
        filters: this.state.type === qp.type ? this.state.filters : []
      };
      // process query parameters
      Object.entries(qp).forEach(([key, value]) => {
        // Sorting and ID filters
        if (["sort", "type", "id", "order"].includes(key)) {
          update[key] = value;
          if (this.state[key] !== value && key !== "id") {
            qchanged = true;
          }
          // Process FILTERS
          // Filters have shape {key: {value: v, type: t}}
          // e.g. {number_of_instances: {value: 1000, type: ">"}}
        } else {
          let type = "=";
          if (value.split("_") === 2) {
            let vals = value.split("_");
            type = vals[0];
            value = vals[1];
          }
          if (key in this.state.filters) {
            // Update filter
            if (
              this.state.filters[key].type !== type ||
              this.state.filters[key].value !== value
            ) {
              update.filters[key].type = type;
              update.filters[key].value = value;
              qchanged = true;
            }
          } else {
            // Add filter
            update.filters[key] = { value: value, type: type };
            qchanged = true;
          }
        }
      });
      // search visibility
      if (window.innerWidth < 600) {
        if (update.id !== undefined) {
          update["displaySearch"] = false;
        } else {
          update["displaySearch"] = true;
        }
        if (this.state.displaySearch !== update.displaySearch) idChanged = true;
      }
      // Unset ID
      //if (this.state.id !== undefined && qp["id"] === undefined)
      //  qchanged = true;
      // If anything changed, set the new state
      if (qchanged) {
        console.log("SetState: query changed");
        update.updateType = "query";
        update.results = [];
        this.setState(update);
      } else if (
        (qp["id"] !== undefined && this.state.id !== qp["id"]) ||
        idChanged
      ) {
        console.log("SetState: id changed");
        this.setState({
          id: qp["id"],
          updateType: "id",
          displaySearch: update["displaySearch"]
        });
      } else {
        if (this.state.updateType !== undefined) {
          this.setState({
            updateType: undefined
          });
        }
        console.log("SetState: nothing to do");
      }
    },
    updateSearch: (sort, order, filters) => {
      let update = {};
      update.sort = sort;
      update.order = order;
      if (filters) {
        update.filters = filters;
      }
      this.setState(update);
    }
  };

  getColor = () => {
    switch (this.state.type) {
      case "data":
        return green[500];
      case "task":
        return orange[400];
      case "flow":
        return blue[800];
      case "run":
        return red[400];
      case "study":
        return purple[600];
      case "task_type":
        return orange[400];
      case "measure":
        return grey[700];
      case "user":
        return blue[300];
      default:
        return grey[700];
    }
  };

  render() {
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

  componentDidMount() {
    this.state.checkLogIn();
  }
}

export default App;
