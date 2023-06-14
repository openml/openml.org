import React from "react";

import { Grid, useMediaQuery } from "@mui/material";
import InfoCard from "../../Card";

import { faCogs, faDatabase, faFlask } from "@fortawesome/free-solid-svg-icons";
import { purple, blue, red, yellow, green, orange } from "@mui/material/colors";

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
  title: "A treasure trove of ML results",
  icon: faFlask,
  iconColor: red[500],
  text: `Learn from millions of reproducible machine learning experiments on thousands of datasets to make informed decisions.`,
};

function Features() {
  return (
    <Grid container spacing={6}>
      {[ai_ready_data, integrations, ml_results].map((card) => (
        <Grid item display="flex" xs={12} md={4} key={card.title}>
          <InfoCard info={card} />
        </Grid>
      ))}
    </Grid>
  );
}

export default Features;
