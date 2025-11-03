import React from "react";
import Head from "next/head";
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

function EvaluationProcedureList() {
  return (
    <>
      <Head>
      <Typography variant="h3" gutterBottom>
        Test procedures
      </Typography>
    </>
  );
}

EvaluationProcedureList.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default EvaluationProcedureList;
