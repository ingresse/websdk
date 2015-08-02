'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/emulator.html',
        controller: 'RootController'
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
