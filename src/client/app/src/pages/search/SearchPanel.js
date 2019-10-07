import React from "react";
import { SearchResultsPanel } from "./search.js"
import { EntryDetails } from "./ItemDetail.js"
import { Grid, Tabs, Tab } from '@material-ui/core';
import styled from "styled-components";
import PerfectScrollbar from "react-perfect-scrollbar";
import queryString from 'query-string'

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
  margin:10px;
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
    //props: entity_type

    state = {
      activeTab: 0,
      searchType: 'data',
      searchEntity: null
    };

    componentDidMount() {
      //read query parameters and open the right entity
      const qstring = queryString.parse(this.props.location.search);
      this.setState({searchEntity: (qstring.id ? qstring.id : null)});
    }

    // New dataset selected
    selectEntity = (value) => {
      this.setState({ searchEntity: value });
      this.props.history.push('/'+this.props.entity_type+'?id='+value)
    }

    // Switch between tabs
    tabChange = (event, activeTab) => {
      this.setState( (state) => ({activeTab}));
    };

    getEntityList = () => {
      switch (this.props.entity_type){
                  case "data":
                   return <DataListPanel searchcolor={this.props.searchcolor} selectEntity={this.selectEntity} />
                  case "task":
                   return <TaskListPanel searchcolor={this.props.searchcolor} selectEntity={this.selectEntity} />
                  case "flow":
                   return <FlowListPanel searchcolor={this.props.searchcolor} selectEntity={this.selectEntity} />
                  case "run":
                   return <RunListPanel searchcolor={this.props.searchcolor} selectEntity={this.selectEntity} />
                  case "study":
                   return <StudyListPanel searchcolor={this.props.searchcolor} selectEntity={this.selectEntity} />
                  case "user":
                   return <UserListPanel searchcolor={this.props.searchcolor} selectEntity={this.selectEntity} />
                  default:
                   return <DataListPanel searchcolor={this.props.searchcolor} selectEntity={this.selectEntity} />
       }
    }

    render() {
        const activeTab = this.state.activeTab;

        return (
          <Grid container spacing={0}>
          <Grid item xs={12} sm={4}>
            {this.getEntityList()}
          </Grid>
          <Grid item xs={12} sm={8}>
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
                  ? (this.state.searchEntity ?
                      <DetailPanel><EntryDetails type={this.props.entity_type} entity={this.state.searchEntity}/></DetailPanel> :
                      <div>No dataset selected. Render overview table of datasets and properties.</div>)
                  : (this.state.searchEntity ?
                      <div>
                      <iframe src={"http://"+String(window.location.hostname)+":5000/dashboard/data/"+ String(this.state.searchEntity)+"/.html"}
                              height="1000vh" width="1000vh" frameBorder="0"
                              id="dash_iframe"
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
                nameField="name"
                descriptionField="description"
                processDescription={true}
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
                statusField="status"
                searchColor={this.props.searchcolor}
                selectEntity={this.props.selectEntity}
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
            searchColor={this.props.searchcolor}
            selectEntity={this.props.selectEntity}
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
            searchColor={this.props.searchcolor}
            selectEntity={this.props.selectEntity}
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
            searchColor={this.props.searchcolor}
            selectEntity={this.props.selectEntity}
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
            searchColor={this.props.searchcolor}
            selectEntity={this.props.selectEntity}
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
            searchColor={this.props.searchcolor}
            selectEntity={this.props.selectEntity}
        ></SearchResultsPanel>
    }
}
