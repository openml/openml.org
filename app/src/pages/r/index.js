import React from "react";
import { Helmet } from "react-helmet-async";

import { Typography } from "@mui/material";

import DashboardLayout from "../../layouts/Dashboard";
import TableView from "../../components/TableView";

function RunList() {
  return (
    <React.Fragment>
      <Helmet title="OpenML Runs" />
      <Typography variant="h3" gutterBottom>
        Runs
      </Typography>

      <TableView />
    </React.Fragment>
  );
}

RunList.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default RunList;
