import React from "react";

import {Link} from "react-router-dom";
import {SearchContext} from './context.jsx';

export class Sidebar extends React.Component {
    render() {
        let search_context = this.context
        let links = search_context.types.map(function(t){
            return <li key={t}><Link to={"/"+t} className={search_context.colors[t]}><i className={search_context.icons[t] + " fa-fw fa-lg"}/> {search_context.names[t]}</Link></li>
          })

        return (
            <div className="sidebar">
                <ul className="sidenav">
                  {links}
                </ul>
            </div>
        )
    }
}
Sidebar.contextType = SearchContext
