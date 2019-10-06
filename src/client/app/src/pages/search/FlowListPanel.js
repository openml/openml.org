import React from "react";
import { SearchResultsPanel } from "./search.js"

export default class FlowListPanel extends React.Component {
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
        ></SearchResultsPanel>
    }
}
