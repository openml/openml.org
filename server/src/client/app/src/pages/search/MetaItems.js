import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Avatar,
  Tooltip,
  Chip
} from "@material-ui/core";
export class MetaTag extends React.Component {
  render() {
    let icon;
    let prefix = "";
    let suffix = "";
    switch (this.props.type) {
      case "format":
        icon = "table";
        break;
      case "licence":
        icon = "closed-captioning";
        break;
      case "task-type":
        icon = "flag";
        break;
      case "dataset":
        icon = "database";
        break;
      case "likes":
        icon = "heart";
        break;
      case "downloads":
        icon = "cloud";
        suffix = " downloads";
        break;
      case "issues":
        icon = "exclamation-triangle";
        break;
      case "downvotes":
        icon = "thumbs-down";
        break;
      case "runs":
        icon = "star";
        suffix = " runs";
        break;
      case "task":
        icon = "trophy";
        prefix = "Task ";
        break;
      case "status":
        icon = "check-circle";
        break;
      case "id":
        icon = "id-badge";
        break;
      case "uploaded":
        let uploadedDate = this.props.date !== undefined ? (<span><FontAwesomeIcon icon={"clock"} />{" "}{this.props.date}{" "}</span>) : "";
        let uploadedBy = this.props.uploader !== undefined ? (<span>by <Chip size="small" variant="outlined" color="primary" avatar={<Avatar>{this.props.uploader.charAt(0)}</Avatar>} label={this.props.uploader} /></span>) : "";
        return (
          <Tooltip title="Date uploaded" placement="top-start">
            <span style={{ paddingRight: 15, paddingBottom: 5, display: "inline-block" }}>
              <FontAwesomeIcon icon={"cloud-upload-alt"} />{" "}
          uploaded{" "}
              {uploadedDate}
              {uploadedBy}
            </span>
          </Tooltip>);
      default:
        icon = "questionmark";
        break;
    }

    return (
      <Tooltip title={this.props.type} placement="top-start">
        <span style={{ paddingRight: 15, paddingBottom: 5, display: "inline-block" }}>
          <FontAwesomeIcon icon={icon} />{" "}{prefix}{this.props.value}{suffix}
        </span>
      </Tooltip>
    )
  }
}

export class VisibilityChip extends React.Component {
  render() {
    return (<Chip variant="outlined" color="primary" size={"small"} label={this.props.visibility} style={{ "margin-right": "10px" }} />);
  }
}