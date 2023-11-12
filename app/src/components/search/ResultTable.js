import { DataGrid as MuiDataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Box } from "@mui/material";

const MAX_CELL_LENGTH = 75;
const BASE_PADDING = 1;

const DataGrid = styled(MuiDataGrid)`
  & .MuiDataGrid-columnHeaders {
    background-color: rgba(255, 255, 255, 0.16);
  }
`;

// Calculate a good table column width based on the content
const useAutoWidthColumns = (rows, columnOrder) => {
  const [columnWidths, setColumnWidths] = useState({});
  const context = document.createElement("canvas").getContext("2d");
  context.font = "13px Roboto"; // Should match the DataGrid font

  useEffect(() => {
    const newColumnWidths = {};

    columnOrder.forEach((fieldName) => {
      let maxWidth = BASE_PADDING; // Start with base padding
      rows.forEach((row) => {
        let value = row[fieldName]?.raw ?? row[fieldName];
        value = value && value.toString();
        if (value && value.length > MAX_CELL_LENGTH) {
          value = value.substring(0, MAX_CELL_LENGTH) + "…"; // Truncate the value
        }
        const textWidth = context.measureText(value || "").width;
        maxWidth = Math.max(maxWidth, textWidth + BASE_PADDING); // Add padding to the text width
      });

      // Set a minimum width for the column to avoid too narrow columns for short content
      newColumnWidths[fieldName] = Math.max(maxWidth, 100); // Minimum column width, adjust as necessary
    });

    setColumnWidths(newColumnWidths);
  }, [rows, columnOrder]);

  return columnWidths;
};

// Map the way ElasticSearch returns the data to the way the DataGrid expects it
const valueGetter = (fieldName) => (params) => {
  let value = params.row[fieldName]?.raw ?? params.row[fieldName];
  if (typeof value === "string") {
    // Remove quotes from string values
    return value.replace(/^"(.*)"$/, "$1");
  } else if (Array.isArray(value)) {
    // Process the array and remove quotes from each string element
    return value
      .map((item) => {
        if (item.tag && typeof item.tag === "string") {
          // Remove quotes from string
          return item.tag.replace(/^"(.*)"$/, "$1");
        } else if (typeof item === "string") {
          // Remove quotes from string
          return item.replace(/^"(.*)"$/, "$1");
        }
        // Stringify non-string items
        return JSON.stringify(item);
      })
      .join(", ");
  } else if (value && typeof value === "object") {
    // Stringify object values
    return JSON.stringify(value);
  }
  // Return the value if it's not a string or an object
  return value;
};

// Controls how each cell is rendered
const renderCell = (params) => {
  const value = params.value; // This should be a string after valueGetter's processing
  const displayValue =
    typeof value === "string" && value.length > MAX_CELL_LENGTH
      ? `${value.substring(0, MAX_CELL_LENGTH)}…`
      : value;
  return (
    <div title={typeof value === "string" ? value : "Complex Object"}>
      {displayValue}
    </div>
  );
};

const ResultsTable = ({ results, columnOrder }) => {
  const columnWidths = useAutoWidthColumns(results, columnOrder);

  // Check if there are results
  if (results.length === 0) {
    return <div>No results found</div>;
  }

  // Define the columns based on the keys from the results
  const columns = columnOrder.map((fieldName) => {
    return {
      field: fieldName,
      headerName: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
      width: columnWidths[fieldName] || 150, // Use the calculated width or a default value
      valueGetter: valueGetter(fieldName),
      renderCell: renderCell,
    };
  });

  // Define the rows for the grid
  const rows = results.map((result, index) => {
    // The ID should be unique for each row, so use `data_id.raw` or fallback to index
    const id =
      result.data_id && result.data_id.raw ? result.data_id.raw : index;
    return {
      id,
      // Spread the rest of the keys into this object, extracting raw values where they exist
      ...Object.keys(result).reduce((acc, key) => {
        acc[key] =
          result[key] && result[key].hasOwnProperty("raw")
            ? result[key].raw
            : result[key];
        return acc;
      }, {}),
    };
  });

  // Do something with the selected rows
  // Could be used to e.g. tag a number of datasets or add them to a collection
  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    console.log(selectedRowsData);
  };

  return (
    <Box sx={{ height: "calc(100vh - 192px)", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={rows.length} // Set to the total number of rows
        rowsPerPageOptions={[]}
        hideFooter
        //checkboxSelection // Disabled for now because we don't do anything useful with it yet
        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
      />
    </Box>
  );
};

export default ResultsTable;
