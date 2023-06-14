import React from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";

import { Box, Chip, Container, Grid, Typography } from "@mui/material";
import { spacing } from "@mui/system";

import { THEMES } from "../../../constants";
import useTheme from "../../../hooks/useTheme";

const Wrapper = styled.div`
  ${spacing};
  background: ${(props) => props.theme.palette.background.paper};
  text-align: center;
`;

const DemoContent = styled.div(spacing);

const DemoLink = styled.div`
  cursor: pointer;
`;

const DemoImage = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
  box-shadow: 0 4px 12px 0 rgba(18, 38, 63, 0.125);
  transition: 0.15s ease-in-out;
  border-radius: 4px;

  &:hover {
    transform: scale(1.0325);
  }
`;

const DemoChip = styled(Chip)`
  background-color: ${(props) => props.theme.palette.secondary.main};
  border-radius: 5px;
  color: ${(props) => props.theme.palette.common.white};
  font-size: 55%;
  height: 18px;
  margin-top: -16px;
  padding: 3px 0;

  span {
    padding-left: ${(props) => props.theme.spacing(1.375)};
    padding-right: ${(props) => props.theme.spacing(1.375)};
  }
`;

const TypographyOverline = styled(Typography)`
  text-transform: uppercase;
  color: ${(props) => props.theme.palette.primary.main};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
`;

const Variant = ({ theme, title, img, isNew = false }) => {
  const router = useRouter();
  const { setTheme } = useTheme();

  const toggleDemo = (theme) => {
    setTheme(theme);
    router.push("/dashboard/analytics");
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      <DemoContent px={2}>
        <DemoLink onClick={() => toggleDemo(theme)}>
          <DemoImage
            alt={`${title} - React Admin Template`}
            src={`/static/img/screenshots/${img}.jpg`}
          />
        </DemoLink>
        <Box mb={3} />
        <Typography variant="h6">
          {title} {isNew && <DemoChip label="New" />}
        </Typography>
      </DemoContent>
    </Grid>
  );
};

function Demos() {
  return (
    <Wrapper pt={16} pb={20} id="demos">
      <Container>
        <TypographyOverline variant="body2" gutterBottom>
          Demos
        </TypographyOverline>
        <Typography variant="h2" component="h3" gutterBottom>
          Choose from 50+ pages and 6 different color schemes
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          The package includes 50+ prebuilt pages, 6 theme variants and 3
          prebuilt dashboards.
        </Typography>
        <Box mb={8} />
      </Container>
    </Wrapper>
  );
}

export default Demos;
