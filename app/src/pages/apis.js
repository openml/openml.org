import React from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";

import DashboardLayout from "../layouts/Dashboard";

import { Typography as MuiTypography } from "@mui/material";
import { spacing } from "@mui/system";

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

const Typography = styled(MuiTypography)(spacing);

function APIs() {
  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  return (
    <React.Fragment>
      <Helmet title="Projects" />

      <Typography variant="h3" gutterBottom display="inline">
        APIs
      </Typography>
    </React.Fragment>
  );
}

APIs.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default APIs;
