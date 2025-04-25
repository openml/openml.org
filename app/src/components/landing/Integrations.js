import React from "react";
import { useTranslation } from "next-i18next";
import { styled } from "@mui/material/styles";
import Link from "next/link";

import { Button, Box, Container, Typography, Tooltip } from "@mui/material";
import { spacing } from "@mui/system";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";

const Wrapper = styled("div")(({ theme }) => ({
  ...spacing(theme),
  textAlign: "center",
}));

const TypographyOverline = styled(Typography)`
  text-transform: uppercase;
  color: ${(props) => props.theme.palette.primary.main};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
`;

const BrandIcon = styled("img")({
  verticalAlign: "middle",
  height: "auto",
});

const Brand = styled("div")({
  background: "white",
  display: "inline-block",
  padding: "12px 16px",
  borderRadius: 10,
  margin: 10,
});

const ArrowForward = styled(ArrowForwardIcon)`
  margin-left: ${(props) => props.theme.spacing(2)};
`;

function Integrations() {
  const { t } = useTranslation();

  return (
    <Wrapper py={20}>
      <Container>
        <TypographyOverline variant="body2" gutterBottom>
          {t("landing.integration.overline")}
        </TypographyOverline>
        <Typography variant="h2" component="h3" gutterBottom>
          {t("landing.integration.heading")}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {t("landing.integration.subtitle")}
        </Typography>

        <Box my={7}>
          <Tooltip title="Python API">
            <Brand>
              <BrandIcon
                alt="Python API"
                src="/static/svg/python.svg"
                style={{ height: "34px", margin: "3px 0" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="Julia API">
            <Brand>
              <BrandIcon
                alt="Julia API"
                src="/static/svg/julia.svg"
                style={{ height: "40px" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="R API">
            <Brand>
              <BrandIcon
                alt="R API"
                src="/static/svg/r-lang.svg"
                style={{ height: "40px" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="Java API">
            <Brand>
              <BrandIcon
                alt="Java API"
                src="/static/svg/java.svg"
                style={{ height: "36px", margin: "2px 0" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="C# API">
            <Brand>
              <BrandIcon
                alt="C# API"
                src="/static/svg/c-sharp.svg"
                style={{ height: "40px" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="Scikit-Learn">
            <Brand>
              <BrandIcon
                alt="Scikit-Learn"
                src="/static/svg/sklearn.svg"
                style={{ height: "40px" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="PyTorch">
            <Brand>
              <BrandIcon
                alt="PyTorch"
                src="/static/svg/pytorch.svg"
                style={{ height: "40px" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="TensorFlow">
            <Brand>
              <BrandIcon
                alt="JWT"
                src="/static/svg/tensorflow.svg"
                style={{ height: "40px" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="Jupyter">
            <Brand>
              <BrandIcon
                alt="Jupyter"
                src="/static/svg/jupyter.svg"
                style={{ height: "40px" }}
              />
            </Brand>
          </Tooltip>
          <Tooltip title="Pandas">
            <Brand>
              <BrandIcon
                alt="Pandas"
                src="/static/svg/pandas.svg"
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
            {t("landing.integration.button")}
            <ArrowForward />
          </Button>
        </Box>
      </Container>
    </Wrapper>
  );
}

export default Integrations;
