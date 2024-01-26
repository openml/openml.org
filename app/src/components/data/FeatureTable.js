import { useEffect, React } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Card, CardContent, Typography } from "@mui/material";
import styled from "@emotion/styled";

import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const CellContent = styled.span`
  font-weight: ${(props) => (props.isBold ? "bold" : "normal")};
`;

const ChartBox = styled.div`
  width: 400px;
  height: 100px;
`;

function StackedBarChart({ data, chartId }) {
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
      label: `Class ${index + 1}`,
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
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [data]);

  return <canvas id={chartId} width="400" height="400"></canvas>;
}

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
    width: 400,
    renderCell: (params) => {
      const chartId = `chart-${params.row.id}`; // Assuming each row has a unique 'id'
      return (
        <ChartBox>
          <StackedBarChart data={params.value} chartId={chartId} />
        </ChartBox>
      );
    },
  },
];

const FeatureTable = ({ data }) => {
  // Define the rows for the grid
  const rows = data.map((feature) => {
    const id = feature.index; // Rename index to id
    return {
      id,
      ...Object.keys(feature).reduce((acc, key) => {
        acc[key] = feature[key];
        return acc;
      }, {}),
    };
  });

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
            getRowHeight={(row) => 100}
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
