import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Card, CardContent, Tooltip, Typography } from "@mui/material";

const columns = [
  {
    field: "parameter",
    headerName: "Hyperparameter",
    width: 600,
  },
  {
    field: "value",
    headerName: "Value",
    width: 200,
    renderCell: (params) => {
      const maxChars = 50;
      try {
        // Attempt to parse the value as JSON
        const jsonObject = JSON.parse(params.value);
        const prettyJson = JSON.stringify(jsonObject, null, 2);
        const displayText =
          prettyJson && prettyJson.length > maxChars
            ? prettyJson.substring(0, maxChars) + "..."
            : prettyJson;
        return (
          <Tooltip title={<pre>{prettyJson}</pre>} arrow>
            <span>{displayText}</span>
          </Tooltip>
        );
      } catch {
        // If parsing fails, just display the raw string
        return <span>{params.value}</span>;
      }
    },
  },
];

const ParameterTable = ({ data }) => {
  // Define the rows for the grid
  const rows = data.map((param, index) => ({
    id: index,
    parameter: param.parameter.replace(/\(.*?\)/g, ""),
    value: param.value,
  }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" mb={6}>
          {rows.length + " Hyperparameters"}
        </Typography>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
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

export default ParameterTable;
