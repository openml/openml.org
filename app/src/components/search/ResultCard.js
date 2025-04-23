import React from "react";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";

import styled from "@emotion/styled";
import { Box, Card, Tooltip } from "@mui/material";

import TimeAgo from "react-timeago";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { grey } from "@mui/material/colors";
import * as colors from "@mui/material/colors";
import { abbreviateNumber } from "../../utils/helpers";

import {
  Title as DataTitle,
  Description as DataDescription,
  stats as dataStats,
} from "./dataCard";
import {
  Title as TaskTitle,
  Description as TaskDescription,
  stats as taskStats,
} from "./taskCard";
import {
  Title as FlowTitle,
  Description as FlowDescription,
  stats as flowStats,
} from "./flowCard";
import {
  Title as RunTitle,
  Description as RunDescription,
  stats as runStats,
} from "./runCard";

import { faHashtag, faHistory } from "@fortawesome/free-solid-svg-icons";

const SearchResultCard = styled(Card)`
  height: 100%;
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

const titles = {
  data: DataTitle,
  task: TaskTitle,
  flow: FlowTitle,
  run: RunTitle,
  // Add other mappings as needed
};

const descriptions = {
  data: DataDescription,
  task: TaskDescription,
  flow: FlowDescription,
  run: RunDescription,
  // Add other mappings as needed
};

const statistics = {
  data: dataStats,
  task: taskStats,
  flow: flowStats,
  run: runStats,
  // Add other mappings as needed
};

const ResultCard = ({ result }) => {
  const theme = useTheme();
  const router = useRouter();

  const type = result._meta.rawHit._type;
  const color = theme.palette.entity[type];
  const icon = theme.palette.icon[type];

  // Select the result card contents depending on the entity type
  const Title = titles[type];
  const Description = descriptions[type];
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
      <Description result={result} />
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
      <Box sx={{ flexGrow: 1 }} />
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
