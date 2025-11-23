import React, { useContext } from "react";
import styled from "styled-components";

import { LinearProgress } from "@mui/material";
import { MainContext } from "../App.js";

const Root = styled.div`
  margin-bottom: -4px;
  z-index: 5000;
`;

const Loader = () => {
  const context = useContext(MainContext);

  return (
    <Root
      style={
        context.updateType === "query"
          ? { display: "block" }
          : { display: "none" }
      }
    >
      <LinearProgress m={2} color="secondary" />
    </Root>
  );
};

export default Loader;
