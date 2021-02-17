import React from "react";
import styled from "styled-components";
import { CollapsibleDataTable } from "./sizeLimiter.js";
import { FeatureDetail, QualityDetail } from "./ItemDetail.js";

import ReactMarkdown from "react-markdown";
import {
  Chip,
  Avatar,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Tooltip
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MetaTag } from "./MetaItems";

const UserChip = styled(Chip)`
  margin-bottom: 5px;
`;

const ActionButton = styled(IconButton)`
  float: right;
  border-radius: 0;
`;

const Action = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

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
          <ActionButton href={"https://www.openml.org/api/v1/data/" + this.props.object.data_id}>
              <Action>
                <FontAwesomeIcon icon="file-alt" />
                <Typography>xml</Typography>
              </Action>
            </ActionButton>
            <ActionButton href={"https://www.openml.org/api/v1/json/data/" + this.props.object.data_id}>
              <Action>
                <FontAwesomeIcon icon="file-alt" />
                <Typography>json</Typography>
              </Action>
            </ActionButton>
            <ActionButton href={"auth/data-edit?id="+this.props.object.data_id}>
              <Action>
                <FontAwesomeIcon icon="edit" />
                <Typography>edit</Typography>
              </Action>
            </ActionButton>
            <ActionButton href={this.props.object.url}>
              <Action>
                <FontAwesomeIcon icon="cloud-download-alt" />
                <Typography>download</Typography>
              </Action>
            </ActionButton>
            <Grid container>
              <Grid item md={12}>
                <Typography variant="h1" style={{ marginBottom: "15px" }}>
                  <FontAwesomeIcon icon="database" />
                  &nbsp;&nbsp;&nbsp;{this.props.object.name}
                </Typography>
              </Grid>
              <Grid item md={12}>
                <MetaTag type={"id"} value={this.props.object.data_id} />
                <MetaTag type={"status"} value={this.props.object.status} />
                <MetaTag type={"format"} value={this.props.object.format} />
                <MetaTag type={"licence"} value={this.props.object.licence} />
                <FontAwesomeIcon icon="clock" />{" "}
                {this.props.object.date.split(" ")[0]}
                <br />
                <UserChip
                  size="small"
                  variant="outlined"
                  color="primary"
                  avatar={
                    <Avatar>{this.props.object.uploader.charAt(0)}</Avatar>
                  }
                  label={this.props.object.uploader}
                  href={"search?type=user&id="+ this.props.object.uploader_id}
                  component="a"
                  clickable
                />{" "}
                <MetaTag type={"likes"} value={this.props.object.nr_of_likes + " likes"} />
                <MetaTag
                  type={"issues"}
                  value={this.props.object.nr_of_issues + " issues"}
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
