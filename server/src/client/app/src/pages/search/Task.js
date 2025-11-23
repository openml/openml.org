import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { MetaTag } from "./MetaItems";

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Link as MuiLink,
} from "@mui/material";
import { green } from "@mui/material/colors";

const SimpleLink = styled(MuiLink)`
  text-decoration: none;
  padding-right: 1px;
  font-weight: 800;
  color: ${green[500]};
`;

export class TaskItem extends React.Component {
  render() {
    let taskDescription = [
      { name: "Task ID", value: this.props.object.task_id },
      { name: "Task Type", value: this.props.object.tasktype.name },
      { name: "Source Data", value: this.props.object.source_data.name },
      { name: "Target Feature", value: this.props.object.target_feature },
      {
        name: "Estimation Procedure",
        value: this.props.object.estimation_procedure
          ? this.props.object.estimation_procedure.name
          : undefined,
      },
    ];
    return (
      <React.Fragment>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container style={{ padding: "25px 0" }}>
              <Grid item md={12}>
                <Typography
                  variant="h1"
                  className={"sectionTitle"}
                  style={{ marginBottom: "15px" }}
                >
                  <FontAwesomeIcon icon="trophy" />{" "}
                  {this.props.object.tasktype.name} on{" "}
                  {this.props.object.source_data.name}{" "}
                </Typography>
              </Grid>
              <Grid item md={12}>
                <MetaTag type={"task"} value={this.props.object.task_id} />
                <MetaTag
                  type={"task-type"}
                  value={this.props.object.tasktype.name}
                />
                <SimpleLink
                  href={
                    "search?type=data&id=" +
                    this.props.object.source_data.data_id
                  }
                >
                  <MetaTag
                    type={"dataset"}
                    value={this.props.object.source_data.name}
                  />
                </SimpleLink>
                created <FontAwesomeIcon icon="clock" />{" "}
                {this.props.object.date}
                <br />
                <MetaTag type={"likes"} value={this.props.object.nr_of_likes} />
                <MetaTag
                  type={"issues"}
                  value={this.props.object.nr_of_issues}
                />
                <MetaTag
                  type={"downvotes"}
                  value={this.props.object.nr_of_downvotes}
                />
                <MetaTag
                  type={"downloads"}
                  value={this.props.object.nr_of_downloads}
                />
                <MetaTag type={"runs"} value={this.props.object.runs} />
                {/*{" "}by{" "} <Grid item md={2} ><MetaDownvotes value={this.props.object.downvotes} /></Grid>*/}
              </Grid>
            </Grid>
            {this.props.tags[0] !== undefined &&
              this.props.tags[0].length > 0 && (
                <Grid container>
                  <Grid item md={12}>
                    <FontAwesomeIcon icon="tags" /> {this.props.tags}
                  </Grid>
                </Grid>
              )}
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h4" mb={6}>
                  Details
                </Typography>
                <Table>
                  <TableBody>
                    {taskDescription.map((x) => (
                      <TableRow key={"row_" + x.name}>
                        <TableCell>{x.name}</TableCell>
                        <TableCell>{x.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
