import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";

import { Button, Box, Container, Typography, Tooltip } from "@mui/material";
import { spacing } from "@mui/system";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";

const Wrapper = styled.div`
  ${spacing};
  text-align: center;
`;

const TypographyOverline = styled(Typography)`
  text-transform: uppercase;
  color: ${(props) => props.theme.palette.primary.main};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
`;

const BrandIcon = styled.img`
  vertical-align: middle;
  height: auto;
`;

const Brand = styled.div`
  background: white;
  display: inline-block;
  padding: 12px 16px;
  border-radius: 10px;
  margin: 10px;
`;

const ArrowForward = styled(ArrowForwardIcon)`
  margin-left: ${(props) => props.theme.spacing(2)};
`;

function Integrations() {
  return (
    <Wrapper py={20}>
      <Container>
        <TypographyOverline variant="body2" gutterBottom>
          Integrations
        </TypographyOverline>
        <Typography variant="h2" component="h3" gutterBottom>
          Frictionless machine learning
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Easily import and export datasets, pipelines, and experiments from
          your favourite machine learning environments and libraries.
        </Typography>

        <Box my={7}>
          <Tooltip title="MUI v5">
            <Brand>
              <BrandIcon
                alt="MUI"
                src="/static/img/brands/material-ui.svg"
                style={{ height: "34px", margin: "3px 0" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="Next.js v13">
            <Brand>
              <BrandIcon
                alt="Next.js"
                src="/static/img/brands/nextjs.svg"
                style={{ height: "40px" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="React v18">
            <Brand>
              <BrandIcon
                alt="React"
                src="/static/img/brands/react.svg"
                style={{ height: "40px" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="Redux">
            <Brand>
              <BrandIcon
                alt="Redux"
                src="/static/img/brands/redux.svg"
                style={{ height: "36px", margin: "2px 0" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="Firebase Authentication">
            <Brand>
              <BrandIcon
                alt="Firebase Authentication"
                src="/static/img/brands/firebase.svg"
                style={{ height: "40px" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="Amazon Cognito">
            <Brand>
              <BrandIcon
                alt="Amazon Cognito"
                src="/static/img/brands/cognito.svg"
                style={{ height: "40px" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="Auth0">
            <Brand>
              <BrandIcon
                alt="Auth0"
                src="/static/img/brands/auth0.svg"
                style={{ height: "40px" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="JSON Web Token">
            <Brand>
              <BrandIcon
                alt="JWT"
                src="/static/img/brands/jwt.svg"
                style={{ height: "40px" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="ESLint">
            <Brand>
              <BrandIcon
                alt="eslint "
                src="/static/img/brands/eslint.svg"
                style={{ height: "40px" }}
              />
            </Brand>
          </Tooltip>
        </Box>
        <Box>
          <Button
            component={Link}
            href="/documentation/welcome"
            target="_blank"
            variant="contained"
            color="secondary"
            size="large"
          >
            Open Documentation
            <ArrowForward />
          </Button>
        </Box>
      </Container>
    </Wrapper>
  );
}

export default Integrations;
