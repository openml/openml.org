import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class MetaTag extends React.Component {
  render() {
    let icon;
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
        break;
      case "issues":
        icon = "exclamation-triangle";
        break;
      case "downvotes":
        icon = "thumbs-down";
        break;
      case "runs":
        icon = "star";
        break;
      case "task":
        icon = "trophy";
        break;
      default:
        icon = "questionmark";
        break;
    }

    return (
      <span style={{"padding-right": "10px"}}>
        <FontAwesomeIcon icon={icon} />{" "}{this.props.value}
      </span>
    )
  }
}
