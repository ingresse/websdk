'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/freepass', {
        templateUrl: 'views/emulator.html',
        controller: 'FreepassController',
        reloadOnSearch: false
      });
  })
  .controller('FreepassController', function ($scope, ingresseAPI, EmulatorService, QueryService, IngresseApiUserService) {

    $scope.$on('$viewContentLoaded', function () {
      $scope.credentials = IngresseApiUserService.credentials;
      QueryService.getSearchParams($scope.fields);
      $scope.isMethodSelectionHidden = true;
      QueryService.setSelectedTab('send');
    });

    $scope.getFilters = function (fields) {
      var obj = {};
      var i, day, month, year;

      for (i = fields.length - 1; i >= 0; i--) {
        if (fields[i].model) {
          if (fields[i].type === 'date') {
            day = fields[i].model.getDate().toString();
            month = fields[i].model.getMonth().toString();
            if (month.length < 2) {
              month = '0' + month;
            }
            year = fields[i].model.getFullYear().toString();
            obj[fields[i].label] = year + '-' + month + '-' + day;
          } else {
            obj[fields[i].label] = fields[i].model;
          }
        }
      }

      return obj;
    };

     $scope.send = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var filters = $scope.getFilters($scope.fields.send.fields);
      var postParams = $scope.getFilters($scope.fields.send.postParams);

      QueryService.setSearchParams('send', null, filters);

      ingresseAPI.freepass.send(filters, postParams, $scope.credentials.token)
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
      send: {
        label: 'send',
        action: $scope.send,
        authentication: true,
        fields: [
          {
            label: 'verify',
            model: '',
            type: 'checkbox',
            disabled: false
          }
        ],
        postParams: [
          {
            label: 'eventId',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'emails',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'ticketTypeId',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'halfPrice',
            model: '',
            type: 'checkbox',
            disabled: false
          }
        ]
      }
    };
  });
