import React from "react";
import styled from "@emotion/styled";
import { LinearProgress } from "@mui/material";

const Root = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
`;

export default function Loader() {
  return (
    <Root>
      <LinearProgress />
    </Root>
  );
}
