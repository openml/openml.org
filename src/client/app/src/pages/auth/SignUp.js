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
  return (
    <Wrapper>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Almost there
      </Typography>
      <form>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input id="name" name="name" autoFocus />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">Email Address</InputLabel>
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
          component={Link}
          to="/"
          fullWidth
          variant="contained"
          color="primary"
          mt={2}
        >
          Sign up for OpenML
        </Button>
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
