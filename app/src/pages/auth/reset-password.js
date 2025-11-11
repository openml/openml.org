import React from "react";
import { styled } from "@mui/material/styles";
import Head from "next/head";

import { Paper, Typography } from "@mui/material";

import AuthLayout from "../../layouts/Auth";
import ResetPasswordComponent from "../../components/auth/ResetPassword";
import Brand from "../../components/auth/Brand";

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function ResetPassword() {
  return (
    <>
      <Brand />
      <Wrapper>
        <Head />

        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Reset Password
        </Typography>
        <Typography component="h2" variant="body1" align="center">
          Enter your email to reset your password
        </Typography>

        <ResetPasswordComponent />
      </Wrapper>
    </>
  );
}

ResetPassword.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default ResetPassword;
