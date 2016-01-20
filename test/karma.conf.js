module.exports = function (config) {
  'use strict';

  config.set({
    basePath: '../app',
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      '../bower_components/angular/angular.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      '../bower_components/pagar-me/index.js',
      './scripts/IngresseAPI.Preferences.js',
      './scripts/IngresseAPI.js',
      './scripts/services/{,*/}*.js',
      './scripts/constants/{,*/}*.js',
      '../test/spec/{,*/}*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    browsers: [
      'PhantomJS'
    ],

    // Coverage
    reporters: ['mocha', 'coverage'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    preprocessors: {
      './app/scripts/{,*/}*.js': ['coverage']
    },

    logLevel: config.LOG_INFO,

    coverageReporter: {
      dir : '../test/coverage/',
      reporters: [{
        type: 'lcov',
        subdir: 'report-lcov'
      }, {
        type: 'text'
      }, {
        type: 'text-summary'
      }]
    }
  });
};

