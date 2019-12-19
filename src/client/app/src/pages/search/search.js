import React from "react";
import styled from "styled-components";
import { FilterBar } from "./FilterBar.js";
import { Card, Tooltip, Paper, CardHeader, Avatar } from "@material-ui/core";
import PerfectScrollbar from "react-perfect-scrollbar";
import TimeAgo from "react-timeago";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  blue,
  orange,
  red,
  green,
  grey,
  purple
} from "@material-ui/core/colors";
import { MainContext } from "../../App.js";

const ColoredIcon = styled(FontAwesomeIcon)`
  cursor: 'pointer',
  color: ${props => props.color},
`;
const Stats = styled.div`
  padding-right: 8px;
  display: inline-block;
  font-size: 12px;
`;
const Metric = styled.div`
  color: ${red[500]}
  padding-left: 5px;
  display: inline-block;
`;
const SubStats = styled.div`
  width: 100%;
  font-size: 12px;
  color: ${props => props.color};
`;
const RightStats = styled.div`
  float: right;
`;
const LeftStats = styled.div`
  float: left;
  padding-right: 8px;
`;
const Title = styled.div`
  padding-bottom: 5px;
  font-size: 16px;
  font-color: #232f3e;
  font-weight: 600;
`;
const SubTitle = styled.div`
  margin-bottom: 10px;
  color: #666;
  font-size: 12px;
  line-height: 1.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 36px;
  max-width: 475px;
`;
const SearchPanel = styled(Paper)`
  overflow: none;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 0px;
  z-index: 100;
  position: relative;
`;
const Scrollbar = styled(PerfectScrollbar)`
  overflow-x: hidden;
  position: relative;
  height: calc(100vh - 115px);

  .ps {
    overflow: hidden;
    touch-action: auto;
  }

  .ps__rail-x,
  .ps__rail-y {
    display: none;
    opacity: 0;
    transition: background-color 0.2s linear, opacity 0.2s linear;
    height: 15px;
    bottom: 0px;
    position: absolute;
  }
`;
const SlimCardHeader = styled(CardHeader)({
  paddingTop: 0
});
const ResultCard = styled(Card)({
  borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  paddingLeft: 20,
  paddingRight: 20,
  paddingTop: 15,
  paddingBottom: 20,
  cursor: "pointer",
  maxWidth: 600
});
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
};

class SearchElement extends React.Component {
  randomColor = () => {
    let colors = [blue, orange, red, green, purple];
    return colors[Math.floor(Math.random() * colors.length)][
      Math.floor(Math.random() * 7 + 3) * 100
    ];
  };

  shouldComponentUpdate(nextProps, nextState) {
    // Cards are static. No need to rerender.
    return false;
  }

  render() {
    const abbreviateNumber = value => {
      let newValue = value;
      if (value > 1000) {
        const suffixes = ["", "k", "M", "B", "T"];
        let suffixNum = 0;
        while (newValue >= 1000) {
          newValue /= 1000;
          suffixNum++;
        }
        newValue = newValue.toPrecision(3);
        newValue += suffixes[suffixNum];
      }
      return newValue;
    };
    const scores = [];
    if (this.props.stats2 !== undefined && this.props.type === "run") {
      if (this.props.stats2[0].value) {
        scores.push(
          <Tooltip title="Accuracy" placement="top-start" key="ACC">
            <Stats>
              <Metric>ACC</Metric> {this.props.stats2[0].value}
            </Stats>
          </Tooltip>
        );
      }
      if (this.props.stats2[1].value) {
        scores.push(
          <Tooltip title="Area under ROC curve" placement="top-start" key="ROC">
            <Stats>
              <Metric>AUC</Metric> {this.props.stats2[1].value}
            </Stats>
          </Tooltip>
        );
      }
      if (this.props.stats2[2].value) {
        scores.push(
          <Tooltip
            title="Root Mean Squared Error"
            placement="top-start"
            key="RMSE"
          >
            <Stats>
              <Metric>RMSE</Metric> {this.props.stats2[2].value}
            </Stats>
          </Tooltip>
        );
      }
    }

    return (
      <ResultCard onClick={this.props.onclick} square>
        {this.props.type === "user" && (
          <SlimCardHeader
            avatar={
              <Avatar
                src={this.props.image}
                style={{
                  height: 50,
                  width: 50,
                  backgroundColor: this.randomColor()
                }}
              >
                {this.props.initials}
              </Avatar>
            }
            title={this.props.name}
          />
        )}
        {this.props.type !== "user" && <Title>{this.props.name}</Title>}
        <SubTitle>{this.props.teaser}</SubTitle>
        {this.props.stats !== undefined && (
          <React.Fragment>
            {this.props.stats.map((stat, index) => (
              <Tooltip
                key={index}
                title={stat.unit}
                placement="top-start"
                style={{
                  display: !stat.value //&& this.props.type === "user"
                    ? "none"
                    : "inline-block"
                }}
              >
                <Stats>
                  <ColoredIcon color={stat.color} icon={stat.icon} fixedWidth />
                  {" " + abbreviateNumber(stat.value)}
                </Stats>
              </Tooltip>
            ))}
          </React.Fragment>
        )}
        {this.props.stats2 !== undefined && this.props.type === "data" && (
          <Tooltip title="dimensions (rows x columns)" placement="top-start">
            <Stats>
              <ColoredIcon color={grey[400]} icon="table" fixedWidth />{" "}
              {abbreviateNumber(this.props.stats2[0].value)} x{" "}
              {abbreviateNumber(this.props.stats2[1].value)}
            </Stats>
          </Tooltip>
        )}
        {this.props.stats2 !== undefined && this.props.type === "run" && scores}

        <SubStats color={grey[400]}>
          <LeftStats>
            <ColoredIcon icon="history" fixedWidth />
            <TimeAgo date={new Date(this.props.date)} minPeriod={60} />
          </LeftStats>
          {this.props.version !== undefined && (
            <LeftStats>v.{this.props.version}</LeftStats>
          )}
          {dataStatus[this.props.data_status] !== undefined && (
            <Tooltip
              title={dataStatus[this.props.data_status]["title"]}
              placement="top-start"
            >
              <RightStats>
                <ColoredIcon
                  color={dataStatus[this.props.data_status]["color"]}
                  icon={dataStatus[this.props.data_status]["icon"]}
                  fixedWidth
                />
              </RightStats>
            </Tooltip>
          )}
        </SubStats>
      </ResultCard>
    );
  }
}

