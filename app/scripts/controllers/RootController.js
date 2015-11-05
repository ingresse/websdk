'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/emulator.html',
        controller: 'RootController',
        reloadOnSearch: false
      });
  })
  .controller('RootController', function ($scope, $rootScope, ingresseAPI, IngresseApiUserService, $routeParams, EmulatorService, QueryService) {
    $scope.request = {};

    $scope.$on('$viewContentLoaded', function () {
      $scope.credentials = IngresseApiUserService.credentials;
      QueryService.getSearchParams($scope.fields);
      QueryService.setSelectedTab('eventCategory');
      $scope.isMethodSelectionHidden = true;
    });

    $scope.getEventCategory = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.eventCategory.identifier.model;

      ingresseAPI.getEventCategory(identifier)
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
      eventCategory: {
        label: '/',
        action: $scope.getEventCategory,
        authentication: false,
        identifier: {
          label: 'list',
          model: '',
          type: 'text',
          disabled: false,
          required: true
        },
        fields: []
      }
    };
  });
