'use strict';

angular.module('ingresseEmulatorApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/producer', {
        templateUrl: 'views/emulator.html',
        controller: 'ProducerController'
      });
  })
  .controller('ProducerController', function ($scope, ingresseAPI, IngresseApiUserService, EmulatorService, QueryService) {
    $scope.request = {};

    $scope.$on('$viewContentLoaded', function () {
      $scope.credentials = IngresseApiUserService.credentials;
      // QueryService.getSearchParams($scope.fields);
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

    $scope.getProducerCustomerList = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.producerCustomers.identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields.producerCustomers);

      QueryService.setSearchParams('producerCustomers', $scope.fields.producerCustomers.identifier, filters);

      ingresseAPI.producer.getCustomerList(identifier, filters, $scope.credentials.token)
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

    $scope.getProducerSalesForCostumer = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = {
        producerId: $scope.fields.producerSalesForCustomers.identifier.model,
        costumerId: $scope.fields.producerSalesForCustomers.fields[0].model
      };

      var filters = $scope.getFiltersByTab($scope.fields.producerSalesForCustomers);

      QueryService.setSearchParams('producerSalesForCustomers', $scope.fields.producerSalesForCustomers.identifier, filters);

      ingresseAPI.producer.getSalesForCostumer(identifier, filters, $scope.credentials.token)
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

    $scope.getProducerCustomerProfile = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.producerCustomerProfile.identifier.model;

      QueryService.setSearchParams('producerCustomerProfile', $scope.fields.producerCustomerProfile.identifier, $scope.credentials.token);

      ingresseAPI.producer.getCustomerProfile(identifier, $scope.credentials.token)
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


    $scope.getSalesGroupReport = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.salesGroupReport.identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields.salesGroupReport);

      QueryService.setSearchParams('salesGroupReport', $scope.fields.salesGroupReport.identifier, filters);

      ingresseAPI.producer.getSalesGroupReport(identifier, filters, $scope.credentials.token)
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

    $scope.getSalesGroupPaymentReport = function () {
      $scope.result = {};
      $scope.isLoading = true;

      var identifier = $scope.fields.salesGroupPaymentReport.identifier.model;
      var filters = $scope.getFiltersByTab($scope.fields.salesGroupPaymentReport);

      QueryService.setSearchParams('salesGroupPaymentReport', $scope.fields.salesGroupPaymentReport.identifier, filters);

      ingresseAPI.producer.getSalesGroupPaymentReport(identifier, filters, $scope.credentials.token)
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

    $scope.getCustomerListCSVExportURL = function () {
      $scope.result = {};

      var identifier = $scope.fields.getCustomerListCSVExportURL.identifier.model;

      // QueryService.setSearchParams('getCustomerListCSVExportURL', $scope.fields.getCustomerListCSVExportURL.identifier);

      EmulatorService.addResponse({url: ingresseAPI.producer.getCustomerListCSVExportURL(identifier, $scope.credentials.token)}, true);
    };



    $scope.fields = {
      producerCustomers: {
        label: 'Costumer',
        action: $scope.getProducerCustomerList,
        authentication: true,
        identifier: {
          label: 'producerId',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'scorefrom',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'scoreto',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'event',
            model: '',
            type: 'number',
            disabled: false
          },
          {
            label: 'platform',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'classification',
            model: '',
            type: 'number',
            disabled: false
          }
        ]
      },
      producerSalesForCustomers: {
        label: 'Producer Sales for Costumer',
        action: $scope.getProducerSalesForCostumer,
        authentication: true,
        identifier: {
          label: 'producerId',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: [
          {
            label: 'costumerId',
            model: '',
            type: 'number',
            disabled: false,
            required: true
          },
          {
            label: 'page',
            model: '',
            type: 'number',
            disabled: false
          }
        ]
      },
      producerCustomerProfile: {
        label: 'CustomerProfile',
        action: $scope.getProducerCustomerProfile,
        authentication: true,
        identifier: {
          label: 'producerId',
          model: '',
          type: 'number',
          disabled: false,
          required: true
        },
        fields: []
      },
      salesGroupReport: {
        label: 'Sales Group Report',
        action: $scope.getSalesGroupReport,
        authentication: true,
        identifier: {
          label: 'producerId',
          model: '',
          type: 'number',
          disabled: false,
          required: true,
          requiredMessage: 'Producer Id is required'
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
          },
          {
            label: 'event',
            model: '',
            type: 'text',
            disabled: false
          },
          {
            label: 'session',
            model: '',
            type: 'number',
            disabled: false
          }
        ]
      },
      salesGroupPaymentReport: {
        label: 'Sales Group Payment Report',
        action: $scope.getSalesGroupPaymentReport,
        authentication: true,
        identifier: {
          label: 'producerId',
          model: '',
          type: 'number',
          disabled: false,
          required: true,
          requiredMessage: 'Producer Id is required'
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
          },
          {
            label: 'event',
            model: '',
            type: 'text',
            disabled: false
          }
        ]
      },
      getCustomerListCSVExportURL: {
        label: 'Customer List CSV Export',
        action: $scope.getCustomerListCSVExportURL,
        authentication: true,
        identifier: {
          label: 'producerId',
          model: '',
          type: 'number',
          disabled: false,
          required: true,
          requiredMessage: 'Producer Id is required'
        }
      }
    };
  });
