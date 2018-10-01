import React from "react";

import {Link} from 'react-router-dom';

export class TopBar extends React.Component {
    render() {
        return (
            <div className="topbar">
                <span id="sidebarHamburgerIcon" className="fa fa-bars fa-lg topbar-icon" onClick={this.props.toggleSideBar}/>

                <Link to={"/"} className={"noLink"}>
                    New OpenML
                </Link>
                <Link to="/login" className="btn btn-link">
                      <button className="float-right"> Sign in</button>
                   </Link>

            </div>)
    }
}
