import React from "react";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { StylesProvider } from "@mui/styles";
import { ThemeProvider as SCThemeProvider } from "styled-components";
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
  purple,
  pink,
} from "@mui/material/colors";

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
    setTheme: (value) =>
      this.setState({ currentTheme: value }, this.log("Theme changed")),
    toggleAnimation: (value) =>
      this.setState({ animation: value }, this.log("Animation changed")),
    setSearchActive: (value) =>
      this.setState({ searchActive: value }, this.log("Search bar changed")),
    toggleSearch: () =>
      this.setState(
        { searchActive: !this.state.searchActive },
        this.log("Search bar changed"),
      ),
    miniDrawerToggle: () =>
      this.setState(
        {
          miniDrawer: !this.state.miniDrawer,
          drawerWidth: this.state.miniDrawer ? 260 : 57,
        },
        this.log("Drawer changed"),
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
            Authorization: "Bearer " + token,
          },
        };
        axios
          .get(
            process.env.REACT_APP_URL_SITE_BACKEND + "verifytoken",
            yourConfig,
          )
          .then((response) => {
            if (
              response.statusText !== undefined &&
              response.statusText === "OK" &&
              !this.state.loggedIn
            ) {
              axios
                .get(
                  process.env.REACT_APP_URL_SITE_BACKEND + "profile",
                  yourConfig,
                )
                .then((response) => {
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
                      userID: userID,
                    },
                    this.log("Login changed: User profile loaded"),
                  );
                })
                .catch((error) => {
                  console.log("Could not fetch profile.");
                });
            } else if (this.state.loggedIn) {
              this.setState(
                { loggedIn: false },
                this.log("Login changed: Authentication failed"),
              );
            }
          })
          .catch((error) => {
            if (this.state.loggedIn) {
              this.setState(
                { loggedIn: false },
                this.log("Login changed: Authentication check failed"),
              );
            }
          });
      }
    },
    logIn: () => {
      this.setState(
        { loggedIn: true },
        this.log("Login changed: user logged in"),
      );
    },
    logOut: () => {
      this.setState(
        {
          loggedIn: false,
          userImage: undefined,
          userInitials: undefined,
          userID: undefined,
        },
        this.log("Login changed: user logged out"),
      );
    },
    setUserImage: (value) => {
      console.log(value);
      if (value.includes(path.sep)) {
        //check if valid path
        this.setState({ userImage: value }, this.log("User image changed"));
      }
    },
    setUserInitials: (value) => {
      console.log(value);
      this.setState({ userInitials: value }, this.log("User initials changed"));
    },

    // Search context
    displayStats: false, // show statistics results
    displaySplit: false, // show split pane (search left, detail right)
    query: undefined, // the query in the search bar
    counts: 0, //number of hits in the main search
    subCounts: 0, //number of hits in the sub-search (e.g. tasks of a dataset)
    startCount: 0, //from where to start the next search (for pagination / infinite scroll)
    startSubCount: 0, //from where to start the next sub-search (for pagination / infinite scroll)
    type: undefined, //the main entity type
    subType: undefined, //the entity subtype (e.g. tasks when the main entity is data)
    id: undefined, //the entity ID selected for showing details
    tag: undefined, //tag filter
    results: [], //the search result list (hits)
    subResults: [], //the sub-search result list (hits)
    updateType: undefined, //what kind of update was done (query changed, results arrived, id changed,...)
    error: null, //search error message
    sort: null, // current sort
    order: "desc", // current sort order
    filters: {}, // current filters
    subFilters: {}, // current subfilters
    activeTab: 0, // search tab currently shown
    fields: ["data_id", "name"], // current fields to be returned by search
    getColor: (type = this.state.type) => {
      return this.getColor(type);
    },
    getIcon: (type = this.state.type) => {
      return this.getIcon(type);
    },
    getSearchTopic: () => {
      return this.getSearchTopic();
    },
    toggleSplit: () =>
      this.setState(
        { displaySplit: !this.state.displaySplit },
        this.log("Split view changed"),
      ),
    toggleStats: () =>
      this.setState(
        { displayStats: !this.state.displayStats },
        this.log("Stats view changed"),
      ),
    setType: (value) => {
      this.setState({ type: value, activeTab: 0 }, this.log("Type changed"));
    },
    setActiveTab: (value) => {
      this.setState({ activeTab: value }, this.log("Active tab changed"));
    },
    setSubType: (value) => {
      this.setState({ subType: value }, this.log("SubType changed"));
    },
    setTag: (value) => {
      this.setState({ tag: value }, this.log("Tag changed"));
    },
    setLoading: (value) => {
      this.setState({ loading: value }, this.log("Loading changed"));
    },
    setQuery: (value) => {
      if (value === "") {
        value = undefined;
      }
      let state_update = {
        query: value,
        updateType: "query",
        startCount: 0,
        results: [],
      };
      if (value !== undefined) {
        state_update["sort"] = "match";
      } else {
        state_update["sort"] = undefined;
      }
      this.setState(state_update, this.log("Query set"));
    },
    setFields: (value) => {
      this.setState({ fields: value }, this.log("Fields changed"));
    },
    setSort: (value) => {
      this.setState({ sort: value }, this.log("Sort changed"));
    },
    resetStartCount: () => {
      this.setState(
        { startCount: 0, startSubCount: 0 },
        this.log("StartCount reset"),
      );
    },
    setOrder: (value) => {
      this.setState({ order: value }, this.log("Order changed"));
    },
    setID: (value) => {
      this.setState({ id: value, activeTab: 0 }, this.log("ID changed"));
    },
    setResults: (counts, results) => {
      this.setState({
        counts: counts,
        results: results,
        updateType: "results",
        startCount: results.length,
      });
    },
    setSubResults: (counts, results) => {
      this.setState(
        {
          subCounts: counts,
          subResults: results,
          updateType: "subresults",
          startSubCount: results.length,
        },
        this.log("Search subresults changed"),
      );
    },
    setSubSearch: (type, filters) => {
      let update = {
        subType: type,
        subFilters: filters,
        updateType: "subquery",
        subResults: [],
        startSubCount: 0,
      };
      this.setState(update);
    },
    setSearch: (qp, fields) => {
      // parses search from url query parameters
      if (JSON.stringify(qp) === this.state.qjson) return;
      let qchanged = false;
      let idChanged = false;
      // set defaults
      let update = {
        fields: fields === undefined ? this.state.fields : fields,
        id: undefined,
        counts: "id" in qp ? this.state.counts : 0,
        displaySearch: true,
        filters: this.state.type === qp.type ? this.state.filters : [],
        // reset query if type changes
        query:
          this.state.type === qp.type || this.state.type === undefined
            ? this.state.query
            : undefined,
      };
      if (this.state.type !== qp.type) {
        document.getElementById("searchbar").value = "";
      }

      // check for removed keys
      Object.keys(this.state.filters).forEach((key) => {
        if (!(key in qp)) {
          delete this.state.filters[key];
          qchanged = true;
        }
      });
      // process query parameters
      Object.entries(qp).forEach(([key, value]) => {
        // Sorting and ID filters
        if (["sort", "type", "id", "order"].includes(key)) {
          update[key] = value;
          if (this.state[key] !== value && key !== "id") {
            qchanged = true;
          }
          if (key === "type" && this.state[key] !== value) {
            //reset active tab if type changes
            update["activeTab"] = 0;
            update["startSubCount"] = 0;
            qchanged = true;
          }
          // Process FILTERS
          // Filters have shape {key: {value: v, type: t}}
          // e.g. {number_of_instances: {value: 1000, type: ">"}}
        } else {
          let type = "=";
          let value2 = undefined;
          // TODO: we need to add a special case for every filter that can have '_' in its values, think of a better way
          if (
            !key.startsWith("tags") &&
            !key.startsWith("status") &&
            !key.startsWith("format") &&
            value.split("_").length === 2
          ) {
            let vals = value.split("_");
            type = vals[0];
            value = vals[1];
          }
          if (
            !key.startsWith("tags") &&
            !key.startsWith("status") &&
            value.split("_").length === 3
          ) {
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
              if (update.filters[key] !== undefined) {
                update.filters[key].type = type;
                update.filters[key].value = value;
              }
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
      // If anything changed, set the new state
      if (qchanged) {
        //console.log("Query changed");
        update.updateType = "query";
        update.results = [];
        update.startCount = 0;
        this.setState(update);
      } else if (
        (qp["id"] !== undefined && this.state.id !== qp["id"]) ||
        (qp["id"] === undefined && this.state.id !== undefined) ||
        idChanged
      ) {
        //console.log("ID changed");
        this.setState({
          id: qp["id"],
          updateType: "id",
          displaySearch: update["displaySearch"],
          startSubCount: 0,
          activeTab: 0,
        });
      } else {
        if (this.state.updateType !== undefined) {
          this.setState({
            updateType: undefined,
          });
        }
        //console.log("Nothing to do");
      }
    },
    updateSearch: (sort, order, filters) => {
      let update = {};
      update.sort = sort;
      update.order = order;
      if (filters) {
        update.filters = filters;
      }
      //console.log(filters);
      this.setState(update);
    },
  };

  // Logs state change when in developer mode.
  log = (message) => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      // console.log(message);
    }
  };

  getColor = (type) => {
    if (type === "data") {
      return green[500];
    } else if (type === "task") {
      return orange[600];
    } else if (type === "flow" || window.location.pathname.startsWith("/api")) {
      return blue[800];
    } else if (
      type === "run" ||
      window.location.pathname.startsWith("/contribute")
    ) {
      return red[400];
    } else if (
      type === "study" ||
      window.location.pathname.startsWith("/meet")
    ) {
      return purple[600];
    } else if (type === "benchmark") {
      return pink[400];
    } else if (
      type === "task_type" ||
      window.location.pathname.startsWith("/about")
    ) {
      return orange[400];
    } else if (
      type === "measure" ||
      window.location.pathname.startsWith("/terms")
    ) {
      return grey[700];
    } else if (type === "user") {
      return blue[300];
    } else {
      return undefined;
    }
  };

  getIcon = (type) => {
    switch (type) {
      case "data":
        return "database";
      case "task":
        return ["fas", "flag"];
      case "flow":
        return "cog";
      case "run":
        return "flask";
      case "study":
        return "layer-group";
      case "benchmark":
        return "chart-bar";
      case "tasktype":
        return ["far", "flag"];
      case "measure":
        return "tachometer-alt";
      default:
        return "database";
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
      case "benchmark":
        return "benchmarks";
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
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={maTheme[this.state.currentTheme]}>
          <StylesProvider injectFirst>
            <MainContext.Provider value={this.state}>
              <SCThemeProvider theme={maTheme[this.state.currentTheme]}>
                <Routes />
              </SCThemeProvider>
            </MainContext.Provider>
          </StylesProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }

  componentDidMount() {
    this.state.checkLogIn();
  }
}

export default App;
