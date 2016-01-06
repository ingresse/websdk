module.exports = function (config) {
  'use strict';

  config.set({
    basePath: '../',
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      './bower_components/angular/angular.js',
      './bower_components/angular-mocks/angular-mocks.js',
      './bower_components/pagar-me/index.js',
      './app/scripts/ingresseAPI.Preferences.js',
      './app/scripts/ingresseAPI.js',
      '../test/spec/**/*.js'
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
      dir : './test/coverage/',
      reporters: [{
        type: 'html',
        subdir: 'report-html'
      }, {
        type: 'lcov',
        subdir: 'report-lcov'
      }]
    }
  });
};

