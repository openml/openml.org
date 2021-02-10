import React from "react";
import { EvaluationDetail } from "./ItemDetail.js";
import { FlowDetail } from "./ItemDetail.js";
import { MetaTag } from "./MetaItems.js";

import { Card, CardContent, Typography, Grid } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CollapsibleDataTable } from "./sizeLimiter";
import { QualityDetail } from "./ItemDetail";

export class RunItem extends React.Component {
  render() {
    let flowCols = ["Parameter", "Value"];
    let evaluationMeasureCols = ["Evaluation Measure", "Value", ""];
    console.log(this.props.object);

    //remove evaluations that do not have 'value' property from the retrieved api data
    var evaluations = [];
    if (this.props.object.evaluations) {
      for (let i = 0; i < this.props.object.evaluations.length; i++) {
        if (this.props.object.evaluations[i].value != null) {
          evaluations.push(this.props.object.evaluations[i]);
        }
      }
    }
    //parameter with the same names result in FlowDetail objects with the same keys,counter is used to prevent it
    var parameterID = 0;
    //ID counter for evaluations
    var evaluationID = 0;
    return (
      <React.Fragment>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container style={{ padding: "25px 0" }}>
              <Grid item md={12}>
                <Typography variant="h1" style={{ marginBottom: "15px" }}>
                  <FontAwesomeIcon icon="trophy" />
                  &nbsp;&nbsp;&nbsp;Run {this.props.object.run_id}
                </Typography>
              </Grid>
              <Grid item md={12}>
                <MetaTag
                  type={"task"}
                  value={this.props.object.run_task.task_id}
                />
                <MetaTag
                  type={"dataset"}
                  value={this.props.object.run_task.source_data.name}
                />
                <MetaTag type={"status"} value={this.props.object.visibility} />
                <MetaTag
                  type={"uploaded"}
                  date={this.props.object.date}
                  uploader={this.props.object.uploader}
                />
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
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={12}>
                <FontAwesomeIcon icon="tags" /> {this.props.tags}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant={"h4"}>Flow</Typography>
                <br />
                <span style={{ wordWrap: "break-word" }}>
                  {this.props.object.run_flow.name}
                </span>
                <CollapsibleDataTable
                  data={this.props.object.run_flow.parameters}
                  rowrenderer={m => (
                    <FlowDetail key={parameterID++} item={m}></FlowDetail>
                  )}
                  maxLength={7}
                  columns={flowCols}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <CollapsibleDataTable
                  title={
                    "Evaluation Measures (" +
                    this.props.object.run_task.estimation_procedure.name +
                    ")"
                  }
                  data={evaluations}
                  rowrenderer={m => (
                    <EvaluationDetail
                      key={evaluationID++}
                      item={m}
                      target_values={this.props.object.run_task.target_values}
                      estimationProcedure={this.props.object.run_task.name}
                    />
                  )}
                  maxLength={7}
                  columns={evaluationMeasureCols}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant={"h4"}>Tasks</Typography>

                <div className={"subtitle"}>
                  Task visualization not currently supported
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
