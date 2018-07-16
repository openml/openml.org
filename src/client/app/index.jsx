//REACT
import React from 'react';
import {render} from 'react-dom';

//REACT router
import {HashRouter, Route, Redirect, Switch, Link} from 'react-router-dom'

//self
import {listDatasets} from './api.js';
import {EntryDetails}  from './itemDetail.jsx';
import {Sidebar} from './sidebar.jsx';
import {TopBar} from './topbar.jsx';

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
		return <React.Fragment>{stats}</React.Fragment>
	}
}

class SearchElement extends React.Component {
		render() {
			return (
                <Link to={"/data/"+this.props.data_id} className={"noLink"}>
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



class SearchResultsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.results = [];
        this.state.error=null;
    }
    componentDidMount() {
        listDatasets(

        ).then(
            (data)=>this.setState({"results": data})
        ).catch(
            (error)=>this.setState({"error": ""+error})
        )
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
                                         key={result.name+"_"+result.data_id}
                />
            );
            return <React.Fragment>{results}</React.Fragment>
        }
        else if (this.state.error !== null){
            return <p>Error: {this.state.error}</p>
        }
        else {
            return <p>No search results found</p>
        }
	}
}

class MainPanel extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {

    }

    render() {
        return <div style={this.props.sideBarOpen?{"margin-left": "256px"}:{}} className="mainBar">
            <Switch>
                <Route exact path={"/"} render={()=>(<Redirect to={"/data"}/>)}/>
                <Route exact path={"/data"} component={SearchResultsPanel}/>
                <Route exact path={"/data/:entry"} render={(info)=>(<EntryDetails entry={info.match.params.entry}/>)}/>
                <Route render={(location)=>(<p>404 - {JSON.stringify(location)+""}</p>)}/>
            </Switch>
        </div>
    }
}

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            sideBarOpen: true
        }
    }

    toggleSideBar() {
        this.setState(
            (state)=>(
                {"sideBarOpen": !state.sideBarOpen}
            )
        )
    }

    render () {
        return (
        <div>
            {this.state.sideBarOpen?<Sidebar/>:null}
            <TopBar toggleSideBar = {this.toggleSideBar.bind(this)}/>
            <MainPanel sideBarOpen={this.state.sideBarOpen}/>
        </div>
        );
    }
}
render(<HashRouter><App/></HashRouter>, document.getElementById('app'));