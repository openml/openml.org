import React from "react";
import { SearchResultsPanel } from "./SearchResultsPanel.js";
import { EntryDetails } from "./ItemDetail.js";
import { FilterBar } from "./FilterBar.js";
import { Grid, Tabs, Tab } from "@material-ui/core";
import styled from "styled-components";
//import Scrollbar from "react-scrollbars-custom";
import PerfectScrollbar from "react-perfect-scrollbar";
import queryString from "query-string";
import { DetailTable } from "./Tables.js";
import { search, getProperty } from "./api";
import { MainContext } from "../../App.js";
import { blue, red, green, yellow, purple } from "@material-ui/core/colors";

const Scrollbar = styled(PerfectScrollbar)`
  overflow-x: hidden;
  position: relative;
  width: 100%;
  height: calc(100vh - 186px);
  overflow: "auto";

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
const SearchTabs = styled(Tabs)`
  height: 61px;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  border-top: 1px solid rgba(0, 0, 0, 0.12);

  .MuiTabs-indicator {
    background-color: ${props => props.searchcolor} !important;
  }
`;
const SearchTab = styled(Tab)`
  color: ${props => props.searchcolor} !important;
  font-size: 11pt;
  margin-top: 5px;
`;
const DetailPanel = styled.div`
  width: 90%;
  margin: 0 auto;
  margin-top: 12px;
