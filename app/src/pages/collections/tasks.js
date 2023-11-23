import React from "react";
import { Helmet } from "react-helmet-async";
import { Typography } from "@mui/material";
import DashboardLayout from "../../layouts/Dashboard";

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

function TaskCollectionList() {
  return (
    <React.Fragment>
      <Helmet title="OpenML Collections" />
      <Typography variant="h3" gutterBottom>
        Task collections
      </Typography>
    </React.Fragment>
  );
}

TaskCollectionList.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default TaskCollectionList;
