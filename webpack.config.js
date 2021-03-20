const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");

module.exports = (env) => {
  console.log(env.local, "🔥");
  if (env.local) {
    dotenv.config();
  }

  return {
    entry: "./src/index.js",
    output: {
      filename: "main.[contentHash].js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
      new webpack.DefinePlugin({
        LOCAL: env.local,
      }),
      new webpack.EnvironmentPlugin({
        IPINFO_TOKEN: "",
        WEATHER_API_KEY: "",
      }),
    ],
    devServer: {
      contentBase: path.join(__dirname, "dist"),
    },
    devtool: "source-map",
  };
};
