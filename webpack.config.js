const path = require('path');
const webpack = require('webpack');
module.exports = {
    devtool: 'eval',
    entry: [
        "./index.js",
        "webpack-dev-server/client?http://localhost:8080/",
        "webpack/hot/dev-server"
    ],
    context: path.join(__dirname, './src'),
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [{
            test: /\.scss$/,
            loaders: ["style", "css", "sass"]
        }, {
            test: /\.js?$/,
            exclude: /(node_modules|bower_components|public)/,
            loader: 'babel'
        }]
    }
};
