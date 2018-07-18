import React from 'react';
import {Dropdown} from "./ui/dropdown.jsx";

export class FilterBar extends React.Component {
    constructor() {
        super();

        this.state = {
            "sort": {"name": "Runs", "value": "runs"},
            "order": "asc" //Options: arc, desc
        }
    }

    sortChange(state) {
        this.setState(
            {
                "sort": state
            }
        );
        this.props.onChange(state, this.state.order);
    }

    flipOrder() {
        let order = this.state.order;
        this.setState(
            (state)=>({"order": state.order==="asc"?"desc":"asc"})
        );
        this.props.onChange(this.state.sort, order==="asc"?"desc":"asc");
    }

    render() {
        return (
            <div className="filterBar">
                Order by:
                <Dropdown selected={this.state.sort}
                          onChange={this.sortChange.bind(this)}
                options={
                    this.props.sortOptions}/>

                <a className="button" onClick={this.flipOrder.bind(this)}>
                    {
                        this.state.order==="asc"?
                            (<React.Fragment><i className="fa fa-arrow-down"/> Ascending</React.Fragment>):
                        (<React.Fragment><i className="fa fa-arrow-up"/> Descending</React.Fragment>)
                    }
                </a>
            </div>
        )
    }
}