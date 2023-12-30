import { Box } from "@mui/material";
import React from "react";
import { blue, purple, red } from "@mui/material/colors";
import {
  faCloudDownloadAlt,
  faFlask,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

export const Title = ({ result }) => {
  console.log(result);
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
