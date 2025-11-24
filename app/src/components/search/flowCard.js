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
import Teaser from "./Teaser";

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

export function shortenName(str) {
  // Function to keep only the last part of the module name
  const simplifyModuleName = (moduleName) => {
    return moduleName.split(".").pop();
  };

  // Function to process nested components
  const processNestedComponent = (nestedStr) => {
    // Match the outermost parentheses and process the content inside them
    return nestedStr.replace(
      /(\w+(?:\.\w+)+)\(([^)]+)\)/g,
      (match, p1, innerContent) => {
        // Split the inner content by comma, respecting nested parentheses
        const nestedParameters = splitRespectingParens(innerContent)
          .map(processComponent)
          .join(",");
        return `${simplifyModuleName(p1)}(${nestedParameters})`;
      },
    );
  };

  // Function to split a string by commas, respecting nested parentheses
  const splitRespectingParens = (str) => {
    let parts = [];
    let level = 0;
    let buffer = "";

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char === "(") level++;
      if (char === ")") level--;

      if (level === 0 && char === ",") {
        parts.push(buffer);
        buffer = "";
      } else {
        buffer += char;
      }
    }

    if (buffer) parts.push(buffer);
    return parts;
  };

  // Function to process each component
  const processComponent = (component) => {
    const firstEqualIndex = component.indexOf("=");
    const name = component.substring(0, firstEqualIndex);
    const value = component.substring(firstEqualIndex + 1);

    if (value.includes("(")) {
      return `${simplifyModuleName(name)}=${processNestedComponent(value)}`;
    } else {
      return `${simplifyModuleName(name)}=${simplifyModuleName(value)}`;
    }
  };

  // Extract the main library and pipeline component
  const libraryRegex = /^(\w+(?:\.\w+)+)\.(\w+)\((.*)\)$/;
  const libraryMatch = str.match(libraryRegex);
  if (!libraryMatch) return str;

  const library = libraryMatch[1].split(".")[0];
  const pipelineComponent = simplifyModuleName(libraryMatch[2]);
  const components = libraryMatch[3];

  const processedComponents = splitRespectingParens(components)
    .map(processComponent)
    .join(",");

  let shortName = `${library}.${pipelineComponent}(${processedComponents})`;
  shortName = shortName
    .replace(new RegExp("sklearn.pipeline.", "g"), "")
    .replace(new RegExp("sklearn.compose._column_transformer.", "g"), "")
    .replace(
      new RegExp("sklearn.preprocessing._function_transformer.", "g"),
      "",
    )
    .replace(new RegExp("sklearn.preprocessing.imputation.", "g"), "")
    .replace(new RegExp("sklearn.preprocessing.data.", "g"), "");

  return shortName;
}

export const Title = ({ result }) => {
  return (
    <React.Fragment>
      <Box sx={{ pl: 2, wordBreak: "break-all" }}>
        {result.name?.raw ? shortenName(result.name.raw) : "Unnamed Flow"}
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
