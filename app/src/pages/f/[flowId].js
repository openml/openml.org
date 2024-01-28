import React from "react";
import { Helmet } from "react-helmet-async";
import { Avatar, Tooltip, Typography } from "@mui/material";
import DashboardLayout from "../../layouts/Dashboard";
import { useTheme } from "@mui/system";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getItem } from "../api/getItem";
import { shortenName } from "../../components/search/flowCard";

import { Card, CardContent, Grid } from "@mui/material";
import ReactMarkdown from "react-markdown";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCloudArrowDown,
  faCogs,
  faExclamationTriangle,
  faEye,
  faHeart,
  faStar,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import Wrapper from "../../components/Wrapper";
import DependencyTable from "../../components/flow/DependencyTable";
import ParameterTable from "../../components/flow/ParameterTable";
import Tag from "../../components/Tag";
import Property from "../../components/Property";

export async function getStaticPaths() {
  // No paths are pre-rendered
  return { paths: [], fallback: "blocking" }; // or fallback: true, if you prefer
}

export async function getStaticProps({ params, locale }) {
  // Fetch necessary data for the flow page using params.flowId
  const data = await getItem("flow", params.flowId);

  return {
    props: {
      data,
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

function prettyPrint(str) {
  let result = "";
  let indentLevel = 0;
  const indentSize = 2; // Number of spaces for each indentation level

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === "(") {
      indentLevel++;
      result += char + "\n" + " ".repeat(indentLevel * indentSize);
    } else if (char === ")") {
      indentLevel--;
      result += "\n" + " ".repeat(indentLevel * indentSize) + char;
    } else if (char === ",") {
      result += char + "\n" + " ".repeat(indentLevel * indentSize);
    } else {
      result += char;
    }
  }

  return result;
}

function Flow({ data }) {
  const theme = useTheme();

  const flowProps1 = [
    {
      label: "Flow uploader",
      value: data.uploader,
      url: `/u/${data.uploader_id}`,
      avatar: <Avatar>{data.uploader ? data.uploader.charAt(0) : "X"}</Avatar>,
    },
    {
      label: "Flow visibility",
      value: data.visibility,
      icon: faEye,
    },
    {
      label: "Flow date",
      value: data.date.split(" ")[0],
      icon: faClock,
    },
  ];

  const flowProps2 = [
    {
      label: "Flow likes",
      value: data.nr_of_likes,
      icon: faHeart,
    },
    {
      label: "Flow issues",
      value: data.nr_of_issues,
      icon: faExclamationTriangle,
    },
    {
      label: "Flow downloads",
      value: data.nr_of_downloads,
      icon: faCloudArrowDown,
    },
    {
      label: "Flow runs",
      value: data.runs,
      icon: faStar,
    },
  ];

  return (
    <Wrapper>
      <Helmet title="OpenML Flows" />
      <React.Fragment>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container style={{ padding: "25px 0" }}>
              <Grid item xs={12}>
                <Tooltip title={data.name}>
                  <Typography
                    variant={"h1"}
                    style={{ marginBottom: "15px", wordWrap: "break-word" }}
                  >
                    <FontAwesomeIcon
                      icon={faCogs}
                      color={theme.palette.entity["f"]}
                    />
                    &nbsp;&nbsp; {shortenName(data.name)}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item md={12}>
                <Grid container justifyContent="space-between" spacing={2}>
                  {/* Left-aligned Properties */}
                  <Grid item>
                    {flowProps1.map((tag) => (
                      <Property key={tag.label} {...tag} />
                    ))}
                  </Grid>
                </Grid>

                {/* User Chip and Second Row of Properties */}
                <Grid container spacing={2}>
                  <Grid item>
                    {flowProps2.map((tag) => (
                      <Property key={tag.label} {...tag} />
                    ))}
                  </Grid>
                </Grid>

                {/* Tags */}
                <Grid container spacing={2} pt={1}>
                  <Grid item md={12}>
                    <FontAwesomeIcon icon={faTags} />
                    {data.tags.map((tag, index) => (
                      <Tag key={`${tag.tag}-${index}`} tag={tag.tag} />
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant={"h4"}>Description</Typography>
                <ReactMarkdown>{data.description}</ReactMarkdown>
                <pre>{prettyPrint(data.name)}</pre>
              </CardContent>
            </Card>
          </Grid>

          {/* Dependency and Parameter tables */}
          <Grid item xs={12}>
            <DependencyTable data={data.dependencies} />
          </Grid>
          <Grid item xs={12}>
            <ParameterTable data={data.parameters} />
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant={"h4"}>Runs ({data.runs})</Typography>
                <br />
                Run visualization not currently supported
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    </Wrapper>
  );
}

Flow.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Flow;
