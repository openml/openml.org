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
            <Link to={"/"+this.props.type+"/" + this.props.data_id} className={"noLink"}>
                <div className="contentSection item">
                    <div className="itemHead">
                        <span className="fa fa-database"/>
                    </div>
                    {
                        this.props.name !== undefined ?
                            <div className="itemName">
                                {this.props.name + ''}
                            </div> : null
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
                this.setState((state) => {
                    return {"results": data, "loading": false};
                });
            }
        ).catch(
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
        )
    }

    componentWillUnmount() {
    }

    sortChange(sortType, order, filter) {
        this.setState({"sort": sortType, "results": [], "loading": true, "order": order, "filter": filter},
            this.reload.bind(this));
    }

    render() {
        let component = null;

        if (this.state.loading) {
            component = <p>Loading...</p>;
        }
        else if (this.state.results.length >= 1) {
            component = this.state.results.map(
                result => <SearchElement name={result.name} teaser={result.teaser} stats={result.stats}
                                         stats2={result.stats2} data_id={result.data_id}
                                         onclick={() => this.clickCallBack(result.data_id)}
                                         key={result.name + "_" + result.data_id}
                                         type={this.props.type}
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

        />
    }
}

export class FlowListPanel extends React.Component {
    render() {
        return <SearchResultsPanel
            sortOptions={[
                {"name": "runs", "value": "runs"}
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
        />
    }
}

export class RunListPanel extends React.Component {
    render() {
        return <SearchResultsPanel
            sortOptions={[
                {"name": "Downlaods", "value": "total_downloads"}
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
        />
    }
}

export class StudyListPanel extends React.Component {
    render() {
        return <SearchResultsPanel
            sortOptions={[
                {"name": "Date", "value": "date"},
                {"name": "Datasets", "value": "datasets_included"}, // This does not work, since for some reason
                {"name": "tasks", "value": "tasks_included"},       // these three variables are not numbers, but
                {"name": "flows", "value": "flows_included"}        // are actually strings, which ES cannot
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
        />
    }
}

export class PeopleListPanel extends React.Component {
    render() {
        return <SearchResultsPanel
            sortOptions={[
                {"name": "Date", "value": "date"},
            ]}
            filterOptions={[]}
            type="user"
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
        />
    }
}
