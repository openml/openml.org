import React from 'react';
import {render} from 'react-dom';
import {JsonRequest} from './ajax';
import {EntryDetails}  from './itemDetail.jsx'

class StatsScreen extends React.Component {
	render () {
		let stats = this.props.stats.map(
			item=><span className="stat" key={"stat_"+item.unit+"_"+item.value}>
			{item.icon?(<span className={"fa "+item.icon}/>):undefined}
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
			return <div className="contentSection" onClick = {this.props.onclick}>
				<div className="itemHead">
					<span className="fa fa-database"/>
				</div>
				<div className="itemName">
					{this.props.name + ''}
				</div>
				<div className="itemInfo">
					<div className="itemTeaser">
					{this.props.teaser+''}
					</div>
					<div className="itemStats itemStatsBig">
						<StatsScreen stats={this.props.stats}/>
					</div>
					<div className="itemStats itemStatsSmall">
					    <StatsScreen stats={this.props.stats2}/>
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

class SearchResultsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.results = [];
        this.state.error=null;
    }
    componentDidMount() {
        JsonRequest(
            "https://www.openml.org/es/openml/_search",
            {
                "from" : 0,
                "size" : 100,
                "query" : {
                    "bool" :
                        {
                            "must" :
                                {"match_all" : { }},
                            "filter":
                                {
                                    "term" :
                                        {
                                            "status" : "active"
                                        }
                                    },
                            "should":
                                [
                                    {
                                        "term" : {
                                            "visibility" : "public"
                                        }
                                    }
                                ],
                            "minimum_should_match":1}},
                "sort" : {
                    "runs" : {
                        "order": "desc"
                    }
                },
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
                                        {"value": x["_source"]["runs"], "unit": "runs", "icon": "fa-star"},
                                        {"value": x["_source"]["nr_of_likes"], "unit": "likes", "icon": "fa-heart"},
                                        {"value": x["_source"]["nr_of_downloads"], "unit": "downloads", "icon": "fa-cloud"},
                                        {"value": x["_source"]["reach"], "unit": "reach", "icon": "fa-rss"},
                                        {"value": x["_source"]["impact"], "unit": "impact", "icon": "fa-bolt"}
                                    ],
                                    "stats2": [
                                        {"value": x["_source"]["qualities"]["NumberOfInstances"]+"", "unit": "instances"},
                                        {"value": x["_source"]["qualities"]["NumberOfFeatures"]+"", "unit": "fields"},
                                        {"value": x["_source"]["qualities"]["NumberOfClasses"]+"", "unit": "classes"},
                                        {"value": x["_source"]["qualities"]["NumberOfMissingValues"]+"", "unit": "missing"}
                                    ],
                                    "data_id": x["_source"]["data_id"]
                                })
                            ))
                        };
                    }.bind(this)
                );
            }.bind(this),
            function(error) {
                this.state.error = "[HTTP #"+error.status+"]"+error.statusText+": "+error.responseText;
            },
            1000
        );
    }

    clickCallBack(id) {
        this.props.stateChangeCallback("detail", id);// stateChangeCallback({"mode": "detail", "entry": id});
    }

    componentWillUnmount() {
    }

    render() {
        if (this.state.results.length >= 1) {
            let results = this.state.results.map(
                result => <SearchElement name={result.name} teaser={result.teaser} stats={result.stats}
                                         stats2={result.stats2} data_id={result.data_id}
                                         onclick={() => this.clickCallBack(result.data_id)}
                />
            );
            return <div className="mainBar">{results}</div>
        }
        else if (this.state.error !== null){
            return <div className={"mainBar"}>Error: {this.state.error}</div>
        }
        else {
            return <div className={"mainBar"}>No search results found</div>
        }
	}
}

class MainPanel extends React.Component {
    constructor() {
        super();
        if (history.state === null) {

            this.state = {
                "mode": "list",
                "entry": undefined
            };
        }
        else {
            this.state = history.state;
        }
        document.title = this.state["mode"] + " - newOpenML";
        history.replaceState(this.state, "hello");
    }

    componentDidMount() {
        window.onpopstate = this.popStateEventHandler.bind(this);
    }

    popStateEventHandler(ev) {
        this.setState(ev.state);
        document.title = ev.state["mode"] + " - newOpenML";
    }

    setMode(mode, entry){
        let d = {"mode": mode, "entry": entry};
        history.pushState(d, mode);
        this.setState(d);
        document.title = mode + " - newOpenML";
    }

    render() {
        if (this.state.mode === "list") {
            return <SearchResultsPanel stateChangeCallback = {this.setMode.bind(this)}/>;
        }
        else {
            return <EntryDetails entry = {this.state.entry} stateChangeCallback = {this.setMode.bind(this)}/>;
        }
    }
}

class TopBar extends React.Component {
	render() {
		return <div className="topbar"><span id="sidebarHamburgerIcon" className="fa fa-bars"/>Top bar</div>
	}
}

class App extends React.Component {
    render () {
        return (<div><Sidebar/><TopBar/><MainPanel/></div>);
    }
}
render(<App/>, document.getElementById('app'));