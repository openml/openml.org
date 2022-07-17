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
} from "@mui/material";
import { spacing } from "@mui/system";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)};
  width: 100%;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)};
  }
`;

function ConfirmationToken() {
    function sendflask(event){
     event.preventDefault();
    console.log('executed');
    axios.post(process.env.REACT_APP_SERVER_URL+"send-confirmation-token",{
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
        Send activation email
      </Typography>
      <Typography component="h2" variant="body1" align="center">
        Enter your email to send confirmation token again
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
          Resend confirmation email
        </Button>
      </form>
    </Wrapper>
  );
}

export default ConfirmationToken;
