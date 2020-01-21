import React from "react";
import {
  Button,
  InputLabel,
  TextField,
  FormControlLabel,
  FormControl,
  Collapse,
  Select,
  Tooltip
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { MainContext } from "../../App.js";

const FilterButton = styled(Button)`
  min-width: 0;
  width: 40px;
  height: 40px;
  font-size: 18px;
  color: ${props => props.textcolor};
`;
const FilterStats = styled.div`
  padding-left: 15px;
  padding-top: 15px;
  width: calc(100% - 120px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  float: left;
  color: ${props => props.textcolor};
`;
const FilterBox = styled.div`
  height: 50px;
  padding-top: 5px;
  padding-bottom: 5px;
`;
const FilterContainer = styled.div`
  background-color: #fff;
`;
const FilterFormControl = styled(FormControl)`
  margin-left: 10px;
  padding-bottom: 10px;
  background-color: #fff;
`;
const FilterTextField = styled(TextField)`
  padding-top: 16px;
`;
const WideFilterFormControl = styled(FormControl)`
  margin-left: 10px;
  padding-bottom: 10px;
  background-color: #fff;
  width: calc(100% - 10px);
`;
const FilterPanel = styled.div`
  background-color: #fff;
  padding-bottom: 100px;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;
const FilterControl = styled(FormControlLabel)`
  float: right;
  margin-right: 10px;
`;

const typeName = {
  data: "datasets",
  flow: "flows",
  run: "runs",
  study: "collections",
  task: "tasks",
  task_type: "task types",
  user: "users",
  measure: "measures"
};

class GenericFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterType: "any",
      render: () => null,
      filterValue1: null,
      filterValue2: null,
      filterAttributes: null
    };
  }

  onFilterTypeChange = event => {
    console.log("Changing filter type to ", event.target.value);
    this.setState({
      filterValue1: this.props.attrs.filterValue1,
      filterValue2: this.props.attrs.filterValue2,
      filterType: event.target.value,
      render: this.props.allFilterTypes.find(
        x => x.value === event.target.value
      ).render
    });
  };

  onFilterValue1Change = event => {
    this.setState({
      filterValue1: event.target.value
    });
  };

  onFilterValue2Change = event => {
    this.setState({
      filterValue2: event.target.value
    });
  };

  onFilterSubmit = event => {
    if (event.keyCode === 13) {
      //add to query
      let filter = {
        name: this.props.attribute.value,
        type: this.state.filterType,
        value: this.state.filterValue1,
        value2: this.state.filterValue2
      };
      this.props.filterChange([filter]);
      //set filter in context
    }
  };

  render() {
    let attrs = this.props.attrs;
    let inputProperties = {
      name: attrs.filterType.name,
      id: attrs.filterType.value
    };
    let elem = this.state.render(
      {
        onChange: this.onFilterValue1Change,
        onSubmit: this.onFilterSubmit,
        value: this.state.filterValue1
      },
      {
        onChange: this.onFilterValue2Change,
        onSubmit: this.onFilterSubmit,
        value: this.state.filterValue2
      }
    );

    return (
      <div>
        <FormControl>
          <InputLabel shrink htmlFor={this.props.attribute.name}>
            {this.props.attribute.name}
          </InputLabel>
          <Select
            native
            value={this.state.filterType}
            onChange={this.onFilterTypeChange}
            inputProps={inputProperties}
          >
            {this.props.allFilterTypes.map(item => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </Select>
        </FormControl>
        {elem}
      </div>
    );
  }
}

GenericFilter.defaultProps = {
  attrs: {
    filterType: { name: "any", value: "any", render: () => null },
    filterValue1: 0,
    filterValue2: 10000000
  }
};

class NumberFilter extends React.Component {
  toSingleInput = params1 => {
    return (
      <FilterTextField
        type={"number"}
        onChange={params1.onChange}
        onKeyDown={params1.onSubmit}
        value={params1.value}
      />
    );
  };

  toDoubleInput = (params1, params2) => {
    return [
      <FilterTextField
        type={"number"}
        onChange={params1.onChange}
        value={params1.value}
      />,
      " and ",
      <FilterTextField
        type={"number"}
        onChange={params2.onChange}
        value={params2.value}
      />
    ];
  };

  render() {
    return (
      <GenericFilter
        attribute={this.props.attribute} // name of filter
        filterChange={this.props.filterChange}
        allFilterTypes={[
          { name: "any", value: "any", render: () => null },
          { name: "greater than", value: "gte", render: this.toSingleInput },
          { name: "less than", value: "lte", render: this.toSingleInput },
          { name: "between", value: "between", render: this.toDoubleInput },
          { name: "equal to", value: "=", render: this.toSingleInput }
        ]}
      />
    );
  }
}

class TextFilter extends React.Component {
  toSingleInput(params1) {
    return <TextField onChange={params1.onChange} value={params1.value} />;
  }

  render() {
    return (
      <GenericFilter
        attribute={this.props.attribute}
        attrs={this.props.attrs}
        onChange={this.props.onChange}
        toFilterQuery={this.toFilterQuery.bind(this)}
        allFilterTypes={[
          { name: "any", value: "any", render: () => null },
          {
            name: "equal to",
            value: "=",
            render: this.toSingleInput.bind(this)
          },
          {
            name: "starting with",
            value: "starts",
            render: this.toSingleInput.bind(this)
          }
        ]}
      />
    );
  }

  toFilterQuery(attrs) {
    if (attrs.filterType.value === "=") {
      return {
        term: { [this.props.attribute.value]: attrs.filterValue1 }
      };
    } else if (attrs.filterType.value === "in") {
      return {
        prefix: { [this.props.attribute.value]: attrs.filterValue1 }
      };
    } else {
      return null;
    }
  }
}

export class FilterBar extends React.Component {
  static contextType = MainContext;

  constructor(props) {
    super(props);

    this.state = {
      showFilter: false,
      sortVisible: false
    };
  }

  sortChange = event => {
    console.log("Set sort to", event.target.value);
    this.props.sortChange({ sort: event.target.value });
  };

  orderChange = event => {
    console.log("Set order to", event.target.value);
    this.props.sortChange({ order: event.target.value });
  };

  filterChange = filters => {
    this.setState({ showFilter: false });
    this.props.filterChange(filters);
  };

  flipFilter = () => {
    this.setState(state => ({ showFilter: !state.showFilter }));
  };

  flipSorter = () => {
    this.setState(state => ({ sortVisible: !state.sortVisible }));
  };

  toggleSelect = () => {
    this.props.selectEntity(null);
  };

  render() {
    return (
      <React.Fragment>
        <FilterContainer>
          <FilterBox>
            <FilterStats textcolor={this.props.searchColor}>
              {this.context.counts +
                " " +
                typeName[this.props.resultType] +
                " found"}
            </FilterStats>
            <Tooltip title="Filter results" placement="top-start">
              <FilterControl
                style={{
                  marginRight: window.innerWidth < 600 ? 10 : 3,
                  display: this.context.displaySearch ? "block" : "none"
                }}
                control={
                  <FilterButton
                    onClick={this.flipFilter}
                    textcolor={this.props.searchColor}
                  >
                    <FontAwesomeIcon icon="filter" />
                  </FilterButton>
                }
              />
            </Tooltip>
            <Tooltip title="Sort results" placement="top-start">
              <FilterControl
                style={{
                  display: this.context.displaySearch ? "block" : "none"
                }}
                control={
                  <FilterButton
                    onClick={this.flipSorter}
                    textcolor={this.props.searchColor}
                  >
                    <FontAwesomeIcon icon="sort-amount-down" />
                  </FilterButton>
                }
              />
            </Tooltip>
            <Tooltip
              title={
                window.innerWidth < 600 ? "Statistics" : "Hide result list"
              }
              placement="top-start"
            >
              <FilterControl
                style={{
                  display: this.context.displaySearch ? "block" : "none"
                }}
                control={
                  <FilterButton
                    onClick={this.context.collapseSearch}
                    textcolor={this.props.searchColor}
                  >
                    <FontAwesomeIcon
                      icon={window.innerWidth < 600 ? "chart-pie" : "times"}
                    />
                  </FilterButton>
                }
              />
            </Tooltip>
            <Tooltip title="Show result list" placement="top-start">
              <FilterControl
                style={{
                  display: this.context.displaySearch ? "none" : "block"
                }}
                control={
                  <FilterButton
                    onClick={this.toggleSelect}
                    textcolor={this.props.searchColor}
                  >
                    <FontAwesomeIcon icon="chevron-left" />
                  </FilterButton>
                }
              />
            </Tooltip>
          </FilterBox>
          <Collapse in={this.state.sortVisible}>
            <FilterPanel>
              <FilterFormControl>
                <InputLabel shrink htmlFor="order">
                  Sort by
                </InputLabel>
                <Select
                  native
                  value={this.state.sort}
                  onChange={this.sortChange}
                  inputProps={{
                    name: "order",
                    id: "order"
                  }}
                >
                  {this.props.sortOptions.map(item => (
                    <option key={item.value} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </FilterFormControl>
              <FilterFormControl>
                <InputLabel shrink htmlFor="order-up">
                  Order
                </InputLabel>
                <Select
                  native
                  value={this.state.order}
                  onChange={this.orderChange}
                  inputProps={{
                    name: "order",
                    id: "order-up"
                  }}
                >
                  <option key="asc" value="asc">
                    Ascending
                  </option>
                  <option key="desc" value="desc">
                    Descending
                  </option>
                </Select>
              </FilterFormControl>
            </FilterPanel>
          </Collapse>
          <Collapse in={this.state.showFilter}>
            <FilterPanel>
              {this.props.filterOptions.map(option => {
                let Component = null;
                if (option.type === "numeric") {
                  Component = NumberFilter;
                } else if (option.type === "string") {
                  Component = TextFilter;
                } else {
                  return (
                    <p key={option.name}>
                      Filtering for {option.name} not supported
                    </p>
                  );
                }
                return (
                  <WideFilterFormControl key={option.name}>
                    <Component
                      attribute={option}
                      filterChange={this.filterChange}
                    />
                  </WideFilterFormControl>
                );
              })}
            </FilterPanel>
          </Collapse>
        </FilterContainer>
      </React.Fragment>
    );
  }
}
