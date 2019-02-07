//REACT
import React from 'react';
import {render} from 'react-dom';

//REACT router
import {HashRouter, Route, Redirect, Switch, Link} from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom';
//self
import {EntryDetails}  from './itemDetail.jsx';
import {Sidebar} from './sidebar.jsx';
import {TopBar} from './topbar.jsx';
import {DataListPanel, TaskListPanel, FlowListPanel, RunListPanel, StudyListPanel, PeopleListPanel} from './search.jsx';
import {LoginPanel} from './login.jsx';
import {RegisterPanel} from './register.jsx';
import {UserProfilePanel}  from './userProfile.jsx';
import {AuthProvider,SearchContext,searches} from './context.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Header from './header.jsx';

class MainPanel extends React.Component {

    constructor() {
        super();
    }

    componentDidMount() {

    }

    render() {
        return <div className={"mainBar "+(this.props.sideBarOpen?"mainBar-sideBarOpen":"")}>
        <AuthProvider>
          <Switch>
               <Route exact path={"/"} render={()=>(<Redirect to={"/data"}/>)}/>
                      <Route exact path={"/login"} component={LoginPanel}/>
                       <Route exact path={"/register"} component={RegisterPanel}/>
                       <ProtectedRoute exact path={"/userprofile"} component={UserProfilePanel}/>
                       <Route exact path={"/data"} component={DataListPanel}/>
                       <Route exact path={"/data/:entry"} render={(info)=>(<EntryDetails entry={info.match.params.entry}  type="data"/>)}/>
                       <Route exact path={"/task"} component={TaskListPanel}/>
                       <Route exact path={"/task/:entry"} render={(info)=>(<EntryDetails entry={info.match.params.entry}  type="task"/>)}/>
                       <Route exact path={"/flow"} component={FlowListPanel}/>
                       <Route exact path={"/flow/:entry"} render={(info)=>(<EntryDetails entry={info.match.params.entry}  type="flow"/>)}/>
                       <Route exact path={"/run"} component={RunListPanel}/>
                       <Route exact path={"/run/:entry"} render={(info)=>(<EntryDetails entry={info.match.params.entry}  type="run"/>)}/>
                       <Route exact path={"/study"} component={StudyListPanel}/>
                       <Route exact path={"/study/:entry"} render={(info)=>(<EntryDetails entry={info.match.params.entry}  type="study"/>)}/>
                       <Route exact path={"/user"} component={PeopleListPanel}/>
                       <Route exact path={"/user/:entry"} render={(info)=>(<EntryDetails entry={info.match.params.entry}  type="user"/>)}/>

              <Route render={(location)=>(<p>404 - {JSON.stringify(location)+""}</p>)}/>
          </Switch>
        </AuthProvider>

        </div>
    }
}

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            search: searches,
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
