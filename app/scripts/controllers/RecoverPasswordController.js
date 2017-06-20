'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/recover', {
        templateUrl: 'views/emulator.html',
        controller: 'RecoverPasswordController',
        reloadOnSearch: false
      });
  })
  .controller('RecoverPasswordController', function ($scope, ingresseAPI, EmulatorService, QueryService) {
    $scope.request = {};

    $scope.$on('$viewContentLoaded', function () {
      QueryService.getSearchParams($scope.fields);
    });

    $scope.recoverPassword = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.recoverPassword.identifier.model;

      QueryService.setSearchParams('recoverPassword', $scope.fields
        .recoverPassword.identifier, filters);

      ingresseAPI.recover.recoverPassword(identifier)
        .then(function (response) {
          EmulatorService.addResponse(response, true);
        })
        .catch(function (error) {
          EmulatorService.addResponse(error, false);
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    };

    $scope.fields = {
      recoverPassword: {
        label: 'Recover Password',
        action: $scope.recoverPassword,
        identifier: {
          label: 'email',
          model: '',
          type: 'text',
          disabled: false,
          required: true
        },
        fields: []
      }
    };
  });
