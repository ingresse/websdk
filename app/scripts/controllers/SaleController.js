'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/sale', {
        templateUrl: 'views/emulator.html',
        controller: 'SaleController'
      });
  })
  .controller('SaleController', function ($scope, ingresseAPI, IngresseApiUserService, EmulatorService, QueryService) {
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

    $scope.getTransaction = function () {
      $scope.isLoading = true;

      var identifier = $scope.fields.transaction.identifier.model;

      QueryService.setSearchParams('transaction', $scope.fields.transaction.identifier);

      ingresseAPI.sale.get(identifier, $scope.credentials.token)
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

    $scope.getReport = function () {
      $scope.isLoading = true;

      var filters = $scope.getFiltersByTab($scope.fields.sales);

      QueryService.setSearchParams('sales', null, filters);

      ingresseAPI.sale.getReport(filters, $scope.credentials.token)
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

    $scope.refund = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.refund.identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields.refund);

      QueryService.setSearchParams('refund', $scope.fields.refund.identifier, filters);

      ingresseAPI.sale.refund(identifier, filters, $scope.credentials.token)
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
      transaction: {
        label: 'Sale',
        action: $scope.get,
        authentication: true,
        identifier: {
          label: 'transactionId',
          model: '',
          type: 'text',
          disabled: false,
          required: true
        },
        fields: []
      },
      refund: {
        label: 'Refund',
        action: $scope.refund,
        authentication: true,
        identifier: {
          label: 'transactionId',
          model: '',
          type: 'text',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'reason',
            model: '',
            type: 'text',
            disabled: false,
            required: true
          }
        ]
      },
      sales: {
        label: 'Sales',
        action: $scope.getReport,
        authentication: true,
        identifier: null,
        fields: [
          {
            label: 'id',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'channel',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'event',
            model: '',
            type: 'number',
            required: true,
            disabled: false
          },
          {
            label: 'session',
            model: '',
            type: 'text',
            required: true,
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
          },
          {
            label: 'status',
            model: '',
            type: 'option',
            options: ['approved', 'declined', 'pending'],
            disabled: false
          },
          {
            label: 'term',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'operator',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'paymentoption',
            model: '',
            type: 'option',
            options: ['tdb', 'bankBillet', 'bankCheck', 'creditCard', 'debitCard', 'free', 'money', 'other', 'payPal', 'wireTransfer'],
            disabled: false
          }
        ]
      }
    };
  });
