import React from "react";
import { EvaluationDetail } from "./ItemDetail.js";
import { FlowDetail } from "./ItemDetail.js";
import { MetaTag } from "./MetaItems.js";

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardContent,
  Typography,
  Grid,
  Link,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CollapsibleDataTable } from "./sizeLimiter";

export class RunItem extends React.Component {
  state = {
    openImage: null, // { name, url } or null
  };

  handleOpenImage = (name, url) => {
    this.setState({ openImage: { name, url } });
  };

  handleCloseImage = () => {
    this.setState({ openImage: null });
  };

  render() {
    console.log(this.props.object.output_files);
    let flowCols = ["Parameter", "Value"];
    let evaluationMeasureCols = ["Evaluation Measure", "Value", ""];

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
                  rowrenderer={(m) => (
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
                  rowrenderer={(m) => (
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
                <Typography variant="h4" mb={6}>
                  Output files
                </Typography>
                <Table>
                  <TableBody>
                    {Object.entries(this.props.object.output_files).map(
                      ([name, file], index) => (
                        <TableRow key={"row_" + name}>
                          <TableCell>
                            <Link
                              href={file.url}
                              target="_blank"
                              rel="noopener"
                            >
                              {name}
                            </Link>
                          </TableCell>
                          <TableCell>{file.format}</TableCell>
                          <TableCell>
                            {file.format === "png" && (
                              <img
                                src={file.url}
                                alt={name}
                                style={{
                                  maxHeight: "80px",
                                  maxWidth: "120px",
                                  objectFit: "contain",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                                }}
                                onClick={() =>
                                  this.handleOpenImage(name, file.url)
                                }
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Dialog
              open={!!this.state.openImage}
              onClose={this.handleCloseImage}
              maxWidth="md"
            >
              <DialogContent
                sx={{ position: "relative", p: 2, backgroundColor: "#fefefe" }}
              >
                <IconButton
                  onClick={this.handleCloseImage}
                  sx={{ position: "absolute", top: 8, right: 8 }}
                >
                  <CloseIcon />
                </IconButton>
                {this.state.openImage && (
                  <img
                    src={this.state.openImage.url}
                    alt={this.state.openImage.name}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "4px",
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
