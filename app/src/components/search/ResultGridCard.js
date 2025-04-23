import { Grid } from "@mui/material";
import React from "react";
import ResultCard from "./ResultCard";

const ResultGridCard = ({ result }) => {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <ResultCard result={result} />
    </Grid>
  );
};

export default ResultGridCard;
