import React from "react";
import styled from "@emotion/styled";

import {
  Button,
  Container,
  Grid,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";

const Spacer = styled.div(spacing);

const Typography = styled(MuiTypography)(spacing);

const Wrapper = styled.div`
  ${spacing};
  text-align: center;
  position: relative;
  background: #181d2d;
  color: ${(props) => props.theme.palette.common.white};
`;

const Subtitle = styled(Typography)`
  font-size: ${(props) => props.theme.typography.h6.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  font-family: ${(props) => props.theme.typography.fontFamily};
  opacity: 0.75;
`;

function JoinUs() {
  return (
    <Wrapper pt={16} pb={16}>
      <Container>
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <Typography variant="h2" gutterBottom>
              Start building with Mira today
            </Typography>
            <Subtitle variant="h5" gutterBottom>
              Stop wasting time building your application from scratch. Mira Pro
              is fast, extendable and fully customizable.
            </Subtitle>
            <Spacer mb={4} />

            <Button
              href="https://mui.com/store/items/mira-pro-react-material-admin-dashboard/"
              variant="contained"
              color="primary"
              size="large"
              target="_blank"
            >
              Get Mira Pro
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default JoinUs;
