import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Card, CardContent, Typography } from "@mui/material";
import styled from "@emotion/styled";

const CellContent = styled.span`
  font-weight: ${(props) => (props.isBold ? "bold" : "normal")};
`;

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
