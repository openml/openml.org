import React from "react";
import { Helmet } from "react-helmet-async";

import { Typography } from "@mui/material";

import DashboardLayout from "../../layouts/Dashboard";
import { getItem } from "../api/getItem";
import Wrapper from "../../components/Wrapper";
import CroissantMetaData from "../../components/data/CroissantMetaData";
import FeatureTable from "../../components/data/FeatureTable";
import QualityTable from "../../components/data/QualityTable";
import Property from "../../components/Property";

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
  faCheckCircle,
  faClock,
  faClosedCaptioning,
  faCloud,
  faCloudDownloadAlt,
  faCode,
  faCodeBranch,
  faDatabase,
  faEdit,
  faExclamationTriangle,
  faFileAlt,
  faHeart,
  faIdBadge,
  faTable,
  faTags,
  faTimes,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";

import ReactMarkdown from "react-markdown";
import { Tag } from "../../components/Tag";

export async function getStaticPaths() {
  // No paths are pre-rendered
  return { paths: [], fallback: "blocking" }; // or fallback: true, if you prefer
}

const ActionButton = styled(IconButton)`
  float: right;
  border-radius: 0;
`;

const TagChip = styled(Chip)`
  margin-bottom: 5px;
  margin-left: 5px;
`;

const Action = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const VersionChip = styled(Chip)`
  margin-bottom: 5px;
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
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

  // Action buttons
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

  // First row of dataset properties
  const dataProps1 = [
    { label: "id", value: "ID: " + data.data_id, icon: faIdBadge },
    {
      label: "version",
      value: "v." + data.version,
      icon: faCodeBranch,
    },
    {
      label: "status",
      value: data.status === "active" ? "verified" : data.status,
      color:
        data.status === "active"
          ? "green"
          : data.status === "deactivated"
          ? "red"
          : "orange",
      icon:
        data.status === "active"
          ? faCheckCircle
          : data.status === "deactivated"
          ? faTimes
          : faWrench,
    },
    {
      label: "format",
      value: data.format,
      icon: faTable,
    },
    {
      label: "licence",
      value: data.licence,
      icon: faClosedCaptioning,
    },
    {
      label: "date",
      value: data.date.split(" ")[0],
      icon: faClock,
    },
  ];

  const dataProps2 = [
    {
      label: "uploader",
      value: data.uploader,
      url: `/u/${data.uploader_id}`,
      avatar: <Avatar>{data.uploader ? data.uploader.charAt(0) : "X"}</Avatar>,
    },
    { label: "likes", value: data.nr_of_likes + " likes", icon: faHeart },
    {
      label: "issues",
      value: data.nr_of_issues + " issues",
      icon: faExclamationTriangle,
    },
    {
      label: "downloads",
      value: data.nr_of_downloads + " downloads",
      icon: faCloud,
    },
  ];

  return (
    <Wrapper>
      <Helmet title="OpenML Datasets" />
      <CroissantMetaData url={croissant_url} />
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ActionButtons buttons={buttonData} />
          <Grid container spacing={4}>
            <Grid item md={12}>
              <Typography variant="h1">
                <FontAwesomeIcon icon={faDatabase} />
                &nbsp;&nbsp;&nbsp;{data.name}
              </Typography>
            </Grid>

            <Grid item md={12}>
              <Grid container justifyContent="space-between" spacing={2}>
                {/* Left-aligned Properties */}
                <Grid item>
                  {dataProps1.map((tag) => (
                    <Property key={tag.label} {...tag} />
                  ))}
                </Grid>

                {/* Right-aligned Version Chip */}
                <Grid item>
                  <VersionChip
                    size="small"
                    color="primary"
                    label="Version history"
                    avatar={
                      <Avatar>
                        <FontAwesomeIcon icon={faClock} />
                      </Avatar>
                    }
                    href={`search?type=data&sort=version&status=any&order=asc&exact_name=${data.name}`}
                    component="a"
                    clickable
                  />
                </Grid>
              </Grid>

              {/* User Chip and Second Row of Properties */}
              <Grid container spacing={2}>
                <Grid item>
                  {dataProps2.map((tag) => (
                    <Property key={tag.label} {...tag} />
                  ))}
                </Grid>
              </Grid>

              {/* Tags */}
              <Grid container spacing={2} pt={1}>
                <Grid item md={12}>
                  <FontAwesomeIcon icon={faTags} />
                  {data.tags.map((tag) => (
                    <Tag key={tag.tag} tag={tag.tag} />
                  ))}
                </Grid>
              </Grid>
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
