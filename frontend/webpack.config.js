var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    lobby: "./src/lobby/index.js",
    game: "./src/game/index.js",
  },
  output: {
    filename: "[name].js",
  },
  devtool: "source-map",
  mode: "development", // none, development, production
  devServer: {
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      filename: "./index.html", //relative to root of the application
      title: "2K Chess Lobby",
      template: "./src/lobby/index.html",
      chunks: ["lobby"],
    }),
    new HtmlWebpackPlugin({
      hash: true,
      filename: "./game", //relative to root of the application
      title: "Play chess!",
      template: "./src/game/index.html",
      chunks: ["game"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8000, // Convert images < 8kb to base64 strings
              name: "images/[hash]-[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(fbx)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(gltf)$/,
        use: [
          {
            loader: "gltf-webpack-loader",
          },
        ],
      },
      {
        test: /\.(bin)$/,
        use: [
          {
            loader: "bin-loader",
          },
        ],
      },
    ],
  },
};
