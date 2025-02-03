import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CollapsibleDataTable } from "./sizeLimiter.js";
import { FeatureDetail, QualityDetail } from "./ItemDetail.js";
import { MainContext } from "../../App.js";
import { Icon } from '@iconify/react';
import { Helmet } from 'react-helmet';

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
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MetaTag } from "./MetaItems";

const UserChip = styled(Chip)`
  margin-bottom: 5px;
  margin-right: 5px;
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

const SERVER_URL = process.env.REACT_APP_URL_API || "https://www.openml.org/";
const MINIO_URL = process.env.REACT_APP_URL_MINIO || "https://data.openml.org/";

const CroissantComponent = ({ url }) => {
  const [jsonData, setJsonData] = useState({});

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setJsonData(data);
        } else {
          // Handle HTTP errors
          setJsonData({
            error: true,
            status: response.status,
            message: `HTTP error: ${response.status}`,
          });
        }
      } catch (error) {
        // Handle fetch errors
        setJsonData({
          error: true,
          message: error.message || 'Error fetching JSON.',
        });
      }
    };

    fetchJsonData();
  }, [url]);

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(jsonData)}
      </script>
    </Helmet>
  );
};

export class DatasetItem extends React.Component {
  constructor() {
    super();
    this.defaultFeatureListSizeLimit = 7;
    this.featureSizeLimit = this.defaultFeatureListSizeLimit;
  }
  render() {
    const featureTableColumns = [
      "",
      "Feature Name",
      "Type",
      "Distinct/Missing Values",
      "Ontology"
    ];
    const qualityTableColumns = ["", "Quality Name", "Value"];
    const did = this.props.object.data_id;
    const did_padded = did.toString().padStart(4, "0");
    const bucket_url = `${MINIO_URL}datasets/`;
    const bucket_bracket = Math.floor(did / 10000).toString().padStart(4, "0");
    const croissant_url = bucket_url + bucket_bracket + "/" + did_padded + "/dataset_" + did + "_croissant.json";
    return (
      <React.Fragment>
        <CroissantComponent url={croissant_url} />
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <MainContext.Consumer>
              {context => (
                <React.Fragment>                  
                  <Tooltip title="Download Croissant description" placement="bottom-start">
                    <ActionButton color="primary" href={croissant_url}>
                      <Action>
                        <Icon icon="fluent-emoji-high-contrast:croissant" />
                        <Typography>Croissant</Typography>
                      </Action>
                    </ActionButton>
                  </Tooltip>
                  <Tooltip title="Download XML description" placement="bottom-start">
                    <ActionButton color="primary" href={`${SERVER_URL}api/v1/data/` + this.props.object.data_id}>
                      <Action>
                        <FontAwesomeIcon icon="file-code" />
                        <Typography>xml</Typography>
                      </Action>
                    </ActionButton>
                  </Tooltip>
                  <Tooltip title="Download JSON description" placement="bottom-start">
                    <ActionButton color="primary" href={`${SERVER_URL}api/v1/json/data/` + this.props.object.data_id}>
                      <Action>
                        <FontAwesomeIcon icon="file-alt" />
                        <Typography>json</Typography>
                      </Action>
                    </ActionButton>
                  </Tooltip>
                  <Tooltip title="Download dataset" placement="bottom-start">
                    <ActionButton color="primary" href={this.props.object.url}>
                      <Action>
                        <FontAwesomeIcon icon="cloud-download-alt" />
                        <Typography>download</Typography>
                      </Action>
                    </ActionButton>
                  </Tooltip>
                  <Tooltip title="Edit dataset (requires login)" placement="bottom-start">
                    <ActionButton color={context.loggedIn ? "primary" : "default"} href={context.loggedIn ? "auth/data-edit?id=" + this.props.object.data_id : "auth/sign-in"}>
                      <Action>
                        <FontAwesomeIcon icon="edit" />
                        <Typography>edit</Typography>
                      </Action>
                    </ActionButton>
                  </Tooltip>
                </React.Fragment>
              )}
            </MainContext.Consumer>
            <Grid container>
              <Grid item md={12}>
                <Typography variant="h1" style={{ marginBottom: "15px" }}>
                  <FontAwesomeIcon icon="database" />
                  &nbsp;&nbsp;&nbsp;{this.props.object.name}
                </Typography>
              </Grid>
              <Grid item md={12}>
                <Grid container display="flex" spacing={2}>
                <Grid item><MetaTag type={"id"} value={"ID: " + this.props.object.data_id} /></Grid>
                <Grid item><MetaTag type={"status"} value={this.props.object.status === 'active' ? 'verified' : this.props.object.status}
                  color={this.props.object.status === 'active' ? 'green' : (this.props.object.status === 'deactivated' ? 'red' : 'orange')}/></Grid>
                <Grid item><MetaTag type={"format"} value={this.props.object.format} /></Grid>
                <Grid item><MetaTag type={"licence"} value={this.props.object.licence} /></Grid>
                <Grid item><FontAwesomeIcon icon="clock" />{" "}
                {this.props.object.date.split(" ")[0]}</Grid>
                <Grid item><MetaTag type={"version"} value={'v.' + this.props.object.version} /></Grid>
                <Grid item style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                
                { this.props.object.kaggle_url &&
                <Tooltip title="This dataset is also available on Kaggle. We integrate with Kaggle to give you the benefits of both platforms.">
                <UserChip
                  size="small"
                  variant="outlined"
                  color="primary"
                  avatar={
                    <Avatar><FontAwesomeIcon icon={["fab","kaggle"]} /></Avatar>
                  }
                  label="Find on Kaggle"
                  href={this.props.object.kaggle_url}
                  component="a"
                  clickable
                />
                </Tooltip>
                }

                <UserChip
                  size="small"
                  color="primary"
                  label="Version history"
                  avatar={
                    <Avatar><FontAwesomeIcon icon="clock" /></Avatar>
                  }
                  href={"search?type=data&sort=version&status=any&order=asc&exact_name=" + this.props.object.name}
                  component="a"
                  clickable
                /></Grid>
                </Grid>

                <Grid container display="flex" spacing={2}>
                <Grid item><UserChip
                  size="small"
                  variant="outlined"
                  color="primary"
                  avatar={
                    <Avatar>{this.props.object.uploader ? this.props.object.uploader.charAt(0) : "X"}</Avatar>
                  }
                  label={this.props.object.uploader}
                  href={"search?type=user&id=" + this.props.object.uploader_id}
                  component="a"
                  clickable
                /></Grid>
                <Grid item><MetaTag type={"likes"} value={this.props.object.nr_of_likes + " likes"} /></Grid>
                <Grid item><MetaTag
                  type={"issues"}
                  value={this.props.object.nr_of_issues + " issues"}
                /></Grid>
                <Grid item><MetaTag
                  type={"downloads"}
                  value={this.props.object.nr_of_downloads}
                /></Grid>
                </Grid>
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
                  <ReactMarkdown children={this.props.object.description} />
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
        </Grid>
      </React.Fragment>
    );
  }
}
