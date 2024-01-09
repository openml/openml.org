import { Box } from "@mui/material";
import React from "react";
import { blue, purple, red } from "@mui/material/colors";
import {
  faCloudDownloadAlt,
  faFlask,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import Teaser from "../../components/search/Teaser";
import { shortenName } from "../f/flowCard";

export const Title = ({ result }) => {
  return (
    <React.Fragment>
      <Box sx={{ pl: 2 }}>
        {shortenName(result.run_flow.raw.name)} on{" "}
        {result.run_task.raw.source_data.name} by {result.uploader.raw}
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
  if (result.run_flow) {
    description += `Evaluates \`${result.run_flow.raw.name}\` `;
  }
  if (result.run_task) {
    description += `on dataset \`${result.run_task.raw.source_data.name}\`. `;
  }
  if (result.uploader) {
    description += `Ran by ${result.uploader.raw}. `;
  }
  return <Teaser description={description} limit={3} />;
};
