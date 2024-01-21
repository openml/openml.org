import { useRouter } from "next/router";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import DashboardLayout from "../../layouts/Dashboard";
import { useTheme } from "@mui/system";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getItem } from "../api/getItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTags, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { MetaTag } from "../../components/MetaItems";
import { CollapsibleDataTable } from "../api/sizeLimiter";
import { EvaluationDetail, FlowDetail, TagChip } from "../api/itemDetail";
import Wrapper from "../../components/Wrapper";

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
                <MetaTag type={"task"} value={data.run_task.task_id} />
                <MetaTag
                  type={"dataset"}
                  value={data.run_task.source_data.name}
                />
                <MetaTag type={"status"} value={data.visibility} />
                <MetaTag
                  type={"uploaded"}
                  date={data.date}
                  uploader={data.uploader}
                />
                <br />
                <MetaTag type={"likes"} value={data.nr_of_likes} />
                <MetaTag type={"issues"} value={data.nr_of_issues} />
                <MetaTag type={"downvotes"} value={data.nr_of_downvotes} />
                <MetaTag type={"downloads"} value={data.nr_of_downloads} />
              </Grid>
            </Grid>
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
