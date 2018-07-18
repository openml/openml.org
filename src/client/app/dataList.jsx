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
                    <div className="itemName">
                        {this.props.name + ''}
                    </div>
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
        this.state.sort = {"name": "runs", "value": "runs"};

        this.sortOptions = [
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=match&amp;order=desc">Best match</a></li>
            {"name": "best match", "value": "match "},
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=runs&amp;order=desc">Most runs</a></li>
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=runs&amp;order=asc">Fewest runs</a></li>
            {"name": "Runs", "value": "runs"},
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=nr_of_likes&amp;order=desc">Most likes</a></li>
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=nr_of_likes&amp;order=asc">Fewest likes</a></li>
            {"name": "Likes", "value": "nr_of_likes"},
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=nr_of_downloads&amp;order=desc">Most downloads</a></li>
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=nr_of_downloads&amp;order=asc">Fewest downloads</a></li>
            {"name": "Downloads", "value": "nr_of_downloads"},
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=reach&amp;order=desc">Highest Reach</a></li>
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=reach&amp;order=asc">Lowest Reach</a></li>
            {"name": "Reach", "value": "reach"},
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=impact&amp;order=desc">Highest Impact</a></li>
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=impact&amp;order=asc">Lowest Impact</a></li>
            {"name": "Impact", "value": "impact"},
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=date&amp;order=desc">Most recent</a></li>
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=date&amp;order=asc">Least recent</a></li>
            {"name": "Date uploaded", "value": "date"},
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=last_update&amp;order=desc">Last update</a></li>
            {"name": "Date updated", "value": "last_update"},
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=qualities.NumberOfInstances&amp;order=desc">Most instances</a></li>
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=qualities.NumberOfInstances&amp;order=asc">Fewest instances</a></li>
            {"name": "Instances", "value": "qualities.NumberOfInstances"},
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=qualities.NumberOfFeatures&amp;order=desc">Most features</a></li>
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=qualities.NumberOfFeatures&amp;order=asc">Fewest features</a></li>
            {"name": "Features", "value": "qualities.NumberOfFeatures"},
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=qualities.NumberOfNumericFeatures&amp;order=desc">Most numeric features</a></li>
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=qualities.NumberOfNumericFeatures&amp;order=asc">Fewest numeric features</a></li>
            {"name": "Numeric Features", "value": "qualities.NumberOfNumericFeatures"},
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=qualities.NumberOfMissingValues&amp;order=desc">Most missing values</a></li>
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=qualities.NumberOfMissingValues&amp;order=asc">Fewest missing values</a></li>
            {"name": "Missing Values", "value": "qualities.NumberOfMissingValues"},
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=qualities.NumberOfClasses&amp;order=desc">Most classes</a></li>
            //<a role="menuitem" tabIndex="-1" href="/search?type=data&amp;sort=qualities.NumberOfClasses&amp;order=asc">Fewest classes</a></li>
            {"name": "Classes", "value": "qualities.NumberOfClasses"}
        ]
    }

    componentDidMount() {
        this.reload();
    }

    reload() {
        listDatasets(
            {"value": this.state.sort.value, "order": "desc"}
        ).then(
            (data) => this.setState({"results": data, "loading": false})
        ).catch(
            (error) => this.setState({"error": "" + error, "loading": false})
        )
    }

    componentWillUnmount() {
    }

    sortChange(sortType) {
        this.setState({"sort": sortType, "results": [], "loading": true}, this.reload.bind(this));
    }

    render() {
        let component = null;

        if (this.state.loading) {
            component= <p>Loading...</p>;
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
            <FilterBar sortOptions={this.sortOptions} onChange={this.sortChange.bind(this)}/>
            {component}
        </React.Fragment>;
    }
}