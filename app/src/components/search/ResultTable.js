import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const MAX_CELL_LENGTH = 75;
const BASE_PADDING = 10;

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

const stripQuotes = (value) => {
  // This will remove all instances of double quotes from the string
  return value.replace(/["]+/g, "");
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
      valueGetter: (params) => {
        const rawValue = params.row[fieldName]?.raw ?? params.row[fieldName];
        // Convert to string and strip quotes if it's a string
        return typeof rawValue === "string" ? stripQuotes(rawValue) : rawValue;
      },
      renderCell: (params) => {
        // Assume params.value is already a string here
        const value = params.value ? stripQuotes(params.value.toString()) : "";
        const truncatedValue =
          value.length > MAX_CELL_LENGTH
            ? `${value.substring(0, MAX_CELL_LENGTH)}…`
            : value;
        return <div title={value}>{truncatedValue}</div>;
      },
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

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={rows.length} // Set to the total number of rows
      rowsPerPageOptions={[]}
      hideFooter
      // checkboxSelection
    />
  );
};

export default ResultsTable;
