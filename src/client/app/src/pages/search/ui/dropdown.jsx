import React from 'react';

export class Dropdown extends React.Component {
    constructor() {
        super();
        this.state = {
            "open": false,
            "hover": -1
        }
    }

    toggleOpen(event) {
        this.setState(
            (state) => (
                {
                    "open": !state["open"]
                }
            )
        );
    }

    render() {
        return (
            <div className={"dropdown-container"}>
                <div className={"dropdown-main"} onClick={this.toggleOpen.bind(this)}>
                    {this.props.selected.name}
                    <i className="fa fa-caret-down dropdown-main-icon"/>
                </div>
                {this.state.open ? (
                    <ul className={"dropdown-options"} onMouseLeave={()=>this.setState({"hover": -1})}>
                    {
                        this.props.options.map(
                            (x, index) => (
                                <li onClick={
                                        (event) => {
                                            this.props.onChange(x);
                                            this.toggleOpen(event);
                                            this.setState({ hover: -1 });
                                        }
                                } key={x.value}
                                    onMouseEnter={(event)=>(this.setState({"hover": index}))}
                                    className={"dropdown-item "+
                                        (x.value === this.props.selected.value?"dropdown-item-selected ":"") +
                                        (index === this.state.hover?"dropdown-item-hover ":"")
                                    }>
                                    {x.name}</li>
                            )
                        )
                    }
                </ul>) : null}
            </div>
        )
    }
}
