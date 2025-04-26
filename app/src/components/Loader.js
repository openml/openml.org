import React from "react";
import { styled } from "@mui/material/styles";
import { LinearProgress } from "@mui/material";

const Root = styled("div")({
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
});

export default function Loader() {
  return (
    <Root>
      <LinearProgress />
    </Root>
  );
}
