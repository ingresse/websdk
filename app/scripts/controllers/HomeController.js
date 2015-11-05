'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'views/emulator.html',
        controller: 'HomeController',
        reloadOnSearch: false
      });
  })
  .controller('HomeController', function ($scope, ingresseAPI, EmulatorService, QueryService) {
    $scope.$on('$viewContentLoaded', function () {
      $scope.request = {};
      QueryService.getSearchParams($scope.fields);
    });

    $scope.getSections = function () {
      $scope.result = {};
      $scope.isLoading = true;

      ingresseAPI.home.getSections()
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

    $scope.getCover = function () {
      $scope.result = {};
      $scope.isLoading = true;

      ingresseAPI.home.getCover()
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
      sections: {
        label: 'sections',
        action: $scope.getSections,
        authentication: false
      },
      cover: {
        label: 'cover',
        action: $scope.getCover,
        authentication: false
      }
    };
  });
