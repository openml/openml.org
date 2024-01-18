import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Card, CardContent, Typography } from "@mui/material";

const columns = [
  {
    field: "quality",
    headerName: "Quality Name",
    width: 400,
    editable: true,
  },
  {
    field: "value",
    headerName: "Value",
    width: 100,
    editable: true,
    type: "number",
  },
];

const QualityTable = ({ data }) => {
  // Define the rows for the grid
  const rows = Object.keys(data).map((key) => ({
    id: key,
    quality: key,
    value: data[key],
  }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" mb={6}>
          {Object.keys(data).length + " Qualities (meta-features)"}
        </Typography>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5, 10, 20, 50, 100]}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default QualityTable;
