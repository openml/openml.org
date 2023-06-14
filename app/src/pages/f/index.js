import React from "react";
import { Helmet } from "react-helmet-async";

import { Typography } from "@mui/material";

import DashboardLayout from "../../layouts/Dashboard";
import TableView from "../../components/TableView";

function FlowList() {
  return (
    <React.Fragment>
      <Helmet title="OpenML Flows" />
      <Typography variant="h3" gutterBottom>
        Flows
      </Typography>

      <TableView />
    </React.Fragment>
  );
}

FlowList.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default FlowList;
