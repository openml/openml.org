import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Card, CardContent, Typography } from "@mui/material";
import styled from "@emotion/styled";
import BarChart from "../charts/BarChart";
import { grey } from "@mui/material/colors";

const ChartBox = styled.div`
  width: 275px;
  height: 50px;
`;

const ChartBoxSmall = styled.div`
  width: 135px;
  height: 50px;
`;

const columns = [
  { field: "measure", headerName: "Evaluation measure", width: 240 },
  {
    field: "value",
    headerName: "Value",
    width: 200,
    renderCell: (params) => {
      const parts = params.value.split("±");
      // Check if the split operation found a "±" and thus split the text into two parts
      if (parts.length === 2) {
        return (
          <div>
            {parts[0]}
            <span style={{ color: grey[500] }}>&plusmn;{parts[1]}</span>
          </div>
        );
      } else {
        // If there's no "±" symbol in the text, just return the original text
        return <div>{params.value}</div>;
      }
    },
  },
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
            showColors={true}
            targets={params.row.targets}
          />
        </ChartBox>
      );
    },
  },
  {
    field: "per_fold",
    headerName: "Per fold",
    width: 145,
    renderCell: (params) => {
      const chartId = `foldchart-${params.row.id}`;
      const values = Array.isArray(params.value) ? params.value.flat() : [];
      return (
        <ChartBoxSmall>
          <BarChart
            data={values}
            chartId={chartId}
            showX={false}
            showColors={false}
            targets={[...Array(values.length).keys()]}
          />
        </ChartBoxSmall>
      );
    },
  },
];

const EvaluationTable = ({ data }) => {
  const rows = data.evaluations.map((item, index) => ({
    id: index,
    measure: item.evaluation_measure,
    value: item.value !== undefined ? `${item.value} \u00B1 ${item.stdev}` : "",
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
