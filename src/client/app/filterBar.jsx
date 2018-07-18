import React from 'react';
import {Dropdown} from "./ui/dropdown.jsx";

export class FilterBar extends React.Component {
    constructor() {
        super();

        this.state = {
            "sort": {"name": "Runs", "value": "runs"}
        }
    }

    sortChange(state) {
        this.setState(
            {
                "sort": state
            }
        );
        this.props.onChange(state);
    }

    render() {
        return (
            <div className="filterBar">
                Order by:
                <Dropdown selected={this.state.sort}
                          onChange={this.sortChange.bind(this)}
                options={
                    this.props.sortOptions}/>
            </div>
        )
    }
}