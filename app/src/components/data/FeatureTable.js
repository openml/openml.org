import React from "react";
import Box from "@mui/material/Box";
import { DataGrid as MuiDataGrid } from "@mui/x-data-grid";
import { Card, CardContent, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { useTranslation } from "next-i18next";

import StackedBarChart from "../charts/StackedBarChart";
import HorizontalBoxPlot from "../charts/HorizontalBoxPlot";

const CellContent = styled.span`
  font-weight: ${(props) => (props.isBold ? "bold" : "normal")};
`;

const ChartBox = styled.div`
  width: 275px;
  height: 50px;
`;

const DataGrid = styled(MuiDataGrid)`
  & .MuiDataGrid-row > .MuiDataGrid-cell {
    overflow: visible !important;
  }
`;

const FeatureTable = ({ data }) => {
  const { t } = useTranslation();
  // Check for targets
  let targets = [];
  // Define the rows for the grid
  const rows = data.map((feature) => {
    console.log("Feature:", feature);
    const id = feature.index; // Rename index to id
    if (feature.target === "1" && feature.distr) {
      targets = feature.distr[0];
    }
    return {
      id,
      ...Object.keys(feature).reduce((acc, key) => {
        acc[key] = feature[key];
        return acc;
      }, {}),
    };
  });

  const columns = [
    //{ field: "id", headerName: "Index", type: "number", width: 90 },
    {
      field: "name",
      headerName: t("tableheader.feature"),
      width: 200,
      editable: true,
      renderCell: (params) => {
        const isBold = params.row.target === "1";
        return (
          <CellContent isBold={isBold}>
            {params.value} {isBold && " (target)"}
          </CellContent>
        );
      },
    },
    {
      field: "distr",
      headerName: t("tableheader.distribution"),
      width: 280,
      renderCell: (params) => {
        const chartId = `chart-${params.row.id}`;
        const stats = {
          min: parseFloat(params.row.min),
          max: parseFloat(params.row.max),
          mean: parseFloat(params.row.mean),
          stdev: parseFloat(params.row.stdev),
        };
        return (
          <ChartBox>
            {params.row.type === "nominal" ? (
              <StackedBarChart
                data={params.value}
                chartId={chartId}
                showX={params.row.target === "1"}
                targets={targets}
              />
            ) : params.row.type === "numeric" ? (
              <HorizontalBoxPlot data={stats} chartId={chartId} />
            ) : null}
          </ChartBox>
        );
      },
    },
    {
      field: "type",
      headerName: t("tableheader.type"),
      width: 90,
      editable: true,
      align: "right",
    },
    {
      field: "distinct",
      headerName: t("tableheader.distinct"),
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "missing",
      headerName: t("tableheader.missing"),
      type: "number",
      width: 110,
      editable: true,
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" mb={6}>
          {data.length + " " + t("tabletitle.features")}
        </Typography>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.index}
            sortModel={[
              {
                field: "id",
                sort: "asc",
              },
            ]}
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

export default FeatureTable;
