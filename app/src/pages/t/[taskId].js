import { useRouter } from "next/router";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Typography } from "@mui/material";
import DashboardLayout from "../../layouts/Dashboard";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getItem } from "../api/getItem";
import {
  faClock,
  faCloud,
  faDatabase,
  faExclamationTriangle,
  faFlag,
  faHeart,
  faStar,
  faTags,
  faThumbsDown,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

import { Card, CardContent, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Link as MuiLink,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { updateTag, TagChip } from "../api/itemDetail";
import Wrapper from "../../components/Wrapper";
import Property from "../../components/Property";

export async function getStaticPaths() {
  // No paths are pre-rendered
  return { paths: [], fallback: "blocking" }; // or fallback: true, if you prefer
}

export async function getStaticProps({ params, locale }) {
  // Fetch necessary data for the task page using params.dataId
  const data = await getItem("task", params.taskId);
  return {
    props: {
      data,
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

function Task({ data }) {
  const router = useRouter();
  const taskId = router.query.taskId;

  const taskDescription = [
    { name: "Task ID", value: data.task_id },
    { name: "Task Type", value: data.tasktype.name },
    { name: "Source Data", value: data.source_data.name },
    { name: "Target Feature", value: data.target_feature },
    {
      name: "Estimation Procedure",
      value: data.estimation_procedure
        ? data.estimation_procedure.name
        : undefined,
    },
  ];

  const dataProps1 = [
    { label: "task", value: data.task_id, icon: faTrophy },
    {
      label: "dataset",
      value: data.source_data.name,
      icon: faDatabase,
      color: green[500],
      url: "/d/" + data.source_data.data_id,
    },
    { label: "task-type", value: data.tasktype.name, icon: faFlag },
    {
      label: "date",
      value: data.date.split(" ")[0],
      icon: faClock,
    },
  ];

  const dataProps2 = [
    { label: "likes", value: data.nr_of_likes, icon: faHeart },
    { label: "issues", value: data.nr_of_issues, icon: faExclamationTriangle },
    { label: "downvotes", value: data.nr_of_downvotes, icon: faThumbsDown },
    { label: "downloads", value: data.nr_of_downloads, icon: faCloud },
    { label: "runs", value: data.runs, icon: faStar },
  ];

  return (
    <Wrapper>
      <Helmet title="OpenML Tasks" />
      <React.Fragment>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container style={{ padding: "25px 0" }}>
              <Grid item md={12}>
                <Typography
                  variant="h1"
                  className={"sectionTitle"}
                  style={{ marginBottom: "15px" }}
                >
                  <FontAwesomeIcon icon={faTrophy} /> {data.tasktype.name} on{" "}
                  {data.source_data.name}{" "}
                </Typography>
              </Grid>
              <Grid item md={12}>
                <Grid container justifyContent="space-between" spacing={2}>
                  <Grid item>
                    {dataProps1.map((tag) => (
                      <Property key={tag.label} {...tag} />
                    ))}
                  </Grid>
                </Grid>
                <Grid container justifyContent="space-between" spacing={2}>
                  <Grid item>
                    {dataProps2.map((tag) => (
                      <Property key={tag.label} {...tag} />
                    ))}
                  </Grid>
                </Grid>
                {data.tags[0]?.tag !== undefined &&
                  data.tags[0].tag.length > 0 && (
                    <Grid container>
                      <Grid item md={12}>
                        <FontAwesomeIcon icon={faTags} />
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
                  )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h4" mb={6}>
                  Details
                </Typography>
                <Table>
                  <TableBody>
                    {taskDescription.map((x) => (
                      <TableRow key={"row_" + x.name}>
                        <TableCell>{x.name}</TableCell>
                        <TableCell>{x.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    </Wrapper>
  );
}

Task.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Task;
