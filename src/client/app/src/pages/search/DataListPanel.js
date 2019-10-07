import React from "react";
import { SearchResultsPanel } from "./search.js"
import { EntryDetails } from "./ItemDetail.js"
import { Grid, Tabs, Tab } from '@material-ui/core';
import styled from "styled-components";
import { green } from "@material-ui/core/colors";
import PerfectScrollbar from "react-perfect-scrollbar";
import queryString from 'query-string'

const SearchTabs = styled(Tabs)`
  height:51px;
  background-color: #fff;
  border-bottom: 1px solid rgba(0,0,0,0.12);
  color: ${green[500]};
`;
const SearchTab = styled(Tab)`
  color: ${green[500]} !important;
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

export default class DataListPanel extends React.Component {

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
      this.props.history.push('/data?id='+value)
    }

    // Switch between tabs
    tabChange = (event, activeTab) => {
      this.setState( (state) => ({activeTab}));
    };

    render() {
        const activeTab = this.state.activeTab;

        return (
          <Grid container spacing={0}>
          <Grid item xs={12} sm={4}>
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
                searchColor={green[500]}
                selectEntity={this.selectEntity}
            ></SearchResultsPanel>
          </Grid>
          <Grid item xs={12} sm={8}>
            <SearchTabs
              value={activeTab}
              onChange={this.tabChange}
              indicatorColor="primary"
              textColor="primary"
              >
              <SearchTab label="Detail" key="detail" />
              <SearchTab label="Dashboard" key="dash" />
            </SearchTabs>
            <Scrollbar>
            {
              (
                activeTab === 0
                  ? (this.state.searchEntity ?
                      <DetailPanel><EntryDetails type="data" entity={this.state.searchEntity}/></DetailPanel> :
                      <div>No dataset selected. Render overview table of datasets and properties.</div>)
                  : (this.state.searchEntity ?
                      <div>Render Dash for dataset with ID {this.state.searchEntity}</div> :
                      <div>No dataset selected. Render Dash overview of datasets.</div>)
              )
            }
            </Scrollbar>
          </Grid>
        </Grid>
      );
    }
}
