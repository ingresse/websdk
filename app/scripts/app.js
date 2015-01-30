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
    'ngCookies',
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
    // ingresseAPI_PreferencesProvider.setTemplateDirectory('/bower_components/ingresse-websdk/directives/');

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
