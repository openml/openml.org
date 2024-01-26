import { useEffect, React } from "react";
import Box from "@mui/material/Box";
import { DataGrid as MuiDataGrid } from "@mui/x-data-grid";
import { Card, CardContent, Typography } from "@mui/material";
import styled from "@emotion/styled";

import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const CellContent = styled.span`
  font-weight: ${(props) => (props.isBold ? "bold" : "normal")};
`;

const ChartBox = styled.div`
  width: 200px;
  height: 50px;
`;

const DataGrid = styled(MuiDataGrid)`
  & .MuiDataGrid-row > .MuiDataGrid-cell {
    overflow: visible !important;
  }
`;

// External tooltip handler
// See https://www.chartjs.org/docs/latest/samples/tooltip/html.html
const getOrCreateTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector("div");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.style.background = "rgba(0, 0, 0, 0.7)";
    tooltipEl.style.borderRadius = "3px";
    tooltipEl.style.color = "white";
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.transform = "translate(-50%, 0)";
    tooltipEl.style.transition = "all .1s ease";

    const table = document.createElement("table");
    table.style.margin = "0px";

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

const externalTooltipHandler = (context) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b) => b.lines);

    const tableHead = document.createElement("thead");

    titleLines.forEach((title) => {
      const tr = document.createElement("tr");
      tr.style.borderWidth = 0;

      const th = document.createElement("th");
      th.style.borderWidth = 0;
      const text = document.createTextNode(title);

      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableBody = document.createElement("tbody");
    bodyLines.forEach((body, i) => {
      const colors = tooltip.labelColors[i];

      const span = document.createElement("span");
      span.style.background = colors.backgroundColor;
      span.style.borderColor = colors.borderColor;
      span.style.borderWidth = "2px";
      span.style.marginRight = "10px";
      span.style.height = "10px";
      span.style.width = "10px";
      span.style.display = "inline-block";

      const tr = document.createElement("tr");
      tr.style.backgroundColor = "inherit";
      tr.style.borderWidth = 0;

      const td = document.createElement("td");
      td.style.borderWidth = 0;

      const text = document.createTextNode(body);

      td.appendChild(span);
      td.appendChild(text);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });

    const tableRoot = tooltipEl.querySelector("table");

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + "px";
  tooltipEl.style.top = positionY + tooltip.caretY + "px";
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding =
    tooltip.options.padding + "px " + tooltip.options.padding + "px";
};

function StackedBarChart({ data, chartId, showX, targets }) {
  useEffect(() => {
    if (!data) {
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
            display: showX,
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
  }, [data]);

  return <canvas id={chartId}></canvas>;
}

const FeatureTable = ({ data }) => {
  // Check for targets
  let targets = [];
  // Define the rows for the grid
  const rows = data.map((feature) => {
    const id = feature.index; // Rename index to id
    if (feature.target === "1") {
      targets = feature.distr[0];
    }
    return {
      id,
      ...Object.keys(feature).reduce((acc, key) => {
        acc[key] = feature[key];
        return acc;
      }, {}),
    };
  });

  const columns = [
    { field: "id", headerName: "Index", type: "number", width: 90 },
    {
      field: "name",
      headerName: "Feature Name",
      width: 200,
      editable: true,
      valueGetter: (params) =>
        `${params.row.name} ${params.row.target === "1" ? "(target)" : ""}`,
      renderCell: (params) => {
        const isBold = params.row.target === "1";
        return <CellContent isBold={isBold}>{params.value}</CellContent>;
      },
    },
    {
      field: "type",
      headerName: "Type",
      width: 100,
      editable: true,
    },
    {
      field: "distinct",
      headerName: "Distinct values",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "missing",
      headerName: "Missing values",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "distr",
      headerName: "Distribution",
      width: 200,
      renderCell: (params) => {
        const chartId = `chart-${params.row.id}`; // Assuming each row has a unique 'id'
        return (
          <ChartBox>
            <StackedBarChart
              data={params.value}
              chartId={chartId}
              showX={params.row.target === "1"}
              targets={targets}
            />
          </ChartBox>
        );
      },
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" mb={6}>
          {data.length + " Features"}
        </Typography>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.index}
            sortModel={[
              {
                field: "id",
                sort: "asc",
              },
            ]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10, 20, 50, 100]}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeatureTable;
