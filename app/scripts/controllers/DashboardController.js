'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'views/emulator.html',
        controller: 'DashboardController',
        reloadOnSearch: false
      });
  })
  .controller('DashboardController', function ($scope, ingresseAPI, IngresseApiUserService, EmulatorService, QueryService) {
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

    $scope.getVisitsReport = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.visitsReport.identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields.visitsReport);

      QueryService.setSearchParams('visitsReport', $scope.fields.visitsReport.identifier, filters);

      ingresseAPI.dashboard.getVisitsReport(identifier, filters, $scope.credentials.token)
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

    $scope.getEventSalesTimeline = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.getEventSalesTimeline.identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields.getEventSalesTimeline);

      QueryService.setSearchParams('getEventSalesTimeline', $scope.fields.getEventSalesTimeline.identifier, filters);

      ingresseAPI.dashboard.getEventSalesTimeline(identifier, filters, $scope.credentials.token)
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

    $scope.getEventReport = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.getEventReport.identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields.getEventReport);

      QueryService.setSearchParams('getEventReport', $scope.fields.getEventReport.identifier, filters);

      ingresseAPI.dashboard.getEventReport(identifier, filters, $scope.credentials.token)
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
      visitsReport: {
        label: 'Visits Report',
        action: $scope.getVisitsReport,
        authentication: true,
        identifier: {
          label: 'eventId',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'from',
            model: '',
            type: 'date',
            disabled: false
          },
          {
            label: 'to',
            model: '',
            type: 'date',
            disabled: false
          }
        ]
      },
      getEventSalesTimeline: {
        label: 'Event Sales Timeline',
        action: $scope.getEventSalesTimeline,
        authentication: true,
        identifier: {
          label: 'eventId',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'channel',
            model: '',
            type: 'option',
            options: ['online', 'offline'],
            disabled: false
          },
          {
            label: 'session',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'from',
            model: '',
            type: 'date',
            disabled: false
          },
          {
            label: 'to',
            model: '',
            type: 'date',
            disabled: false
          }
        ]
      },
      getEventReport: {
        label: 'Event Report',
        action: $scope.getEventReport,
        authentication: true,
        identifier: {
          label: 'eventId',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'channel',
            model: '',
            type: 'option',
            options: ['online', 'offline'],
            disabled: false
          },
          {
            label: 'session',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'from',
            model: '',
            type: 'date',
            disabled: false
          },
          {
            label: 'to',
            model: '',
            type: 'date',
            disabled: false
          }
        ]
      }
    };
  });
