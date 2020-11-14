const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (_env, options) => {
  if (options.mode == null) {
    console.warn("WARNING: No mode was set. Will default to `development`");
  }
  const NODE_ENV = options.mode || "development";

  const configPath = path.resolve(__dirname, `./config/${NODE_ENV}.json`);
  const config = require(configPath);
  const {
    private: { HOST, PORT },
    ...publicVars
  } = config;

  const defineVars = Object.entries(publicVars).reduce((acc, [key, value]) => {
    acc[key] = JSON.stringify(value);
    return acc;
  }, {});

  console.log("NODE_ENV: ", NODE_ENV);
  console.log("APP_CONFIG: ", defineVars);

  return {
    entry: "./src/index.tsx",
    output: {
      filename: "[name].[contenthash].js",
      path: path.resolve(__dirname, "./public"),
      publicPath: "/",
    },
    plugins: [
      // Check `config/development.json` to see what vars get passed to `window`.
      // Everything except for the `private` key is included.
      new webpack.DefinePlugin({ "process.env": defineVars }),
      new webpack.ProgressPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].[hash].css",
        chunkFilename: "[id].[hash].css",
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: config.PAGE_TITLE,
        template: "./src/index.html",
      }),
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".json"],
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /(\.mod)?\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[name]__[local]--[hash:base64:5]",
                },
              },
            },
            "postcss-loader",
          ],
        },
        {
          test: /\.(png|svg|jpg|gif|mp4|webm)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "./images/",
                publicPath: "/images/",
                name: (_file) => {
                  if (NODE_ENV === "development") {
                    return "[name].[ext]";
                  }

                  return "[contenthash].[ext]";
                },
              },
            },
          ],
        },
      ],
    },

    stats: { children: false },
    devServer: {
      contentBase: path.join(__dirname, "public"),
      compress: true,
      host: HOST, // Probably localhost in development
      port: PORT, // Probably 8080 in development
      historyApiFallback: true,
    },
  };
};
