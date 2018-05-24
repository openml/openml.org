import React from 'react';
import {render} from 'react-dom';
import {JsonRequest} from './ajax';

class StatsScreen extends React.Component {
	render () {
		let stats = this.props.stat.map(
			item=><span className="stat">
			{item.icon?(<img src={item.icon}/>):undefined}
			<span className="statValue">{item.value}</span>
			&nbsp;
			<span className="statUnit">{item.unit}</span>
			</span>
		);
		return <div>{stats}</div>
	}
}

class SearchElement extends React.Component {
		render() {
			return <div className="searchresult">
				<div className="itemHead">
					<img src="icons/database.svg"/>
				</div>
				<div className="itemName">
					{this.props.name + ''}
				</div>
				<div className="itemInfo">
					<div className="itemTeaser">
					{this.props.teaser+''}
					</div>
					<div className="itemStats itemStatsBig">
						<StatsScreen stat={this.props.stats}/>
					</div>
					<div className="itemStats itemStatsSmall">
					
					</div>
				</div>
			</div>
		}
}

class Sidebar extends React.Component {
	render() {
		return <div className="sidebar">sidebar</div>
	}
}

class MainPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.results = [
            {
                "name": "Test for an item with a name so ridiculously extreme that my layout could look ugly possibly",
                "teaser": "This teaser is supposed to be quite long, and thus to copy random jargon"+
                " from openML it probably uses some kind of cost matrix with 24 unique values and a p value below 0.2",
                "stats": [
                    {"value": "5,000,000", "unit": "runs", "icon": "icons/star.svg"},
                    {"value": "2,000", "unit": "likes", "icon": "icons/heart.svg"},
                    {"value": "14,000", "unit": "downloads", "icon": "icons/cloud.svg"}
                ]
            },
            {
                "name": "credit-g (1)",
                "teaser": "This dataset classifies people described by a set of attributes as good or bad compared to",
                "stats": [{"value": "5", "unit": "mm"}]
            },
            {
                "name": "monk-problems-2 (1)",
                "teaser": "Once upon a time, in July 1991, the monks of Corsendonk Priory were faced with",
                "stats": [{"value": "5", "unit": "mm"}]
            }];
    }
    componentDidMount() {
        this.timerID = JsonRequest(
            "https://www.openml.org/es/openml/_search",
            {
                "from" : 0,
                "size" : 100,
                "query" : { "bool" : { "must" : {"match_all" : { }}, "filter": { "term" : { "status" : "active" } }, "should": [{ "term" : { "visibility" : "public" } }], "minimum_should_match" : 1  }},"sort" : { "runs" : { "order": "desc"}},
                "aggs" : {
                    "type" : {
                        "terms" : { "field" : "_type" }
                    }
                }
            },
            function (ajax) {

                this.setState(
                    function(prevState, props) {
                        return {
                            results: prevState.results.concat(ajax["hits"]["hits"].map(
                                x => ({
                                    "name": x["_source"]["name"],
                                    "teaser": "I can not find the teaser text",
                                    "stats": [
                                        {"value": x["_source"]["runs"], "unit": "runs", "icon": "icons/star.svg"},
                                        {"value": x["_source"]["nr_of_likes"], "unit": "likes", "icon": "icons/heart.svg"},
                                        {"value": x["_source"]["nr_of_downloads"], "unit": "downloads", "icon": "icons/cloud.svg"},
                                        {"value": x["_source"]["reach"], "unit": "reach"},
                                        {"value": x["_source"]["impact"], "unit": "impact"}

                                    ]
                                })
                            ))
                        };
                    }.bind(this)
                );

                console.log(ajax);
            }.bind(this),
            function(error) {
                console.log("error", error);
            },
            1000
        )
    }

    componentWillUnmount() {
    }

    render() {
		console.log(this.state.results);
		let results = this.state.results.map(
				result => <SearchElement name={result.name} teaser={result.teaser} stats={result.stats}/>
			)
		return <div className="mainbar">{results}</div>
	}
}

class TopBar extends React.Component {
	render() {
		return <div className="topbar"><img id="sidebarHamburgerIcon" src="icons/hamburger.svg" className="hamburgerIcon"/>Top bar</div>
	}
}

class App extends React.Component {
    render () {
        return (<div><Sidebar/><TopBar/><MainPanel/></div>);
    }
}
render(<App/>, document.getElementById('app'));