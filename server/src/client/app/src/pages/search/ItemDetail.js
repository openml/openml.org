import React from "react";
import styled from "styled-components";
import { getItem } from "./api.js";
//items
import { DatasetItem } from "./Dataset.js";
import { TaskTypeItem } from "./TaskType.js";
import { MeasureItem } from "./Measure.js";
import { TaskItem } from "./Task.js";
import { FlowItem } from "./Flow.js";
import { RunItem } from "./Run.js";
import { StudyItem } from "./Study.js";
import { UserItem } from "./User.js";
import { Chip } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, TableRow, TableCell } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const TagChip = styled(Chip)`
  margin-bottom: 5px;
  margin-left: 5px;
`;

function fixUpperCase(str) {
  let o = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i].toLowerCase() !== str[i]) {
      o += " " + str[i].toLowerCase();
    } else {
      o += str[i];
    }
  }
  return o;
}
export class FeatureDetail extends React.Component {
  render() {
    let icon = "";
    switch (this.props.item.type) {
      case "numeric":
        icon = "ruler-horizontal";
        break;
      case "nominal":
        icon = "tag";
        break;
      default:
        icon = "question-circle";
        break;
    }
    return (
      <TableRow className="contentSection item">
        <TableCell width={25}>
          <FontAwesomeIcon icon={icon} />
        </TableCell>
        <TableCell className={"itemName"}>
          {this.props.item.name}
          {this.props.item.target ? (
            <span className={"subtitle"}> (target)</span>
          ) : (
              ""
            )}
        </TableCell>
        <TableCell className={"itemDetail-small"}>
          {this.props.item.type}
        </TableCell>
        <TableCell className={"itemDetail-small"}>
          {this.props.item.distinct} distinct values
          <br />
          {this.props.item.missing} missing attributes
        </TableCell>
      </TableRow>
    );
  }
}

export const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 16
  }
}))(Tooltip);

export class QualityDetail extends React.Component {
  render() {
    return (
      <TableRow>
        <TableCell className={"itemHead"}>
          <FontAwesomeIcon icon={"chart-bar"} />
        </TableCell>
        <TableCell className={"itemName"}>
          {fixUpperCase(this.props.item.name)}
        </TableCell>
        <TableCell className={"itemDetail-small"}>
          {this.props.item.value}
        </TableCell>
      </TableRow>
    );
  }
}
export class ParameterDetail extends React.Component {
  fixUpperCase(str) {
    let o = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i].toLowerCase() !== str[i]) {
        o += " " + str[i].toLowerCase();
      } else {
        o += str[i];
      }
    }
    return o;
  }
  render() {
    return (
      <TableRow>
        <TableCell>{fixUpperCase(this.props.item.name)}</TableCell>
        <TableCell>{this.props.item.description}</TableCell>
        <TableCell>{this.props.item.data_type}</TableCell>
        <TableCell>{this.props.item.default_value}</TableCell>
      </TableRow>
    );
  }
}
export class DependencyDetail extends React.Component {
  render() {
    return (
      <TableRow>
        <TableCell>{this.props.name}</TableCell>
        <TableCell>{this.props.version}</TableCell>
      </TableRow>
    );
  }
}
export class EvaluationDetail extends React.Component {
  render() {
    let classWiseEval = "";
    if (this.props.item.array_data != null) {
      var ID = 0;
      let rows = [];
      this.props.target_values.forEach((item, i) => {
        let val = this.props.item.array_data[i];
        rows.push(
          <tr key={"key_" + this.props.item.evaluation_measure + i}>
            <td key={ID++} style={{ width: "50%" }}>
              {item}
            </td>
            <td key={ID++}>{val}</td>
          </tr>
        );
      });
      classWiseEval = (
        <table width={"100%"}>
          <tbody>{rows}</tbody>
        </table>
      );
    }

    return (
      <TableRow>
        <TableCell style={{ width: "50%" }}>
          {this.props.item.evaluation_measure}
        </TableCell>
        <TableCell style={{ width: "25%" }}>{this.props.item.value}</TableCell>
        <TableCell style={{ width: "25%" }}>{classWiseEval}</TableCell>
      </TableRow>
    );
  }
}
export class FlowDetail extends React.Component {
  render() {
    return (
      <TableRow>
        <TableCell style={{ width: "50%" }}>
          <span style={{ wordWrap: "break-word" }}>
            {this.props.item.parameter}
          </span>
        </TableCell>
        <TableCell>{this.props.item.value}</TableCell>
      </TableRow>
    );
  }
}
export class EntryDetails extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.state["obj"] = null;
    this.state["error"] = null;
    this.state["type"] = null;
    this.state["entity"] = null;
  }

  componentDidUpdate() {
    if (
      this.state["type"] !== this.props.type ||
      this.state["entity"] !== this.props.entity
    ) {
      this.setState({ type: this.props.type });
      this.setState({ entity: this.props.entity });
      getItem(this.props.type, this.props.entity)
        .then(data => {
          this.setState({ obj: data });
        })
        .catch(error => {
          this.setState({
            obj: undefined,
            error: error + ""
          });
        });
    }

    // Sanity check for bad ID types before rendering
    if ((this.props.type === "study" || this.props.type === "benchmark") && this.state.obj !== null &&
    this.props.filters["study_type"]["value"] !== this.state.obj.study_type
    ){ // auto-redirect for bad study type in URL
      let currentUrlParams = new URLSearchParams(this.props.location.search);
      currentUrlParams.set("study_type", this.state.obj.study_type);
      this.props.history.push(
        this.props.location.pathname + "?" + currentUrlParams.toString()
      );
    }
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  updateTag = (value) => {
    let currentUrlParams = new URLSearchParams(this.props.location.search);
    currentUrlParams.set("tags.tag", value);
    this.props.history.push(
      this.props.location.pathname + "?" + currentUrlParams.toString()
    );
  };

  render() {
    if (this.state.error !== null) {
      return (
        <div className="mainBar">
          <h1>An error occured</h1>
          <p>{"" + this.state.error}</p>
        </div>
      );
    } else if (this.state.obj === null) {
      return (
        <div className="mainBar">
          <h2>Loading...</h2>
        </div>
      );
    } else {
      if (
        this.props.type === "data" ||
        this.props.type === "task" ||
        this.props.type === "flow" ||
        this.props.type === "run"
      ) {
        var tags = undefined;
        if (this.state.obj.tags) {
          tags = this.state.obj.tags.map(t => (
            t.tag.startsWith("study") ? "" :
              <TagChip key={"tag_" + t.tag} label={"  " + t.tag + "  "} size="small" onClick={() => this.updateTag(t.tag)}/>
          ));
        }
      }

      switch (this.props.type) {
        case "data":
          return (
            <DatasetItem object={this.state.obj} tags={tags}></DatasetItem>
          );
        case "task":
          return <TaskItem object={this.state.obj} tags={tags}></TaskItem>;
        case "flow":
          return <FlowItem object={this.state.obj} tags={tags}></FlowItem>;
        case "run":
          return <RunItem object={this.state.obj} tags={tags}></RunItem>;
        case "study":
          return <StudyItem object={this.state.obj}></StudyItem>;
        case "user":
          return <UserItem object={this.state.obj}></UserItem>;
        case "task_type":
          return <TaskTypeItem object={this.state.obj}></TaskTypeItem>;
        case "measure":
          return <MeasureItem object={this.state.obj}></MeasureItem>;
        default:
          return (
            <DatasetItem object={this.state.obj} tags={tags}></DatasetItem>
          );
      }
    }
  }
}
