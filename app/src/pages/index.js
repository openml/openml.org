import React from "react";

import DashboardLayout from "../layouts/Dashboard";
import { Helmet } from "react-helmet-async";

import Integrations from "../components/pages/landing/Integrations";
import Lifecycle from "../components/pages/landing/Lifecycle";
import FAQ from "../components/pages/landing/FAQ";
import JoinUs from "../components/pages/landing/JoinUs";
import Wrapper from "../components/Wrapper";

import { Grid } from "@mui/material";

//<- set SSr to false
// This is to avoid a (dev-only) hydration warning caused by a bug in FontAwesome
// Can be removed when the bug is fixed
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
        </Grid>
        <Grid item>
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
