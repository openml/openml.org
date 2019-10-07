import React from "react";
import styled from "styled-components";
import {listItems} from "./api";
import {FilterBar} from "./FilterBar.js";
import { Card, Tooltip } from '@material-ui/core';
import PerfectScrollbar from "react-perfect-scrollbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { blue, orange, red, green, grey, purple} from "@material-ui/core/colors";

const ColoredIcon = styled(FontAwesomeIcon)`
    cursor: 'pointer',
    color: ${props => props.color },
`;
const Stats = styled.div`
  padding-right: 8px;
  display: inline-block;
  font-size: 12px;
`;
const RightStats = styled.div`
  float: right;
`;
const Title = styled.div`
  padding-bottom: 5px;
  font-size: 16px;
`;
const SubTitle = styled.div`
  padding-bottom: 5px;
  color:#666;
  font-size: 12px;
  line-height: 1.5em;
  height: 3em;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const SearchPanel = styled.div`
  overflow: none;
`;
const ResultCard = styled(Card)({
  borderRight: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: 0,
  padding: 10,
  paddingLeft: 15,
  paddingTop: 15,
  paddingBottom: 15,
  cursor: 'pointer',
});
const Scrollbar = styled(PerfectScrollbar)`
  overflow-x: hidden;
  position: relative;
  height: calc(100vh - 115px);

  .ps {
    overflow: hidden;
    touch-action: auto;
  }

  .ps__rail-x, .ps__rail-y {
    display: none;
    opacity: 0;
    transition: background-color .2s linear, opacity .2s linear;
    height: 15px;
    bottom: 0px;
    position: absolute;
  }
`;
const dataStatus = {
  active: {
    title: "verified",
    icon: "check",
    color: green[500]
  },
  deactivated: {
    title: "deactivated",
    icon: "times",
    color: red[500]
  },
  in_preparation: {
    title: "unverified",
    icon: "wrench",
    color: orange[500]
  }
}

class SearchElement extends React.Component {

    render() {
        const abbreviateNumber = (value) => {
          let newValue = value;
          if (value > 1000){
            const suffixes = ["", "k", "M", "B","T"];
            let suffixNum = 0;
            while (newValue >= 1000) {
              newValue /= 1000;
              suffixNum++;
            }
            newValue = newValue.toPrecision(3);
            newValue += suffixes[suffixNum];
          }
          return newValue;
        }

        return (
              <ResultCard onClick={this.props.onclick}>
                  <Title>{this.props.name}</Title>
                  <SubTitle>{this.props.teaser}</SubTitle>
                  {this.props.stats !== undefined &&
                  <React.Fragment>
                    <Tooltip title="runs" placement="top-start">
                       <Stats><ColoredIcon color={red[500]} icon="atom" fixedWidth /> {abbreviateNumber(this.props.stats[0].value)}</Stats>
                    </Tooltip>
                    <Tooltip title="likes" placement="top-start">
                       <Stats><ColoredIcon color={purple[500]} icon="heart" fixedWidth /> {abbreviateNumber(this.props.stats[1].value)}</Stats>
                    </Tooltip>
                    <Tooltip title="downloads" placement="top-start">
                       <Stats><ColoredIcon color={blue[700]} icon="cloud-download-alt" fixedWidth /> {abbreviateNumber(this.props.stats[2].value)}</Stats>
                    </Tooltip>
                  </React.Fragment>
                  }
                  {!isNaN(this.props.stats2[0]) &&
                  <Tooltip title="dimensions (rows x columns)" placement="top-start">
                     <Stats><ColoredIcon color={grey[400]} icon="table" fixedWidth /> {abbreviateNumber(this.props.stats2[0].value)} x {abbreviateNumber(this.props.stats2[1].value)}</Stats>
                  </Tooltip>
                  }
                  {dataStatus[this.props.data_status] !== undefined &&
                  <Tooltip title={dataStatus[this.props.data_status]["title"]} placement="top-start">
                     <RightStats>
                     <ColoredIcon
                          color={dataStatus[this.props.data_status]["color"]}
                          icon={dataStatus[this.props.data_status]["icon"]}
                          fixedWidth
                      /></RightStats>
                  </Tooltip>
                  }
                </ResultCard>
        )
    }
}

export class SearchResultsPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.state.results = [];
        this.state.error = null;
        this.state.loading = true;
        this.state.sort = this.props.sortOptions[0].value;
        this.state.order = "desc";
        this.state.filter =  [];
    }

    componentDidMount() {
        this.reload();
    }

    reload() {
                listItems(this.props.tag,
                    this.props.type,
                    {"value": this.state.sort, "order": this.state.order},
                    this.state.filter,
                    this.props.nameField,
                    this.props.descriptionField,
                    this.props.processDescription,
                    this.props.idField,
                    this.props.stats,
                    this.props.stats2,
                    this.props.statusField
                ).then(
                    (data) => {
                        this.setState((state) => {
                            return {"results": data.results, "total": data.total, "loading": false};
                        });
                    }
                ).catch(
                    (error) => {
                        console.error(error);
                        try {
                            this.setState({
                                "error": "" + error + (
                                    error.hasOwnProperty("fileName") ? " (" + error.fileName + ":" + error.lineNumber + ")" : ""
                                ),
                                "loading": false
                            });
                        }
                        catch (ex) {
                            console.error("There was an error displaying the above error");
                            console.error(ex);
                        }
                    }
                )
        }
    componentWillUnmount() {
    }

    sortChange(sortType, order, filter) {
        this.setState({"sort": sortType, "results": [], "loading": true, "order": order, "filter": filter},
            this.reload.bind(this));
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    selectDataset = (e, id) => {
      e.preventDefault();
      console.log(id);
    }

    render() {
        let component = null;

        if (this.state.loading) {
            component = <p>Loading...</p>;
        }
        else if (this.state.results.length >= 1) {
            component = this.state.results.map(
                result => <SearchElement name={result.name} teaser={result.teaser} stats={result.stats}
                                         stats2={result.stats2} data_id={result.data_id}
                                         onclick={() => this.props.selectEntity(result.data_id)}
                                         key={result.name + "_" + result.data_id}
                                         type={this.props.type} data_status={result.data_status}
                ></SearchElement>
            );
        }
        else if (this.state.error !== null) {
            component = <p>Error: {this.state.error}</p>;
        }
        else {
            component = <p>No search results found</p>;
        }

        if(this.props.tag === undefined){
                  return <React.Fragment>
                    <SearchPanel>
                      <FilterBar
                          sortOptions={this.props.sortOptions}
                          onChange={this.sortChange.bind(this)}
                          filterOptions={this.props.filterOptions}
                          searchColor={this.props.searchColor}
                          resultSize={this.state.total}
                          resultType={this.props.type}
                      />
                      <Scrollbar>
                        {component}
                      </Scrollbar>
                    </SearchPanel>
                  </React.Fragment>;
      } else { //nested query
            return <React.Fragment>
                    <SearchPanel>
                      {component}
                    </SearchPanel>
            </React.Fragment>;
      }
    }
}
