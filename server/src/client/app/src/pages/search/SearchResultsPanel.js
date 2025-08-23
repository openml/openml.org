import React from "react";
import styled from "styled-components";
import { Card, Tooltip, Paper, CardHeader, Avatar, Grid, Typography, Box, CircularProgress, Link as MuiLink } from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import InfiniteScroll from "react-infinite-scroll-component";
import TimeAgo from "react-timeago";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  blue,
  orange,
  red,
  green,
  grey,
  purple
} from "@mui/material/colors";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.color};
  padding-left: 5px;
  padding-right: 1px;
  font-weight: 800;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
    color: ${props => props.color};
  }
`;

const SimpleLink = styled(MuiLink)`
  text-decoration: none;
  padding-right: 1px;
  font-weight: 800;
`;

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
  box-shadow: none;
  ${props => props.fullwidth && `width: 100%;`}
  &:hover {background-color: #f1f3f4;}
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
                src="images/anonymousMan.png"
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
    if (nextProps.context.results.length >= 0 && nextProps.context.updateType !== undefined){
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
    let qtype = this.props.context.type; // query object type
    let result_type = qtype; // result type, same as qtype, except for benchmarks

    // distinguishing benchmarks and studies in frontend
    if (this.props.context.type === "benchmark"){
      qtype = "study";
      result_type = this.props.context.type;
    }
    let results = this.props.context.results
    let count = this.props.context.counts;
    let scrollID = "resultScroll"
    if (this.props.listType === "drilldown"){
      qtype = this.props.context.subType;
      result_type = qtype;
      results = this.props.context.subResults;
      count = this.props.context.subCounts;
      scrollID = "subResultScroll"
    }

    // ID field
    const id_field = (qtype) => {
      if (qtype === "task_type"){
        return "tt_id"
      } else if (qtype === "measure") {
        let mtype = this.props.context.filters["measure_type"].value;
        if (mtype === "procedure"){
          return "proc_id";
        } else if (mtype === "measure"){
          return "eval_id";
        } else {
          return mtype + "_id"
        }
      }
      else {
        return qtype + "_id"
      }
    }
    // List header. TODO: clean up code
    const header = (type, qtype, study_type, measure_type) => {
      if (qtype === "task" || (type === "task" && qtype === "task")){
        return <Box m={2} pt={3}>
                <Typography variant="h3" style={{ marginBottom: "15px" }}>
                  {this.capitalize(qtype)}s
                </Typography>
                <Typography style={{ marginBottom: "15px" }}>
                  Tasks define specific problems to be solved using {type === "task" ? (<span>a given dataset</span>) : (<span>this {type}</span>)}. 
                  They specify train and test sets, which target feature(s) to predict for 
                  supervised problems, and possibly which evaluation measure to optimize. 
                  They make the problem reproducible and machine-readable.{"\u00A0"}
                  <SimpleLink href="https://docs.openml.org/#tasks" style={{color:this.props.context.getColor("task")}}>Learn more. </SimpleLink>
                </Typography>
              </Box>
      } else if (qtype === "data"){
        return <Box m={2} pt={3}>
                <Typography variant="h3" style={{ marginBottom: "15px" }}>
                  {this.capitalize(qtype)}sets
                </Typography>
                <Typography style={{ marginBottom: "15px" }}>
                  Datasets provide training data for machine learning models. OpenML datasets are uniformly formatted and come
                  with rich meta-data to allow automated processing. 
                  You can <ColoredIcon color={this.props.context.getColor("data")} icon={"sort-amount-down"} fixedWidth/>
                  {"\u00A0"}sort or {"\u00A0"}
                  <ColoredIcon color={this.props.context.getColor("data")} icon={"filter"} fixedWidth/>
                  {"\u00A0"}filter them by a range of different properties.{"\u00A0"}
                  <SimpleLink href="https://docs.openml.org/#data" style={{color:this.props.context.getColor("data")}}>Learn more. </SimpleLink>
                </Typography>
              </Box>
      } else if (qtype === "flow"){
        return <Box m={2} pt={3}>
                <Typography variant="h3" style={{ marginBottom: "15px" }}>
                  {this.capitalize(qtype)}s
                </Typography>
                <Typography style={{ marginBottom: "15px" }}>
                  Flows represent machine learning pipelines or neural architectures, or (untrained) machine learning models, such as 
                  in general. Flows contain all the information necessary to build a model, including its exact structure 
                  and any software dependencies. Given a flow, supported machine learning libraries can reproduce the model 
                  exactly.{"\u00A0"}
                  <SimpleLink href="https://docs.openml.org/#flows" style={{color:this.props.context.getColor("flow")}}>Learn more. </SimpleLink>
                </Typography>
              </Box>
      } else if (qtype === "run"){
        return <Box m={2} pt={3}>
                <Typography variant="h3" style={{ marginBottom: "15px" }}>
                  {this.capitalize(qtype)}s
                </Typography>
                <Typography style={{ marginBottom: "15px" }}>
                  Runs are evaluations of machine learning models (flows) trained on {type === "run" ? (<span>a given task</span>) : (<span>this {type}</span>)}. 
                  They can be created and shared automatically from supported machine learning libraries. They contain the exact hyperparameters used, all detailed results, and potentially
                  the trained models.{"\u00A0"}
                  <SimpleLink href="https://docs.openml.org/#runs" style={{color:this.props.context.getColor("run")}}>Learn more. </SimpleLink>
                </Typography>
              </Box>
      } else if (qtype === "task_type"){
        return <Box m={2} pt={3}>
                <Typography variant="h3" style={{ marginBottom: "15px" }}>
                  {this.capitalize(qtype)}s
                </Typography>
                <Typography style={{ marginBottom: "15px" }}>
                  Task types define a machine-readable schema for specific machine learning tasks (e.g. classification). 
                  They define the required inputs and outputs, and how to describe them. Using this general schema, new tasks 
                  can be created on specific datasets, and all ensuing runs can be evaluated uniformly.
                </Typography>
              </Box>
      } else if (qtype === "study" && study_type === "task"){
        return <Box m={2} pt={3}>
                <Typography variant="h3" style={{ marginBottom: "15px" }}>
                  Task collections
                </Typography>
                <Typography style={{ marginBottom: "15px" }}>
                  You can group together tasks into collections to easily refer to them and share them with others.
                </Typography>
              </Box>
      } else if (qtype === "study" && study_type === "run"){
        return <Box m={2} pt={3}>
                <Typography variant="h3" style={{ marginBottom: "15px" }}>
                  Run collections
                </Typography>
                <Typography style={{ marginBottom: "15px" }}>
                  You can group together runs into collections to easily refer to them and share them with others.
                </Typography>
              </Box>
      } else if (type === "benchmark" && study_type === "task"){
        return <Box m={2} pt={3}>
                <Typography variant="h3" style={{ marginBottom: "15px" }}>
                  Benchmarking suites
                </Typography>
                <Typography style={{ marginBottom: "15px" }}>
                  <SimpleLink href="https://docs.openml.org/benchmark" style={{color:this.props.context.getColor("benchmark")}}>Benchmarking suites</SimpleLink>{" "}
                  are comprehensive and curated collections of OpenML tasks designed to evaluate algorihms under well-defined conditions. They make it much
                  easier to benchmark algorithms, and make the results objectively interpretable,
                  comparable, and reproducible. You can also
                  <StyledLink to="/auth/upload-collection-tasks" color={this.props.context.getColor("benchmark")}>create your own suites</StyledLink>.

                </Typography>
              </Box>
      } else if (type === "benchmark" && study_type === "run"){
        return <Box m={2} pt={3}>
                <Typography variant="h3" style={{ marginBottom: "15px" }}>
                  Benchmarking studies
                </Typography>
                <Typography style={{ marginBottom: "15px" }}>
                  Benchmarking studies are curated collections of OpenML runs obtained through a systematic evaluation of algorithms on a{" "}
                  <SimpleLink href="https://docs.openml.org/benchmark" style={{color:this.props.context.getColor("benchmark")}}>benchmarking suite</SimpleLink>.
                  The results can be viewed online (see their Analysis tab) or easily downloaded via our APIs and analyzed further. You can also
                  <StyledLink to="/auth/upload-collection-tasks" color={this.props.context.getColor("benchmark")}>create your own benchmark studies</StyledLink>.
                </Typography>
              </Box>
      } else if (qtype === "measure" && measure_type === "quality"){
        return <Box m={2} pt={3}>
                <Typography variant="h3" style={{ marginBottom: "15px" }}>
                  Data qualities
                </Typography>
                <Typography style={{ marginBottom: "15px" }}>
                  Data qualities are measureable properties of datasets, such as size, shape, statistical properties, benchmarks, and the presence of missing values.
                </Typography>
              </Box>
      } else if (qtype === "measure" && measure_type === "measure"){
        return <Box m={2} pt={3}>
                <Typography variant="h3" style={{ marginBottom: "15px"}}>
                  Evaluation measures
                </Typography>
                <Typography style={{ marginBottom: "15px" }}>
                  Evaluation measures define different ways to score the outputs of machine learning models (e.g. predictions).
                </Typography>
               </Box>
      } else if (qtype === "measure" && measure_type === "procedure"){
        return <Box m={2} pt={3}>
                <Typography variant="h3" style={{ marginBottom: "15px" }}>
                  Evaluation procedures
                </Typography>
                <Typography style={{ marginBottom: "15px" }}>
                  Evaluation procedures define how models should be evaluated, typically by 
                  defining specific kinds of train- and test splits.
                </Typography>
              </Box>
      } else {
        return <Box m={2} pt={3}>
                <Typography variant="h3" style={{ marginBottom: "15px" }}>
                  {this.capitalize(qtype)}s
                </Typography>
              </Box>
      }
    };

    // List end
    const endMessage = (length) => {
      if (this.props.context.updateType !== "query"){
        return <React.Fragment>
          <Box m={2} pt={5} display="flex" justifyContent="center" alignItems="center">
            <ColoredIcon color={this.props.context.getColor(qtype)} icon={"flag-checkered"} size="2x" fixedWidth/> 
            {"\u00A0\u00A0"}All {length} results shown. Missing something?
          </Box>
          <Box pb={5} pt={5} display="flex" justifyContent="center" alignItems="center">
            <ColoredIcon color={this.props.context.getColor("run")} icon="heart" size="2x" fixedWidth/>
            {"\u00A0\u00A0"}Share new <StyledLink to="/auth/upload-dataset" color={this.props.context.getColor("data")}> datasets</StyledLink>, 
            <StyledLink to="/auth/upload-task" color={this.props.context.getColor("task")}> tasks</StyledLink>, 
            <StyledLink to="/auth/upload-collection-tasks" color={this.props.context.getColor("study")}> collections</StyledLink>, or 
            <StyledLink to="https://docs.openml.org/APIs/" color={this.props.context.getColor("run")}> results</StyledLink>.
          </Box>
        </React.Fragment>
      }
    }
    if (
      results.length >= 1 && 
      results[0][id_field(qtype)] !== undefined
    ) {
      component = results.map(result => (
          <SearchElement
            name={result.name ? result.name : result.comp_name}
            version={result.version}
            teaser={this.getTeaser(result.description)}
            stats={this.getStats(this.props.stats, result)}
            stats2={this.getStats(this.props.stats2, result)}
            id={result[qtype + "_id"]}
            selected={result[qtype + "_id"] + "" === this.props.context.id &&
                      this.props.listType !== "drilldown"}
            onclick={() => 
              this.props.selectEntity(
                result[id_field(qtype)] + ""
              )
            }
            key={result[id_field(qtype)]+result_type}
            type={this.props.type}
            image={result.image}
            initials={result.initials}
            data_status={result.status}
            date={result.date}
            fullwidth={this.props.context.displaySplit}
            color={this.props.context.getColor(result_type)}
            icon={this.props.context.getIcon(result_type)}
          ></SearchElement>
      ));
    } else if (this.props.context.error !== null) {
      component = (
        <p style={{ paddingLeft: 10 }}>Error: {this.props.context.error}</p>
      );
    } else if (!this.props.context.updateType === "query") {
      component = <Card style={{ paddingLeft: 10 }}>No search results found</Card>;
    } else {
      component = <div></div>;
    }

    let dataLength = component.length;
    if (dataLength === undefined){
      dataLength = 0;
    }

    if (this.props.tag === undefined) {
      return (
        <React.Fragment>
          <SearchListPanel style={this.props.listType === "drilldown" ? {boxShadow:"none"} : {}}>
              <Scrollbar
                id={scrollID}
                style={{
                  display: (this.props.context.displaySearch || this.props.listType === "drilldown") ? "block" : "none",
                  height: "calc(100vh - "+(this.props.listType === "drilldown" ? "176" : "115")+"px)"
                }}
              >
              <Grid container direction="row" justifyContent="center" alignItems="center">
                <Grid item xs={12} md={(this.props.context.displaySplit ? 12 : 10)} 
                    xl={(this.props.context.displaySplit ? 12 : 9)}>
                <Grid container direction="column" 
                  style={{paddingTop: (this.props.context.displaySplit ? 0 : 20)}}>
                  {!this.props.context.displaySplit && (this.props.listType === "drilldown" || this.props.context.type === "benchmark" || this.props.context.type === "task"
                    || this.props.context.type === "data" || this.props.context.type === "flow" || this.props.context.type === "run" || this.props.context.type === "study" 
                    || this.props.context.type === "measure" || this.props.context.type === "task_type") && (

                    // show header to explain what we're showing
                    <Grid item>
                      {header(this.props.context.type,qtype,(this.props.context.filters.study_type ? this.props.context.filters.study_type.value : null),
                        (this.props.context.filters.measure_type ? this.props.context.filters.measure_type.value : null))}
                    </Grid>
                  )}
                  <Grid item style={{maxWidth:"100%"}}>
                    {component &&
                      <InfiniteScroll
                        dataLength={dataLength}
                        next={this.props.reload}
                        scrollThreshold="10px"
                        hasMore={dataLength !== count}
                        endMessage={endMessage(component.length)}
                        loader={<Box pb={5} pt={5} display="flex" justifyContent="center" alignItems="center"><CircularProgress disableShrink/></Box>}
                        scrollableTarget={scrollID}
                        style={{overflow:"inherit"}}
                      ><Paper style={{height:"100%"}}>{component}</Paper>
                      </InfiniteScroll>
                    }
                    {component === null && this.props.listType === "drilldown" && <CircularProgress />}
                  </Grid>
                </Grid>
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
