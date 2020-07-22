import React, { useState } from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import axios from "axios";

import {
  FormControl,
  Input,
  InputLabel,
  Button as MuiButton,
  Paper,
  Typography
} from "@material-ui/core";
import { spacing } from "@material-ui/system";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

function ResetPage() {
  console.log(window.location.href);
  const [verifToken, setverifToken] = useState(false);
  const [redirect, setRedirect] = useState(false);
  axios
    .post(process.env.REACT_APP_SERVER_URL + "forgot-token", {
      url: window.location.href
    })
    .then(function(response) {
      console.log(response.data);
      setverifToken(true);
    })
    .catch(function(error) {
      console.log(error.data);
    });
  function sendflask(event) {
    event.preventDefault();
    console.log("executed");
    axios
      .post(process.env.REACT_APP_SERVER_URL + "resetpassword", {
        url: window.location.href,
        password: event.target.password.value
      })
      .then(function(response) {
        console.log(response.data);
        setRedirect(true);
      })
      .catch(function(error) {
        console.log("error");
        console.log(error.data);
      });
  }

  return (
    <Wrapper>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Reset password
      </Typography>
      <Typography component="h2" variant="body1" align="center">
        Enter new password
      </Typography>
      <form onSubmit={sendflask}>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="password">New Password</InputLabel>
          <Input
            id="password"
            name="password"
            autoComplete="password"
            type="password"
            autoFocus
          />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="confirmpassword">
            Confirm New Password
          </InputLabel>
          <Input
            id="confirmpassword"
            name="confirmpassword"
            autoComplete="confirmpassword"
            type="password"
            autoFocus
          />
        </FormControl>
        <Button
          type="Submit"
          to=""
          fullWidth
          variant="contained"
          color="primary"
          mt={2}
        >
          Reset password
        </Button>
        {redirect && <Redirect to="/auth/sign-in" />}
      </form>
    </Wrapper>
  );
}

export default ResetPage;
