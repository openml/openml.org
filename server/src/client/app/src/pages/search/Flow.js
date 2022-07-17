import React from "react";
import { StringLimiter, CollapsibleDataTable } from "./sizeLimiter.js";
import {
  LightTooltip,
  ParameterDetail,
  DependencyDetail
} from "./ItemDetail.js";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MetaTag } from "./MetaItems";

export class FlowItem extends React.Component {
  render() {
    let dependenciesMap = this.props.object.dependencies
      .split(", ")
      .map(x => x.split("_"));
    let parameterCols = ["Name", "Description", "Type", "Default Value"];

    return (
      <React.Fragment>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container style={{ padding: "25px 0" }}>
              <Grid item md={12}>
                <LightTooltip title={this.props.object.name}>
                  <Typography
                    variant={"h1"}
                    style={{ marginBottom: "15px", wordWrap: "break-word" }}
                  >
                    <FontAwesomeIcon icon={"cogs"} />
                    &nbsp;&nbsp;&nbsp;
                    <StringLimiter
                      maxLength={65}
                      value={this.props.object.name}
                    />
                  </Typography>
                </LightTooltip>
              </Grid>
              <Grid item md={12}>
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
                <MetaTag type={"runs"} value={this.props.object.runs} />
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
                <Typography variant={"h4"}>
                  Description of{" "}
                  <span style={{ wordWrap: "break-word" }}>
                    {this.props.object.name}
                  </span>
                </Typography>
                <ReactMarkdown source={this.props.object.description} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <CollapsibleDataTable
                  title={"Dependencies"}
                  data={dependenciesMap}
                  rowrenderer={dep => (
                    <DependencyDetail
                      key={dep[0]}
                      name={dep[0]}
                      version={dep[1]}
                    />
                  )}
                  maxLength={7}
                  columns={["Library", "Version"]}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <CollapsibleDataTable
                  title={"Parameters"}
                  data={this.props.object.parameters}
                  rowrenderer={m => (
                    <ParameterDetail key={"fd_" + m.name} item={m} />
                  )}
                  maxLength={7}
                  columns={parameterCols}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant={"h4"}>
                  Runs ({this.props.object.runs})
                </Typography>
                <br />
                Run visualization not currently supported
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
