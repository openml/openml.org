import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Card, CardContent, Typography } from "@mui/material";
import styled from "@emotion/styled";
import BarChart from "../charts/BarChart";

const ChartBox = styled.div`
  width: 275px;
  height: 50px;
`;

const columns = [
  { field: "measure", headerName: "Evaluation measure", width: 240 },
  { field: "value", headerName: "Value", width: 200 },
  {
    field: "array_data",
    headerName: "Per class",
    width: 280,
    renderCell: (params) => {
      const chartId = `chart-${params.row.id}`;
      return (
        <ChartBox>
          <BarChart
            data={params.value}
            chartId={chartId}
            showX={params.row.target === "1"}
            targets={params.row.targets}
          />
        </ChartBox>
      );
    },
  },
  { field: "per_fold", headerName: "Per fold", width: 200 },
];

const EvaluationTable = ({ data }) => {
  const rows = data.evaluations.map((item, index) => ({
    id: index,
    measure: item.evaluation_measure,
    value: item.value !== undefined ? `${item.value} +- ${item.stdev}` : "",
    array_data: item.array_data,
    per_fold: item.per_fold,
    targets: data.run_task.target_values,
  }));
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" mb={6}>
          {rows.length + " Evaluation metrics"}
        </Typography>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 20,
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

export default EvaluationTable;
