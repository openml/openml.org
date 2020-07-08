import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { red } from "@material-ui/core/colors";
import { Redirect } from "react-router-dom";
import { useState } from "react";

import {
  FormControl,
  Input,
  InputLabel,
  Button as MuiButton,
  Paper,
  Typography
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import axios from "axios";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

const RedIcon = styled(FontAwesomeIcon)({
  color: red[500]
});

function SignUp() {
  const [register, setRegister] = useState(false);
  const [duplicateUser, setDuplicateUser] = useState(false);
  const [error, setError] = useState(false);
  const [errormessage, setErrorMessage] = useState(false);
  function sendflask(event) {
    event.preventDefault();
    console.log(event.target.email.value);
    console.log(event.target.password.value);
    if (event.target.password.value.length < 6) {
      setError(true);
      setErrorMessage("Password too weak");
    } else if (
      /[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(
        event.target.email.value
      ) !== true
    ) {
      setError(true);
      setErrorMessage("Please enter valid email");
    } else {
      axios
        .post(process.env.REACT_APP_SERVER_URL + "signup", {
          first_name: event.target.fname.value,
          last_name:event.target.lname.value,
          email: event.target.email.value,
          password: event.target.password.value
        })
        .then(function(response) {
          if (response.data.msg === "User created") {
            console.log(response.data);
            setRegister(true);
          } else if (response.data.msg === "User already exists") {
            setDuplicateUser(true);
          }
        })
        .catch(function(error) {
          console.log(error.data);
        });
    }
    return false;
  }
  return (
    <Wrapper>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Almost there
      </Typography>
      <form onSubmit={sendflask}>
        {duplicateUser && (
          <Typography component="h3" variant="body1" align="center" color="red">
            User already exists
          </Typography>
        )}
        {error && (
          <Typography component="h3" variant="body1" align="center" color="red">
            {errormessage}
          </Typography>
        )}
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="fname">First name</InputLabel>
          <Input id="fname" name="fname" autoFocus />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="lname">Last name</InputLabel>
          <Input id="lname" name="lname" autoFocus />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">
            Email Address (we never share your email and only send critical
            emails)
          </InputLabel>
          <Input id="email" name="email" autoComplete="email" />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="password">
            Password (min 8 characters)
          </InputLabel>
          <Input
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
        </FormControl>
        <Button
          type="Submit"
          fullWidth
          variant="contained"
          color="primary"
          mt={2}
          style={{ marginTop: 20 }}
        >
          Sign up for OpenML
        </Button>
        {register ? (
          <Redirect to="/auth/sign-in" />
        ) : (
          <Redirect to="/auth/sign-up" />
        )}
      </form>
      <p>
        <RedIcon icon="exclamation-triangle" /> By joining, you agree to the{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.openml.org/terms/"
        >
          Honor Code and Terms of Use
        </a>
        .
      </p>
    </Wrapper>
  );
}

export default SignUp;
