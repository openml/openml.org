import React from "react";
import {listDatasets} from "./api";

import {Link} from 'react-router-dom';
import {FilterBar} from "./filterBar.jsx";

class StatsScreen extends React.Component {
    render() {
        let stats = this.props.stats.map(
            item => <span className="stat" key={"stat_" + item.unit + "_" + item.value}>
			{item.icon ? (<span className={"fa " + item.icon}/>) : undefined}
                <span className="statValue">{item.value}</span>
                &nbsp;
                <span className="statUnit">{item.unit}</span>
			</span>
        );
        return <React.Fragment>{stats}</React.Fragment>
    }
}

class SearchElement extends React.Component {
    render() {
        return (
            <Link to={"/data/" + this.props.data_id} className={"noLink"}>
                <div className="contentSection item">
                    <div className="itemHead">
                        <span className="fa fa-database"/>
                    </div>
                    {
                        this.props.name!==undefined?
                        <div className="itemName">
                            {this.props.name + ''}
                        </div>:null
                    }
                    <div className="itemInfo">
                        <div className="itemTeaser">
                            {this.props.teaser + ''}
                        </div>
                        <div className="itemStats itemStatsBig">
                            <StatsScreen stats={this.props.stats}/>
                        </div>
                        <div className="itemStats itemStatsSmall">
                            <StatsScreen stats={this.props.stats2}/>
                        </div>
                    </div>
                </div>
            </Link>
        )
    }
}

export class SearchResultsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.results = [];
        this.state.error = null;
        this.state.loading = true;
        this.state.sort = this.props.sortOptions[0];
        this.state.order = "desc";
        this.state.filter = [];
    }

    componentDidMount() {
        this.reload();
    }

    reload() {
        listDatasets(
            this.props.type,
            {"value": this.state.sort.value, "order": this.state.order},
            this.state.filter,
            this.props.nameField,
            this.props.descriptionField,
            this.props.processDescription,
            this.props.idField,
            this.props.stats,
            this.props.stats2
        ).then(
            (data) => {
                console.log("finished: "+data.length+" ", this);
                this.setState((state)=>{
                    console.log("getstate: ",state);
                    return {"results": data, "loading": false};
                });
                this.forceUpdate();
            }
        ).catch(
            (error) => this.setState({"error": "" + error+(
                error.hasAttribute("fileName")?"("+error.fileName+":"+error.lineNumber+")":""
                ),"loading": false})
        )
    }

    componentWillUnmount() {
    }

    sortChange(sortType, order, filter) {
        console.log(sortType);
        console.log(order);
        console.log(filter);
        this.setState({"sort": sortType, "results": [], "loading": true, "order": order, "filter": filter},
            this.reload.bind(this));
    }

    render() {
        let component = null;

        if (this.state.loading) {
            component = <p>Loading... {JSON.stringify(this.state.sort)} {JSON.stringify(this.state.order)}</p>;
        }
        else if (this.state.results.length >= 1) {
            component = this.state.results.map(
                result => <SearchElement name={result.name} teaser={result.teaser} stats={result.stats}
                                         stats2={result.stats2} data_id={result.data_id}
                                         onclick={() => this.clickCallBack(result.data_id)}
                                         key={result.name + "_" + result.data_id}
                />
            );
        }
        else if (this.state.error !== null) {
            component = <p>Error: {this.state.error}</p>;
        }
        else {
            component = <p>No search results found</p>;
        }


        return <React.Fragment>
            <h1>Data sets</h1>
            <FilterBar
                sortOptions={this.props.sortOptions}
                onChange={this.sortChange.bind(this)}
                filterOptions={this.props.filterOptions}
            />
            {component}
        </React.Fragment>;
    }
}

export class DataListPanel extends React.Component {
    render() {
        return <SearchResultsPanel
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
                {"param": "qualities.NumberOfMissingValues" + "", "unit": "missing"}
            ]}
        />
    }
}

export class TaskListPanel extends React.Component {
    render() {
        return <SearchResultsPanel
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
            nameField={null}
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

        />
    }
}

export class FlowListPanel extends React.Component {
    render() {
        return <SearchResultsPanel
            sortOptions = {[
                 {"name": "runs", "value": "runs"}
             ]}
            filterOptions = {[]}
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
        />
    }
}

export class RunListPanel extends React.Component {
    render() {
        return <SearchResultsPanel
            sortOptions = {[
                {"name": "Downlaods", "value": "total_downloads"}
            ]}

            filterOptions = {
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
        />
    }
}