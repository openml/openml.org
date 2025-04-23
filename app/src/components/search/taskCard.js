import { Box } from "@mui/material";
import React from "react";
import { blue, purple, red } from "@mui/material/colors";
import {
  faCloudDownloadAlt,
  faFlask,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import Teaser from "./Teaser";

export const Title = ({ result }) => {
  return (
    <React.Fragment>
      <Box sx={{ pl: 2 }}>
        {result.tasktype.raw.name} on {result.source_data.raw.name}
      </Box>
    </React.Fragment>
  );
};

export const stats = [
  { param: "runs.raw", unit: "runs", color: red[500], icon: faFlask },
  {
    param: "nr_of_likes.raw",
    unit: "likes",
    color: purple[500],
    icon: faHeart,
  },
  {
    param: "nr_of_downloads.raw",
    unit: "downloads",
    color: blue[500],
    icon: faCloudDownloadAlt,
  },
];

export const Description = ({ result }) => {
  let description = "";
  if (result.target_feature) {
    description += `Predict feature \`${result.target_feature.raw}\`. `;
  }
  if (result.target_values) {
    description += `Possible values are \`${result.target_values.raw}\`. `;
  }
  if (result.estimation_procedure) {
    description += `Evaluate models using \`${result.estimation_procedure.raw.name}\`. `;
  }
  if (result.evaluation_measures) {
    description += `The evaluation measure is \`${result.evaluation_measures.raw}\`. `;
  }
  return <Teaser description={description} limit={3} />;
};
