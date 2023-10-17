import { useRouter } from "next/router";
import React from "react";
import { Helmet } from "react-helmet-async";

import { Typography } from "@mui/material";

import DashboardLayout from "../../layouts/Dashboard";

function Dataset() {
  const router = useRouter();
  const dataId = router.query.dataId;
  return (
    <React.Fragment>
      <Helmet title="OpenML Datasets" />
      <Typography variant="h3" gutterBottom>
        Dataset {dataId}
      </Typography>
    </React.Fragment>
  );
}

Dataset.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dataset;