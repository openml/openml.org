import React from "react";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";

import styled from "@emotion/styled";
import { Card, Tooltip } from "@mui/material";

import TimeAgo from "react-timeago";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { grey } from "@mui/material/colors";
import * as colors from "@mui/material/colors";

import { Title as DataTitle, stats as dataStats } from "../../pages/d/dataCard";
import { Title as TaskTitle, stats as taskStats } from "../../pages/t/taskCard";

import { faHashtag, faHistory } from "@fortawesome/free-solid-svg-icons";
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
const TitleWrapper = styled.div`
  padding-bottom: 5px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: baseline;
`;

// Helper functions to get nested properties like 'qualities.raw.NumberOfClasses'
const getNestedProperty = (obj, path) => {
  return path.split(".").reduce((currentObject, key) => {
    return currentObject?.[key];
  }, obj);
};
const getStats = (stats, result) => {
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

const titles = {
  data: DataTitle,
  task: TaskTitle,
  // Add other mappings as needed
};

const statistics = {
  data: dataStats,
  task: taskStats,
  // Add other mappings as needed
};

const ResultCard = ({ result }) => {
  const theme = useTheme();
  const router = useRouter();

  const type = result._meta.rawHit._type;
  const color = theme.palette.entity[type];
  const icon = theme.palette.icon[type];

  const Title = titles[type];
  const stats = getStats(statistics[type], result);

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
      <TitleWrapper>
        <ColoredIcon color={color} icon={icon} fixedWidth />
        <Title result={result} />
      </TitleWrapper>
      {type !== "task" && result.description.raw && (
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
      <ColorStats color={grey[400]}>
        <ColoredIcon icon={faHistory} fixedWidth />
        <TimeAgo date={new Date(result.date.raw)} minPeriod={60} />
      </ColorStats>
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

// Old code to get random colors. TODO: remove
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

export default ResultCard;
