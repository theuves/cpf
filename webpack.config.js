"use strict";
const path = require("path");
const webpack = require("webpack");
const pkg = require("./package.json");
const {name, version, author} = pkg;
const year = (new Date()).getFullYear();
const banner = `${name} v${version} | (c) ${year} by ${author}`;

module.exports = {
  entry: {
    "piii": "./index.js",
    "piii.min": "./index.js"
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    library: "CPF",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets: ["env"]
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/
    }),
    new webpack.BannerPlugin(banner)
  ],
  stats: {
    colors: true
  }
};
