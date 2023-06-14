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
        <TypographyOverline variant="body2" gutterBottom>
          Mira Pro
        </TypographyOverline>
        <Typography variant="h2" component="h3" gutterBottom>
          Frequently asked questions
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          The questions below have been selected from those most commonly asked
          by our customers.
        </Typography>
        <Spacer mb={8} />

        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={12} xl={8}>
            <Accordion defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq1-content"
                id="faq1-header"
              >
                <Typography variant="subtitle1">
                  Does this product support Next.js / Create React App?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" color="textSecondary">
                  Yes, Mira is available for both Next.js and Create React App
                  (React Scripts). Both versions are included in the package and
                  instantly available for download after the purchase.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq2-content"
                id="faq2-header"
              >
                <Typography variant="subtitle1">
                  Can I use this template for my client?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" color="textSecondary">
                  Yes, the marketplace license allows you to use this theme in
                  any end products. For more information on licenses,{" "}
                  <Link
                    href="https://material-ui.com/store/license/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    click here
                  </Link>
                  .
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq3-content"
                id="faq3-header"
              >
                <Typography variant="subtitle1">
                  Does this product support TypeScript?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" color="textSecondary">
                  Yes, the TypeScript version is included in the Standard Plus
                  and Extended License. The default (JavaScript) version is
                  available on all licenses.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq4-content"
                id="faq4-header"
              >
                <Typography variant="subtitle1">
                  Does this product work with npm / yarn?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" color="textSecondary">
                  Yes, Mira has been thoroughly tested with npm and yarn (LTS
                  versions).
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq5-content"
                id="faq5-header"
              >
                <Typography variant="subtitle1">
                  Are design assets (Figma, Sketch) included?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" color="textSecondary">
                  Yes, design assets (Figma and Sketch) are included in the
                  Standard Plus and Extended License.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq6-content"
                id="faq6-header"
              >
                <Typography variant="subtitle1">
                  How can I request support?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" color="textSecondary">
                  You can use our dedicated support email (
                  <Link href="mailto:support@bootlab.io">
                    support@bootlab.io
                  </Link>
                  ) to send your issues or feedback. We are here to help.
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
