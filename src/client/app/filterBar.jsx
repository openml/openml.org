import React from 'react';
import {Dropdown} from "./ui/dropdown.jsx";

class GenericFilter extends React.Component {
    constructor(props) {
        super(props);


    }

    propogate(attrs) {
        this.props.onChange(
            this.props.attribute.value,
            attrs,
            this.props.toFilterQuery(attrs)
        )
    }

    onFilterTypeChange(filterType) {
        let attrs = {
            filterValue1: this.props.attrs.filterValue1,
            filterValue2: this.props.attrs.filterValue2,
            filterType: filterType,
        };
        this.propogate(attrs);
    }

    onFilterValue1Change(event) {
        this.propogate(
            {
                filterValue1: event.target.value,
                filterValue2: this.props.attrs.filterValue2,
                filterType: this.props.attrs.filterType
            }
        )
    }

    onFilterValue2Change(event) {
        this.propogate(
            {
                filterValue1: this.props.attrs.filterValue1,
                filterValue2: event.target.value,
                filterType: this.props.attrs.filterType
            }
        )
    }


    render() {
        let attrs = this.props.attrs;

        let elem = attrs.filterType["render"](
            {"onChange": this.onFilterValue1Change.bind(this),
                "value": attrs.filterValue1},
            {"onChange": this.onFilterValue2Change.bind(this),
                "value": attrs.filterValue2}
        );

        return (<div className={"filterElement"}>
                <strong>{this.props.attribute.name}</strong> is
                <Dropdown selected={attrs.filterType}
                          options={this.props.allFilterTypes}
                          onChange={this.onFilterTypeChange.bind(this)}/>
                {elem}
                {this.props.showAnd ? ", and " : null}
            </div>
        )
    }
}

GenericFilter.defaultProps = {
    attrs: {
        "filterType": {"name": "any", "value": "any", "render": ()=>null},
        "filterValue1": 0,
        "filterValue2": 10000000
    }
};

class NumberFilter extends React.Component {
    toSingleInput(params1){
        return (<input type={"number"} onChange={params1.onChange} value={params1.value}/>)
    }

    toDoubleInput(params1, params2){
        return [
            <input type={"number"} onChange={params1.onChange} value={params1.value}/>,
            " and ",
            <input type={"number"} onChange={params2.onChange} value={params2.value}/>
        ]
    }

    render() {
        return <GenericFilter
            attribute={this.props.attribute}
            attrs={this.props.attrs}
            showAnd={this.props.showAnd}
            onChange={this.props.onChange}
            toFilterQuery={this.toFilterQuery.bind(this)}
            allFilterTypes={[
                {name: "any", "value": "any", "render": ()=>null},
                {name: "greater than", "value": ">", "render": this.toSingleInput.bind(this)},
                {name: "less than", "value": "<", "render": this.toSingleInput.bind(this)},
                {name: "between", "value": "<>", "render": this.toDoubleInput.bind(this)},
                {name: "equal to", "value": "=", "render": this.toSingleInput.bind(this)},
            ]}
    />
    }

    toFilterQuery(attrs) {
        if (attrs.filterType.value === "=") {
            return {
                "term": {[this.props.attribute.value]: attrs.filterValue1}
            }
        }
        else if (attrs.filterType.value === ">") {
            return {
                "range": {
                    [this.props.attribute.value]: {
                        "gte": attrs.filterValue1
                    }
                }
            }
        }
        else if (attrs.filterType.value === "<") {
            return {
                "range": {
                    [this.props.attribute.value]: {
                        "lte": attrs.filterValue1
                    }
                }
            }
        }
        else if (attrs.filterType.value === "<>") {
            return {
                "range": {
                    [this.props.attribute.value]: {
                        "gte": attrs.filterValue1,
                        "lte": attrs.filterValue2
                    }
                }
            }
        }
        else {
            return null;
        }
    }
}

class TextFilter extends React.Component {
    toSingleInput(params1){
        return (<input onChange={params1.onChange} value={params1.value}/>)
    }

