import { useRouter } from "next/router";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Typography } from "@mui/material";
import DashboardLayout from "../../layouts/Dashboard";
import styled from "@emotion/styled";
// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getItem } from "../api/getItem";
import { faClock, faTags, faTrophy } from "@fortawesome/free-solid-svg-icons";

import { Card, CardContent, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { MetaTag } from "../../components/MetaItems"
import { Table, TableBody, TableRow, TableCell, Link as MuiLink} from "@mui/material";
import { green } from "@mui/material/colors";


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

const SimpleLink = styled(MuiLink)`
  text-decoration: none;
  padding-right: 1px;
  font-weight: 800;
  color: ${green[500]};
`;

function Task({ data }) {
  const router = useRouter();
  const taskId = router.query.taskId;
  
  const taskDescription = [
    { name: "Task ID", value: data.task_id},
    { name: "Task Type", value: data.tasktype.name},
    { name: "Source Data", value: data.source_data.name},
    { name: "Target Feature", value: data.target_feature},
    { name: "Estimation Procedure", value: (data.estimation_procedure ? data.estimation_procedure.name : undefined)}
  ];
  return (
    <React.Fragment>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid container style={{ "padding": "25px 0" }}>
            <Grid item md={12}>
              <Typography variant="h1" className={"sectionTitle"} style={{ "marginBottom": "15px" }}>
                <FontAwesomeIcon icon={faTrophy} />{" "}
                {data.tasktype.name} on{" "}
                {data.source_data.name}{" "}
              </Typography>
            </Grid>
            <Grid item md={12}>
              <MetaTag type={"task"} value={data.task_id} />
              <MetaTag type={"task-type"} value={data.tasktype.name} />
              <SimpleLink href={"search?type=data&id=" + data.source_data.data_id}><MetaTag type={"dataset"} value={data.source_data.name} /></SimpleLink>
              created <FontAwesomeIcon icon={faClock} />{" "}{data.date}<br />
              <MetaTag type={"likes"} value={data.nr_of_likes} />
              <MetaTag type={"issues"} value={data.nr_of_issues} />
              <MetaTag type={"downvotes"} value={data.nr_of_downvotes} />
              <MetaTag type={"downloads"} value={data.nr_of_downloads} />
              <MetaTag type={"runs"} value={data.runs} />
              {/* {" "}by{" "} <Grid item md={2} ><MetaDownvotes value={data.downvotes} /></Grid> */}
            </Grid>
          </Grid>
          {data.tags[0] !== undefined && data.tags[0].length > 0 && (
            <Grid container>
              <Grid item md={12}><FontAwesomeIcon icon={faTags} />{" "}{data.tags}</Grid>
            </Grid>)}
        </Grid>

        <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h4" mb={6}>Details</Typography>
                <Table>
                  <TableBody>
                    {taskDescription.map(x => (
                      <TableRow  key={"row_"+x.name}>
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
  );
}

Task.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Task;
