'use strict';

/**
 * @ngdoc overview
 * @name ingresseEmulatorApp
 * @description
 * # ingresseEmulatorApp
 *
 * Main module of the application.
 */
var app = angular
  .module('ingresseEmulatorApp', [
    'ngAnimate',
    'ipCookie',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ingresseSDK',
    'gd.ui.jsonexplorer',
    'ingresse.emulator',
    'ngMaterial'
  ])
  .config(function ($routeProvider, ingresseAPI_PreferencesProvider, $mdThemingProvider) {
    ingresseAPI_PreferencesProvider.setTemplateDirectory('directives/');

    $routeProvider
      .when('/event/', {
        templateUrl: 'views/emulator.html',
        controller: 'EventController'
      })
      .when('/user', {
        templateUrl: 'views/emulator.html',
        controller: 'UserController'
      })
      .when('/sale', {
        templateUrl: 'views/emulator.html',
        controller: 'SaleController'
      })
      .when('/error', {
        templateUrl: 'views/emulator.html',
        controller: 'ErrorController'
      })
      .when('/dashboard', {
        templateUrl: 'views/emulator.html',
        controller: 'DashboardController'
      })
      .otherwise({
        redirectTo: '/event'
      });

      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');
  });


angular.module('ingresseEmulatorApp').filter('momentum', function() {
  return function(input,format) {
    var momentDate = moment(input);
    var output = null;
    if(format) {
      output = momentDate.format(format);
      return output;
    }

    output = momentDate.format('DD/MM/YYYY');
    return output
  };
});
