import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faClock,
  faClosedCaptioning,
  faCloud,
  faCloudUploadAlt,
  faCodeBranch,
  faCogs,
  faDatabase,
  faExclamationTriangle,
  faEye,
  faFlag,
  faHeart,
  faIdBadge,
  faQuestion,
  faStar,
  faTable,
  faThumbsDown,
  faTimes,
  faTrophy,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";

import { Avatar, Tooltip, Chip } from "@mui/material";
export class MetaTag extends React.Component {
  render() {
    let icon;
    let prefix = "";
    let suffix = "";
    switch (this.props.type) {
      case "format":
        icon = faTable;
        break;
      case "version":
        icon = faCodeBranch;
        break;
      case "licence":
        icon = faClosedCaptioning;
        break;
      case "visibility":
        icon = faEye;
        break;
      case "task-type":
        icon = faFlag;
        break;
      case "dataset":
        icon = faDatabase;
        break;
      case "likes":
        icon = faHeart;
        break;
      case "downloads":
        icon = faCloud;
        suffix = " downloads";
        break;
      case "issues":
        icon = faExclamationTriangle;
        break;
      case "downvotes":
        icon = faThumbsDown;
        break;
      case "runs":
        icon = faStar;
        suffix = " runs";
        break;
      case "task":
        icon = faTrophy;
        prefix = "Task ";
        break;
      case "tasks":
        icon = faTrophy;
        suffix = " tasks";
        break;
      case "data":
        icon = faDatabase;
        suffix = " datasets";
        break;
      case "flows":
        icon = faCogs;
        suffix = " flows";
        break;
      case "status":
        icon =
          this.props.value === "verified"
            ? faCheckCircle
            : this.props.value === "deactivated"
            ? faTimes
            : faWrench;
        break;
      case "id":
        icon = faIdBadge;
        break;
      case "uploaded":
        let uploadedDate =
          this.props.date !== undefined ? (
            <span>
              <FontAwesomeIcon icon={faClock} /> {this.props.date}{" "}
            </span>
          ) : (
            ""
          );
        let uploadedBy =
          this.props.uploader !== undefined ? (
            <span>
              by{" "}
              <Chip
                size="small"
                variant="outlined"
                color="primary"
                avatar={<Avatar>{this.props.uploader.charAt(0)}</Avatar>}
                label={this.props.uploader}
              />
            </span>
          ) : (
            ""
          );
        return (
          <Tooltip title="Date uploaded" placement="top-start">
            <span
              style={{
                paddingRight: 15,
                paddingBottom: 5,
                display: "inline-block",
              }}
            >
              <FontAwesomeIcon icon={faCloudUploadAlt} /> uploaded{" "}
              {uploadedDate}
              {uploadedBy}
            </span>
          </Tooltip>
        );
      default:
        icon = faQuestion;
        break;
    }

    return (
      <Tooltip title={this.props.type} placement="top-start">
        <span
          style={{
            paddingRight: 15,
            paddingBottom: 5,
            display: "inline-block",
          }}
        >
          <FontAwesomeIcon icon={icon} color={this.props.color} /> {prefix}
          {this.props.value}
          {suffix}
        </span>
      </Tooltip>
    );
  }
}

export class VisibilityChip extends React.Component {
  render() {
    return (
      <Chip
        variant="outlined"
        color="primary"
        size={"small"}
        label={this.props.visibility}
        style={{ "margin-right": "10px" }}
      />
    );
  }
}
