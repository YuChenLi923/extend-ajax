const path = require('path');
module.exports = {
  resolve: {
    extensions: ['.ts', ".js"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  }
};
