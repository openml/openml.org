import React, { useEffect } from "react";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";
import { Chart, registerables } from "chart.js";
import { externalTooltipHandler } from "./helpers";
import { useTheme } from "@mui/material/styles";
Chart.register(...registerables, BoxPlotController, BoxAndWiskers);

const StackedBarChart = (props) => {
  const { data, chartId, showX, targets } = props;
  const theme = useTheme();

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }
    const ctx = document.getElementById(chartId).getContext("2d");

    // Assuming data is in the format: [categories, [class1Data, class2Data, ...]]
    const categories = data[0];
    const classData = data[1];

    // Transpose classData to get data per category
    const transposedData = categories.map((_, ci) =>
      classData.map((row) => row[ci]),
    );

    const datasets = transposedData.map((data, index) => ({
      label: targets[index],
      data: data,
      borderWidth: 1,
    }));

    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: categories,
        datasets: datasets,
      },
      options: {
        scales: {
          x: {
            stacked: true,
            display: showX || categories.length < 5,
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

export default StackedBarChart;
