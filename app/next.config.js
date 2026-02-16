const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  transpilePackages: [
    "@babel/preset-react",
    "@mui/system",
    "@mui/material",
    "@mui/icons-material",
    "@mui/x-data-grid",
    "@mui/x-date-pickers",
    "plotly.js",
    "react-plotly.js",
    "apache-arrow",
  ],
  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material//{{member}}",
    },
    "@mui/icons-material": {
      transform: "@mui/icons-material//{{member}}",
    },
  },
  i18n,
  reactStrictMode: true,
};

module.exports = nextConfig;
