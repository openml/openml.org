import React from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from "react-router-dom";
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
  width: 100%;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

function ResetPage() {
    axios.post("https://127.0.0.1:5000/forgot-token",{
        token:'jhb'
    }).then(function(response) {
        console.log(response.data);
      })
      .catch(function(error) {
        console.log(error.data);
      });
    function sendflask(event){
     event.preventDefault();
    const data = new FormData(event.target);
    console.log('executed');
    axios.post("https://127.0.0.1:5000/forgotpassword",{
        password: event.target.password.value
    }).then(function(response) {
        console.log(response.data);
      })
      .catch(function(error) {
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
          <Input id="password" name="password" autoComplete="password" autoFocus />
        </FormControl>
          <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="confirmpassword">Confirm New Password</InputLabel>
          <Input id="confirmpassword" name="confirmpassword" autoComplete="confirmpassword" autoFocus />
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
      </form>
    </Wrapper>
  );
}

export default ResetPage;