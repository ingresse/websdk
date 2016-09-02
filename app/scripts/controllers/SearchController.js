'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/search', {
        templateUrl: 'views/emulator.html',
        controller: 'SearchController',
        reloadOnSearch: false
      });
  })
  .controller('SearchController', function ($scope, $rootScope, ingresseAPI,
      IngresseApiUserService, $routeParams, EmulatorService, QueryService) {
    $scope.request = {};

    $scope.$on('$viewContentLoaded', function () {
      $scope.credentials = IngresseApiUserService.credentials;
      QueryService.getSearchParams($scope.fields);
    });

    /**
     * Searchs the users for transfer tickets
     */
    $scope.searchUserTransfer = function () {
      var term = $scope.fields.searchUserTransfer.identifier.model;
      var filters = QueryService.getFiltersByTab($scope.fields.searchUserTransfer);

      filters.term = term;

      $scope.isLoading = true;

      ingresseAPI.search.getUserTransfer(filters, $scope.credentials.token)
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
      searchUserTransfer: {
        label: 'searchUserTransfer',
        action: $scope.searchUserTransfer,
        authentication: true,
        identifier: {
          label: 'term',
          model: '',
          type: 'text',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'size',
            type: 'number',
            model: '',
            disabled: false
          }
        ]
      }
    };
  });
