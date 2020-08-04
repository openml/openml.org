import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { Button as MuiButton, Typography, Paper } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { useHistory } from "react-router-dom";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;
  text-align: center;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

function Page404() {
  const history = useHistory();
  let message = "The page you are looking for might have been removed.";
  let dashboard_error = history.location.pathname.startsWith("/dashboard");
  if (dashboard_error) {
    message = "Dashboard server could not be reached.";
  }
  return (
    <Wrapper>
      <Typography component="h1" variant="h1" align="center" gutterBottom>
        404
      </Typography>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        Page not found.
      </Typography>
      <Typography component="h2" variant="body1" align="center" gutterBottom>
        {message}
      </Typography>
      {!dashboard_error && (
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="secondary"
          mt={2}
        >
          Return to website
        </Button>
      )}
    </Wrapper>
  );
}

export default Page404;
