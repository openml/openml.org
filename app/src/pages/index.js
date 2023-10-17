import React from "react";

import DashboardLayout from "../layouts/Dashboard";
import { Helmet } from "react-helmet-async";

import Integrations from "../components/pages/landing/Integrations";
import Lifecycle from "../components/pages/landing/Lifecycle";
import FAQ from "../components/pages/landing/FAQ";
import Wrapper from "../components/Wrapper";

import { Grid } from "@mui/material";

// Avoids a (dev-only) hydration warning
import dynamic from "next/dynamic";
const Introduction = dynamic(
  () => import("../components/pages/landing/Introduction"),
  { ssr: false }
);

function Presentation() {
  return (
    <Wrapper>
      <Helmet title="Join OpenML!" />
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
