import React from "react";
import {listItems} from "./api";
import {Link} from 'react-router-dom';
import {FilterBar} from "./FilterBar.jsx";
import {SearchContext} from './context.jsx';


class StatsScreen extends React.Component {
  //statsScreen for every user in the people lists gives warning for the same key in multiple objects

    render() {
        var Id=0;
        let stats = this.props.stats.map(
            item => <span className="stat" key={"stat_" + item.unit + "_" + item.value + Id++}>
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
                        Icon
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
SearchElement.contextType = SearchContext

export class SearchResultsPanel extends React.Component {

    render() {
      return <React.Fragment>Hello
      </React.Fragment>;

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

        ></SearchResultsPanel>
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
        ></SearchResultsPanel>
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
        ></SearchResultsPanel>
    }
}