`;

export default class SearchPanel extends React.Component {
  //Flow:
  // * render the right Panel (e.g. DataListPanel) empty
  // * call API to get data
  // * re-render panels with data

  static contextType = MainContext;

  state = {
    previousWidth: 0
  };

  // Get and sanitize query parameters
  getQueryParams = () => {
    let qstring = queryString.parse(this.props.location.search);

      // Sensible defaults
      if (qstring.type === "data" && qstring.status === undefined) {
        qstring.status = "active";
        this.updateQuery("status", "active");
      } else if (qstring.type === "measure" && qstring.measure_type === undefined) {
        qstring.measure_type = "data_quality";
        this.updateQuery("measure_type", "data_quality");
      } else if ((qstring.type === "study" || qstring.type === "benchmark") && qstring.study_type === undefined) {
        qstring.study_type = "task";
        this.updateQuery("study_type", "task");
      } else if ((qstring.type === "study" || qstring.type === "benchmark") && 
          this.context.filters.study_type !== undefined && qstring.study_type !== this.context.filters.study_type.value) {
        //study type changed, reset active tab
        this.context.activeTab = 0
      }

    // If no sort is defined, set a sensible default
    if (this.context.sort === null || this.context.type !== qstring.type) {
      if (["data", "flow", "task"].includes(qstring.type)) {
        qstring.sort = "runs";
      } else if ((qstring.type === "study" || qstring.type === "benchmark") && qstring.study_type === "task") {
        qstring.sort = "tasks_included";
      } else if ((qstring.type === "study" || qstring.type === "benchmark") && qstring.study_type === "run") {
        qstring.sort = "runs_included";
      } else {
        qstring.sort = "date";
      }
      this.updateQuery("sort", qstring.sort);
    }

    return qstring;
  };

  // Add URL query parameters
  // Note: includes an async call. Don't expect that the URL is already
  // updated when this call returns.
  updateQuery = (param, value) => {
    if (param !== undefined) {
      let currentUrlParams = new URLSearchParams(this.props.location.search);
      if (value === null || value === "" || value === undefined) {
        currentUrlParams.delete(param);
      } else {
        currentUrlParams.set(param, value);
      }
      this.props.history.push(
        this.props.location.pathname + "?" + currentUrlParams.toString()
      );
    }
  };

  goToSubType = (type, id, filter, filter_id) => {
    let currentUrlParams = new URLSearchParams(this.props.location.search);
    currentUrlParams.delete("status");
    currentUrlParams.delete("source_data.data_id");
    currentUrlParams.delete("run_task.task_id");
    currentUrlParams.delete("study_type");
    currentUrlParams.delete("sort");
    currentUrlParams.set("type", type);
    currentUrlParams.set(filter, filter_id);
    currentUrlParams.set("id", id);
    this.props.history.push(
      this.props.location.pathname + "?" + currentUrlParams.toString()
    );
  };

  clearFilters = (key) => {
    if (key === "status") {
      this.updateQuery("status", "any");
    } else {
      this.updateQuery(key, undefined);
    }
  };

  updateWindowDimensions = () => {
    if (this.context.displaySplit && window.innerWidth < 600) {
        this.context.toggleSplit();
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
      "date",
      "url"
    ],
    task_type: ["tt_id", "name", "description", "date"],
    task: [
      "task_id",
      "tasktype.name",
      "source_data.name",
      "target_feature",
      "evaluation_measures",
      "estimation_procedure.name",
      "target_values",
      "target_value",
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
      "study_type",
      "name",
      "description",
      "uploader",
      "datasets_included",
      "tasks_included",
      "flows_included",
      "runs_included",
      "date"
    ],
    benchmark: [
      "study_id",
      "study_type",
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

  // important: don't update while waiting for queries
  shouldComponentUpdate(nextProps, nextState) {
    return this.context.updateType !== "query" || this.context.results.length > 0;
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
      this.reload(); // Does initial load or when query changes
    } else if (this.context.updateType === "subquery") {
      this.loadSubQuery();
    } else if (this.context.updateType === "id" && this.context.activeTab>1) {
      this.loadSubQuery();
    } else {
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

  // translate search filters to ElasticSearch filters
  toFilterQuery = filters => {
    let queryFilters = [];
    for (var key in filters) {
      if (filters[key].type === "=") {
        if (key.startsWith("tags")) {
          filters[key].value.split("-").forEach(t => {
            queryFilters.push({
              nested: { path: "tags", query: { "term": { "tags.tag": t.toLowerCase() } } }
            })
          });
        }
        else if (key.startsWith("collections")) {
            queryFilters.push({
              nested: { path: "collections", query: { "term": { "collections.id": filters[key].value } } }
            });
        }
        else if (filters[key].value !== "any") {
          queryFilters.push({
            term: { [key]: filters[key].value }
          });
        }
        // type-specific filters for benchmarks
        // TODO: replace when meta-data field exists to indicate benchmarks
        if (this.context.type === "benchmark" && key === "study_type") {
          if (filters[key].value === "task") {
            queryFilters.push({
              bool: { should: [ {"wildcard": { "name": "*benchmark*" }}, {"wildcard": { "name": "*suite*" }}] }
            });
          } else if (filters[key].value === "run") {
            queryFilters.push({
              bool: { should: [ {"wildcard": { "name": "*study*" }}, {"wildcard": { "name": "*benchmark*" }}, ] }
            });
          }
        }
      } else if (filters[key].type === "gte" || filters[key].type === "lte") {
        queryFilters.push({
          range: {
            [key]: {
              [filters[key].type]: filters[key].value
            }
          }
        });
      } else if (filters[key].type === "between") {
        queryFilters.push({
          range: {
            [key]: {
              gte: filters[key].value,
              lte: filters[key].value2
            }
          }
        });
      } else if (filters[key].type === "in") {
        queryFilters.push({
          prefix: { [key]: filters[key].value }
        });
      } 
      if (this.context.type === "measure" && key === "measure_type") {
        queryFilters.push({
          term: { [key]: filters[key].type + "_" + filters[key].value}
        });
      }
    }

    return queryFilters;
  };

  processSearchResults = (data, type) => {
    // Add in non-standard properties
    if (type === "task") {
      data.results.forEach(res => {
        res["comp_name"] = getProperty(res, "source_data.name") + " " + getProperty(res, "tasktype.name").replace("Supervised ","").toLowerCase(); 
        if (getProperty(res, "tasktype.name").includes("Supervised")) {
          res["description"] = "Predict feature '" + getProperty(res, "target_feature") + "'. "
          if(getProperty(res, "target_values") && getProperty(res, "target_values").length<=10){
            res["description"] += "Possible values are '" + getProperty(res, "target_values") + "'. "
          }
        } else if (getProperty(res, "tasktype.name").includes("curve")) {
          res["description"] = "Perform '" + getProperty(res, "tasktype.name") + " analysis. "
        } else {
          res["description"] = "Perform " + getProperty(res, "tasktype.name") + ". "
          if(getProperty(res, "target_value")){
            res["description"] += "The target value is '" + getProperty(res, "target_value") + "'. "
          }
        }
        if (getProperty(res, "estimation_procedure.name")){
          res["description"] += "Evaluate models using " + getProperty(res, "estimation_procedure.name") + ". ";
        }
        res["description"] += "The evaluation measure is " + getProperty(res, "evaluation_measures") + ". ";
      });
    } else if (type === "run") {
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
    } else if (type === "user") {
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
    } else if (type === "measure") {
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
    return { counts: data.counts, results: data.results };
  };

  // call search engine to load more results
  reload() {
    // distinguishing benchmarks and studies in frontend
    let querytype = this.context.type;
    if (this.context.type === "benchmark"){
      querytype = "study";
    }
    // process query
    search(
      this.context.query,
      this.context.tag,
      querytype,
      this.context.fields,
      this.context.sort,
      (querytype === "measure" ? "asc" : this.context.order),
      this.toFilterQuery(this.context.filters),
      this.context.startCount
    )
      .then(data => {
          let res = this.processSearchResults(data, querytype)
          if (this.context.startCount === 0){
            this.context.setResults(res.counts, res.results);
          } else { //add to infinite list
            this.context.setResults(res.counts, this.context.results.concat(res.results));
          }
        }
      )
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


  // call search engine for sub-listing (e.g. tasks for a given dataset)
  loadSubQuery() {
    search(
      undefined, // query
      undefined, // tag
      this.context.subType,
      this.fields[this.context.subType],
      (this.context.subType === "task" ? "runs" : "date"),
      (this.context.subType === "task" ? "desc" : "asc"),
      this.toFilterQuery(this.drillDownFilter()),
      this.context.startSubCount
    )
      .then(data => {
          let res = this.processSearchResults(data, this.context.subType)
          if (this.context.startSubCount === 0){
            this.context.setSubResults(res.counts, res.results);
          } else {
            this.context.setSubResults(res.counts, this.context.subResults.concat(res.results));
          }
        }
      )
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
          this.context.setSubResults(0, []);
        } catch (ex) {
          console.error("There was an error displaying the above error");
          console.error(ex);
        }
      });
  }

  // Translate sort options to URL query parameters
  sortChange = filters => {
    if ("sort" in filters) {
      //this.context.setSort(filters.sort);
      this.updateQuery("sort", filters.sort);
    }
    if ("order" in filters) {
      this.updateQuery("order", filters.order);
    }
    //this.reload();
  };

  // Translate filters to URL query parameters
  // Filters in format:
  // [{name: qualities.xxx, type: >, value:1000}]
  filterChange = filters => {
    console.log("Filter change", filters);
    filters.forEach(filter => {
      if (filter.value2 === undefined) {
        this.updateQuery(filter.name, filter.value);
      } else if (filter.value2 === "") {
        this.updateQuery(filter.name, filter.type + "_" + filter.value);
      } else {
        this.updateQuery(
          filter.name,
          filter.type + "_" + filter.value + "_" + filter.value2
        );
      }
    });
    //this.reload();
  };

  tagChange = tag => {
    console.log("Tag change", tag);
    this.updateQuery("tags.tag", tag);
  };

  // New entity (id) selected
  // Note: We update the context first, then update the URL,
  // because we want to render before waiting for the browser.
  selectEntity = value => {
    let qstring = this.getQueryParams();
    if (value !== null) {
      qstring.id = value;
      this.context.setSearch(qstring);
    } else {
      qstring.id = undefined;
    }
    this.updateQuery("id", value);
  };

  selectSubEntity = value => {
    let qstring = {
      id: value,
      type: this.context.subType,
      sort: "runs"
    }
    if (this.context.type === "data"){
      qstring["source_data.data_id"] = this.context.id;
    } else if (this.context.type === "task"){
      qstring["run_task.task_id"] = this.context.id;
      qstring["sort"] = "date";
    } else if (this.context.type === "study" || this.context.type === "benchmark"){
      qstring["collections.id"] = this.context.id;
      if (this.context.filters.study_type.value === "run"){
        qstring["sort"] = "date";
      }
    }

    this.context.setSearch(qstring, this.fields[qstring.type]);
    if (this.context.type === "data"){
      this.goToSubType(this.context.subType, value, "source_data.data_id", this.context.id);
    } else if (this.context.type === "task"){
      this.goToSubType(this.context.subType, value, "run_task.task_id", this.context.id);
    } else if (this.context.type === "study" || this.context.type === "benchmark"){
      this.goToSubType(this.context.subType, value, "collections.id", this.context.id);
    }
  };

  tableSelect = (event, id) => {
    this.updateQuery("id", id);
  };

  // Drilldown filter
  drillDownFilter = () => {
    if (this.context.type === "data" && this.context.activeTab === 2 && 
        this.context.updatetype !== "subquery"){
      let filters = []
      filters["source_data.data_id"] = { value: this.context.id, type: "=" };
      return filters;
    } else if (this.context.type === "task" && this.context.activeTab === 2 && 
        this.context.updatetype !== "subquery"){
      let filters = []
      filters["run_task.task_id"] = { value: this.context.id, type: "=" };
      return filters;
    } else if ((this.context.type === "study" || this.context.type === "benchmark") && 
      this.context.updatetype !== "subquery"){
      let filters = []
      filters["collections.id"] = { value: this.context.id, type: "=" };
      return filters;
    }
  };

  // Switch between tabs
  tabChange = (event, activeTab) => {
    // Drilldown queries
    let type = "task";
    let toggling = false;
    // Reset search when toggling between different sub-searches
    if ((this.context.type === "study" || this.context.type === "benchmark") && this.context.filters.study_type.value === "run"){
      if ((activeTab === 3 && this.context.subType === "task") || 
          (activeTab === 2 && this.context.subType === "run") ){
        toggling = true;
      }
    }    
    // Only repeat search if current sub-search is empty
    if (this.context.startSubCount === 0 || toggling){
      if (this.context.type === "task"){
        type = "run";
      } else if (activeTab === 3 && (this.context.type === "study" || this.context.type === "benchmark") && 
                this.context.filters.study_type.value === "run"){
        type = "run";    
      }
      this.context.setSubSearch(type, this.drillDownFilter());
    }
    // Set new active tab
    this.context.setActiveTab(activeTab);
  };

  getFilterOptions = () => {
    switch (this.context.type) {
      case "data":
        return {
          Status: {
            name: "Status",
            value: "status",
            options: [
              { name: "Verified", type: "=", value: "active" },
              { name: "In preparation", type: "=", value: "in_preparation" },
              { name: "Deactivated", type: "=", value: "deactivated" },
              { name: "Any", type: "=", value: "any" }
            ]
          },
          Instances: {
            name: "Instances",
            value: "qualities.NumberOfInstances",
            options: [
              { name: "All", type: "gte", value: "0", value2: "" },
              { name: "100s", type: "lte", value: "1000", value2: "" },
              {
                name: "1000s",
                type: "between",
                value: "1000",
                value2: "10000"
              },
              {
                name: "10000s",
                type: "between",
                value: "10000",
                value2: "100000"
              },
              {
                name: "100000s",
                type: "between",
                value: "100000",
                value2: "1000000"
              },
              {
                name: "Millions",
                type: "gte",
                value: "1000000",
                value2: ""
              }
            ]
          },
          Features: {
            name: "Features",
            value: "qualities.NumberOfFeatures",
            options: [
              { name: "All", type: "gte", value: "0", value2: "" },
              { name: "Less than 10", type: "lte", value: "10", value2: "" },
              {
                name: "10s",
                type: "between",
                value: "10",
                value2: "100"
              },
              {
                name: "100s",
                type: "between",
                value: "100",
                value2: "1000"
              },
              {
                name: "1000s",
                type: "between",
                value: "1000",
                value2: "10000"
              },
              {
                name: "10000s",
                type: "gte",
                value: "10000",
                value2: ""
              }
            ]
          },
          Target: {
            name: "Target",
            value: "qualities.NumberOfClasses",
            options: [
              { name: "All", type: "gte", value: "-1", value2: "" },
              { name: "Numeric", type: "lte", value: "1", value2: "" },
              { name: "Binary", type: "=", value: "2", value2: "" },
              { name: "Multi-class", type: "gte", value: "2", value2: "" }
            ]
          },
          ...(this.context.userID && {
            Uploader: {
              name: "Uploader",
              value: "uploader_id",
              options: [
                { name: "All", type: "gte", value: "0", value2: "" },
                {
                  name: "Mine",
                  type: "=",
                  value: "" + this.context.userID,
                  value2: ""
                }
              ]
            }
          })
        };
      case "task":
        return {
          "Task type": {
            name: "Task type",
            value: "tasktype.tt_id",
            options: [
              { name: "Classification", type: "=", value: "1", value2: "" },
              { name: "Regression", type: "=", value: "2", value2: "" },
              {
                name: "Stream classification",
                type: "=",
                value: "4",
                value2: ""
              },
              { name: "Clustering", type: "=", value: "5", value2: "" }
            ]
          }
        };
      default:
        return [];
    }
  };

  getSortOptions = () => {
    switch (this.context.type) {
      case "data":
        return [
          //{"name": "best match", "value": "match "},
          { name: "Runs", value: "runs" },
          { name: "Likes", value: "nr_of_likes" },
          { name: "Downloads", value: "nr_of_downloads" },
          { name: "Date uploaded", value: "date" },
          { name: "Instances", value: "qualities.NumberOfInstances" },
          { name: "Features", value: "qualities.NumberOfFeatures" },
          {
            name: "Numeric Features",
            value: "qualities.NumberOfNumericFeatures"
          },
          { name: "Missing Values", value: "qualities.NumberOfMissingValues" },
          { name: "Classes", value: "qualities.NumberOfClasses" }
        ];
      case "task":
        return [
          //{"name": "best match", "value": "match "},
          { name: "Runs", value: "runs" },
          { name: "Likes", value: "nr_of_likes" },
          { name: "Downloads", value: "nr_of_downloads" }
        ];
      case "flow":
        return [{ name: "Runs", value: "runs" }];
      case "run":
        return [{ name: "Downloads", value: "total_downloads" }];
      case "study":
        return [
          { name: "Date", value: "date" },
          { name: "Datasets", value: "datasets_included" }, 
          { name: "Tasks", value: "tasks_included" }, 
          { name: "Flows", value: "flows_included" }
        ];
      case "benchmark":
        return [
          { name: "Date", value: "date" },
          { name: "Datasets", value: "datasets_included" },
          { name: "Tasks", value: "tasks_included" },
          { name: "Flows", value: "flows_included" }
        ];
      case "user":
        return [{ name: "Date", value: "date" }];
      case "measure":
        return [{ name: "Date", value: "date" }];
      default:
        return [];
    }
  };

  getEntityList = () => {
    let attrs = {
      selectEntity: this.selectEntity.bind(this),
      listType: "search",
      context: this.context, // Passing context as prop to avoid unnecessary rendering 
      reload: this.reload.bind(this)
    };
    switch (this.context.type) {
      case "data":
        return <DataListPanel id="searchPanelScroll" attrs={attrs} />;
      case "task":
        return <TaskListPanel id="searchPanelScroll" attrs={attrs} />;
      case "flow":
        return <FlowListPanel id="searchPanelScroll" attrs={attrs} />;
      case "run":
        return <RunListPanel id="searchPanelScroll" attrs={attrs} />;
      case "task_type":
        return <TaskTypeListPanel id="searchPanelScroll" attrs={attrs} />;
      case "measure":
        return <MeasureListPanel id="searchPanelScroll" attrs={attrs} />;
      case "study":
        return <StudyListPanel id="searchPanelScroll" attrs={attrs} />;
      case "benchmark":
        return <StudyListPanel id="searchPanelScroll" attrs={attrs} />;
      case "user":
        return <UserListPanel id="searchPanelScroll" attrs={attrs} />;
      default:
        return <DataListPanel id="searchPanelScroll" attrs={attrs} />;
    }
  };

  getSubEntityList = (entitytype) => {
    let attrs = {
      selectEntity: this.selectSubEntity.bind(this),
      listType: "drilldown",
      context: this.context, // Passing context as prop to avoid unnecessary rendering
      reload: this.loadSubQuery.bind(this)
    };
    switch (entitytype) {
      case "data":
        return <DataListPanel attrs={attrs} />;
      case "task":
        return <TaskListPanel attrs={attrs} />;
      case "flow":
        return <FlowListPanel attrs={attrs} />;
      case "run":
        return <RunListPanel attrs={attrs} />;
      default:
        return <DataListPanel attrs={attrs} />;
    }
  };

  render() {
    const activeTab = this.context.activeTab;

    const ucfirst = s => {
      return s && s[0].toUpperCase() + s.slice(1);
    };

    // distinguishing benchmarks and studies in frontend
    let querytype = this.context.type;
    if (this.context.type === "benchmark"){
      querytype = "study";
    }

    return (
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <FilterBar
            sortOptions={this.getSortOptions()}
            filterOptions={this.getFilterOptions()}
            searchColor={this.context.getColor()}
            resultSize={this.context.counts}
            resultType={querytype}
            sortChange={this.sortChange}
            filterChange={this.filterChange}
            clearFilters={this.clearFilters}
            tagChange={this.tagChange}
            selectEntity={this.selectEntity.bind(this)}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={!this.context.displaySplit ? 12 : 4}
          xl={!this.context.displaySplit ? 12 : 3}
          style={{
            display: (this.context.displaySplit || (!this.context.displayStats && (this.context.id === null || this.context.id === undefined))) ? "block" : "none"
          }}
        >
          {this.getEntityList()}
        </Grid>
        <Grid
          item
          xs={12}
          sm={!this.context.displaySplit ? 12 : 8}
          xl={!this.context.displaySplit ? 12 : 9}
          style={{
            display: (this.context.displaySplit || this.context.id || this.context.displayStats) ? "block" : "none"
          }}
        >
          <SearchTabs
            value={activeTab}
            onChange={this.tabChange}
            color="inherit"
            searchcolor={this.context.getColor()}
          >
            <SearchTab
              label={
                this.context.id !== undefined
                  ? ((this.context.type === 'study' || this.context.type === 'benchmark') ? 
                  ucfirst(this.context.filters.study_type.value) + " Collection" : 
                  ucfirst(this.context.type).replace("_"," ") + " Detail")
                  : "Statistics"
              }
              key="detail"
              searchcolor={this.context.getColor()}
            />
            <SearchTab
              label={this.context.id !== undefined ? "Analysis" : "Overview"}
              key="dash"
              searchcolor={this.context.getColor()}
            />
            {this.context.type === "data" && this.context.id !== undefined && (
              <SearchTab
                label="Tasks"
                key="data_tasks"
                searchcolor={this.context.getColor()}
              />
            )}
            {(this.context.type === "task" || this.context.type === "flow") &&
              this.context.id !== undefined && (
                <SearchTab
                  label="Runs"
                  key="runs_tasks"
                  searchcolor={this.context.getColor()}
                />
              )}
            {(this.context.type === "study" || this.context.type === "benchmark") && this.context.id !== undefined && (
              <SearchTab
                label="Tasks"
                key="collection_tasks"
                searchcolor={this.context.getColor()}
              />
            )}
            {(this.context.type === "study" || this.context.type === "benchmark") && this.context.filters.study_type && this.context.filters.study_type.value === "run" && this.context.id !== undefined && (
              <SearchTab
                label="Runs"
                key="collection_runs"
                searchcolor={this.context.getColor()}
              />
            )}
          </SearchTabs>
            {activeTab === 0 ? ( // Detail panel
              this.context.id ? (
                <Scrollbar>
                <DetailPanel>
                  <EntryDetails
                    type={querytype}
                    entity={this.context.id}
                    filters={this.context.filters}
                    history={this.props.history}
                    location={this.props.location}
                  />
                </DetailPanel>
                </Scrollbar>
              ) : (
                  <Scrollbar>
                  <DetailTable
                    entity_type={this.props.entity_type}
                    table_select={this.tableSelect}
                  />
                  </Scrollbar>
                )
            ) : // Dashboard for detail
              activeTab === 1 ? (
                this.context.id ? (
                  <Scrollbar>
                  <div style={{ height: "calc(100vh - 125px)" }}>
                    <iframe
                      src={
                        String(window.location.protocol) +
                        "//" +
                        String(window.location.host) +
                        "/dashboard/" +
                        String(this.context.type) +
                        "/" +
                        ((this.context.type === "study" || this.context.type === "benchmark") &&
                          this.context.filters.study_type
                          ? this.context.filters.study_type.value + "/"
                          : "") +
                        (this.context.type === "measure" &&
                          this.context.filters.measure_type
                          ? this.context.filters.measure_type.value + "/"
                          : "") +
                        String(this.context.id)
                      }
                      height="100%"
                      width="100%"
                      frameBorder="0"
                      id="dash_iframe"
                      title={"dash_iframe_data_" + this.state.searchEntity}
                      allowFullScreen
                      sandbox="allow-popups
                            allow-scripts allow-same-origin allow-top-navigation"
                    ></iframe>
                  </div>
                  </Scrollbar>
                ) : (
                    // Dashboard for list
                    <Scrollbar>
                    <div style={{ height: "calc(100vh - 125px)" }}>
                      <iframe
                        src={
                          String(window.location.protocol) +
                          "//" +
                          String(window.location.host) +
                          "/dashboard/" +
                          String(this.context.type)
                        }
                        height="100%"
                        width="100%"
                        frameBorder="0"
                        id="dash_iframe_overview"
                        title={"dash_iframe_over_"}
                        allowFullScreen
                        sandbox="allow-popups
                            allow-scripts allow-same-origin allow-top-navigation"
                      ></iframe>
                    </div>
                    </Scrollbar>
                  )
              ) : ( // Other tabs are drilldowns 
                  this.context.id &&
                  ((this.context.type === "data" && activeTab === 2) ||
                   ((this.context.type === "study" || this.context.type === "benchmark") && activeTab === 2)
                   ? (
                    this.getSubEntityList("task")
                  ) : (
                    (this.context.type === "task" && activeTab === 2)
                    ? (
                      this.getSubEntityList("run")
                    ) : (
                    this.getSubEntityList("run")
                    ))
                ))}
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
        type="data"
        idField="data_id"
        stats={[
          { param: "runs", unit: "runs", color: red[500], icon: "flask" },
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
        selectEntity={this.props.attrs.selectEntity}
        listType={this.props.attrs.listType}
        context={this.props.attrs.context}
        reload={this.props.attrs.reload}
      ></SearchResultsPanel>
    );
  }
}

export class FlowListPanel extends React.PureComponent {
  render() {
    return (
      <SearchResultsPanel
        tag={this.props.tag} // for nested query in study page
        type="flow"
        nameField="name"
        descriptionField="description"
        processDescription={false}
        idField="flow_id"
        stats={[
          { param: "runs", unit: "runs", color: red[500], icon: "flask" },
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
        selectEntity={this.props.attrs.selectEntity}
        listType={this.props.attrs.listType}
        context={this.props.attrs.context}
        reload={this.props.attrs.reload}
      ></SearchResultsPanel>
    );
  }
}

export class UserListPanel extends React.PureComponent {
  render() {
    return (
      <SearchResultsPanel
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
            icon: "flask"
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
        selectEntity={this.props.attrs.selectEntity}
        listType={this.props.attrs.listType}
        context={this.props.attrs.context}
        reload={this.props.attrs.reload}
      ></SearchResultsPanel>
    );
  }
}

export class StudyListPanel extends React.PureComponent {
  render() {
    return (
      <SearchResultsPanel
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
            icon: "flask"
          }
        ]}
        selectEntity={this.props.attrs.selectEntity}
        listType={this.props.attrs.listType}
        context={this.props.attrs.context}
        reload={this.props.attrs.reload}
      ></SearchResultsPanel>
    );
  }
}

export class TaskListPanel extends React.PureComponent {
  render() {
    return (
      <SearchResultsPanel
        tag={this.props.tag} // for nested query in study page
        type="task"
        nameField={"tasktype.name"}
        descriptionField="source_data.name"
        processDescription={false}
        idField="task_id"
        stats={[
          { param: "runs", unit: "runs", color: red[500], icon: "flask" },
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
        selectEntity={this.props.attrs.selectEntity}
        listType={this.props.attrs.listType}
        context={this.props.attrs.context}
        reload={this.props.attrs.reload}
      ></SearchResultsPanel>
    );
  }
}

export class TaskTypeListPanel extends React.PureComponent {
  render() {
    return (
      <SearchResultsPanel
        tag={this.props.tag} // for nested query in study page
        type="task_type"
        nameField={"task_type.name"}
        descriptionField="blabla"
        processDescription={false}
        idField="tt_id"
        selectEntity={this.props.attrs.selectEntity}
        listType={this.props.attrs.listType}
        context={this.props.attrs.context}
        reload={this.props.attrs.reload}
      ></SearchResultsPanel>
    );
  }
}

export class MeasureListPanel extends React.PureComponent {
  render() {
    return (
      <SearchResultsPanel
        tag={this.props.tag} // for nested query in study page
        type="measure"
        nameField={"measure.name"}
        descriptionField="blabla"
        processDescription={false}
        idField="measure_id"
        selectEntity={this.props.attrs.selectEntity}
        listType={this.props.attrs.listType}
        context={this.props.attrs.context}
        reload={this.props.attrs.reload}
      ></SearchResultsPanel>
    );
  }
}

export class RunListPanel extends React.PureComponent {
  render() {
    return (
      <SearchResultsPanel
        tag={this.props.tag} // for nested query in study page
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
        selectEntity={this.props.attrs.selectEntity}
        listType={this.props.attrs.listType}
        context={this.props.attrs.context}
        reload={this.props.attrs.reload}
      ></SearchResultsPanel>
    );
  }
}
