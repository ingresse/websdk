'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/featured', {
        templateUrl: 'views/emulator.html',
        controller: 'FeaturedController',
        reloadOnSearch: false
      });
  })
  .controller('FeaturedController', function ($scope, ingresseAPI, EmulatorService, QueryService) {
    $scope.$on('$viewContentLoaded', function () {
      $scope.request = {};
      QueryService.getSearchParams($scope.fields);
    });

    $scope.getFeatured = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var filters = QueryService.getFiltersByTab($scope.fields.featured);

      ingresseAPI.getFeaturedEvents(filters)
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
      featured: {
        label: 'Featured',
        action: $scope.getFeatured,
        authentication: false,
        fields: [
          {
            label: 'state',
            model: 'sp',
            type: 'text',
            disabled: false
          },
        ]
      }
    };
  });
