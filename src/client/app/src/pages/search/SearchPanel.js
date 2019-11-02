import React from "react";
import { SearchResultsPanel } from "./search.js";
import { EntryDetails } from "./ItemDetail.js";
import { Grid, Tabs, Tab } from "@material-ui/core";
import styled from "styled-components";
import PerfectScrollbar from "react-perfect-scrollbar";
import queryString from "query-string";
import { DetailTable } from "./Tables.js";
import { search, getProperty } from "./api";
import { MainContext } from "../../App.js";
import { blue, red, green, yellow, purple } from "@material-ui/core/colors";

const SearchTabs = styled(Tabs)`
  height: 51px;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);

  .MuiTabs-indicator {
    background-color: ${props => props.searchcolor} !important;
  }
`;
const SearchTab = styled(Tab)`
  color: ${props => props.searchcolor} !important;
`;
const DetailPanel = styled.div`
  width: 90%;
  margin: 0 auto;
`;
const Scrollbar = styled(PerfectScrollbar)`
  overflow-x: hidden;
  position: relative;
  height: calc(100vh - 115px);

  .ps {
    overflow: hidden;
    touch-action: auto;
  }

  .ps__rail-x,
  .ps__rail-y {
    display: none;
    opacity: 0;
    transition: background-color 0.2s linear, opacity 0.2s linear;
    height: 15px;
    bottom: 0px;
    position: absolute;
  }
`;

export default class SearchPanel extends React.Component {
  //Flow:
  // * render the right Panel (e.g. DataListPanel) empty
  // * call API to get data
  // * re-render panels with data

  static contextType = MainContext;

  state = {
    activeTab: 0, //O: detail, 1: dash
    previousWidth: 0
  };

  // Get and sanitize query parameters
  getQueryParams = () => {
    let qstring = queryString.parse(this.props.location.search);

    // If no sort is defined, set a sensible default
    if (this.context.sort === null || this.context.type !== qstring.type) {
      if (["data", "flow", "task"].includes(qstring.type)) {
        qstring.sort = "runs";
      } else {
        qstring.sort = "date";
      }
      this.updateQuery("sort", qstring.sort);
    }
    if (qstring.type === "measure" && qstring.measure_type === undefined) {
      qstring.measure_type = "data_quality";
      this.updateQuery("measure_type", "data_quality");
    } else if (qstring.type === "study" && qstring.study_type === undefined) {
      qstring.study_type = "task";
      this.updateQuery("study_type", "task");
    }
    return qstring;
  };

  // Add URL query parameters
  // Note: includes an async call. Don't expect that the URL is already
  // updated when this call returns.
  updateQuery = (param, value) => {
    if (param !== undefined && value !== undefined) {
      let currentUrlParams = new URLSearchParams(this.props.location.search);
      if (value === null) {
        currentUrlParams.delete(param);
      } else {
        currentUrlParams.set(param, value);
      }
      this.props.history.push(
        this.props.location.pathname + "?" + currentUrlParams.toString()
      );
    }
  };

  updateWindowDimensions = () => {
    if (this.context.id !== undefined && window.innerWidth < 600) {
      this.context.toggleSearchList(false);
    } else {
      this.context.toggleSearchList(true);
    }
  };

