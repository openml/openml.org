import React from "react";
import {
  Button,
  Card,
  FormControlLabel,
  FormControl,
  Collapse,
  Chip as MuiChip,
  Tooltip,
  TextField
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { MainContext } from "../../App.js";


const FilterButton = styled(Button)`
  min-width: 0;
  width: 45px;
  height: 45px;
  font-size: 20px;
  margin-top: 2px;
  color: ${props => props.textcolor};
`;
const FilterStats = styled.div`
  padding-left: 15px;
  padding-top: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11pt;
  float: left;
  color: ${props => props.textcolor};
`;
const FilterChip = styled(MuiChip)`
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const FilterBox = styled.div`
  height: 60px;
  padding-top: 5px;
  padding-bottom: 5px;
`;
const FilterContainer = styled(Card)`
  background-color: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  cursor: pointer;
  box-shadow: 0 0 14px 0 rgba(53, 64, 82, 0.15);
  z-index: 200;
  position: relative;
  border-radius: 0px;
`;
const FilterFormControl = styled(FormControl)`
  background-color: #fff;
  flex-wrap: wrap;
  display: block;
`;
const FilterPanel = styled.div`
  background-color: #fff;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;
const FilterControl = styled(FormControlLabel)`
  float: right;
  margin-right: 10px;
`;
const FilterIcon = styled(FontAwesomeIcon)`
  cursor: "pointer";
  padding-left: 5px;
`;

const typeName = {
  data: "dataset",
  flow: "flow",
  run: "run",
  study: "collection",
  benchmark: "benchmark",
  task: "task",
  task_type: "task type",
  user: "user",
  measure: "measure"
};

export class FilterBar extends React.Component {
  static contextType = MainContext;

  constructor(props) {
    super(props);

    this.state = {
      showFilter: false,
      sortVisible: false,
      activeFilter: false,
      splitToggleVisible: (window.innerWidth >= 600 ? true : false)
    };
  }

  sortChange = value => {
    console.log("Set sort to", value);
    this.props.sortChange({ sort: value });
  };

  orderChange = value => {
    console.log("Set order to", value);
    this.props.sortChange({ order: value });
  };

  activateFilter = value => {
    console.log(value);
    this.setState({ activeFilter: value });
  };

  filterChange = filters => {
    let filter = {
      name: this.props.filterOptions[this.state.activeFilter].value,
      type: filters.type,
      value: filters.value,
      value2: filters.value2
    };
    //this.setState({ showFilter: false });
    this.props.filterChange([filter]);
  };

  flipFilter = () => {
    this.setState(state => ({ showFilter: !state.showFilter }));
  };

  closeFilter = () => {
    this.setState(state => ({ showFilter: false }));
  };

  flipSorter = () => {
    this.setState(state => ({ sortVisible: !state.sortVisible }));
  };

  toggleSelect = () => {
    if (!this.context.displaySplit) {
      if (this.context.id) {
        this.props.selectEntity(null);
        this.context.setID(undefined);
      } else {
        this.context.toggleStats();
      }
    } else if (this.context.displayStats){
      this.context.toggleSplit();
    } else {
      this.context.toggleStats();
      this.context.toggleSplit();
    }
  };

  getExampleTags = () => {
    return [
      "OpenML-CC18",
      "OpenML-Reg19",
      "uci",
      "concept_drift",
      "artificial",
      "finance"
    ].join(", ");
  };

  isActiveOption = option => {
    let oname = this.props.filterOptions[this.state.activeFilter].value;
    if (oname in this.context.filters) {
      if (
        option.type === this.context.filters[oname].type &&
        option.value === this.context.filters[oname].value
      ) {
        return true;
      }
    }
    return false;
  };

  filterLabel = key => {
    if (this.context.filters[key]["value"] === "active"){
      return "verified";
    } else if (key.includes("s.")) {
      return key.split("s.")[0].replace("_"," ") + " " + this.context.filters[key]["value"];
    } else if (key.includes(".")) {
      return key.split(".")[0].replace("_"," ") + " " + this.context.filters[key]["value"];
    } else {
      return this.context.filters[key]["value"];
    }
  }

  render() {
    return (
      <React.Fragment>
        <FilterContainer>
          <FilterBox>
            <FilterStats textcolor={this.props.searchColor}>
              {this.context.updateType === "query" ? "Loading..." : this.context.counts +
                " " +
                typeName[this.context.type] + (this.context.counts !== 1 ? "s" : "") + 
                " found"}
            </FilterStats>
            {Object.keys(this.context.filters).map((key) => {
              return this.context.filters[key]["value"] !== "any" &&
                <FilterChip
                  label={this.filterLabel(key)}
                  key={key + this.context.filters[key]["value"]}
                  clickable
                  color="secondary"
                  variant="outlined"
                  onClick={this.flipFilter}
                  onDelete={() => {
                    this.props.clearFilters(key);
                    this.closeFilter();
                    this.setState({ activeFilter: false })
                  }}
                  deleteIcon={<FontAwesomeIcon size="lg" icon="times-circle" />}
                />
            })}
            <Tooltip title="Filter results" placement="bottom-start">
              <FilterControl
                style={{
                  marginRight: window.innerWidth < 600 ? 10 : 3,
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
            <Tooltip title="Sort results" placement="bottom-start">
              <FilterControl
                style={{
                  borderLeft: "1px solid rgba(0,0,0,0.12)",
                  paddingLeft: 10,
                  marginLeft: 0
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
            {this.state.splitToggleVisible &&
              <Tooltip
                title="Toggle split pane"
                placement="bottom-start"
              >
                <FilterControl
                  control={
                    <FilterButton
                      onClick={this.context.toggleSplit}
                      textcolor={this.props.searchColor}
                    >
                      <FontAwesomeIcon
                        icon={this.context.displaySplit ? ["far", "window-maximize"] : "columns"}
                      />
                    </FilterButton>
                  }
                />
              </Tooltip>
            }
            <Tooltip
              title={
                this.context.displaySplit ? (this.context.id  ? "Maximize view" : "Show overview") :
                (this.context.id ? "Back to list" : (this.context.displayStats ? "Show list" : "Show overview"))
              }
              placement="bottom-start"
            >
              <FilterControl
                control={
                  <FilterButton
                    onClick={this.toggleSelect}
                    textcolor={this.props.searchColor}
                  >
                    <FontAwesomeIcon
                      icon={this.context.displaySplit ? (this.context.id ? "expand-alt" : "poll") :
                        (this.context.id ? "chevron-left" : (this.context.displayStats ? "align-justify" : "poll"))}
                    />
                  </FilterButton>
                }
              />
            </Tooltip>
          </FilterBox>
          <Collapse in={this.state.sortVisible}>
            <FilterPanel>
              <FilterFormControl>
                <FilterStats textcolor={this.props.searchColor}>
                  Sort by
                </FilterStats>
                {this.props.sortOptions.map(item => (
                  <FilterChip
                    label={item.name}
                    key={item.name}
                    clickable
                    onClick={() => this.sortChange(item.value)}
                    color={
                      this.context.sort === item.value ? "primary" : "default"
                    }
                    variant={
                      this.context.sort === item.value ? "default" : "outlined"
                    }
                  />
                ))}
                <FilterChip
                  label={
                    this.context.order === "desc" ? "Descending" : "Ascending"
                  }
                  key="order"
                  clickable
                  onClick={() =>
                    this.orderChange(
                      this.context.order === "desc" ? "asc" : "desc"
                    )
                  }
                  variant="outlined"
                  color="secondary"
                  icon={
                    this.context.order === "desc" ? (
                      <FilterIcon icon="chevron-down" />
                    ) : (
                        <FilterIcon icon="chevron-up" />
                      )
                  }
                />
              </FilterFormControl>
            </FilterPanel>
          </Collapse>
          <Collapse in={this.state.showFilter}>
            <FilterPanel>
              <FilterFormControl key="filters">
                <FilterStats textcolor={this.props.searchColor}>
                  Filter by
                </FilterStats>
                {Object.entries(this.props.filterOptions).map(
                  ([key, option]) => (
                    <FilterChip
                      label={option.name}
                      key={key}
                      clickable
                      onClick={() => this.activateFilter(option.name)}
                      color={
                        option.name === this.state.activeFilter
                          ? "primary"
                          : "default"
                      }
                      variant={
                        option.name === this.state.activeFilter
                          ? "default"
                          : "outlined"
                      }
                      icon={<FilterIcon icon="chevron-down" />}
                    />
                  )
                )}
                <FilterChip
                  label={"Tag"}
                  key={"Tag"}
                  clickable
                  onClick={() => this.activateFilter("Tag")}
                  color={
                    this.state.activeFilter === "Tag" ? "primary" : "default"
                  }
                  variant={
                    this.state.activeFilter === "Tag" ? "default" : "outlined"
                  }
                  icon={<FilterIcon icon="chevron-down" />}
                />
              </FilterFormControl>
              <FilterFormControl key="options">
                {this.state.activeFilter &&
                  this.props.filterOptions[this.state.activeFilter] &&
                  this.props.filterOptions[this.state.activeFilter].options.map(
                    option => (
                      <FilterChip
                        label={option.name}
                        key={option.name}
                        clickable
                        onClick={() => this.filterChange(option)}
                        color={
                          this.isActiveOption(option) ? "primary" : "default"
                        }
                        variant={
                          this.isActiveOption(option) ? "default" : "outlined"
                        }
                      />
                    )
                  )}
              </FilterFormControl>
              <FilterFormControl key="tag">
                {this.state.activeFilter === "Tag" && (
                  <TextField
                    style={{ margin: 8, paddingRight: 16 }}
                    placeholder={"Type tag name. e.g. " + this.getExampleTags()}
                    defaultValue={this.context.filters['tags.tag'] ? this.context.filters['tags.tag']['value'] : undefined}
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    onKeyPress={event => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        this.props.tagChange(event.target.value);
                      }
                    }}
                  />
                )}
              </FilterFormControl>
            </FilterPanel>
          </Collapse>
        </FilterContainer>
      </React.Fragment>
    );
  }

  updateWindowDimensions = () => {
    if( window.innerWidth < 600) {
      this.setState({splitToggleVisible: false});
    } else {
      this.setState({splitToggleVisible: true});
    }
  };

  componentDidMount() {
    // Reflow when the user changes the window size
    window.addEventListener("resize", this.updateWindowDimensions);
  }

}
