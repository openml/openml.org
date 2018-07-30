//REACT
import React from 'react';
import {render} from 'react-dom';

//REACT router
import {HashRouter, Route, Redirect, Switch, Link} from 'react-router-dom'

//self
import {EntryDetails}  from './itemDetail.jsx';
import {Sidebar} from './sidebar.jsx';
import {TopBar} from './topbar.jsx';
import {DataListPanel, TaskListPanel, FlowListPanel, RunListPanel, StudyListPanel, PeopleListPanel} from './dataList.jsx';


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
                <Route exact path={"/data"} component={DataListPanel}/>
                <Route exact path={"/data/:entry"} render={(info)=>(<EntryDetails entry={info.match.params.entry}/>)}/>
                <Route exact path={"/task"} component={TaskListPanel}/>
                <Route exact path={"/flow"} component={FlowListPanel}/>
                <Route exact path={"/run"} component={RunListPanel}/>
                <Route exact path={"/study"} component={StudyListPanel}/>
                <Route exact path={"/user"} component={PeopleListPanel}/>

                <Route render={(location)=>(<p>404 - {JSON.stringify(location)+""}</p>)}/>
            </Switch>
        </div>
    }
}

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            sideBarOpen: window.innerWidth >512 // Hide sidebar exactly when the CSS moves
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