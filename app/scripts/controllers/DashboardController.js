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

    $scope.getVisitsReport = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.visitsReport.identifier.model;
      var filters = QueryService.getFiltersByTab($scope.fields.visitsReport);

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
      var filters = QueryService.getFiltersByTab($scope.fields.getEventSalesTimeline);

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

    $scope.getTransactionsReport = function() {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.getTransactionsReport.identifier.model;
      var filters = QueryService.getFiltersByTab($scope.fields.getTransactionsReport);

      QueryService.setSearchParams('getTransactionsReport', $scope.fields.getEventReport.identifier, filters);

      ingresseAPI.dashboard.getTransactionsReport(identifier, filters, $scope.credentials.token)
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
      var filters = QueryService.getFiltersByTab($scope.fields.getEventReport);

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

    $scope.getSalesCalendarReport = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.getSalesCalendarReport.identifier.model;
      var filters = QueryService.getFiltersByTab($scope.fields.getSalesCalendarReport);

      QueryService.setSearchParams('getSalesCalendarReport', $scope.fields.getSalesCalendarReport.identifier, filters);

      ingresseAPI.dashboard.getSalesCalendarReport(identifier, filters, $scope.credentials.token)
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

    $scope.getCashFlowReport = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.getCashFlowReport.identifier.model;
      var filters = QueryService.getFiltersByTab($scope.fields.getCashFlowReport);

      QueryService.setSearchParams('getCashFlowReport', $scope.fields.getCashFlowReport.identifier, filters);

      ingresseAPI.dashboard.getCashFlowReport(identifier, filters, $scope.credentials.token)
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

    $scope.getPaymentReport = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.getPaymentReport.identifier.model;
      var filters = QueryService.getFiltersByTab($scope.fields.getPaymentReport);

      QueryService.setSearchParams('getPaymentReport', $scope.fields.getPaymentReport.identifier, filters);

      ingresseAPI.dashboard.getPaymentReport(identifier, filters, $scope.credentials.token)
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
      },
      getSalesCalendarReport: {
        label: 'Sales Calendar Report',
        action: $scope.getSalesCalendarReport,
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
            label: 'session',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'begin',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'end',
            model: '',
            type: 'text',
            disabled: false
          }
        ]
      },
      getCashFlowReport: {
        label: 'Cash Flow Report',
        action: $scope.getCashFlowReport,
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
            label: 'session',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'begin',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'end',
            model: '',
            type: 'text',
            disabled: false
          }
        ]
      },
      getPaymentReport: {
        label: 'Payment Report',
        action: $scope.getPaymentReport,
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
            label: 'session',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'begin',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'end',
            model: '',
            type: 'text',
            disabled: false
          }
        ]
      },
      getTransactionsReport: {
        label: 'Transactions Report',
        action: $scope.getTransactionsReport,
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
      }
    };
  });
