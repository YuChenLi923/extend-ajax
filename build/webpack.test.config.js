const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base.config');
const hostname = 'localhost';
const port = 8081;
module.exports = merge(baseConfig, {
  entry: './test/index.js',
  resolve: {
    alias: {
      'extend-ajax': path.resolve(__dirname, '../dist/extend-ajax.js'),
    }
  },
  output: {
    filename: 'test.build.js',
    path: '/test'
  },
  devServer: {
    host: hostname,
    port: port
  },
  module: {
    rules: [
      {
        test: /.+\.test\.js?$/,
        use: 'mocha-loader',
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title:'extend-ajax',
      filename:'./index.html',
      template:'./test.html',
      hash:true
    })
  ]
});