  fields = {
    data: [
      "data_id",
      "name",
      "version",
      "description",
      "qualities.NumberOfInstances",
      "qualities.NumberOfFeatures",
      "qualities.NumberOfClasses",
      "qualities.NumberOfMissingValues",
      "runs",
      "nr_of_likes",
      "nr_of_downloads",
      "reach",
      "impact",
      "status",
      "date"
    ],
    task_type: ["tt_id", "name", "description", "date"],
    task: [
      "task_id",
      "tasktype.name",
      "source_data.name",
      "target_feature",
      "estimation_procedure.name",
      "nr_of_likes",
      "nr_of_downloads",
      "runs",
      "date"
    ],
    flow: [
      "flow_id",
      "name",
      "description",
      "runs",
      "nr_of_likes",
      "nr_of_downloads",
      "date"
    ],
    run: [
      "run_id",
      "run_flow.name",
      "run_task.source_data.name",
      "uploader",
      "run_task.tasktype.name",
      "nr_of_likes",
      "nr_of_downloads",
      "evaluations",
      "date"
    ],
    study: [
      "study_id",
      "name",
      "description",
      "uploader",
      "datasets_included",
      "tasks_included",
      "flows_included",
      "runs_included",
      "date"
    ],
    measure: {
      data_quality: ["quality_id", "name", "description", "date"],
      estimation_procedure: ["proc_id", "name", "description", "date"],
      evaluation_measure: [
        "eval_id",
        "name",
        "description",
        "date",
        "min",
        "max",
        "unit",
        "higherIsBetter"
      ]
    },
    user: [
      "user_id",
      "first_name",
      "last_name",
      "company",
      "bio",
      "country",
      "activity",
      "nr_of_uploads",
      "datasets_uploaded",
      "flows_uploaded",
      "runs_uploaded",
      "reach",
      "impact",
      "date",
      "image"
    ]
  };

