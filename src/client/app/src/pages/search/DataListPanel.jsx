import React from "react";
import { SearchResultsPanel } from "./search.jsx"

export class DataListPanel extends React.Component {
    render() {
        return (<div>
        {console.log("hello")}
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
        ></SearchResultsPanel></div>)
    }
}
