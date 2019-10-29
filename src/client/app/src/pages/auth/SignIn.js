import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from 'axios';
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

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

//
function SignIn() {
  function sendtoflask(event) {
    event.preventDefault();
    console.log('The link was clicked.');
    const data = new FormData(event.target);
    axios.post('http://127.0.0.1:5000/login',
        {
          email: event.target.email.value,
          password: event.target.password.value,

        })
        .then(function (response) {
        console.log(response);
        console.log('clicked');

      })
      .catch(function (error) {
        console.log(error);
      });
    }

  return(
    <Wrapper>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Welcome back, You!
      </Typography>
      <Typography component="h2" variant="body1" align="center">
        Sign in to continue
      </Typography>
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
        <Button type = "Submit"  fullWidth  variant="contained"  color="primary"  mb={2} to="/">
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
        <Button
          component={Link}
          to="/auth/sign-up"
          fullWidth
          color="primary"
        >
          No account? Join OpenML
        </Button>
      </form>
    </Wrapper>
  );
}

export default SignIn;
