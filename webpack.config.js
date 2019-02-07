var webpack = require('webpack');
var dotenv = require('dotenv');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

const env = dotenv.config().parsed;
  
const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    publicPath: "/public/",
    filename: 'bundle.js'
  },
  module : {
    rules: [
    {
      test: /\.jsx$/,
	  include: APP_DIR,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader'
      }
    }
  ]
  },
  plugins: [
      new webpack.DefinePlugin(envKeys)
  ]
};

module.exports = config;
