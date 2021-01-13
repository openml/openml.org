import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Avatar,
  Chip } from "@material-ui/core";
export class MetaTag extends React.Component {
  render() {
    let icon;
    let prefix = "";
    let suffix = "";
    switch(this.props.type) {
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
        icon ="heart";
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
        prefix = "Task "
        break;
      case "status":
        icon = "eye";
        break;
      case "uploaded":
        let uploadedDate = this.props.date !== undefined ? (<span><FontAwesomeIcon icon={"clock"} />{" "}{this.props.date}{" "}</span>) : "";
        let uploadedBy = this.props.uploader !== undefined ? (<span>by <Chip size="small" variant="outlined" color="primary" avatar={<Avatar>{this.props.uploader.charAt(0)}</Avatar>} label={this.props.uploader} /></span>) : "";
        return(<span style={{"paddingRight": "10px"}}>
          <FontAwesomeIcon icon={"cloud-upload-alt"} />{" "}
          uploaded{" "}
          {uploadedDate}
          {uploadedBy}
        </span>);
      default:
        icon = "questionmark";
        break;
    }

    return (
      <span style={{"paddingRight": "10px"}}>
        <FontAwesomeIcon icon={icon} />{" "}{prefix}{this.props.value}{suffix}
      </span>
    )
  }
}

export class VisibilityChip extends React.Component {
  render() {
    return (<Chip variant="outlined" color="primary" size={"small"} label={this.props.visibility} style={{"margin-right": "10px"}} />);
  }
}