import React from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { Helmet } from "react-helmet-async";

import {
  CardContent,
  Grid,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  Divider as MuiDivider,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";

import DashboardLayout from "../../layouts/Dashboard";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

function EmptyCard() {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Empty card
        </Typography>
        <Typography variant="body2" gutterBottom>
          Empty card
        </Typography>
      </CardContent>
    </Card>
  );
}

function Blank() {
  return (
    <React.Fragment>
      <Helmet title="Blank" />
      <Typography variant="h3" gutterBottom display="inline">
        Blank
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <NextLink href="/" passHref>
          <Link>Dashboard</Link>
        </NextLink>
        <NextLink href="/" passHref>
          <Link>Pages</Link>
        </NextLink>
        <Typography>Blank</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <EmptyCard />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

Blank.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Blank;
