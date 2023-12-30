import React from "react";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";

import styled from "@emotion/styled";
import { Card, Tooltip, CardHeader, Avatar, Box } from "@mui/material";

import TimeAgo from "react-timeago";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { blue, orange, red, green, grey, purple } from "@mui/material/colors";
import * as colors from "@mui/material/colors";

import {
  faBars,
  faCheck,
  faCloudDownloadAlt,
  faFlask,
  faHashtag,
  faHeart,
  faHistory,
  faNotdef,
  faTags,
  faTimes,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import Teaser from "./Teaser";

const SearchResultCard = styled(Card)`
  border-radius: 0px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 15px;
  padding-bottom: 10px;
  cursor: pointer;
  box-shadow: none;
  ${(props) => props.fullwidth && `width: 100%;`}
  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
`;

const SlimCardHeader = styled(CardHeader)({
  paddingTop: 0,
});

const Stats = styled.div`
  padding-right: 8px;
  display: inline-block;
  font-size: 12px;
`;
const ColorStats = styled.div`
  padding-right: 8px;
  display: inline-block;
  font-size: 12px;
  color: ${(props) => props.color};
`;
const Metric = styled.div`
  color: ${red[500]}
  padding-left: 5px;
  display: inline-block;
`;
const SubStats = styled.div`
  width: 100%;
  font-size: 12px;
  color: ${(props) => props.color};
`;
const ID = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.color};
`;
const RightStats = styled.div`
  float: right;
  font-size: 12px;
`;
const ColoredIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.color};
  align-self: center;
`;
const VersionStats = styled.div`
  font-size: 12px;
  font-weight: 400;
  padding-left: 8px;
  padding-right: 2px;
  color: ${grey[400]};
`;
const Title = styled.div`
  padding-bottom: 5px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: baseline;
`;

// Helper function to get nested properties like 'qualities.raw.NumberOfClasses'
const getNestedProperty = (obj, path) => {
  return path.split(".").reduce((currentObject, key) => {
    return currentObject?.[key];
  }, obj);
};

const getStats = (stats, result) => {
  console.log("result", result);
  console.log("result", stats[5].param);
  console.log("result", result[stats[5].param]);
  if (stats === undefined) {
    return undefined;
  } else {
    return stats.map((stat) => ({
      value: getNestedProperty(result, stat.param),
      unit: stat.unit,
      color: stat.color,
      rotation: stat.rotation ? stat.rotation : 0,
      icon: stat.icon,
    }));
  }
};

const dataStatus = {
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

// TODO: move to data config?
const data_stats = [
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

const colorNames = Object.keys(colors).filter(
  (color) => typeof colors[color] === "object",
);
const shadeKeys = ["300", "500"];
function getRandomColor() {
  const randomColorName =
    colorNames[Math.floor(Math.random() * colorNames.length)];
  const randomShade = shadeKeys[Math.floor(Math.random() * 2)];

  return colors[randomColorName][randomShade];
}

const abbreviateNumber = (value) => {
  let newValue = value;
  if (value > 1000) {
    const suffixes = ["", "k", "M", "B", "T"];
    let suffixNum = 0;
    while (newValue >= 1000) {
      newValue /= 1000;
      suffixNum++;
    }
    newValue = newValue.toPrecision(3);
    newValue += suffixes[suffixNum];
  }
  return newValue;
};

const ResultCard = ({ result }) => {
  const theme = useTheme();
  const router = useRouter();

  const type = result._meta.rawHit._type;
  const color = theme.palette.entity[type];
  const icon = theme.palette.icon[type];
  const stats = getStats(data_stats, result);

  // TODO: get from state
  const selected = false;
  const fullwidth = undefined;

  //console.log("result", result);
  return (
    <SearchResultCard
      onClick={() => router.push(result.id.raw)}
      color={selected ? "#f1f3f4" : "#fff"}
      fullwidth={fullwidth}
      variant="outlined"
    >
      {type === "user" && (
        <SlimCardHeader
          avatar={
            <Avatar
              src={result.image.raw}
              style={{
                height: 50,
                width: 50,
                backgroundColor: getRandomColor(),
              }}
            >
              {result.first_name.raw[0] + result.last_name.raw[0]}
            </Avatar>
          }
          title={result.first_name.raw + " " + result.last_name.raw}
          subheader={result.bio.raw}
        />
      )}
      {type !== "user" && type !== "task" && (
        <Title>
          <ColoredIcon color={color} icon={icon} fixedWidth />
          <Box sx={{ pl: 2 }}>{result.name.raw}</Box>
          {result.version !== undefined && (
            <VersionStats>v.{result.version.raw}</VersionStats>
          )}
          {dataStatus[result.status.raw] !== undefined && (
            <Tooltip
              title={dataStatus[result.status.raw]["title"]}
              placement="top-start"
            >
              <Stats>
                <ColoredIcon
                  color={dataStatus[result.status.raw]["color"]}
                  icon={dataStatus[result.status.raw].icon}
                  fixedWidth
                />
              </Stats>
            </Tooltip>
          )}
        </Title>
      )}
      {type !== "user" && type !== "task" && result.description.raw && (
        <Teaser description={result.description.raw.toString()} limit={3} />
      )}
      {stats !== undefined && (
        <React.Fragment>
          {stats.map((stat, index) => (
            <Tooltip key={index} title={stat.unit} placement="top-start">
              <Stats>
                <ColoredIcon
                  color={stat.color}
                  icon={stat.icon}
                  rotation={stat.rotation}
                  fixedWidth
                />
                {" " + abbreviateNumber(stat.value ? stat.value : 0)}
              </Stats>
            </Tooltip>
          ))}
        </React.Fragment>
      )}
      {type !== "user" && (
        <ColorStats color={grey[400]}>
          <ColoredIcon icon={faHistory} fixedWidth />
          <TimeAgo date={new Date(result.date.raw)} minPeriod={60} />
        </ColorStats>
      )}
      <ID color={grey[400]}>
        <Tooltip title={type + " ID"} placement="top-start">
          <RightStats>
            <ColoredIcon color={grey[400]} icon={faHashtag} fixedWidth />{" "}
            {result.id.raw}
          </RightStats>
        </Tooltip>
      </ID>
    </SearchResultCard>
  );
};

export default ResultCard;
