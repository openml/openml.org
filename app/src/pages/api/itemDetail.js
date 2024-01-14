import React from "react";
import { TableRow, TableCell, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faQuestionCircle,
  faRulerHorizontal,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
// import withStyles from '@mui/styles/withStyles';
import styled from "@emotion/styled";
import { Chip } from "@mui/material";

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

export function updateTag(value) {
  let currentUrlParams = new URLSearchParams(this.props.location.search);
  currentUrlParams.set("tags.tag", value);
  currentUrlParams.delete("id"); // selecting a tags should show match list
  this.props.history.push(
    this.props.location.pathname + "?" + currentUrlParams.toString(),
  );
}

export const TagChip = styled(Chip)`
  margin-bottom: 5px;
  margin-left: 5px;
`;

export class FeatureDetail extends React.Component {
  render() {
    let icon = "";
    switch (this.props.item.type) {
      case "numeric":
        icon = faRulerHorizontal;
        break;
      case "nominal":
        icon = faTag;
        break;
      default:
        icon = faQuestionCircle;
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

export class QualityDetail extends React.Component {
  render() {
    return (
      <TableRow>
        <TableCell className={"itemHead"}>
          <FontAwesomeIcon icon={faChartBar} />
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

// export const LightTooltip = withStyles(theme => ({
//     tooltip: {
//       backgroundColor: theme.palette.common.white,
//       color: "rgba(0, 0, 0, 0.87)",
//       boxShadow: theme.shadows[1],
//       fontSize: 16
//     }
//   }))(Tooltip);

export const LightTooltip = styled(Tooltip)`
backgroundColor: theme.palette.common.white,
color: "rgba(0, 0, 0, 0.87)",
boxShadow: theme.shwdows[1],
fontSize: 16;
`;

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

export class ParameterDetail extends React.Component {
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

export class EvaluationDetail extends React.Component {
  render() {
    let classWiseEval = "";
    if (this.props.item.array_data != null) {
      var ID = 0;
      let rows = [];
      if (this.props.target_values) {
        this.props.target_values.forEach((item, i) => {
          let val = this.props.item.array_data[i];
          rows.push(
            <tr key={"key_" + this.props.item.evaluation_measure + i}>
              <td key={ID++} style={{ width: "50%" }}>
                {item}
              </td>
              <td key={ID++}>{val}</td>
            </tr>,
          );
        });
      }
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
