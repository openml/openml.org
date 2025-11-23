const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");

module.exports = {
  devServer: {
    stats: {
      assets: false,
      chunks: false,
    },
  },
};

module.exports = function override(config, env) {
  config.plugins.push(
    new NodePolyfillPlugin({
      excludeAliases: [],
    }),
  );
  config.resolve.plugins = config.resolve.plugins.filter(
    (plugin) => !(plugin instanceof ModuleScopePlugin),
  );
  return config;
};