    render() {
        return <GenericFilter
            attribute={this.props.attribute}
            attrs={this.props.attrs}
            showAnd={this.props.showAnd}
            onChange={this.props.onChange}
            toFilterQuery={this.toFilterQuery.bind(this)}
            allFilterTypes={[
                {name: "any", "value": "any", "render": ()=>null},
                {name: "equal to", "value": "=", "render": this.toSingleInput.bind(this)},
                {name: "starting with", "value": "starts", "render": this.toSingleInput.bind(this)}
            ]}
        />
    }

    toFilterQuery(attrs) {
        if (attrs.filterType.value === "=") {
            return {
                "term": {[this.props.attribute.value]: attrs.filterValue1}
            }
        }
        else if (attrs.filterType.value === "in"){
            return {
                "prefix" : { [this.props.attribute.value] : attrs.filterValue1 }
            }
        }
        else {
            return null;
        }

    }
}


export class FilterBar extends React.Component {
    constructor() {
        super();

        this.state = {
            "sort": {"name": "Runs", "value": "runs"},
            "order": "desc", //Options: arc, desc
            "showFilter": false,
            "filters": {}
        }

    }

    propegate(sort, order, filters) {
        this.props.onChange(sort, order, Object.values(filters).map((item) => item.query).filter(item=>(!!item)));
    }

    onFilterChange(filterAttribute, params, query) {
        this.setState(
            (state) => {
                let filters = state.filters;
                filters[filterAttribute] = {"params": params, "query": query};
                if (filters[filterAttribute] === null) {
                    console.log("deleting filter "+filterAttribute);
                    delete filters[filterAttribute];
                }

                return {"filters": filters};
            }
        )
    }

    //Called when submitting new filters
    onSubmit() {

        this.setState({"showFilter": false});
        this.propegate(this.state.sort, this.state.order, this.state.filters);
    }

    sortChange(state) {
        this.setState(
            {
                "sort": state
            },
        );

        this.propegate(state, this.state.order, this.state.filters);
    }

    flipOrder() {
        let order = this.state.order;
        console.log(order);
        this.setState(
            (state) => ({"order": state.order === "asc" ? "desc" : "asc"})
        );
        this.propegate(this.state.sort, order === "asc" ? "desc" : "asc", this.state.filters);
    }

    flipFilter() {
        this.setState((state) => ({"showFilter": !state.showFilter}));
    }

    render() {
        return (
            <React.Fragment>
            <div className="filterBar">
                Order by:
                <Dropdown selected={this.state.sort}
                          onChange={this.sortChange.bind(this)}
                          options={
                              this.props.sortOptions}/>

                <a className="button-gray" onClick={this.flipOrder.bind(this)}>
                    {
                        this.state.order === "asc" ?
                            (<React.Fragment><i className="fa fa-arrow-down"/> Ascending</React.Fragment>) :
                            (<React.Fragment><i className="fa fa-arrow-up"/> Descending</React.Fragment>)
                    }
                </a>
                <a className={this.state.showFilter?"button":"button-gray"} onClick={this.flipFilter.bind(this)}>
                    <i className="fa fa-filter"/> Filter
                </a>
            </div>

                {
                    !this.state.showFilter ? null : (
                        <div className="contentSection">
                            <p> Find all datasets where </p>
                            {
                                this.props.filterOptions.map(
                                    (option, index) => {
                                        let props = undefined;
                                        if (this.state.filters.hasOwnProperty(option.value)) {
                                            props = this.state.filters[option.value]["params"];
                                        }
                                        let Component=null;
                                        if (option.type === "numeric") {
                                            Component=NumberFilter;
                                        }
                                        else if (option.type === "string"){
                                            Component=TextFilter;
                                        }
                                        else {
                                            return <p key={option.value}>Filtering for {option.type} not supported</p>
                                        }


                                        return <Component
                                            key={option.value}
                                            attribute={option}
                                            attrs={props}
                                            showAnd={index !== this.props.filterOptions.length - 1}
                                            onChange={this.onFilterChange.bind(this)}

                                        />
                                    }
                                )
                            }
                            <div><a
                                className="button"
                                onClick={this.onSubmit.bind(this)}
                            ><i className={"fa fa-search"}/> submit</a></div>
                        </div>
                    )
                }
            </React.Fragment>
        )
    }
}