'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/salesgroup', {
        templateUrl: 'views/emulator.html',
        controller: 'SalesGroupController',
        reloadOnSearch: false
      });
  })
  .controller('SalesGroupController', function ($scope, ingresseAPI, IngresseApiUserService, EmulatorService, QueryService) {
    $scope.$on('$viewContentLoaded', function () {
      $scope.credentials = IngresseApiUserService.credentials;
      QueryService.getSearchParams($scope.fields);
    });

    $scope.get = function () {
      $scope.isLoading = true;

      var filters = $scope.getFiltersByTab($scope.fields.salesgroup);

      QueryService.setSearchParams('salesgroup', null, filters);

      ingresseAPI.salesgroup.get(filters, $scope.credentials.token)
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
      salesgroup: {
        label: 'SalesGroup',
        action: $scope.get,
        authentication: true,
        identifier: null,
        fields: [
          {
            label: 'id',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'term',
            model: '',
            type: 'text',
            disabled: false
          }
        ]
      }
    };
  });
