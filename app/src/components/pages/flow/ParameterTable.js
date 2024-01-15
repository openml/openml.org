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
    renderCell: (params) => {
      try {
        // Attempt to parse the value as JSON
        const jsonObject = JSON.parse(params.value);
        const prettyJson = JSON.stringify(jsonObject, null, 2);

        return (
          <Tooltip title={<pre>{prettyJson}</pre>} arrow>
            <span>{prettyJson.substring(0, 50)}...</span>
          </Tooltip>
        );
      } catch {
        // If parsing fails, just display the raw string
        return <span>{params.value}</span>;
      }
    },
  },
  {
    field: "description",
    headerName: "Description",
    width: 400,
    renderCell: (params) => {
      // Maximum characters to display in the cell
      const maxChars = 50; // Adjust as needed

      // Truncate the description and add an ellipsis if it exceeds maxChars
      const displayText =
        params.value && params.value.length > maxChars
          ? params.value.substring(0, maxChars) + "..."
          : params.value;

      return (
        <Tooltip
          title={<Box>{params.value}</Box>}
          arrow
          placement="top"
          style={{ maxWidth: "400px" }}
        >
          <span>{displayText}</span>
        </Tooltip>
      );
    },
  },
];

const ParameterTable = ({ data }) => {
  // Define the rows for the grid
  const rows = data.flatMap((param) => {
    // Initialize an array to hold the processed rows
    let processedRows = [];

    // Add the original param row (for both 'steps' and other cases)
    processedRows.push({
      id: param.name,
      ...param,
    });

    // If the key is 'steps' and it's a valid JSON string, process it
    if (param.name === "steps" && typeof param.default_value === "string") {
      try {
        const stepsArray = JSON.parse(param.default_value);
        if (Array.isArray(stepsArray)) {
          // Generate rows from the stepsArray and add them to the processed rows
          const stepsRows = stepsArray.map((step) => {
            const stepValue = step.value || {};
            return {
              name: `steps > ${stepValue.step_name}` || "",
              type: "component",
              default_value: "",
              description: stepValue.key || "",
            };
          });
          processedRows = processedRows.concat(stepsRows);
        }
      } catch (e) {
        console.error("Error parsing JSON:", e);
        // Handle the error
      }
    }

    // Return the accumulated processed rows
    return processedRows;
  });

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
