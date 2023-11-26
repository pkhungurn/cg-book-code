const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: "./src/index.js",
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                path.resolve(__dirname, "src", "index.html"),                                
            ]
        }),
    ],
    resolve: {
        extensions: ['.js'],
    },
    devtool: 'inline-source-map',
    target: 'web',
    mode: 'development',
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
}