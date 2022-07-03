import React from "react";
import styled from "styled-components";
import SearchPanel from "./SearchPanel.js";
import { MetaTag } from "./MetaItems";
import {
  Chip,
  Avatar,
  Card,
  CardContent,
  Typography,
  Grid
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserChip = styled(Chip)`
  margin-bottom: 5px;
  margin-left: 10px;
`;

class DescriptionView extends React.Component {
  render() {
    return <React.Fragment>{this.props.obj.object.description}</React.Fragment>;
  }
}
class DatasetView extends React.Component {
  //send id of the study item in order to make the query for this study tag
  render() {
    return (
      <React.Fragment>
        <SearchPanel
          entity_type="data"
          tag={"study_" + this.props.obj.object.study_id}
        ></SearchPanel>
      </React.Fragment>
    );
  }
}
class TaskView extends React.Component {
  render() {
    return (
      <React.Fragment>
        <SearchPanel
          entity_type="task"
          tag={"study_" + this.props.obj.object.study_id}
        ></SearchPanel>
      </React.Fragment>
    );
  }
}
class FlowView extends React.Component {
  render() {
    return (
      <React.Fragment>
        <SearchPanel
          entity_type="flow"
          tag={"study_" + this.props.obj.object.study_id}
        ></SearchPanel>
      </React.Fragment>
    );
  }
}
class RunView extends React.Component {
  render() {
    return (
      <React.Fragment>
        <SearchPanel
          entity_type="run"
          tag={"study_" + this.props.obj.object.study_id}
        ></SearchPanel>
      </React.Fragment>
    );
  }
}

export class StudyItem extends React.Component {
  constructor(props) {
    super(props);
    this.object = props;
    this.state = { view: <DescriptionView obj={this.object} /> };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(content) {
    switch (content) {
      case "Description":
        this.setState({ view: <DescriptionView obj={this.object} /> });
        break;
      case "Datasets":
        this.setState({ view: <DatasetView obj={this.object} /> });
        break;
      case "Tasks":
        this.setState({ view: <TaskView obj={this.object} /> });
        break;
      case "Flows":
        this.setState({ view: <FlowView obj={this.object} /> });
        break;
      case "Runs":
        this.setState({ view: <RunView obj={this.object} /> });
        break;
      default:
        this.setState({ view: <DescriptionView obj={this.object} /> });
        break;
    }
  }

  render() {
    return (
      <React.Fragment>
        <Grid container spacing={6}>
          <Grid item md={12}>
            <Typography variant="h1" style={{ marginTop: "15px" }}>
              <FontAwesomeIcon icon="layer-group" />
              &nbsp;&nbsp;&nbsp;{this.props.object.name}
            </Typography>
          </Grid>
          <Grid item md={12}>
            <MetaTag type={"id"} value={"ID: " + this.props.object.study_id} />
            <MetaTag type={"visibility"} value={this.props.object.visibility} />
            <FontAwesomeIcon icon="clock" />{" "}
            {this.props.object.date.split(" ")[0]}
            <UserChip
              size="small"
              variant="outlined"
              color="primary"
              avatar={
                <Avatar>{this.props.object.uploader ? this.props.object.uploader.charAt(0) : "X"}</Avatar>
              }
              label={this.props.object.uploader}
              href={"search?type=user&id=" + this.props.object.uploader_id}
              component="a"
              clickable
            />
            <br />
            <MetaTag type={"data"} value={this.props.object.datasets_included} />
            <MetaTag type={"tasks"} value={this.props.object.tasks_included} />
            <MetaTag type={"flows"} value={this.props.object.flows_included} />
            <MetaTag type={"runs"} value={this.props.object.runs_included} />
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h4" mb={6}>
                  Description
                </Typography>
                <div className="contentSection">
                  <ReactMarkdown children={this.props.object.description} />
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
