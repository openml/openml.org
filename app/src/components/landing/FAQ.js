import React from "react";
import styled from "@emotion/styled";

import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Container,
  Grid,
  Typography,
  Link,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { spacing } from "@mui/system";
import { useTranslation } from "next-i18next";

const Spacer = styled.div(spacing);

const Wrapper = styled.div`
  ${spacing};
  text-align: center;
`;

const TypographyOverline = styled(Typography)`
  text-transform: uppercase;
  color: ${(props) => props.theme.palette.primary.main};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
`;

const Accordion = styled(MuiAccordion)`
  border-radius: 6px;
  text-align: left;
  margin: 20px 0 !important;
  box-shadow: 0 2px 6px 0 rgba(18, 38, 63, 0.05);

  &:before {
    display: none;
  }
`;

const AccordionSummary = styled(MuiAccordionSummary)`
  padding: 0 16px;
  box-shadow: 0;
  min-height: 48px !important;

  .MuiAccordionSummary-content {
    margin: 12px 0 !important;
  }
`;

const AccordionDetails = styled(MuiAccordionDetails)`
  padding-left: 16px;
  padding-right: 16px;
`;

function FAQ() {
  const { t } = useTranslation();

  return (
    <Wrapper pt={20} pb={16}>
      <Container>
        <Typography variant="h2" component="h3" gutterBottom>
          {t("landing.faq.heading")}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {t("landing.faq.description")}
        </Typography>
        <Spacer mb={8} />

        <Grid container alignItems="center" justifyContent="center">
          <Grid
            size={{
              xs: 12,
              xl: 8,
            }}
          >
            {[1, 2, 3].map((faq) => (
              <Accordion key={faq}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`faq${faq}-content`}
                  id={`faq${faq}-header`}
                >
                  <Typography variant="subtitle1">
                    {t(`landing.faq.${faq}.question`)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle1" color="textSecondary">
                    {t(`landing.faq.${faq}.answer`)}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default FAQ;