  // reload search results based on query parameters
  updateSearch = () => {
    let qstring = this.getQueryParams();
    if (qstring.type === "measure") {
      this.context.setSearch(
        qstring,
        this.fields[qstring.type][qstring.measure_type]
      );
    } else {
      this.context.setSearch(qstring, this.fields[qstring.type]);
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    return this.context.results.length > 0;
  }

  componentDidMount() {
    // Reflow when the user changes the window size
    window.addEventListener("resize", this.updateWindowDimensions);
    // Do initial search
    this.updateSearch();
  }

  // check if update requires a query reload
  componentDidUpdate() {
    if (this.context.updateType === "query") {
      console.log("SearchPanel Update! Reload Search");
      this.reload();
    } else {
      console.log("SearchPanel Update! Update Search");
      this.updateSearch();
    }
  }

  // Shorten string to 40 characters
  sliceDescription = s => {
    if (s.length > 40) {
      return s.slice(0, 40) + "...";
    } else {
      return s;
    }
  };

  // Shorten flow name
  sliceFlow = s => {
    let res = s.split(".");
    res = res[0] + "." + res[res.length - 1];
    if (res.length > 25) {
      return res.slice(0, 25) + "...";
    } else {
      return res;
    }
  };

  // translate single search filter to ElasticSearch filters
  toFilterQuery = filters => {
    for (var key in filters) {
      if (filters[key].type === "=") {
        return {
          term: { [key]: filters[key].value }
        };
      } else if (filters[key].type === "gte" || filters[key].type === "lte") {
        return {
          range: {
            [key]: {
              [filters[key].type]: filters[key].value
            }
          }
        };
      } else if (filters[key].type === "between") {
        return {
          range: {
            [key]: {
              gte: filters[key].value,
              lte: filters[key].value2
            }
          }
        };
      } else if (filters[key].type === "in") {
        return {
          prefix: { [key]: filters[key].value }
        };
      } else {
        return null;
      }
    }
  };

  // call search engine for initial listing
  reload() {
    search(
      this.context.query,
      this.context.tag,
      this.context.type,
      this.context.fields,
      this.context.sort,
      this.context.order,
      this.toFilterQuery(this.context.filters)
    )
      .then(data => {
        // Add in non-standard properties
        if (this.context.type === "task") {
          data.results.forEach(res => {
            res["comp_name"] = getProperty(res, "source_data.name");
            res["description"] =
              getProperty(res, "tasktype.name") +
              ": predict '" +
              getProperty(res, "target_feature") +
              "', evaluate with " +
              getProperty(res, "estimation_procedure.name");
            if (data.hasOwnProperty("evaluation_measures")) {
              res["description"] +=
                ", optimize '" + getProperty(res, "evaluation_measures");
            }
          });
        } else if (this.context.type === "run") {
          data.results.forEach(res => {
            let flow_name = getProperty(res, "run_flow.name");
            let data_name = getProperty(res, "run_task.source_data.name");
            res["comp_name"] = this.sliceFlow(flow_name) + " on " + data_name;
            res["description"] =
              this.sliceDescription(flow_name) +
              " on " +
              data_name +
              " by " +
              getProperty(res, "uploader");
            res.evaluations.forEach(score => {
              res[score.evaluation_measure] = score.value;
            });
            delete res.evaluations;
          });
        } else if (this.context.type === "user") {
          data.results.forEach(res => {
            res["comp_name"] =
              getProperty(res, "first_name") +
              " " +
              getProperty(res, "last_name");
            res["description"] =
              getProperty(res, "bio") +
              " - " +
              getProperty(res, "company") +
              " - " +
              getProperty(res, "country");
            res["initials"] =
              getProperty(res, "first_name")
                .charAt(0)
                .toUpperCase() +
              getProperty(res, "last_name")
                .charAt(0)
                .toUpperCase();
          });
        } else if (this.context.type === "measure") {
          let mtype = this.context.filters.measure_type.value;
          data.results.forEach(res => {
            if (mtype === "estimation_procedure")
              res["measure_id"] = getProperty(res, "proc_id");
            else if (mtype === "data_quality")
              res["measure_id"] = getProperty(res, "quality_id");
            else if (mtype === "evaluation_measure")
              res["measure_id"] = getProperty(res, "eval_id");
          });
        }
        this.context.setResults(data.counts, data.results);
      })
      .catch(error => {
        console.error(error);
        try {
          this.setState({
            error:
              "" +
              error +
              (error.hasOwnProperty("fileName")
                ? " (" + error.fileName + ":" + error.lineNumber + ")"
                : "")
          });
        } catch (ex) {
          console.error("There was an error displaying the above error");
          console.error(ex);
        }
      });
  }

  // Translate sort options to URL query parameters
  sortChange = filters => {
    if ("sort" in filters) {
      this.updateQuery("sort", filters.sort);
    }
    if ("order" in filters) {
      this.updateQuery("order", filters.order);
    }
    this.reload();
  };

  // Translate filters to URL query parameters
  // Filters in format:
  // [{name: qualities.xxx, type: >, value:1000}]
  filterChange = filters => {
    console.log("Filter change", filters);
    filters.forEach(filter => {
      this.updateQuery(filter.name, filter.type + "_" + filter.value);
    });
    this.reload();
  };

  // New dataset selected
  // Note: We update the context first, then update the URL,
  // because we want to render before waiting for the browser.
  selectEntity = value => {
    let qstring = this.getQueryParams();
    if (value !== null) {
      qstring.id = value;
    } else {
      qstring.id = undefined;
    }
    this.context.setSearch(qstring);
    this.updateQuery("id", value);
  };

  tableSelect = (event, id) => {
    this.updateQuery("id", id);
  };

  // Switch between tabs
  tabChange = (event, activeTab) => {
    console.log("SetState: activeTab");
    this.setState(state => ({ activeTab }));
  };

  getEntityList = () => {
    let attrs = {
      searchcolor: this.context.getColor(),
      selectEntity: this.selectEntity.bind(this),
      sortChange: this.sortChange,
      filterChange: this.filterChange
    };
    switch (this.context.type) {
      case "data":
        return <DataListPanel attrs={attrs} />;
      case "task":
        return <TaskListPanel attrs={attrs} />;
      case "flow":
        return <FlowListPanel attrs={attrs} />;
      case "run":
        return <RunListPanel attrs={attrs} />;
      case "task_type":
        return <TaskTypeListPanel attrs={attrs} />;
      case "measure":
        return <MeasureListPanel attrs={attrs} />;
      case "study":
        return <StudyListPanel attrs={attrs} />;
      case "user":
        return <UserListPanel attrs={attrs} />;
      default:
        return <DataListPanel attrs={attrs} />;
    }
  };

  render() {
    const activeTab = this.state.activeTab;

    return (
      <Grid container spacing={0}>
        <Grid
          item
          xs={12}
          sm={3}
          style={{ display: this.context.searchCollapsed ? "none" : "block" }}
        >
          {this.getEntityList()}
        </Grid>
        <Grid item xs={12} sm={this.context.searchCollapsed ? 12 : 9}>
          <SearchTabs
            value={activeTab}
            onChange={this.tabChange}
            color="inherit"
            searchcolor={this.context.getColor()}
          >
            <SearchTab
              label="Detail"
              key="detail"
              searchcolor={this.context.getColor()}
            />
            <SearchTab
              label="Dashboard"
              key="dash"
              searchcolor={this.context.getColor()}
            />
          </SearchTabs>
          <Scrollbar>
            {activeTab === 0 ? (
              this.context.id ? (
                <DetailPanel>
                  <EntryDetails
                    type={this.context.type}
                    entity={this.context.id}
                  />
                </DetailPanel>
              ) : (
                <DetailTable
                  entity_type={this.props.entity_type}
                  table_select={this.tableSelect}
                />
              )
            ) : this.context.id ? (
              // TODO: Add logic to call subtypes (e.g. run collection,
              // task collection). E.g.:
              // if(context.filter.study_type === 'run') ...
              <div>
                <iframe
                  src={
                    "https://" +
                    String(window.location.host) +
                    "/dashboard/" +
                    String(this.context.type) +
                    "/" +
                    String(this.context.id)
                  }
                  height="1500px"
                  width="98%"
                  frameBorder="0"
                  id="dash_iframe"
                  title={"dash_iframe_data_" + this.state.searchEntity}
                  allowFullScreen
                  sandbox="allow-popups
                            allow-scripts allow-same-origin allow-top-navigation"
                ></iframe>
              </div>
            ) : (
              <div>
                <iframe
                  src={
                    "https://" +
                    String(window.location.host) +
                    "/dashboard/" +
                    String(this.context.type)
                  }
                  height="1500px"
                  width="98%"
                  frameBorder="0"
                  id="dash_iframe_overview"
                  title={"dash_iframe_over_"}
                  allowFullScreen
                  sandbox="allow-popups
                            allow-scripts allow-same-origin allow-top-navigation"
                ></iframe>
                .
              </div>
            )}
          </Scrollbar>
        </Grid>
      </Grid>
    );
  }
}

export class DataListPanel extends React.PureComponent {
  render() {
    return (
      <SearchResultsPanel
        tag={this.props.tag} // for nested query in study page
        sortOptions={[
          //{"name": "best match", "value": "match "},
          { name: "Runs", value: "runs" },
          { name: "Likes", value: "nr_of_likes" },
          { name: "Downloads", value: "nr_of_downloads" },
          { name: "Reach", value: "reach" },
          { name: "Impact", value: "impact" },
          { name: "Date uploaded", value: "date" },
          { name: "Date updated", value: "last_update" },
          { name: "Instances", value: "qualities.NumberOfInstances" },
          { name: "Features", value: "qualities.NumberOfFeatures" },
          {
            name: "Numeric Features",
            value: "qualities.NumberOfNumericFeatures"
          },
          { name: "Missing Values", value: "qualities.NumberOfMissingValues" },
          { name: "Classes", value: "qualities.NumberOfClasses" }
        ]}
        filterOptions={[
          {
            name: "Instances",
            value: "qualities.NumberOfInstances",
            type: "numeric"
          },
          {
            name: "Features",
            value: "qualities.NumberOfFeatures",
            type: "numeric"
          },
          {
            name: "Number of Missing values",
            value: "qualities.NumberOfMissingValues",
            type: "numeric"
          },
          {
            name: "Classes",
            value: "qualities.NumberOfClasses",
            type: "numeric"
          },
          {
            name: "Default Accuracy",
            value: "qualities.DefaultAccuracy",
            type: "numeric"
          },
          { name: "Uploader", value: "uploader", type: "string" }
        ]}
        type="data"
        idField="data_id"
        stats={[
          { param: "runs", unit: "runs", color: red[500], icon: "atom" },
          {
            param: "nr_of_likes",
            unit: "likes",
            color: purple[500],
            icon: "heart"
          },
          {
            param: "nr_of_downloads",
            unit: "downloads",
            color: blue[500],
            icon: "cloud-download-alt"
          }
        ]}
        stats2={[
          { param: "qualities.NumberOfInstances", unit: "instances" },
          { param: "qualities.NumberOfFeatures", unit: "fields" },
          { param: "qualities.NumberOfClasses", unit: "classes" },
          { param: "qualities.NumberOfMissingValues", unit: "missing" }
        ]}
        sortChange={this.props.attrs.sortChange}
        filterChange={this.props.attrs.filterChange}
        searchColor={this.props.attrs.searchcolor}
        selectEntity={this.props.attrs.selectEntity}
      ></SearchResultsPanel>
    );
  }
}

export class FlowListPanel extends React.PureComponent {
  render() {
    return (
      <SearchResultsPanel
        tag={this.props.tag} // for nested query in study page
        sortOptions={[{ name: "Runs", value: "runs" }]}
        filterOptions={[]}
        type="flow"
        nameField="name"
        descriptionField="description"
        processDescription={false}
        idField="flow_id"
        stats={[
          { param: "runs", unit: "runs", color: red[500], icon: "atom" },
          {
            param: "nr_of_likes",
            unit: "likes",
            color: purple[500],
            icon: "heart"
          },
          {
            param: "nr_of_downloads",
            unit: "downloads",
            color: blue[500],
            icon: "cloud-download-alt"
          }
        ]}
        sortChange={this.props.attrs.sortChange}
        filterChange={this.props.attrs.filterChange}
        searchColor={this.props.attrs.searchcolor}
        selectEntity={this.props.attrs.selectEntity}
      ></SearchResultsPanel>
    );
  }
}

export class UserListPanel extends React.PureComponent {
  render() {
    return (
      <SearchResultsPanel
        sortOptions={[{ name: "Date", value: "date" }]}
        filterOptions={[]}
        type="user"
        firstName="first_name"
        nameField="last_name"
        descriptionField="bio"
        processDescription={false}
        idField="user_id"
        stats={[
          {
            unit: "datasets uploaded",
            param: "datasets_uploaded",
            color: green[500],
            icon: "database"
          },
          {
            unit: "flows uploaded",
            param: "flows_uploaded",
            color: blue[500],
            icon: "cog"
          },
          {
            unit: "runs uploaded",
            param: "runs_uploaded",
            color: red[400],
            icon: "atom"
          },
          {
            unit: "activity",
            param: "activity",
            color: red[800],
            icon: "heartbeat"
          },
          { unit: "reach", param: "reach", color: purple[500], icon: "rss" },
          {
            unit: "impact",
            param: "impact",
            color: blue[500],
            icon: "bolt"
          }
        ]}
        sortChange={this.props.attrs.sortChange}
        filterChange={this.props.attrs.filterChange}
        searchColor={this.props.attrs.searchcolor}
        selectEntity={this.props.attrs.selectEntity}
      ></SearchResultsPanel>
    );
  }
}

export class StudyListPanel extends React.PureComponent {
  render() {
    return (
      <SearchResultsPanel
        sortOptions={[
          { name: "Date", value: "date" },
          { name: "Datasets", value: "datasets_included" }, // This does not work, since for some reason
          { name: "Tasks", value: "tasks_included" }, // these three variables are not numbers, but
          { name: "Flows", value: "flows_included" } // are actually strings, which ES cannot
        ]} // sort properly
        filterOptions={[]}
        type="study"
        nameField="name"
        descriptionField="description"
        processDescription={false}
        idField="study_id"
        stats={[
          {
            param: "datasets_included",
            unit: "datasets",
            color: green[400],
            icon: "database"
          },
          {
            param: "tasks_included",
            unit: "tasks",
            color: yellow[700],
            icon: "flag"
          },
          {
            param: "flows_included",
            unit: "flows",
            color: blue[500],
            icon: "cog"
          },
          {
            param: "runs_included",
            unit: "runs",
            color: red[500],
            icon: "atom"
          }
        ]}
        sortChange={this.props.attrs.sortChange}
        filterChange={this.props.attrs.filterChange}
        searchColor={this.props.attrs.searchcolor}
        selectEntity={this.props.attrs.selectEntity}
      ></SearchResultsPanel>
    );
  }
}

export class TaskListPanel extends React.PureComponent {
  render() {
    return (
      <SearchResultsPanel
        tag={this.props.tag} // for nested query in study page
        sortOptions={[
          //{"name": "best match", "value": "match "},
          { name: "Runs", value: "runs" },
          { name: "Likes", value: "nr_of_likes" },
          { name: "Downloads", value: "nr_of_downloads" }
        ]}
        filterOptions={[
          {
            name: "Estimation Procedure",
            value: "estimation_procedure.name",
            type: "string"
          }
        ]}
        type="task"
        nameField={"tasktype.name"}
        descriptionField="source_data.name"
        processDescription={false}
        idField="task_id"
        stats={[
          { param: "runs", unit: "runs", color: red[500], icon: "atom" },
          {
            param: "nr_of_likes",
            unit: "likes",
            color: purple[500],
            icon: "heart"
          },
          {
            param: "nr_of_downloads",
            unit: "downloads",
            color: blue[500],
            icon: "cloud-download-alt"
          }
        ]}
        sortChange={this.props.attrs.sortChange}
        filterChange={this.props.attrs.filterChange}
        searchColor={this.props.attrs.searchcolor}
        selectEntity={this.props.attrs.selectEntity}
      ></SearchResultsPanel>
    );
  }
}

export class TaskTypeListPanel extends React.PureComponent {
  render() {
    return (
      <SearchResultsPanel
        tag={this.props.tag} // for nested query in study page
        sortOptions={[]}
        filterOptions={[]}
        type="task_type"
        nameField={"task_type.name"}
        descriptionField="blabla"
        processDescription={false}
        idField="tt_id"
        sortChange={this.props.attrs.sortChange}
        filterChange={this.props.attrs.filterChange}
        searchColor={this.props.attrs.searchcolor}
        selectEntity={this.props.attrs.selectEntity}
      ></SearchResultsPanel>
    );
  }
}

export class MeasureListPanel extends React.PureComponent {
  render() {
    return (
      <SearchResultsPanel
        tag={this.props.tag} // for nested query in study page
        sortOptions={[]}
        filterOptions={[]}
        type="measure"
        nameField={"measure.name"}
        descriptionField="blabla"
        processDescription={false}
        idField="measure_id"
        sortChange={this.props.attrs.sortChange}
        filterChange={this.props.attrs.filterChange}
        searchColor={this.props.attrs.searchcolor}
        selectEntity={this.props.attrs.selectEntity}
      ></SearchResultsPanel>
    );
  }
}

export class RunListPanel extends React.PureComponent {
  render() {
    return (
      <SearchResultsPanel
        tag={this.props.tag} // for nested query in study page
        sortOptions={[{ name: "Downloads", value: "total_downloads" }]}
        filterOptions={[]}
        type="run"
        nameField="run_flow.name"
        descriptionField="output_files.model_readable.url"
        processDescription={false}
        idField="run_id"
        stats2={[
          { unit: "ACC", param: "predictive_accuracy", icon: "fa-chart-bar" },
          { unit: "AUC", param: "area_under_roc_curve", icon: "fa-chart-bar" },
          {
            unit: "RMSE",
            param: "root_mean_squared_error",
            icon: "fa-chart-bar"
          }
        ]}
        sortChange={this.props.attrs.sortChange}
        filterChange={this.props.attrs.filterChange}
        searchColor={this.props.attrs.searchcolor}
        selectEntity={this.props.attrs.selectEntity}
      ></SearchResultsPanel>
    );
  }
}
