import React from "react";

import {Link} from 'react-router-dom';

export class TopBar extends React.Component {
    render() {
        return (
            <div className="topbar">
                <span id="sidebarHamburgerIcon" className="fa fa-bars fa-lg topbar-icon" onClick={this.props.toggleSideBar}/>

                <Link to={"/"} className="noLink">OpenML</Link>
                <Link to="/login" className="button-white pull-right noLink">Sign in</Link>
                <a href="https://docs.openml.org" target="_blank" className="button-white pull-right noLink">Help</a>

            </div>)
    }
}
