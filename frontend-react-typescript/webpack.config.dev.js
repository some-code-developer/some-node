const path = require("node:path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CleanTerminalPlugin = require("clean-terminal-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "source-map",
  watch: true,
  entry: { app: "./src/index.tsx" },
  mode: "development",
  // devServer: {
  //   historyApiFallback: true,
  // },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve("./../backend/public/dist/"),
    publicPath: "/dist/",
    clean: true,
  },
  resolve: {
    extensions: [".Webpack.js", ".web.js", ".ts", ".js", ".jsx", ".tsx"],
    plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json", extensions: [".ts", ".js", ".jsx", ".tsx"] })],
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    removeAvailableModules: true,
    removeEmptyChunks: true,
    moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      minSize: 17000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: "-",
      enforceSizeThreshold: 30000,
      cacheGroups: {
        common: {
          test: /[\\/]node_modules[\\/]/,
          priority: -5,
          reuseExistingChunk: true,
          chunks: "initial",
          name: "common-app",
          minSize: 0,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        // we are opting out of defaultVendors, so rest of the node modules will be part of default cacheGroup
        defaultVendors: false,
        reactPackage: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
          name: "vendor-react",
          chunks: "all",
          priority: 10,
        },
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        type: "asset/resource",
      },
      {
        test: /\.svg$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              encoding: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanTerminalPlugin(),
    new HtmlWebpackPlugin({
      filename: `../index.html`,
      template: `assets/template.html`,
      inject: "body",
    }),
    new NodePolyfillPlugin(),
    new ESLintPlugin({
      exclude: ["node_modules"],
      emitWarning: true,
      emitError: true,
      failOnError: false,
      failOnWarning: false,
    }),
  ],
};
