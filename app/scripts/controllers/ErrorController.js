'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/error', {
        templateUrl: 'views/emulator.html',
        controller: 'ErrorController'
      });
  })
  .controller('ErrorController', function ($scope, ingresseAPI, EmulatorService, QueryService) {
    $scope.$on('$viewContentLoaded', function () {
      $scope.request = {};
      QueryService.getSearchParams($scope.fields);
    });

    $scope.getFiltersByTab = function (tab) {
      var obj = {};
      var i, day, month, year;

      for (i = tab.fields.length - 1; i >= 0; i--) {
        if (tab.fields[i].model) {
          if (tab.fields[i].type === 'date') {
            day = tab.fields[i].model.getDate().toString();
            month = tab.fields[i].model.getMonth().toString();
            if (month.length < 2) {
              month = '0' + month;
            }
            year = tab.fields[i].model.getFullYear().toString();
            obj[tab.fields[i].label] = year + '-' + month + '-' + day;
          } else {
            obj[tab.fields[i].label] = tab.fields[i].model;
          }
        }
      }

      return obj;
    };

    $scope.getError = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.error.identifier.model;

      QueryService.setSearchParams('error', $scope.fields.error.identifier);

      ingresseAPI.getError(identifier)
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
      error: {
        label: 'Error',
        action: $scope.getError,
        authentication: false,
        identifier: {
          label: 'errorClass',
          model: '',
          type: 'number',
          disabled: false
        },
        fields: []
      }
    };
  });
