import React from "react";
import { Helmet } from "react-helmet-async";

import { Typography } from "@mui/material";

import DashboardLayout from "../../layouts/Dashboard";
import TableView from "../../components/TableView";

// Server-side translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
export async function getStaticProps({ locale }) {
  return {
    props: {
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

function DatasetList() {
  return (
    <React.Fragment>
      <Helmet title="OpenML Datasets" />
      <Typography variant="h3" gutterBottom>
        Data qualities
      </Typography>

      <TableView />
    </React.Fragment>
  );
}

DatasetList.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DatasetList;
