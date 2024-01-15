import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Card, CardContent, Tooltip, Typography } from "@mui/material";

const columns = [
  {
    field: "name",
    headerName: "Name",
    width: 200,
  },
  {
    field: "data_type",
    headerName: "Data type",
    width: 120,
  },
  {
    field: "default_value",
    headerName: "Default value",
    width: 200,
  },
  {
    field: "description",
    headerName: "Description",
    width: 400,
  },
];

const ParameterTable = ({ data }) => {
  // Define the rows for the grid

  const rows = data.flatMap((param) => {
    // If the key is 'steps' and it's a valid JSON string, process it
    if (param.name === "steps" && typeof param.default_value === "string") {
      try {
        const stepsArray = JSON.parse(param.default_value);
        if (Array.isArray(stepsArray)) {
          return stepsArray.map((step) => {
            const stepValue = step.value || {};
            return {
              name: `steps.${stepValue.step_name}` || "",
              type: "component",
              default_value: "",
              description: stepValue.key || "",
            };
          });
        }
      } catch (e) {
        console.error("Error parsing JSON:", e);
        // Handle the error or return an empty array
        return [];
      }
    } else {
      // For other cases, just return the original row format
      return [
        {
          id: param.name,
          ...param,
        },
      ];
    }
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" mb={6}>
          {data.length + " Hyperparameters"}
        </Typography>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.name}
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