export class SearchResultsPanel extends React.Component {
  static contextType = MainContext;

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getTeaser = description => {
    if (description === undefined || description === null) {
      return undefined;
    }
    let lines = description.split("\n").map(i => i.trim());
    for (let i = 0; i < lines.length; i++) {
      if (
        !lines[i].startsWith("*") &&
        !lines[i].startsWith("#") &&
        lines[i].length > 0
      ) {
        return lines[i];
      }
    }
    return lines[0];
  };

  getStats = (stats, result) => {
    if (stats === undefined) {
      return undefined;
    } else {
      return stats.map(stat => ({
        value: result[stat.param],
        unit: stat.unit,
        color: stat.color,
        icon: stat.icon
      }));
    }
  };

  render() {
    let component = null;
    if (
      this.context.results.length >= 1 &&
      this.context.results[0][
        (this.context.type === "task_type" ? "tt" : this.context.type) + "_id"
      ] !== undefined
    ) {
      let key =
        (this.context.type === "task_type" ? "tt" : this.context.type) + "_id";

      component = this.context.results.map(result => (
        <SearchElement
          name={result.name ? result.name : result.comp_name}
          version={result.version}
          teaser={this.getTeaser(result.description)}
          stats={this.getStats(this.props.stats, result)}
          stats2={this.getStats(this.props.stats2, result)}
          id={result[this.context.type + "_id"]}
          onclick={() =>
            this.props.selectEntity(
              result[
                (this.context.type === "task_type" ? "tt" : this.context.type) +
                  "_id"
              ] + ""
            )
          }
          key={result[key]}
          type={this.props.type}
          image={result.image}
          initials={result.initials}
          data_status={result.status}
          date={result.date}
        ></SearchElement>
      ));
    } else if (this.context.error !== null) {
      component = (
        <p style={{ paddingLeft: 10 }}>Error: {this.context.error}</p>
      );
    } else if (this.context.updateType === "query") {
      component = <p style={{ paddingLeft: 10 }}>Loading...</p>;
    } else {
      component = <p style={{ paddingLeft: 10 }}>No search results found</p>;
    }

    if (this.props.tag === undefined) {
      return (
        <React.Fragment>
          <SearchPanel>
            <FilterBar
              sortOptions={this.props.sortOptions}
              filterOptions={this.props.filterOptions}
              searchColor={this.props.searchColor}
              resultSize={this.context.counts}
              resultType={this.props.type}
              sortChange={this.props.sortChange}
              filterChange={this.props.filterChange}
              selectEntity={this.props.selectEntity}
            />
            <Scrollbar
              style={{
                display: this.context.displaySearch ? "block" : "none"
              }}
            >
              {component}
            </Scrollbar>
          </SearchPanel>
        </React.Fragment>
      );
    } else {
      //nested query
      return (
        <React.Fragment>
          <SearchPanel>{component}</SearchPanel>
        </React.Fragment>
      );
    }
  }
}
