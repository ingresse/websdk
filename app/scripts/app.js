'use strict';

/**
 * @ngdoc overview
 * @name ingresseEmulatorApp
 * @description
 * # ingresseEmulatorApp
 *
 * Main module of the application.
 */
angular.module('ingresseEmulatorApp', [
  'ngAnimate',
  'ipCookie',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ingresseSDK',
  'ngJsonExplorer',
  'ingresse.emulator',
  'ngMaterial',
  'ngMessages'
])
  .config(function (ingresseApiPreferencesProvider, $mdThemingProvider) {
    ingresseApiPreferencesProvider.setTemplateDirectory('directives/');

    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('orange');
  });


angular.module('ingresseEmulatorApp').filter('momentum', function () {
  return function (input, format) {
    var momentDate = moment(input);
    var output = null;
    if(format) {
      output = momentDate.format(format);
      return output;
    }

    output = momentDate.format('DD/MM/YYYY');
    return output;
  };
});
