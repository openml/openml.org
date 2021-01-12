import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Chip,
  Avatar,
  Card,
  CardContent,
  Typography,
  Grid
} from "@material-ui/core";
import {
  MetaTag
} from "./MetaItems"

import { Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";

export class TaskItem extends React.Component {
  render() {
    let taskDescription = [
      { key: "Task ID", value: this.props.object.task_id},
      { key: "Task Type", value: this.props.object.tasktype.name},
      { key: "Source Data", value: this.props.object.source_data.name},
      { key: "Target Feature", value: this.props.object.target_feature},
      { key: "Estimation Procedure", value: this.props.object.estimation_procedure.name}
    ];
    console.log(this.props.object)
    return (
      <React.Fragment>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container style={{"padding": "25px 0"}}>
              <Grid item md={12}>
                <Typography variant="h1" className={"sectionTitle"} style={{"margin-bottom": "15px"}}>
                  <FontAwesomeIcon icon="trophy" />{" "}
                  {this.props.object.tasktype.name} on{" "}
                  {this.props.object.source_data.name}{" "}
                </Typography>
              </Grid>
              <Grid item md={12}>created <FontAwesomeIcon icon="clock" />{" "}{this.props.object.date}<br />
                <MetaTag type={"task"} value={"Task " + this.props.object.task_id} />
                <MetaTag type={"task-type"} value={this.props.object.tasktype.name} />
                <MetaTag type={"dataset"} value={"Task " + this.props.object.source_data.name} />
                <MetaTag type={"runs"} value={this.props.object.runs + " runs submitted"} />
                <MetaTag type={"likes"} value={this.props.object.nr_of_likes} />
                <MetaTag type={"downloads"} value={this.props.object.nr_of_downloads} />
                <MetaTag type={"issues"} value={this.props.object.nr_of_issues} />
                <MetaTag type={"downvotes"} value={this.props.object.nr_of_downvotes} />
                {/*{" "}by{" "} <Grid item md={2} ><MetaDownvotes value={this.props.object.downvotes} /></Grid>*/}
              </Grid>
            </Grid>

            <Grid container>
              <Grid item md={12}><FontAwesomeIcon icon="tags" />{" "}{this.props.tags}</Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h4" mb={6}>Details</Typography>
                <Table>
                    {taskDescription.map(x => (
                      <TableRow>
                        <TableCell>{x.key}</TableCell>
                        <TableCell>{x.value}</TableCell>
                      </TableRow>
                      ))}
                </Table>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </React.Fragment>
    );
  }
}
