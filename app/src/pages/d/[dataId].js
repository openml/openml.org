import React from "react";
import { Helmet } from "react-helmet-async";

import { Typography } from "@mui/material";

import DashboardLayout from "../../layouts/Dashboard";
import { getItem } from "../api/getItem";
import Wrapper from "../../components/Wrapper";
import CroissantMetaData from "../../components/pages/data/CroissantMetaData";
import FeatureTable from "../../components/pages/data/FeatureTable";
import QualityTable from "../../components/pages/data/QualityTable";

import styled from "@emotion/styled";
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  faClock,
  faCloudDownloadAlt,
  faCode,
  faDatabase,
  faEdit,
  faFileAlt,
  faTags,
} from "@fortawesome/free-solid-svg-icons";

import { MetaTag } from "../../components/MetaItems";
import ReactMarkdown from "react-markdown";

import { updateTag, TagChip } from "../api/itemDetail";
export async function getStaticPaths() {
  // No paths are pre-rendered
  return { paths: [], fallback: "blocking" }; // or fallback: true, if you prefer
}

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

const UserChip = styled(Chip)`
  margin-bottom: 5px;
`;

// Loads the information about the dataset from ElasticSearch
// Also loads the translations for the page
export async function getStaticProps({ params, locale }) {
  try {
    // Fetch necessary data for the dataset page using params.dataId
    const data = await getItem("data", params.dataId);

    return {
      props: {
        data,
        error: null, // No error occurred
        ...(await serverSideTranslations(locale)),
      },
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);

    return {
      props: {
        data: null, // No data due to error
        error: "Server is not responding.",
        ...(await serverSideTranslations(locale)),
      },
    };
  }
}

const ActionButtons = ({ buttons }) => {
  return (
    <>
      {buttons.map((button, index) => (
        <Tooltip
          key={index}
          title={button.tooltipTitle}
          placement="bottom-start"
        >
          <ActionButton color="primary" href={button.url || button.getUrl()}>
            <Action>
              {button.icon}
              <Typography>{button.label}</Typography>
            </Action>
          </ActionButton>
        </Tooltip>
      ))}
    </>
  );
};

function Dataset({ data, error }) {
  const did = data.data_id;
  const did_padded = did.toString().padStart(4, "0");
  const bucket_url = "https://openml1.win.tue.nl/datasets/";
  const bucket_bracket = Math.floor(did / 10000)
    .toString()
    .padStart(4, "0");
  const croissant_url =
    bucket_url +
    bucket_bracket +
    "/" +
    did_padded +
    "/dataset_" +
    did +
    "_croissant.json";

  if (error) {
    return <div>Error: {error}</div>;
  }

  // TODO: update with actual login status
  const loggedIn = true;

  const buttonData = [
    {
      tooltipTitle: "Download Croissant description",
      url: croissant_url,
      icon: <Icon icon="fluent-emoji-high-contrast:croissant" />,
      label: "Croissant",
    },
    {
      tooltipTitle: "Download XML description",
      url: `https://www.openml.org/api/v1/data/${data.data_id}`,
      icon: <FontAwesomeIcon icon={faCode} />,
      label: "xml",
    },
    {
      tooltipTitle: "Download JSON description",
      url: `https://www.openml.org/api/v1/json/data/${data.data_id}`,
      icon: <FontAwesomeIcon icon={faFileAlt} />,
      label: "json",
    },
    {
      tooltipTitle: "Download dataset",
      url: data.url,
      icon: <FontAwesomeIcon icon={faCloudDownloadAlt} />,
      label: "download",
    },
    {
      tooltipTitle: "Edit dataset (requires login)",
      getUrl: () =>
        loggedIn ? `auth/data-edit?id=${data.data_id}` : "auth/sign-in",
      getColor: () => (loggedIn ? "primary" : "default"),
      icon: <FontAwesomeIcon icon={faEdit} />,
      label: "edit",
    },
  ];

  return (
    <Wrapper>
      <Helmet title="OpenML Datasets" />
      <CroissantMetaData url={croissant_url} />
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ActionButtons buttons={buttonData} />
          <Grid container>
            <Grid item md={12}>
              <Typography variant="h1" style={{ marginBottom: "15px" }}>
                <FontAwesomeIcon icon={faDatabase} />
                &nbsp;&nbsp;&nbsp;{data.name}
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Grid container display="flex" spacing={2}>
                <Grid item>
                  <MetaTag type={"id"} value={"ID: " + data.data_id} />
                </Grid>
                <Grid item>
                  <MetaTag
                    type={"status"}
                    value={data.status === "active" ? "verified" : data.status}
                    color={
                      data.status === "active"
                        ? "green"
                        : data.status === "deactivated"
                        ? "red"
                        : "orange"
                    }
                  />
                </Grid>
                <Grid item>
                  <MetaTag type={"format"} value={data.format} />
                </Grid>
                <Grid item>
                  <MetaTag type={"licence"} value={data.licence} />
                </Grid>
                <Grid item>
                  <FontAwesomeIcon icon={faClock} /> {data.date.split(" ")[0]}
                </Grid>
                <Grid item>
                  <MetaTag type={"version"} value={"v." + data.version} />
                </Grid>
                <Grid
                  item
                  style={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <UserChip
                    size="small"
                    color="primary"
                    label="Version history"
                    avatar={
                      <Avatar>
                        <FontAwesomeIcon icon={faClock} />
                      </Avatar>
                    }
                    href={
                      "search?type=data&sort=version&status=any&order=asc&exact_name=" +
                      data.name
                    }
                    component="a"
                    clickable
                  />
                </Grid>
              </Grid>

              <Grid container display="flex" spacing={2}>
                <Grid item>
                  <UserChip
                    size="small"
                    variant="outlined"
                    color="primary"
                    avatar={
                      <Avatar>
                        {data.uploader ? data.uploader.charAt(0) : "X"}
                      </Avatar>
                    }
                    label={data.uploader}
                    href={"search?type=user&id=" + data.uploader_id}
                    component="a"
                    clickable
                  />
                </Grid>
                <Grid item>
                  <MetaTag type={"likes"} value={data.nr_of_likes + " likes"} />
                </Grid>
                <Grid item>
                  <MetaTag
                    type={"issues"}
                    value={data.nr_of_issues + " issues"}
                  />
                </Grid>
                <Grid item>
                  <MetaTag type={"downloads"} value={data.nr_of_downloads} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Tags */}
          <Grid container>
            <Grid item md={12}>
              <FontAwesomeIcon icon={faTags} />{" "}
              {data.tags.map((element) =>
                element.tag.toString().startsWith("study") ? (
                  ""
                ) : (
                  <TagChip
                    key={"tag_" + element.tag}
                    label={"  " + element.tag + "  "}
                    size="small"
                    onClick={() => updateTag(element.tag)}
                  />
                ),
              )}
            </Grid>
          </Grid>
        </Grid>
        {/* Description */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h4" mb={6}>
                Description
              </Typography>
              <div className="contentSection">
                <ReactMarkdown>{data.description}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Feature and Quality tables */}
        <Grid item xs={12}>
          <FeatureTable data={data.features} />
        </Grid>
        <Grid item xs={12}>
          <QualityTable data={data.qualities} />
        </Grid>
      </Grid>
    </Wrapper>
  );
}

Dataset.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dataset;
