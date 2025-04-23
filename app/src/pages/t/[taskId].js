import React from "react";
import { Helmet } from "react-helmet-async";
import { Typography } from "@mui/material";
import DashboardLayout from "../../layouts/Dashboard";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getItem } from "../api/getItem";
import {
  faClock,
  faCloudArrowDown,
  faDatabase,
  faExclamationTriangle,
  faFlag,
  faHeart,
  faIdBadge,
  faStar,
  faTags,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

import { Card, CardContent, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Table, TableBody, TableRow, TableCell } from "@mui/material";
import { green } from "@mui/material/colors";
import Wrapper from "../../components/Wrapper";
import Property from "../../components/Property";
import { useTheme } from "@mui/system";
import Tag from "../../components/Tag";

export async function getStaticPaths() {
  // No paths are pre-rendered
  return { paths: [], fallback: "blocking" }; // or fallback: true, if you prefer
}

export async function getStaticProps({ params, locale }) {
  let data = null;
  let error = null;

  try {
    data = await getItem("task", params.taskId);
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    error = "Server is not responding.";
  }

  const translations = await serverSideTranslations(locale);

  return {
    props: {
      data,
      error,
      ...translations,
    },
  };
}

function Task({ data }) {
  const theme = useTheme();

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
    { label: "Task ID", value: "ID: " + data.task_id, icon: faIdBadge },
    {
      label: "Task source",
      value: data.source_data.name,
      icon: faDatabase,
      color: green[500],
      url: "/d/" + data.source_data.data_id,
    },
    { label: "Task type", value: data.tasktype.name, icon: faFlag },
    {
      label: "Task date",
      value: data.date.split(" ")[0],
      icon: faClock,
    },
  ];

  const dataProps2 = [
    { label: "Task likes", value: data.nr_of_likes, icon: faHeart },
    {
      label: "Task issues",
      value: data.nr_of_issues,
      icon: faExclamationTriangle,
    },
    {
      label: "Task downloads",
      value: data.nr_of_downloads,
      icon: faCloudArrowDown,
    },
    { label: "Task runs", value: data.runs, icon: faStar },
  ];

  return (
    <Wrapper>
      <Helmet title="OpenML Tasks" />
      <React.Fragment>
        <Grid container spacing={6}>
          <Grid size={12}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography
                  variant="h1"
                  className={"sectionTitle"}
                  style={{ marginBottom: "15px" }}
                >
                  <FontAwesomeIcon
                    icon={faTrophy}
                    color={theme.palette.entity["t"]}
                  />{" "}
                  {data.tasktype.name} on {data.source_data.name}{" "}
                </Typography>
              </Grid>
              <Grid
                size={{
                  md: 12
                }}>
                <Grid container justifyContent="space-between" spacing={2}>
                  <Grid>
                    {dataProps1.map((tag) => (
                      <Property key={tag.label} {...tag} />
                    ))}
                  </Grid>
                </Grid>
                <Grid container justifyContent="space-between" spacing={2}>
                  <Grid>
                    {dataProps2.map((tag) => (
                      <Property key={tag.label} {...tag} />
                    ))}
                  </Grid>
                </Grid>
                {/* Tags */}
                <Grid container spacing={2} pt={1}>
                  <Grid
                    size={{
                      md: 12
                    }}>
                    <FontAwesomeIcon icon={faTags} />
                    {data.tags.map((tag, index) => (
                      <Tag
                        key={`${tag.tag}-${index}`}
                        tag={tag.tag.startsWith("study") ? "" : tag.tag}
                      />
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid size={12}>
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
