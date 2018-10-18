import React from "react";

import {Link} from "react-router-dom";

export class Sidebar extends React.Component {
    render() {
        return (
            <div className="sidebar">
                <ul className="sidenav">
                    <li><Link to="/data"><i className="fa fa-fw fa-lg fa-database"/> Data</Link></li>
                    <li><Link to="/task"><i className="fa fa-fw fa-lg fa-trophy"/> Task</Link></li>
                    <li><Link to="/flow"><i className="fa fa-fw fa-lg fa-cogs"/> Flow</Link></li>
                    <li><Link to="/run"><i className="fa fa-fw fa-lg fa-star"/> Run</Link></li>
                    <li><Link to="/study"><i className="fa fa-fw fa-lg fa-flask"/> Study</Link></li>
                    <li><Link to="/user"><i className="fa fa-fw fa-lg fa-users"/> People</Link></li>
                </ul>

            </div>
        )
    }
}
