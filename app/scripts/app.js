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
  .config(function ($routeProvider, ingresseAPI_PreferencesProvider) {
    // ingresseAPI_PreferencesProvider.setPublicKey('yourkey');
    // ingresseAPI_PreferencesProvider.setPrivateKey('yourkey');
    ingresseAPI_PreferencesProvider.setTemplateDirectory('/bower_components/ingresse-websdk/directives/');

    $routeProvider
      .when('/event/', {
        templateUrl: 'views/event.html',
        controller: 'EventController'
      })
      .when('/event/:id', {
        templateUrl: 'views/event.html',
        controller: 'EventController'
      })
      .when('/user', {
        templateUrl: 'views/user.html',
        controller: 'EmulatorController'
      })
      .when('/tickets/:eventid', {
        templateUrl: 'views/ticket.html',
        controller: 'EmulatorController'
      })
      .when('/report', {
        templateUrl: 'views/report-checkin.html',
        controller: 'EmulatorController'
      })
      .when('/transaction', {
        templateUrl: 'views/transaction.html',
        controller: 'EmulatorController'
      })
      .when('/error', {
        templateUrl: 'views/error.html',
        controller: 'EmulatorController'
      })
      .when('/sale', {
        templateUrl: 'views/freepass.html',
        controller: 'EmulatorController'
      })
      .otherwise({
        redirectTo: '/event'
      });
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
