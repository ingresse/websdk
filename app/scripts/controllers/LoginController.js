'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/emulator.html',
        controller: 'LoginController'
      });
  })
  .controller('LoginController', function ($scope, ingresseAPI, IngresseApiUserService, EmulatorService, QueryService) {
    $scope.request = {};

    $scope.$on('$viewContentLoaded', function () {
      $scope.credentials = IngresseApiUserService.credentials;
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

    $scope.direct = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var filters = $scope.getFiltersByTab($scope.fields.direct);

      QueryService.setSearchParams('direct', $scope.fields.direct.identifier, filters);

      ingresseAPI.login.direct(filters)
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

    $scope.facebook = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var filters = $scope.getFiltersByTab($scope.fields.facebook);

      QueryService.setSearchParams('facebook', $scope.fields.facebook.identifier, filters);

      ingresseAPI.login.facebook(filters)
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
      direct: {
        label: 'direct',
        action: $scope.direct,
        authentication: false,
        fields: [
          {
            label: 'email',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'password',
            model: '',
            type: 'text',
            disabled: false
          }
        ]
      },
      facebook: {
        label: 'facebook',
        action: $scope.facebook,
        authentication: false,
        fields: [
          {
            label: 'email',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'fbUserId',
            model: '',
            type: 'text',
            disabled: false
          }
        ]
      }
    };
  });
