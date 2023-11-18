import { DataGrid as MuiDataGrid } from "@mui/x-data-grid";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { useRouter } from "next/router";

const MAX_CELL_LENGTH = 75;

const DataGrid = styled(MuiDataGrid)`
  & .MuiDataGrid-columnHeaders {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .MuiDataGrid-row {
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
`;

// Map the way ElasticSearch returns the data to the way the DataGrid expects it
export const valueGetter = (fieldName) => (params) => {
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

// Builds a default column definition
export const buildDefaultColumns = (columnOrder) => {
  return columnOrder.map((fieldName) => {
    return {
      field: fieldName,
      headerName: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
      valueGetter: valueGetter(fieldName),
      renderCell: renderCell,
    };
  });
};

const ResultsTable = ({ results, columns }) => {
  const router = useRouter();

  // Check if there are results
  if (results.length === 0) {
    return <div>No results found</div>;
  }

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

  // Go to detail page on click
  const handleRowClick = (params) => {
    // Assuming 'id' is the field you want to use for navigation
    const basePath = router.pathname.split("/")[1];
    const id = params.row.id;
    router.push(`/${basePath}/${id}`);
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
        onRowClick={handleRowClick}
      />
    </Box>
  );
};

export default ResultsTable;
