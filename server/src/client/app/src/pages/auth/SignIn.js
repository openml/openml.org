import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import {
  Checkbox,
  Grid,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  Button as MuiButton,
  Paper,
  Typography
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MainContext } from "../../App.js";

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
  const [errormsg, setErrorMsg] = useState(false);
  const [notexist, setNotExist] = useState(false);
  const [wrongpass, setWrongPass] = useState(false);
  const context = useContext(MainContext);

  function sendtoflask(event) {
    event.preventDefault();
    axios
      .post(process.env.REACT_APP_SERVER_URL + "login", {
        email: event.target.email.value,
        password: event.target.password.value
      })
      .then(response => {
        console.log(response.data);
        if (response.data.msg === "NotConfirmed") {
          setConfirm(true);
        } else if (response.data.msg === "Wrong username or password") {
          setNotExist(true);
        } else if (response.data.msg === "wrong password") {
          setWrongPass(true);
        } else {
          localStorage.setItem("token", response.data.access_token);
          context.checkLogIn();
          setLogger(true);
        }
      })
      .catch(error => {
        console.log(error);
        setError(true);
        setErrorMsg(String(error));
      });
    return false;
  }

  return (
    <Grid container justifyContent="center">
      {logger ? (
        <Redirect to="/auth/profile-page" />
      ) : (
        <Redirect to="/auth/sign-in" />
      )}
      <Grid item md={7} xs={10}>
        <Wrapper>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Welcome back!
          </Typography>
          <Typography component="h2" variant="body1" align="center">
            Sign in to continue
          </Typography>
          {errorlog && (
            <Typography component="h3" align="center" style={{ color: "red" }}>
              <FontAwesomeIcon
                icon="exclamation-triangle"
                style={{ marginRight: 5 }}
              />
              {errormsg}
            </Typography>
          )}
          {wrongpass && (
            <Typography component="h3" align="center" style={{ color: "red" }}>
              <FontAwesomeIcon
                icon="exclamation-triangle"
                style={{ marginRight: 5 }}
              />
              Wrong username or password
            </Typography>
          )}
          {confirmflag && (
            <Typography
              component="h3"
              variant="body1"
              align="center"
              style={{ color: "red" }}
            >
              User not confirmed
              <a href="/auth/confirmation-token">(resend activation token)</a>
            </Typography>
          )}
          {notexist && (
            <Typography component="h3" align="center" style={{ color: "red" }}>
              <FontAwesomeIcon
                icon="exclamation-triangle"
                style={{ marginRight: 5 }}
              />
              Wrong username or password
            </Typography>
          )}
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
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              mb={2}
              to="/"
              style={{ marginTop: 20 }}
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
          </form>
        </Wrapper>
      </Grid>
      <Grid item md={7} xs={10}>
        <Button
          component={Link}
          to="/auth/sign-up"
          fullWidth
          style={{ color: "white" }}
        >
          No account? Join OpenML
        </Button>
      </Grid>
    </Grid>
  );
}

export default SignIn;
