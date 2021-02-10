import React from "react";
import { CollapsibleDataTable } from "./sizeLimiter.js";
import { FeatureDetail, QualityDetail } from "./ItemDetail.js";

import ReactMarkdown from "react-markdown";
import {
  Chip,
  Avatar,
  Card,
  CardContent,
  Typography,
  Grid
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MetaTag } from "./MetaItems";

export class DatasetItem extends React.Component {
  constructor() {
    super();
    this.defaultFeatureListSizeLimit = 7;
    this.featureSizeLimit = this.defaultFeatureListSizeLimit;
  }
  render() {
    let featureTableColumns = [
      "",
      "Feature Name",
      "Type",
      "Distinct/Missing Values"
    ];
    let qualityTableColumns = ["", "Quality Name", "Value"];

    return (
      <React.Fragment>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container style={{ padding: "25px 0" }}>
              <Grid item md={12}>
                <Typography variant="h1" style={{ marginBottom: "15px" }}>
                  <FontAwesomeIcon icon="database" />
                  &nbsp;&nbsp;&nbsp;{this.props.object.name}
                </Typography>
              </Grid>
              <Grid item md={12}>
                <MetaTag type={"status"} value={this.props.object.status} />
                <MetaTag type={"format"} value={this.props.object.format} />
                <MetaTag type={"licence"} value={this.props.object.licence} />
                <MetaTag
                  type={"uploaded"}
                  date={this.props.object.date}
                  uploader={this.props.object.uploader}
                />
                <br />
                uploaded <FontAwesomeIcon icon="clock" />{" "}
                {this.props.object.date} by{" "}
                <Chip
                  size="small"
                  variant="outlined"
                  color="primary"
                  avatar={
                    <Avatar>{this.props.object.uploader.charAt(0)}</Avatar>
                  }
                  label={this.props.object.uploader}
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
                <Typography variant="h4" mb={6}>
                  Description
                </Typography>
                <div className="contentSection">
                  <ReactMarkdown source={this.props.object.description} />
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <CollapsibleDataTable
                  title={this.props.object.features.length + " Features"}
                  columns={featureTableColumns}
                  data={this.props.object.features}
                  rowrenderer={m => (
                    <FeatureDetail
                      key={"fd_" + m.name}
                      item={m}
                      type={m.type}
                    ></FeatureDetail>
                  )}
                  maxLength={7}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <CollapsibleDataTable
                  title={
                    Object.keys(this.props.object.qualities).length +
                    " Qualities"
                  }
                  data={Object.keys(this.props.object.qualities)}
                  rowrenderer={m => (
                    <QualityDetail
                      key={"q_" + m}
                      item={{ name: m, value: this.props.object.qualities[m] }}
                    />
                  )}
                  columns={qualityTableColumns}
                  maxLength={7}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={6}>
                  Tasks
                </Typography>
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
