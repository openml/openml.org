import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  Button as MuiButton,
  Paper,
  Typography
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { logincontext, MainContext } from "../../App";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

//
function SignIn() {
  const [logger, setLogger] = useState(false);
  const [errorlog, setError] = useState(false);
  const [confirmflag, setConfirm] = useState(false);
  console.log(process.env.REACT_APP_SERVER_URL+"login");

  function sendtoflask(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    axios
      .post(process.env.REACT_APP_SERVER_URL+ "login", {
        email: event.target.email.value,
        password: event.target.password.value
      })
      .then(function(response) {
        console.log(response.data);
        if(response.data.msg=='NotConfirmed'){
          console.log('nc')
          setConfirm(true);
        }
        else{setLogger(true);
        localStorage.setItem("token", response.data.access_token);}
      })
      .catch(function(error) {
        console.log(error.data);
        setError(true);
      });
    return false;
  }
  return (
    <Wrapper>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Welcome back, You!
      </Typography>
      <Typography component="h2" variant="body1" align="center">
        Sign in to continue
      </Typography>
      {errorlog ? (
        <Typography component="h3" variant="body1" align="center" color="red">
          Wrong username or password
        </Typography>
      ) : (
        <Redirect to="/auth/sign-in" />
      )}
      {
        confirmflag &&
        (
        <Typography component="h3" variant="body1" align="center" color="red">
        User not confirmed(send activation token again?)
        </Typography>
      )
      }
      <form onSubmit={sendtoflask}>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">Email Address</InputLabel>
          <Input id="email" name="email" autoComplete="email" autoFocus />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
        </FormControl>
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          type="Submit"
          fullWidth
          variant="contained"
          color="primary"
          mb={2}
          to="/"
        >
          Sign in
        </Button>
        <Button
          component={Link}
          to="/auth/reset-password"
          fullWidth
          color="primary"
        >
          Forgot password
        </Button>
        <Button component={Link} to="/auth/sign-up" fullWidth color="primary">
          No account? Join OpenML
        </Button>
        {logger ? (
          <Redirect to="/auth/profile" />
        ) : (
          <Redirect to="/auth/sign-in" />
        )}
      </form>
    </Wrapper>
  );
}
export default SignIn;
