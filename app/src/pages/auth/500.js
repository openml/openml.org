import React from "react";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import Head from "next/head";

import AuthLayout from "../../layouts/Auth";

import { Button as MuiButton, Typography } from "@mui/material";
import { spacing } from "@mui/system";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: "center",
  background: "transparent",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(10),
  },
}));

function Page500() {
  return (
    <Wrapper>
      <Head />
      <Typography component="h1" variant="h1" align="center" gutterBottom>
        500
      </Typography>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        Internal server error.
      </Typography>
      <Typography component="h2" variant="body1" align="center" gutterBottom>
        The server encountered something unexpected that didn't allow it to
        complete the request.
      </Typography>

      <Button
        component={Link}
        href="/"
        variant="contained"
        color="secondary"
        mt={2}
      >
        Return to website
      </Button>
    </Wrapper>
  );
}

Page500.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Page500;
