import React from "react";
import { Helmet } from "react-helmet-async";

import { Typography } from "@mui/material";

import DashboardLayout from "../../layouts/Dashboard";
import TableView from "../../components/TableView";

function TaskList() {
  return (
    <React.Fragment>
      <Helmet title="OpenML Tasks" />
      <Typography variant="h3" gutterBottom>
        Tasks
      </Typography>

      <TableView />
    </React.Fragment>
  );
}

TaskList.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default TaskList;
