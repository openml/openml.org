import React from "react";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";
import axios from "axios";
import * as path from "path";
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
    searchActive: false,
    animation: true,
    drawerWidth: 260,
    setTheme: value =>
      this.setState({ currentTheme: value }, this.log("Theme changed")),
    toggleAnimation: value =>
      this.setState({ animation: value }, this.log("Animation changed")),
    setSearchActive: value =>
      this.setState({ searchActive: value }, this.log("Search bar changed")),
    toggleSearch: () =>
      this.setState(
        { searchActive: !this.state.searchActive },
        this.log("Search bar changed")
      ),
    miniDrawerToggle: () =>
      this.setState(
        {
          miniDrawer: !this.state.miniDrawer,
          drawerWidth: this.state.miniDrawer ? 260 : 57
        },
        this.log("Drawer changed")
      ),

    // Auth
    loggedIn: false,
    userID: undefined,
    userImage: undefined,
    userInitials: undefined,
    checkLogIn: () => {
      let token = localStorage.getItem("token");
      if (token != null) {
        const yourConfig = {
          headers: {
            Authorization: "Bearer " + token
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
              axios
                .get(process.env.REACT_APP_SERVER_URL + "profile", yourConfig)
                .then(response => {
                  let img = undefined;
                  if (response.data.image.includes(path.sep)) {
                    img = response.data.image;
                  }
                  let ini =
                    response.data.first_name.charAt(0) +
                    response.data.last_name.charAt(0);
                  let userID = response.data.id;
                  this.setState(
                    {
                      loggedIn: true,
                      userImage: img,
                      userInitials: ini,
                      userID: userID
                    },
                    this.log("Login changed: User profile loaded")
                  );
                })
                .catch(error => {
                  console.log("Could not fetch profile.");
                });
            } else if (this.state.loggedIn) {
              this.setState(
                { loggedIn: false },
                this.log("Login changed: Authentication failed")
              );
            }
          })
          .catch(error => {
            if (this.state.loggedIn) {
              this.setState(
                { loggedIn: false },
                this.log("Login changed: Authentication check failed")
              );
            }
          });
      }
    },
    logIn: () => {
      this.setState(
        { loggedIn: true },
        this.log("Login changed: user logged in")
      );
    },
    logOut: () => {
      this.setState(
        {
          loggedIn: false,
          userImage: undefined,
          userInitials: undefined,
          userID: undefined
        },
        this.log("Login changed: user logged out")
      );
    },
    setUserImage: value => {
      console.log(value);
      if (value.includes(path.sep)) {
        //check if valid path
        this.setState({ userImage: value }, this.log("User image changed"));
      }
    },
    setUserInitials: value => {
      console.log(value);
      this.setState({ userInitials: value }, this.log("User initials changed"));
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
    getSearchTopic: () => {
      return this.getSearchTopic();
    },
    collapseSearch: value => {
      this.setState({ searchCollapsed: value }, this.log("Search collapsed"));
    },
    toggleSearchList: value => {
      if (value !== this.state.displaySearch) {
        this.setState(
          { displaySearch: value },
          this.log("Search list changed")
        );
      }
    },
    setType: value => {
      this.setState({ type: value }, this.log("Type changed"));
    },
    setTag: value => {
      this.setState({ tag: value }, this.log("Tag changed"));
    },
    setLoading: value => {
      this.setState({ loading: value }, this.log("Loading changed"));
    },
    setQuery: value => {
      this.setState(
        { query: value, updateType: "query" },
        this.log("Query changed")
      );
    },
    setFields: value => {
      this.setState({ fields: value }, this.log("Fields changed"));
    },
    setSort: value => {
      this.setState({ sort: value }, this.log("Sort changed"));
    },
    setOrder: value => {
      this.setState({ order: value }, this.log("Order changed"));
    },
    setID: value => {
      this.setState({ id: value }, this.log("ID changed"));
    },
    setResults: (counts, results) => {
      this.setState(
        {
          counts: counts,
          results: results,
          updateType: "results"
        },
        this.log("Search results changed")
      );
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
          let value2 = undefined;
          if (value.split("_").length === 2) {
            let vals = value.split("_");
            type = vals[0];
            value = vals[1];
          }
          if (value.split("_").length === 3) {
            let vals = value.split("_");
            type = vals[0];
            value = vals[1];
            value2 = vals[2];
          }
          if (key in this.state.filters) {
            // Update filter
            if (
              this.state.filters[key].type !== type ||
              this.state.filters[key].value !== value
            ) {
              update.filters[key].type = type;
              update.filters[key].value = value;
              if (typeof value2 !== "undefined") {
                update.filters[key].value2 = value2;
              }
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
      console.log(filters);
      this.setState(update);
    }
  };

  // Logs state change when in developer mode.
  log = message => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      console.log(message);
    }
  };

  getColor = () => {
    if (this.state.type === "data") {
      return green[500];
    } else if (this.state.type === "task") {
      return orange[600];
    } else if (
      this.state.type === "task" ||
      window.location.pathname.startsWith("/api")
    ) {
      return blue[800];
    } else if (
      this.state.type === "run" ||
      window.location.pathname.startsWith("/contribute")
    ) {
      return red[400];
    } else if (
      this.state.type === "study" ||
      window.location.pathname.startsWith("/meet")
    ) {
      return purple[600];
    } else if (
      this.state.type === "task_type" ||
      window.location.pathname.startsWith("/about")
    ) {
      return orange[400];
    } else if (
      this.state.type === "measure" ||
      window.location.pathname.startsWith("/terms")
    ) {
      return grey[700];
    } else if (this.state.type === "user") {
      return blue[300];
    } else {
      return undefined;
    }
  };

  getSearchTopic = () => {
    switch (this.state.type) {
      case "data":
        return "datasets";
      case "task":
        return "tasks";
      case "flow":
        return "flows";
      case "run":
        return "runs";
      case "study":
        return "collections";
      case "task_type":
        return "task types";
      case "measure":
        return "measures";
      case "user":
        return "users";
      default:
        return "";
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
