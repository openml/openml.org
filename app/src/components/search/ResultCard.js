import React from "react";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";

import styled from "@emotion/styled";
import { Card, Tooltip, CardHeader, Avatar } from "@mui/material";

import TimeAgo from "react-timeago";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { blue, orange, red, green, grey, purple } from "@mui/material/colors";
import * as colors from "@mui/material/colors";

import {
  faCheck,
  faCloudDownloadAlt,
  faFlask,
  faHashtag,
  faHeart,
  faHistory,
  faTable,
  faTimes,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";

const SearchResultCard = styled(Card)`
  border-radius: 0px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 15px;
  padding-bottom: 20px;
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

const ColoredIcon = styled(FontAwesomeIcon)`
  cursor: 'pointer',
  color: ${(props) => props.color},
`;
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
const RightStats = styled.div`
  float: right;
`;
const VersionStats = styled.div`
  float: right;
  font-size: 12px;
  padding-right: 8px;
`;
const Title = styled.div`
  padding-bottom: 5px;
  font-size: 16px;
  font-weight: 600;
`;
const SubTitle = styled.div`
  margin-bottom: 10px;
  font-size: 12px;
  line-height: 1.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 36px;
`;

const getStats = (stats, result) => {
  if (stats === undefined) {
    return undefined;
  } else {
    return stats.map((stat) => ({
      value: result[stat.param] ? result[stat.param].raw : 0,
      unit: stat.unit,
      color: stat.color,
      icon: stat.icon,
    }));
  }
};

const getStats2 = (stats, result) => {
  if (result.qualities) {
    result = result.qualities.raw;
  }
  if (stats === undefined) {
    return undefined;
  } else {
    return stats.map((stat) => ({
      value: result[stat.param],
      unit: stat.unit,
      color: stat.color,
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

const getTeaser = (description) => {
  if (description === undefined || description === null) {
    return undefined;
  }
  let lines = description.split("\n").map((i) => i.trim());
  for (let i = 0; i < lines.length; i++) {
    if (
      !lines[i].startsWith("*") &&
      !lines[i].startsWith("#") &&
      lines[i].length > 0
    ) {
      return lines[i];
    }
  }
  return lines[0];
};

const data_stats = [
  { param: "runs", unit: "runs", color: red[500], icon: faFlask },
  {
    param: "nr_of_likes",
    unit: "likes",
    color: purple[500],
    icon: faHeart,
  },
  {
    param: "nr_of_downloads",
    unit: "downloads",
    color: blue[500],
    icon: faCloudDownloadAlt,
  },
];

const data_stats2 = [
  { param: "NumberOfInstances", unit: "instances" },
  { param: "NumberOfFeatures", unit: "fields" },
  { param: "NumberOfClasses", unit: "classes" },
  { param: "NumberOfMissingValues", unit: "missing" },
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
  const stats2 = getStats2(data_stats2, result);

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
      {type !== "user" && (
        <Title>
          <ColoredIcon color={color} icon={icon} fixedWidth />
          {"\u00A0\u00A0"}
          {result.name.raw}
        </Title>
      )}
      {type !== "user" && result.description.raw && (
        <SubTitle>{getTeaser(result.description.raw.toString())}</SubTitle>
      )}
      {stats !== undefined && (
        <React.Fragment>
          {stats.map((stat, index) => (
            <Tooltip key={index} title={stat.unit} placement="top-start">
              <Stats>
                <ColoredIcon color={stat.color} icon={stat.icon} fixedWidth />
                {" " + abbreviateNumber(stat.value ? stat.value : 0)}
              </Stats>
            </Tooltip>
          ))}
        </React.Fragment>
      )}
      {stats2 !== undefined && type === "data" && (
        <Tooltip
          title="dimensions (rows x columns)"
          placement="top-start"
          style={{
            display: !stats2[0].value ? "none" : "inline-block",
          }}
        >
          <Stats>
            <ColoredIcon color={grey[400]} icon={faTable} fixedWidth />{" "}
            {abbreviateNumber(stats2[0].value)} x{" "}
            {abbreviateNumber(stats2[1].value)}
          </Stats>
        </Tooltip>
      )}
      <Tooltip title={type + " ID"} placement="top-start">
        <Stats>
          <ColoredIcon color={grey[400]} icon={faHashtag} fixedWidth />{" "}
          {result.id.raw}
        </Stats>
      </Tooltip>
      {stats2 !== undefined && type === "run" && scores}

      {type !== "user" && (
        <ColorStats color={grey[400]}>
          <ColoredIcon icon={faHistory} fixedWidth />
          <TimeAgo date={new Date(result.date.raw)} minPeriod={60} />
        </ColorStats>
      )}
      <SubStats color={grey[400]}>
        {dataStatus[result.status] !== undefined && (
          <Tooltip
            title={dataStatus[result.status.raw]["title"]}
            placement="top-start"
          >
            <RightStats>
              <ColoredIcon
                color={dataStatus[result.status.raw]["color"]}
                icon={dataStatus[result.status.raw]["icon"]}
                fixedWidth
              />
            </RightStats>
          </Tooltip>
        )}
        {result.version !== undefined && (
          <VersionStats>v.{result.version.raw}</VersionStats>
        )}
      </SubStats>
    </SearchResultCard>
  );
};

export default ResultCard;
