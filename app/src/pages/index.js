import React from "react";

import DashboardLayout from "../layouts/Dashboard";

import Demos from "../components/pages/landing/Demos";
import Testimonial from "../components/pages/landing/Testimonial";
import Integrations from "../components/pages/landing/Integrations";
import Features from "../components/pages/landing/Features";
import FAQ from "../components/pages/landing/FAQ";
import JoinUs from "../components/pages/landing/JoinUs";

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
    <Grid container spacing={10}>
      <Grid item>
        <Introduction />
      </Grid>
      <Grid item>
        <Features />
        <Integrations />
        <FAQ />
        <JoinUs />
      </Grid>
    </Grid>
  );
}

Presentation.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Presentation;
