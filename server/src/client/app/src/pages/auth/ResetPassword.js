import React from "react";
import styled from "styled-components";
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

function ResetPassword() {
    function sendflask(event){
     event.preventDefault();
    console.log('executed');
    axios.post(process.env.REACT_APP_SERVER_URL+"forgotpassword",{
        email: event.target.email.value
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
        Enter your email to reset your password
      </Typography>
      <form onSubmit={sendflask}>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">Email Address</InputLabel>
          <Input id="email" name="email" autoComplete="email" autoFocus />
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

export default ResetPassword;
