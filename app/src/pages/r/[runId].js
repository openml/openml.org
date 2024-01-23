import { useRouter } from "next/router";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";
import DashboardLayout from "../../layouts/Dashboard";
import { useTheme } from "@mui/system";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getItem } from "../api/getItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCloudArrowDown,
  faCogs,
  faDatabase,
  faExclamationTriangle,
  faEye,
  faHeart,
  faIdBadge,
  faStar,
  faTags,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { CollapsibleDataTable } from "../api/sizeLimiter";
import { EvaluationDetail, FlowDetail } from "../api/itemDetail";
import Wrapper from "../../components/Wrapper";
import Property from "../../components/Property";
import Tag from "../../components/Tag";
import { shortenName } from "../../components/search/flowCard";

import { blue, green, yellow } from "@mui/material/colors";

export async function getStaticPaths() {
  // No paths are pre-rendered
  return { paths: [], fallback: "blocking" }; // or fallback: true, if you prefer
}

export async function getStaticProps({ params, locale }) {
  // Fetch necessary data for the dataset page using params.dataId
  const data = await getItem("run", params.runId);
  return {
    props: {
      data,
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

function Run({ data }) {
  const theme = useTheme();
  const router = useRouter();
  const runId = router.query.runId;
  let flowCols = ["Parameter", "Value"];
  let evaluationMeasureCols = ["Evaluation Measure", "Value", ""];
  var evaluations = [];
  if (data.evaluations) {
    for (let i = 0; i < data.evaluations.length; i++) {
      if (data.evaluations[i].value != null) {
        evaluations.push(data.evaluations[i]);
      }
    }
  }

  const runProps1 = [
    { label: "Run ID", value: "ID: " + data.run_id, icon: faIdBadge },
    {
      label: "Run task",
      value: data.run_task.tasktype.name,
      icon: faTrophy,
      color: yellow[800],
      url: "/t/" + data.run_task.task_id,
    },
    {
      label: "Run data",
      value: data.run_task.source_data.name,
      icon: faDatabase,
      color: green[500],
      url: "/d/" + data.run_task.source_data.data_id,
    },
    {
      label: "Run flow",
      value: shortenName(data.run_flow.name).substring(0, 20) + "...",
      icon: faCogs,
      color: blue[500],
      url: "/f/" + data.run_flow.flow_id,
    },
    { label: "Run visibility", value: data.visibility, icon: faEye },
    {
      label: "Run date",
      value: data.date.split(" ")[0],
      icon: faClock,
    },
  ];

  const runProps2 = [
    {
      label: "Run uploader",
      value: data.uploader,
      url: `/u/${data.uploader_id}`,
      avatar: <Avatar>{data.uploader ? data.uploader.charAt(0) : "X"}</Avatar>,
    },
    {
      label: "Run likes",
      value: data.nr_of_likes + " likes",
      icon: faHeart,
    },
    {
      label: "Run issues",
      value: data.nr_of_issues + " issues",
      icon: faExclamationTriangle,
    },
    {
      label: "Run downloads",
      value: data.nr_of_downloads + " downloads",
      icon: faCloudArrowDown,
    },
  ];

  //parameter with the same names result in FlowDetail objects with the same keys,counter is used to prevent it
  var parameterID = 0;
  //ID counter for evaluations
  var evaluationID = 0;
  return (
    <Wrapper>
      <Helmet title="OpenML Runs" />
      <React.Fragment>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container style={{ padding: "25px 0" }}>
              <Grid item md={12}>
                <Typography variant={"h1"} style={{ marginBottom: "15px" }}>
                  <FontAwesomeIcon
                    icon={faStar}
                    color={theme.palette.entity["r"]}
                  />
                  &nbsp;&nbsp; Run {data.run_id}
                </Typography>
              </Grid>
              <Grid item md={12}>
                <Grid container justifyContent="space-between" spacing={2}>
                  {/* Left-aligned Properties */}
                  <Grid item>
                    {runProps1.map((tag) => (
                      <Property key={tag.label} {...tag} />
                    ))}
                  </Grid>
                </Grid>

                {/* User Chip and Second Row of Properties */}
                <Grid container spacing={2}>
                  <Grid item>
                    {runProps2.map((tag) => (
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
                <Typography variant={"h4"}>Flow</Typography>
                <br />
                <span style={{ wordWrap: "break-word" }}>
                  {data.run_flow.name}
                </span>
                <CollapsibleDataTable
                  data={data.run_flow.parameters}
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
                    data.run_task.estimation_procedure.name +
                    ")"
                  }
                  data={evaluations}
                  rowrenderer={(m) => (
                    <EvaluationDetail
                      key={evaluationID++}
                      item={m}
                      target_values={data.run_task.target_values}
                      estimationProcedure={data.run_task.name}
                    />
                  )}
                  maxLength={7}
                  columns={evaluationMeasureCols}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    </Wrapper>
  );
}

Run.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Run;
