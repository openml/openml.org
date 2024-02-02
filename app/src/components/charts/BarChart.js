import React, { useEffect } from "react";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";
import { Chart, registerables } from "chart.js";
import { externalTooltipHandler } from "./helpers";
Chart.register(...registerables, BoxPlotController, BoxAndWiskers);

const BarChart = (props) => {
  const { data, chartId, showX, targets } = props;
  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }
    const ctx = document.getElementById(chartId).getContext("2d");

    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: targets,
        datasets: [
          {
            data: data,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            stacked: true,
            display: showX || (targets && targets.length < 5),
            ticks: {
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
  }, [data, chartId, showX, targets]);

  return <canvas id={chartId}></canvas>;
};

export default BarChart;
