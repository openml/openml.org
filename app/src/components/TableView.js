import React from "react";

import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";

function TableView() {
  const { data } = useDemoData({
    dataSet: "Commodity",
    rowLength: 100000,
    editable: true,
  });

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <DataGrid
        {...data}
        loading={data.rows.length === 0}
        rowHeight={50}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}

export default TableView;
