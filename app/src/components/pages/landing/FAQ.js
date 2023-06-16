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
  return (
    <Wrapper pt={20} pb={16}>
      <Container>
        <Typography variant="h2" component="h3" gutterBottom>
          Frequently asked questions
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Let's put FAQs here
        </Typography>
        <Spacer mb={8} />

        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={12} xl={8}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq1-content"
                id="faq1-header"
              >
                <Typography variant="subtitle1">Question 1</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" color="textSecondary">
                  Answer 1
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq2-content"
                id="faq2-header"
              >
                <Typography variant="subtitle1">Question 2</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" color="textSecondary">
                  Answer 2
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq3-content"
                id="faq3-header"
              >
                <Typography variant="subtitle1">Question 3</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" color="textSecondary">
                  Answer 3
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default FAQ;
