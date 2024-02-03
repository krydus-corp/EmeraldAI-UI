const webpack = require("webpack")
const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {}
  Object.assign(fallback, {
    path: require.resolve("path"),
    fs: false,
  })
  config.resolve.fallback = fallback
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "node_modules/web-tree-sitter/tree-sitter.wasm",
          to: "static/js",
        },
        {
          from: "node_modules/curlconverter/dist/tree-sitter-bash.wasm",
          to: "",
        },
      ],
    }),
  ])

  config.experiments = {
    topLevelAwait: true,
    asyncWebAssembly: true,
  }
  return config
}
