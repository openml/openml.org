import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { red } from "@material-ui/core/colors";

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
    color: red[500],
});

function SignUp() {
    function sendflask(event) {
    event.preventDefault();
    console.log('The link was clicked.');
    const data = new FormData(event.target);
    axios.post('http://127.0.0.1:5000/signup',
    {
        name:event.target.name.value,
        email:event.target.email.value,
        password:event.target.password.value,

    });
    // fetch('http://127.0.0.1:5000/signup',
    // {
    //   headers:{
    //     'Accept': 'application/json',
    //     'Content-type': 'application/json'
    //   },
    //   method: 'POST',
    //   body:JSON.stringify({
    //     name:event.target.name.value,
    //     email:event.target.email.value,
    //     password:event.target.password.value,
    //         })
    //       });
      }
  return (
    <Wrapper>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Almost there
      </Typography>
      <form onSubmit={sendflask}>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input id="name" name="name" autoFocus />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">Email Address</InputLabel>
          <Input id="email" name="email" autoComplete="email" />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="password">Password (min 8 characters)</InputLabel>
          <Input
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
        </FormControl>
        <Button type="Submit" fullWidth variant="contained" color="primary" mt={2}>
          Sign up for OpenML
        </Button>
      </form>
      <p><RedIcon icon="exclamation-triangle" /> By joining, you agree to the <a target="_blank" rel="noopener noreferrer" href="https://docs.openml.org/terms/">Honor Code and Terms of Use</a>.</p>
    </Wrapper>
  );
}

export default SignUp;
