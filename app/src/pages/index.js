import React from "react";
import Head from "next/head";
import { useTranslation } from "next-i18next";

import DashboardLayout from "../layouts/Dashboard";

import Integrations from "../components/landing/Integrations";
import Lifecycle from "../components/landing/Lifecycle";
import FAQ from "../components/landing/FAQ";
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
  () => import("../components/landing/Introduction"),
  { ssr: false },
);

function Presentation() {
  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  return (
    <Wrapper>
      <Head>
        <title>{t("landing.helmet")}</title>
      </Head>
      <Grid container spacing={10}>
        <Grid>
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
