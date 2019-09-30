import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

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
  return (
    <Wrapper>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Reset password
      </Typography>
      <Typography component="h2" variant="body1" align="center">
        Enter your email to reset your password
      </Typography>
      <form>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">Email Address</InputLabel>
          <Input id="email" name="email" autoComplete="email" autoFocus />
        </FormControl>
        <Button
          component={Link}
          to="/"
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
