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

      var filters = QueryService.getFiltersByTab($scope.fields.recoverPassword);

      QueryService.setSearchParams('recoverPassword', $scope.fields.recoverPassword.identifier, filters);

      ingresseAPI.recover.recoverPassword(filters)
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

    $scope.validateHash = function () {
      $scope.isLoading = true;

      var filters = QueryService.getFiltersByTab($scope.fields.validateHash);

      QueryService.setSearchParams('validateHash', $scope.fields.validateHash.identifier, filters);

      ingresseAPI.recover.validateHash(filters)
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

    $scope.updatePassword = function () {
      $scope.isLoading = true;

      var filters = QueryService.getFiltersByTab($scope.fields.updatePassword);

      QueryService.setSearchParams('updatePassword', $scope.fields.updatePassword.identifier, filters);

      ingresseAPI.recover.updatePassword(filters)
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
        fields: [
          {
            label: 'email',
            model: '',
            type: 'text',
            disabled: false,
            required: true
          }
        ]
      },
      validateHash: {
        label: 'Validate Password Hash',
        action: $scope.validateHash,
        fields: [
          {
            label: 'email',
            model: '',
            type: 'text',
            disabled: false,
            required: true
          },
          {
            label: 'hash',
            model: '',
            type: 'text',
            disabled: false,
            required: true
          }
        ]
      },
      updatePassword: {
        label: 'Update Password',
        action: $scope.updatePassword,
        fields: [
          {
            label: 'email',
            model: '',
            type: 'text',
            disabled: false,
            required: true
          },
          {
            label: 'hash',
            model: '',
            type: 'text',
            disabled: false,
            required: true
          },
          {
            label: 'password',
            model: '',
            type: 'text',
            disabled: false,
            required: true
          }
        ]
      }
    };
  });
