const path = require('path');
const webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: [
        "./index.js",
        "webpack-dev-server/client?http://localhost:8080/",
        "webpack/hot/dev-server"
    ],
    context: path.join(__dirname, './src'),
    output: {
        path: path.join(__dirname, './build'),
        filename: "bundle.js"
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("[name].css"),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                unused: true,
                dead_code: true,
                warnings: false,
                screw_ie8: true
            }
        }),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            '__DEV__': false
        }),
    ],
    module: {
        loaders: [{
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
                fallbackLoader: 'style-loader',
                loader: ['css', 'sass']
            })
        }, {
            test: /\.js?$/,
            exclude: /(node_modules|bower_components|public)/,
            loader: 'babel'
        }]
    }
};
