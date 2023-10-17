const path = require("path");

module.exports = {
  transpilePackages: [
    "@babel/preset-react",
    "@mui/system",
    "@mui/material",
    "@mui/icons-material",
    "@mui/x-data-grid",
    "@mui/x-date-pickers",
  ],
  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material//{{member}}",
    },
    "@mui/icons-material": {
      transform: "@mui/icons-material//{{member}}",
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "removeViewBox",
                  active: false,
                },
              ],
            },
          },
        },
      ],
    });
    config.resolve.alias["@"] = path.resolve(__dirname);

    return config;
  },
};
