import { Grid } from "@mui/material";
import React from "react";
import ResultCard from "./ResultCard";

const ResultGridCard = ({ result }) => {
  return (
    <Grid
      size={{
        xs: 12,
        sm: 12, // 1 column on extra small screens (12/12 = full width)
        md: 12, // 1 column on extra small screens (12/12 = full width)
        lg: 6, // 2 columns on small screens (12/6 = 2 items)
        xl: 4, // 3 columns on large screens (12/4 = 3 items)
        xxl: 3, // 4 columns on extra large screens (12/3 = 4 items)
      }}
    >
      <ResultCard result={result} />
    </Grid>
  );
};

export default ResultGridCard;
