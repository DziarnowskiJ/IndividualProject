/* 
Credit where credit is due

Almost the whole code comes from Phaser Webpack Template developed by photonstorm
Precisely from base.js file
available at: https://github.com/photonstorm/phaser3-project-template/blob/master/webpack/base.js

From the original version it differs by additional plugin - Dotenv
and devServer configuration
*/

const Dotenv = require('dotenv-webpack');
const webpack = require("webpack");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: "file-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "../")
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
    new Dotenv({
      path: '../.env',
    })
  ],
  devServer: {
    inline:true,
    port: process.env.clientPort || 8080
  },
};