import React from "react";
import styled from "styled-components";
import {listItems} from "./api";
import {Link} from 'react-router-dom';
import {FilterBar} from "./FilterBar.jsx";
import { Card, CardHeader, Tooltip, Chip } from '@material-ui/core';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { blue, yellow, orange, red, green, grey, purple} from "@material-ui/core/colors";

const GreenMenuIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: green[400],
});
const YellowMenuIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: yellow[700],
});
const LightBlueMenuIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: blue[300],
});
const BlueMenuIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: blue[800],
});
const RedMenuIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: red[400],
});
const PurpleMenuIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: purple[600],
});
const OrangeMenuIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: orange[400],
});
const GreyMenuIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: grey[400],
});
const ResultLink = styled(Link)`
    text-decoration: none;
    &:focus, &:hover, &:visited, &:link, &:active {
      text-decoration: none;
    }
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
  padding-top: 20px;
  overflow: none;
`;
const ResultCard = styled(Card)({
  borderRight: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: 0,
  padding: 10,
  paddingLeft: 15,
  paddingTop: 15,
  paddingBottom: 15,
});

class StatsScreen extends React.Component {
  //statsScreen for every user in the people lists gives warning for the same key in multiple objects
    render() {
        var Id=0;
        let stats = this.props.stats.map(
            item => <span className="stat" key={"stat_" + item.unit + "_" + item.value + Id++}>
			{item.icon ? (<span className={"fa " + item.icon}/>) : undefined}
                <span className="statValue">{item.value}</span>
                &nbsp;
                <span className="statUnit">{item.unit}</span>
			</span>
        );
        return <React.Fragment>{stats}</React.Fragment>
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
        console.log(this.props.status);

        return (
            <ResultLink to={"/"+this.props.type+"/" + this.props.data_id} className={"noLink"}>
              <ResultCard>
                  <Title>{this.props.name}</Title>
                  <SubTitle>{this.props.teaser}</SubTitle>
                  <Tooltip title="runs" placement="top-start">
                     <Stats><RedMenuIcon icon="atom" fixedWidth /> {abbreviateNumber(this.props.stats[0].value)}</Stats>
                  </Tooltip>
                  <Tooltip title="likes" placement="top-start">
                     <Stats><PurpleMenuIcon icon="heart" fixedWidth /> {abbreviateNumber(this.props.stats[1].value)}</Stats>
                  </Tooltip>
                  <Tooltip title="downloads" placement="top-start">
                     <Stats><LightBlueMenuIcon icon="cloud-download-alt" fixedWidth /> {abbreviateNumber(this.props.stats[2].value)}</Stats>
                  </Tooltip>
                  {!isNaN(this.props.stats2[0].value) &&
                  <Tooltip title="dimensions (rows x columns)" placement="top-start">
                     <Stats><GreyMenuIcon icon="table" fixedWidth /> {abbreviateNumber(this.props.stats2[0].value)} x {abbreviateNumber(this.props.stats2[1].value)}</Stats>
                  </Tooltip>
                  }
                  {this.props.data_status === 'active' &&
                  <Tooltip title="verified" placement="top-start">
                     <RightStats><GreenMenuIcon icon="check" fixedWidth /></RightStats>
                  </Tooltip>
                  }
                  {this.props.data_status === 'deactivated' &&
                  <Tooltip title="deactivated" placement="top-start">
                     <RightStats><RedMenuIcon icon="times" fixedWidth /></RightStats>
                  </Tooltip>
                  }
                  {this.props.data_status === 'in_preparation' &&
                  <Tooltip title="in_preparation" placement="top-start">
                     <RightStats><OrangeMenuIcon icon="wrench" fixedWidth /></RightStats>
                  </Tooltip>
                  }
                </ResultCard>
            </ResultLink>
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
        this.state.sort = this.props.sortOptions[0];
        this.state.order = "desc";
        this.state.filter =  [];
    }

    componentDidMount() {
        this.reload();
    }

    reload() {
                console.log(this.props.statusField);
                listItems(this.props.tag,
                    this.props.type,
                    {"value": this.state.sort.value, "order": this.state.order},
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
                            return {"results": data, "loading": false};
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

    render() {
        let component = null;

        if (this.state.loading) {
            component = <p>Loading...</p>;
        }
        else if (this.state.results.length >= 1) {
            component = this.state.results.map(
                result => <SearchElement name={result.name} teaser={result.teaser} stats={result.stats}
                                         stats2={result.stats2} data_id={result.data_id}
                                         onclick={() => this.clickCallBack(result.data_id)}
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
                      />
                      {component}
                    </SearchPanel>
                  </React.Fragment>;
      }else{ //nested query
        console.log(this.state.results.length);
            return <React.Fragment>
                    <SearchPanel>
                      {component}
                    </SearchPanel>
            </React.Fragment>;
      }
    }
}
