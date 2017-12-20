var webpackConfig = require('./build/webpack.test.config'),
    customSever = require('./test/server/index'),
    bodyParser = function () {
      return require('body-parser')();
    },
    isTravis = process.env.TRAVIS || false;
module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],
    // list of files / patterns to load in the browser
    files: [
      'test/index.js'
    ],
    // list of files to exclude
    exclude: [],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
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
    browsers: isTravis ? ['Chrome'] : ['Chrome', 'IE', 'Firefox', 'Opera'],
    customDebugFile: 'test/debug.html',
    customContextFile: 'test/context.html',
    customHeaders: [{
      match: '.{1,}',
      name: 'X-Frame-Options',
      value: 'SAMEORIGIN'
    }],
    concurrency: Infinity,
    webpack: webpackConfig,
    webpackMiddleware:{
      noInfo: false
    }
  })
};
