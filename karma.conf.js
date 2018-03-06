var webpackConfig = require('./build/webpack.test.config'),
    customSever = require('./test/server/index'),
    bodyParser = function () {
      return require('body-parser')();
    },
    isTravis = process.env.TRAVIS || false;
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'test/index.js'
    ],
    exclude: [],
    preprocessors: {
      'test/index.js': ['webpack', 'coverage'],
      '*.js': ['coverage']
    },
    plugins: [
      'karma-coveralls',
      'karma-opera-launcher',
      'karma-firefox-launcher',
      'karma-chrome-launcher',
      'karma-webpack',
      'karma-coverage',
      'karma-jasmine',
      'karma-ie-launcher',
      {'middleware:body-parser': ['factory', bodyParser]},
      {'middleware:custom-server': ['factory', customSever]}
    ],
    middleware: ['body-parser', 'custom-server'],
    reporters: ['coverage', 'coveralls'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: !isTravis,
    singleRun: isTravis,
    browsers: isTravis ? ['Firefox'] : ['Chrome', 'IE', 'Firefox'],
    customDebugFile: 'test/debug.html',
    customContextFile: 'test/context.html',
    customHeaders: [{
      match: '.{1,}',
      name: 'X-Frame-Options',
      value: 'SAMEORIGIN'
    }],
    concurrency: Infinity,
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: false
    }
  });
};
