import React from "react";

import {Link} from "react-router-dom";

export class Sidebar extends React.Component {
    render() {
        return (
            <div className="sidebar">
                <ul>
                    <li><i className="fa fa-database"/><Link to="/data"> Data</Link></li>
                    <li><i className="fa fa-trophy"/><Link to="/task">Task</Link></li>
                    <li><i className="fa fa-cogs"/><Link to="/flow">Flow</Link></li>
                    <li><i className="fa fa-star"/><Link to="/run">Run</Link></li>
                    <li><i className="fa fa-flask"/><Link to="/study">Study</Link></li>
                    <li><i className="fa fa-users"/><Link to="/user">People</Link></li>
                </ul>

            </div>
        )
    }
}