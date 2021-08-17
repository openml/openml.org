import React from "react";
import styled from "styled-components";
import { Card, Tooltip, Paper, CardHeader, Avatar, Grid, Typography } from "@material-ui/core";
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

const ColoredIcon = styled(FontAwesomeIcon)`
  cursor: 'pointer',
  color: ${props => props.color},
`;
const Stats = styled.div`
  padding-right: 8px;
  display: inline-block;
  font-size: 12px;
`;
const ColorStats = styled.div`
  padding-right: 8px;
  display: inline-block;
  font-size: 12px;
  color: ${props => props.color};
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
const VersionStats = styled.div`
  float: right;
  color: #666;
  font-size: 12px;
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
`;
const SearchListPanel = styled(Paper)`
  overflow: none;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 0px;
  z-index: 100;
  position: relative;
  background-color: transparent;
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
const ResultCard = styled(Card)`
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  background-color: ${props => props.color};
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 15px;
  padding-bottom: 20px;
  cursor: pointer;
  max-width: 1600px;
  box-shadow: none;
  ${props => props.fullwidth && `width: 100%`}
`
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
    if (this.props.selected || nextProps.selected){
      return true;
    } else {
      return false;
    }
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
      <ResultCard 
        onClick={this.props.onclick} 
        color={this.props.selected ? "#f1f3f4" : "#fff"}
        fullwidth={this.props.fullwidth.toString()}
        square>
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
        {this.props.type !== "user" && 
          <Title>
            <ColoredIcon color={this.props.color} icon={this.props.icon} fixedWidth/>
            {"\u00A0\u00A0"}{this.props.name}
          </Title>
        }
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
        <Tooltip title={this.props.type + " ID"} placement="top-start">
          <Stats>
            <ColoredIcon color={grey[400]} icon="id-badge" fixedWidth />{" "}
            {this.props.id}
          </Stats>
        </Tooltip>
        {this.props.stats2 !== undefined && this.props.type === "run" && scores}
        <ColorStats color={grey[400]}>
            <ColoredIcon icon="history" fixedWidth />
            <TimeAgo date={new Date(this.props.date)} minPeriod={60} />
        </ColorStats>

        <SubStats color={grey[400]}>
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
          {this.props.version !== undefined && (
            <VersionStats>v.{this.props.version}</VersionStats>
          )}
        </SubStats>
      </ResultCard>
    );
  }
}

export class SearchResultsPanel extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    // Only render if there are new results or when the display size changes
    if (nextProps.context.results.length >= 1 && nextProps.context.updateType !== undefined){
      return true;
    } else if (this.props.context.displaySplit !== nextProps.context.displaySplit){
      return true;
    }
    return false;
  }

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

  getTypeName = (type) => {
    switch (type) {
      case "data":
        return "dataset";
      case "study":
        return "collection";
      default:
        return type;
    }
  }

  render() {
    let component = null;
    let results = this.props.context.results;
    let qtype = this.props.context.type;
    if (this.props.listType === "drilldown"){
      results = this.props.context.subResults;
      qtype = this.props.context.subType;
    } else {
    }
    if (
      results.length >= 1 &&
      results[0][
      (qtype === "task_type" ? "tt" : qtype) + "_id"
      ] !== undefined
    ) {
      let key =
        (qtype === "task_type" ? "tt" : qtype) + "_id";

      component = results.map(result => (
        <SearchElement
          name={result.name ? result.name : result.comp_name}
          version={result.version}
          teaser={this.getTeaser(result.description)}
          stats={this.getStats(this.props.stats, result)}
          stats2={this.getStats(this.props.stats2, result)}
          id={result[qtype + "_id"]}
          selected={result[qtype + "_id"] + "" === this.props.context.id}
          onclick={() => 
            this.props.selectEntity(
              result[
              (qtype === "task_type" ? "tt" : qtype) +
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
          fullwidth={this.props.context.displaySplit}
          color={this.props.context.getColor(qtype)}
          icon={this.props.context.getIcon(qtype)}
        ></SearchElement>
      ));
    } else if (this.props.context.error !== null) {
      component = (
        <p style={{ paddingLeft: 10 }}>Error: {this.props.context.error}</p>
      );
    } else if (!this.props.context.updateType === "query") {
      component = <Card style={{ paddingLeft: 10 }}>No search results found</Card>;
    }

    if (this.props.tag === undefined) {
      return (
        <React.Fragment>
          <SearchListPanel>
              <Scrollbar
                style={{
                  display: this.props.context.displaySearch ? "block" : "none"
                }}
              >
                <Grid container direction="column" justifyContent="center" alignItems="center" style={{paddingTop: (this.props.context.displaySplit ? 0 : 20)}}>
                  <Grid item xs={12} sm={(this.props.context.displaySplit ? 12 : 10)} xl={(this.props.context.displaySplit ? 12 : 9)}>
                    {this.props.listType === "drilldown" && // Header for drilldown lists            
                      <Grid item md={12}>
                        <Typography variant="h3" style={{ marginBottom: "15px" }}>
                          Tasks
                        </Typography>
                        <Typography style={{ marginBottom: "15px" }}>
                          Tasks define specific problems to be solved using this {this.getTypeName(this.props.context.type)}. They specify train and test sets, 
                          which target feature(s) to predict for supervised problems, and possibly which evaluation measure
                          to optimize. They make the problem reproducible and machine-readable.
                        </Typography>
                      </Grid>
                    }
                    <Paper>
                      {component}
                    </Paper>
                  </Grid>
                </Grid>
              </Scrollbar>
          </SearchListPanel>
        </React.Fragment>
      );
    } else {
      //nested query
      console.log("Tag defined - Does this ever come up?")
      return (
        <React.Fragment>
          {component}
        </React.Fragment>
      );
    }
  }
}
