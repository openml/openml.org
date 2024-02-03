import React, { useEffect } from "react";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";
import { Chart, registerables } from "chart.js";
import { externalTooltipHandler } from "./helpers";
import { useTheme } from "@mui/material/styles";
Chart.register(...registerables, BoxPlotController, BoxAndWiskers);

import { blue, green, orange, purple, red } from "@mui/material/colors";
import { alpha } from "@mui/material/styles"; // Import alpha utility if you're using MUI v5 or later

const BarChart = (props) => {
  const { data, chartId, showX, showColors, targets } = props;
  const theme = useTheme();

  // Function to get color array
  const muiColors = [blue[500], green[500], orange[500], purple[500], red[500]];
  const getColorArray = () => {
    return data.map((_, index) =>
      alpha(muiColors[index % muiColors.length], 0.6),
    );
  };
  const getBorderColorArray = () => {
    return data.map((_, index) => muiColors[index % muiColors.length]);
  };

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }
    const ctx = document.getElementById(chartId).getContext("2d");
    const colors = showColors ? getColorArray() : null;
    const bordercolors = showColors ? getBorderColorArray() : null;

    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: targets,
        datasets: [
          {
            data: data,
            borderWidth: 1,
            backgroundColor: colors,
            borderColor: bordercolors,
          },
        ],
      },
      options: {
        scales: {
          x: {
            stacked: true,
            display: showX || (targets && targets.length < 5),
            ticks: {
              color: theme.palette.text.primary,
              font: {
                size: 10,
              },
            },
          },
          y: {
            stacked: true,
            display: false,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
            position: "nearest",
            external: externalTooltipHandler,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [data, chartId, showX, targets, theme]);

  return <canvas id={chartId}></canvas>;
};

export default BarChart;
