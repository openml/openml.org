import React from "react";
import styled from "@emotion/styled";

import { spacing } from "@mui/system";
import { Grid, Container, Typography } from "@mui/material";
import InfoCard from "../../Card";

import { faCogs, faDatabase, faFlask } from "@fortawesome/free-solid-svg-icons";
import { purple, blue, red, yellow, green, orange } from "@mui/material/colors";

const Wrapper = styled.div`
  ${spacing};
  text-align: center;
`;

// Maybe add chips as well to other parts of the landing page or docs
const ai_ready_data = {
  title: "AI-ready data",
  icon: faDatabase,
  iconColor: green[500],
  arrow: "right",
  text: `All datasets are uniformy formatted, have rich, consistent metadata, and can be loaded directly into your favourite environments.`,
};
const integrations = {
  title: "ML library integrations",
  icon: faCogs,
  iconColor: blue[500],
  arrow: "right",
  text: `Pipelines and models can be shared directly from your favourite machine learning libraries. No manual steps required.`,
};
const ml_results = {
  title: "A treasure of ML results",
  icon: faFlask,
  iconColor: red[500],
  text: `Learn from millions of reproducible machine learning benchmarks from thousands of models trained on thousands of datasets.`,
};

function Lifecycle() {
  return (
    <Wrapper py={20}>
      <Container>
        <Typography variant="h2" component="h3" gutterBottom>
          OpenML simplifies the entire machine learning lifecycle
        </Typography>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          gutterBottom
          style={{ paddingBottom: 20 }}
        >
          and organizes everything into one collective memory
        </Typography>
        <Grid container spacing={6}>
          {[ai_ready_data, integrations, ml_results].map((card) => (
            <Grid item display="flex" xs={12} md={4} key={card.title}>
              <InfoCard info={card} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default Lifecycle;
