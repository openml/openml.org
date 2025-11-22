import React from "react";
import { styled } from "@mui/material/styles";
import Head from "next/head";

import { Avatar, Paper, Typography } from "@mui/material";

import AuthLayout from "../../layouts/Auth";

import SignInComponent from "../../components/auth/SignIn";
import Brand from "../../components/auth/Brand";

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

const BigAvatar = styled(Avatar)`
  width: 92px;
  height: 92px;
  text-align: center;
  margin: 0 auto ${(props) => props.theme.spacing(5)};
`;

function SignIn() {
  return (
    <>
      <Brand />
      <Wrapper>
        <Head />
        <BigAvatar alt="Sky" src="/static/img/avatars/avatar-1.jpg" />

        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Welcome back, Sky!
        </Typography>
        <Typography component="h2" variant="body1" align="center">
          Sign in to your account to continue
        </Typography>

        <SignInComponent />
      </Wrapper>
    </>
  );
}

SignIn.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default SignIn;
