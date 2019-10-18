import React from "react";
import { SearchResultsPanel } from "./search.js"
import { EntryDetails } from "./ItemDetail.js"
import { Grid, Tabs, Tab } from '@material-ui/core';
import styled from "styled-components";
import PerfectScrollbar from "react-perfect-scrollbar";
import queryString from 'query-string'
import { DatasetTable } from "./Tables.js"
import { search, getProperty } from "./api";
import { MainContext } from "../../App.js";
import { blue, orange, red, green, grey, purple} from "@material-ui/core/colors";

const SearchTabs = styled(Tabs)`
  height:51px;
  background-color: #fff;
  border-bottom: 1px solid rgba(0,0,0,0.12);
  color: ${props => props.searchcolor};
`;
const SearchTab = styled(Tab)`
  color: ${props => props.searchcolor} !important;
`;
const DetailPanel = styled.div`
  width:90%;
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

  .ps__rail-x, .ps__rail-y {
    display: none;
    opacity: 0;
    transition: background-color .2s linear, opacity .2s linear;
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
    loading: 'true'
  };


  // reload search results based on query parameters
  async componentDidMount() {
    let qstring = queryString.parse(this.props.location.search);
    if(this.context.sort === null){
      if(['data' , 'flow', 'task'].includes(qstring.type)){
        qstring.sort = "runs";
      } else {
        qstring.sort = "date";
      }
      this.addQuery("sort", qstring.sort);
    }
    let fields = ["name",qstring.type+"_id","tt_id","description","status","runs","nr_of_likes",
                  "nr_of_downloads","reach","impact","qualities.NumberOfInstances",
                  "qualities.NumberOfFeatures","qualities.NumberOfClasses",
                  "qualities.NumberOfMissingValues","source_data","tasktype",
                  "estimation_procedure","target_feature"];
    await this.context.setSearch(qstring, fields);
    this.reload();
  }

  // reload search results based on new updates
  async componentDidUpdate() {
    let qstring = queryString.parse(this.props.location.search);
    if(this.context.sort === null){
      if(['data' , 'flow', 'task'].includes(qstring.type)){
        qstring.sort = "runs";
      } else {
        qstring.sort = "date";
      }
      this.addQuery("sort", qstring.sort);
    }
    if(this.context.hasChanged(qstring)){
      this.componentDidMount();
    }
  }

  // translate single search filter to ElasticSearch filters
  toFilterQuery = (filters) => {
    filters.forEach((filter) => {
      if (filter.type === "=") {
          return {
              "term": {[filter.name]: filter.value}
          }
      }
      else if (filter.type === "gte" || filter.type === "lte") {
          return {
              "range": {
                  [filter.name]: {
                      [filter.type]: filter.value
                  }
              }
          }
      }
      else if (filter.type === "between") {
          return {
              "range": {
                  [filter.name]: {
                      "gte": filter.value,
                      "lte": filter.value2
                  }
              }
          }
      }
      else if (filter.type === "in"){
          return {
              "prefix" : { [filter.name] : filter.value }
          }
      }
      else {
          return null;
      }
    });
  }

  // call search engine for initial listing
  reload(){
    console.log("Start search with ", this.context)
    search(
      this.context.query,
      this.context.tag,
      this.context.type,
      this.context.fields,
      this.context.sort,
      this.context.order,
      //this.toFilterQuery(this.context.filter)
    ).then(
        (data) => {
            // Add in non-standard properties
            if ( this.context.type === 'task' ){
              data.results.forEach(
                res => {
                  res["name"] = getProperty(res, 'source_data.name');
                  res["description"] = getProperty(res, 'tasktype.name')
                    + ": predict '" + getProperty(res, 'target_feature')
                    + "', evaluate with " + getProperty(res, 'estimation_procedure.name');
                  if (data.hasOwnProperty("evaluation_measures")){
                    res["description"] += ", optimize '" + getProperty(res, 'evaluation_measures');
                  }
                });
            }
            this.context.setResults(data.counts, data.results);
          }).catch(
              (error) => {
                  console.error(error);
                  try {
                      this.setState({
                          "error": "" + error + (
                              error.hasOwnProperty("fileName") ? " (" + error.fileName + ":" + error.lineNumber + ")" : ""
                          ),
                          "loading": false
                      });
                  }
                  catch (ex) {
                      console.error("There was an error displaying the above error");
                      console.error(ex);
                  }
              }
          );
  }

  // Add URL query parameters
  addQuery = (param,value) => {
    if(param !== undefined && value !== undefined){
      let currentUrlParams = new URLSearchParams(this.props.location.search);
      currentUrlParams.set(param, value);
      this.props.history.push(this.props.location.pathname + "?" + currentUrlParams.toString());
  }}

  // Translate sort options to URL query parameters
  sortChange = (filters) => {
    console.log("Sort change",filters);
    if('sort' in filters){
      this.addQuery("sort", filters.sort);
    }
    if('order' in filters){
      this.addQuery("order", filters.order);
    }
    this.reload();
  }

  // Translate filters to URL query parameters
  // Filters in format:
  // [{name: qualities.xxx, type: >, value:1000}]
  filterChange = (filters) => {
    console.log("Filter change",filters);
    filters.forEach((filter) => {
      this.addQuery(filter.name, filter.type + "_" + filter.value);
    });
    this.reload();
  }

  // New dataset selected
  selectEntity = (value) => {
    this.context.setID(value);
    this.props.history.push('?type='+this.context.type+'&id='+value)
  }

  tableSelect = (event, id) => {
    this.props.history.push('/'+this.props.entity_type+'?id='+id)
  };

  // Switch between tabs
  tabChange = (event, activeTab) => {
    this.setState( (state) => ({activeTab}));
  };

  getColor = () => {
    switch (this.context.type){
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
                case "tasktype":
                 return orange[400]
                case "measure":
                 return grey[700]
                case "user":
                 return blue[300]
                default:
                 return grey[700]
     }
  }

  getEntityList = () => {
    let attrs = {
      searchcolor: this.getColor(this.context.type),
      selectEntity: this.selectEntity,
      sortChange: this.sortChange,
      filterChange: this.filterChange
    }
    switch (this.context.type){
                case "data":
                 return <DataListPanel attrs={attrs}/>
                case "task":
                 return <TaskListPanel attrs={attrs}/>
                case "flow":
                 return <FlowListPanel attrs={attrs}/>
                case "run":
                 return <RunListPanel attrs={attrs}/>
                case "tasktype":
                 return <TaskTypeListPanel attrs={attrs}/>
                case "study":
                 return <StudyListPanel attrs={attrs}/>
                case "user":
                 return <UserListPanel attrs={attrs}/>
                default:
                 return <DataListPanel attrs={attrs}/>
     }
  }

  render() {
      const activeTab = this.state.activeTab;

      return (
        <Grid container spacing={0}>
        <Grid item xs={12} sm={4} xl={3}>
          {this.getEntityList()}
        </Grid>
        <Grid item xs={12} sm={8} xl={9}>
          <SearchTabs
            value={activeTab}
            onChange={this.tabChange}
            indicatorColor="primary"
            textColor="primary"
            searchcolor={this.props.searchcolor}
            >
            <SearchTab label="Detail" key="detail" searchcolor={this.props.searchcolor}/>
            <SearchTab label="Dashboard" key="dash" searchcolor={this.props.searchcolor}/>
          </SearchTabs>
          <Scrollbar>
          {
            (
              activeTab === 0
                ? (this.context.id ?
                    <DetailPanel><EntryDetails type={this.context.type} entity={this.context.id}/></DetailPanel> :
                    <DatasetTable entity_type={this.props.entity_type} table_select={this.tableSelect}/>)
                : (this.context.id ?
                    <div>
                    <iframe src={"http://"+String(window.location.hostname)+":5000/dashboard/data/"+ String(this.state.searchEntity)+"/.html"}
                            height="1000vh" width="1000vh" frameBorder="0"
                            id="dash_iframe" title={'dash_iframe_data_'+this.state.searchEntity}
                            allowFullScreen sandbox="allow-scripts allow-same-origin">
                    </iframe>
                    </div> :
                    <div>No dataset selected. Render Dash overview of datasets.</div>)
            )
          }
          </Scrollbar>
        </Grid>
      </Grid>
    );
  }
}

export class DataListPanel extends React.Component {
    render() {
      return (
            <SearchResultsPanel
                tag={this.props.tag} // for nested query in study page
                sortOptions={[
                    //{"name": "best match", "value": "match "},
                    {"name": "Runs", "value": "runs"},
                    {"name": "Likes", "value": "nr_of_likes"},
                    {"name": "Downloads", "value": "nr_of_downloads"},
                    {"name": "Reach", "value": "reach"},
                    {"name": "Impact", "value": "impact"},
                    {"name": "Date uploaded", "value": "date"},
                    {"name": "Date updated", "value": "last_update"},
                    {"name": "Instances", "value": "qualities.NumberOfInstances"},
                    {"name": "Features", "value": "qualities.NumberOfFeatures"},
                    {"name": "Numeric Features", "value": "qualities.NumberOfNumericFeatures"},
                    {"name": "Missing Values", "value": "qualities.NumberOfMissingValues"},
                    {"name": "Classes", "value": "qualities.NumberOfClasses"}
                ]}
                filterOptions={[
                    {"name": "Instances", "value": "qualities.NumberOfInstances", "type": "numeric"},
                    {"name": "Features", "value": "qualities.NumberOfFeatures", "type": "numeric"},
                    {"name": "Number of Missing values", "value": "qualities.NumberOfMissingValues", "type": "numeric"},
                    {"name": "Classes", "value": "qualities.NumberOfClasses", "type": "numeric"},
                    {"name": "Default Accuracy", "value": "qualities.DefaultAccuracy", "type": "numeric"},
                    {"name": "Uploader", "value": "uploader", "type": "string"}
                ]}
                type="data"
                idField="data_id"
                stats={[
                    {"param": "runs", "unit": "runs", "icon": "fa fa-star"},
                    {"param": "nr_of_likes", "unit": "likes", "icon": "fa-heart"},
                    {"param": "nr_of_downloads", "unit": "downloads", "icon": "fa-cloud"},
                    {"param": "reach", "unit": "reach", "icon": "fa-rss"},
                    {"param": "impact", "unit": "impact", "icon": "fa-bolt"}
                ]}
                stats2={[
                    {"param": "qualities.NumberOfInstances", "unit": "instances"},
                    {"param": "qualities.NumberOfFeatures", "unit": "fields"},
                    {"param": "qualities.NumberOfClasses", "unit": "classes"},
                    {"param": "qualities.NumberOfMissingValues", "unit": "missing"}
                ]}
                sortChange={this.props.attrs.sortChange}
                filterChange={this.props.attrs.filterChange}
                searchColor={this.props.attrs.searchcolor}
                selectEntity={this.props.attrs.selectEntity}
            ></SearchResultsPanel>
          )
    }
}


export class FlowListPanel extends React.Component {

    render() {
        return <SearchResultsPanel
        tag={this.props.tag} // for nested query in study page
            sortOptions={[
                {"name": "Runs", "value": "runs"}
            ]}
            filterOptions={[]}
            type="flow"
            nameField="name"
            descriptionField="description"
            processDescription={false}
            idField="flow_id"
            stats={[
                {"param": "runs", "unit": "runs", "icon": "fa fa-star"},
                {"param": "nr_of_likes", "unit": "likes", "icon": "fa-heart"},
                {"param": "nr_of_downloads", "unit": "downloads", "icon": "fa-cloud"},
                {"param": "reach", "unit": "reach", "icon": "fa-rss"},
                {"param": "impact", "unit": "impact", "icon": "fa-bolt"}
            ]}
            stats2={[
                {"param": "reach_of_reuse", "unit": "reach of reuse"},
                {"param": "impact_of_reuse", "unit": "impact of reuse"}
            ]}
            sortChange={this.props.attrs.sortChange}
            filterChange={this.props.attrs.filterChange}
            searchColor={this.props.attrs.searchcolor}
            selectEntity={this.props.attrs.selectEntity}
        ></SearchResultsPanel>
    }
}


export class UserListPanel extends React.Component {
    render() {
        return <SearchResultsPanel
            sortOptions={[
                {"name": "Date", "value": "date"},
            ]}
            filterOptions={[]}
            type="user"
            firstName = "first_name"
            nameField="last_name"
            descriptionField="bio"

            processDescription={false}

            idField="user_id"

            stats={[
                {"unit": "uploads", "param": "nr_of_uploads", "icon": "fa-cloud"},
                {"unit": "activity", "param": "activity", "icon": "fa-heartbeat"},
                {"unit": "reach", "param": "reach", "icon": "fa-rss"},
                {"unit": "impact", "param": "impact", "icon": "lightning"}
            ]}

            stats2={[
                {"unit": "", "param": "affiliation", "icon": "fa-university"},
                {"unit": "", "param": "country", "icon": "fa-map-marker"},
                {"unit": "", "param": "date", "icon": "fa-clock"}
            ]}
            sortChange={this.props.attrs.sortChange}
            filterChange={this.props.attrs.filterChange}
            searchColor={this.props.attrs.searchcolor}
            selectEntity={this.props.attrs.selectEntity}
        ></SearchResultsPanel>
    }
}


export class StudyListPanel extends React.Component {
    render() {
        return <SearchResultsPanel
            sortOptions={[
                {"name": "Date", "value": "date"},
                {"name": "Datasets", "value": "datasets_included"}, // This does not work, since for some reason
                {"name": "Tasks", "value": "tasks_included"},       // these three variables are not numbers, but
                {"name": "Flows", "value": "flows_included"}        // are actually strings, which ES cannot
            ]}                                                      // sort properly
            filterOptions={[]}
            type="study"
            nameField="name"
            descriptionField="description"

            processDescription={false}

            idField="study_id"

            stats={[
                {"unit": "datasets", "param": "datasets_included", "icon": "fa-database"},
                {"unit": "tasks", "param": "tasks_included", "icon": "fa-trophy"},
                {"unit": "flows", "param": "flows_included", "icon": "fa-gears"},

            ]}
            stats2={[]}
            sortChange={this.props.attrs.sortChange}
            filterChange={this.props.attrs.filterChange}
            searchColor={this.props.attrs.searchcolor}
            selectEntity={this.props.attrs.selectEntity}
        ></SearchResultsPanel>
    }
}


export class TaskListPanel extends React.Component {
    render() {
        return <SearchResultsPanel
          tag={this.props.tag} // for nested query in study page
            sortOptions={[
                //{"name": "best match", "value": "match "},
                {"name": "Runs", "value": "runs"},
                {"name": "Likes", "value": "nr_of_likes"},
                {"name": "Downloads", "value": "nr_of_downloads"},
            ]}
            filterOptions={[
                {"name": "Estimation Procedure", "value": "estimation_procedure.name", "type": "string"},
            ]}
            type="task"
            nameField={"tasktype.name"}
            descriptionField="source_data.name"
            processDescription={false}
            idField="task_id"
            stats={[
                {"param": "runs", "unit": "runs", "icon": "fa fa-star"},
                {"param": "nr_of_likes", "unit": "likes", "icon": "fa-heart"},
                {"param": "nr_of_downloads", "unit": "downloads", "icon": "fa-cloud"},
                {"param": "reach", "unit": "reach", "icon": "fa-rss"},
                {"param": "impact", "unit": "impact", "icon": "fa-bolt"}
            ]}
            stats2={[
                {"param": "estimation_procedure.name", "unit": "estimation procedure"},
                {"param": "reuse", "unit": "reuse"},
                {"param": "reach_of_reuse", "unit": "reach of reuse"},
            ]}
            sortChange={this.props.attrs.sortChange}
            filterChange={this.props.attrs.filterChange}
            searchColor={this.props.attrs.searchcolor}
            selectEntity={this.props.attrs.selectEntity}
        ></SearchResultsPanel>
    }
}

export class TaskTypeListPanel extends React.Component {
    render() {
        return <SearchResultsPanel
          tag={this.props.tag} // for nested query in study page
            sortOptions={[]}
            filterOptions={[]}
            type="tasktype"
            nameField={"tasktype.name"}
            descriptionField="blabla"
            processDescription={false}
            idField="tt_id"
            stats={[]}
            stats2={[]}
            sortChange={this.props.attrs.sortChange}
            filterChange={this.props.attrs.filterChange}
            searchColor={this.props.attrs.searchcolor}
            selectEntity={this.props.attrs.selectEntity}
        ></SearchResultsPanel>
    }
}

export class MeasureListPanel extends React.Component {
    render() {
        return <SearchResultsPanel
          tag={this.props.tag} // for nested query in study page
            sortOptions={[]}
            filterOptions={[]}
            type="measure"
            nameField={"measure.name"}
            descriptionField="blabla"
            processDescription={false}
            idField="measure_id"
            stats={[]}
            stats2={[]}
            sortChange={this.props.attrs.sortChange}
            filterChange={this.props.attrs.filterChange}
            searchColor={this.props.attrs.searchcolor}
            selectEntity={this.props.attrs.selectEntity}
        ></SearchResultsPanel>
    }
}

export class RunListPanel extends React.Component {
    render() {
        return <SearchResultsPanel
        tag={this.props.tag} // for nested query in study page
            sortOptions={[
                {"name": "Downloads", "value": "total_downloads"}
            ]}

            filterOptions={
                []
            }

            type="run"
            nameField="run_flow.name"
            descriptionField="output_files.model_readable.url"
            processDescription={false}
            idField="run_id"

            stats={[
                {"unit": "likes", "param": "nr_of_likes", "icon": "fa-heart"},
                {"unit": "downloads", "param": "nr_of_downloads", "icon": "fa-cloud"},
                {"unit": "reach", "param": "reach", "icon": "fa-rss"}
            ]}
            stats2={
                []
            }
            sortChange={this.props.attrs.sortChange}
            filterChange={this.props.attrs.filterChange}
            searchColor={this.props.attrs.searchcolor}
            selectEntity={this.props.attrs.selectEntity}
        ></SearchResultsPanel>
    }
}
