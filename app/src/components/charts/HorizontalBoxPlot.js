import React, { useEffect } from "react";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";
import { Chart, registerables } from "chart.js";
import { externalTooltipHandler } from "../charts/helpers";
Chart.register(...registerables, BoxPlotController, BoxAndWiskers);

const HorizontalBoxPlot = (props) => {
  const { data, chartId } = props;

  useEffect(() => {
    if (!data) {
      return;
    }

    const ctx = document.getElementById(chartId).getContext("2d");

    // Calculate box plot data
    // Simplified. Server should return median and quantiles for correct results
    const boxplotData = {
      min: data.min,
      whiskerMin: data.min,
      q1: data.mean - data.stdev,
      median: data.mean,
      mean: data.mean,
      q3: data.mean + data.stdev,
      max: data.max,
      whiskerMax: data.max,
    };

    const chartData = {
      labels: [""],
      datasets: [
        {
          label: "",
          data: [boxplotData],
        },
      ],
    };

    const myChart = new Chart(ctx, {
      type: "boxplot",
      data: chartData,
      options: {
        indexAxis: "y",
        minStats: "whiskerMin",
        maxStats: "whiskerMax",
        responsive: true,
        maintainAspectRatio: false,
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
        scales: {
          x: {
            min: data.min,
            max: data.max,
            ticks: {
              font: {
                size: 10,
              },
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [data, chartId]);

  return <canvas id={chartId}></canvas>;
};

export default HorizontalBoxPlot;
