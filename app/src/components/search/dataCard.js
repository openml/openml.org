import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Tooltip } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import { blue, green, grey, orange, purple, red } from "@mui/material/colors";
import {
  faBars,
  faCheck,
  faCloudDownloadAlt,
  faFlask,
  faHeart,
  faNotdef,
  faTags,
  faTimes,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import Teaser from "./Teaser";

const ColoredIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.color};
  align-self: center;
`;
const VersionStats = styled("div")({
  fontSize: "12px",
  fontWeight: 400,
  paddingLeft: "8px",
  paddingRight: "2px",
  color: grey[400],
});

const Stats = styled("div")({
  paddingRight: "8px",
  display: "inline-block",
  fontSize: "12px",
});

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
    <>
      <Box sx={{ pl: 2 }}>{result.name.raw}</Box>
      <VersionStats>v.{result.version.raw}</VersionStats>
      <Tooltip title={status[result.status.raw]["title"]} placement="top-start">
        <Stats>
          <ColoredIcon
            color={status[result.status.raw]["color"]}
            icon={status[result.status.raw].icon}
            fixedWidth
          />
        </Stats>
      </Tooltip>
    </>
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
  {
    param: "qualities.raw.NumberOfInstances",
    unit: "instances (rows)",
    color: grey[500],
    icon: faBars,
  },
  {
    param: "qualities.raw.NumberOfFeatures",
    unit: "features (columns)",
    color: grey[500],
    icon: faBars,
    rotation: 90,
  },
  {
    param: "qualities.raw.NumberOfClasses",
    unit: "classes",
    color: grey[500],
    icon: faTags,
  },
  {
    param: "qualities.raw.NumberOfMissingValues",
    unit: "missing values",
    color: grey[500],
    icon: faNotdef,
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
