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

     $scope.send = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var filters = QueryService.getFilters($scope.fields.send.fields);
      var postParams = QueryService.getFilters($scope.fields.send.postParams);

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
