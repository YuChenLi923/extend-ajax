const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
module.exports = merge(baseConfig, {
  entry: '/src/index.ts',
  output: {
    filename: 'extend-ajax.js'
  },
  module: {
    unknownContextCritical: false
  }
});
