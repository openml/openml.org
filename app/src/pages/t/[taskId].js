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

function Task() {
  const router = useRouter();
  const taskId = router.query.taskId;
  return (
    <React.Fragment>
      <Helmet title="OpenML Runs" />
      <Typography variant="h3" gutterBottom>
        Task {taskId}
      </Typography>
    </React.Fragment>
  );
}

Task.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Task;
