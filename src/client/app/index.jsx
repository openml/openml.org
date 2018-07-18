//REACT
import React from 'react';
import {render} from 'react-dom';

//REACT router
import {HashRouter, Route, Redirect, Switch, Link} from 'react-router-dom'

//self
import {EntryDetails}  from './itemDetail.jsx';
import {Sidebar} from './sidebar.jsx';
import {TopBar} from './topbar.jsx';
import {SearchResultsPanel} from './dataList.jsx';


class MainPanel extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {

    }

    render() {
        return <div className={"mainBar "+(this.props.sideBarOpen?"mainBar-sideBarOpen":"")}>
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
            sideBarOpen: window.screen.width >512 // Hide sidebar exactly when the CSS moves
                                                  // the main content behind the sidebar
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