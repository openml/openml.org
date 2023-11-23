import { DataGrid as MuiDataGrid } from "@mui/x-data-grid";
import styled from "@emotion/styled";
import { Box, IconButton, Snackbar } from "@mui/material";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faCopy, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "next-i18next";

import Teaser from "../../components/search/Teaser";
import TimeAgo from "react-timeago";
import Chip from "@mui/material/Chip";

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
    if (Object.keys(value).length === 0) {
      return "";
    }
    // Stringify object values
    return JSON.stringify(value);
  }
  // Return the value if it's not a string or an object
  return value;
};

// Controls how each cell is rendered
const renderCell = (params) => {
  let value = params.value; // This should be a string after valueGetter's processing

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

// To display a snackbar when the user copies a cell value
// we need to make this a higher-order component. The
// `setOpen` function is used to open the snackbar, which
// is defined in the parent component.
export const copyCell = (setOpen) => {
  const CopyCellComponent = (params) => {
    return (
      <IconButton
        color="primary"
        onClick={(event) => {
          navigator.clipboard.writeText(params.value);
          setOpen(true);
          event.stopPropagation();
        }}
        size="small"
      >
        <FontAwesomeIcon icon={faCopy} />
      </IconButton>
    );
  };

  CopyCellComponent.displayName = "CopyCell";
  return CopyCellComponent;
};

// Renders chips in table view
// Higher-order component to pass the `getChipProps` function
export const renderChips = (getChipProps) => {
  const RenderChips = (params) => {
    const { label, icon, color } = getChipProps(params.value);
    return (
      <div title={label}>
        <Chip
          icon={icon}
          label={label}
          color={color}
          size="small"
          variant="outlined"
        />
      </div>
    );
  };

  // Assign a display name for DevTools
  RenderChips.displayName = `RenderChips`;

  return RenderChips;
};

export const renderTags = (params) => {
  const { value } = params;

  // Return nothing if the label is empty
  if (!value) {
    return null;
  }

  // Split the label by commas to create an array of tags
  const labels = value
    .split(",")
    .map((label) => label.trim())
    .filter((label) => label);

  // Determine if there are more than 3 labels
  const hasMore = labels.length > 3;

  // Slice the array to the first 3 labels if there are more than 3
  const visibleLabels = hasMore ? labels.slice(0, 3) : labels;

  // Map each tag to a Chip component and add a margin for spacing
  const chips = visibleLabels.map((label, index) => (
    <Chip
      key={index}
      label={label}
      size="small"
      variant="outlined"
      sx={{ marginRight: "4px" }} // Add small space around the chip
    />
  ));

  return (
    <div title={value} style={{ display: "flex", flexWrap: "wrap" }}>
      {chips}
      {hasMore && (
        <Chip
          icon={<FontAwesomeIcon icon={faEllipsis} />}
          size="small"
          variant="outlined"
          sx={{ paddingLeft: "8px" }} // Match the margin of other chips
        />
      )}
    </div>
  );
};

export const renderDate = (params) => {
  return <TimeAgo date={new Date(params.value)} minPeriod={60} />;
};

export const renderDescription = (params) => {
  return (
    <div title={params.value}>
      <Teaser description={params.value} lines={3} />
    </div>
  );
};

const ResultsTable = ({ results, columns }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false); // Snackbar
  const { t } = useTranslation();

  // Check if there are results
  if (results.length === 0) {
    return <div>No results found</div>;
  }

  // Links the setOpen callback to the copyCell function to open
  // the snackbar when the user copies a cell value.
  const linkedColumns = columns.map((col) => {
    if (col.copyMessage) {
      return {
        ...col,
        renderCell: (params) => copyCell(setOpen)(params), // Wrap the call to copyCell with setOpen
      };
    }
    return col;
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
  };

  // Go to detail page on click
  const handleRowClick = (params) => {
    // Assuming 'id' is the field you want to use for navigation
    console.log(params);
    const basePath = router.pathname.split("/")[1];
    const id = params.row.id;
    router.push(`/${basePath}/${id}`);
  };

  return (
    <Box sx={{ height: "calc(100vh - 192px)", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={linkedColumns}
        pageSize={rows.length} // Set to the total number of rows
        rowsPerPageOptions={[]}
        hideFooter
        //checkboxSelection // Disabled for now because we don't do anything useful with it yet
        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
        onRowClick={handleRowClick}
      />
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={2000}
        message={t("search.copied")}
        onClose={() => setOpen(false)}
      />
    </Box>
  );
};

export default ResultsTable;
