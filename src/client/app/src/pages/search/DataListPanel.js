import React from "react";
import { SearchResultsPanel } from "./search.jsx"
import { Grid, Tabs, Tab } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const SearchTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#1890ff',
  },
})(Tabs);

const SearchTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$selected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  selected: {},
}))(props => <Tab disableRipple {...props} />);


export default class DataListPanel extends React.Component {
    state = {
      activeTab: 0,
    };

    handleChange = (event, activeTab) => {
      this.setState( (state) => ({activeTab}));
    };

    render() {
        const { classes } = this.props;
        const { activeTab } = this.state;

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
            ></SearchResultsPanel>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Tabs
              value={activeTab}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              >
              <Tab label="Detail" key="detail" />
              <Tab label="Dashboard" key="dash" />
            </Tabs>
            {
              (
                activeTab === 0
                  ? <div>Details go here</div>
                  : <div>Dash goes here</div>
              )
            }
          </Grid>
        </Grid>
      );
    }
}
