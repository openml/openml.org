import { Box } from "@mui/material";
import React from "react";
import { blue, green, orange, purple, red } from "@mui/material/colors";
import {
  faCheck,
  faCloudDownloadAlt,
  faFlask,
  faHeart,
  faTimes,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import Teaser from "../../components/search/Teaser";

const status = {
  active: {
    title: "verified",
    icon: faCheck,
    color: green[500],
  },
  deactivated: {
    title: "deactivated",
    icon: faTimes,
    color: red[500],
  },
  in_preparation: {
    title: "unverified",
    icon: faWrench,
    color: orange[500],
  },
};

export const Title = ({ result }) => {
  return (
    <React.Fragment>
      <Box sx={{ pl: 2 }}>{result.name.raw}</Box>
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
  return (
    <Teaser
      description={
        result.description.raw
          ? result.description.raw.toString()
          : "Description missing"
      }
      limit={3}
    />
  );
};
