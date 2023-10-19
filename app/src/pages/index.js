import React from "react";
import { useTranslation } from "next-i18next";

import DashboardLayout from "../layouts/Dashboard";
import { Helmet } from "react-helmet-async";

import Integrations from "../components/pages/landing/Integrations";
import Lifecycle from "../components/pages/landing/Lifecycle";
import FAQ from "../components/pages/landing/FAQ";
import Wrapper from "../components/Wrapper";

import { Grid } from "@mui/material";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
export async function getStaticProps({ locale }) {
  return {
    props: {
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

// Avoids a (dev-only) hydration warning for the svg diagram
import dynamic from "next/dynamic";
const Introduction = dynamic(
  () => import("../components/pages/landing/Introduction"),
  { ssr: false }
);

function Presentation() {
  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  return (
    <Wrapper>
      <Helmet title={t("landing.helmet")} />
      <Grid container spacing={10}>
        <Grid item>
          <Introduction />
          <Lifecycle />
          <Integrations />
          <FAQ />
        </Grid>
      </Grid>
    </Wrapper>
  );
}

Presentation.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Presentation;
