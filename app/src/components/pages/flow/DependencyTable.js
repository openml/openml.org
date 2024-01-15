import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Card, CardContent, Typography } from "@mui/material";

const columns = [
  { field: "library", headerName: "Library", width: 120 },
  { field: "version", headerName: "Version", width: 90 },
];

const DependencyTable = ({ data }) => {
  // Split on ',' and '/n'
  const rows = data.split(/[,\n]+/).map((dependency) => {
    // Split on '==', '<=', '>=', '<', '>', and '_'
    const match = dependency.match(/([<>]?=|_)/);
    const index = match ? dependency.indexOf(match[0]) : -1;

    // Extract the library and version based on the index of the version specifier
    const library = index > -1 ? dependency.substring(0, index) : dependency;
    const version = index > -1 ? dependency.substring(index) : "";

    return {
      library: library,
      version: version.replace(/_/g, "").replace(/([=><]+)([^ ])/, "$1 $2"),
    };
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" mb={6}>
          {rows.length + " Dependencies"}
        </Typography>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.library}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default DependencyTable;
