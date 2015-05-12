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
    'venusUI'
  ])
  .config(function ($routeProvider, ingresseAPI_PreferencesProvider) {
    // ingresseAPI_PreferencesProvider.setPublicKey('yourkey');
    // ingresseAPI_PreferencesProvider.setPrivateKey('yourkey');
    ingresseAPI_PreferencesProvider.setTemplateDirectory('/bower_components/ingresse-websdk/directives/');

    $routeProvider
      .when('/event/', {
        templateUrl: 'views/event.html',
        controller: 'EmulatorController'
      })
      .when('/user', {
        templateUrl: 'views/user.html',
        controller: 'EmulatorController'
      })
      .when('/ticket', {
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
