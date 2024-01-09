import React from "react";
import { TableRow, TableCell, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faQuestionCircle, faRulerHorizontal, faTag } from "@fortawesome/free-solid-svg-icons";
// import withStyles from '@mui/styles/withStyles';
import styled from "@emotion/styled";

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
                        </tr>
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
      currentUrlParams.delete("id"); // selecting a tags should show match list
      this.props.history.push(
        this.props.location.pathname + "?" + currentUrlParams.toString()
      );
    };
  
    render() {
      if (this.state.error !== null) {
        if (!this.state.error.includes("404")){
          return (
            <div className="mainBar">
              <h1>An error occured</h1>
              <p>{"" + this.state.error}</p>
            </div>
          );
        }
      } else if (this.state.obj === null) {
        return (
          <div className="mainBar">
            <h2>Loading...</h2>
          </div>
        );
      } else if (
          this.props.type === "data" ||
          this.props.type === "task" ||
          this.props.type === "flow" ||
          this.props.type === "run"
        ) {
          var tags = undefined;
          if (this.state.obj.tags) {
            tags = this.state.obj.tags.map(t => (
              t.tag.toString().startsWith("study") ? "" :
                <TagChip key={"tag_" + t.tag} label={"  " + t.tag + "  "} size="small" onClick={() => this.updateTag(t.tag)}/>
            ));
          }
      }
  
      // A nice 404 message for 404s and restricted access
      if ((this.state.error !== null && this.state.error.includes("404")) || 
          (this.state.obj !== null && this.state.obj.visibility === "private" && 
           this.state.obj.uploader_id !== this.props.userID)){
        return (
          <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '50vh' }}>
            <Grid item xs={6}>
              <h2>This is not the {this.props.type} you are looking for.</h2>
              { this.props.userID === undefined &&
              <p>We couldn't find this. You might see more after logging in.</p>
              }
            </Grid>   
            <Grid item xs={3} style={{marginTop:50}}>
             <PaperPlane color={this.props.color}/>
            </Grid>
          </Grid> 
        );
      } else {
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