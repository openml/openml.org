import React from "react";
import { Helmet } from "react-helmet-async";

import { Typography } from "@mui/material";

import DashboardLayout from "../../layouts/Dashboard";
import TableView from "../../components/TableView";

function DatasetList() {
  return (
    <React.Fragment>
      <Helmet title="OpenML Datasets" />
      <Typography variant="h3" gutterBottom>
        Model evaluations
      </Typography>

      <TableView />
    </React.Fragment>
  );
}

DatasetList.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DatasetList;
