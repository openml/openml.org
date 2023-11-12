import { useRouter } from "next/router";
import React from "react";
import { Helmet } from "react-helmet-async";

import { Typography } from "@mui/material";

import DashboardLayout from "../../layouts/Dashboard";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticPaths() {
  // No paths are pre-rendered
  return { paths: [], fallback: "blocking" }; // or fallback: true, if you prefer
}

export async function getStaticProps({ params, locale }) {
  // Fetch necessary data for the dataset page using params.dataId
  return {
    props: {
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

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
